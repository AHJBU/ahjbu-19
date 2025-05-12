
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';
import { Achievement } from '@/types/achievement';
import { useQuery } from '@tanstack/react-query';
import { getAchievements } from '@/services/achievement-service';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Award, Calendar } from 'lucide-react';

const Achievements = () => {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const pageTitle = language === 'en' ? 'Achievements & Awards' : 'الإنجازات والجوائز';

  // Fetch achievements data
  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: getAchievements
  });

  // Get unique categories for filtering
  const categories = ["all", ...new Set(achievements.map(item => item.category))];
  
  // Get unique years for timeline
  const years = [...new Set(achievements.map(item => new Date(item.date).getFullYear()))]
    .sort((a, b) => b - a);

  // Filter achievements based on active filter
  const filteredAchievements = activeFilter === "all" 
    ? achievements 
    : achievements.filter(item => item.category === activeFilter);

  // Group achievements by year for timeline view
  const achievementsByYear = years.reduce((acc, year) => {
    acc[year] = filteredAchievements.filter(
      item => new Date(item.date).getFullYear() === year
    );
    return acc;
  }, {} as Record<number, Achievement[]>);

  // Badge color based on category
  const getBadgeColor = (category: string) => {
    switch(category) {
      case 'Award': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Certification': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Recognition': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'Publication': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Speaking': return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'Education': return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <Layout pageTitle={pageTitle}>
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{pageTitle}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'en'
              ? 'A timeline of professional achievements, awards, and milestones throughout my career.'
              : 'جدول زمني للإنجازات المهنية والجوائز والمعالم البارزة خلال مسيرتي المهنية.'}
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full mb-12" onValueChange={setActiveFilter}>
          <div className="flex justify-center mb-8">
            <TabsList className="w-fit">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {language === 'en' 
                    ? category === 'all' ? 'All' : category 
                    : category === 'all' ? 'الكل' : 
                      category === 'Award' ? 'جائزة' :
                      category === 'Certification' ? 'شهادة' :
                      category === 'Recognition' ? 'تقدير' :
                      category === 'Publication' ? 'منشور' :
                      category === 'Speaking' ? 'تحدث' :
                      category === 'Education' ? 'تعليم' :
                      category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredAchievements.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-muted"></div>
            
            {/* Timeline items */}
            <div className="space-y-16">
              {Object.entries(achievementsByYear).map(([year, yearAchievements]) => (
                yearAchievements.length > 0 && (
                  <div key={year} className="relative">
                    {/* Year marker */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -mt-12">
                      <div className="bg-background border border-border rounded-full px-6 py-2 text-2xl font-bold inline-block">
                        {year}
                      </div>
                    </div>
                    
                    {/* Year achievements */}
                    <div className="space-y-8 mt-6 pt-8">
                      {yearAchievements.map((achievement, index) => (
                        <div key={achievement.id} className={`flex items-start relative ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                          {/* Achievement dot */}
                          <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-primary"></div>
                          
                          {/* Achievement card */}
                          <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                            <Card className={`${index % 2 === 0 ? '' : 'items-end'} h-full`}>
                              <CardHeader className="p-5 pb-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <Badge variant="outline" className={getBadgeColor(achievement.category)}>
                                      {language === 'en' ? achievement.category : 
                                        achievement.category === 'Award' ? 'جائزة' :
                                        achievement.category === 'Certification' ? 'شهادة' :
                                        achievement.category === 'Recognition' ? 'تقدير' :
                                        achievement.category === 'Publication' ? 'منشور' :
                                        achievement.category === 'Speaking' ? 'تحدث' :
                                        achievement.category === 'Education' ? 'تعليم' :
                                        achievement.category}
                                    </Badge>
                                    {achievement.featured && (
                                      <Badge variant="secondary" className="ml-2">
                                        <Award className="h-3 w-3 mr-1" />
                                        {language === 'en' ? 'Featured' : 'مميز'}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    {new Date(achievement.date).toLocaleDateString(
                                      language === "en" ? undefined : "ar-SA", 
                                      { year: 'numeric', month: 'short', day: 'numeric' }
                                    )}
                                  </div>
                                </div>
                                <h3 className="text-xl font-bold mt-2">
                                  {language === 'en' ? achievement.title : achievement.titleAr}
                                </h3>
                              </CardHeader>
                              <CardContent className="p-5 pt-0">
                                <p className="text-muted-foreground">
                                  {language === 'en' ? achievement.description : achievement.descriptionAr}
                                </p>
                                
                                {achievement.image && (
                                  <div className="mt-4">
                                    <img 
                                      src={achievement.image} 
                                      alt={language === 'en' ? achievement.title : achievement.titleAr} 
                                      className="rounded-md max-h-40 object-contain"
                                    />
                                  </div>
                                )}
                                
                                {achievement.link && (
                                  <a 
                                    href={achievement.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center mt-4 text-sm text-primary hover:underline"
                                  >
                                    {language === 'en' ? 'Learn more' : 'اقرأ المزيد'}
                                    <ExternalLink className="h-3.5 w-3.5 ml-1" />
                                  </a>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                          {/* Empty space for the opposite side */}
                          <div className="w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              {language === 'en' 
                ? 'No achievements found in this category.' 
                : 'لا توجد إنجازات في هذه الفئة.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Achievements;
