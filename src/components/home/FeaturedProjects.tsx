
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { projects } from "@/data/projects";

export function FeaturedProjects() {
  const { language, t } = useLanguage();
  
  // Filter only featured projects
  const featuredProjects = projects.filter(project => project.featured);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <h2 className="text-3xl font-bold">{t("featuredProjects")}</h2>
          
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/projects" className="flex items-center gap-2">
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div 
              key={project.id} 
              className="group relative bg-card border rounded-xl overflow-hidden transition-all hover:shadow-lg animate-fade-in"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={project.image} 
                  alt={language === "en" ? project.title : project.titleAr}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">
                  {language === "en" ? project.title : project.titleAr}
                </h3>
                
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {language === "en" ? project.description : project.descriptionAr}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-muted rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-1 bg-muted rounded-full text-xs">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <Button asChild size="sm">
                  <Link to={`/projects/${project.id}`}>
                    {t("viewProject")}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
