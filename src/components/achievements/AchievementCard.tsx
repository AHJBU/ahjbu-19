
import { Badge } from "@/components/ui/badge";
import { Achievement } from "@/data/achievements";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { language } = useLanguage();
  
  const formattedDate = new Date(achievement.date).toLocaleDateString(
    language === "en" ? "en-US" : "ar-SA",
    { year: "numeric", month: "long", day: "numeric" }
  );
  
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "award":
        return <Award className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case "award":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "certification":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "recognition":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "speaking":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "publication":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "contribution":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      default:
        return "";
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={achievement.image || "https://images.unsplash.com/photo-1496449903678-68ddcb189a24"} 
          alt={language === "en" ? achievement.title : achievement.titleAr}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/30 to-transparent p-4 flex items-start justify-between">
          <Badge className={`${getCategoryColor(achievement.category)}`}>
            <span className="flex items-center gap-1">
              {getCategoryIcon(achievement.category)}
              {achievement.category}
            </span>
          </Badge>
          <Badge variant="outline" className="bg-black/50 text-white border-white/10">
            {formattedDate}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-bold">
          {language === "en" ? achievement.title : achievement.titleAr}
        </h3>
        
        <p className="text-muted-foreground">
          {language === "en" ? achievement.description : achievement.descriptionAr}
        </p>
        
        {achievement.link && (
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <a href={achievement.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              {language === "en" ? "View Details" : "عرض التفاصيل"}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
