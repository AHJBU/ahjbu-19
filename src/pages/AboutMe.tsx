
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/profile-service";
import { Profile } from "@/types/profile";

const AboutMe = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("about");
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{language === "en" ? "Error" : "خطأ"}</h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Failed to load profile information. Please try again later."
                : "فشل تحميل معلومات الملف الشخصي. الرجاء المحاولة مرة أخرى لاحقا."
              }
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {/* Header Section with Cover Image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={profile.coverImage || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        {/* Profile Information */}
        <div className="container mx-auto px-4 -mt-20">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background">
                <AvatarImage src={profile.avatar} alt={language === "en" ? profile.name : profile.nameAr} />
                <AvatarFallback className="text-3xl">
                  {(language === "en" ? profile.name : profile.nameAr).substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold">
                  {language === "en" ? profile.name : profile.nameAr}
                </h1>
                <p className="text-xl text-muted-foreground mt-1">
                  {language === "en" ? profile.title : profile.titleAr}
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <Mail className="h-4 w-4" />
                      <span>{profile.email}</span>
                    </a>
                  )}
                  
                  {profile.phone && (
                    <a href={`tel:${profile.phone}`} className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <Phone className="h-4 w-4" />
                      <span>{profile.phone}</span>
                    </a>
                  )}
                  
                  {(profile.location || profile.locationAr) && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{language === "en" ? profile.location : profile.locationAr}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 md:mt-0">
                {profile.social?.github && (
                  <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="bg-card hover:bg-accent p-2 rounded-full transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                )}
                
                {profile.social?.linkedin && (
                  <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="bg-card hover:bg-accent p-2 rounded-full transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                
                {profile.social?.twitter && (
                  <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="bg-card hover:bg-accent p-2 rounded-full transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                
                {profile.social?.facebook && (
                  <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer" className="bg-card hover:bg-accent p-2 rounded-full transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                
                {profile.social?.instagram && (
                  <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer" className="bg-card hover:bg-accent p-2 rounded-full transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                
                {profile.social?.website && (
                  <a href={profile.social.website} target="_blank" rel="noopener noreferrer" className="bg-card hover:bg-accent p-2 rounded-full transition-colors">
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start overflow-auto">
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {language === "en" ? "About" : "نبذة عني"}
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {language === "en" ? "Experience" : "الخبرات"}
                </TabsTrigger>
                <TabsTrigger value="education" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  {language === "en" ? "Education" : "التعليم"}
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  {language === "en" ? "Skills" : "المهارات"}
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {language === "en" ? "Gallery" : "المعرض"}
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-8 mb-16">
                <TabsContent value="about">
                  <Card>
                    <CardContent className="p-6">
                      <div className="prose max-w-none dark:prose-invert">
                        <h2 className="text-2xl font-bold mb-4">
                          {language === "en" ? "About Me" : "نبذة عني"}
                        </h2>
                        <p className="whitespace-pre-line">
                          {language === "en" ? profile.bio : profile.bioAr}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="experience">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">
                        {language === "en" ? "Work Experience" : "الخبرات العملية"}
                      </h2>
                      
                      {profile.experiences && profile.experiences.length > 0 ? (
                        <div className="space-y-8">
                          {profile.experiences.map((exp, index) => (
                            <div key={exp.id} className={index !== 0 ? "pt-8 border-t" : ""}>
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                <div>
                                  <h3 className="text-xl font-semibold">
                                    {language === "en" ? exp.title : exp.titleAr}
                                  </h3>
                                  <p className="text-lg text-muted-foreground">
                                    {language === "en" ? exp.company : exp.companyAr}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-4 w-4 flex-shrink-0" />
                                  <span>
                                    {new Date(exp.startDate).toLocaleDateString(
                                      language === "en" ? "en-US" : "ar-SA",
                                      { year: 'numeric', month: 'long' }
                                    )}
                                    {' - '}
                                    {exp.current ? 
                                      (language === "en" ? "Present" : "حتى الآن") : 
                                      new Date(exp.endDate as string).toLocaleDateString(
                                        language === "en" ? "en-US" : "ar-SA",
                                        { year: 'numeric', month: 'long' }
                                      )
                                    }
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                <MapPin className="h-4 w-4" />
                                <span>{language === "en" ? exp.location : exp.locationAr}</span>
                              </div>
                              
                              <p className="mt-4 whitespace-pre-line">
                                {language === "en" ? exp.description : exp.descriptionAr}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          {language === "en" 
                            ? "No work experience information available." 
                            : "لا توجد معلومات عن الخبرة العملية متاحة."
                          }
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="education">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">
                        {language === "en" ? "Education" : "التعليم"}
                      </h2>
                      
                      {profile.education && profile.education.length > 0 ? (
                        <div className="space-y-8">
                          {profile.education.map((edu, index) => (
                            <div key={edu.id} className={index !== 0 ? "pt-8 border-t" : ""}>
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                <div>
                                  <h3 className="text-xl font-semibold">
                                    {language === "en" ? edu.degree : edu.degreeAr}
                                  </h3>
                                  <p className="text-lg text-muted-foreground">
                                    {language === "en" ? edu.institution : edu.institutionAr}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-4 w-4 flex-shrink-0" />
                                  <span>
                                    {new Date(edu.startDate).toLocaleDateString(
                                      language === "en" ? "en-US" : "ar-SA",
                                      { year: 'numeric', month: 'long' }
                                    )}
                                    {' - '}
                                    {edu.current ? 
                                      (language === "en" ? "Present" : "حتى الآن") : 
                                      new Date(edu.endDate as string).toLocaleDateString(
                                        language === "en" ? "en-US" : "ar-SA",
                                        { year: 'numeric', month: 'long' }
                                      )
                                    }
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                <MapPin className="h-4 w-4" />
                                <span>{language === "en" ? edu.location : edu.locationAr}</span>
                              </div>
                              
                              <p className="mt-4 whitespace-pre-line">
                                {language === "en" ? edu.description : edu.descriptionAr}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          {language === "en" 
                            ? "No education information available." 
                            : "لا توجد معلومات عن التعليم متاحة."
                          }
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="skills">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">
                        {language === "en" ? "Skills & Expertise" : "المهارات والخبرات"}
                      </h2>
                      
                      {profile.skills && profile.skills.length > 0 ? (
                        <div>
                          {/* Group skills by category */}
                          {Object.entries(
                            profile.skills.reduce((acc, skill) => {
                              if (!acc[skill.category]) {
                                acc[skill.category] = [];
                              }
                              acc[skill.category].push(skill);
                              return acc;
                            }, {} as Record<string, typeof profile.skills>)
                          ).map(([category, skills]) => (
                            <div key={category} className="mb-8">
                              <h3 className="text-xl font-semibold mb-4">{category}</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {skills.map(skill => (
                                  <div key={skill.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between mb-2">
                                      <h4 className="font-medium">{language === "en" ? skill.name : skill.nameAr}</h4>
                                      <span className="text-sm font-medium">{skill.level}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                      <div 
                                        className="bg-primary h-2.5 rounded-full" 
                                        style={{ width: `${skill.level}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          {language === "en" 
                            ? "No skills information available." 
                            : "لا توجد معلومات عن المهارات متاحة."
                          }
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="gallery">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">
                        {language === "en" ? "Gallery" : "المعرض"}
                      </h2>
                      
                      {profile.gallery && profile.gallery.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {profile.gallery.map(item => (
                            <div key={item.id} className="group overflow-hidden rounded-lg border">
                              <div className="aspect-square relative overflow-hidden">
                                <img 
                                  src={item.url} 
                                  alt={language === "en" ? item.title : item.titleAr}
                                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                  <h3 className="text-white font-medium">
                                    {language === "en" ? item.title : item.titleAr}
                                  </h3>
                                  {(item.description || item.descriptionAr) && (
                                    <p className="text-white/80 text-sm mt-1">
                                      {language === "en" ? item.description : item.descriptionAr}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          {language === "en" 
                            ? "No gallery items available." 
                            : "لا توجد عناصر معرض متاحة."
                          }
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutMe;
