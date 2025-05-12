import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoaderCircle, Settings, User, Shield, Globe, Languages, Sparkles, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { StaticContentEditor } from "@/components/dashboard/StaticContentEditor";

const DashboardSettings = () => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <DashboardLayout 
      title={language === "en" ? "Settings" : "الإعدادات"}
      breadcrumbs={[
        { label: language === "en" ? "Dashboard" : "لوحة التحكم", href: "/dashboard" },
        { label: language === "en" ? "Settings" : "الإعدادات", href: "/dashboard/settings" }
      ]}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            {language === "en" ? "General" : "عام"}
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            {language === "en" ? "Account" : "الحساب"}
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            {language === "en" ? "Security" : "الأمان"}
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Globe className="h-4 w-4 mr-2" />
            {language === "en" ? "Appearance" : "المظهر"}
          </TabsTrigger>
          <TabsTrigger value="content">
            <Home className="h-4 w-4 mr-2" />
            {language === "en" ? "Content" : "المحتوى"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "General Settings" : "الإعدادات العامة"}</CardTitle>
              <CardDescription>
                {language === "en" 
                  ? "Manage general website settings." 
                  : "إدارة إعدادات الموقع العامة."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="siteName">{language === "en" ? "Site Name" : "اسم الموقع"}</Label>
                  <Input id="siteName" defaultValue="Dr. Academic Portfolio" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="siteDescription">
                    {language === "en" ? "Site Description" : "وصف الموقع"}
                  </Label>
                  <Input 
                    id="siteDescription" 
                    defaultValue={language === "en" 
                      ? "Academic portfolio and personal website" 
                      : "سيرة أكاديمية وموقع شخصي"
                    } 
                    className="mt-1" 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{language === "en" ? "Maintenance Mode" : "وضع الصيانة"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" 
                        ? "Temporarily disable public access to the site." 
                        : "تعطيل الوصول العام للموقع مؤقتًا."}
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "en" ? "Advanced Features" : "الميزات المتقدمة"}
                </h3>
                
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        {language === "en" ? "AI Tools" : "أدوات الذكاء الاصطناعي"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {language === "en" 
                          ? "Configure AI tools for content translation and generation." 
                          : "تكوين أدوات الذكاء الاصطناعي لترجمة المحتوى وإنشائه."}
                      </p>
                      <Button asChild>
                        <Link to="/dashboard/settings/ai">
                          {language === "en" ? "Configure AI Settings" : "تكوين إعدادات الذكاء الاصطناعي"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Languages className="h-5 w-5 text-blue-500" />
                        {language === "en" ? "Localization" : "التوطين اللغوي"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {language === "en" 
                          ? "Configure language settings and translations." 
                          : "تكوين إعدادات اللغة والترجمات."}
                      </p>
                      <Button variant="outline">
                        {language === "en" ? "Manage Languages" : "إدارة اللغات"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Account Settings" : "إعدادات الحساب"}</CardTitle>
              <CardDescription>
                {language === "en" 
                  ? "Manage your account details." 
                  : "إدارة تفاصيل حسابك."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">{language === "en" ? "Name" : "الاسم"}</Label>
                <Input id="name" defaultValue="Dr. Academic" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="email">{language === "en" ? "Email" : "البريد الإلكتروني"}</Label>
                <Input id="email" defaultValue="admin@example.com" type="email" className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Security Settings" : "إعدادات الأمان"}</CardTitle>
              <CardDescription>
                {language === "en" 
                  ? "Manage security settings for your account." 
                  : "إدارة إعدادات الأمان لحسابك."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">{language === "en" ? "New Password" : "كلمة المرور الجديدة"}</Label>
                <Input id="password" type="password" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">
                  {language === "en" ? "Confirm New Password" : "تأكيد كلمة المرور الجديدة"}
                </Label>
                <Input id="confirmPassword" type="password" className="mt-1" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{language === "en" ? "Two-Factor Authentication" : "المصادقة الثنائية"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" 
                      ? "Enable two-factor authentication for added security." 
                      : "تمكين المصادقة الثنائية لأمان إضافي."}
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Appearance Settings" : "إعدادات المظهر"}</CardTitle>
              <CardDescription>
                {language === "en" 
                  ? "Customize the look and feel of your website." 
                  : "تخصيص مظهر وشكل موقعك."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{language === "en" ? "RTL Support" : "دعم الكتابة من اليمين إلى اليسار"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" 
                      ? "Support right-to-left languages." 
                      : "دعم اللغات التي تكتب من اليمين إلى اليسار."}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{language === "en" ? "Dark Mode" : "الوضع الداكن"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" 
                      ? "Enable dark mode theme." 
                      : "تمكين سمة الوضع الداكن."}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{language === "en" ? "Header Customization" : "تخصيص الهيدر"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" 
                      ? "Customize website header and navigation." 
                      : "تخصيص رأس الموقع والتنقل."}
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/dashboard/header-editor">
                    {language === "en" ? "Header Editor" : "محرر الهيدر"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <StaticContentEditor />
        </TabsContent>
      </Tabs>
      
      {activeTab !== "content" && (
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {language === "en" ? "Saving..." : "جارِ الحفظ..."}
              </>
            ) : (
              language === "en" ? "Save Settings" : "حفظ الإعدادات"
            )}
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardSettings;
