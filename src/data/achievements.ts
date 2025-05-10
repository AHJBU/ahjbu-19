
export interface Achievement {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  date: string;
  category: string;
  image?: string;
  link?: string;
}

export const achievements: Achievement[] = [
  {
    id: "award-best-design",
    title: "Best Design Award",
    titleAr: "جائزة أفضل تصميم",
    description: "Recognized for excellence in UI/UX design at the Annual Web Design Awards.",
    descriptionAr: "تم الاعتراف بالتميز في تصميم واجهة المستخدم في جوائز تصميم الويب السنوية.",
    date: "2023-11-15",
    category: "Award",
    image: "https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad"
  },
  {
    id: "cert-react-advanced",
    title: "React Advanced Certification",
    titleAr: "شهادة متقدمة في React",
    description: "Completed the advanced React and Redux certification program with distinction.",
    descriptionAr: "أكملت برنامج شهادة React و Redux المتقدم بامتياز.",
    date: "2023-08-10",
    category: "Certification",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952"
  },
  {
    id: "project-featured",
    title: "Featured Project on Awwwards",
    titleAr: "مشروع مميز على منصة Awwwards",
    description: "Personal portfolio project was featured on Awwwards, recognized for its creative approach and technical execution.",
    descriptionAr: "تم عرض مشروع المحفظة الشخصية على منصة Awwwards، وتم الاعتراف به لنهجه الإبداعي وتنفيذه التقني.",
    date: "2023-05-22",
    category: "Recognition",
    image: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a",
    link: "https://awwwards.com"
  },
  {
    id: "speaker-conf",
    title: "Conference Speaker",
    titleAr: "متحدث في مؤتمر",
    description: "Invited speaker at ReactConf 2023, presenting on 'Building Accessible and Multilingual Web Applications'.",
    descriptionAr: "متحدث مدعو في مؤتمر React 2023، يقدم عرضًا عن 'بناء تطبيقات ويب سهلة الوصول ومتعددة اللغات'.",
    date: "2023-03-15",
    category: "Speaking",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2"
  },
  {
    id: "publication-article",
    title: "Published in Web Design Magazine",
    titleAr: "منشور في مجلة تصميم الويب",
    description: "Wrote a feature article on modern web animation techniques that was published in the leading industry magazine.",
    descriptionAr: "كتبت مقالًا مميزًا عن تقنيات الرسوم المتحركة الحديثة على الويب تم نشره في مجلة رائدة في الصناعة.",
    date: "2022-12-08",
    category: "Publication",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d"
  },
  {
    id: "open-source",
    title: "Open Source Contribution",
    titleAr: "مساهمة في المصادر المفتوحة",
    description: "Significant contributions to popular open source libraries, including over 50 merged pull requests.",
    descriptionAr: "مساهمات كبيرة في مكتبات المصادر المفتوحة الشهيرة، بما في ذلك أكثر من 50 طلب سحب تم دمجه.",
    date: "2022-10-01",
    category: "Contribution",
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d"
  }
];

// Group achievements by year for easy filtering
export const getAchievementsByYear = (): Record<string, Achievement[]> => {
  const groupedByYear: Record<string, Achievement[]> = {};
  
  achievements.forEach(achievement => {
    const year = new Date(achievement.date).getFullYear().toString();
    
    if (!groupedByYear[year]) {
      groupedByYear[year] = [];
    }
    
    groupedByYear[year].push(achievement);
  });
  
  // Sort years in descending order
  return Object.fromEntries(
    Object.entries(groupedByYear).sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
  );
};

// Get unique categories
export const getAchievementCategories = (): string[] => {
  const categories = new Set<string>();
  
  achievements.forEach(achievement => {
    categories.add(achievement.category);
  });
  
  return Array.from(categories);
};
