
export interface File {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  fileType: string;
  size: number;
  date: string;
  downloadUrl: string;
  fullPath: string;
  featured?: boolean;
}
