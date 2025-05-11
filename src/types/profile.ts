
export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
}

export interface Experience {
  id: string;
  title: string;
  titleAr: string;
  company: string;
  companyAr: string;
  location: string;
  locationAr: string;
  startDate: string;
  endDate: string | null;
  description: string;
  descriptionAr: string;
  current: boolean;
}

export interface Education {
  id: string;
  degree: string;
  degreeAr: string;
  institution: string;
  institutionAr: string;
  location: string;
  locationAr: string;
  startDate: string;
  endDate: string | null;
  description: string;
  descriptionAr: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  nameAr: string;
  level: number; // 1-5 or 1-100
  category: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
}

export interface Profile {
  id: string;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  bio: string;
  bioAr: string;
  email?: string;
  phone?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  locationAr?: string;
  social?: SocialLinks;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  gallery: GalleryItem[];
  created_at?: string;
  updated_at?: string;
}
