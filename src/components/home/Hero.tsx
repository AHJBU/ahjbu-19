
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useHomePageContent } from "@/services/static-content-service";

export function Hero() {
  const { language } = useLanguage();
  const { homePageContent } = useHomePageContent();

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background to-background/60">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-turquoise-500/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
          {/* Text Content */}
          <div className="md:w-1/2 space-y-6 text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              {language === "en" ? (
                <span className="text-gradient">{homePageContent.heroTitle}</span>
              ) : (
                <span className="text-gradient">{homePageContent.heroTitleAr}</span>
              )}
            </h1>
            
            <p className="text-lg text-muted-foreground animate-fade-in animate-delay-200">
              {language === "en" 
                ? homePageContent.heroSubtitle
                : homePageContent.heroSubtitleAr
              }
            </p>

            <div className="pt-4 animate-fade-in animate-delay-300">
              <Button asChild size="lg" className="gap-2">
                <Link to={homePageContent.heroButtonLink}>
                  {language === "en" ? homePageContent.heroButtonText : homePageContent.heroButtonTextAr}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Profile Circle */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Animated circle with glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse"></div>
              
              {/* Profile image */}
              <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-white/10 animate-fade-in">
                <img 
                  src={homePageContent.heroImage} 
                  alt={language === "en" ? "Profile" : "الصورة الشخصية"} 
                  className="w-full h-full object-cover animate-scale-in"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
