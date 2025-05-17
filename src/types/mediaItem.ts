
export interface MediaItem {
  id?: number;
  name: string;
  original_name?: string;
  mime_type?: string;
  size: number;
  path?: string;
  url: string;
  folder?: string;
  created_at?: string;
  updated_at?: string;
  // Adding the properties needed by old firebase-service references
  fullPath: string;
  contentType: string;
  timeCreated: string;
}
