
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
import { getAchievement, createAchievement, updateAchievement } from "@/services/achievement-service";
import { Achievement } from "@/types/achievement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AchievementEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const isEditMode = !!id;
  
  const [achievement, setAchievement] = useState<Partial<Achievement>>({
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    date: new Date().toISOString().split('T')[0],
    category: "Award",
    image: "",
    link: "",
    featured: false
  });

  // Fetch achievement data if in edit mode
  const { data: achievementData, isLoading: isLoadingAchievement } = useQuery({
    queryKey: ['achievement', id],
    queryFn: () => getAchievement(id!),
    enabled: !!id
  });

  // Set achievement data when fetched
  useEffect(() => {
    if (achievementData) {
      setAchievement(achievementData);
    }
  }, [achievementData]);

  // Create or update achievement mutation
  const mutation = useMutation({
    mutationFn: (data: Partial<Achievement>) => {
      if (isEditMode) {
        return updateAchievement(id!, data);
      } else {
        return createAchievement(data as Omit<Achievement, 'id'>);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast({
        title: language === "en" ? "Success" : "تم بنجاح",
        description: language === "en"
          ? `Achievement ${isEditMode ? 'updated' : 'created'} successfully`
          : `تم ${isEditMode ? 'تحديث' : 'إنشاء'} الإنجاز بنجاح`,
      });
      navigate('/dashboard/achievements');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!achievement.title || !achievement.description) {
      toast({
        title: language === "en" ? "Missing Information" : "معلومات ناقصة",
        description: language === "en" 
          ? "Please fill in all required fields." 
          : "الرجاء ملء جميع الحقول المطلوبة.",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(achievement);
  };

  const handleImageSelected = (url: string) => {
    setAchievement(prev => ({ ...prev, image: url }));
  };

  return (
    <DashboardLayout 
      title={language === "en" 
        ? `${isEditMode ? 'Edit' : 'New'} Achievement` 
        : `${isEditMode ? 'تعديل' : 'إضافة'} إنجاز`
      }
      breadcrumbs={[
        { label: language === "en" ? "Achievements" : "الإنجازات", href: "/dashboard/achievements" },
        { label: language === "en" ? (isEditMode ? "Edit" : "New") : (isEditMode ? "تعديل" : "إضافة"), href: "#" }
      ]}
    >
      {isLoadingAchievement ? (
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
                          value={achievement.title}
                          onChange={(e) => setAchievement({ ...achievement, title: e.target.value })}
                          className="mt-1"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={achievement.description}
                          onChange={(e) => setAchievement({ ...achievement, description: e.target.value })}
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
                          value={achievement.titleAr}
                          onChange={(e) => setAchievement({ ...achievement, titleAr: e.target.value })}
                          className="mt-1"
                          dir="rtl"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="descriptionAr">الوصف</Label>
                        <Input
                          id="descriptionAr"
                          value={achievement.descriptionAr}
                          onChange={(e) => setAchievement({ ...achievement, descriptionAr: e.target.value })}
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
                  {/* Achievement Image */}
                  <div>
                    <Label>{language === "en" ? "Achievement Image" : "صورة الإنجاز"}</Label>
                    <div className="mt-2">
                      <MediaSelector 
                        value={achievement.image}
                        onValueChange={handleImageSelected}
                      />
                    </div>
                  </div>
                  
                  {/* Achievement Details */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">
                        {language === "en" ? "Category" : "الفئة"}
                      </Label>
                      <Select
                        value={achievement.category}
                        onValueChange={(value) => setAchievement({ ...achievement, category: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Award">
                            {language === "en" ? "Award" : "جائزة"}
                          </SelectItem>
                          <SelectItem value="Certification">
                            {language === "en" ? "Certification" : "شهادة"}
                          </SelectItem>
                          <SelectItem value="Recognition">
                            {language === "en" ? "Recognition" : "تقدير"}
                          </SelectItem>
                          <SelectItem value="Publication">
                            {language === "en" ? "Publication" : "منشور"}
                          </SelectItem>
                          <SelectItem value="Speaking">
                            {language === "en" ? "Speaking" : "تحدث"}
                          </SelectItem>
                          <SelectItem value="Education">
                            {language === "en" ? "Education" : "تعليم"}
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
                        value={achievement.date}
                        onChange={(e) => setAchievement({ ...achievement, date: e.target.value })}
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
                        value={achievement.link}
                        onChange={(e) => setAchievement({ ...achievement, link: e.target.value })}
                        className="mt-1"
                        placeholder="https://"
                      />
                    </div>
                    
                    {/* Featured setting */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="featured">
                          {language === "en" ? "Featured Achievement" : "إنجاز مميز"}
                        </Label>
                        <Switch
                          id="featured"
                          checked={achievement.featured}
                          onCheckedChange={(checked) => setAchievement({ ...achievement, featured: checked })}
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
                  onClick={() => navigate('/dashboard/achievements')}
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </Button>
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    language === "en" ? "Saving..." : "جارِ الحفظ..."
                  ) : (
                    language === "en" ? "Save Achievement" : "حفظ الإنجاز"
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

export default AchievementEditor;
