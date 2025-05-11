import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  
  // Find project data if editing
  const { isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id as string),
    enabled: !!id,
    onSettled: (data, error) => {
      if (data) {
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
      }
      
      if (error) {
        console.error("Error fetching project:", error);
        
        toast({
          title: language === "en" ? "Project not found" : "لم يتم العثور على المشروع",
          description: language === "en" 
            ? "The project you're trying to edit does not exist" 
            : "المشروع الذي تحاول تعديله غير موجود",
          variant: "destructive"
        });
        
        navigate("/dashboard/projects");
      }
    }
  });
  
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && id) {
      updateMutation.mutate({ id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const submitting = createMutation.isPending || updateMutation.isPending;
  
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
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Brief description of the project"
                        rows={3}
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
                      <Textarea
                        id="descriptionAr"
                        name="descriptionAr"
                        value={formData.descriptionAr}
                        onChange={handleInputChange}
                        placeholder="وصف موجز للمشروع"
                        rows={3}
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
                  <Label htmlFor="image">Image URL</Label>
                  <Input 
                    id="image" 
                    name="image" 
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Image URL"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input 
                    id="year" 
                    name="year" 
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="Year"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="link">Link</Label>
                  <Input 
                    id="link" 
                    name="link" 
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="Project link"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input 
                    id="github" 
                    name="github" 
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="GitHub link"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="featured">Featured</Label>
                  <Input 
                    id="featured" 
                    name="featured" 
                    type="checkbox"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                  />
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
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    <Label htmlFor="technologies">Technologies</Label>
                  </div>
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
                        variant="secondary"
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
                  disabled={submitting}
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </Button>
                
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
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
