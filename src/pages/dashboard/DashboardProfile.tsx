
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Image as ImageIcon,
  Edit,
  Trash2,
  Plus,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Globe,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  School,
  MoreVertical
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { MediaSelector } from "@/components/media/MediaSelector";
import { Separator } from "@/components/ui/separator";
import { Profile, Experience, Education, Skill, GalleryItem } from "@/types/profile";
import { 
  getProfile, 
  updateProfile, 
  addExperience, 
  updateExperience, 
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addSkill,
  updateSkill,
  deleteSkill,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from "@/services/profile-service";

const formSchema = z.object({
  name: z.string().min(1, { message: "الاسم مطلوب" }),
  nameAr: z.string().min(1, { message: "الاسم بالعربية مطلوب" }),
  bio: z.string(),
  bioAr: z.string(),
  avatar: z.string().optional(),
  coverImage: z.string().optional(),
  title: z.string().optional(),
  titleAr: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  locationAr: z.string().optional(),
  social: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    website: z.string().optional()
  }).optional()
});

type FormValues = z.infer<typeof formSchema>;

const experienceSchema = z.object({
  title: z.string().min(1, { message: "العنوان الوظيفي مطلوب" }),
  titleAr: z.string().min(1, { message: "العنوان الوظيفي بالعربية مطلوب" }),
  company: z.string().min(1, { message: "اسم الشركة مطلوب" }),
  companyAr: z.string().min(1, { message: "اسم الشركة بالعربية مطلوب" }),
  location: z.string().optional(),
  locationAr: z.string().optional(),
  startDate: z.string().min(1, { message: "تاريخ البداية مطلوب" }),
  endDate: z.string().nullable(),
  description: z.string(),
  descriptionAr: z.string(),
  current: z.boolean().default(false)
});

const educationSchema = z.object({
  degree: z.string().min(1, { message: "الدرجة العلمية مطلوبة" }),
  degreeAr: z.string().min(1, { message: "الدرجة العلمية بالعربية مطلوبة" }),
  institution: z.string().min(1, { message: "اسم المؤسسة التعليمية مطلوب" }),
  institutionAr: z.string().min(1, { message: "اسم المؤسسة التعليمية بالعربية مطلوب" }),
  location: z.string().optional(),
  locationAr: z.string().optional(),
  startDate: z.string().min(1, { message: "تاريخ البداية مطلوب" }),
  endDate: z.string().nullable(),
  description: z.string(),
  descriptionAr: z.string(),
  current: z.boolean().default(false)
});

const skillSchema = z.object({
  name: z.string().min(1, { message: "اسم المهارة مطلوب" }),
  nameAr: z.string().min(1, { message: "اسم المهارة بالعربية مطلوب" }),
  level: z.number().min(1).max(100),
  category: z.string().min(1, { message: "تصنيف المهارة مطلوب" })
});

const galleryItemSchema = z.object({
  url: z.string().min(1, { message: "الرابط مطلوب" }),
  title: z.string().min(1, { message: "العنوان مطلوب" }),
  titleAr: z.string().min(1, { message: "العنوان بالعربية مطلوب" }),
  description: z.string().optional(),
  descriptionAr: z.string().optional()
});

const DashboardProfile = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("basic");
  const [editExperienceModal, setEditExperienceModal] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);
  
  const [editEducationModal, setEditEducationModal] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
  const [educationToDelete, setEducationToDelete] = useState<string | null>(null);
  
  const [editSkillModal, setEditSkillModal] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  
  const [editGalleryModal, setEditGalleryModal] = useState(false);
  const [currentGalleryItem, setCurrentGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryItemToDelete, setGalleryItemToDelete] = useState<string | null>(null);

  // جلب بيانات الملف الشخصي
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  // تحديث الملف الشخصي
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<Profile>) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: language === "en" ? "Profile Updated" : "تم تحديث الملف الشخصي",
        description: language === "en" 
          ? "Your profile has been updated successfully." 
          : "تم تحديث ملفك الشخصي بنجاح."
      });
    }
  });

  // إضافة خبرة عملية جديدة
  const addExperienceMutation = useMutation({
    mutationFn: (experience: Experience) => addExperience(experience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditExperienceModal(false);
      setCurrentExperience(null);
      toast({
        title: language === "en" ? "Experience Added" : "تمت إضافة الخبرة",
        description: language === "en" 
          ? "The experience has been added to your profile." 
          : "تمت إضافة الخبرة إلى ملفك الشخصي."
      });
    }
  });

  // تعديل خبرة عملية
  const updateExperienceMutation = useMutation({
    mutationFn: (experience: Experience) => updateExperience(experience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditExperienceModal(false);
      setCurrentExperience(null);
      toast({
        title: language === "en" ? "Experience Updated" : "تم تحديث الخبرة",
        description: language === "en" 
          ? "The experience has been updated successfully." 
          : "تم تحديث الخبرة بنجاح."
      });
    }
  });

  // حذف خبرة عملية
  const deleteExperienceMutation = useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setExperienceToDelete(null);
      toast({
        title: language === "en" ? "Experience Deleted" : "تم حذف الخبرة",
        description: language === "en" 
          ? "The experience has been deleted from your profile." 
          : "تم حذف الخبرة من ملفك الشخصي."
      });
    }
  });

  // إضافة تعليم جديد
  const addEducationMutation = useMutation({
    mutationFn: (education: Education) => addEducation(education),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditEducationModal(false);
      setCurrentEducation(null);
      toast({
        title: language === "en" ? "Education Added" : "تمت إضافة التعليم",
        description: language === "en" 
          ? "The education has been added to your profile." 
          : "تمت إضافة التعليم إلى ملفك الشخصي."
      });
    }
  });

  // تعديل تعليم
  const updateEducationMutation = useMutation({
    mutationFn: (education: Education) => updateEducation(education),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditEducationModal(false);
      setCurrentEducation(null);
      toast({
        title: language === "en" ? "Education Updated" : "تم تحديث التعليم",
        description: language === "en" 
          ? "The education has been updated successfully." 
          : "تم تحديث التعليم بنجاح."
      });
    }
  });

  // حذف تعليم
  const deleteEducationMutation = useMutation({
    mutationFn: (id: string) => deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEducationToDelete(null);
      toast({
        title: language === "en" ? "Education Deleted" : "تم حذف التعليم",
        description: language === "en" 
          ? "The education has been deleted from your profile." 
          : "تم حذف التعليم من ملفك الشخصي."
      });
    }
  });

  // إضافة مهارة جديدة
  const addSkillMutation = useMutation({
    mutationFn: (skill: Skill) => addSkill(skill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditSkillModal(false);
      setCurrentSkill(null);
      toast({
        title: language === "en" ? "Skill Added" : "تمت إضافة المهارة",
        description: language === "en" 
          ? "The skill has been added to your profile." 
          : "تمت إضافة المهارة إلى ملفك الشخصي."
      });
    }
  });

  // تعديل مهارة
  const updateSkillMutation = useMutation({
    mutationFn: (skill: Skill) => updateSkill(skill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditSkillModal(false);
      setCurrentSkill(null);
      toast({
        title: language === "en" ? "Skill Updated" : "تم تحديث المهارة",
        description: language === "en" 
          ? "The skill has been updated successfully." 
          : "تم تحديث المهارة بنجاح."
      });
    }
  });

  // حذف مهارة
  const deleteSkillMutation = useMutation({
    mutationFn: (id: string) => deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setSkillToDelete(null);
      toast({
        title: language === "en" ? "Skill Deleted" : "تم حذف المهارة",
        description: language === "en" 
          ? "The skill has been deleted from your profile." 
          : "تم حذف المهارة من ملفك الشخصي."
      });
    }
  });

  // إضافة عنصر للمعرض
  const addGalleryItemMutation = useMutation({
    mutationFn: (item: GalleryItem) => addGalleryItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditGalleryModal(false);
      setCurrentGalleryItem(null);
      toast({
        title: language === "en" ? "Gallery Item Added" : "تمت إضافة عنصر للمعرض",
        description: language === "en" 
          ? "The gallery item has been added to your profile." 
          : "تمت إضافة العنصر إلى معرض ملفك الشخصي."
      });
    }
  });

  // تعديل عنصر في المعرض
  const updateGalleryItemMutation = useMutation({
    mutationFn: (item: GalleryItem) => updateGalleryItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditGalleryModal(false);
      setCurrentGalleryItem(null);
      toast({
        title: language === "en" ? "Gallery Item Updated" : "تم تحديث عنصر المعرض",
        description: language === "en" 
          ? "The gallery item has been updated successfully." 
          : "تم تحديث عنصر المعرض بنجاح."
      });
    }
  });

  // حذف عنصر من المعرض
  const deleteGalleryItemMutation = useMutation({
    mutationFn: (id: string) => deleteGalleryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setGalleryItemToDelete(null);
      toast({
        title: language === "en" ? "Gallery Item Deleted" : "تم حذف عنصر المعرض",
        description: language === "en" 
          ? "The gallery item has been deleted from your profile." 
          : "تم حذف العنصر من معرض ملفك الشخصي."
      });
    }
  });

  // الدوال الخاصة بنماذج التحكم
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      bio: "",
      bioAr: "",
      avatar: "",
      coverImage: "",
      title: "",
      titleAr: "",
      email: "",
      phone: "",
      location: "",
      locationAr: "",
      social: {
        github: "",
        linkedin: "",
        twitter: "",
        facebook: "",
        instagram: "",
        website: ""
      }
    }
  });

  // تحميل البيانات الحالية في النموذج
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        nameAr: profile.nameAr || "",
        bio: profile.bio || "",
        bioAr: profile.bioAr || "",
        avatar: profile.avatar || "",
        coverImage: profile.coverImage || "",
        title: profile.title || "",
        titleAr: profile.titleAr || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        locationAr: profile.locationAr || "",
        social: {
          github: profile.social?.github || "",
          linkedin: profile.social?.linkedin || "",
          twitter: profile.social?.twitter || "",
          facebook: profile.social?.facebook || "",
          instagram: profile.social?.instagram || "",
          website: profile.social?.website || ""
        }
      });
    }
  }, [profile, form]);

  // تقديم النموذج الأساسي
  const onSubmit = (data: FormValues) => {
    updateProfileMutation.mutate({
      ...data,
      id: profile?.id
    });
  };

  // إضافة أو تعديل خبرة عملية
  const handleExperienceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const experience: Experience = {
      id: currentExperience?.id || uuidv4(),
      title: formData.get('title') as string,
      titleAr: formData.get('titleAr') as string,
      company: formData.get('company') as string,
      companyAr: formData.get('companyAr') as string,
      location: formData.get('location') as string,
      locationAr: formData.get('locationAr') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('current') === 'true' ? null : formData.get('endDate') as string,
      description: formData.get('description') as string,
      descriptionAr: formData.get('descriptionAr') as string,
      current: formData.get('current') === 'true'
    };

    if (currentExperience) {
      updateExperienceMutation.mutate(experience);
    } else {
      addExperienceMutation.mutate(experience);
    }
  };

  // إضافة أو تعديل تعليم
  const handleEducationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const education: Education = {
      id: currentEducation?.id || uuidv4(),
      degree: formData.get('degree') as string,
      degreeAr: formData.get('degreeAr') as string,
      institution: formData.get('institution') as string,
      institutionAr: formData.get('institutionAr') as string,
      location: formData.get('location') as string,
      locationAr: formData.get('locationAr') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('current') === 'true' ? null : formData.get('endDate') as string,
      description: formData.get('description') as string,
      descriptionAr: formData.get('descriptionAr') as string,
      current: formData.get('current') === 'true'
    };

    if (currentEducation) {
      updateEducationMutation.mutate(education);
    } else {
      addEducationMutation.mutate(education);
    }
  };

  // إضافة أو تعديل مهارة
  const handleSkillSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const skill: Skill = {
      id: currentSkill?.id || uuidv4(),
      name: formData.get('name') as string,
      nameAr: formData.get('nameAr') as string,
      level: parseInt(formData.get('level') as string),
      category: formData.get('category') as string
    };

    if (currentSkill) {
      updateSkillMutation.mutate(skill);
    } else {
      addSkillMutation.mutate(skill);
    }
  };

  // إضافة أو تعديل عنصر في المعرض
  const handleGalleryItemSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const item: GalleryItem = {
      id: currentGalleryItem?.id || uuidv4(),
      url: formData.get('url') as string,
      title: formData.get('title') as string,
      titleAr: formData.get('titleAr') as string,
      description: formData.get('description') as string,
      descriptionAr: formData.get('descriptionAr') as string
    };

    if (currentGalleryItem) {
      updateGalleryItemMutation.mutate(item);
    } else {
      addGalleryItemMutation.mutate(item);
    }
  };

  // معاينة الصفحة
  const handlePreview = () => {
    navigate('/about-me');
  };

  return (
    <DashboardLayout 
      title={language === "en" ? "Profile Settings" : "إعدادات الملف الشخصي"}
      breadcrumbs={[
        { label: language === "en" ? "Settings" : "الإعدادات", href: "/dashboard/settings" },
        { label: language === "en" ? "Profile" : "الملف الشخصي", href: "/dashboard/profile" }
      ]}
    >
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handlePreview} variant="outline" className="gap-2">
              <Globe className="h-4 w-4" />
              {language === "en" ? "Preview Page" : "معاينة الصفحة"}
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">
                <User className="h-4 w-4 mr-2" />
                {language === "en" ? "Basic Info" : "المعلومات الأساسية"}
              </TabsTrigger>
              <TabsTrigger value="experience">
                <Briefcase className="h-4 w-4 mr-2" />
                {language === "en" ? "Experience" : "الخبرات العملية"}
              </TabsTrigger>
              <TabsTrigger value="education">
                <GraduationCap className="h-4 w-4 mr-2" />
                {language === "en" ? "Education" : "التعليم"}
              </TabsTrigger>
              <TabsTrigger value="skills">
                <Code className="h-4 w-4 mr-2" />
                {language === "en" ? "Skills" : "المهارات"}
              </TabsTrigger>
              <TabsTrigger value="gallery">
                <ImageIcon className="h-4 w-4 mr-2" />
                {language === "en" ? "Gallery" : "المعرض"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "en" ? "Basic Information" : "المعلومات الأساسية"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* الصورة الشخصية */}
                        <div>
                          <FormLabel>
                            {language === "en" ? "Profile Picture" : "الصورة الشخصية"}
                          </FormLabel>
                          <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <MediaSelector
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    type="image"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        {/* صورة الغلاف */}
                        <div>
                          <FormLabel>
                            {language === "en" ? "Cover Image" : "صورة الغلاف"}
                          </FormLabel>
                          <FormField
                            control={form.control}
                            name="coverImage"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <MediaSelector
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    type="image"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        {/* الاسم */}
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {language === "en" ? "Name" : "الاسم"}
                              </FormLabel>
                              <FormControl>
                                <Input placeholder={language === "en" ? "Enter your name" : "أدخل اسمك"} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* الاسم بالعربية */}
                        <FormField
                          control={form.control}
                          name="nameAr"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {language === "en" ? "Name (Arabic)" : "الاسم (بالعربية)"}
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="أدخل اسمك بالعربية" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* المسمى الوظيفي */}
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {language === "en" ? "Title" : "المسمى الوظيفي"}
                              </FormLabel>
                              <FormControl>
                                <Input placeholder={language === "en" ? "e.g. Web Developer" : "مثال: مطور ويب"} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* المسمى الوظيفي بالعربية */}
                        <FormField
                          control={form.control}
                          name="titleAr"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {language === "en" ? "Title (Arabic)" : "المسمى الوظيفي (بالعربية)"}
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="مثال: مطور ويب" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* البريد الإلكتروني */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {language === "en" ? "Email" : "البريد الإلكتروني"}
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="example@domain.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* رقم الهاتف */}
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {language === "en" ? "Phone" : "رقم الهاتف"}
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="+966 5xxxxxxxx" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* حساب جيثب */}
                        <FormField
                          control={form.control}
                          name="social.github"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Github className="h-4 w-4" />
                                {language === "en" ? "GitHub" : "جيثب"}
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="https://github.com/username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* حساب لينكدإن */}
                        <FormField
                          control={form.control}
                          name="social.linkedin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Linkedin className="h-4 w-4" />
                                {language === "en" ? "LinkedIn" : "لينكدإن"}
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="https://linkedin.com/in/username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* حساب تويتر */}
                        <FormField
                          control={form.control}
                          name="social.twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Twitter className="h-4 w-4" />
                                {language === "en" ? "Twitter" : "تويتر"}
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="https://twitter.com/username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* الموقع الشخصي */}
                        <FormField
                          control={form.control}
                          name="social.website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                {language === "en" ? "Website" : "الموقع الإلكتروني"}
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="https://yourwebsite.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* الموقع الجغرافي */}
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {language === "en" ? "Location" : "الموقع الجغرافي"}
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Riyadh, Saudi Arabia" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* الموقع الجغرافي بالعربية */}
                        <FormField
                          control={form.control}
                          name="locationAr"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {language === "en" ? "Location (Arabic)" : "الموقع الجغرافي (بالعربية)"}
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="مثال: الرياض، المملكة العربية السعودية" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* نبذة مختصرة */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {language === "en" ? "Bio" : "نبذة مختصرة"}
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder={language === "en" ? "Tell us about yourself" : "اكتب نبذة عن نفسك"} 
                                  className="min-h-32"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bioAr"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {language === "en" ? "Bio (Arabic)" : "نبذة مختصرة (بالعربية)"}
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="اكتب نبذة عن نفسك بالعربية" 
                                  className="min-h-32"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit">
                          {language === "en" ? "Save Changes" : "حفظ التغييرات"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="experience">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>
                    {language === "en" ? "Work Experience" : "الخبرات العملية"}
                  </CardTitle>
                  <Button onClick={() => {
                    setCurrentExperience(null);
                    setEditExperienceModal(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "en" ? "Add Experience" : "إضافة خبرة"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {profile?.experiences && profile.experiences.length > 0 ? (
                    <div className="space-y-6">
                      {profile.experiences.map((exp) => (
                        <div key={exp.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{language === "en" ? exp.title : exp.titleAr}</h3>
                              <div className="text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Building className="h-4 w-4" />
                                  <span>{language === "en" ? exp.company : exp.companyAr}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{language === "en" ? exp.location : exp.locationAr}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(exp.startDate).toLocaleDateString(
                                      language === "en" ? "en-US" : "ar-SA",
                                      { year: 'numeric', month: 'short' }
                                    )}
                                    {' - '}
                                    {exp.current ? 
                                      (language === "en" ? "Present" : "حتى الآن") : 
                                      new Date(exp.endDate as string).toLocaleDateString(
                                        language === "en" ? "en-US" : "ar-SA",
                                        { year: 'numeric', month: 'short' }
                                      )
                                    }
                                  </span>
                                </div>
                              </div>
                              <p className="mt-2">
                                {language === "en" ? exp.description : exp.descriptionAr}
                              </p>
                            </div>
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    {language === "en" ? "Actions" : "الإجراءات"}
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => {
                                    setCurrentExperience(exp);
                                    setEditExperienceModal(true);
                                  }}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    {language === "en" ? "Edit" : "تعديل"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => setExperienceToDelete(exp.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {language === "en" ? "Delete" : "حذف"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {language === "en" 
                          ? "No work experience added yet. Click 'Add Experience' to add your work history." 
                          : "لم يتم إضافة أي خبرات عملية بعد. اضغط على 'إضافة خبرة' لإضافة تاريخك المهني."
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* تحرير الخبرة العملية */}
              <AlertDialog open={editExperienceModal} onOpenChange={setEditExperienceModal}>
                <AlertDialogContent className="max-w-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {currentExperience 
                        ? language === "en" ? "Edit Experience" : "تعديل الخبرة العملية"
                        : language === "en" ? "Add New Experience" : "إضافة خبرة عملية جديدة"
                      }
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <form onSubmit={handleExperienceSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* المسمى الوظيفي */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="title">
                          {language === "en" ? "Job Title" : "المسمى الوظيفي"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="title"
                          name="title"
                          placeholder={language === "en" ? "e.g. Senior Developer" : "مثال: مطور أول"}
                          defaultValue={currentExperience?.title || ""}
                          required
                        />
                      </div>
                      
                      {/* المسمى الوظيفي بالعربية */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="titleAr">
                          {language === "en" ? "Job Title (Arabic)" : "المسمى الوظيفي (بالعربية)"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="titleAr"
                          name="titleAr"
                          placeholder="مثال: مطور أول"
                          defaultValue={currentExperience?.titleAr || ""}
                          required
                        />
                      </div>
                      
                      {/* اسم الشركة */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="company">
                          {language === "en" ? "Company" : "اسم الشركة"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="company"
                          name="company"
                          placeholder={language === "en" ? "e.g. Tech Solutions Inc." : "مثال: شركة الحلول التقنية"}
                          defaultValue={currentExperience?.company || ""}
                          required
                        />
                      </div>
                      
                      {/* اسم الشركة بالعربية */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="companyAr">
                          {language === "en" ? "Company (Arabic)" : "اسم الشركة (بالعربية)"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="companyAr"
                          name="companyAr"
                          placeholder="مثال: شركة الحلول التقنية"
                          defaultValue={currentExperience?.companyAr || ""}
                          required
                        />
                      </div>
                      
                      {/* الموقع */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="location">
                          {language === "en" ? "Location" : "الموقع"}
                        </FormLabel>
                        <Input 
                          id="location"
                          name="location"
                          placeholder={language === "en" ? "e.g. Riyadh, Saudi Arabia" : "مثال: الرياض، السعودية"}
                          defaultValue={currentExperience?.location || ""}
                        />
                      </div>
                      
                      {/* الموقع بالعربية */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="locationAr">
                          {language === "en" ? "Location (Arabic)" : "الموقع (بالعربية)"}
                        </FormLabel>
                        <Input 
                          id="locationAr"
                          name="locationAr"
                          placeholder="مثال: الرياض، المملكة العربية السعودية"
                          defaultValue={currentExperience?.locationAr || ""}
                        />
                      </div>
                      
                      {/* تاريخ البدء */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="startDate">
                          {language === "en" ? "Start Date" : "تاريخ البدء"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="startDate"
                          name="startDate"
                          type="date"
                          defaultValue={currentExperience?.startDate || ""}
                          required
                        />
                      </div>
                      
                      {/* الوظيفة الحالية */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="current">
                          {language === "en" ? "Current Job" : "الوظيفة الحالية"}
                        </FormLabel>
                        <div className="flex items-center space-x-2">
                          <RadioGroup 
                            defaultValue={currentExperience?.current ? "true" : "false"}
                            name="current"
                            className="flex items-center gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id="current-true" />
                              <FormLabel htmlFor="current-true">
                                {language === "en" ? "Yes" : "نعم"}
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id="current-false" />
                              <FormLabel htmlFor="current-false">
                                {language === "en" ? "No" : "لا"}
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      
                      {/* تاريخ الانتهاء */}
                      {!(currentExperience?.current) && (
                        <div className="space-y-2">
                          <FormLabel htmlFor="endDate">
                            {language === "en" ? "End Date" : "تاريخ الانتهاء"}
                          </FormLabel>
                          <Input 
                            id="endDate"
                            name="endDate"
                            type="date"
                            defaultValue={currentExperience?.endDate || ""}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* الوصف */}
                    <div className="space-y-2">
                      <FormLabel htmlFor="description">
                        {language === "en" ? "Description" : "الوصف"}
                      </FormLabel>
                      <Textarea 
                        id="description"
                        name="description"
                        placeholder={language === "en" 
                          ? "Describe your responsibilities and achievements in this role"
                          : "اشرح مسؤولياتك وإنجازاتك في هذا الدور"
                        }
                        className="min-h-32"
                        defaultValue={currentExperience?.description || ""}
                      />
                    </div>
                    
                    {/* الوصف بالعربية */}
                    <div className="space-y-2">
                      <FormLabel htmlFor="descriptionAr">
                        {language === "en" ? "Description (Arabic)" : "الوصف (بالعربية)"}
                      </FormLabel>
                      <Textarea 
                        id="descriptionAr"
                        name="descriptionAr"
                        placeholder="اشرح مسؤولياتك وإنجازاتك في هذا الدور باللغة العربية"
                        className="min-h-32"
                        defaultValue={currentExperience?.descriptionAr || ""}
                      />
                    </div>
                    
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {language === "en" ? "Cancel" : "إلغاء"}
                      </AlertDialogCancel>
                      <Button type="submit">
                        {currentExperience
                          ? language === "en" ? "Update" : "تحديث"
                          : language === "en" ? "Add" : "إضافة"
                        }
                      </Button>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
              
              {/* تأكيد حذف الخبرة */}
              <AlertDialog 
                open={!!experienceToDelete} 
                onOpenChange={(open) => !open && setExperienceToDelete(null)}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {language === "en" ? "Delete Experience" : "حذف الخبرة العملية"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {language === "en"
                        ? "Are you sure you want to delete this work experience? This action cannot be undone."
                        : "هل أنت متأكد من أنك تريد حذف هذه الخبرة العملية؟ لا يمكن التراجع عن هذا الإجراء."
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {language === "en" ? "Cancel" : "إلغاء"}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => experienceToDelete && deleteExperienceMutation.mutate(experienceToDelete)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {language === "en" ? "Delete" : "حذف"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>
            
            <TabsContent value="education">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>
                    {language === "en" ? "Education" : "التعليم"}
                  </CardTitle>
                  <Button onClick={() => {
                    setCurrentEducation(null);
                    setEditEducationModal(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "en" ? "Add Education" : "إضافة تعليم"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {profile?.education && profile.education.length > 0 ? (
                    <div className="space-y-6">
                      {profile.education.map((edu) => (
                        <div key={edu.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{language === "en" ? edu.degree : edu.degreeAr}</h3>
                              <div className="text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <School className="h-4 w-4" />
                                  <span>{language === "en" ? edu.institution : edu.institutionAr}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{language === "en" ? edu.location : edu.locationAr}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(edu.startDate).toLocaleDateString(
                                      language === "en" ? "en-US" : "ar-SA",
                                      { year: 'numeric', month: 'short' }
                                    )}
                                    {' - '}
                                    {edu.current ? 
                                      (language === "en" ? "Present" : "حتى الآن") : 
                                      new Date(edu.endDate as string).toLocaleDateString(
                                        language === "en" ? "en-US" : "ar-SA",
                                        { year: 'numeric', month: 'short' }
                                      )
                                    }
                                  </span>
                                </div>
                              </div>
                              <p className="mt-2">
                                {language === "en" ? edu.description : edu.descriptionAr}
                              </p>
                            </div>
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    {language === "en" ? "Actions" : "الإجراءات"}
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => {
                                    setCurrentEducation(edu);
                                    setEditEducationModal(true);
                                  }}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    {language === "en" ? "Edit" : "تعديل"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => setEducationToDelete(edu.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {language === "en" ? "Delete" : "حذف"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {language === "en" 
                          ? "No education added yet. Click 'Add Education' to add your academic background." 
                          : "لم يتم إضافة أي تعليم بعد. اضغط على 'إضافة تعليم' لإضافة خلفيتك الأكاديمية."
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* تحرير التعليم */}
              <AlertDialog open={editEducationModal} onOpenChange={setEditEducationModal}>
                <AlertDialogContent className="max-w-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {currentEducation 
                        ? language === "en" ? "Edit Education" : "تعديل التعليم"
                        : language === "en" ? "Add New Education" : "إضافة تعليم جديد"
                      }
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <form onSubmit={handleEducationSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* الدرجة العلمية */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="degree">
                          {language === "en" ? "Degree" : "الدرجة العلمية"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="degree"
                          name="degree"
                          placeholder={language === "en" ? "e.g. Bachelor of Computer Science" : "مثال: بكالوريوس علوم الحاسب"}
                          defaultValue={currentEducation?.degree || ""}
                          required
                        />
                      </div>
                      
                      {/* الدرجة العلمية بالعربية */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="degreeAr">
                          {language === "en" ? "Degree (Arabic)" : "الدرجة العلمية (بالعربية)"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="degreeAr"
                          name="degreeAr"
                          placeholder="مثال: بكالوريوس علوم الحاسب"
                          defaultValue={currentEducation?.degreeAr || ""}
                          required
                        />
                      </div>
                      
                      {/* اسم المؤسسة التعليمية */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="institution">
                          {language === "en" ? "Institution" : "المؤسسة التعليمية"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="institution"
                          name="institution"
                          placeholder={language === "en" ? "e.g. King Saud University" : "مثال: جامعة الملك سعود"}
                          defaultValue={currentEducation?.institution || ""}
                          required
                        />
                      </div>
                      
                      {/* اسم المؤسسة التعليمية بالعربية */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="institutionAr">
                          {language === "en" ? "Institution (Arabic)" : "المؤسسة التعليمية (بالعربية)"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="institutionAr"
                          name="institutionAr"
                          placeholder="مثال: جامعة الملك سعود"
                          defaultValue={currentEducation?.institutionAr || ""}
                          required
                        />
                      </div>
                      
                      {/* الموقع */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="location">
                          {language === "en" ? "Location" : "الموقع"}
                        </FormLabel>
                        <Input 
                          id="location"
                          name="location"
                          placeholder={language === "en" ? "e.g. Riyadh, Saudi Arabia" : "مثال: الرياض، السعودية"}
                          defaultValue={currentEducation?.location || ""}
                        />
                      </div>
                      
                      {/* الموقع بالعربية */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="locationAr">
                          {language === "en" ? "Location (Arabic)" : "الموقع (بالعربية)"}
                        </FormLabel>
                        <Input 
                          id="locationAr"
                          name="locationAr"
                          placeholder="مثال: الرياض، المملكة العربية السعودية"
                          defaultValue={currentEducation?.locationAr || ""}
                        />
                      </div>
                      
                      {/* تاريخ البدء */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="startDate">
                          {language === "en" ? "Start Date" : "تاريخ البدء"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="startDate"
                          name="startDate"
                          type="date"
                          defaultValue={currentEducation?.startDate || ""}
                          required
                        />
                      </div>
                      
                      {/* الدراسة الحالية */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="current">
                          {language === "en" ? "Current Study" : "الدراسة الحالية"}
                        </FormLabel>
                        <div className="flex items-center space-x-2">
                          <RadioGroup 
                            defaultValue={currentEducation?.current ? "true" : "false"}
                            name="current"
                            className="flex items-center gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id="edu-current-true" />
                              <FormLabel htmlFor="edu-current-true">
                                {language === "en" ? "Yes" : "نعم"}
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id="edu-current-false" />
                              <FormLabel htmlFor="edu-current-false">
                                {language === "en" ? "No" : "لا"}
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      
                      {/* تاريخ الانتهاء */}
                      {!(currentEducation?.current) && (
                        <div className="space-y-2">
                          <FormLabel htmlFor="endDate">
                            {language === "en" ? "End Date" : "تاريخ الانتهاء"}
                          </FormLabel>
                          <Input 
                            id="endDate"
                            name="endDate"
                            type="date"
                            defaultValue={currentEducation?.endDate || ""}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* الوصف */}
                    <div className="space-y-2">
                      <FormLabel htmlFor="description">
                        {language === "en" ? "Description" : "الوصف"}
                      </FormLabel>
                      <Textarea 
                        id="description"
                        name="description"
                        placeholder={language === "en" 
                          ? "Describe your studies, achievements, thesis, etc."
                          : "اشرح دراستك، إنجازاتك، أطروحتك، إلخ."
                        }
                        className="min-h-32"
                        defaultValue={currentEducation?.description || ""}
                      />
                    </div>
                    
                    {/* الوصف بالعربية */}
                    <div className="space-y-2">
                      <FormLabel htmlFor="descriptionAr">
                        {language === "en" ? "Description (Arabic)" : "الوصف (بالعربية)"}
                      </FormLabel>
                      <Textarea 
                        id="descriptionAr"
                        name="descriptionAr"
                        placeholder="اشرح دراستك، إنجازاتك، أطروحتك، إلخ باللغة العربية"
                        className="min-h-32"
                        defaultValue={currentEducation?.descriptionAr || ""}
                      />
                    </div>
                    
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {language === "en" ? "Cancel" : "إلغاء"}
                      </AlertDialogCancel>
                      <Button type="submit">
                        {currentEducation
                          ? language === "en" ? "Update" : "تحديث"
                          : language === "en" ? "Add" : "إضافة"
                        }
                      </Button>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
              
              {/* تأكيد حذف التعليم */}
              <AlertDialog 
                open={!!educationToDelete} 
                onOpenChange={(open) => !open && setEducationToDelete(null)}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {language === "en" ? "Delete Education" : "حذف التعليم"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {language === "en"
                        ? "Are you sure you want to delete this education record? This action cannot be undone."
                        : "هل أنت متأكد من أنك تريد حذف سجل التعليم هذا؟ لا يمكن التراجع عن هذا الإجراء."
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {language === "en" ? "Cancel" : "إلغاء"}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => educationToDelete && deleteEducationMutation.mutate(educationToDelete)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {language === "en" ? "Delete" : "حذف"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>
            
            <TabsContent value="skills">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>
                    {language === "en" ? "Skills" : "المهارات"}
                  </CardTitle>
                  <Button onClick={() => {
                    setCurrentSkill(null);
                    setEditSkillModal(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "en" ? "Add Skill" : "إضافة مهارة"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {profile?.skills && profile.skills.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profile.skills.map((skill) => (
                          <div key={skill.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2 w-full">
                                <div className="flex justify-between">
                                  <h3 className="font-medium">{language === "en" ? skill.name : skill.nameAr}</h3>
                                  <Badge variant="outline">{skill.category}</Badge>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-primary h-2.5 rounded-full" 
                                    style={{ width: `${skill.level}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>0%</span>
                                  <span>{skill.level}%</span>
                                  <span>100%</span>
                                </div>
                              </div>
                              <div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      {language === "en" ? "Actions" : "الإجراءات"}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => {
                                      setCurrentSkill(skill);
                                      setEditSkillModal(true);
                                    }}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      {language === "en" ? "Edit" : "تعديل"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => setSkillToDelete(skill.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      {language === "en" ? "Delete" : "حذف"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {language === "en" 
                          ? "No skills added yet. Click 'Add Skill' to add your skills." 
                          : "لم يتم إضافة أي مهارات بعد. اضغط على 'إضافة مهارة' لإضافة مهاراتك."
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* تحرير المهارة */}
              <AlertDialog open={editSkillModal} onOpenChange={setEditSkillModal}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {currentSkill 
                        ? language === "en" ? "Edit Skill" : "تعديل المهارة"
                        : language === "en" ? "Add New Skill" : "إضافة مهارة جديدة"
                      }
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <form onSubmit={handleSkillSubmit} className="space-y-4">
                    <div className="space-y-4">
                      {/* اسم المهارة */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="name">
                          {language === "en" ? "Skill Name" : "اسم المهارة"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="name"
                          name="name"
                          placeholder={language === "en" ? "e.g. React.js" : "مثال: رياكت"}
                          defaultValue={currentSkill?.name || ""}
                          required
                        />
                      </div>
                      
                      {/* اسم المهارة بالعربية */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="nameAr">
                          {language === "en" ? "Skill Name (Arabic)" : "اسم المهارة (بالعربية)"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="nameAr"
                          name="nameAr"
                          placeholder="مثال: رياكت"
                          defaultValue={currentSkill?.nameAr || ""}
                          required
                        />
                      </div>
                      
                      {/* فئة المهارة */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="category">
                          {language === "en" ? "Category" : "الفئة"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="category"
                          name="category"
                          placeholder={language === "en" ? "e.g. Frontend, Backend, Design, etc." : "مثال: واجهات، خلفية، تصميم، إلخ."}
                          defaultValue={currentSkill?.category || ""}
                          required
                        />
                      </div>
                      
                      {/* مستوى المهارة */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="level">
                          {language === "en" ? "Proficiency Level (0-100%)" : "مستوى الإتقان (0-100%)"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="flex items-center gap-4">
                          <Input 
                            id="level"
                            name="level"
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            className="w-full"
                            defaultValue={currentSkill?.level || "50"}
                          />
                          <span id="levelValue" className="min-w-12 text-center">{currentSkill?.level || 50}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {language === "en" ? "Cancel" : "إلغاء"}
                      </AlertDialogCancel>
                      <Button type="submit">
                        {currentSkill
                          ? language === "en" ? "Update" : "تحديث"
                          : language === "en" ? "Add" : "إضافة"
                        }
                      </Button>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
              
              {/* تأكيد حذف المهارة */}
              <AlertDialog 
                open={!!skillToDelete} 
                onOpenChange={(open) => !open && setSkillToDelete(null)}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {language === "en" ? "Delete Skill" : "حذف المهارة"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {language === "en"
                        ? "Are you sure you want to delete this skill? This action cannot be undone."
                        : "هل أنت متأكد من أنك تريد حذف هذه المهارة؟ لا يمكن التراجع عن هذا الإجراء."
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {language === "en" ? "Cancel" : "إلغاء"}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => skillToDelete && deleteSkillMutation.mutate(skillToDelete)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {language === "en" ? "Delete" : "حذف"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>
            
            <TabsContent value="gallery">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>
                    {language === "en" ? "Gallery" : "المعرض"}
                  </CardTitle>
                  <Button onClick={() => {
                    setCurrentGalleryItem(null);
                    setEditGalleryModal(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "en" ? "Add Image" : "إضافة صورة"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {profile?.gallery && profile.gallery.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {profile.gallery.map((item) => (
                        <div key={item.id} className="group relative overflow-hidden rounded-lg border">
                          <div className="aspect-square overflow-hidden">
                            <img 
                              src={item.url} 
                              alt={language === "en" ? item.title : item.titleAr}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                            <div>
                              <h3 className="text-white font-medium">{language === "en" ? item.title : item.titleAr}</h3>
                              {(item.description || item.descriptionAr) && (
                                <p className="text-white/80 text-sm mt-2">
                                  {language === "en" ? item.description : item.descriptionAr}
                                </p>
                              )}
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button 
                                onClick={() => {
                                  setCurrentGalleryItem(item);
                                  setEditGalleryModal(true);
                                }} 
                                size="sm" 
                                variant="secondary"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                {language === "en" ? "Edit" : "تعديل"}
                              </Button>
                              <Button 
                                onClick={() => setGalleryItemToDelete(item.id)} 
                                size="sm" 
                                variant="destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {language === "en" ? "Delete" : "حذف"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {language === "en" 
                          ? "No gallery images added yet. Click 'Add Image' to create your gallery." 
                          : "لم يتم إضافة صور للمعرض بعد. اضغط على 'إضافة صورة' لإنشاء معرضك."
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* تحرير صورة المعرض */}
              <AlertDialog open={editGalleryModal} onOpenChange={setEditGalleryModal}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {currentGalleryItem 
                        ? language === "en" ? "Edit Gallery Item" : "تعديل صورة المعرض"
                        : language === "en" ? "Add Gallery Item" : "إضافة صورة للمعرض"
                      }
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <form onSubmit={handleGalleryItemSubmit} className="space-y-4">
                    <div className="space-y-4">
                      {/* الصورة */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="url">
                          {language === "en" ? "Image URL" : "رابط الصورة"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <MediaSelector
                          value={currentGalleryItem?.url}
                          onSelectMedia={(url) => {
                            (document.getElementById('url') as HTMLInputElement).value = url;
                          }}
                          type="image"
                        />
                        <Input 
                          id="url"
                          name="url"
                          type="hidden"
                          defaultValue={currentGalleryItem?.url || ""}
                          required
                        />
                      </div>
                      
                      {/* العنوان */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="title">
                          {language === "en" ? "Title" : "العنوان"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="title"
                          name="title"
                          placeholder={language === "en" ? "e.g. My Project" : "مثال: مشروعي"}
                          defaultValue={currentGalleryItem?.title || ""}
                          required
                        />
                      </div>
                      
                      {/* العنوان بالعربية */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="titleAr">
                          {language === "en" ? "Title (Arabic)" : "العنوان (بالعربية)"}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input 
                          id="titleAr"
                          name="titleAr"
                          placeholder="مثال: مشروعي"
                          defaultValue={currentGalleryItem?.titleAr || ""}
                          required
                        />
                      </div>
                      
                      {/* الوصف */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="description">
                          {language === "en" ? "Description" : "الوصف"}
                        </FormLabel>
                        <Textarea 
                          id="description"
                          name="description"
                          placeholder={language === "en" ? "Brief description of the image" : "وصف موجز للصورة"}
                          defaultValue={currentGalleryItem?.description || ""}
                        />
                      </div>
                      
                      {/* الوصف بالعربية */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="descriptionAr">
                          {language === "en" ? "Description (Arabic)" : "الوصف (بالعربية)"}
                        </FormLabel>
                        <Textarea 
                          id="descriptionAr"
                          name="descriptionAr"
                          placeholder="وصف موجز للصورة باللغة العربية"
                          defaultValue={currentGalleryItem?.descriptionAr || ""}
                        />
                      </div>
                    </div>
                    
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {language === "en" ? "Cancel" : "إلغاء"}
                      </AlertDialogCancel>
                      <Button type="submit">
                        {currentGalleryItem
                          ? language === "en" ? "Update" : "تحديث"
                          : language === "en" ? "Add" : "إضافة"
                        }
                      </Button>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
              
              {/* تأكيد حذف صورة من المعرض */}
              <AlertDialog 
                open={!!galleryItemToDelete} 
                onOpenChange={(open) => !open && setGalleryItemToDelete(null)}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {language === "en" ? "Delete Gallery Item" : "حذف صورة من المعرض"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {language === "en"
                        ? "Are you sure you want to delete this image? This action cannot be undone."
                        : "هل أنت متأكد من أنك تريد حذف هذه الصورة؟ لا يمكن التراجع عن هذا الإجراء."
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {language === "en" ? "Cancel" : "إلغاء"}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => galleryItemToDelete && deleteGalleryItemMutation.mutate(galleryItemToDelete)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {language === "en" ? "Delete" : "حذف"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardProfile;
