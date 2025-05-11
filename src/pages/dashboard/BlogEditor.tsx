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
import { X, LoaderCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPost, updatePost, createPost } from "@/services/supabase-service";
import { PostType } from "@/data/posts";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { MediaSelector } from "@/components/media/MediaSelector";

const BlogEditor = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const queryClient = useQueryClient();

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

  const { data: post, isLoading: isPostLoading } = useQuery<PostType>({
    queryKey: ['post', id],
    queryFn: () => getPost(id!),
    enabled: isEditing,
    initialData: null,
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
    }
  }, [post]);

  const createPostMutation = useMutation({
    mutationFn: (newPost: Omit<PostType, 'id'>) => createPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate("/dashboard/blog");
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (updatedPost: Partial<PostType>) => updatePost(id!, updatedPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate("/dashboard/blog");
    },
  });

  const isLoading = createPostMutation.isLoading || updatePostMutation.isLoading;

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

  return (
    <DashboardLayout
      title={isEditing ? (language === "en" ? "Edit Blog Post" : "تعديل مقال") : (language === "en" ? "New Blog Post" : "مقال جديد")}
      breadcrumbs={[
        { label: language === "en" ? "Blog Posts" : "المدونة", href: "/dashboard/blog" },
        { label: isEditing ? (language === "en" ? "Edit" : "تعديل") : (language === "en" ? "New" : "جديد"), href: `/dashboard/blog/editor${isEditing ? `/${id}` : ''}` }
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? (language === "en" ? "Edit Blog Post" : "تعديل مقال") : (language === "en" ? "New Blog Post" : "مقال جديد")}</CardTitle>
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
                    height={400}
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
                    height={400}
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
            
            {/* Post metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
            </div>
            
            {/* Featured post and image selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>{language === "en" ? "Featured Image" : "صورة المقال"}</Label>
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
                    {language === "en" ? "Featured post" : "مقال مميز"}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === "en"
                    ? "Featured posts will be displayed prominently on the homepage."
                    : "ستعرض المقالات المميزة بشكل بارز على الصفحة الرئيسية."
                  }
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/blog")}
              >
                {language === "en" ? "Cancel" : "إلغاء"}
              </Button>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> {language === "en" ? "Saving..." : "جاري الحفظ..."}</>
                ) : (
                  language === "en" ? "Save Post" : "حفظ المقال"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default BlogEditor;
