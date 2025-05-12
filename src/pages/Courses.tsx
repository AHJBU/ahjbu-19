
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { Clock, Users, BookOpen } from 'lucide-react';
import { Course, getCourses } from '@/services/course-service';
import { Link } from 'react-router-dom';

const Courses = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const pageTitle = language === 'en' ? 'Courses & Training' : 'الدورات والتدريب';

  // Fetch courses data
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses
  });

  // Get unique categories for filtering
  const categories = ["all", ...new Set(courses.map(course => course.category).filter(Boolean))];

  // Filter courses based on active category
  const filteredCourses = activeCategory === "all" 
    ? courses.filter(course => course.isPublished)
    : courses.filter(course => course.isPublished && course.category === activeCategory);

  // Get course level badge color
  const getLevelBadgeColor = (level: Course['level']) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Advanced': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
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
              ? 'Explore my online courses designed to help you master new skills and advance your knowledge.'
              : 'استكشف دوراتي عبر الإنترنت المصممة لمساعدتك على إتقان مهارات جديدة وتطوير معرفتك.'}
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full mb-12" onValueChange={setActiveCategory}>
          <div className="flex justify-center mb-8">
            <TabsList className="w-fit">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category === 'all' ? (language === 'en' ? 'All Courses' : 'كل الدورات') : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="flex flex-col h-full overflow-hidden">
                {course.image && (
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={language === 'en' ? course.title : course.titleAr}
                      className="w-full h-48 object-cover"
                    />
                    {course.featured && (
                      <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1">
                        {language === 'en' ? 'Featured' : 'مميز'}
                      </div>
                    )}
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={getLevelBadgeColor(course.level)}>
                      {language === 'en' ? course.level : 
                       course.level === 'Beginner' ? 'مبتدئ' : 
                       course.level === 'Intermediate' ? 'متوسط' : 
                       course.level === 'Advanced' ? 'متقدم' : course.level}
                    </Badge>
                    <div>
                      {course.isFree ? (
                        <Badge variant="secondary">
                          {language === 'en' ? 'Free' : 'مجاني'}
                        </Badge>
                      ) : (
                        <span className="font-bold text-lg">{course.price} {course.currency}</span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">
                    {language === 'en' ? course.title : course.titleAr}
                  </h3>
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <p className="text-muted-foreground line-clamp-3">
                    {language === 'en' ? course.description : course.descriptionAr}
                  </p>
                </CardContent>
                <CardFooter className="flex-col items-stretch pt-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration} {language === 'en' ? 'hours' : 'ساعة'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{course.students} {language === 'en' ? 'students' : 'طالب'}</span>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link to={`/courses/${course.id}`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'View Course' : 'عرض الدورة'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              {language === 'en' 
                ? 'No courses found in this category.' 
                : 'لا توجد دورات في هذه الفئة.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;
