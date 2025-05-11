
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, LoaderCircle, Calendar, ExternalLink, BookOpen } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublication, updatePublication, createPublication } from "@/services/publication-service";
import { Publication } from "@/types/publication";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { MediaSelector } from "@/components/media/MediaSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

const PublicationEditor = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [abstract, setAbstract] = useState("");
  const [abstractAr, setAbstractAr] = useState("");
  const [authors, setAuthors] = useState("");
  const [authorsAr, setAuthorsAr] = useState("");
  const [publishedIn, setPublishedIn] = useState("");
  const [publishedInAr, setPublishedInAr] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [featured, setFeatured] = useState(false);
  const [relatedProjectId, setRelatedProjectId] = useState("");
  const [relatedPostId, setRelatedPostId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [draft, setDraft] = useState(false);
  const [autosaveInterval, setAutosaveInterval] = useState<number | null>(null);

  // Use TanStack Query
  const { data: publication, isLoading: isPublicationLoading } = useQuery({
    queryKey: ['publication', id],
    queryFn: () => getPublication(id!),
    enabled: isEditing,
  });

  // Autosave timer setup
  useEffect(() => {
    if (isEditing) {
      const interval = window.setInterval(() => {
        handleAutosave();
      }, 60000); // Autosave every minute
      
      setAutosaveInterval(interval);
      
      return () => {
        if (autosaveInterval) clearInterval(autosaveInterval);
      };
    }
  }, [isEditing, title, titleAr, abstract, abstractAr, authors, authorsAr, 
      publishedIn, publishedInAr, date, category, link, image, featured, 
      relatedProjectId, relatedPostId, tags, draft]);

  useEffect(() => {
    if (publication) {
      setTitle(publication.title || "");
      setTitleAr(publication.titleAr || "");
      setAbstract(publication.abstract || "");
      setAbstractAr(publication.abstractAr || "");
      setAuthors(publication.authors || "");
      setAuthorsAr(publication.authorsAr || "");
      setPublishedIn(publication.publishedIn || "");
      setPublishedInAr(publication.publishedInAr || "");
      setDate(publication.date.split('T')[0]);
      setCategory(publication.category || "");
      setLink(publication.link || "");
      setImage(publication.image || "");
      setFeatured(publication.featured || false);
      setRelatedProjectId(publication.relatedProjectId || "");
      setRelatedPostId(publication.relatedPostId || "");
      setTags(publication.tags || []);
      setDraft(publication.draft || false);
    }
  }, [publication]);

  // Mutations
  const createPublicationMutation = useMutation({
    mutationFn: (newPublication: Omit<Publication, 'id'>) => createPublication(newPublication),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast({
        title: language === "en" ? "Publication Created" : "تم إنشاء المنشور",
        description: language === "en" 
          ? "The publication has been created successfully." 
          : "تم إنشاء المنشور بنجاح.",
      });
      navigate("/dashboard/publications");
    },
  });

  const updatePublicationMutation = useMutation({
    mutationFn: (updatedPublication: Partial<Publication>) => updatePublication(id!, updatedPublication),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast({
        title: language === "en" ? "Publication Updated" : "تم تحديث المنشور",
        description: language === "en" 
          ? "The publication has been updated successfully." 
          : "تم تحديث المنشور بنجاح.",
      });
      if (!draft) navigate("/dashboard/publications");
    },
  });

  const isLoading = createPublicationMutation.isPending || updatePublicationMutation.isPending || isPublicationLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const publicationData = {
      title,
      titleAr,
      abstract,
      abstractAr,
      authors,
      authorsAr,
      publishedIn,
      publishedInAr,
      date,
      category,
      link,
      image,
      featured,
      relatedProjectId: relatedProjectId || undefined,
      relatedPostId: relatedPostId || undefined,
      tags,
      draft: false,
      archived: false
    };

    if (isEditing) {
      updatePublicationMutation.mutate(publicationData);
    } else {
      createPublicationMutation.mutate(publicationData as Omit<Publication, 'id'>);
    }
  };

  const handleAutosave = () => {
    if (!isEditing || !title) return;
    
    const draftData = {
      title,
      titleAr,
      abstract,
      abstractAr,
      authors,
      authorsAr,
      publishedIn,
      publishedInAr,
      date,
      category,
      link,
      image,
      featured,
      relatedProjectId: relatedProjectId || undefined,
      relatedPostId: relatedPostId || undefined,
      tags,
      draft: true,
      archived: false
    };
    
    updatePublicationMutation.mutate(draftData);
    toast({
      title: language === "en" ? "Draft Saved" : "تم حفظ المسودة",
      description: language === "en" ? "Your draft has been saved automatically." : "تم حفظ المسودة تلقائيًا.",
    });
  };

  const handlePreview = () => {
    // Store current state in sessionStorage for preview
    const previewData = {
      title,
      titleAr,
      abstract,
      abstractAr,
      authors,
      authorsAr,
      publishedIn,
      publishedInAr,
      date,
      category,
      link,
      image,
      featured,
      archived: false
    };
    sessionStorage.setItem('publicationPreview', JSON.stringify(previewData));
    window.open('/publication-preview', '_blank');
  };

  const handleAddTag = () => {
    const newTag = prompt(language === "en" ? "Enter tag name:" : "أدخل اسم الوسم:");
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  return (
    <DashboardLayout
      title={isEditing 
        ? (language === "en" ? "Edit Publication" : "تعديل منشور") 
        : (language === "en" ? "New Publication" : "منشور جديد")
      }
      breadcrumbs={[
        { label: language === "en" ? "Publications" : "المنشورات", href: "/dashboard/publications" },
        { label: isEditing ? (language === "en" ? "Edit" : "تعديل") : (language === "en" ? "New" : "جديد"), href: `/dashboard/publications/editor${isEditing ? `/${id}` : ''}` }
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {isEditing 
              ? (language === "en" ? "Edit Publication" : "تعديل منشور") 
              : (language === "en" ? "New Publication" : "منشور جديد")
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <Tabs defaultValue="english" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="english">
                  {language === "en" ? "English" : "الإنجليزية"}
                </TabsTrigger>
                <TabsTrigger value="arabic">
                  {language === "en" ? "Arabic" : "العربية"}
                </TabsTrigger>
                <TabsTrigger value="metadata">
                  {language === "en" ? "Metadata" : "البيانات الوصفية"}
                </TabsTrigger>
                <TabsTrigger value="media">
                  {language === "en" ? "Media" : "الوسائط"}
                </TabsTrigger>
              </TabsList>

              {/* English Content */}
              <TabsContent value="english" className="space-y-6">
                <div>
                  <Label htmlFor="title">{language === "en" ? "Title (English)" : "العنوان (بالإنجليزية)"}</Label>
                  <Input
                    id="title"
                    placeholder={language === "en" ? "Publication title in English" : "عنوان المنشور بالإنجليزية"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="abstract">{language === "en" ? "Abstract (English)" : "الملخص (بالإنجليزية)"}</Label>
                  <Textarea
                    id="abstract"
                    placeholder={language === "en" ? "Abstract in English" : "الملخص بالإنجليزية"}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    rows={5}
                  />
                </div>
                
                <div>
                  <Label htmlFor="authors">{language === "en" ? "Authors (English)" : "المؤلفون (بالإنجليزية)"}</Label>
                  <Input
                    id="authors"
                    placeholder={language === "en" ? "Authors in English" : "المؤلفون بالإنجليزية"}
                    value={authors}
                    onChange={(e) => setAuthors(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="publishedIn">{language === "en" ? "Published In (English)" : "نُشر في (بالإنجليزية)"}</Label>
                  <Input
                    id="publishedIn"
                    placeholder={language === "en" ? "Journal or conference name in English" : "اسم المجلة أو المؤتمر بالإنجليزية"}
                    value={publishedIn}
                    onChange={(e) => setPublishedIn(e.target.value)}
                  />
                </div>
              </TabsContent>

              {/* Arabic Content */}
              <TabsContent value="arabic" className="space-y-6">
                <div>
                  <Label htmlFor="titleAr">{language === "en" ? "Title (Arabic)" : "العنوان (بالعربية)"}</Label>
                  <Input
                    id="titleAr"
                    placeholder={language === "en" ? "Publication title in Arabic" : "عنوان المنشور بالعربية"}
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <Label htmlFor="abstractAr">{language === "en" ? "Abstract (Arabic)" : "الملخص (بالعربية)"}</Label>
                  <Textarea
                    id="abstractAr"
                    placeholder={language === "en" ? "Abstract in Arabic" : "الملخص بالعربية"}
                    value={abstractAr}
                    onChange={(e) => setAbstractAr(e.target.value)}
                    rows={5}
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <Label htmlFor="authorsAr">{language === "en" ? "Authors (Arabic)" : "المؤلفون (بالعربية)"}</Label>
                  <Input
                    id="authorsAr"
                    placeholder={language === "en" ? "Authors in Arabic" : "المؤلفون بالعربية"}
                    value={authorsAr}
                    onChange={(e) => setAuthorsAr(e.target.value)}
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <Label htmlFor="publishedInAr">{language === "en" ? "Published In (Arabic)" : "نُشر في (بالعربية)"}</Label>
                  <Input
                    id="publishedInAr"
                    placeholder={language === "en" ? "Journal or conference name in Arabic" : "اسم المجلة أو المؤتمر بالعربية"}
                    value={publishedInAr}
                    onChange={(e) => setPublishedInAr(e.target.value)}
                    dir="rtl"
                  />
                </div>
              </TabsContent>

              {/* Metadata */}
              <TabsContent value="metadata" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="date">{language === "en" ? "Publication Date" : "تاريخ النشر"}</Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">{language === "en" ? "Category" : "الفئة"}</Label>
                    <Input
                      id="category"
                      placeholder={language === "en" ? "Publication category" : "فئة المنشور"}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="link">{language === "en" ? "External Link" : "رابط خارجي"}</Label>
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="link"
                      placeholder={language === "en" ? "URL to the publication" : "رابط المنشور"}
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tags">{language === "en" ? "Tags" : "الوسوم"}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={handleAddTag}
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
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                  <Label htmlFor="featured">
                    {language === "en" ? "Featured publication" : "منشور مميز"}
                  </Label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="relatedProjectId">{language === "en" ? "Related Project ID" : "معرف المشروع المرتبط"}</Label>
                    <Input
                      id="relatedProjectId"
                      placeholder={language === "en" ? "Related project ID" : "معرف المشروع المرتبط"}
                      value={relatedProjectId}
                      onChange={(e) => setRelatedProjectId(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="relatedPostId">{language === "en" ? "Related Post ID" : "معرف المقال المرتبط"}</Label>
                    <Input
                      id="relatedPostId"
                      placeholder={language === "en" ? "Related post ID" : "معرف المقال المرتبط"}
                      value={relatedPostId}
                      onChange={(e) => setRelatedPostId(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Media */}
              <TabsContent value="media" className="space-y-6">
                <div>
                  <Label>{language === "en" ? "Featured Image" : "صورة المنشور"}</Label>
                  <MediaSelector
                    value={image}
                    onChange={setImage}
                    type="image"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between items-center border-t pt-6">
              <div className="flex items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/dashboard/publications")}
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </Button>
                
                <Button
                  type="button" 
                  variant="secondary"
                  onClick={handlePreview}
                >
                  {language === "en" ? "Preview" : "معاينة"}
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                {isEditing && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAutosave}
                  >
                    {language === "en" ? "Save Draft" : "حفظ المسودة"}
                  </Button>
                )}
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> {language === "en" ? "Saving..." : "جاري الحفظ..."}</>
                  ) : (
                    language === "en" ? "Publish" : "نشر"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default PublicationEditor;
