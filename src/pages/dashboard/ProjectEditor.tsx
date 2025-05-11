
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { Save, ChevronLeft, Tag, Github, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getProject, createProject, updateProject } from "@/services/supabase-service";
import { ProjectType } from "@/data/projects";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!!id);
  
  const emptyForm: Omit<ProjectType, "id"> = {
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    image: "",
    tags: [],
    link: "",
    github: "",
    featured: false,
    technologies: [],
    year: new Date().getFullYear().toString()
  };
  
  const [formData, setFormData] = useState<Omit<ProjectType, "id">>(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [techInput, setTechInput] = useState("");
  
  // Fetch project data if editing
  const { isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id as string),
    enabled: !!id,
    onSuccess: (data) => {
      setFormData({
        title: data.title,
        titleAr: data.titleAr,
        description: data.description,
        descriptionAr: data.descriptionAr,
        image: data.image,
        tags: [...data.tags],
        link: data.link || "",
        github: data.github || "",
        featured: data.featured,
        technologies: [...data.technologies],
        year: data.year
      });
    },
    onError: (error) => {
      toast({
        title: language === "en" ? "Project not found" : "لم يتم العثور على المشروع",
        description: language === "en" 
          ? "The project you're trying to edit does not exist" 
          : "المشروع الذي تحاول تعديله غير موجود",
        variant: "destructive"
      });
      navigate("/dashboard/projects");
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDescriptionChange = (description: string) => {
    setFormData(prev => ({ ...prev, description }));
  };
  
  const handleDescriptionArChange = (descriptionAr: string) => {
    setFormData(prev => ({ ...prev, descriptionAr }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // File upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `project-images/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
        
      setFormData(prev => ({ ...prev, image: publicUrl }));
      
      toast({
        title: language === "en" ? "Image uploaded" : "تم رفع الصورة",
        description: language === "en" ? "Image has been uploaded successfully" : "تم رفع الصورة بنجاح",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: language === "en" ? "Upload failed" : "فشل الرفع",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };
  
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
      setTechInput("");
    }
  };
  
  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: language === "en" ? "Project created" : "تم إنشاء المشروع",
        description: language === "en" 
          ? "Your project has been created successfully" 
          : "تم إنشاء المشروع بنجاح",
      });
      navigate("/dashboard/projects");
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en"
          ? "Failed to create project. Please try again."
          : "فشل في إنشاء المشروع. الرجاء المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<ProjectType> }) => 
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast({
        title: language === "en" ? "Project updated" : "تم تحديث المشروع",
        description: language === "en" 
          ? "Your project has been updated successfully" 
          : "تم تحديث المشروع بنجاح",
      });
      navigate("/dashboard/projects");
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en"
          ? "Failed to update project. Please try again."
          : "فشل في تحديث المشروع. الرجاء المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && id) {
      updateMutation.mutate({ id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isLoading = isLoadingProject;

  if (isLoading) {
    return (
      <DashboardLayout
        title={language === "en" ? "Loading..." : "جار التحميل..."}
        breadcrumbs={[
          { label: language === "en" ? "Projects" : "المشاريع", href: "/dashboard/projects" }
        ]}
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={isEditing 
        ? (language === "en" ? "Edit Project" : "تعديل المشروع")
        : (language === "en" ? "Create New Project" : "إنشاء مشروع جديد")
      }
      breadcrumbs={[
        { label: language === "en" ? "Projects" : "المشاريع", href: "/dashboard/projects" },
        { 
          label: isEditing 
            ? (language === "en" ? "Edit Project" : "تعديل المشروع")
            : (language === "en" ? "New Project" : "مشروع جديد"),
          href: isEditing ? `/dashboard/projects/editor/${id}` : "/dashboard/projects/editor"
        }
      ]}
    >
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/projects")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {language === "en" ? "Back to Projects" : "العودة إلى المشاريع"}
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="english">
                  <TabsList className="mb-6">
                    <TabsTrigger value="english">English</TabsTrigger>
                    <TabsTrigger value="arabic">العربية</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="english" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Project title"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <RichTextEditor 
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Describe your project..."
                        height={300}
                        dir="ltr"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="arabic" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titleAr">العنوان</Label>
                      <Input 
                        id="titleAr" 
                        name="titleAr" 
                        value={formData.titleAr}
                        onChange={handleInputChange}
                        placeholder="عنوان المشروع"
                        dir="rtl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="descriptionAr">الوصف</Label>
                      <RichTextEditor 
                        value={formData.descriptionAr}
                        onChange={handleDescriptionArChange}
                        placeholder="قم بوصف مشروعك..."
                        height={300}
                        dir="rtl"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Project Image</Label>
                  {formData.image && (
                    <div className="relative mb-4 rounded-md overflow-hidden">
                      <img 
                        src={formData.image} 
                        alt={language === "en" ? "Project image" : "صورة المشروع"}
                        className="w-full h-32 object-cover" 
                      />
                    </div>
                  )}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="imageUpload" className="cursor-pointer bg-muted hover:bg-muted/80 text-center py-2 rounded-md transition-colors">
                      {language === "en" ? "Upload new image" : "رفع صورة جديدة"}
                    </Label>
                    <Input 
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Input 
                      id="image" 
                      name="image" 
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder={language === "en" ? "Or enter image URL" : "أو أدخل رابط الصورة"}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured Project</Label>
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input 
                    id="year" 
                    name="year" 
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="2023"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="link">Project Link</Label>
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="link" 
                      name="link" 
                      value={formData.link}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Repository</Label>
                  <div className="flex items-center space-x-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="github" 
                      name="github" 
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    <Label htmlFor="tags">Tags</Label>
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      id="tagInput" 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={addTag}
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} &times;
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="techInput" 
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="Add a technology"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={addTechnology}
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.technologies.map((tech) => (
                      <Badge 
                        key={tech} 
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => removeTechnology(tech)}
                      >
                        {tech} &times;
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between p-6 border-t">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate("/dashboard/projects")}
                  disabled={isSubmitting}
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </Button>
                
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {language === "en" ? "Saving..." : "جار الحفظ..."}
                    </span>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {language === "en" ? "Save Project" : "حفظ المشروع"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default ProjectEditor;
