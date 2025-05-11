
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
  created_at?: string;
  updated_at?: string;
}

// للاستخدام المرجعي فقط، البيانات الحقيقية تأتي من Supabase
export const projects: ProjectType[] = [];
