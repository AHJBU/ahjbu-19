
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Calendar, AlertTriangle } from "lucide-react";
import { Publication } from "@/types/publication";

const PublicationPreview = () => {
  const { language } = useLanguage();
  const [publication, setPublication] = useState<Partial<Publication> | null>(null);

  useEffect(() => {
    const previewData = sessionStorage.getItem('publicationPreview');
    if (previewData) {
      setPublication(JSON.parse(previewData));
    }
  }, []);

  if (!publication) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-2xl font-bold mb-4">
              {language === "en" ? "No preview data found" : "لم يتم العثور على بيانات المعاينة"}
            </h1>
            <p className="mb-6">
              {language === "en"
                ? "The preview data has expired or was not properly set."
                : "انتهت صلاحية بيانات المعاينة أو لم يتم تعيينها بشكل صحيح."
              }
            </p>
            <Button onClick={() => window.close()}>
              {language === "en" ? "Close Preview" : "إغلاق المعاينة"}
            </Button>
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
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-md mb-8 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                {language === "en" 
                  ? "This is a preview. The publication has not been published yet." 
                  : "هذه معاينة. لم يتم نشر المنشور بعد."
                }
              </p>
              <Button size="sm" variant="outline" className="ml-auto" onClick={() => window.close()}>
                {language === "en" ? "Close Preview" : "إغلاق المعاينة"}
              </Button>
            </div>

            <Card className="overflow-hidden mb-8">
              {publication.image && (
                <div className="w-full h-64">
                  <img 
                    src={publication.image} 
                    alt={language === "en" ? publication.title : publication.titleAr}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  {publication.category && (
                    <Badge className="w-fit">
                      {publication.category}
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {publication.date && new Date(publication.date).toLocaleDateString(
                      language === "en" ? "en-US" : "ar-SA",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold mb-4">
                  {language === "en" ? publication.title : publication.titleAr}
                </h1>
                
                <p className="text-sm mb-4 text-muted-foreground">
                  <span className="font-medium">
                    {language === "en" ? "Authors: " : "المؤلفون: "}
                  </span>
                  {language === "en" ? publication.authors : publication.authorsAr}
                </p>
                
                <div className="space-y-4 mb-8">
                  <p className="text-lg">
                    {language === "en" ? publication.abstract : publication.abstractAr}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm">
                    <span className="font-medium">
                      {language === "en" ? "Published in: " : "نُشر في: "}
                    </span>
                    {language === "en" ? publication.publishedIn : publication.publishedInAr}
                  </p>
                  
                  {publication.link && (
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <a href={publication.link} target="_blank" rel="noopener noreferrer">
                        {language === "en" ? "Read Paper" : "قراءة الورقة"}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PublicationPreview;
