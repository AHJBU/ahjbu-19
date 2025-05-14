import { useState, useEffect, useCallback } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X, 
  LoaderCircle, 
  Eye, 
  Calendar, 
  Tag,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Languages
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPost, updatePost, createPost } from "@/services/supabase-service";
import { PostType } from "@/data/posts";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { MediaSelector } from "@/components/media/MediaSelector";
import { toast } from "@/components/ui/use-toast";
import { AutoSave } from "@/components/editor/AutoSave";
import { WordPressImporter } from "@/components/editor/WordPressImporter";
import { AITranslation } from "@/components/ai/AITranslation";
import { AITextGeneration } from "@/components/ai/AITextGeneration";

interface AITranslationProps {
  onTranslateToEnglish: (data: { title: string; excerpt: string; content: string }) => void;
  onTranslateToArabic: (data: { titleAr: string; excerptAr: string; contentAr: string }) => void;
}

interface AITextGenerationProps {
  title: string;
  onGeneratedContent: (generatedText: string) => void;
}

export const EnhancedBlogEditor = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const queryClient = useQueryClient();

  // Form state
  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [excerptAr, setExcerptAr] = useState("");
  const [content, setContent] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("english-content");
  const [showAiTools, setShowAiTools] = useState(false);

  // Use TanStack Query v5 syntax
  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setTitleAr(post.titleAr);
      setExcerpt(post.excerpt);
      setExcerptAr(post.excerptAr);
      setContent(post.content);
      setContentAr(post.contentAr);
      setImage(post.image);
      setDate(post.date.split('T')[0]);
      setAuthor(post.author);
      setTags(post.tags);
      setFeatured(post.featured);
      setIsDirty(false);
    }
  }, [post]);

  // Track changes to set isDirty
  useEffect(() => {
    if (isEditing && post) {
      const hasChanges = 
        title !== post.title ||
        titleAr !== post.titleAr ||
        excerpt !== post.excerpt ||
        excerptAr !== post.excerptAr ||
        content !== post.content ||
        contentAr !== post.contentAr ||
        image !== post.image ||
        date !== post.date.split('T')[0] ||
        author !== post.author ||
        JSON.stringify(tags) !== JSON.stringify(post.tags) ||
        featured !== post.featured;
      
      setIsDirty(hasChanges);
    } else if (!isEditing) {
      setIsDirty(title !== "" || content !== "");
    }
  }, [title, titleAr, excerpt, excerptAr, content, contentAr, image, date, author, tags, featured, post, isEditing]);

  // Use TanStack Query v5 mutation syntax
  const createPostMutation = useMutation({
    mutationFn: (newPost: Omit<PostType, 'id'>) => createPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: language === "en" ? "Post Created" : "تم إنشاء المقال",
        description: language === "en" 
          ? "Your post has been created successfully" 
          : "تم إنشاء المقال بنجاح",
      });
      navigate("/dashboard/blog");
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (updatedPost: Partial<PostType>) => updatePost(id!, updatedPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsDirty(false);
      toast({
        title: language === "en" ? "Post Updated" : "تم تحديث المقال",
        description: language === "en" 
          ? "Your post has been updated successfully" 
          : "تم تحديث المقال بنجاح",
      });
    },
  });

  const isLoading = createPostMutation.isPending || updatePostMutation.isPending || isPostLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title,
      titleAr,
      excerpt,
      excerptAr,
      content,
      contentAr,
      image,
      date,
      author,
      tags,
      featured,
    };

    if (isEditing) {
      updatePostMutation.mutate(postData);
    } else {
      createPostMutation.mutate(postData);
    }
  };

  const handleSaveDraft = useCallback(async () => {
    if (!isEditing && !title) return;
    
    const postData = {
      title,
      titleAr,
      excerpt,
      excerptAr,
      content,
      contentAr,
      image,
      date,
      author,
      tags,
      featured,
    };
    
    if (isEditing) {
      await updatePost(id!, postData);
      setIsDirty(false);
    } else {
      // For new posts, we should save as a draft instead
      // This would require a separate API for drafts
      console.log("Save as draft", postData);
    }
  }, [title, titleAr, excerpt, excerptAr, content, contentAr, image, date, author, tags, featured, isEditing, id]);

  const handlePreview = () => {
    // Store post data in session storage for preview
    const previewData = {
      title,
      titleAr,
      excerpt,
      excerptAr,
      content,
      contentAr,
      image,
      date,
      author,
      tags
    };
    sessionStorage.setItem('postPreview', JSON.stringify(previewData));
    window.open('/blog/preview', '_blank');
  };

  const handleWordPressImport = (data: {
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    featured_media?: string;
  }) => {
    setTitle(data.title);
    setContent(data.content);
    setExcerpt(data.excerpt.replace(/<\/?[^>]+(>|$)/g, "")); // Strip HTML from excerpt
    setTags(data.tags);
    if (data.featured_media) {
      setImage(data.featured_media);
    }
    setIsDirty(true);
  };

  const handleTranslateToEnglish = (data: { title: string, excerpt: string, content: string }) => {
    setTitle(data.title);
    setExcerpt(data.excerpt);
    setContent(data.content);
    setIsDirty(true);
  };

  const handleTranslateToArabic = (data: { title: string; excerpt: string; content: string }) => {
    const transformedData = {
      titleAr: data.title,
      excerptAr: data.excerpt,
      contentAr: data.content
    };
    
    setPost({
      ...post,
      titleAr: transformedData.titleAr,
      excerptAr: transformedData.excerptAr,
      contentAr: transformedData.contentAr
    });
  };

  const handleGeneratedContent = (generatedText: string) => {
    if (activeTab === "english-content") {
      setContent(prev => prev + generatedText);
    } else if (activeTab === "arabic-content") {
      setContentAr(prev => prev + generatedText);
    }
    setIsDirty(true);
  };

  return (
    <DashboardLayout
      title={isEditing ? (language === "en" ? "Edit Blog Post" : "تعديل مقال") : (language === "en" ? "New Blog Post" : "مقال جديد")}
      breadcrumbs={[
        { label: language === "en" ? "Blog Posts" : "المدونة", href: "/dashboard/blog" },
        { label: isEditing ? (language === "en" ? "Edit" : "تعديل") : (language === "en" ? "New" : "جديد"), href: `/dashboard/blog/editor${isEditing ? `/${id}` : ''}` }
      ]}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEditing ? (language === "en" ? "Edit Blog Post" : "تعديل مقال") : (language === "en" ? "New Blog Post" : "مقال جديد")}</CardTitle>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAiTools(!showAiTools)}
              className="flex items-center gap-1"
            >
              <Sparkles className="h-4 w-4" />
              {language === "en" ? "AI Tools" : "أدوات الذكاء"}
            </Button>
            <AutoSave 
              onSave={handleSaveDraft}
              isDirty={isDirty}
              saveInterval={30000} // 30 seconds
            />
            <WordPressImporter onImport={handleWordPressImport} />
          </div>
        </CardHeader>
        <CardContent>
          {showAiTools && (
            <div className="mb-6 border-b pb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" /> 
                  {language === "en" ? "AI Assistance" : "مساعدة الذكاء الاصطناعي"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAiTools(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Languages className="h-4 w-4 mr-2" />
                    {language === "en" ? "AI Translation" : "الترجمة الذكية"}
                  </h4>
                  <AITranslation 
                    title={title}
                    titleAr={titleAr}
                    excerpt={excerpt}
                    excerptAr={excerptAr}
                    content={content}
                    contentAr={contentAr}
                    onTranslateToEnglish={handleTranslateToEnglish}
                    onTranslateToArabic={handleTranslateToArabic}
                  />
                </div>

                <AITextGeneration 
                  title={post.title} 
                  onGeneratedContent={(generatedText) => {
                    setPost({...post, content: generatedText});
                  }}
                />
              </div>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex justify-between items-center">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="english-content">
                    <FileText className="h-4 w-4 mr-2" />
                    {language === "en" ? "English Content" : "المحتوى الإنجليزي"}
                  </TabsTrigger>
                  <TabsTrigger value="arabic-content">
                    <FileText className="h-4 w-4 mr-2" />
                    {language === "en" ? "Arabic Content" : "المحتوى العربي"}
                  </TabsTrigger>
                  <TabsTrigger value="media">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {language === "en" ? "Media & Image" : "الوسائط والصورة"}
                  </TabsTrigger>
                  <TabsTrigger value="metadata">
                    <Tag className="h-4 w-4 mr-2" />
                    {language === "en" ? "Tags & Metadata" : "الوسوم والبيانات الوصفية"}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="english-content" className="space-y-6">
                  <div>
                    <Label htmlFor="title">{language === "en" ? "Title (English)" : "العنوان (بالإنجليزية)"}</Label>
                    <Input
                      id="title"
                      placeholder={language === "en" ? "Post title in English" : "عنوان المنشور بالإنجليزية"}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="excerpt">{language === "en" ? "Excerpt (English)" : "ملخص (بالإنجليزية)"}</Label>
                    <Textarea
                      id="excerpt"
                      placeholder={language === "en" ? "Brief description in English" : "وصف موجز بالإنجليزية"}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label>{language === "en" ? "Content (English)" : "المحتوى (بالإنجليزية)"}</Label>
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder={language === "en" ? "Write your post content in English..." : "اكتب محتوى المنشور بالإنجليزية..."}
                      height={500}
                      dir="ltr"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="arabic-content" className="space-y-6">
                  <div>
                    <Label htmlFor="titleAr">{language === "en" ? "Title (Arabic)" : "العنوان (بالعربية)"}</Label>
                    <Input
                      id="titleAr"
                      placeholder={language === "en" ? "Post title in Arabic" : "عنوان المنشور بالعربية"}
                      value={titleAr}
                      onChange={(e) => setTitleAr(e.target.value)}
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="excerptAr">{language === "en" ? "Excerpt (Arabic)" : "ملخص (بالعربية)"}</Label>
                    <Textarea
                      id="excerptAr"
                      placeholder={language === "en" ? "Brief description in Arabic" : "وصف موجز بالعربية"}
                      value={excerptAr}
                      onChange={(e) => setExcerptAr(e.target.value)}
                      dir="rtl"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label>{language === "en" ? "Content (Arabic)" : "المحتوى (بالعربية)"}</Label>
                    <RichTextEditor
                      value={contentAr}
                      onChange={setContentAr}
                      placeholder={language === "en" ? "Write your post content in Arabic..." : "اكتب محتوى المنشور بالعربية..."}
                      height={500}
                      dir="rtl"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="media" className="space-y-6">
                  <div>
                    <Label>{language === "en" ? "Featured Image" : "صورة المقال"}</Label>
                    <MediaSelector
                      value={image}
                      onChange={setImage}
                      type="image"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="metadata" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="author">{language === "en" ? "Author" : "المؤلف"}</Label>
                      <Input
                        id="author"
                        placeholder={language === "en" ? "Author name" : "اسم المؤلف"}
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="date">{language === "en" ? "Publish Date" : "تاريخ النشر"}</Label>
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
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={featured}
                      onCheckedChange={setFeatured}
                    />
                    <Label htmlFor="featured">
                      {language === "en" ? "Featured post" : "مقال مميز"}
                    </Label>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/blog")}
              >
                {language === "en" ? "Cancel" : "إلغاء"}
              </Button>
              
              <Button 
                type="button" 
                variant="secondary"
                onClick={handlePreview}
              >
                <Eye className="mr-2 h-4 w-4" />
                {language === "en" ? "Preview" : "معاينة"}
              </Button>
              
              <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isLoading || !isDirty}>
                {language === "en" ? "Save Draft" : "حفظ المسودة"}
              </Button>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> {language === "en" ? "Saving..." : "جاري الحفظ..."}</>
                ) : (
                  language === "en" ? "Publish" : "نشر"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default EnhancedBlogEditor;
