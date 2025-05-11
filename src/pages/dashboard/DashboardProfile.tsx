
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, Profile, Experience, Education, Certificate } from "@/services/profile-service";
import { MediaSelector } from "@/components/media/MediaSelector";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Save, 
  Plus, 
  Trash, 
  X, 
  Edit, 
  Image
} from "lucide-react";

const DashboardProfile = () => {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("personal");
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState<Experience | null>(null);
  const [educationToEdit, setEducationToEdit] = useState<Education | null>(null);
  const [certificateToEdit, setCertificateToEdit] = useState<Certificate | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{type: string, id: string} | null>(null);

  // Initialize form state
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: "",
    nameAr: "",
    position: "",
    positionAr: "",
    bio: "",
    bioAr: "",
    additionalBio: "",
    additionalBioAr: "",
    image: "",
    skills: [],
    experiences: [],
    education: [],
    certificates: [],
    resumeUrl: "",
    socialLinks: {
      website: "",
      linkedin: "",
      github: "",
      twitter: "",
      instagram: ""
    }
  });

  // Initialize experience form
  const [experienceForm, setExperienceForm] = useState<Experience>({
    id: crypto.randomUUID(),
    period: "",
    title: "",
    titleAr: "",
    company: "",
    companyAr: "",
    description: "",
    descriptionAr: ""
  });

  // Initialize education form
  const [educationForm, setEducationForm] = useState<Education>({
    id: crypto.randomUUID(),
    period: "",
    degree: "",
    degreeAr: "",
    institution: "",
    institutionAr: "",
    description: "",
    descriptionAr: ""
  });

  // Initialize certificate form
  const [certificateForm, setCertificateForm] = useState<Certificate>({
    id: crypto.randomUUID(),
    title: "",
    titleAr: "",
    issuer: "",
    issuerAr: "",
    date: new Date().toISOString().split('T')[0],
    url: "",
    image: ""
  });

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    onSuccess: (data) => {
      if (data) {
        setFormData(data);
      }
    }
  });

  // Update profile mutation
  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: language === "en" ? "Profile Updated" : "تم تحديث الملف الشخصي",
        description: language === "en"
          ? "Your profile has been updated successfully."
          : "تم تحديث ملفك الشخصي بنجاح.",
      });
    },
    onError: (error) => {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: String(error),
        variant: "destructive",
      });
    }
  });

  // Form change handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties (socialLinks)
    if (name.startsWith("socialLinks.")) {
      const socialLinkField = name.split(".")[1];
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialLinkField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Skills input handler
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '');
      
    setFormData({
      ...formData,
      skills: skillsArray
    });
  };

  // Save profile handler
  const handleSaveProfile = () => {
    mutation.mutate(formData);
  };

  // Image selection handler
  const handleImageSelected = (url: string) => {
    setFormData({
      ...formData,
      image: url
    });
    setIsMediaSelectorOpen(false);
  };

  // Experience form handlers
  const handleExperienceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExperienceForm({
      ...experienceForm,
      [name]: value
    });
  };

  const handleSaveExperience = () => {
    const updatedExperiences = [...(formData.experiences || [])];
    
    if (experienceToEdit) {
      // Update existing experience
      const index = updatedExperiences.findIndex(exp => exp.id === experienceToEdit.id);
      if (index !== -1) {
        updatedExperiences[index] = experienceForm;
      }
    } else {
      // Add new experience
      updatedExperiences.push(experienceForm);
    }
    
    setFormData({
      ...formData,
      experiences: updatedExperiences
    });
    
    setIsExperienceDialogOpen(false);
    setExperienceToEdit(null);
    setExperienceForm({
      id: crypto.randomUUID(),
      period: "",
      title: "",
      titleAr: "",
      company: "",
      companyAr: "",
      description: "",
      descriptionAr: ""
    });
  };

  const handleEditExperience = (experience: Experience) => {
    setExperienceToEdit(experience);
    setExperienceForm(experience);
    setIsExperienceDialogOpen(true);
  };

  // Education form handlers
  const handleEducationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEducationForm({
      ...educationForm,
      [name]: value
    });
  };

  const handleSaveEducation = () => {
    const updatedEducation = [...(formData.education || [])];
    
    if (educationToEdit) {
      // Update existing education
      const index = updatedEducation.findIndex(edu => edu.id === educationToEdit.id);
      if (index !== -1) {
        updatedEducation[index] = educationForm;
      }
    } else {
      // Add new education
      updatedEducation.push(educationForm);
    }
    
    setFormData({
      ...formData,
      education: updatedEducation
    });
    
    setIsEducationDialogOpen(false);
    setEducationToEdit(null);
    setEducationForm({
      id: crypto.randomUUID(),
      period: "",
      degree: "",
      degreeAr: "",
      institution: "",
      institutionAr: "",
      description: "",
      descriptionAr: ""
    });
  };

  const handleEditEducation = (education: Education) => {
    setEducationToEdit(education);
    setEducationForm(education);
    setIsEducationDialogOpen(true);
  };

  // Certificate form handlers
  const handleCertificateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCertificateForm({
      ...certificateForm,
      [name]: value
    });
  };

  const handleSaveCertificate = () => {
    const updatedCertificates = [...(formData.certificates || [])];
    
    if (certificateToEdit) {
      // Update existing certificate
      const index = updatedCertificates.findIndex(cert => cert.id === certificateToEdit.id);
      if (index !== -1) {
        updatedCertificates[index] = certificateForm;
      }
    } else {
      // Add new certificate
      updatedCertificates.push(certificateForm);
    }
    
    setFormData({
      ...formData,
      certificates: updatedCertificates
    });
    
    setIsCertificateDialogOpen(false);
    setCertificateToEdit(null);
    setCertificateForm({
      id: crypto.randomUUID(),
      title: "",
      titleAr: "",
      issuer: "",
      issuerAr: "",
      date: new Date().toISOString().split('T')[0],
      url: "",
      image: ""
    });
  };

  const handleEditCertificate = (certificate: Certificate) => {
    setCertificateToEdit(certificate);
    setCertificateForm(certificate);
    setIsCertificateDialogOpen(true);
  };

  // Delete item handler
  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'experience') {
      const updatedExperiences = formData.experiences?.filter(exp => exp.id !== itemToDelete.id) || [];
      setFormData({
        ...formData,
        experiences: updatedExperiences
      });
    } else if (itemToDelete.type === 'education') {
      const updatedEducation = formData.education?.filter(edu => edu.id !== itemToDelete.id) || [];
      setFormData({
        ...formData,
        education: updatedEducation
      });
    } else if (itemToDelete.type === 'certificate') {
      const updatedCertificates = formData.certificates?.filter(cert => cert.id !== itemToDelete.id) || [];
      setFormData({
        ...formData,
        certificates: updatedCertificates
      });
    }
    
    setItemToDelete(null);
  };

  return (
    <DashboardLayout
      title={language === "en" ? "Edit Profile" : "تعديل الملف الشخصي"}
      breadcrumbs={[
        { label: language === "en" ? "Profile" : "الملف الشخصي", href: "/dashboard/profile" }
      ]}
    >
      <div className="mb-4 flex justify-end">
        <Button 
          onClick={handleSaveProfile}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <span className="flex items-center">
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
              {language === "en" ? "Saving..." : "جاري الحفظ..."}
            </span>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {language === "en" ? "Save Changes" : "حفظ التغييرات"}
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  {language === "en" ? "Personal Info" : "المعلومات الشخصية"}
                </TabsTrigger>
                <TabsTrigger value="experience">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {language === "en" ? "Experience" : "الخبرة"}
                </TabsTrigger>
                <TabsTrigger value="education">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {language === "en" ? "Education" : "التعليم"}
                </TabsTrigger>
                <TabsTrigger value="certificates">
                  <Award className="h-4 w-4 mr-2" />
                  {language === "en" ? "Certificates" : "الشهادات"}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left column - English */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">
                      {language === "en" ? "English Information" : "المعلومات باللغة الإنجليزية"}
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {language === "en" ? "Name" : "الاسم"}
                      </label>
                      <Input
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        placeholder={language === "en" ? "Your name in English" : "اسمك باللغة الإنجليزية"}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {language === "en" ? "Position/Title" : "المسمى الوظيفي"}
                      </label>
                      <Input
                        name="position"
                        value={formData.position || ""}
                        onChange={handleInputChange}
                        placeholder={language === "en" ? "e.g. Full Stack Developer" : "مثال: مطور ويب شامل"}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {language === "en" ? "Bio" : "نبذة تعريفية"}
                      </label>
                      <Textarea
                        name="bio"
                        value={formData.bio || ""}
                        onChange={handleInputChange}
                        placeholder={language === "en" ? "Brief bio in English" : "نبذة تعريفية مختصرة باللغة الإنجليزية"}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {language === "en" ? "Additional Bio" : "نبذة إضافية"}
                      </label>
                      <Textarea
                        name="additionalBio"
                        value={formData.additionalBio || ""}
                        onChange={handleInputChange}
                        placeholder={language === "en" ? "Additional bio information (optional)" : "معلومات إضافية (اختياري)"}
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  {/* Right column - Arabic */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">
                      {language === "en" ? "Arabic Information" : "المعلومات باللغة العربية"}
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {language === "en" ? "Name (Arabic)" : "الاسم (بالعربية)"}
                      </label>
                      <Input
                        name="nameAr"
                        value={formData.nameAr || ""}
                        onChange={handleInputChange}
                        className="text-right"
                        placeholder={language === "en" ? "Your name in Arabic" : "اسمك باللغة العربية"}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {language === "en" ? "Position/Title (Arabic)" : "المسمى الوظيفي (بالعربية)"}
                      </label>
                      <Input
                        name="positionAr"
                        value={formData.positionAr || ""}
                        onChange={handleInputChange}
                        className="text-right"
                        placeholder={language === "en" ? "e.g. مطور ويب شامل" : "مثال: مطور ويب شامل"}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {language === "en" ? "Bio (Arabic)" : "نبذة تعريفية (بالعربية)"}
                      </label>
                      <Textarea
                        name="bioAr"
                        value={formData.bioAr || ""}
                        onChange={handleInputChange}
                        className="text-right"
                        placeholder={language === "en" ? "Brief bio in Arabic" : "نبذة تعريفية مختصرة باللغة العربية"}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {language === "en" ? "Additional Bio (Arabic)" : "نبذة إضافية (بالعربية)"}
                      </label>
                      <Textarea
                        name="additionalBioAr"
                        value={formData.additionalBioAr || ""}
                        onChange={handleInputChange}
                        className="text-right"
                        placeholder={language === "en" ? "Additional bio information in Arabic (optional)" : "معلومات إضافية بالعربية (اختياري)"}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {language === "en" ? "Profile Image" : "الصورة الشخصية"}
                      </label>
                      
                      <div className="flex items-center gap-4">
                        {formData.image && (
                          <div className="w-24 h-24 rounded-lg overflow-hidden border">
                            <img
                              src={formData.image}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <Button 
                          variant="outline" 
                          type="button"
                          onClick={() => setIsMediaSelectorOpen(true)}
                        >
                          <Image className="h-4 w-4 mr-2" />
                          {formData.image 
                            ? language === "en" ? "Change Image" : "تغيير الصورة" 
                            : language === "en" ? "Select Image" : "اختيار صورة"
                          }
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {language === "en" ? "Skills (Comma Separated)" : "المهارات (مفصولة بفواصل)"}
                      </label>
                      <Input
                        value={formData.skills?.join(', ') || ""}
                        onChange={handleSkillsChange}
                        placeholder={language === "en" ? "e.g. React, TypeScript, Node.js" : "مثال: React، TypeScript، Node.js"}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-4">
                      <h3 className="font-medium">
                        {language === "en" ? "Social Links" : "روابط التواصل الاجتماعي"}
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {language === "en" ? "Website" : "الموقع الإلكتروني"}
                        </label>
                        <Input
                          name="socialLinks.website"
                          value={formData.socialLinks?.website || ""}
                          onChange={handleInputChange}
                          placeholder="https://example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          LinkedIn
                        </label>
                        <Input
                          name="socialLinks.linkedin"
                          value={formData.socialLinks?.linkedin || ""}
                          onChange={handleInputChange}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">
                        &nbsp;
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          GitHub
                        </label>
                        <Input
                          name="socialLinks.github"
                          value={formData.socialLinks?.github || ""}
                          onChange={handleInputChange}
                          placeholder="https://github.com/username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Twitter
                        </label>
                        <Input
                          name="socialLinks.twitter"
                          value={formData.socialLinks?.twitter || ""}
                          onChange={handleInputChange}
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="experience">
                <div className="mb-4 flex justify-end">
                  <Button onClick={() => {
                    setExperienceToEdit(null);
                    setExperienceForm({
                      id: crypto.randomUUID(),
                      period: "",
                      title: "",
                      titleAr: "",
                      company: "",
                      companyAr: "",
                      description: "",
                      descriptionAr: ""
                    });
                    setIsExperienceDialogOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "en" ? "Add Experience" : "إضافة خبرة"}
                  </Button>
                </div>
                
                {formData.experiences && formData.experiences.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === "en" ? "Period" : "الفترة"}</TableHead>
                        <TableHead>{language === "en" ? "Title" : "المسمى الوظيفي"}</TableHead>
                        <TableHead>{language === "en" ? "Company" : "الشركة"}</TableHead>
                        <TableHead className="text-right">{language === "en" ? "Actions" : "الإجراءات"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.experiences.map((experience) => (
                        <TableRow key={experience.id}>
                          <TableCell>{experience.period}</TableCell>
                          <TableCell>{language === "en" ? experience.title : experience.titleAr}</TableCell>
                          <TableCell>{language === "en" ? experience.company : experience.companyAr}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditExperience(experience)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => setItemToDelete({ type: 'experience', id: experience.id })}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 border rounded-md">
                    <p className="text-muted-foreground">
                      {language === "en"
                        ? "No experience entries yet. Click 'Add Experience' to create one."
                        : "لا توجد خبرات بعد. انقر على 'إضافة خبرة' لإنشاء واحدة."
                      }
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="education">
                <div className="mb-4 flex justify-end">
                  <Button onClick={() => {
                    setEducationToEdit(null);
                    setEducationForm({
                      id: crypto.randomUUID(),
                      period: "",
                      degree: "",
                      degreeAr: "",
                      institution: "",
                      institutionAr: "",
                      description: "",
                      descriptionAr: ""
                    });
                    setIsEducationDialogOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "en" ? "Add Education" : "إضافة تعليم"}
                  </Button>
                </div>
                
                {formData.education && formData.education.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === "en" ? "Period" : "الفترة"}</TableHead>
                        <TableHead>{language === "en" ? "Degree" : "الشهادة"}</TableHead>
                        <TableHead>{language === "en" ? "Institution" : "المؤسسة التعليمية"}</TableHead>
                        <TableHead className="text-right">{language === "en" ? "Actions" : "الإجراءات"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.education.map((education) => (
                        <TableRow key={education.id}>
                          <TableCell>{education.period}</TableCell>
                          <TableCell>{language === "en" ? education.degree : education.degreeAr}</TableCell>
                          <TableCell>{language === "en" ? education.institution : education.institutionAr}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditEducation(education)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => setItemToDelete({ type: 'education', id: education.id })}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 border rounded-md">
                    <p className="text-muted-foreground">
                      {language === "en"
                        ? "No education entries yet. Click 'Add Education' to create one."
                        : "لا توجد معلومات تعليمية بعد. انقر على 'إضافة تعليم' لإنشاء واحدة."
                      }
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="certificates">
                <div className="mb-4 flex justify-end">
                  <Button onClick={() => {
                    setCertificateToEdit(null);
                    setCertificateForm({
                      id: crypto.randomUUID(),
                      title: "",
                      titleAr: "",
                      issuer: "",
                      issuerAr: "",
                      date: new Date().toISOString().split('T')[0],
                      url: "",
                      image: ""
                    });
                    setIsCertificateDialogOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "en" ? "Add Certificate" : "إضافة شهادة"}
                  </Button>
                </div>
                
                {formData.certificates && formData.certificates.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === "en" ? "Date" : "التاريخ"}</TableHead>
                        <TableHead>{language === "en" ? "Title" : "العنوان"}</TableHead>
                        <TableHead>{language === "en" ? "Issuer" : "الجهة المصدرة"}</TableHead>
                        <TableHead className="text-right">{language === "en" ? "Actions" : "الإجراءات"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.certificates.map((certificate) => (
                        <TableRow key={certificate.id}>
                          <TableCell>{new Date(certificate.date).toLocaleDateString()}</TableCell>
                          <TableCell>{language === "en" ? certificate.title : certificate.titleAr}</TableCell>
                          <TableCell>{language === "en" ? certificate.issuer : certificate.issuerAr}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditCertificate(certificate)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => setItemToDelete({ type: 'certificate', id: certificate.id })}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 border rounded-md">
                    <p className="text-muted-foreground">
                      {language === "en"
                        ? "No certificates yet. Click 'Add Certificate' to create one."
                        : "لا توجد شهادات بعد. انقر على 'إضافة شهادة' لإنشاء واحدة."
                      }
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Media Selector Modal */}
      {isMediaSelectorOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed inset-10 bg-background rounded-lg shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">
                {language === "en" ? "Select Image" : "اختيار صورة"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMediaSelectorOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-grow overflow-auto p-4">
              <MediaSelector
                onSelectMedia={handleImageSelected}
                onClose={() => setIsMediaSelectorOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Experience Dialog */}
      <AlertDialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {experienceToEdit 
                ? language === "en" ? "Edit Experience" : "تعديل الخبرة"
                : language === "en" ? "Add Experience" : "إضافة خبرة"
              }
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <h3 className="font-medium">
                {language === "en" ? "English Information" : "المعلومات باللغة الإنجليزية"}
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Period" : "الفترة"}
                </label>
                <Input
                  name="period"
                  value={experienceForm.period}
                  onChange={handleExperienceInputChange}
                  placeholder="e.g. 2020-2023"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Title" : "المسمى الوظيفي"}
                </label>
                <Input
                  name="title"
                  value={experienceForm.title}
                  onChange={handleExperienceInputChange}
                  placeholder="e.g. Senior Developer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Company" : "الشركة"}
                </label>
                <Input
                  name="company"
                  value={experienceForm.company}
                  onChange={handleExperienceInputChange}
                  placeholder="e.g. Tech Company Inc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Description" : "الوصف"}
                </label>
                <Textarea
                  name="description"
                  value={experienceForm.description}
                  onChange={handleExperienceInputChange}
                  placeholder="Describe your role and responsibilities"
                  rows={5}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">
                {language === "en" ? "Arabic Information" : "المعلومات باللغة العربية"}
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Title (Arabic)" : "المسمى الوظيفي (بالعربية)"}
                </label>
                <Input
                  name="titleAr"
                  value={experienceForm.titleAr}
                  onChange={handleExperienceInputChange}
                  className="text-right"
                  placeholder="مثال: مطور رئيسي"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Company (Arabic)" : "الشركة (بالعربية)"}
                </label>
                <Input
                  name="companyAr"
                  value={experienceForm.companyAr}
                  onChange={handleExperienceInputChange}
                  className="text-right"
                  placeholder="مثال: شركة التقنية"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Description (Arabic)" : "الوصف (بالعربية)"}
                </label>
                <Textarea
                  name="descriptionAr"
                  value={experienceForm.descriptionAr}
                  onChange={handleExperienceInputChange}
                  className="text-right"
                  placeholder="صف دورك ومسؤولياتك"
                  rows={5}
                />
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveExperience}>
              {language === "en" ? "Save" : "حفظ"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Education Dialog */}
      <AlertDialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {educationToEdit 
                ? language === "en" ? "Edit Education" : "تعديل التعليم"
                : language === "en" ? "Add Education" : "إضافة تعليم"
              }
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <h3 className="font-medium">
                {language === "en" ? "English Information" : "المعلومات باللغة الإنجليزية"}
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Period" : "الفترة"}
                </label>
                <Input
                  name="period"
                  value={educationForm.period}
                  onChange={handleEducationInputChange}
                  placeholder="e.g. 2016-2020"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Degree" : "الشهادة"}
                </label>
                <Input
                  name="degree"
                  value={educationForm.degree}
                  onChange={handleEducationInputChange}
                  placeholder="e.g. Bachelor of Computer Science"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Institution" : "المؤسسة التعليمية"}
                </label>
                <Input
                  name="institution"
                  value={educationForm.institution}
                  onChange={handleEducationInputChange}
                  placeholder="e.g. University of Technology"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Description" : "الوصف"}
                </label>
                <Textarea
                  name="description"
                  value={educationForm.description}
                  onChange={handleEducationInputChange}
                  placeholder="Describe your studies or achievements"
                  rows={5}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">
                {language === "en" ? "Arabic Information" : "المعلومات باللغة العربية"}
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Degree (Arabic)" : "الشهادة (بالعربية)"}
                </label>
                <Input
                  name="degreeAr"
                  value={educationForm.degreeAr}
                  onChange={handleEducationInputChange}
                  className="text-right"
                  placeholder="مثال: بكالوريوس علوم الحاسب"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Institution (Arabic)" : "المؤسسة التعليمية (بالعربية)"}
                </label>
                <Input
                  name="institutionAr"
                  value={educationForm.institutionAr}
                  onChange={handleEducationInputChange}
                  className="text-right"
                  placeholder="مثال: جامعة التكنولوجيا"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Description (Arabic)" : "الوصف (بالعربية)"}
                </label>
                <Textarea
                  name="descriptionAr"
                  value={educationForm.descriptionAr}
                  onChange={handleEducationInputChange}
                  className="text-right"
                  placeholder="صف دراستك أو إنجازاتك"
                  rows={5}
                />
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveEducation}>
              {language === "en" ? "Save" : "حفظ"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Certificate Dialog */}
      <AlertDialog open={isCertificateDialogOpen} onOpenChange={setIsCertificateDialogOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {certificateToEdit 
                ? language === "en" ? "Edit Certificate" : "تعديل الشهادة"
                : language === "en" ? "Add Certificate" : "إضافة شهادة"
              }
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <h3 className="font-medium">
                {language === "en" ? "English Information" : "المعلومات باللغة الإنجليزية"}
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Date" : "التاريخ"}
                </label>
                <Input
                  name="date"
                  type="date"
                  value={certificateForm.date}
                  onChange={handleCertificateInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Title" : "العنوان"}
                </label>
                <Input
                  name="title"
                  value={certificateForm.title}
                  onChange={handleCertificateInputChange}
                  placeholder="e.g. AWS Certified Developer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Issuer" : "الجهة المصدرة"}
                </label>
                <Input
                  name="issuer"
                  value={certificateForm.issuer}
                  onChange={handleCertificateInputChange}
                  placeholder="e.g. Amazon Web Services"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "URL (Optional)" : "الرابط (اختياري)"}
                </label>
                <Input
                  name="url"
                  value={certificateForm.url || ""}
                  onChange={handleCertificateInputChange}
                  placeholder="e.g. https://example.com/certificate"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">
                {language === "en" ? "Arabic Information" : "المعلومات باللغة العربية"}
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Title (Arabic)" : "العنوان (بالعربية)"}
                </label>
                <Input
                  name="titleAr"
                  value={certificateForm.titleAr}
                  onChange={handleCertificateInputChange}
                  className="text-right"
                  placeholder="مثال: مطور AWS معتمد"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Issuer (Arabic)" : "الجهة المصدرة (بالعربية)"}
                </label>
                <Input
                  name="issuerAr"
                  value={certificateForm.issuerAr}
                  onChange={handleCertificateInputChange}
                  className="text-right"
                  placeholder="مثال: أمازون ويب سيرفيسز"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Image URL (Optional)" : "رابط الصورة (اختياري)"}
                </label>
                <Input
                  name="image"
                  value={certificateForm.image || ""}
                  onChange={handleCertificateInputChange}
                  placeholder="e.g. https://example.com/certificate-image.jpg"
                />
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveCertificate}>
              {language === "en" ? "Save" : "حفظ"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!itemToDelete} 
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
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
              onClick={handleDeleteItem}
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
