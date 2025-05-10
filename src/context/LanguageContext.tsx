
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "home": "Home",
    "about": "About",
    "projects": "Projects",
    "blog": "Blog",
    "contact": "Contact",
    "recentPosts": "Recent Posts",
    "featuredProjects": "Featured Projects",
    "readMore": "Read More",
    "viewAll": "View All",
    "viewProject": "View Project",
    "aboutMe": "About Me",
    "skills": "Skills",
    "experience": "Experience",
  },
  ar: {
    "home": "الرئيسية",
    "about": "من أنا",
    "projects": "المشاريع",
    "blog": "المدونة",
    "contact": "تواصل معي",
    "recentPosts": "أحدث المقالات",
    "featuredProjects": "مشاريع مميزة",
    "readMore": "اقرأ المزيد",
    "viewAll": "عرض الكل",
    "viewProject": "عرض المشروع",
    "aboutMe": "نبذة عني",
    "skills": "المهارات",
    "experience": "الخبرات",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Get language from local storage or use browser preference
    const storedLanguage = localStorage.getItem("language") as Language;
    const browserLanguage = navigator.language.startsWith("ar") ? "ar" : "en";
    
    setLanguage(storedLanguage || browserLanguage);
  }, []);

  useEffect(() => {
    // Update document dir and local storage when language changes
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  
  return context;
}
