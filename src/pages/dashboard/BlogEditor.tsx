
import { useState, useEffect } from 'react';
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
import { CalendarIcon, Save, X, Plus, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPost, createPost, updatePost } from '@/services/supabase-service';
import { PostType } from '@/data/posts';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for form
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptAr, setExcerptAr] = useState('');
  const [content, setContent] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [image, setImage] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Fetch post data if editing existing post
  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id as string),
    enabled: !!id,
    onSuccess: (data) => {
      if (data) {
        setTitle(data.title);
        setTitleAr(data.titleAr);
        setExcerpt(data.excerpt);
        setExcerptAr(data.excerptAr);
        setContent(data.content);
        setContentAr(data.contentAr);
        setImage(data.image);
        setDate(new Date(data.date));
        setAuthor(data.author);
        setTags(data.tags);
        setFeatured(data.featured);
      }
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast({
        title: language === 'en' ? 'Success!' : 'تم بنجاح!',
        description: language === 'en' ? 'Post created successfully.' : 'تم إنشاء المنشور بنجاح.',
      });
      navigate('/dashboard/blog');
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to create post.' : 'فشل في إنشاء المنشور.',
        variant: 'destructive',
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, post }: { id: string; post: Partial<PostType> }) => updatePost(id, post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      
      toast({
        title: language === 'en' ? 'Success!' : 'تم بنجاح!',
        description: language === 'en' ? 'Post updated successfully.' : 'تم تحديث المنشور بنجاح.',
      });
      navigate('/dashboard/blog');
    },
    onError: (error) => {
      console.error('Error updating post:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to update post.' : 'فشل في تحديث المنشور.',
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const postData = {
      title,
      titleAr,
      excerpt,
      excerptAr,
      content,
      contentAr,
      image,
      date: date.toISOString(),
      author,
      tags,
      featured,
    };

    if (id) {
      updateMutation.mutate({ id, post: postData });
    } else {
      createMutation.mutate(postData as PostType);
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

  if (isLoadingPost) {
    return (
      <DashboardLayout 
        title={language === 'en' ? 'Loading Post...' : 'جاري تحميل المنشور...'}
        breadcrumbs={[
          { label: language === 'en' ? 'Blog' : 'المدونة', href: '/dashboard/blog' },
          { label: language === 'en' ? 'Edit Post' : 'تحرير منشور', href: `/dashboard/blog/editor/${id}` },
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
      title={id ? (language === 'en' ? 'Edit Post' : 'تحرير منشور') : (language === 'en' ? 'New Post' : 'منشور جديد')}
      breadcrumbs={[
        { label: language === 'en' ? 'Blog' : 'المدونة', href: '/dashboard/blog' },
        { label: id ? (language === 'en' ? 'Edit Post' : 'تحرير منشور') : (language === 'en' ? 'New Post' : 'منشور جديد'), href: id ? `/dashboard/blog/editor/${id}` : '/dashboard/blog/editor' },
      ]}
    >
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/blog')}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {language === 'en' ? 'Back to Posts' : 'العودة إلى المنشورات'}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and content in tabs */}
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
                        placeholder={language === 'en' ? 'Post title' : 'عنوان المنشور'}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">{language === 'en' ? 'Excerpt' : 'مقتطف'}</Label>
                      <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder={language === 'en' ? 'Brief description of your post' : 'وصف موجز للمنشور'}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">{language === 'en' ? 'Content' : 'المحتوى'}</Label>
                      <RichTextEditor
                        value={content}
                        onChange={setContent}
                        height={400}
                        placeholder={language === 'en' ? 'Write your post content here...' : 'اكتب محتوى المنشور هنا...'}
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
                        placeholder="عنوان المنشور"
                        dir="rtl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="excerptAr">مقتطف</Label>
                      <Textarea
                        id="excerptAr"
                        value={excerptAr}
                        onChange={(e) => setExcerptAr(e.target.value)}
                        placeholder="وصف موجز للمنشور"
                        rows={3}
                        dir="rtl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contentAr">المحتوى</Label>
                      <RichTextEditor
                        value={contentAr}
                        onChange={setContentAr}
                        height={400}
                        placeholder="اكتب محتوى المنشور هنا..."
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
                  <Label htmlFor="image">{language === 'en' ? 'Featured Image URL' : 'رابط الصورة المميزة'}</Label>
                  <Input
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder={language === 'en' ? 'https://example.com/image.jpg' : 'https://example.com/image.jpg'}
                  />
                </div>
                
                {/* Publish Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">{language === 'en' ? 'Publish Date' : 'تاريخ النشر'}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : language === 'en' ? 'Select a date' : 'اختر تاريخ'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Author */}
                <div className="space-y-2">
                  <Label htmlFor="author">{language === 'en' ? 'Author' : 'الكاتب'}</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder={language === 'en' ? 'Author name' : 'اسم الكاتب'}
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
                    {language === 'en' ? 'Featured post' : 'منشور مميز'}
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
              </CardContent>
              <CardFooter className="px-6 py-4 border-t flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/blog')}
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
                      {language === 'en' ? 'Save Post' : 'حفظ المنشور'}
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
