
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Projects = () => {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState<string | null>(null);

  // Extract unique tags from projects
  const uniqueTags = Array.from(
    new Set(projects.flatMap(project => project.tags))
  ).sort();

  // Filter projects based on selected filter
  const filteredProjects = filter
    ? projects.filter(project => project.tags.includes(filter))
    : projects;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                {language === "en" ? "Projects" : "المشاريع"}
              </h1>
              <p className="text-muted-foreground">
                {language === "en" 
                  ? "Explore a collection of my recent work and personal projects." 
                  : "استكشف مجموعة من أعمالي الحديثة ومشاريعي الشخصية."
                }
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              <Button
                variant={filter === null ? "default" : "outline"}
                onClick={() => setFilter(null)}
                size="sm"
              >
                {language === "en" ? "All" : "الكل"}
              </Button>

              {uniqueTags.map((tag) => (
                <Button
                  key={tag}
                  variant={filter === tag ? "default" : "outline"}
                  onClick={() => setFilter(tag)}
                  size="sm"
                >
                  {tag}
                </Button>
              ))}
            </div>

            {/* Projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
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

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {language === "en" 
                    ? "No projects match the selected filter." 
                    : "لا توجد مشاريع تطابق الفلتر المحدد."
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

export default Projects;
