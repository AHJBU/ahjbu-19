
import { createContext, useContext, useState, ReactNode } from "react";

type LanguageType = "en" | "ar";

// Translations object
const translations = {
  // General
  home: { en: "Home", ar: "الرئيسية" },
  about: { en: "About", ar: "عن" },
  blog: { en: "Blog", ar: "المدونة" },
  projects: { en: "Projects", ar: "المشاريع" },
  contact: { en: "Contact", ar: "اتصل بنا" },
  readMore: { en: "Read More", ar: "اقرأ المزيد" },
  viewAll: { en: "View All", ar: "عرض الكل" },
  
  // Featured sections
  featuredProjects: { en: "Featured Projects", ar: "مشاريع مميزة" },
  recentPosts: { en: "Recent Posts", ar: "أحدث المقالات" },
  viewProject: { en: "View Project", ar: "عرض المشروع" },
  aboutMe: { en: "About Me", ar: "عني" },
  skills: { en: "Skills", ar: "المهارات" },
  
  // Form elements
  submit: { en: "Submit", ar: "إرسال" },
  name: { en: "Name", ar: "الاسم" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  message: { en: "Message", ar: "الرسالة" },
  search: { en: "Search", ar: "بحث" },
};

export interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageType>(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem("language") as LanguageType;
    return savedLanguage || "ar"; // Default to Arabic
  });

  // Function to toggle between languages
  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLanguage;
  };

  // Set the direction attribute based on language
  if (language === "ar") {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  } else {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
  }

  // Translation function
  const t = (key: keyof typeof translations) => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
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
