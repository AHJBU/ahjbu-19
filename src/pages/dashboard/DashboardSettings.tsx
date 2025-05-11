
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardUserProfile } from "@/components/dashboard/DashboardUserProfile";

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
            {language === "en" ? "Profile" : "الملف الشخصي"}
          </TabsTrigger>
          <TabsTrigger value="account">
            {language === "en" ? "Account" : "الحساب"}
          </TabsTrigger>
          <TabsTrigger value="appearance">
            {language === "en" ? "Appearance" : "المظهر"}
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
        
        <TabsContent value="account">
          <div className="text-center py-16 text-muted-foreground">
            {language === "en" 
              ? "Account settings will be implemented in the next phase." 
              : "سيتم تنفيذ إعدادات الحساب في المرحلة التالية."
            }
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
      </Tabs>
    </DashboardLayout>
  );
};

export default DashboardSettings;
