
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, BookOpen, Search, Calendar, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Publication {
  id: string;
  title: string;
  titleAr: string;
  abstract: string;
  abstractAr: string;
  authors: string;
  authorsAr: string;
  publishedIn: string;
  publishedInAr: string;
  date: string;
  category: string;
  link?: string;
  image?: string;
}

const publications: Publication[] = [
  {
    id: "pub-1",
    title: "Modern Web Development Techniques",
    titleAr: "تقنيات تطوير الويب الحديثة",
    abstract: "An exploration of modern web development techniques including React, GraphQL, and serverless architecture.",
    abstractAr: "استكشاف تقنيات تطوير الويب الحديثة بما في ذلك React و GraphQL والهندسة المعمارية بدون خادم.",
    authors: "Ahmed Ali, Sarah Johnson",
    authorsAr: "أحمد علي، سارة جونسون",
    publishedIn: "Journal of Web Engineering",
    publishedInAr: "مجلة هندسة الويب",
    date: "2023-06-15",
    category: "Research",
    link: "https://example.com/paper1",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
  },
  {
    id: "pub-2",
    title: "Machine Learning in Web Applications",
    titleAr: "التعلم الآلي في تطبيقات الويب",
    abstract: "A comprehensive study on integrating machine learning algorithms into web applications for personalized user experiences.",
    abstractAr: "دراسة شاملة حول دمج خوارزميات التعلم الآلي في تطبيقات الويب لتجارب مستخدم مخصصة.",
    authors: "Mohammed Hassan, Lisa Wong",
    authorsAr: "محمد حسن، ليزا وونغ",
    publishedIn: "AI & Web Technologies Conference",
    publishedInAr: "مؤتمر الذكاء الاصطناعي وتقنيات الويب",
    date: "2023-03-22",
    category: "Conference",
    link: "https://example.com/paper2",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f"
  },
  {
    id: "pub-3",
    title: "Performance Optimization for SPAs",
    titleAr: "تحسين أداء تطبيقات الصفحة الواحدة",
    abstract: "Techniques and strategies for optimizing performance in Single Page Applications, focusing on React and Vue.js frameworks.",
    abstractAr: "تقنيات واستراتيجيات لتحسين الأداء في تطبيقات الصفحة الواحدة، مع التركيز على أطر عمل React و Vue.js.",
    authors: "Ahmed Ali",
    authorsAr: "أحمد علي",
    publishedIn: "Web Performance Today",
    publishedInAr: "أداء الويب اليوم",
    date: "2022-11-08",
    category: "Article",
    link: "https://example.com/article1",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  }
];

const getPublicationsByYear = (): Record<string, Publication[]> => {
  const groupedByYear: Record<string, Publication[]> = {};
  
  publications.forEach(publication => {
    const year = new Date(publication.date).getFullYear().toString();
    
    if (!groupedByYear[year]) {
      groupedByYear[year] = [];
    }
    
    groupedByYear[year].push(publication);
  });
  
  // Sort years in descending order
  return Object.fromEntries(
    Object.entries(groupedByYear).sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
  );
};

const getPublicationCategories = (): string[] => {
  const categories = new Set<string>();
  
  publications.forEach(publication => {
    categories.add(publication.category);
  });
  
  return Array.from(categories);
};

const Publications = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const publicationsByYear = getPublicationsByYear();
  const categories = getPublicationCategories();
  
  // Filter publications based on selected category and search term
  const filteredPublications = publications.filter(publication => {
    // Filter by category
    if (activeCategory && publication.category !== activeCategory) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const title = language === "en" ? publication.title : publication.titleAr;
      const abstract = language === "en" ? publication.abstract : publication.abstractAr;
      const authors = language === "en" ? publication.authors : publication.authorsAr;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        title.toLowerCase().includes(searchLower) ||
        abstract.toLowerCase().includes(searchLower) ||
        authors.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
                <BookOpen className="h-8 w-8 text-primary" />
                {language === "en" ? "Publications & Research" : "المنشورات والأبحاث"}
              </h1>
              <p className="text-muted-foreground">
                {language === "en"
                  ? "Academic papers, articles, and research publications in web development and related fields."
                  : "الأوراق الأكاديمية والمقالات والمنشورات البحثية في تطوير الويب والمجالات ذات الصلة."
                }
              </p>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start mb-10 gap-6">
              {/* Search */}
              <div className="relative w-full lg:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={language === "en" ? "Search publications..." : "البحث في المنشورات..."}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Category filter */}
              <div className="space-y-2 w-full lg:w-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Filter className="h-4 w-4" />
                  {language === "en" ? "Filter by type:" : "تصفية حسب النوع:"}
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
            </div>

            {filteredPublications.length > 0 ? (
              <div className="space-y-8">
                {filteredPublications.map((publication) => (
                  <Card key={publication.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {publication.image && (
                        <div className="md:w-1/3 h-48 md:h-auto">
                          <img 
                            src={publication.image} 
                            alt={language === "en" ? publication.title : publication.titleAr}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <CardContent className={`p-6 ${publication.image ? 'md:w-2/3' : 'w-full'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <Badge className="w-fit">
                            {publication.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(publication.date).toLocaleDateString(
                              language === "en" ? "en-US" : "ar-SA",
                              { year: "numeric", month: "long", day: "numeric" }
                            )}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">
                          {language === "en" ? publication.title : publication.titleAr}
                        </h3>
                        
                        <p className="text-sm mb-4 text-muted-foreground">
                          <span className="font-medium">
                            {language === "en" ? "Authors: " : "المؤلفون: "}
                          </span>
                          {language === "en" ? publication.authors : publication.authorsAr}
                        </p>
                        
                        <p className="text-muted-foreground mb-3">
                          {language === "en" ? publication.abstract : publication.abstractAr}
                        </p>
                        
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
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  {language === "en" 
                    ? "No publications match your filter criteria." 
                    : "لا توجد منشورات تطابق معايير التصفية."
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

export default Publications;
