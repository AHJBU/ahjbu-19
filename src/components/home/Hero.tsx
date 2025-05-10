
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const { language } = useLanguage();

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-turquoise-500/20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold animate-fade-in">
            {language === "en" ? (
              <>
                <span className="text-gradient">Creative Developer</span> & Digital Storyteller
              </>
            ) : (
              <>
                <span className="text-gradient">مطور مبدع</span> وراوي قصص رقمي
              </>
            )}
          </h1>
          
          <p className="text-xl text-muted-foreground animate-fade-in animate-delay-200">
            {language === "en" 
              ? "Crafting elegant digital experiences with creative code and thoughtful design."
              : "صناعة تجارب رقمية أنيقة بأكواد إبداعية وتصميم مدروس."
            }
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in animate-delay-300">
            <Button asChild size="lg" className="gap-2">
              <Link to="/projects">
                {language === "en" ? "View Projects" : "عرض المشاريع"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                {language === "en" ? "Get in Touch" : "تواصل معي"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
