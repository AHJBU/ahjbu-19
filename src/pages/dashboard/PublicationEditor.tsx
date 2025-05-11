
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { MediaSelector } from "@/components/media/MediaSelector";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublication, createPublication, updatePublication } from "@/services/publication-service";
import { getProjects } from "@/services/supabase-service";
import { getPosts } from "@/services/supabase-service";
import { Publication } from "@/types/publication";
import { ProjectType } from "@/data/projects";
import { PostType } from "@/data/posts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PublicationEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const isEditMode = !!id;
  
  const [publication, setPublication] = useState<Partial<Publication>>({
    title: "",
    titleAr: "",
    abstract: "",
    abstractAr: "",
    authors: "",
    authorsAr: "",
    publishedIn: "",
    publishedInAr: "",
    date: new Date().toISOString().split('T')[0],
    category: "Journal",
    link: "",
    relatedProjectId: "",
    relatedPostId: "",
    image: "",
    featured: false
  });

  // Fetch publication data if in edit mode
  const { data: publicationData, isLoading: isLoadingPublication } = useQuery({
    queryKey: ['publication', id],
    queryFn: () => getPublication(id!),
    enabled: !!id
  });

  // Fetch projects for linking
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  // Fetch posts for linking
  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  });

  // Set publication data when fetched
  useEffect(() => {
    if (publicationData) {
      setPublication(publicationData);
    }
  }, [publicationData]);

  // Create or update publication mutation
  const mutation = useMutation({
    mutationFn: (data: Partial<Publication>) => {
      if (isEditMode) {
        return updatePublication(id!, data);
      } else {
        return createPublication(data as Omit<Publication, 'id'>);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast({
        title: language === "en" ? "Success" : "تم بنجاح",
        description: language === "en"
          ? `Publication ${isEditMode ? 'updated' : 'created'} successfully`
          : `تم ${isEditMode ? 'تحديث' : 'إنشاء'} المنشور بنجاح`,
      });
      navigate('/dashboard/publications');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publication.title || !publication.abstract) {
      toast({
        title: language === "en" ? "Missing Information" : "معلومات ناقصة",
        description: language === "en" 
          ? "Please fill in all required fields." 
          : "الرجاء ملء جميع الحقول المطلوبة.",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(publication);
  };

  const handleImageSelected = (url: string) => {
    setPublication(prev => ({ ...prev, image: url }));
  };

  return (
    <DashboardLayout 
      title={language === "en" 
        ? `${isEditMode ? 'Edit' : 'New'} Publication` 
        : `${isEditMode ? 'تعديل' : 'إضافة'} منشور`
      }
      breadcrumbs={[
        { label: language === "en" ? "Publications" : "المنشورات", href: "/dashboard/publications" },
        { label: language === "en" ? (isEditMode ? "Edit" : "New") : (isEditMode ? "تعديل" : "إضافة"), href: "#" }
      ]}
    >
      {isLoadingPublication ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <Tabs defaultValue="english" className="space-y-6">
                    <TabsList>
                      <TabsTrigger value="english">
                        {language === "en" ? "English" : "الإنجليزية"}
                      </TabsTrigger>
                      <TabsTrigger value="arabic">
                        {language === "en" ? "Arabic" : "العربية"}
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* English Content */}
                    <TabsContent value="english" className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={publication.title}
                          onChange={(e) => setPublication({ ...publication, title: e.target.value })}
                          className="mt-1"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="abstract">Abstract</Label>
                        <Input
                          id="abstract"
                          value={publication.abstract}
                          onChange={(e) => setPublication({ ...publication, abstract: e.target.value })}
                          className="mt-1"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="authors">Authors</Label>
                        <Input
                          id="authors"
                          value={publication.authors}
                          onChange={(e) => setPublication({ ...publication, authors: e.target.value })}
                          className="mt-1"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="publishedIn">Published In</Label>
                        <Input
                          id="publishedIn"
                          value={publication.publishedIn}
                          onChange={(e) => setPublication({ ...publication, publishedIn: e.target.value })}
                          className="mt-1"
                          required
                        />
                      </div>
                    </TabsContent>
                    
                    {/* Arabic Content */}
                    <TabsContent value="arabic" className="space-y-4">
                      <div>
                        <Label htmlFor="titleAr">العنوان</Label>
                        <Input
                          id="titleAr"
                          value={publication.titleAr}
                          onChange={(e) => setPublication({ ...publication, titleAr: e.target.value })}
                          className="mt-1"
                          dir="rtl"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="abstractAr">الملخص</Label>
                        <Input
                          id="abstractAr"
                          value={publication.abstractAr}
                          onChange={(e) => setPublication({ ...publication, abstractAr: e.target.value })}
                          className="mt-1"
                          dir="rtl"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="authorsAr">المؤلفون</Label>
                        <Input
                          id="authorsAr"
                          value={publication.authorsAr}
                          onChange={(e) => setPublication({ ...publication, authorsAr: e.target.value })}
                          className="mt-1"
                          dir="rtl"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="publishedInAr">نُشر في</Label>
                        <Input
                          id="publishedInAr"
                          value={publication.publishedInAr}
                          onChange={(e) => setPublication({ ...publication, publishedInAr: e.target.value })}
                          className="mt-1"
                          dir="rtl"
                          required
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar Settings */}
            <div>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  {/* Publication Image */}
                  <div>
                    <Label>{language === "en" ? "Publication Image" : "صورة المنشور"}</Label>
                    <div className="mt-2">
                      <MediaSelector 
                        value={publication.image}
                        onValueChange={handleImageSelected}
                      />
                    </div>
                  </div>
                  
                  {/* Publication Details */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">
                        {language === "en" ? "Category" : "التصنيف"}
                      </Label>
                      <Select
                        value={publication.category}
                        onValueChange={(value) => setPublication({ ...publication, category: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Journal">
                            {language === "en" ? "Journal" : "مجلة علمية"}
                          </SelectItem>
                          <SelectItem value="Conference">
                            {language === "en" ? "Conference" : "مؤتمر"}
                          </SelectItem>
                          <SelectItem value="Book">
                            {language === "en" ? "Book" : "كتاب"}
                          </SelectItem>
                          <SelectItem value="Book Chapter">
                            {language === "en" ? "Book Chapter" : "فصل كتاب"}
                          </SelectItem>
                          <SelectItem value="Workshop">
                            {language === "en" ? "Workshop" : "ورشة عمل"}
                          </SelectItem>
                          <SelectItem value="Preprint">
                            {language === "en" ? "Preprint" : "منشور أولي"}
                          </SelectItem>
                          <SelectItem value="Media">
                            {language === "en" ? "Media" : "وسائل إعلام"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="date">
                        {language === "en" ? "Date" : "التاريخ"}
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={publication.date}
                        onChange={(e) => setPublication({ ...publication, date: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="link">
                        {language === "en" ? "External Link" : "رابط خارجي"}
                      </Label>
                      <Input
                        id="link"
                        type="url"
                        value={publication.link}
                        onChange={(e) => setPublication({ ...publication, link: e.target.value })}
                        className="mt-1"
                        placeholder="https://"
                      />
                    </div>
                    
                    {/* Related Content */}
                    <div className="space-y-4 pt-4">
                      <h3 className="text-sm font-medium">
                        {language === "en" ? "Related Content" : "محتوى ذو صلة"}
                      </h3>
                      
                      <div>
                        <Label htmlFor="relatedProjectId">
                          {language === "en" ? "Related Project" : "مشروع ذو صلة"}
                        </Label>
                        <Select
                          value={publication.relatedProjectId ?? ""}
                          onValueChange={(value) => setPublication({ ...publication, relatedProjectId: value || undefined })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={language === "en" ? "Select a project" : "اختر مشروع"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">
                              {language === "en" ? "None" : "لا يوجد"}
                            </SelectItem>
                            {projects.map((project: ProjectType) => (
                              <SelectItem key={project.id} value={project.id}>
                                {language === "en" ? project.title : project.titleAr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="relatedPostId">
                          {language === "en" ? "Related Post" : "مقالة ذات صلة"}
                        </Label>
                        <Select
                          value={publication.relatedPostId ?? ""}
                          onValueChange={(value) => setPublication({ ...publication, relatedPostId: value || undefined })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={language === "en" ? "Select a post" : "اختر مقالة"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">
                              {language === "en" ? "None" : "لا يوجد"}
                            </SelectItem>
                            {posts.map((post: PostType) => (
                              <SelectItem key={post.id} value={post.id}>
                                {language === "en" ? post.title : post.titleAr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Featured setting */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="featured">
                          {language === "en" ? "Featured Publication" : "منشور مميز"}
                        </Label>
                        <Switch
                          id="featured"
                          checked={publication.featured}
                          onCheckedChange={(checked) => setPublication({ ...publication, featured: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/dashboard/publications')}
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </Button>
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    language === "en" ? "Saving..." : "جارِ الحفظ..."
                  ) : (
                    language === "en" ? "Save Publication" : "حفظ المنشور"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
};

export default PublicationEditor;
