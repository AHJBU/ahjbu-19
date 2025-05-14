import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/components/ui/use-toast";
import { Download, RefreshCcw, Upload } from "lucide-react";

interface Backup {
  name: string;
  size: string;
  date: string;
}

const DashboardBackups = () => {
  const { language } = useLanguage();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data for backups
    setBackups([
      { name: "backup_2024-05-14.sql", size: "256 MB", date: "2024-05-14" },
      { name: "backup_2024-05-13.sql", size: "250 MB", date: "2024-05-13" },
      { name: "backup_2024-05-12.sql", size: "245 MB", date: "2024-05-12" },
    ]);
  }, []);

  const handleCreateBackup = async () => {
    setLoading(true);
    // Simulate creating a backup
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    toast({
      title: language === "en" ? "Backup Created" : "تم إنشاء نسخة احتياطية",
      description:
        language === "en"
          ? "A new backup has been created successfully."
          : "تم إنشاء نسخة احتياطية جديدة بنجاح.",
    });
  };

  const handleRestoreBackup = async (backupName: string) => {
    setLoading(true);
    // Simulate restoring a backup
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    toast({
      title: language === "en" ? "Backup Restored" : "تم استعادة النسخة الاحتياطية",
      description:
        language === "en"
          ? `Backup ${backupName} has been restored successfully.`
          : `تم استعادة النسخة الاحتياطية ${backupName} بنجاح.`,
    });
  };

  const handleDownloadBackup = (backupName: string) => {
    // Simulate downloading a backup
    toast({
      title: language === "en" ? "Download Started" : "بدأ التنزيل",
      description:
        language === "en"
          ? `Downloading ${backupName}...`
          : `يتم الآن تنزيل ${backupName}...`,
    });
  };

  return (
    <DashboardLayout title={language === "en" ? "Backups" : "النسخ الاحتياطية"}>
      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "Create Backup" : "إنشاء نسخة احتياطية"}</CardTitle>
          <CardDescription>
            {language === "en"
              ? "Create a new backup of your database and files."
              : "إنشاء نسخة احتياطية جديدة لقاعدة البيانات والملفات."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleCreateBackup} disabled={loading}>
            {loading && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />}
            {language === "en" ? "Create Backup" : "إنشاء نسخة احتياطية"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "Existing Backups" : "النسخ الاحتياطية الموجودة"}</CardTitle>
          <CardDescription>
            {language === "en"
              ? "Manage and restore from existing backups."
              : "إدارة واستعادة من النسخ الاحتياطية الموجودة."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {backups.map((backup) => (
            <div key={backup.name} className="border rounded-md p-4">
              <div className="font-bold">{backup.name}</div>
              <div className="text-sm text-muted-foreground">
                {language === "en" ? "Size:" : "الحجم:"} {backup.size} | {language === "en" ? "Date:" : "التاريخ:"}{" "}
                {backup.date}
              </div>
              <CardFooter className="justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadBackup(backup.name)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {language === "en" ? "Download" : "تنزيل"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleRestoreBackup(backup.name)}
                  disabled={loading}
                >
                  {loading && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />}
                  {language === "en" ? "Restore" : "استعادة"}
                </Button>
              </CardFooter>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default DashboardBackups;
