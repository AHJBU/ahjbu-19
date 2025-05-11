import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, LoaderCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProject, updateProject, createProject } from "@/services/supabase-service";
import { ProjectType } from "@/data/projects";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { MediaSelector } from "@/components/media/MediaSelector";

const ProjectEditor = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [link, setLink] = useState("");
  const [github, setGithub] = useState("");
  const [featured, setFeatured] = useState(false);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [year, setYear] = useState("");

  // Use TanStack Query v5 syntax
  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id!),
    enabled: isEditing,
    initialData: null as ProjectType | null,
  });

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setTitleAr(project.titleAr);
      setDescription(project.description);
      setDescriptionAr(project.descriptionAr);
      setImage(project.image);
      setTags(project.tags);
      setLink(project.link || "");
      setGithub(project.github || "");
      setFeatured(project.featured);
      setTechnologies(project.technologies);
      setYear(project.year);
    }
  }, [project]);

  // Use TanStack Query v5 mutation syntax
  const createProjectMutation = useMutation({
    mutationFn: (newProject: Omit<ProjectType, "id">) => createProject(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate("/dashboard/projects");
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: (updatedProject: Partial<ProjectType>) => updateProject(id!, updatedProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate("/dashboard/projects");
    },
  });

  const isLoading = createProjectMutation.isPending || updateProjectMutation.isPending || isProjectLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectData: Omit<ProjectType, "id"> = {
      title,
      titleAr,
      description,
      descriptionAr,
      image,
      tags,
      link,
      github,
      featured,
      technologies,
      year,
    };

    if (isEditing) {
      updateProjectMutation.mutate(projectData);
    } else {
      createProjectMutation.mutate(projectData);
    }
  };

  return (
    <DashboardLayout
      title={isEditing ? (language === "en" ? "Edit Project" : "تعديل مشروع") : (language === "en" ? "New Project" : "مشروع جديد")}
      breadcrumbs={[
        { label: language === "en" ? "Projects" : "المشاريع", href: "/dashboard/projects" },
        { label: isEditing ? (language === "en" ? "Edit" : "تعديل") : (language === "en" ? "New" : "جديد"), href: `/dashboard/projects/editor${isEditing ? `/${id}` : ''}` }
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? (language === "en" ? "Edit Project" : "تعديل مشروع") : (language === "en" ? "New Project" : "مشروع جديد")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - English content */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">{language === "en" ? "Title (English)" : "العنوان (بالإنجليزية)"}</Label>
                  <Input
                    id="title"
                    placeholder={language === "en" ? "Project title in English" : "عنوان المشروع بالإنجليزية"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">{language === "en" ? "Description (English)" : "الوصف (بالإنجليزية)"}</Label>
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder={language === "en" ? "Project description in English..." : "وصف المشروع بالإنجليزية..."}
                    height={300}
                    dir="ltr"
                  />
                </div>
              </div>
              
              {/* Right column - Arabic content */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="titleAr">{language === "en" ? "Title (Arabic)" : "العنوان (بالعربية)"}</Label>
                  <Input
                    id="titleAr"
                    placeholder={language === "en" ? "Project title in Arabic" : "عنوان المشروع بالعربية"}
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <Label htmlFor="descriptionAr">{language === "en" ? "Description (Arabic)" : "الوصف (بالعربية)"}</Label>
                  <RichTextEditor
                    value={descriptionAr}
                    onChange={setDescriptionAr}
                    placeholder={language === "en" ? "Project description in Arabic..." : "وصف المشروع بالعربية..."}
                    height={300}
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
            
            {/* Project links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="link">{language === "en" ? "Project URL" : "رابط المشروع"}</Label>
                <Input
                  id="link"
                  placeholder={language === "en" ? "https://example.com" : "https://example.com"}
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="github">{language === "en" ? "GitHub URL" : "رابط GitHub"}</Label>
                <Input
                  id="github"
                  placeholder={language === "en" ? "https://github.com/username/repo" : "https://github.com/username/repo"}
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
              </div>
            </div>
            
            {/* Project details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="year">{language === "en" ? "Year" : "السنة"}</Label>
                <Input
                  id="year"
                  placeholder={language === "en" ? "2023" : "١٢٣٤"}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="tags">{language === "en" ? "Tags" : "الوسوم"}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => {
                      const newTag = prompt(language === "en" ? "Enter tag name:" : "أدخل اسم الوسم:");
                      if (newTag && !tags.includes(newTag)) {
                        setTags([...tags, newTag]);
                      }
                    }}
                  >
                    + {language === "en" ? "Add" : "إضافة"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                    >
                      {tag}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                  {tags.length === 0 && <span className="text-sm text-muted-foreground">{language === "en" ? "No tags added" : "لم تتم إضافة وسوم"}</span>}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="technologies">{language === "en" ? "Technologies" : "التقنيات"}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => {
                      const newTech = prompt(language === "en" ? "Enter technology name:" : "أدخل اسم التقنية:");
                      if (newTech && !technologies.includes(newTech)) {
                        setTechnologies([...technologies, newTech]);
                      }
                    }}
                  >
                    + {language === "en" ? "Add" : "إضافة"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => setTechnologies(technologies.filter(t => t !== tech))}
                    >
                      {tech}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                  {technologies.length === 0 && <span className="text-sm text-muted-foreground">{language === "en" ? "No technologies added" : "لم تتم إضافة تقنيات"}</span>}
                </div>
              </div>
            </div>
            
            {/* Featured project and image selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>{language === "en" ? "Project Image" : "صورة المشروع"}</Label>
                <MediaSelector
                  value={image}
                  onChange={setImage}
                  type="image"
                />
              </div>
              
              <div className="flex flex-col justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                  <Label htmlFor="featured">
                    {language === "en" ? "Featured project" : "مشروع مميز"}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === "en"
                    ? "Featured projects will be displayed prominently on the homepage."
                    : "ستعرض المشاريع المميزة بشكل بارز على الصفحة الرئيسية."
                  }
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/projects")}
              >
                {language === "en" ? "Cancel" : "إلغاء"}
              </Button>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> {language === "en" ? "Saving..." : "جاري الحفظ..."}</>
                ) : (
                  language === "en" ? "Save Project" : "حفظ المشروع"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ProjectEditor;
