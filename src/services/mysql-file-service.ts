
import { query } from '@/lib/mysql';
import { MediaItem } from '@/types/mediaItem';

/**
 * Get media items from a specific folder
 * @param folder The folder to get media items from
 * @returns Array of media items
 */
export const getMediaFromFolder = async (folder?: string): Promise<MediaItem[]> => {
  let sql = 'SELECT * FROM media ORDER BY created_at DESC';
  let params: any[] = [];
  
  if (folder && folder !== 'all') {
    sql = 'SELECT * FROM media WHERE folder = ? ORDER BY created_at DESC';
    params = [folder];
  }
  
  try {
    const results = await query<MediaItem>(sql, params);
    return results || [];
  } catch (error) {
    console.error('Error fetching media from folder:', error);
    return [];
  }
};

/**
 * Get all files from MySQL
 * @returns Array of all files
 */
export const getAllFiles = async () => {
  try {
    const sql = `
      SELECT f.*, 
             COALESCE(ff.title, f.original_name) as title,
             ff.title_ar as titleAr,
             ff.description,
             ff.description_ar as descriptionAr,
             ff.category,
             ff.featured
      FROM files f
      LEFT JOIN file_features ff ON f.id = ff.file_id
      ORDER BY f.created_at DESC
    `;
    
    const files = await query<any>(sql, []);
    
    return files.map(file => ({
      id: String(file.id),
      title: file.title,
      titleAr: file.titleAr || file.title,
      description: file.description || "",
      descriptionAr: file.descriptionAr || "",
      category: file.category || "Document",
      fileType: file.mime_type,
      size: file.size,
      date: new Date(file.created_at).toISOString().split('T')[0],
      downloadUrl: file.url,
      fullPath: file.path,
      featured: file.featured === 1
    }));
  } catch (error) {
    console.error("MySQL error:", error);
    return [];
  }
};
