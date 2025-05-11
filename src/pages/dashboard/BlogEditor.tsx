
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Save, ChevronLeft, Calendar, Tag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getPost, createPost, updatePost } from "@/services/supabase-service";
import { PostType } from "@/data/posts";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!!id);
  const [tagInput, setTagInput] = useState("");
  
  const emptyForm: Omit<PostType, "id"> = {
    title: "",
    titleAr: "",
    excerpt: "",
    excerptAr: "",
    content: "",
    contentAr: "",
    image: "",
    date: new Date().toISOString(),
    author: "",
    tags: [],
  };
  
  const [formData, setFormData] = useState<Omit<PostType, "id">>(emptyForm);
  
  // Fetch post data if editing
  const { isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id as string),
    enabled: !!id,
    onSuccess: (data) => {
      setFormData({
        title: data.title,
        titleAr: data.titleAr,
        excerpt: data.excerpt,
        excerptAr: data.excerptAr,
        content: data.content,
        contentAr: data.contentAr,
        image: data.image,
        date: data.date,
        author: data.author,
        tags: [...data.tags],
      });
    },
    onError: (error) => {
      toast({
        title: language === "en" ? "Post not found" : "لم يتم العثور على المنشور",
        description: language === "en" 
          ? "The post you're trying to edit does not exist" 
          : "المنشور الذي تحاول تعديله غير موجود",
        variant: "destructive"
      });
      navigate("/dashboard/blog");
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };
  
  const handleContentArChange = (contentAr: string) => {
    setFormData(prev => ({ ...prev, contentAr }));
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
  
  // File upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `post-images/${fileName}`;
      
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

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: language === "en" ? "Post created" : "تم إنشاء المنشور",
        description: language === "en" 
          ? "Your post has been created successfully" 
          : "تم إنشاء المنشور بنجاح",
      });
      navigate("/dashboard/blog");
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en"
          ? "Failed to create post. Please try again."
          : "فشل في إنشاء المنشور. الرجاء المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<PostType> }) => 
      updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      toast({
        title: language === "en" ? "Post updated" : "تم تحديث المنشور",
        description: language === "en" 
          ? "Your post has been updated successfully" 
          : "تم تحديث المنشور بنجاح",
      });
      navigate("/dashboard/blog");
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en"
          ? "Failed to update post. Please try again."
          : "فشل في تحديث المنشور. الرجاء المحاولة مرة أخرى.",
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
  const isLoading = isLoadingPost;

  if (isLoading) {
    return (
      <DashboardLayout
        title={language === "en" ? "Loading..." : "جار التحميل..."}
        breadcrumbs={[
          { label: language === "en" ? "Blog" : "المدونة", href: "/dashboard/blog" }
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
        ? (language === "en" ? "Edit Blog Post" : "تعديل منشور المدونة")
        : (language === "en" ? "Create New Blog Post" : "إنشاء منشور مدونة جديد")
      }
      breadcrumbs={[
        { label: language === "en" ? "Blog" : "المدونة", href: "/dashboard/blog" },
        { 
          label: isEditing 
            ? (language === "en" ? "Edit Post" : "تعديل المنشور")
            : (language === "en" ? "New Post" : "منشور جديد"),
          href: isEditing ? `/dashboard/blog/editor/${id}` : "/dashboard/blog/editor"
        }
      ]}
    >
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/blog")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {language === "en" ? "Back to Posts" : "العودة إلى المنشورات"}
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
                        placeholder="Post title"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        placeholder="Brief description of the post"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <RichTextEditor 
                        value={formData.content}
                        onChange={handleContentChange}
                        placeholder="Write your post content here..."
                        height={400}
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
                        placeholder="عنوان المنشور"
                        dir="rtl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="excerptAr">مقتطف</Label>
                      <Textarea
                        id="excerptAr"
                        name="excerptAr"
                        value={formData.excerptAr}
                        onChange={handleInputChange}
                        placeholder="وصف موجز للمنشور"
                        rows={3}
                        dir="rtl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contentAr">المحتوى</Label>
                      <RichTextEditor 
                        value={formData.contentAr}
                        onChange={handleContentArChange}
                        placeholder="اكتب محتوى المنشور هنا..."
                        height={400}
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
                  <Label htmlFor="image">Featured Image</Label>
                  {formData.image && (
                    <div className="relative mb-4 rounded-md overflow-hidden">
                      <img 
                        src={formData.image} 
                        alt={language === "en" ? "Post image" : "صورة المنشور"}
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
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <Label htmlFor="date">Publish Date</Label>
                  </div>
                  <Input 
                    id="date" 
                    name="date" 
                    type="date"
                    value={formData.date.split('T')[0]}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input 
                    id="author" 
                    name="author" 
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Author name"
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
              </CardContent>
              
              <CardFooter className="flex justify-between p-6 border-t">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate("/dashboard/blog")}
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
                      {language === "en" ? "Save Post" : "حفظ المنشور"}
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

export default BlogEditor;
