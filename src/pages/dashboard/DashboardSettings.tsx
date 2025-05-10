
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";

const DashboardSettings = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    siteTitle: "Portfolio & Blog",
    siteTitleAr: "المدونة والمعرض",
    siteDescription: "Personal portfolio and blog website",
    siteDescriptionAr: "موقع المدونة الشخصية والمعرض",
    footerText: "© 2023 - All rights reserved",
    footerTextAr: "© 2023 - جميع الحقوق محفوظة",
    enableBlog: true,
    enableProjects: true,
    enableComments: true
  });
  
  // Social media settings
  const [socialSettings, setGeneralSocialSettings] = useState({
    twitter: "https://twitter.com/username",
    github: "https://github.com/username",
    linkedin: "https://linkedin.com/in/username",
    instagram: ""
  });
  
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggleChange = (name: string, checked: boolean) => {
    setGeneralSettings(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSocialSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would save to a database in a real implementation
    console.log("Saving settings:", { generalSettings, socialSettings });
    
    toast({
      title: language === "en" ? "Settings saved" : "تم حفظ الإعدادات",
      description: language === "en" 
        ? "Your settings have been saved successfully"
        : "تم حفظ الإعدادات بنجاح",
    });
  };

  return (
    <DashboardLayout 
      title={language === "en" ? "Site Settings" : "إعدادات الموقع"}
      breadcrumbs={[
        { label: language === "en" ? "Settings" : "الإعدادات", href: "/dashboard/settings" }
      ]}
    >
      <Tabs defaultValue="general">
        <TabsList className="mb-8">
          <TabsTrigger value="general">
            {language === "en" ? "General" : "عام"}
          </TabsTrigger>
          <TabsTrigger value="social">
            {language === "en" ? "Social Media" : "وسائل التواصل"}
          </TabsTrigger>
          <TabsTrigger value="advanced">
            {language === "en" ? "Advanced" : "متقدم"}
          </TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "General Settings" : "الإعدادات العامة"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Configure the basic information about your site" 
                    : "تكوين المعلومات الأساسية حول موقعك"
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="siteTitle">
                      {language === "en" ? "Site Title (English)" : "عنوان الموقع (بالإنجليزية)"}
                    </Label>
                    <Input 
                      id="siteTitle" 
                      name="siteTitle" 
                      value={generalSettings.siteTitle}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="siteTitleAr">
                      {language === "en" ? "Site Title (Arabic)" : "عنوان الموقع (بالعربية)"}
                    </Label>
                    <Input 
                      id="siteTitleAr" 
                      name="siteTitleAr" 
                      value={generalSettings.siteTitleAr}
                      onChange={handleGeneralChange}
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="siteDescription">
                      {language === "en" ? "Site Description (English)" : "وصف الموقع (بالإنجليزية)"}
                    </Label>
                    <Textarea 
                      id="siteDescription" 
                      name="siteDescription" 
                      value={generalSettings.siteDescription}
                      onChange={handleGeneralChange}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="siteDescriptionAr">
                      {language === "en" ? "Site Description (Arabic)" : "وصف الموقع (بالعربية)"}
                    </Label>
                    <Textarea 
                      id="siteDescriptionAr" 
                      name="siteDescriptionAr" 
                      value={generalSettings.siteDescriptionAr}
                      onChange={handleGeneralChange}
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="footerText">
                      {language === "en" ? "Footer Text (English)" : "نص التذييل (بالإنجليزية)"}
                    </Label>
                    <Input 
                      id="footerText" 
                      name="footerText" 
                      value={generalSettings.footerText}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="footerTextAr">
                      {language === "en" ? "Footer Text (Arabic)" : "نص التذييل (بالعربية)"}
                    </Label>
                    <Input 
                      id="footerTextAr" 
                      name="footerTextAr" 
                      value={generalSettings.footerTextAr}
                      onChange={handleGeneralChange}
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">
                    {language === "en" ? "Features" : "الميزات"}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enableBlog">
                          {language === "en" ? "Enable Blog" : "تفعيل المدونة"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" 
                            ? "Show the blog section on your site" 
                            : "عرض قسم المدونة على موقعك"
                          }
                        </p>
                      </div>
                      <Switch 
                        id="enableBlog" 
                        checked={generalSettings.enableBlog}
                        onCheckedChange={(checked) => handleToggleChange("enableBlog", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enableProjects">
                          {language === "en" ? "Enable Projects" : "تفعيل المشاريع"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" 
                            ? "Show the projects section on your site" 
                            : "عرض قسم المشاريع على موقعك"
                          }
                        </p>
                      </div>
                      <Switch 
                        id="enableProjects" 
                        checked={generalSettings.enableProjects}
                        onCheckedChange={(checked) => handleToggleChange("enableProjects", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enableComments">
                          {language === "en" ? "Enable Comments" : "تفعيل التعليقات"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" 
                            ? "Allow visitors to comment on blog posts" 
                            : "السماح للزوار بالتعليق على منشورات المدونة"
                          }
                        </p>
                      </div>
                      <Switch 
                        id="enableComments" 
                        checked={generalSettings.enableComments}
                        onCheckedChange={(checked) => handleToggleChange("enableComments", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {language === "en" ? "Save Settings" : "حفظ الإعدادات"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Social Media Settings */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "Social Media Links" : "روابط وسائل التواصل الاجتماعي"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Connect your social media accounts" 
                    : "ربط حسابات وسائل التواصل الاجتماعي الخاصة بك"
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input 
                    id="twitter" 
                    name="twitter" 
                    placeholder="https://twitter.com/username"
                    value={socialSettings.twitter}
                    onChange={handleSocialChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input 
                    id="github" 
                    name="github" 
                    placeholder="https://github.com/username"
                    value={socialSettings.github}
                    onChange={handleSocialChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input 
                    id="linkedin" 
                    name="linkedin" 
                    placeholder="https://linkedin.com/in/username"
                    value={socialSettings.linkedin}
                    onChange={handleSocialChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input 
                    id="instagram" 
                    name="instagram" 
                    placeholder="https://instagram.com/username"
                    value={socialSettings.instagram}
                    onChange={handleSocialChange}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {language === "en" ? "Save Settings" : "حفظ الإعدادات"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Advanced Settings */}
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "Advanced Settings" : "إعدادات متقدمة"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Configure advanced options for your site" 
                    : "تكوين خيارات متقدمة لموقعك"
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Advanced settings will be implemented in the next phase, including database configuration options."
                    : "سيتم تنفيذ الإعدادات المتقدمة في المرحلة التالية، بما في ذلك خيارات تكوين قاعدة البيانات."
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Hidden submit button to enable form submission on all tabs */}
          <button type="submit" className="hidden"></button>
        </form>
      </Tabs>
    </DashboardLayout>
  );
};

export default DashboardSettings;
