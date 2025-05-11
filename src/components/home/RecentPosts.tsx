
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { getRecentPosts } from "@/services/supabase-service";

export function RecentPosts() {
  const { language, t } = useLanguage();
  
  const { data: recentPosts = [], isLoading } = useQuery({
    queryKey: ['recentPosts'],
    queryFn: () => getRecentPosts(3),
  });

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <h2 className="text-3xl font-bold">{t("recentPosts")}</h2>
          
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/blog" className="flex items-center gap-2">
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video w-full bg-muted"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-6 w-full bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-40 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {language === "en" ? "No posts available" : "لا توجد منشورات متاحة"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Link 
                key={post.id}
                to={`/blog/${post.id}`} 
                className="group bg-card border rounded-xl overflow-hidden transition-all hover:shadow-lg animate-fade-in"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={language === "en" ? post.title : post.titleAr}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString(language === "en" ? "en-US" : "ar-SA")}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {language === "en" ? post.title : post.titleAr}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {language === "en" ? post.excerpt : post.excerptAr}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-primary">
                    <span>{t("readMore")}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
