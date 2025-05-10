
export interface Course {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  duration: number;
  lessons: number;
  students: number;
  isFree: boolean;
  price?: string;
}

export const courses: Course[] = [
  {
    id: "react-fundamentals",
    title: "React Fundamentals",
    titleAr: "أساسيات React",
    description: "Learn the fundamentals of React, including components, props, state, and hooks.",
    descriptionAr: "تعلم أساسيات React، بما في ذلك المكونات والخصائص والحالة والهوكس.",
    category: "Web Development",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2",
    duration: 8,
    lessons: 24,
    students: 1430,
    isFree: false,
    price: "$49"
  },
  {
    id: "advanced-react-patterns",
    title: "Advanced React Patterns",
    titleAr: "أنماط متقدمة في React",
    description: "Master advanced React patterns, performance optimization, and state management.",
    descriptionAr: "إتقان الأنماط المتقدمة في React وتحسين الأداء وإدارة الحالة.",
    category: "Web Development",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1656188505561-c79526b2a57a",
    duration: 12,
    lessons: 36,
    students: 856,
    isFree: false,
    price: "$79"
  },
  {
    id: "ui-design-principles",
    title: "UI Design Principles",
    titleAr: "مبادئ تصميم واجهة المستخدم",
    description: "Learn the core principles of UI design, including layout, typography, color theory and more.",
    descriptionAr: "تعلم المبادئ الأساسية لتصميم واجهة المستخدم، بما في ذلك التخطيط والطباعة ونظرية الألوان والمزيد.",
    category: "UI/UX Design",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698",
    duration: 6,
    lessons: 18,
    students: 2150,
    isFree: true,
    price: ""
  },
  {
    id: "flutter-mobile-dev",
    title: "Flutter Mobile Development",
    titleAr: "تطوير تطبيقات الجوال باستخدام Flutter",
    description: "Build cross-platform mobile applications with Flutter and Dart programming language.",
    descriptionAr: "بناء تطبيقات الجوال متعددة المنصات باستخدام Flutter ولغة برمجة Dart.",
    category: "Mobile Development",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
    duration: 10,
    lessons: 32,
    students: 945,
    isFree: false,
    price: "$59"
  },
  {
    id: "advanced-ux-research",
    title: "Advanced UX Research Methods",
    titleAr: "طرق بحث UX متقدمة",
    description: "Master advanced user research methods to create user-centered design solutions.",
    descriptionAr: "إتقان طرق بحث المستخدم المتقدمة لإنشاء حلول تصميم تركز على المستخدم.",
    category: "UI/UX Design",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c",
    duration: 8,
    lessons: 24,
    students: 672,
    isFree: false,
    price: "$69"
  },
  {
    id: "typescript-essentials",
    title: "TypeScript Essentials",
    titleAr: "أساسيات TypeScript",
    description: "Learn TypeScript from the ground up and improve your JavaScript development skills.",
    descriptionAr: "تعلم TypeScript من الصفر وتحسين مهارات تطوير JavaScript الخاصة بك.",
    category: "Web Development",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1613490900233-141c5560d75d",
    duration: 7,
    lessons: 22,
    students: 1245,
    isFree: false,
    price: "$39"
  },
];
