
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { MediaSelector } from "@/components/media/MediaSelector";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourse, createCourse, updateCourse } from "@/services/course-service";
import { Course } from "@/types/course";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CourseEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const isEditMode = !!id;
  
  const [course, setCourse] = useState<Partial<Course>>({
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    content: "",
    contentAr: "",
    image: "",
    category: "Web Development",
    level: "Beginner",
    price: 0,
    currency: "USD",
    duration: 0,
    lessons: 0,
    isFree: true,
    showOrders: false,
    featured: false,
    students: 0,
    tags: []
  });

  // Fetch course data if in edit mode
  const { data: courseData, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourse(id!),
    enabled: !!id
  });

  // Set course data when fetched
  useEffect(() => {
    if (courseData) {
      setCourse(courseData);
    }
  }, [courseData]);

  // Create or update course mutation
  const mutation = useMutation({
    mutationFn: (data: Partial<Course>) => {
      if (isEditMode) {
        return updateCourse(id!, data);
      } else {
        return createCourse(data as Omit<Course, 'id'>);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: language === "en" ? "Success" : "تم بنجاح",
        description: language === "en"
          ? `Course ${isEditMode ? 'updated' : 'created'} successfully`
          : `تم ${isEditMode ? 'تحديث' : 'إنشاء'} الدورة بنجاح`,
      });
      navigate('/dashboard/courses');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare price data
    let courseData = {...course};
    if (course.isFree) {
      courseData.price = 0;
    }
    
    mutation.mutate(courseData);
  };

  const handleImageSelected = (url: string) => {
    setCourse(prev => ({ ...prev, image: url }));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!course.tags?.includes(newTag)) {
        setCourse(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag]
        }));
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tag: string) => {
    setCourse(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  return (
    <DashboardLayout 
      title={language === "en" 
        ? `${isEditMode ? 'Edit' : 'New'} Course` 
        : `${isEditMode ? 'تعديل' : 'إضافة'} دورة`
      }
      breadcrumbs={[
        { label: language === "en" ? "Courses" : "الدورات", href: "/dashboard/courses" },
        { label: language === "en" ? (isEditMode ? "Edit Course" : "New Course") : (isEditMode ? "تعديل دورة" : "دورة جديدة"), href: "#" }
      ]}
    >
      {isLoadingCourse ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="english" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
              <TabsList>
                <TabsTrigger value="english">
                  {language === "en" ? "English" : "الإنجليزية"}
                </TabsTrigger>
                <TabsTrigger value="arabic">
                  {language === "en" ? "Arabic" : "العربية"}
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/courses')}
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    language === "en" ? "Saving..." : "جارِ الحفظ..."
                  ) : (
                    language === "en" ? "Save Course" : "حفظ الدورة"
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* English Content */}
                <TabsContent value="english" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={course.title}
                        onChange={(e) => setCourse({ ...course, title: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={course.description}
                        onChange={(e) => setCourse({ ...course, description: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <div className="mt-1">
                        <RichTextEditor
                          value={course.content || ""}
                          onChange={(value) => setCourse({ ...course, content: value })}
                          height={400}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Arabic Content */}
                <TabsContent value="arabic" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="titleAr">العنوان</Label>
                      <Input
                        id="titleAr"
                        value={course.titleAr}
                        onChange={(e) => setCourse({ ...course, titleAr: e.target.value })}
                        className="mt-1"
                        dir="rtl"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="descriptionAr">الوصف</Label>
                      <Input
                        id="descriptionAr"
                        value={course.descriptionAr}
                        onChange={(e) => setCourse({ ...course, descriptionAr: e.target.value })}
                        className="mt-1"
                        dir="rtl"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contentAr">المحتوى</Label>
                      <div className="mt-1">
                        <RichTextEditor
                          value={course.contentAr || ""}
                          onChange={(value) => setCourse({ ...course, contentAr: value })}
                          height={400}
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
              
              {/* Sidebar Settings */}
              <div>
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    {/* Course Image */}
                    <div>
                      <Label>{language === "en" ? "Course Image" : "صورة الدورة"}</Label>
                      <div className="mt-2">
                        <MediaSelector 
                          value={course.image}
                          onValueChange={handleImageSelected}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Course Details */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="category">
                          {language === "en" ? "Category" : "التصنيف"}
                        </Label>
                        <Input
                          id="category"
                          value={course.category}
                          onChange={(e) => setCourse({ ...course, category: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="level">
                          {language === "en" ? "Level" : "المستوى"}
                        </Label>
                        <Select
                          value={course.level}
                          onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") => 
                            setCourse({ ...course, level: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Beginner">
                                {language === "en" ? "Beginner" : "مبتدئ"}
                              </SelectItem>
                              <SelectItem value="Intermediate">
                                {language === "en" ? "Intermediate" : "متوسط"}
                              </SelectItem>
                              <SelectItem value="Advanced">
                                {language === "en" ? "Advanced" : "متقدم"}
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duration">
                            {language === "en" ? "Duration (hours)" : "المدة (ساعات)"}
                          </Label>
                          <Input
                            id="duration"
                            type="number"
                            value={course.duration}
                            onChange={(e) => setCourse({ ...course, duration: Number(e.target.value) })}
                            className="mt-1"
                            min="0"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="lessons">
                            {language === "en" ? "Lessons" : "الدروس"}
                          </Label>
                          <Input
                            id="lessons"
                            type="number"
                            value={course.lessons}
                            onChange={(e) => setCourse({ ...course, lessons: Number(e.target.value) })}
                            className="mt-1"
                            min="0"
                          />
                        </div>
                      </div>
                      
                      {/* Price Settings */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="isFree">
                            {language === "en" ? "Free Course" : "دورة مجانية"}
                          </Label>
                          <Switch
                            id="isFree"
                            checked={course.isFree}
                            onCheckedChange={(checked) => setCourse({ ...course, isFree: checked })}
                          />
                        </div>
                        
                        {!course.isFree && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="price">
                                {language === "en" ? "Price" : "السعر"}
                              </Label>
                              <Input
                                id="price"
                                type="number"
                                value={course.price}
                                onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })}
                                className="mt-1"
                                min="0"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="currency">
                                {language === "en" ? "Currency" : "العملة"}
                              </Label>
                              <Input
                                id="currency"
                                value={course.currency}
                                onChange={(e) => setCourse({ ...course, currency: e.target.value })}
                                className="mt-1"
                                placeholder="USD"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Display Settings */}
                      <div className="pt-2 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="featured">
                            {language === "en" ? "Featured Course" : "دورة مميزة"}
                          </Label>
                          <Switch
                            id="featured"
                            checked={course.featured}
                            onCheckedChange={(checked) => setCourse({ ...course, featured: checked })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showOrders">
                            {language === "en" ? "Show Orders Count" : "إظهار عدد الطلبات"}
                          </Label>
                          <Switch
                            id="showOrders"
                            checked={course.showOrders}
                            onCheckedChange={(checked) => setCourse({ ...course, showOrders: checked })}
                          />
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="pt-2">
                        <Label htmlFor="tags">
                          {language === "en" ? "Tags" : "الوسوم"}
                        </Label>
                        <div className="mt-1">
                          <Input
                            id="tags"
                            onKeyDown={handleTagInput}
                            placeholder={language === "en" ? "Press Enter to add" : "اضغط Enter للإضافة"}
                          />
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            {course.tags?.map((tag, index) => (
                              <div 
                                key={index} 
                                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                              >
                                {tag}
                                <button 
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="text-primary/70 hover:text-primary"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
        </form>
      )}
    </DashboardLayout>
  );
};

export default CourseEditor;
