
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
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}
