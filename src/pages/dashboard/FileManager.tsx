
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { FileManager } from "@/components/files/FileManager";
import { Card, CardContent } from "@/components/ui/card";

const DashboardFileManager = () => {
  const { language } = useLanguage();

  return (
    <DashboardLayout 
      title={language === "en" ? "File Manager" : "إدارة الملفات"}
      breadcrumbs={[
        { label: language === "en" ? "Files" : "الملفات", href: "/dashboard/files" }
      ]}
    >
      <Card>
        <CardContent className="pt-6">
          <FileManager />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default DashboardFileManager;
