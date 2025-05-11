
export interface PostType {
  id: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

// للاستخدام المرجعي فقط، البيانات الحقيقية تأتي من Supabase
export const posts: PostType[] = [];
