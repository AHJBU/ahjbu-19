
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Save, X, Plus, ChevronLeft, Globe, Github } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProject, createProject, updateProject } from '@/services/supabase-service';
import { ProjectType } from '@/data/projects';

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for form
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [link, setLink] = useState('');
  const [github, setGithub] = useState('');
  const [featured, setFeatured] = useState(false);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [tagInput, setTagInput] = useState('');
  const [techInput, setTechInput] = useState('');

  // Fetch project data if editing existing project
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id as string),
    enabled: !!id,
    onSuccess: (data) => {
      if (data) {
        setTitle(data.title);
        setTitleAr(data.titleAr);
        setDescription(data.description);
        setDescriptionAr(data.descriptionAr);
        setImage(data.image);
        setTags(data.tags);
        setLink(data.link || '');
        setGithub(data.github || '');
        setFeatured(data.featured);
        setTechnologies(data.technologies);
        setYear(data.year);
      }
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast({
        title: language === 'en' ? 'Success!' : 'تم بنجاح!',
        description: language === 'en' ? 'Project created successfully.' : 'تم إنشاء المشروع بنجاح.',
      });
      navigate('/dashboard/projects');
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to create project.' : 'فشل في إنشاء المشروع.',
        variant: 'destructive',
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, project }: { id: string; project: Partial<ProjectType> }) => updateProject(id, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      
      toast({
        title: language === 'en' ? 'Success!' : 'تم بنجاح!',
        description: language === 'en' ? 'Project updated successfully.' : 'تم تحديث المشروع بنجاح.',
      });
      navigate('/dashboard/projects');
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to update project.' : 'فشل في تحديث المشروع.',
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const projectData = {
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
      year
    };

    if (id) {
      updateMutation.mutate({ id, project: projectData });
    } else {
      createMutation.mutate(projectData as ProjectType);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  if (isLoadingProject) {
    return (
      <DashboardLayout 
        title={language === 'en' ? 'Loading Project...' : 'جاري تحميل المشروع...'}
        breadcrumbs={[
          { label: language === 'en' ? 'Projects' : 'المشاريع', href: '/dashboard/projects' },
          { label: language === 'en' ? 'Edit Project' : 'تحرير مشروع', href: `/dashboard/projects/editor/${id}` },
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
      title={id ? (language === 'en' ? 'Edit Project' : 'تحرير مشروع') : (language === 'en' ? 'New Project' : 'مشروع جديد')}
      breadcrumbs={[
        { label: language === 'en' ? 'Projects' : 'المشاريع', href: '/dashboard/projects' },
        { label: id ? (language === 'en' ? 'Edit Project' : 'تحرير مشروع') : (language === 'en' ? 'New Project' : 'مشروع جديد'), href: id ? `/dashboard/projects/editor/${id}` : '/dashboard/projects/editor' },
      ]}
    >
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/projects')}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {language === 'en' ? 'Back to Projects' : 'العودة إلى المشاريع'}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and description in tabs */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="english" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="english">English</TabsTrigger>
                    <TabsTrigger value="arabic">العربية</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="english" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">{language === 'en' ? 'Title' : 'العنوان'}</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={language === 'en' ? 'Project title' : 'عنوان المشروع'}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">{language === 'en' ? 'Description' : 'الوصف'}</Label>
                      <RichTextEditor
                        value={description}
                        onChange={setDescription}
                        height={300}
                        placeholder={language === 'en' ? 'Project description' : 'وصف المشروع'}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="arabic" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="titleAr">العنوان</Label>
                      <Input
                        id="titleAr"
                        value={titleAr}
                        onChange={(e) => setTitleAr(e.target.value)}
                        placeholder="عنوان المشروع"
                        dir="rtl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="descriptionAr">الوصف</Label>
                      <RichTextEditor
                        value={descriptionAr}
                        onChange={setDescriptionAr}
                        height={300}
                        placeholder="وصف المشروع"
                        dir="rtl"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar with metadata */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="image">{language === 'en' ? 'Project Image URL' : 'رابط صورة المشروع'}</Label>
                  <Input
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder={language === 'en' ? 'https://example.com/image.jpg' : 'https://example.com/image.jpg'}
                  />
                </div>
                
                {/* External Link */}
                <div className="space-y-2">
                  <Label htmlFor="link">{language === 'en' ? 'Project Link' : 'رابط المشروع'}</Label>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="link"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder={language === 'en' ? 'https://example.com' : 'https://example.com'}
                    />
                  </div>
                </div>
                
                {/* GitHub Link */}
                <div className="space-y-2">
                  <Label htmlFor="github">{language === 'en' ? 'GitHub Repository' : 'مستودع GitHub'}</Label>
                  <div className="flex items-center space-x-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="github"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder={language === 'en' ? 'https://github.com/username/repo' : 'https://github.com/username/repo'}
                    />
                  </div>
                </div>
                
                {/* Year */}
                <div className="space-y-2">
                  <Label htmlFor="year">{language === 'en' ? 'Year' : 'السنة'}</Label>
                  <Input
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder={language === 'en' ? '2023' : '٢٠٢٣'}
                  />
                </div>
                
                {/* Featured */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    checked={featured}
                    onCheckedChange={(checked) => setFeatured(checked === true)}
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    {language === 'en' ? 'Featured project' : 'مشروع مميز'}
                  </Label>
                </div>
                
                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">{language === 'en' ? 'Tags' : 'الوسوم'}</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tagInput"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder={language === 'en' ? 'Add tag' : 'إضافة وسم'}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" size="sm" onClick={handleAddTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Technologies */}
                <div className="space-y-2">
                  <Label htmlFor="technologies">{language === 'en' ? 'Technologies' : 'التقنيات'}</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="techInput"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder={language === 'en' ? 'Add technology' : 'إضافة تقنية'}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                    />
                    <Button type="button" size="sm" onClick={handleAddTech}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="flex items-center gap-1">
                        {tech}
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveTech(tech)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 border-t flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/projects')}
                >
                  {language === 'en' ? 'Cancel' : 'إلغاء'}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                      {language === 'en' ? 'Saving...' : 'جاري الحفظ...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {language === 'en' ? 'Save Project' : 'حفظ المشروع'}
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
