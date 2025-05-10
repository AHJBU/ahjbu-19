
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { 
  achievements, 
  getAchievementsByYear, 
  getAchievementCategories 
} from "@/data/achievements";
import { Award, Calendar, Filter } from "lucide-react";

const Achievements = () => {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<string | null>(null);
  
  const achievementsByYear = getAchievementsByYear();
  const categories = getAchievementCategories();
  
  // Filter achievements based on selected category and year
  const filteredAchievements = achievements.filter(achievement => {
    if (activeFilter && achievement.category !== activeFilter) {
      return false;
    }
    
    if (activeYear && new Date(achievement.date).getFullYear().toString() !== activeYear) {
      return false;
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
                <Award className="h-8 w-8 text-primary" />
                {language === "en" ? "Achievements & Awards" : "الإنجازات والجوائز"}
              </h1>
              <p className="text-muted-foreground">
                {language === "en"
                  ? "A collection of professional achievements, certifications, awards, and recognition throughout my career."
                  : "مجموعة من الإنجازات المهنية والشهادات والجوائز والتقديرات على مدار مسيرتي المهنية."
                }
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
              {/* Category filter */}
              <div className="space-y-2 w-full md:w-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Filter className="h-4 w-4" />
                  {language === "en" ? "Filter by category:" : "تصفية حسب الفئة:"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={activeFilter === null ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => setActiveFilter(null)}
                  >
                    {language === "en" ? "All" : "الكل"}
                  </Button>
                  
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={activeFilter === category ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Year filter */}
              <div className="space-y-2 w-full md:w-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  {language === "en" ? "Filter by year:" : "تصفية حسب السنة:"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={activeYear === null ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => setActiveYear(null)}
                  >
                    {language === "en" ? "All Years" : "كل السنوات"}
                  </Button>
                  
                  {Object.keys(achievementsByYear).map((year) => (
                    <Button
                      key={year}
                      variant={activeYear === year ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setActiveYear(year)}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {filteredAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAchievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  {language === "en" 
                    ? "No achievements match your filter criteria." 
                    : "لا توجد إنجازات تطابق معايير التصفية."
                  }
                </p>
              </div>
            )}

            {/* Timeline view */}
            <div className="mt-24">
              <h2 className="text-2xl font-bold text-center mb-12">
                {language === "en" ? "Achievement Timeline" : "الجدول الزمني للإنجازات"}
              </h2>
              
              <div className="space-y-16">
                {Object.entries(achievementsByYear).map(([year, yearAchievements]) => (
                  <div key={year} className="relative">
                    <div className="sticky top-20 bg-background z-10 py-4 mb-8 border-b">
                      <h3 className="text-xl font-bold">{year}</h3>
                    </div>
                    
                    <div className="space-y-8">
                      {yearAchievements.map((achievement) => (
                        <div 
                          key={achievement.id} 
                          className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="mb-4">
                            <Badge className={`mb-2 ${
                              achievement.category === "Award" ? "bg-yellow-500/10 text-yellow-500" :
                              achievement.category === "Certification" ? "bg-blue-500/10 text-blue-500" :
                              achievement.category === "Recognition" ? "bg-purple-500/10 text-purple-500" :
                              achievement.category === "Speaking" ? "bg-green-500/10 text-green-500" :
                              achievement.category === "Publication" ? "bg-red-500/10 text-red-500" :
                              "bg-cyan-500/10 text-cyan-500"
                            }`}>
                              {achievement.category}
                            </Badge>
                            <h4 className="text-lg font-semibold">
                              {language === "en" ? achievement.title : achievement.titleAr}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(achievement.date).toLocaleDateString(
                                language === "en" ? "en-US" : "ar-SA",
                                { year: "numeric", month: "long", day: "numeric" }
                              )}
                            </p>
                          </div>
                          
                          <p className="text-muted-foreground">
                            {language === "en" ? achievement.description : achievement.descriptionAr}
                          </p>
                          
                          {achievement.link && (
                            <Button variant="link" size="sm" className="mt-2 p-0" asChild>
                              <a href={achievement.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                {language === "en" ? "View Details" : "عرض التفاصيل"}
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Achievements;
