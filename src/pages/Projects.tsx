
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';
import { ProjectType } from '@/types/project';
import { getProjects } from '@/services/supabase-service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Projects = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const pageTitle = language === 'en' ? 'Projects' : 'المشاريع';

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  // Extract unique categories from projects, making sure to check for undefined
  const categories = ["all", ...new Set(projects.map(project => project.category || "uncategorized").filter(Boolean))];

  // Filter projects based on active category, handling missing category property
  const filteredProjects = activeCategory === "all"
    ? projects
    : projects.filter(project => project.category === activeCategory);

  return (
    <Layout pageTitle={pageTitle}>
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{pageTitle}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'en'
              ? 'Explore my recent projects and work spanning various technologies and domains.'
              : 'استكشف مشاريعي الحديثة والأعمال التي تمتد عبر مختلف التقنيات والمجالات.'}
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full mb-12" onValueChange={setActiveCategory}>
          <div className="flex justify-center mb-8">
            <TabsList className="w-fit">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {language === 'en' ? category : category === 'all' ? 'الكل' : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden flex flex-col">
                {project.image && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={language === 'en' ? project.title : project.titleAr}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    {project.category && (
                      <Badge variant="outline" className="mb-2">
                        {project.category}
                      </Badge>
                    )}
                    <h3 className="text-xl font-bold mb-2">
                      {language === 'en' ? project.title : project.titleAr}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3">
                      {language === 'en' ? project.description : project.descriptionAr}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 flex gap-2">
                    {project.link && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {language === 'en' ? 'Visit Project' : 'زيارة المشروع'}
                        </a>
                      </Button>
                    )}
                    <Button size="sm" asChild>
                      <a href={`/projects/${project.id}`}>
                        {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              {language === 'en'
                ? 'No projects found in this category.'
                : 'لا توجد مشاريع في هذه الفئة.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
