
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
    const results = await query<any>(sql, params);
    
    // Map database results to MediaItem interface
    return (results || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      original_name: item.original_name,
      mime_type: item.mime_type,
      size: item.size || 0,
      path: item.path,
      url: item.url,
      folder: item.folder,
      created_at: item.created_at,
      updated_at: item.updated_at,
      // Add properties needed by legacy code
      fullPath: item.path || '',
      contentType: item.mime_type || '',
      timeCreated: item.created_at || new Date().toISOString()
    }));
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

/**
 * Upload a file to MySQL storage
 * @param file The file to upload
 * @param folder The folder to upload to
 * @param onProgress Optional progress callback
 * @returns The URL of the uploaded file
 */
export const uploadFile = async (
  file: File,
  folder: string = 'files',
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Simulate upload progress for UI
    if (onProgress) {
      const interval = setInterval(() => {
        onProgress(Math.min(95, Math.floor(Math.random() * 100)));
      }, 300);
      
      // After a brief delay, clear the interval and report 100%
      setTimeout(() => {
        clearInterval(interval);
        onProgress(100);
      }, 2000);
    }
    
    // In a real implementation, this would upload to the server
    console.log(`Simulating upload of ${file.name} to ${folder} folder`);
    
    // Return a mock URL (in production this would come from the server)
    return `/api/files/${folder}/${Date.now()}-${file.name}`;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('File upload failed');
  }
};

/**
 * Delete a file from MySQL storage
 * @param fullPath The path of the file to delete
 */
export const deleteFile = async (fullPath: string): Promise<void> => {
  try {
    console.log(`Would delete file at path: ${fullPath}`);
    // In a real implementation, this would delete the file via API
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('File delete failed');
  }
};

/**
 * Get a file by path from MySQL storage
 * @param fullPath The path of the file to get
 * @returns The media item
 */
export const getFile = async (fullPath: string): Promise<MediaItem> => {
  try {
    console.log(`Would get file at path: ${fullPath}`);
    // In a real implementation, this would get the file via API
    return {
      name: fullPath.split('/').pop() || '',
      url: `/api/files/${fullPath}`,
      fullPath,
      contentType: '',
      size: 0,
      timeCreated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Get file error:', error);
    throw new Error('File get failed');
  }
};
