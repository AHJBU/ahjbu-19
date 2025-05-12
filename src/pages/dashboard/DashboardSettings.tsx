
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardUserProfile } from "@/components/dashboard/DashboardUserProfile";
import { StaticContentEditor } from "@/components/dashboard/StaticContentEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LayoutTemplate, PaintBucket, UserCircle, FileText, Settings2, Database } from "lucide-react";

const DashboardSettings = () => {
  const { language } = useLanguage();

  return (
    <DashboardLayout 
      title={language === "en" ? "Settings" : "الإعدادات"}
      breadcrumbs={[
        { label: language === "en" ? "Settings" : "الإعدادات", href: "/dashboard/settings" }
      ]}
    >
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">
            <UserCircle className="h-4 w-4 mr-2" />
            {language === "en" ? "Profile" : "الملف الشخصي"}
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            {language === "en" ? "Content" : "المحتوى"}
          </TabsTrigger>
          <TabsTrigger value="layout">
            <LayoutTemplate className="h-4 w-4 mr-2" />
            {language === "en" ? "Layout" : "التخطيط"}
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <PaintBucket className="h-4 w-4 mr-2" />
            {language === "en" ? "Appearance" : "المظهر"}
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings2 className="h-4 w-4 mr-2" />
            {language === "en" ? "System" : "النظام"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DashboardUserProfile />
            </div>
            <div>
              {/* Additional profile information can go here in future */}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="content">
          <StaticContentEditor />
        </TabsContent>
        
        <TabsContent value="layout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Header Navigation" : "تنقل الهيدر"}</CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Customize the navigation menu in the site header" 
                    : "تخصيص قائمة التنقل في رأس الموقع"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to="/dashboard/header-editor">
                    {language === "en" ? "Edit Header Navigation" : "تعديل تنقل الهيدر"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Footer" : "تذييل الصفحة"}</CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Customize the footer content and links"
                    : "تخصيص محتوى وروابط تذييل الصفحة"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" disabled>
                  {language === "en" ? "Coming Soon" : "قريباً"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Homepage Layout" : "تخطيط الصفحة الرئيسية"}</CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Customize the sections and layout of the homepage"
                    : "تخصيص أقسام وتخطيط الصفحة الرئيسية"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" disabled>
                  {language === "en" ? "Coming Soon" : "قريباً"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <div className="text-center py-16 text-muted-foreground">
            {language === "en" 
              ? "Appearance settings will be implemented in the next phase." 
              : "سيتم تنفيذ إعدادات المظهر في المرحلة التالية."
            }
          </div>
        </TabsContent>
        
        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    {language === "en" ? "Database Setup" : "إعداد قاعدة البيانات"}
                  </div>
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Initialize or reset database tables and data" 
                    : "تهيئة أو إعادة تعيين جداول وبيانات قاعدة البيانات"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">
                  {language === "en" ? "Database Management" : "إدارة قاعدة البيانات"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default DashboardSettings;
