
import { useState, useEffect } from "react";
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
import { projects } from "@/data/projects";
import { Save, ChevronLeft, Tag, Github, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  featured: boolean;
  technologies: string[];
  year: string;
}

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!!id);
  
  const emptyForm: FormData = {
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
  
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [techInput, setTechInput] = useState("");
  
  // Find project data if editing
  useEffect(() => {
    if (id) {
      const project = projects.find(p => p.id === id);
      if (project) {
        setFormData({
          title: project.title,
          titleAr: project.titleAr,
          description: project.description,
          descriptionAr: project.descriptionAr,
          image: project.image,
          tags: [...project.tags],
          link: project.link || "",
          github: project.github || "",
          featured: project.featured,
          technologies: [...project.technologies],
          year: project.year
        });
      } else {
        // Project not found
        navigate("/dashboard/projects");
        toast({
          title: language === "en" ? "Project not found" : "لم يتم العثور على المشروع",
          description: language === "en" 
            ? "The project you're trying to edit does not exist" 
            : "المشروع الذي تحاول تعديله غير موجود",
          variant: "destructive"
        });
      }
    }
  }, [id, navigate, toast, language]);
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would save to a database in a real implementation
    console.log("Saving project:", formData);
    
    toast({
      title: isEditing 
        ? (language === "en" ? "Project updated" : "تم تحديث المشروع")
        : (language === "en" ? "Project created" : "تم إنشاء المشروع"),
      description: language === "en" 
        ? "Your project has been saved successfully"
        : "تم حفظ المشروع بنجاح",
    });
    
    // Return to projects list
    navigate("/dashboard/projects");
  };

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
                        placeholder="Description of the project"
                        rows={6}
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
                        placeholder="وصف المشروع"
                        rows={6}
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
                  <Label htmlFor="image">Project Image URL</Label>
                  <Input 
                    id="image" 
                    name="image" 
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
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
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </Button>
                
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {language === "en" ? "Save Project" : "حفظ المشروع"}
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
