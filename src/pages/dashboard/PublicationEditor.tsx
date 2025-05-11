
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { MediaSelector } from "@/components/media/MediaSelector";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublication, createPublication, updatePublication } from "@/services/publication-service";
import { Publication } from "@/types/publication";
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
    category: "Journal Article",
    link: "",
    featured: false,
    archived: false
  });

  // Fetch publication data if in edit mode
  const { data: publicationData, isLoading: isLoadingPublication } = useQuery({
    queryKey: ['publication', id],
    queryFn: () => getPublication(id!),
    enabled: !!id
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

  const categories = [
    "Journal Article",
    "Conference Paper",
    "Book Chapter",
    "Book",
    "Thesis",
    "Report",
    "Patent",
    "Other"
  ];

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
                        <Textarea
                          id="abstract"
                          value={publication.abstract}
                          onChange={(e) => setPublication({ ...publication, abstract: e.target.value })}
                          className="mt-1 min-h-[150px]"
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
                          placeholder="e.g. John Doe, Jane Smith"
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
                          placeholder="e.g. Journal of Science, Conference on AI"
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
                        <Textarea
                          id="abstractAr"
                          value={publication.abstractAr}
                          onChange={(e) => setPublication({ ...publication, abstractAr: e.target.value })}
                          className="mt-1 min-h-[150px]"
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
                          placeholder="مثال: محمد أحمد، فاطمة علي"
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
                          placeholder="مثال: مجلة العلوم، مؤتمر الذكاء الاصطناعي"
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
                        {language === "en" ? "Category" : "الفئة"}
                      </Label>
                      <Select
                        value={publication.category}
                        onValueChange={(value) => setPublication({ ...publication, category: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="date">
                        {language === "en" ? "Publication Date" : "تاريخ النشر"}
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
                    
                    <div>
                      <Label htmlFor="relatedProjectId">
                        {language === "en" ? "Related Project ID" : "معرف المشروع المرتبط"}
                      </Label>
                      <Input
                        id="relatedProjectId"
                        value={publication.relatedProjectId || ""}
                        onChange={(e) => setPublication({ ...publication, relatedProjectId: e.target.value })}
                        className="mt-1"
                        placeholder="project-123"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="relatedPostId">
                        {language === "en" ? "Related Post ID" : "معرف المنشور المرتبط"}
                      </Label>
                      <Input
                        id="relatedPostId"
                        value={publication.relatedPostId || ""}
                        onChange={(e) => setPublication({ ...publication, relatedPostId: e.target.value })}
                        className="mt-1"
                        placeholder="post-123"
                      />
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
