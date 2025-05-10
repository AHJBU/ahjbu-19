
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { posts } from "@/data/posts";
import { Save, ChevronLeft, Calendar, Tag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
}

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!!id);
  
  const emptyForm: FormData = {
    title: "",
    titleAr: "",
    excerpt: "",
    excerptAr: "",
    content: "",
    contentAr: "",
    image: "",
    date: new Date().toISOString().split("T")[0],
    author: "",
    tags: []
  };
  
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [tagInput, setTagInput] = useState("");
  
  // Find post data if editing
  useEffect(() => {
    if (id) {
      const post = posts.find(p => p.id === id);
      if (post) {
        setFormData({
          title: post.title,
          titleAr: post.titleAr,
          excerpt: post.excerpt,
          excerptAr: post.excerptAr,
          content: post.content,
          contentAr: post.contentAr,
          image: post.image,
          date: post.date,
          author: post.author,
          tags: [...post.tags]
        });
      } else {
        // Post not found
        navigate("/dashboard/blog");
        toast({
          title: language === "en" ? "Post not found" : "لم يتم العثور على المنشور",
          description: language === "en" 
            ? "The post you're trying to edit does not exist" 
            : "المنشور الذي تحاول تعديله غير موجود",
          variant: "destructive"
        });
      }
    }
  }, [id, navigate, toast, language]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would save to a database in a real implementation
    console.log("Saving post:", formData);
    
    toast({
      title: isEditing 
        ? (language === "en" ? "Post updated" : "تم تحديث المنشور")
        : (language === "en" ? "Post created" : "تم إنشاء المنشور"),
      description: language === "en" 
        ? "Your post has been saved successfully"
        : "تم حفظ المنشور بنجاح",
    });
    
    // Return to blog list
    navigate("/dashboard/blog");
  };

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
                      <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Post content"
                        rows={12}
                        className="min-h-[300px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        This would be replaced with an advanced editor in the next phase.
                      </p>
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
                      <Textarea
                        id="contentAr"
                        name="contentAr"
                        value={formData.contentAr}
                        onChange={handleInputChange}
                        placeholder="محتوى المنشور"
                        rows={12}
                        className="min-h-[300px]"
                        dir="rtl"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        سيتم استبدال هذا بمحرر متقدم في المرحلة التالية.
                      </p>
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
                  <Label htmlFor="image">Featured Image URL</Label>
                  <Input 
                    id="image" 
                    name="image" 
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
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
                    value={formData.date}
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
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </Button>
                
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {language === "en" ? "Save Post" : "حفظ المنشور"}
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
