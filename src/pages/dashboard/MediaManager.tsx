
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { MediaCenter } from "@/components/media/MediaCenter";
import { Card, CardContent } from "@/components/ui/card";

const MediaManager = () => {
  const { language } = useLanguage();

  return (
    <DashboardLayout 
      title={language === "en" ? "Media Manager" : "إدارة الوسائط"}
      breadcrumbs={[{ label: language === "en" ? "Media" : "الوسائط", href: "/dashboard/media" }]}
    >
      <Card>
        <CardContent className="pt-6">
          <MediaCenter />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default MediaManager;
