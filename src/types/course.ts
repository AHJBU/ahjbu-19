
export interface Course {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  content: string;
  contentAr: string;
  image: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price?: number;
  currency?: string;
  duration: number;
  lessons: number;
  isFree: boolean;
  showOrders: boolean;
  featured: boolean;
  students?: number;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CourseOrder {
  id: string;
  course_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method?: string;
  payment_id?: string;
  created_at?: string;
}
