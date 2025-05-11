
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
import { getCourse, createCourse, updateCourse } from "@/services/course-service";
import { Course } from "@/services/course-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    category: "",
    level: "Beginner",
    price: 0,
    currency: "USD",
    duration: 0,
    students: 0,
    isFree: false,
    isPublished: false,
    featured: false
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
        return createCourse(data as Omit<Course, 'id' | 'created_at' | 'updated_at'>);
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
    
    if (!course.title || !course.description) {
      toast({
        title: language === "en" ? "Missing Information" : "معلومات ناقصة",
        description: language === "en" 
          ? "Please fill in all required fields." 
          : "الرجاء ملء جميع الحقول المطلوبة.",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(course);
  };

  const handleImageSelected = (url: string) => {
    setCourse(prev => ({ ...prev, image: url }));
  };

  return (
    <DashboardLayout 
      title={language === "en" 
        ? `${isEditMode ? 'Edit' : 'New'} Course` 
        : `${isEditMode ? 'تعديل' : 'إضافة'} دورة`
      }
      breadcrumbs={[
        { label: language === "en" ? "Courses" : "الدورات", href: "/dashboard/courses" },
        { label: language === "en" ? (isEditMode ? "Edit" : "New") : (isEditMode ? "تعديل" : "إضافة"), href: "#" }
      ]}
    >
      {isLoadingCourse ? (
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
                          value={course.title}
                          onChange={(e) => setCourse({ ...course, title: e.target.value })}
                          className="mt-1"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={course.description}
                          onChange={(e) => setCourse({ ...course, description: e.target.value })}
                          className="mt-1"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="content">Course Content</Label>
                        <Textarea
                          id="content"
                          value={course.content}
                          onChange={(e) => setCourse({ ...course, content: e.target.value })}
                          className="mt-1 min-h-[200px]"
                        />
                      </div>
                    </TabsContent>
                    
                    {/* Arabic Content */}
                    <TabsContent value="arabic" className="space-y-4">
                      <div>
                        <Label htmlFor="titleAr">العنوان</Label>
                        <Input
                          id="titleAr"
                          value={course.titleAr}
                          onChange={(e) => setCourse({ ...course, titleAr: e.target.value })}
                          className="mt-1"
                          dir="rtl"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="descriptionAr">الوصف</Label>
                        <Textarea
                          id="descriptionAr"
                          value={course.descriptionAr}
                          onChange={(e) => setCourse({ ...course, descriptionAr: e.target.value })}
                          className="mt-1"
                          dir="rtl"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="contentAr">محتوى الدورة</Label>
                        <Textarea
                          id="contentAr"
                          value={course.contentAr}
                          onChange={(e) => setCourse({ ...course, contentAr: e.target.value })}
                          className="mt-1 min-h-[200px]"
                          dir="rtl"
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
                  
                  {/* Course Details */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">
                        {language === "en" ? "Category" : "الفئة"}
                      </Label>
                      <Input
                        id="category"
                        value={course.category}
                        onChange={(e) => setCourse({ ...course, category: e.target.value })}
                        className="mt-1"
                        placeholder={language === "en" ? "e.g. Web Development" : "مثال: تطوير الويب"}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="level">
                        {language === "en" ? "Level" : "المستوى"}
                      </Label>
                      <Select
                        value={course.level}
                        onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") => setCourse({ ...course, level: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">
                            {language === "en" ? "Beginner" : "مبتدئ"}
                          </SelectItem>
                          <SelectItem value="Intermediate">
                            {language === "en" ? "Intermediate" : "متوسط"}
                          </SelectItem>
                          <SelectItem value="Advanced">
                            {language === "en" ? "Advanced" : "متقدم"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">
                          {language === "en" ? "Price" : "السعر"}
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          value={course.price}
                          onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) })}
                          className="mt-1"
                          min="0"
                          disabled={course.isFree}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="currency">
                          {language === "en" ? "Currency" : "العملة"}
                        </Label>
                        <Select
                          value={course.currency}
                          onValueChange={(value) => setCourse({ ...course, currency: value })}
                          disabled={course.isFree}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="SAR">SAR</SelectItem>
                            <SelectItem value="AED">AED</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="duration">
                          {language === "en" ? "Duration (hours)" : "المدة (بالساعات)"}
                        </Label>
                        <Input
                          id="duration"
                          type="number"
                          value={course.duration}
                          onChange={(e) => setCourse({ ...course, duration: parseInt(e.target.value) })}
                          className="mt-1"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="students">
                          {language === "en" ? "Students" : "الطلاب"}
                        </Label>
                        <Input
                          id="students"
                          type="number"
                          value={course.students}
                          onChange={(e) => setCourse({ ...course, students: parseInt(e.target.value) })}
                          className="mt-1"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isFree">
                          {language === "en" ? "Free Course" : "دورة مجانية"}
                        </Label>
                        <Switch
                          id="isFree"
                          checked={course.isFree}
                          onCheckedChange={(checked) => setCourse({ ...course, isFree: checked, price: checked ? 0 : course.price })}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isPublished">
                          {language === "en" ? "Publish Course" : "نشر الدورة"}
                        </Label>
                        <Switch
                          id="isPublished"
                          checked={course.isPublished}
                          onCheckedChange={(checked) => setCourse({ ...course, isPublished: checked })}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-2">
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
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/dashboard/courses')}
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </Button>
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    language === "en" ? "Saving..." : "جارِ الحفظ..."
                  ) : (
                    language === "en" ? "Save Course" : "حفظ الدورة"
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

export default CourseEditor;
