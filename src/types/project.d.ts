
export interface ProjectType {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  link?: string;
  tags: string[];
  featured: boolean;
  date: string;
  category: string;  // Adding the category property that was missing
}
