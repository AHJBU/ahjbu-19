// This service handles static content that can be edited from the dashboard
// without requiring a database connection

import { useState, useEffect } from 'react';

// Define types for various static content sections
export interface SiteSettings {
  siteTitle: string;
  siteTitleAr: string;
  siteDescription: string; 
  siteDescriptionAr: string;
  logo: string;
  contactEmail: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface AboutContent {
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  image: string;
  skills: string[];
}

export interface HomePageContent {
  heroTitle: string;
  heroTitleAr: string;
  heroSubtitle: string;
  heroSubtitleAr: string;
  heroImage: string;
  heroButtonText: string;
  heroButtonTextAr: string;
  heroButtonLink: string;
  profileImage: string;
  profileImageAnimation: boolean;
  textAnimation: boolean;
}

export interface FooterContent {
  copyright: string;
  copyrightAr: string;
  links: Array<{ label: string; labelAr: string; url: string }>;
}

// Local Storage Keys
const KEYS = {
  SITE_SETTINGS: 'site_settings',
  ABOUT_CONTENT: 'about_content',
  HOME_PAGE_CONTENT: 'homepage_content',
  FOOTER_CONTENT: 'footer_content'
};

// Default values
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteTitle: 'Ahmed Jamal',
  siteTitleAr: 'أحمد جمال',
  siteDescription: 'Digital Professional',
  siteDescriptionAr: 'محترف رقمي',
  logo: '/logo.svg',
  contactEmail: 'contact@example.com',
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  }
};

const DEFAULT_ABOUT_CONTENT: AboutContent = {
  title: 'About Me',
  titleAr: 'عني',
  content: '<p>I am a passionate developer with experience in web technologies...</p>',
  contentAr: '<p>أنا مطور متحمس ذو خبرة في تقنيات الويب...</p>',
  image: '/placeholder.svg',
  skills: ['React', 'TypeScript', 'Node.js', 'Firebase', 'Supabase']
};

const DEFAULT_HOME_PAGE_CONTENT: HomePageContent = {
  heroTitle: 'Ahmed Jamal',
  heroTitleAr: 'أحمد جمال',
  heroSubtitle: 'Expert in social media, graphic design, web development, and training',
  heroSubtitleAr: 'خبير في وسائل التواصل الاجتماعي، التصميم الجرافيكي، تطوير الويب، والتدريب',
  heroImage: '/placeholder.svg',
  heroButtonText: 'View My Work',
  heroButtonTextAr: 'عرض أعمالي',
  heroButtonLink: '/projects',
  profileImage: '/lovable-uploads/6942ebb7-5a13-497a-9a04-a83ac399eabf.png',
  profileImageAnimation: true,
  textAnimation: true
};

const DEFAULT_FOOTER_CONTENT: FooterContent = {
  copyright: '© 2023 My Portfolio. All rights reserved.',
  copyrightAr: '© 2023 موقعي الشخصي. جميع الحقوق محفوظة.',
  links: [
    { label: 'Privacy Policy', labelAr: 'سياسة الخصوصية', url: '/privacy' },
    { label: 'Terms of Service', labelAr: 'شروط الخدمة', url: '/terms' },
    { label: 'Contact', labelAr: 'اتصل بنا', url: '/contact' }
  ]
};

// Generic function to get content
function getContent<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Generic function to save content
function saveContent<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch an event to notify components that content has been updated
      window.dispatchEvent(new Event('content-updated'));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }
}

// Hook for site settings
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() => getContent(KEYS.SITE_SETTINGS, DEFAULT_SITE_SETTINGS));
  
  useEffect(() => {
    const handleStorageChange = () => {
      setSettings(getContent<SiteSettings>(KEYS.SITE_SETTINGS, DEFAULT_SITE_SETTINGS));
    };
    
    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    // Listen for custom content-updated event
    window.addEventListener('content-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('content-updated', handleStorageChange);
    };
  }, []);
  
  const updateSettings = (newSettings: SiteSettings) => {
    saveContent(KEYS.SITE_SETTINGS, newSettings);
    setSettings(newSettings);
  };
  
  return { settings, updateSettings };
}

// Hook for about content
export function useAboutContent() {
  const [aboutContent, setAboutContent] = useState<AboutContent>(() => getContent(KEYS.ABOUT_CONTENT, DEFAULT_ABOUT_CONTENT));
  
  useEffect(() => {
    const handleStorageChange = () => {
      setAboutContent(getContent<AboutContent>(KEYS.ABOUT_CONTENT, DEFAULT_ABOUT_CONTENT));
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('content-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('content-updated', handleStorageChange);
    };
  }, []);
  
  const updateAboutContent = (newContent: AboutContent) => {
    saveContent(KEYS.ABOUT_CONTENT, newContent);
    setAboutContent(newContent);
  };
  
  return { aboutContent, updateAboutContent };
}

// Hook for home page content
export function useHomePageContent() {
  const [homePageContent, setHomePageContent] = useState<HomePageContent>(() => getContent(KEYS.HOME_PAGE_CONTENT, DEFAULT_HOME_PAGE_CONTENT));
  
  useEffect(() => {
    const handleStorageChange = () => {
      setHomePageContent(getContent<HomePageContent>(KEYS.HOME_PAGE_CONTENT, DEFAULT_HOME_PAGE_CONTENT));
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('content-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('content-updated', handleStorageChange);
    };
  }, []);
  
  const updateHomePageContent = (newContent: HomePageContent) => {
    saveContent(KEYS.HOME_PAGE_CONTENT, newContent);
    setHomePageContent(newContent);
  };
  
  return { homePageContent, updateHomePageContent };
}

// Hook for footer content
export function useFooterContent() {
  const [footerContent, setFooterContent] = useState<FooterContent>(() => getContent(KEYS.FOOTER_CONTENT, DEFAULT_FOOTER_CONTENT));
  
  useEffect(() => {
    const handleStorageChange = () => {
      setFooterContent(getContent<FooterContent>(KEYS.FOOTER_CONTENT, DEFAULT_FOOTER_CONTENT));
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('content-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('content-updated', handleStorageChange);
    };
  }, []);
  
  const updateFooterContent = (newContent: FooterContent) => {
    saveContent(KEYS.FOOTER_CONTENT, newContent);
    setFooterContent(newContent);
  };
  
  return { footerContent, updateFooterContent };
}
