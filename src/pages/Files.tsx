import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Download, 
  FileText,
  FileImage,
  FileCode,
  File
} from "lucide-react";

interface File {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  fileType: string;
  size: string;
  date: string;
  downloadUrl: string;
  featured?: boolean;
}

const files: File[] = [
  {
    id: "file-1",
    title: "React Performance Optimization Guide",
    titleAr: "دليل تحسين أداء React",
    description: "A comprehensive guide on optimizing React applications for better performance and user experience.",
    descriptionAr: "دليل شامل حول تحسين تطبيقات React للحصول على أداء أفضل وتجربة مستخدم أفضل.",
    category: "Guide",
    fileType: "PDF",
    size: "2.4 MB",
    date: "2023-08-15",
    downloadUrl: "#",
    featured: true
  },
  {
    id: "file-2",
    title: "Responsive Web Design Templates",
    titleAr: "قوالب تصميم ويب متجاوب",
    description: "Collection of responsive HTML/CSS templates for various types of websites and applications.",
    descriptionAr: "مجموعة من قوالب HTML/CSS المتجاوبة لمختلف أنواع مواقع الويب والتطبيقات.",
    category: "Template",
    fileType: "ZIP",
    size: "8.7 MB",
    date: "2023-07-22",
    downloadUrl: "#"
  },
  {
    id: "file-3",
    title: "JavaScript Best Practices Cheat Sheet",
    titleAr: "ملخص أفضل ممارسات JavaScript",
    description: "A quick reference guide for JavaScript best practices and common patterns.",
    descriptionAr: "دليل مرجعي سريع لأفضل ممارسات JavaScript والأنماط الشائعة.",
    category: "Cheat Sheet",
    fileType: "PDF",
    size: "1.2 MB",
    date: "2023-06-10",
    downloadUrl: "#",
    featured: true
  },
  {
    id: "file-4",
    title: "UI/UX Design Resources",
    titleAr: "موارد تصميم واجهة وتجربة المستخدم",
    description: "Pack of design resources including UI components, icons, and mockup templates.",
    descriptionAr: "حزمة من موارد التصميم بما في ذلك مكونات واجهة المستخدم والأيقونات وقوالب النماذج.",
    category: "Resources",
    fileType: "ZIP",
    size: "15.3 MB",
    date: "2023-05-05",
    downloadUrl: "#"
  },
  {
    id: "file-5",
    title: "Web Accessibility Checklist",
    titleAr: "قائمة التحقق من إمكانية الوصول إلى الويب",
    description: "A detailed checklist for ensuring your web projects meet accessibility standards.",
    descriptionAr: "قائمة تحقق مفصلة للتأكد من أن مشاريع الويب الخاصة بك تلبي معايير إمكانية الوصول.",
    category: "Checklist",
    fileType: "PDF",
    size: "0.8 MB",
    date: "2023-04-18",
    downloadUrl: "#"
  }
];

const getFileCategories = (): string[] => {
  const categories = new Set<string>();
  files.forEach(file => categories.add(file.category));
  return Array.from(categories);
};

const getFileTypes = (): string[] => {
  const types = new Set<string>();
  files.forEach(file => types.add(file.fileType));
  return Array.from(types);
};

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return <File className="h-6 w-6 text-red-500" />;
    case "zip":
      return <FileCode className="h-6 w-6 text-blue-500" />;
    case "png":
    case "jpg":
    case "jpeg":
      return <FileImage className="h-6 w-6 text-green-500" />;
    default:
      return <FileText className="h-6 w-6 text-gray-500" />;
  }
};

const Files = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFileType, setActiveFileType] = useState<string | null>(null);
  
  const categories = getFileCategories();
  const fileTypes = getFileTypes();
  
  const filteredFiles = files.filter(file => {
    // Filter by category
    if (activeCategory && file.category !== activeCategory) {
      return false;
    }
    
    // Filter by file type
    if (activeFileType && file.fileType !== activeFileType) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const title = language === "en" ? file.title : file.titleAr;
      const description = language === "en" ? file.description : file.descriptionAr;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        title.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  const featuredFiles = files.filter(file => file.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
                <Download className="h-8 w-8 text-primary" />
                {language === "en" ? "Files & Downloads" : "الملفات والتنزيلات"}
              </h1>
              <p className="text-muted-foreground">
                {language === "en"
                  ? "Free resources, templates, guides, and tools for web development and design."
                  : "موارد مجانية وقوالب وأدلة وأدوات لتطوير الويب والتصميم."
                }
              </p>
            </div>

            {/* Featured files section */}
            {featuredFiles.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6">
                  {language === "en" ? "Featured Downloads" : "التنزيلات المميزة"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredFiles.map(file => (
                    <Card key={file.id} className="overflow-hidden border border-primary/20 bg-primary/5">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.fileType)}
                            <div>
                              <h3 className="font-bold text-lg">
                                {language === "en" ? file.title : file.titleAr}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {file.fileType} • {file.size}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {file.category}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">
                          {language === "en" ? file.description : file.descriptionAr}
                        </p>
                      </CardContent>
                      
                      <CardFooter className="bg-muted/50 px-6 py-3 flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {new Date(file.date).toLocaleDateString(
                            language === "en" ? "en-US" : "ar-SA",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </span>
                        
                        <Button size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          {language === "en" ? "Download" : "تنزيل"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
              {/* Search */}
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={language === "en" ? "Search files..." : "البحث في الملفات..."}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-6 w-full md:w-auto">
                {/* Category filter */}
                <div className="space-y-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Filter className="h-4 w-4" />
                    {language === "en" ? "Category:" : "الفئة:"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={activeCategory === null ? "secondary" : "outline"} 
                      size="sm"
                      onClick={() => setActiveCategory(null)}
                    >
                      {language === "en" ? "All" : "الكل"}
                    </Button>
                    
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={activeCategory === category ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* File type filter */}
                <div className="space-y-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <FileText className="h-4 w-4" />
                    {language === "en" ? "File Type:" : "نوع الملف:"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={activeFileType === null ? "secondary" : "outline"} 
                      size="sm"
                      onClick={() => setActiveFileType(null)}
                    >
                      {language === "en" ? "All" : "الكل"}
                    </Button>
                    
                    {fileTypes.map((type) => (
                      <Button
                        key={type}
                        variant={activeFileType === type ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setActiveFileType(type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Files list */}
            {filteredFiles.length > 0 ? (
              <div className="space-y-4">
                {filteredFiles.map(file => (
                  <Card key={file.id} className="overflow-hidden">
                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex-shrink-0 bg-muted rounded-lg p-4 flex items-center justify-center">
                        {getFileIcon(file.fileType)}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="font-bold">
                            {language === "en" ? file.title : file.titleAr}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {file.fileType}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {file.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 text-sm">
                          {language === "en" ? file.description : file.descriptionAr}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span>
                              {new Date(file.date).toLocaleDateString(
                                language === "en" ? "en-US" : "ar-SA",
                                { year: "numeric", month: "short", day: "numeric" }
                              )}
                            </span>
                          </div>
                          
                          <Button size="sm" className="gap-2" asChild>
                            <a href={file.downloadUrl} download>
                              <Download className="h-4 w-4" />
                              {language === "en" ? "Download" : "تنزيل"}
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  {language === "en" 
                    ? "No files match your filter criteria." 
                    : "لا توجد ملفات تطابق معايير التصفية."
                  }
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Files;
