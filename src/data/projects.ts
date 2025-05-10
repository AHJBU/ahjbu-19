
export interface ProjectType {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  featured: boolean;
  technologies: string[];
  year: string;
}

export const projects: ProjectType[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    titleAr: "منصة تجارة إلكترونية",
    description: "A full-featured e-commerce platform built with React, Node.js, and MongoDB. Includes payment processing, admin dashboard, and customer management.",
    descriptionAr: "منصة تجارة إلكترونية متكاملة مبنية باستخدام React و Node.js و MongoDB. تشمل معالجة الدفع ولوحة التحكم للمسؤول وإدارة العملاء.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://project-ecommerce.example.com",
    github: "https://github.com/username/ecommerce",
    featured: true,
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    year: "2023",
  },
  {
    id: "2",
    title: "Task Management App",
    titleAr: "تطبيق إدارة المهام",
    description: "A task management application with drag-and-drop functionality, collaborative features, and real-time updates.",
    descriptionAr: "تطبيق إدارة المهام مع ميزة السحب والإفلات، وميزات التعاون، والتحديثات في الوقت الفعلي.",
    image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91",
    tags: ["React", "Firebase", "Material UI"],
    link: "https://task-manager.example.com",
    github: "https://github.com/username/task-manager",
    featured: true,
    technologies: ["React", "Firebase", "Material UI"],
    year: "2023",
  },
  {
    id: "3",
    title: "AI Image Generator",
    titleAr: "مولد الصور بالذكاء الاصطناعي",
    description: "An AI-powered image generator that creates unique images based on text prompts using the latest ML models.",
    descriptionAr: "مولد صور مدعوم بالذكاء الاصطناعي ينشئ صورًا فريدة بناءً على مطالبات نصية باستخدام أحدث نماذج التعلم الآلي.",
    image: "https://images.unsplash.com/photo-1561736778-92e52a7769ef",
    tags: ["Python", "React", "TensorFlow", "API"],
    link: "https://ai-images.example.com",
    github: "https://github.com/username/ai-image-generator",
    featured: true,
    technologies: ["Python", "React", "TensorFlow", "API"],
    year: "2022",
  },
  {
    id: "4",
    title: "Portfolio Website",
    titleAr: "موقع معرض الأعمال",
    description: "A modern and responsive portfolio website showcasing projects, skills, and experience.",
    descriptionAr: "موقع معرض أعمال حديث ومتجاوب يعرض المشاريع والمهارات والخبرات.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
    tags: ["React", "Tailwind CSS", "Vite"],
    link: "https://portfolio.example.com",
    github: "https://github.com/username/portfolio",
    featured: false,
    technologies: ["React", "Tailwind CSS", "Vite"],
    year: "2022",
  },
  {
    id: "5",
    title: "Weather App",
    titleAr: "تطبيق الطقس",
    description: "A weather application with real-time data, forecasts, and location-based information.",
    descriptionAr: "تطبيق للطقس مع بيانات في الوقت الفعلي، وتوقعات، ومعلومات تستند إلى الموقع.",
    image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda",
    tags: ["React", "OpenWeather API", "CSS"],
    link: "https://weather-app.example.com",
    github: "https://github.com/username/weather-app",
    featured: false,
    technologies: ["React", "OpenWeather API", "CSS"],
    year: "2021",
  },
  {
    id: "6",
    title: "Recipe Finder",
    titleAr: "باحث وصفات الطعام",
    description: "A recipe finding application that helps users discover meals based on available ingredients.",
    descriptionAr: "تطبيق للعثور على وصفات الطعام يساعد المستخدمين على اكتشاف الوجبات بناءً على المكونات المتاحة.",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f",
    tags: ["JavaScript", "API", "CSS"],
    link: "https://recipe-finder.example.com",
    github: "https://github.com/username/recipe-finder",
    featured: false,
    technologies: ["JavaScript", "API", "CSS"],
    year: "2021",
  },
];
