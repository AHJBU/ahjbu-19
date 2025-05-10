
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courses } from "@/data/courses";

const Courses = () => {
  const { language, t } = useLanguage();
  const [category, setCategory] = useState<string | null>(null);
  
  // Filter courses based on selected category
  const filteredCourses = category
    ? courses.filter(course => course.category === category)
    : courses;

  // Extract unique categories from courses
  const categories = [...new Set(courses.map(course => course.category))];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                {language === "en" ? "Courses & Tutorials" : "الدورات والدروس"}
              </h1>
              <p className="text-muted-foreground">
                {language === "en"
                  ? "Expand your skills with my comprehensive courses and tutorials on web development, design, and more."
                  : "طور مهاراتك مع دوراتي التدريبية الشاملة ودروسي حول تطوير الويب والتصميم والمزيد."
                }
              </p>
            </div>

            <Tabs defaultValue="all" className="max-w-4xl mx-auto">
              <div className="mb-8">
                <TabsList className="flex flex-wrap justify-center">
                  <TabsTrigger value="all" onClick={() => setCategory(null)}>
                    {language === "en" ? "All Courses" : "جميع الدورات"}
                  </TabsTrigger>
                  {categories.map(cat => (
                    <TabsTrigger 
                      key={cat} 
                      value={cat}
                      onClick={() => setCategory(cat)}
                    >
                      {language === "en" ? cat : cat === "Web Development" 
                        ? "تطوير الويب" 
                        : cat === "UI/UX Design"
                          ? "تصميم واجهة المستخدم" 
                          : cat === "Mobile Development"
                            ? "تطوير تطبيقات الجوال"
                            : cat
                      }
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <TabsContent value="all" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredCourses.map((course) => (
                    <div 
                      key={course.id}
                      className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={course.image} 
                          alt={language === "en" ? course.title : course.titleAr}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="secondary">
                            {language === "en" ? "Watch Preview" : "مشاهدة معاينة"}
                          </Button>
                        </div>
                        
                        <Badge className="absolute top-3 right-3 bg-primary">
                          {course.level === "Beginner" 
                            ? language === "en" ? "Beginner" : "مبتدئ"
                            : course.level === "Intermediate" 
                              ? language === "en" ? "Intermediate" : "متوسط"
                              : language === "en" ? "Advanced" : "متقدم"
                          }
                        </Badge>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <Badge variant="outline">
                            {language === "en" ? course.category : course.category === "Web Development" 
                              ? "تطوير الويب" 
                              : course.category === "UI/UX Design"
                                ? "تصميم واجهة المستخدم" 
                                : course.category === "Mobile Development"
                                  ? "تطوير تطبيقات الجوال"
                                  : course.category
                            }
                          </Badge>
                          <span className="text-primary font-bold">
                            {course.isFree 
                              ? language === "en" ? "Free" : "مجاني"
                              : course.price
                            }
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">
                          {language === "en" ? course.title : course.titleAr}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {language === "en" ? course.description : course.descriptionAr}
                        </p>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                              <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                              <path d="M12 8v4l3 3" />
                            </svg>
                            <span className="text-muted-foreground">
                              {course.duration} {language === "en" ? "hours" : "ساعات"}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <span className="text-muted-foreground">
                              {course.students}+ {language === "en" ? "students" : "طالب"}
                            </span>
                          </div>
                        </div>
                        
                        <Button className="w-full mt-6">
                          {language === "en" ? "Enroll Now" : "سجل الآن"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">
                      {language === "en" 
                        ? "No courses found in this category." 
                        : "لم يتم العثور على دورات في هذه الفئة."
                      }
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* The content for specific tabs will be shown dynamically based on filtering */}
              {categories.map((cat) => (
                <TabsContent key={cat} value={cat} className="space-y-8">
                  {/* The content here is shown/hidden by the Tabs component */}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
