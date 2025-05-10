
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t, language } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and summary */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold">
              <span className="text-gradient">Portfolio</span>
            </Link>
            <p className="text-muted-foreground">
              {language === "en" 
                ? "A modern portfolio and blog website showcasing my work, thoughts, and experiences."
                : "موقع معرض أعمال ومدونة حديثة لعرض أعمالي وأفكاري وتجاربي."
              }
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">{language === "en" ? "Quick Links" : "روابط سريعة"}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("projects")}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">{language === "en" ? "Contact" : "تواصل معي"}</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">contact@example.com</li>
              <li className="text-muted-foreground">+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>© {year} {language === "en" ? "All Rights Reserved" : "جميع الحقوق محفوظة"}</p>
        </div>
      </div>
    </footer>
  );
}
