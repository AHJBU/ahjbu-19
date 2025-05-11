
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { MediaSelector } from "@/components/media/MediaSelector";
import { X, Plus } from "lucide-react";
import { 
  useSiteSettings, 
  useAboutContent,
  useHomePageContent,
  useFooterContent,
  SiteSettings,
  AboutContent,
  HomePageContent,
  FooterContent
} from "@/services/static-content-service";

export function StaticContentEditor() {
  const { language } = useLanguage();
  
  // Site Settings
  const { settings, updateSettings } = useSiteSettings();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(settings);
  
  // About Content
  const { aboutContent, updateAboutContent } = useAboutContent();
  const [about, setAbout] = useState<AboutContent>(aboutContent);
  
  // Home Page Content
  const { homePageContent, updateHomePageContent } = useHomePageContent();
  const [home, setHome] = useState<HomePageContent>(homePageContent);
  
  // Footer Content
  const { footerContent, updateFooterContent } = useFooterContent();
  const [footer, setFooter] = useState<FooterContent>(footerContent);
  
  // Update social links
  const updateSocialLink = (platform: keyof SiteSettings['socialLinks'], value: string) => {
    setSiteSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };
  
  // Add or remove skills
  const addSkill = () => {
    const skill = prompt(language === "en" ? "Enter skill:" : "أدخل المهارة:");
    if (skill && !about.skills.includes(skill)) {
      setAbout(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };
  
  const removeSkill = (skill: string) => {
    setAbout(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };
  
  // Add or remove footer links
  const addFooterLink = () => {
    const label = prompt(language === "en" ? "Enter link label (English):" : "أدخل عنوان الرابط (بالإنجليزية):");
    const labelAr = prompt(language === "en" ? "Enter link label (Arabic):" : "أدخل عنوان الرابط (بالعربية):");
    const url = prompt(language === "en" ? "Enter URL:" : "أدخل الرابط:");
    
    if (label && labelAr && url) {
      setFooter(prev => ({
        ...prev,
        links: [...prev.links, { label, labelAr, url }]
      }));
    }
  };
  
  const removeFooterLink = (index: number) => {
    setFooter(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };
  
  // Save handlers
  const saveSiteSettings = () => {
    updateSettings(siteSettings);
    toast({
      title: language === "en" ? "Settings Saved" : "تم حفظ الإعدادات",
      description: language === "en" ? "Your site settings have been updated." : "تم تحديث إعدادات الموقع."
    });
  };
  
  const saveAboutContent = () => {
    updateAboutContent(about);
    toast({
      title: language === "en" ? "About Content Saved" : "تم حفظ محتوى صفحة من أنا",
      description: language === "en" ? "Your about page content has been updated." : "تم تحديث محتوى صفحة من أنا."
    });
  };
  
  const saveHomePageContent = () => {
    updateHomePageContent(home);
    toast({
      title: language === "en" ? "Home Page Content Saved" : "تم حفظ محتوى الصفحة الرئيسية",
      description: language === "en" ? "Your home page content has been updated." : "تم تحديث محتوى الصفحة الرئيسية."
    });
  };
  
  const saveFooterContent = () => {
    updateFooterContent(footer);
    toast({
      title: language === "en" ? "Footer Content Saved" : "تم حفظ محتوى التذييل",
      description: language === "en" ? "Your footer content has been updated." : "تم تحديث محتوى التذييل."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === "en" ? "Static Content Editor" : "محرر المحتوى الثابت"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="site" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="site">
              {language === "en" ? "Site Settings" : "إعدادات الموقع"}
            </TabsTrigger>
            <TabsTrigger value="about">
              {language === "en" ? "About Page" : "صفحة من أنا"}
            </TabsTrigger>
            <TabsTrigger value="home">
              {language === "en" ? "Home Page" : "الصفحة الرئيسية"}
            </TabsTrigger>
            <TabsTrigger value="footer">
              {language === "en" ? "Footer" : "التذييل"}
            </TabsTrigger>
          </TabsList>
          
          {/* Site Settings Tab */}
          <TabsContent value="site" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="siteTitle">{language === "en" ? "Site Title (English)" : "عنوان الموقع (بالإنجليزية)"}</Label>
                <Input
                  id="siteTitle"
                  value={siteSettings.siteTitle}
                  onChange={(e) => setSiteSettings({...siteSettings, siteTitle: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="siteTitleAr">{language === "en" ? "Site Title (Arabic)" : "عنوان الموقع (بالعربية)"}</Label>
                <Input
                  id="siteTitleAr"
                  value={siteSettings.siteTitleAr}
                  onChange={(e) => setSiteSettings({...siteSettings, siteTitleAr: e.target.value})}
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="siteDescription">{language === "en" ? "Site Description (English)" : "وصف الموقع (بالإنجليزية)"}</Label>
                <Input
                  id="siteDescription"
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="siteDescriptionAr">{language === "en" ? "Site Description (Arabic)" : "وصف الموقع (بالعربية)"}</Label>
                <Input
                  id="siteDescriptionAr"
                  value={siteSettings.siteDescriptionAr}
                  onChange={(e) => setSiteSettings({...siteSettings, siteDescriptionAr: e.target.value})}
                  dir="rtl"
                />
              </div>
            </div>
            
            <div>
              <Label>{language === "en" ? "Logo" : "الشعار"}</Label>
              <MediaSelector
                value={siteSettings.logo}
                onChange={(url) => setSiteSettings({...siteSettings, logo: url})}
                type="image"
              />
            </div>
            
            <div>
              <Label htmlFor="contactEmail">{language === "en" ? "Contact Email" : "البريد الإلكتروني للتواصل"}</Label>
              <Input
                id="contactEmail"
                type="email"
                value={siteSettings.contactEmail}
                onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
              />
            </div>
            
            <div className="space-y-4">
              <Label>{language === "en" ? "Social Media Links" : "روابط وسائل التواصل الاجتماعي"}</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={siteSettings.socialLinks.facebook || ""}
                    onChange={(e) => updateSocialLink("facebook", e.target.value)}
                    placeholder="https://facebook.com/username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={siteSettings.socialLinks.twitter || ""}
                    onChange={(e) => updateSocialLink("twitter", e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={siteSettings.socialLinks.instagram || ""}
                    onChange={(e) => updateSocialLink("instagram", e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={siteSettings.socialLinks.linkedin || ""}
                    onChange={(e) => updateSocialLink("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={siteSettings.socialLinks.github || ""}
                    onChange={(e) => updateSocialLink("github", e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={saveSiteSettings}>
                {language === "en" ? "Save Settings" : "حفظ الإعدادات"}
              </Button>
            </div>
          </TabsContent>
          
          {/* About Page Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="aboutTitle">{language === "en" ? "Title (English)" : "العنوان (بالإنجليزية)"}</Label>
                <Input
                  id="aboutTitle"
                  value={about.title}
                  onChange={(e) => setAbout({...about, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="aboutTitleAr">{language === "en" ? "Title (Arabic)" : "العنوان (بالعربية)"}</Label>
                <Input
                  id="aboutTitleAr"
                  value={about.titleAr}
                  onChange={(e) => setAbout({...about, titleAr: e.target.value})}
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>{language === "en" ? "Content (English)" : "المحتوى (بالإنجليزية)"}</Label>
                <RichTextEditor
                  value={about.content}
                  onChange={(value) => setAbout({...about, content: value})}
                  dir="ltr"
                  height={300}
                />
              </div>
              <div>
                <Label>{language === "en" ? "Content (Arabic)" : "المحتوى (بالعربية)"}</Label>
                <RichTextEditor
                  value={about.contentAr}
                  onChange={(value) => setAbout({...about, contentAr: value})}
                  dir="rtl"
                  height={300}
                />
              </div>
            </div>
            
            <div>
              <Label>{language === "en" ? "Profile Image" : "صورة الملف الشخصي"}</Label>
              <MediaSelector
                value={about.image}
                onChange={(url) => setAbout({...about, image: url})}
                type="image"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>{language === "en" ? "Skills" : "المهارات"}</Label>
                <Button variant="outline" size="sm" onClick={addSkill}>
                  <Plus className="w-4 h-4 mr-1" />
                  {language === "en" ? "Add Skill" : "إضافة مهارة"}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 p-4 border rounded-md">
                {about.skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    className="flex items-center gap-1 cursor-pointer"
                    variant="secondary"
                  >
                    {skill}
                    <X 
                      className="h-3 w-3" 
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
                
                {about.skills.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    {language === "en" ? "No skills added yet" : "لم تتم إضافة مهارات بعد"}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={saveAboutContent}>
                {language === "en" ? "Save About Content" : "حفظ محتوى من أنا"}
              </Button>
            </div>
          </TabsContent>
          
          {/* Home Page Tab */}
          <TabsContent value="home" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="heroTitle">{language === "en" ? "Hero Title (English)" : "عنوان البطاقة الرئيسية (بالإنجليزية)"}</Label>
                <Input
                  id="heroTitle"
                  value={home.heroTitle}
                  onChange={(e) => setHome({...home, heroTitle: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="heroTitleAr">{language === "en" ? "Hero Title (Arabic)" : "عنوان البطاقة الرئيسية (بالعربية)"}</Label>
                <Input
                  id="heroTitleAr"
                  value={home.heroTitleAr}
                  onChange={(e) => setHome({...home, heroTitleAr: e.target.value})}
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="heroSubtitle">{language === "en" ? "Hero Subtitle (English)" : "العنوان الفرعي (بالإنجليزية)"}</Label>
                <Input
                  id="heroSubtitle"
                  value={home.heroSubtitle}
                  onChange={(e) => setHome({...home, heroSubtitle: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="heroSubtitleAr">{language === "en" ? "Hero Subtitle (Arabic)" : "العنوان الفرعي (بالعربية)"}</Label>
                <Input
                  id="heroSubtitleAr"
                  value={home.heroSubtitleAr}
                  onChange={(e) => setHome({...home, heroSubtitleAr: e.target.value})}
                  dir="rtl"
                />
              </div>
            </div>
            
            <div>
              <Label>{language === "en" ? "Hero Image" : "صورة البطاقة الرئيسية"}</Label>
              <MediaSelector
                value={home.heroImage}
                onChange={(url) => setHome({...home, heroImage: url})}
                type="image"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="heroButtonText">{language === "en" ? "Button Text (English)" : "نص الزر (بالإنجليزية)"}</Label>
                <Input
                  id="heroButtonText"
                  value={home.heroButtonText}
                  onChange={(e) => setHome({...home, heroButtonText: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="heroButtonTextAr">{language === "en" ? "Button Text (Arabic)" : "نص الزر (بالعربية)"}</Label>
                <Input
                  id="heroButtonTextAr"
                  value={home.heroButtonTextAr}
                  onChange={(e) => setHome({...home, heroButtonTextAr: e.target.value})}
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="heroButtonLink">{language === "en" ? "Button Link" : "رابط الزر"}</Label>
                <Input
                  id="heroButtonLink"
                  value={home.heroButtonLink}
                  onChange={(e) => setHome({...home, heroButtonLink: e.target.value})}
                  placeholder="/projects"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={saveHomePageContent}>
                {language === "en" ? "Save Home Page Content" : "حفظ محتوى الصفحة الرئيسية"}
              </Button>
            </div>
          </TabsContent>
          
          {/* Footer Tab */}
          <TabsContent value="footer" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="copyright">{language === "en" ? "Copyright (English)" : "حقوق النشر (بالإنجليزية)"}</Label>
                <Input
                  id="copyright"
                  value={footer.copyright}
                  onChange={(e) => setFooter({...footer, copyright: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="copyrightAr">{language === "en" ? "Copyright (Arabic)" : "حقوق النشر (بالعربية)"}</Label>
                <Input
                  id="copyrightAr"
                  value={footer.copyrightAr}
                  onChange={(e) => setFooter({...footer, copyrightAr: e.target.value})}
                  dir="rtl"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>{language === "en" ? "Footer Links" : "روابط التذييل"}</Label>
                <Button variant="outline" size="sm" onClick={addFooterLink}>
                  <Plus className="w-4 h-4 mr-1" />
                  {language === "en" ? "Add Link" : "إضافة رابط"}
                </Button>
              </div>
              
              <div className="space-y-2">
                {footer.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 border p-2 rounded-md">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <Input 
                        value={link.label} 
                        onChange={(e) => {
                          const newLinks = [...footer.links];
                          newLinks[index].label = e.target.value;
                          setFooter({...footer, links: newLinks});
                        }}
                        placeholder="English Label"
                      />
                      <Input 
                        value={link.labelAr} 
                        onChange={(e) => {
                          const newLinks = [...footer.links];
                          newLinks[index].labelAr = e.target.value;
                          setFooter({...footer, links: newLinks});
                        }}
                        placeholder="العنوان بالعربية"
                        dir="rtl"
                      />
                      <Input 
                        value={link.url} 
                        onChange={(e) => {
                          const newLinks = [...footer.links];
                          newLinks[index].url = e.target.value;
                          setFooter({...footer, links: newLinks});
                        }}
                        placeholder="/page-url"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFooterLink(index)} 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {footer.links.length === 0 && (
                  <div className="text-center p-4 border rounded-md text-muted-foreground">
                    {language === "en" ? "No footer links added yet" : "لم تتم إضافة روابط التذييل بعد"}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={saveFooterContent}>
                {language === "en" ? "Save Footer Content" : "حفظ محتوى التذييل"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
