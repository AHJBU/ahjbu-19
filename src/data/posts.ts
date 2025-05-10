
export interface PostType {
  id: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  image: string;
  author: string;
  date: string;
  tags: string[];
  featured: boolean;
}

export const posts: PostType[] = [
  {
    id: "1",
    title: "Getting Started with React 18",
    titleAr: "البدء مع React 18",
    excerpt: "Learn how to set up a new React 18 project and explore the new features like Concurrent Mode and Automatic Batching.",
    excerptAr: "تعلم كيفية إعداد مشروع React 18 جديد واستكشاف الميزات الجديدة مثل الوضع المتزامن والدفعات التلقائية.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc.",
    contentAr: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    author: "Jane Smith",
    date: "2025-04-15",
    tags: ["React", "JavaScript", "Web Development"],
    featured: true,
  },
  {
    id: "2",
    title: "Building Responsive UIs with Tailwind CSS",
    titleAr: "بناء واجهات مستخدم متجاوبة باستخدام Tailwind CSS",
    excerpt: "Discover how Tailwind CSS can help you create beautiful responsive designs without writing custom CSS.",
    excerptAr: "اكتشف كيف يمكن لـ Tailwind CSS مساعدتك في إنشاء تصميمات متجاوبة جميلة دون كتابة CSS مخصص.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc.",
    contentAr: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص.",
    image: "https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b",
    author: "John Doe",
    date: "2025-04-10",
    tags: ["CSS", "Tailwind", "Web Design"],
    featured: true,
  },
  {
    id: "3",
    title: "Introduction to TypeScript for React Developers",
    titleAr: "مقدمة في TypeScript لمطوري React",
    excerpt: "Learn the basics of TypeScript and how it can improve your React development workflow with static typing.",
    excerptAr: "تعلم أساسيات TypeScript وكيف يمكنه تحسين سير عمل تطوير React الخاص بك باستخدام الكتابة الثابتة.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc.",
    contentAr: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    author: "Sara Johnson",
    date: "2025-03-28",
    tags: ["TypeScript", "React", "JavaScript"],
    featured: false,
  },
  {
    id: "4",
    title: "Modern Authentication Patterns",
    titleAr: "أنماط المصادقة الحديثة",
    excerpt: "Explore different authentication strategies for web applications including OAuth, JWT, and more.",
    excerptAr: "استكشف استراتيجيات المصادقة المختلفة لتطبيقات الويب بما في ذلك OAuth وJWT والمزيد.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc.",
    contentAr: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص.",
    image: "https://images.unsplash.com/photo-1510511233900-1982d92bd835",
    author: "Tom Wilson",
    date: "2025-03-15",
    tags: ["Authentication", "Security", "Web Development"],
    featured: false,
  },
  {
    id: "5",
    title: "State Management in 2025",
    titleAr: "إدارة الحالة في عام 2025",
    excerpt: "Compare modern state management solutions for React applications including Context API, Redux, and Zustand.",
    excerptAr: "قارن بين حلول إدارة الحالة الحديثة لتطبيقات React بما في ذلك Context API و Redux و Zustand.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc. Sed euismod, nunc ut aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eu nunc.",
    contentAr: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    author: "Alex Chen",
    date: "2025-03-05",
    tags: ["React", "State Management", "Web Development"],
    featured: true,
  },
];
