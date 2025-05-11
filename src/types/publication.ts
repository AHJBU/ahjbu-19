
export interface Publication {
  id: string;
  title: string;
  titleAr: string;
  abstract: string;
  abstractAr: string;
  authors: string;
  authorsAr: string;
  publishedIn: string;
  publishedInAr: string;
  date: string;
  category: string;
  link?: string;
  relatedProjectId?: string; 
  relatedPostId?: string;
  image?: string;
  featured: boolean;
  archived: boolean;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  draft?: boolean;
}
