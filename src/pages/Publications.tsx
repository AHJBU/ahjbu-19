
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';
import { Publication } from '@/types/publication';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

// Function to fetch publications
const getPublications = async (): Promise<Publication[]> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Publication[];
};

const Publications = () => {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const pageTitle = language === 'en' ? 'Publications & Research' : 'المنشورات والأبحاث';

  // Fetch publications data
  const { data: publications = [], isLoading } = useQuery({
    queryKey: ['publications'],
    queryFn: getPublications
  });

  // Get unique categories for filtering
  const categories = ["all", ...new Set(publications.map(item => item.category))];

  // Filter publications based on active filter
  const filteredPublications = activeFilter === "all" 
    ? publications 
    : publications.filter(item => item.category === activeFilter);

  return (
    <Layout pageTitle={pageTitle}>
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{pageTitle}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'en'
              ? 'Academic research, articles, and other publications I have authored or contributed to.'
              : 'البحوث الأكاديمية والمقالات والمنشورات الأخرى التي قمت بتأليفها أو المساهمة فيها.'}
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full mb-12" onValueChange={setActiveFilter}>
          <div className="flex justify-center mb-8">
            <TabsList className="w-fit">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category === 'all' ? (language === 'en' ? 'All' : 'الكل') : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredPublications.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredPublications.map((publication) => (
              <Card key={publication.id} className="overflow-hidden">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                  {publication.image && (
                    <div className="flex-shrink-0 md:w-1/4 overflow-hidden">
                      <img
                        src={publication.image}
                        alt={language === 'en' ? publication.title : publication.titleAr}
                        className="w-full aspect-[4/3] object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className={publication.image ? "md:w-3/4" : "w-full"}>
                    <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                      <Badge variant="outline">
                        {publication.category}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {new Date(publication.date).toLocaleDateString(
                          language === "en" ? undefined : "ar-SA", 
                          { year: 'numeric', month: 'short' }
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">
                      {language === 'en' ? publication.title : publication.titleAr}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4">
                      {language === 'en' ? publication.abstract : publication.abstractAr}
                    </p>
                    
                    <div className="mb-4">
                      <p className="text-sm">
                        <span className="font-semibold">
                          {language === 'en' ? 'Authors: ' : 'المؤلفون: '}
                        </span>
                        {language === 'en' ? publication.authors : publication.authorsAr}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">
                          {language === 'en' ? 'Published in: ' : 'نُشر في: '}
                        </span>
                        {language === 'en' ? publication.publishedIn : publication.publishedInAr}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {publication.link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={publication.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {language === 'en' ? 'View Publication' : 'عرض المنشور'}
                          </a>
                        </Button>
                      )}
                      
                      <Button size="sm" asChild>
                        <a href={`/publications/${publication.id}`}>
                          <FileText className="h-4 w-4 mr-2" />
                          {language === 'en' ? 'Read Details' : 'قراءة التفاصيل'}
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              {language === 'en' 
                ? 'No publications found in this category.' 
                : 'لا توجد منشورات في هذه الفئة.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Publications;
