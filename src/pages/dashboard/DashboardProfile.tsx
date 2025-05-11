
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardUserProfile } from "@/components/dashboard/DashboardUserProfile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaSelector } from "@/components/media/MediaSelector";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Profile, getProfile, updateProfile } from "@/services/profile-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, GraduationCap, Briefcase, Code, Image } from "lucide-react";

// Types for profile sections
interface Experience {
  id: string;
  title: string;
  titleAr: string;
  company: string;
  companyAr: string;
  location: string;
  locationAr: string;
  startDate: string;
  endDate: string | null;
  description: string;
  descriptionAr: string;
  current: boolean;
}

interface Education {
  id: string;
  degree: string;
  degreeAr: string;
  institution: string;
  institutionAr: string;
  location: string;
  locationAr: string;
  startDate: string;
  endDate: string | null;
  description: string;
  descriptionAr: string;
  current: boolean;
}

interface Skill {
  id: string;
  name: string;
  nameAr: string;
  level: number;
  category: string;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
}

const DashboardProfile = () => {
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"info" | "experience" | "education" | "skills" | "gallery">("info");
  const [editExperienceId, setEditExperienceId] = useState<string | null>(null);
  const [editEducationId, setEditEducationId] = useState<string | null>(null);
  const [editSkillId, setEditSkillId] = useState<string | null>(null);
  const [editGalleryId, setEditGalleryId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{type: string, id: string} | null>(null);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [tempProfileImage, setTempProfileImage] = useState<string | undefined>(undefined);

  // Form states
  const [experience, setExperience] = useState<Experience>({
    id: "",
    title: "",
    titleAr: "",
    company: "",
    companyAr: "",
    location: "",
    locationAr: "",
    startDate: "",
    endDate: null,
    description: "",
    descriptionAr: "",
    current: false
  });

  const [education, setEducation] = useState<Education>({
    id: "",
    degree: "",
    degreeAr: "",
    institution: "",
    institutionAr: "",
    location: "",
    locationAr: "",
    startDate: "",
    endDate: null,
    description: "",
    descriptionAr: "",
    current: false
  });

  const [skill, setSkill] = useState<Skill>({
    id: "",
    name: "",
    nameAr: "",
    level: 3,
    category: "technical"
  });

  const [gallery, setGallery] = useState<GalleryImage>({
    id: "",
    url: "",
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: ""
  });

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updatedProfile: Partial<Profile>) => updateProfile(updatedProfile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: language === "en" ? "Profile Updated" : "تم تحديث الملف الشخصي",
        description: language === "en" ? "Your profile has been updated successfully." : "تم تحديث ملفك الشخصي بنجاح.",
      });
    },
  });

  // Handle basic info form submit
  const handleBasicInfoUpdate = (formData: FormData) => {
    const name = formData.get("name") as string;
    const nameAr = formData.get("nameAr") as string;
    const title = formData.get("title") as string;
    const titleAr = formData.get("titleAr") as string;
    const bio = formData.get("bio") as string;
    const bioAr = formData.get("bioAr") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const linkedin = formData.get("linkedin") as string;
    const github = formData.get("github") as string;
    const twitter = formData.get("twitter") as string;
    
    updateProfileMutation.mutate({
      name,
      nameAr,
      title,
      titleAr,
      bio,
      bioAr,
      email,
      phone,
      social: {
        linkedin: linkedin || undefined,
        github: github || undefined,
        twitter: twitter || undefined,
      },
      image: tempProfileImage || profile?.image,
    });
  };

  // Experience CRUD operations
  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const experiences = [...(profile.experiences || [])];
    
    if (editExperienceId) {
      // Update existing experience
      const index = experiences.findIndex(exp => exp.id === editExperienceId);
      if (index !== -1) {
        experiences[index] = experience;
      }
    } else {
      // Add new experience
      experiences.push({
        ...experience,
        id: crypto.randomUUID(),
      });
    }
    
    updateProfileMutation.mutate({ experiences });
    setEditExperienceId(null);
    setExperience({
      id: "",
      title: "",
      titleAr: "",
      company: "",
      companyAr: "",
      location: "",
      locationAr: "",
      startDate: "",
      endDate: null,
      description: "",
      descriptionAr: "",
      current: false
    });
  };

  const handleEditExperience = (id: string) => {
    if (!profile?.experiences) return;
    
    const exp = profile.experiences.find(exp => exp.id === id);
    if (exp) {
      setExperience(exp);
      setEditExperienceId(id);
    }
  };

  const handleDeleteExperience = () => {
    if (!profile || !deleteConfirm || deleteConfirm.type !== "experience") return;
    
    const experiences = profile.experiences?.filter(exp => exp.id !== deleteConfirm.id) || [];
    updateProfileMutation.mutate({ experiences });
    setDeleteConfirm(null);
  };

  // Education CRUD operations
  const handleEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const educations = [...(profile.education || [])];
    
    if (editEducationId) {
      // Update existing education
      const index = educations.findIndex(edu => edu.id === editEducationId);
      if (index !== -1) {
        educations[index] = education;
      }
    } else {
      // Add new education
      educations.push({
        ...education,
        id: crypto.randomUUID(),
      });
    }
    
    updateProfileMutation.mutate({ education: educations });
    setEditEducationId(null);
    setEducation({
      id: "",
      degree: "",
      degreeAr: "",
      institution: "",
      institutionAr: "",
      location: "",
      locationAr: "",
      startDate: "",
      endDate: null,
      description: "",
      descriptionAr: "",
      current: false
    });
  };

  const handleEditEducation = (id: string) => {
    if (!profile?.education) return;
    
    const edu = profile.education.find(edu => edu.id === id);
    if (edu) {
      setEducation(edu);
      setEditEducationId(id);
    }
  };

  const handleDeleteEducation = () => {
    if (!profile || !deleteConfirm || deleteConfirm.type !== "education") return;
    
    const educations = profile.education?.filter(edu => edu.id !== deleteConfirm.id) || [];
    updateProfileMutation.mutate({ education: educations });
    setDeleteConfirm(null);
  };

  // Skills CRUD operations
  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const skills = [...(profile.skills || [])];
    
    if (editSkillId) {
      // Update existing skill
      const index = skills.findIndex(s => s.id === editSkillId);
      if (index !== -1) {
        skills[index] = skill;
      }
    } else {
      // Add new skill
      skills.push({
        ...skill,
        id: crypto.randomUUID(),
      });
    }
    
    updateProfileMutation.mutate({ skills });
    setEditSkillId(null);
    setSkill({
      id: "",
      name: "",
      nameAr: "",
      level: 3,
      category: "technical"
    });
  };

  const handleEditSkill = (id: string) => {
    if (!profile?.skills) return;
    
    const s = profile.skills.find(s => s.id === id);
    if (s) {
      setSkill(s);
      setEditSkillId(id);
    }
  };

  const handleDeleteSkill = () => {
    if (!profile || !deleteConfirm || deleteConfirm.type !== "skill") return;
    
    const skills = profile.skills?.filter(s => s.id !== deleteConfirm.id) || [];
    updateProfileMutation.mutate({ skills });
    setDeleteConfirm(null);
  };

  // Gallery CRUD operations
  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const galleries = [...(profile.gallery || [])];
    
    if (editGalleryId) {
      // Update existing gallery item
      const index = galleries.findIndex(g => g.id === editGalleryId);
      if (index !== -1) {
        galleries[index] = gallery;
      }
    } else {
      // Add new gallery item
      galleries.push({
        ...gallery,
        id: crypto.randomUUID(),
      });
    }
    
    updateProfileMutation.mutate({ gallery: galleries });
    setEditGalleryId(null);
    setGallery({
      id: "",
      url: "",
      title: "",
      titleAr: "",
      description: "",
      descriptionAr: ""
    });
  };

  const handleEditGallery = (id: string) => {
    if (!profile?.gallery) return;
    
    const g = profile.gallery.find(g => g.id === id);
    if (g) {
      setGallery(g);
      setEditGalleryId(id);
    }
  };

  const handleDeleteGallery = () => {
    if (!profile || !deleteConfirm || deleteConfirm.type !== "gallery") return;
    
    const galleries = profile.gallery?.filter(g => g.id !== deleteConfirm.id) || [];
    updateProfileMutation.mutate({ gallery: galleries });
    setDeleteConfirm(null);
  };

  // Handle media select for gallery
  const handleSelectGalleryMedia = (url: string) => {
    setGallery({
      ...gallery,
      url
    });
  };

  // Handle media select for profile image
  const handleSelectProfileMedia = (url: string) => {
    setTempProfileImage(url);
    setIsMediaDialogOpen(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout title={language === "en" ? "Profile" : "الملف الشخصي"}>
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title={language === "en" ? "Profile" : "الملف الشخصي"}
      breadcrumbs={[
        { label: language === "en" ? "Profile" : "الملف الشخصي", href: "/dashboard/profile" }
      ]}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Profile Preview" : "معاينة الملف الشخصي"}</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardUserProfile profile={profile} />
          </CardContent>
        </Card>

        <div className="flex overflow-x-auto mb-4 pb-2 border-b">
          <Button 
            variant={activeTab === "info" ? "default" : "ghost"} 
            onClick={() => setActiveTab("info")}
            className="whitespace-nowrap"
          >
            {language === "en" ? "Basic Information" : "المعلومات الأساسية"}
          </Button>
          <Button 
            variant={activeTab === "experience" ? "default" : "ghost"} 
            onClick={() => setActiveTab("experience")}
            className="whitespace-nowrap"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            {language === "en" ? "Experience" : "الخبرات"}
          </Button>
          <Button 
            variant={activeTab === "education" ? "default" : "ghost"} 
            onClick={() => setActiveTab("education")}
            className="whitespace-nowrap"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            {language === "en" ? "Education" : "التعليم"}
          </Button>
          <Button 
            variant={activeTab === "skills" ? "default" : "ghost"} 
            onClick={() => setActiveTab("skills")}
            className="whitespace-nowrap"
          >
            <Code className="w-4 h-4 mr-2" />
            {language === "en" ? "Skills" : "المهارات"}
          </Button>
          <Button 
            variant={activeTab === "gallery" ? "default" : "ghost"} 
            onClick={() => setActiveTab("gallery")}
            className="whitespace-nowrap"
          >
            <Image className="w-4 h-4 mr-2" />
            {language === "en" ? "Gallery" : "معرض الصور"}
          </Button>
        </div>

        {activeTab === "info" && (
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Basic Information" : "المعلومات الأساسية"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={handleBasicInfoUpdate} className="space-y-4">
                <div className="flex gap-4 mb-6">
                  <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden border">
                    <img 
                      src={tempProfileImage || profile?.image || "/placeholder.svg"} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center space-y-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsMediaDialogOpen(true)}
                    >
                      {language === "en" ? "Change Profile Image" : "تغيير الصورة الشخصية"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      {language === "en" ? "Name (English)" : "الاسم (بالإنجليزية)"}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={profile?.name}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="nameAr" className="block text-sm font-medium">
                      {language === "en" ? "Name (Arabic)" : "الاسم (بالعربية)"}
                    </label>
                    <Input
                      id="nameAr"
                      name="nameAr"
                      defaultValue={profile?.nameAr}
                      placeholder="جون دو"
                      dir="rtl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium">
                      {language === "en" ? "Professional Title (English)" : "المسمى الوظيفي (بالإنجليزية)"}
                    </label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={profile?.title}
                      placeholder="Software Engineer"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="titleAr" className="block text-sm font-medium">
                      {language === "en" ? "Professional Title (Arabic)" : "المسمى الوظيفي (بالعربية)"}
                    </label>
                    <Input
                      id="titleAr"
                      name="titleAr"
                      defaultValue={profile?.titleAr}
                      placeholder="مهندس برمجيات"
                      dir="rtl"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium">
                      {language === "en" ? "Bio (English)" : "السيرة الذاتية (بالإنجليزية)"}
                    </label>
                    <Textarea
                      id="bio"
                      name="bio"
                      defaultValue={profile?.bio}
                      placeholder="Write a short bio about yourself..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="bioAr" className="block text-sm font-medium">
                      {language === "en" ? "Bio (Arabic)" : "السيرة الذاتية (بالعربية)"}
                    </label>
                    <Textarea
                      id="bioAr"
                      name="bioAr"
                      defaultValue={profile?.bioAr}
                      placeholder="اكتب نبذة قصيرة عن نفسك..."
                      rows={4}
                      dir="rtl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      {language === "en" ? "Email" : "البريد الإلكتروني"}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      defaultValue={profile?.email}
                      placeholder="you@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium">
                      {language === "en" ? "Phone" : "رقم الهاتف"}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={profile?.phone}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="linkedin" className="block text-sm font-medium">
                      {language === "en" ? "LinkedIn URL" : "رابط لينكد إن"}
                    </label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      defaultValue={profile?.social?.linkedin}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="github" className="block text-sm font-medium">
                      {language === "en" ? "GitHub URL" : "رابط جيت هاب"}
                    </label>
                    <Input
                      id="github"
                      name="github"
                      defaultValue={profile?.social?.github}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="twitter" className="block text-sm font-medium">
                      {language === "en" ? "Twitter URL" : "رابط تويتر"}
                    </label>
                    <Input
                      id="twitter"
                      name="twitter"
                      defaultValue={profile?.social?.twitter}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? 
                      (language === "en" ? "Saving..." : "جاري الحفظ...") : 
                      (language === "en" ? "Save Changes" : "حفظ التغييرات")
                    }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === "experience" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Experience" : "الخبرات"}</CardTitle>
              </CardHeader>
              <CardContent>
                {(profile?.experiences?.length || 0) > 0 ? (
                  <div className="space-y-4">
                    {profile?.experiences?.map((exp) => (
                      <div key={exp.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{language === "en" ? exp.title : exp.titleAr}</h3>
                            <p className="text-muted-foreground">{language === "en" ? exp.company : exp.companyAr}</p>
                            <p className="text-sm text-muted-foreground">
                              {language === "en" ? exp.location : exp.locationAr} | 
                              {new Date(exp.startDate).toLocaleDateString(language === "en" ? "en-US" : "ar-SA", { 
                                year: 'numeric', 
                                month: 'short' 
                              })} 
                              {" - "}
                              {exp.current ? 
                                (language === "en" ? "Present" : "الآن") : 
                                (exp.endDate ? new Date(exp.endDate).toLocaleDateString(language === "en" ? "en-US" : "ar-SA", { 
                                  year: 'numeric', 
                                  month: 'short' 
                                }) : "")
                              }
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditExperience(exp.id)}>
                              {language === "en" ? "Edit" : "تعديل"}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setDeleteConfirm({ type: "experience", id: exp.id })}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      {language === "en" ? "No experience entries yet" : "لا توجد خبرات بعد"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {editExperienceId ? 
                    (language === "en" ? "Edit Experience" : "تعديل الخبرة") : 
                    (language === "en" ? "Add New Experience" : "إضافة خبرة جديدة")
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleExperienceSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="block text-sm font-medium">
                        {language === "en" ? "Job Title (English)" : "المسمى الوظيفي (بالإنجليزية)"}
                      </label>
                      <Input
                        id="title"
                        value={experience.title}
                        onChange={(e) => setExperience({...experience, title: e.target.value})}
                        placeholder="Senior Developer"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="titleAr" className="block text-sm font-medium">
                        {language === "en" ? "Job Title (Arabic)" : "المسمى الوظيفي (بالعربية)"}
                      </label>
                      <Input
                        id="titleAr"
                        value={experience.titleAr}
                        onChange={(e) => setExperience({...experience, titleAr: e.target.value})}
                        placeholder="مطور أول"
                        dir="rtl"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="company" className="block text-sm font-medium">
                        {language === "en" ? "Company (English)" : "الشركة (بالإنجليزية)"}
                      </label>
                      <Input
                        id="company"
                        value={experience.company}
                        onChange={(e) => setExperience({...experience, company: e.target.value})}
                        placeholder="Tech Company"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="companyAr" className="block text-sm font-medium">
                        {language === "en" ? "Company (Arabic)" : "الشركة (بالعربية)"}
                      </label>
                      <Input
                        id="companyAr"
                        value={experience.companyAr}
                        onChange={(e) => setExperience({...experience, companyAr: e.target.value})}
                        placeholder="شركة تقنية"
                        dir="rtl"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="location" className="block text-sm font-medium">
                        {language === "en" ? "Location (English)" : "الموقع (بالإنجليزية)"}
                      </label>
                      <Input
                        id="location"
                        value={experience.location}
                        onChange={(e) => setExperience({...experience, location: e.target.value})}
                        placeholder="New York, USA"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="locationAr" className="block text-sm font-medium">
                        {language === "en" ? "Location (Arabic)" : "الموقع (بالعربية)"}
                      </label>
                      <Input
                        id="locationAr"
                        value={experience.locationAr}
                        onChange={(e) => setExperience({...experience, locationAr: e.target.value})}
                        placeholder="نيويورك، الولايات المتحدة"
                        dir="rtl"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="startDate" className="block text-sm font-medium">
                        {language === "en" ? "Start Date" : "تاريخ البداية"}
                      </label>
                      <Input
                        id="startDate"
                        type="date"
                        value={experience.startDate}
                        onChange={(e) => setExperience({...experience, startDate: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="endDate" className="block text-sm font-medium">
                          {language === "en" ? "End Date" : "تاريخ النهاية"}
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="currentJob"
                            checked={experience.current}
                            onChange={(e) => setExperience({...experience, current: e.target.checked, endDate: e.target.checked ? null : experience.endDate})}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor="currentJob" className="text-sm">
                            {language === "en" ? "Current Position" : "الوظيفة الحالية"}
                          </label>
                        </div>
                      </div>
                      <Input
                        id="endDate"
                        type="date"
                        value={experience.endDate || ""}
                        onChange={(e) => setExperience({...experience, endDate: e.target.value || null})}
                        disabled={experience.current}
                        required={!experience.current}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium">
                        {language === "en" ? "Description (English)" : "الوصف (بالإنجليزية)"}
                      </label>
                      <Textarea
                        id="description"
                        value={experience.description}
                        onChange={(e) => setExperience({...experience, description: e.target.value})}
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="descriptionAr" className="block text-sm font-medium">
                        {language === "en" ? "Description (Arabic)" : "الوصف (بالعربية)"}
                      </label>
                      <Textarea
                        id="descriptionAr"
                        value={experience.descriptionAr}
                        onChange={(e) => setExperience({...experience, descriptionAr: e.target.value})}
                        placeholder="وصف مسؤولياتك وإنجازاتك..."
                        rows={3}
                        dir="rtl"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    {editExperienceId && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditExperienceId(null);
                          setExperience({
                            id: "",
                            title: "",
                            titleAr: "",
                            company: "",
                            companyAr: "",
                            location: "",
                            locationAr: "",
                            startDate: "",
                            endDate: null,
                            description: "",
                            descriptionAr: "",
                            current: false
                          });
                        }}
                      >
                        {language === "en" ? "Cancel" : "إلغاء"}
                      </Button>
                    )}
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? 
                        (language === "en" ? "Saving..." : "جاري الحفظ...") : 
                        (editExperienceId ? 
                          (language === "en" ? "Update Experience" : "تحديث الخبرة") : 
                          (language === "en" ? "Add Experience" : "إضافة خبرة")
                        )
                      }
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "education" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Education" : "التعليم"}</CardTitle>
              </CardHeader>
              <CardContent>
                {(profile?.education?.length || 0) > 0 ? (
                  <div className="space-y-4">
                    {profile?.education?.map((edu) => (
                      <div key={edu.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{language === "en" ? edu.degree : edu.degreeAr}</h3>
                            <p className="text-muted-foreground">{language === "en" ? edu.institution : edu.institutionAr}</p>
                            <p className="text-sm text-muted-foreground">
                              {language === "en" ? edu.location : edu.locationAr} | 
                              {new Date(edu.startDate).toLocaleDateString(language === "en" ? "en-US" : "ar-SA", { 
                                year: 'numeric', 
                                month: 'short' 
                              })} 
                              {" - "}
                              {edu.current ? 
                                (language === "en" ? "Present" : "الآن") : 
                                (edu.endDate ? new Date(edu.endDate).toLocaleDateString(language === "en" ? "en-US" : "ar-SA", { 
                                  year: 'numeric', 
                                  month: 'short' 
                                }) : "")
                              }
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditEducation(edu.id)}>
                              {language === "en" ? "Edit" : "تعديل"}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setDeleteConfirm({ type: "education", id: edu.id })}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      {language === "en" ? "No education entries yet" : "لا توجد بيانات تعليمية بعد"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {editEducationId ? 
                    (language === "en" ? "Edit Education" : "تعديل التعليم") : 
                    (language === "en" ? "Add New Education" : "إضافة تعليم جديد")
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEducationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="degree" className="block text-sm font-medium">
                        {language === "en" ? "Degree (English)" : "الشهادة (بالإنجليزية)"}
                      </label>
                      <Input
                        id="degree"
                        value={education.degree}
                        onChange={(e) => setEducation({...education, degree: e.target.value})}
                        placeholder="Bachelor of Science in Computer Science"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="degreeAr" className="block text-sm font-medium">
                        {language === "en" ? "Degree (Arabic)" : "الشهادة (بالعربية)"}
                      </label>
                      <Input
                        id="degreeAr"
                        value={education.degreeAr}
                        onChange={(e) => setEducation({...education, degreeAr: e.target.value})}
                        placeholder="بكالوريوس علوم في علوم الحاسب"
                        dir="rtl"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="institution" className="block text-sm font-medium">
                        {language === "en" ? "Institution (English)" : "المؤسسة التعليمية (بالإنجليزية)"}
                      </label>
                      <Input
                        id="institution"
                        value={education.institution}
                        onChange={(e) => setEducation({...education, institution: e.target.value})}
                        placeholder="University Name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="institutionAr" className="block text-sm font-medium">
                        {language === "en" ? "Institution (Arabic)" : "المؤسسة التعليمية (بالعربية)"}
                      </label>
                      <Input
                        id="institutionAr"
                        value={education.institutionAr}
                        onChange={(e) => setEducation({...education, institutionAr: e.target.value})}
                        placeholder="اسم الجامعة"
                        dir="rtl"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="eduLocation" className="block text-sm font-medium">
                        {language === "en" ? "Location (English)" : "الموقع (بالإنجليزية)"}
                      </label>
                      <Input
                        id="eduLocation"
                        value={education.location}
                        onChange={(e) => setEducation({...education, location: e.target.value})}
                        placeholder="City, Country"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="eduLocationAr" className="block text-sm font-medium">
                        {language === "en" ? "Location (Arabic)" : "الموقع (بالعربية)"}
                      </label>
                      <Input
                        id="eduLocationAr"
                        value={education.locationAr}
                        onChange={(e) => setEducation({...education, locationAr: e.target.value})}
                        placeholder="المدينة، الدولة"
                        dir="rtl"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="eduStartDate" className="block text-sm font-medium">
                        {language === "en" ? "Start Date" : "تاريخ البداية"}
                      </label>
                      <Input
                        id="eduStartDate"
                        type="date"
                        value={education.startDate}
                        onChange={(e) => setEducation({...education, startDate: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="eduEndDate" className="block text-sm font-medium">
                          {language === "en" ? "End Date" : "تاريخ النهاية"}
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="currentEducation"
                            checked={education.current}
                            onChange={(e) => setEducation({...education, current: e.target.checked, endDate: e.target.checked ? null : education.endDate})}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor="currentEducation" className="text-sm">
                            {language === "en" ? "Currently Studying" : "أدرس حاليا"}
                          </label>
                        </div>
                      </div>
                      <Input
                        id="eduEndDate"
                        type="date"
                        value={education.endDate || ""}
                        onChange={(e) => setEducation({...education, endDate: e.target.value || null})}
                        disabled={education.current}
                        required={!education.current}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="eduDescription" className="block text-sm font-medium">
                        {language === "en" ? "Description (English)" : "الوصف (بالإنجليزية)"}
                      </label>
                      <Textarea
                        id="eduDescription"
                        value={education.description}
                        onChange={(e) => setEducation({...education, description: e.target.value})}
                        placeholder="Describe your studies, achievements, etc."
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="eduDescriptionAr" className="block text-sm font-medium">
                        {language === "en" ? "Description (Arabic)" : "الوصف (بالعربية)"}
                      </label>
                      <Textarea
                        id="eduDescriptionAr"
                        value={education.descriptionAr}
                        onChange={(e) => setEducation({...education, descriptionAr: e.target.value})}
                        placeholder="صف دراستك، إنجازاتك، إلخ."
                        rows={3}
                        dir="rtl"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    {editEducationId && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditEducationId(null);
                          setEducation({
                            id: "",
                            degree: "",
                            degreeAr: "",
                            institution: "",
                            institutionAr: "",
                            location: "",
                            locationAr: "",
                            startDate: "",
                            endDate: null,
                            description: "",
                            descriptionAr: "",
                            current: false
                          });
                        }}
                      >
                        {language === "en" ? "Cancel" : "إلغاء"}
                      </Button>
                    )}
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? 
                        (language === "en" ? "Saving..." : "جاري الحفظ...") : 
                        (editEducationId ? 
                          (language === "en" ? "Update Education" : "تحديث التعليم") : 
                          (language === "en" ? "Add Education" : "إضافة تعليم")
                        )
                      }
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Skills" : "المهارات"}</CardTitle>
              </CardHeader>
              <CardContent>
                {(profile?.skills?.length || 0) > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile?.skills?.map((s) => (
                      <div key={s.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="w-full">
                            <h3 className="font-semibold">{language === "en" ? s.name : s.nameAr}</h3>
                            <div className="text-xs uppercase text-muted-foreground mb-2">{s.category}</div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary rounded-full h-2" 
                                style={{ width: `${(s.level / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex ml-4">
                            <Button variant="ghost" size="sm" onClick={() => handleEditSkill(s.id)}>
                              {language === "en" ? "Edit" : "تعديل"}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setDeleteConfirm({ type: "skill", id: s.id })}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      {language === "en" ? "No skills added yet" : "لم تتم إضافة مهارات بعد"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {editSkillId ? 
                    (language === "en" ? "Edit Skill" : "تعديل المهارة") : 
                    (language === "en" ? "Add New Skill" : "إضافة مهارة جديدة")
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSkillSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="skillName" className="block text-sm font-medium">
                        {language === "en" ? "Skill Name (English)" : "اسم المهارة (بالإنجليزية)"}
                      </label>
                      <Input
                        id="skillName"
                        value={skill.name}
                        onChange={(e) => setSkill({...skill, name: e.target.value})}
                        placeholder="React, JavaScript, Project Management, etc."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="skillNameAr" className="block text-sm font-medium">
                        {language === "en" ? "Skill Name (Arabic)" : "اسم المهارة (بالعربية)"}
                      </label>
                      <Input
                        id="skillNameAr"
                        value={skill.nameAr}
                        onChange={(e) => setSkill({...skill, nameAr: e.target.value})}
                        placeholder="رياكت، جافاسكريبت، إدارة المشاريع، إلخ."
                        dir="rtl"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="skillCategory" className="block text-sm font-medium">
                        {language === "en" ? "Category" : "الفئة"}
                      </label>
                      <Select 
                        value={skill.category} 
                        onValueChange={(value) => setSkill({...skill, category: value})}
                      >
                        <SelectTrigger id="skillCategory">
                          <SelectValue placeholder={language === "en" ? "Select category" : "اختر الفئة"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">
                            {language === "en" ? "Technical" : "تقنية"}
                          </SelectItem>
                          <SelectItem value="soft">
                            {language === "en" ? "Soft Skills" : "مهارات ناعمة"}
                          </SelectItem>
                          <SelectItem value="language">
                            {language === "en" ? "Language" : "لغات"}
                          </SelectItem>
                          <SelectItem value="other">
                            {language === "en" ? "Other" : "أخرى"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="skillLevel" className="block text-sm font-medium">
                        {language === "en" ? "Proficiency Level (1-5)" : "مستوى الكفاءة (1-5)"}
                      </label>
                      <div className="flex items-center">
                        <input
                          id="skillLevel"
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={skill.level}
                          onChange={(e) => setSkill({...skill, level: parseInt(e.target.value)})}
                          className="w-full"
                        />
                        <span className="ml-2">{skill.level}/5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    {editSkillId && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditSkillId(null);
                          setSkill({
                            id: "",
                            name: "",
                            nameAr: "",
                            level: 3,
                            category: "technical"
                          });
                        }}
                      >
                        {language === "en" ? "Cancel" : "إلغاء"}
                      </Button>
                    )}
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? 
                        (language === "en" ? "Saving..." : "جاري الحفظ...") : 
                        (editSkillId ? 
                          (language === "en" ? "Update Skill" : "تحديث المهارة") : 
                          (language === "en" ? "Add Skill" : "إضافة مهارة")
                        )
                      }
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Gallery" : "معرض الصور"}</CardTitle>
              </CardHeader>
              <CardContent>
                {(profile?.gallery?.length || 0) > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile?.gallery?.map((g) => (
                      <div key={g.id} className="border rounded-lg overflow-hidden">
                        <div className="aspect-video">
                          <img 
                            src={g.url} 
                            alt={language === "en" ? g.title : g.titleAr}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold">{language === "en" ? g.title : g.titleAr}</h3>
                          <p className="text-sm text-muted-foreground">
                            {language === "en" ? g.description : g.descriptionAr}
                          </p>
                          <div className="flex justify-end mt-4">
                            <Button variant="ghost" size="sm" onClick={() => handleEditGallery(g.id)}>
                              {language === "en" ? "Edit" : "تعديل"}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setDeleteConfirm({ type: "gallery", id: g.id })}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      {language === "en" ? "No gallery items yet" : "لا توجد صور في المعرض بعد"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {editGalleryId ? 
                    (language === "en" ? "Edit Gallery Item" : "تعديل عنصر المعرض") : 
                    (language === "en" ? "Add New Gallery Item" : "إضافة عنصر جديد للمعرض")
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGallerySubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        {language === "en" ? "Image" : "الصورة"}
                      </label>
                      <MediaSelector 
                        value={gallery.url}
                        onValueChange={(url) => setGallery({...gallery, url})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="galleryTitle" className="block text-sm font-medium">
                          {language === "en" ? "Title (English)" : "العنوان (بالإنجليزية)"}
                        </label>
                        <Input
                          id="galleryTitle"
                          value={gallery.title}
                          onChange={(e) => setGallery({...gallery, title: e.target.value})}
                          placeholder="Project Screenshot, Certificate, etc."
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="galleryTitleAr" className="block text-sm font-medium">
                          {language === "en" ? "Title (Arabic)" : "العنوان (بالعربية)"}
                        </label>
                        <Input
                          id="galleryTitleAr"
                          value={gallery.titleAr}
                          onChange={(e) => setGallery({...gallery, titleAr: e.target.value})}
                          placeholder="لقطة شاشة للمشروع، شهادة، إلخ."
                          dir="rtl"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="galleryDescription" className="block text-sm font-medium">
                          {language === "en" ? "Description (English)" : "الوصف (بالإنجليزية)"}
                        </label>
                        <Textarea
                          id="galleryDescription"
                          value={gallery.description}
                          onChange={(e) => setGallery({...gallery, description: e.target.value})}
                          placeholder="Brief description of the image"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="galleryDescriptionAr" className="block text-sm font-medium">
                          {language === "en" ? "Description (Arabic)" : "الوصف (بالعربية)"}
                        </label>
                        <Textarea
                          id="galleryDescriptionAr"
                          value={gallery.descriptionAr}
                          onChange={(e) => setGallery({...gallery, descriptionAr: e.target.value})}
                          placeholder="وصف موجز للصورة"
                          dir="rtl"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    {editGalleryId && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditGalleryId(null);
                          setGallery({
                            id: "",
                            url: "",
                            title: "",
                            titleAr: "",
                            description: "",
                            descriptionAr: ""
                          });
                        }}
                      >
                        {language === "en" ? "Cancel" : "إلغاء"}
                      </Button>
                    )}
                    <Button type="submit" disabled={updateProfileMutation.isPending || !gallery.url}>
                      {updateProfileMutation.isPending ? 
                        (language === "en" ? "Saving..." : "جاري الحفظ...") : 
                        (editGalleryId ? 
                          (language === "en" ? "Update Gallery Item" : "تحديث عنصر المعرض") : 
                          (language === "en" ? "Add Gallery Item" : "إضافة عنصر للمعرض")
                        )
                      }
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Media Dialog for Profile Image */}
      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
        <DialogContent className="max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Select Profile Image" : "اختر صورة الملف الشخصي"}
            </DialogTitle>
          </DialogHeader>
          <div className="h-[70vh] overflow-auto">
            <MediaSelector
              value={tempProfileImage}
              onValueChange={handleSelectProfileMedia}
              onClose={() => setIsMediaDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Confirm Deletion" : "تأكيد الحذف"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en" 
                ? "Are you sure you want to delete this item? This action cannot be undone."
                : "هل أنت متأكد من أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deleteConfirm?.type === "experience") {
                  handleDeleteExperience();
                } else if (deleteConfirm?.type === "education") {
                  handleDeleteEducation();
                } else if (deleteConfirm?.type === "skill") {
                  handleDeleteSkill();
                } else if (deleteConfirm?.type === "gallery") {
                  handleDeleteGallery();
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {language === "en" ? "Delete" : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default DashboardProfile;
