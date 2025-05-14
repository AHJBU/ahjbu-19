
export interface ProjectType {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  link?: string;
  github?: string;
  tags: string[];
  featured: boolean;
  date: string;
  category: string;
}
