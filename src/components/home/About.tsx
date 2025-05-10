
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export function About() {
  const { language, t } = useLanguage();

  const skills = [
    "React", "TypeScript", "Node.js", "Next.js",
    "GraphQL", "Tailwind CSS", "UI/UX Design", "MongoDB"
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("aboutMe")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className={`${language === "ar" ? "order-1" : ""}`}>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden border-4 border-background shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1603575449096-da705f622102"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-turquoise-500/20 rounded-full blur-2xl -z-10"></div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h3 className="text-2xl font-medium">
              {language === "en" 
                ? "Hi, I'm John Doe" 
                : "مرحباً، أنا جون دو"
              }
            </h3>
            
            <p className="text-muted-foreground">
              {language === "en"
                ? "I'm a full-stack developer with over 5 years of experience in building modern web applications. I specialize in React, Node.js, and serverless architectures."
                : "أنا مطور full-stack مع أكثر من 5 سنوات من الخبرة في بناء تطبيقات الويب الحديثة. أتخصص في React و Node.js والبنى الـ serverless."
              }
            </p>
            
            <p className="text-muted-foreground">
              {language === "en"
                ? "I'm passionate about creating intuitive user interfaces and scalable backend systems that solve real-world problems."
                : "أنا شغوف بإنشاء واجهات مستخدم بديهية وأنظمة خلفية قابلة للتوسع تحل المشكلات الحقيقية."
              }
            </p>

            <div>
              <h4 className="font-medium mb-3">{t("skills")}</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 rounded-full bg-muted text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <Button asChild>
              <Link to="/about">
                {language === "en" ? "Read More About Me" : "اقرأ المزيد عني"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
