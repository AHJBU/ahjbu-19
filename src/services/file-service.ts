
import { supabase } from '@/lib/supabase';
import { File } from '@/types/file';
import { getAllFiles as getMySQLFiles } from './mysql-file-service';
import { execute, query, queryOne } from '@/lib/mysql';

// Get all files
export const getFiles = async (): Promise<File[]> => {
  // Try to get files from MySQL first
  try {
    return await getMySQLFiles();
  } catch (error) {
    console.error("Error fetching from MySQL, falling back to Supabase:", error);
    
    // Fallback to Supabase
    const { data, error: supabaseError } = await supabase
      .from('files')
      .select('*')
      .order('date', { ascending: false });

    if (supabaseError) throw supabaseError;
    return data as File[];
  }
};

// Get a file by ID
export const getFile = async (id: string): Promise<File> => {
  // Try to get from MySQL first (if it's a numeric ID)
  if (!isNaN(Number(id))) {
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
        WHERE f.id = ?
      `;
      
      const file = await queryOne<any>(sql, [id]);
      
      if (file) {
        return {
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
        };
      }
    } catch (error) {
      console.error("MySQL error, falling back to Supabase:", error);
    }
  }
  
  // Fallback to Supabase
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as File;
};

// Create a new file
export const createFile = async (file: Omit<File, 'id'>): Promise<File> => {
  // If fullPath is provided, assume it's from MySQL and create entry there
  if (file.fullPath && file.fullPath.startsWith('files/')) {
    try {
      // Extract file ID from path if possible (for files already in MySQL)
      const pathParts = file.fullPath.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      // Check if file already exists in MySQL
      const existingSql = `SELECT id FROM files WHERE name = ? OR path = ?`;
      const existingFile = await queryOne<{ id: number }>(existingSql, [fileName, file.fullPath]);
      
      let fileId: number;
      
      if (existingFile) {
        // File exists, use its ID
        fileId = existingFile.id;
      } else {
        // File doesn't exist, create it (this shouldn't normally happen as the file should be uploaded first)
        const insertFileSql = `
          INSERT INTO files (name, original_name, mime_type, size, path, url, folder, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 'files', ?)
        `;
        
        const result = await execute(insertFileSql, [
          fileName,
          file.title,
          file.fileType,
          file.size,
          file.fullPath,
          file.downloadUrl,
          new Date(file.date).toISOString()
        ]);
        
        fileId = result.insertId;
      }
      
      // Now add or update the file features
      const featureSql = `
        INSERT INTO file_features (file_id, title, title_ar, description, description_ar, category, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          title_ar = VALUES(title_ar),
          description = VALUES(description),
          description_ar = VALUES(description_ar),
          category = VALUES(category),
          featured = VALUES(featured)
      `;
      
      await execute(featureSql, [
        fileId,
        file.title,
        file.titleAr,
        file.description,
        file.descriptionAr,
        file.category,
        file.featured ? 1 : 0
      ]);
      
      // Return the complete file object
      return {
        ...file,
        id: String(fileId)
      };
    } catch (error) {
      console.error("MySQL error, falling back to Supabase:", error);
    }
  }
  
  // Fallback to Supabase
  const { data, error } = await supabase
    .from('files')
    .insert([file])
    .select()
    .single();

  if (error) throw error;
  return data as File;
};

// Update an existing file
export const updateFile = async (id: string, file: Partial<File>): Promise<File> => {
  // Try MySQL update if it's a numeric ID
  if (!isNaN(Number(id))) {
    try {
      // Update file features
      const featureSql = `
        INSERT INTO file_features (file_id, title, title_ar, description, description_ar, category, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          title_ar = VALUES(title_ar),
          description = VALUES(description),
          description_ar = VALUES(description_ar),
          category = VALUES(category),
          featured = VALUES(featured)
      `;
      
      await execute(featureSql, [
        id,
        file.title,
        file.titleAr,
        file.description,
        file.descriptionAr,
        file.category,
        file.featured ? 1 : 0
      ]);
      
      // Fetch and return the updated file
      return await getFile(id);
    } catch (error) {
      console.error("MySQL error, falling back to Supabase:", error);
    }
  }
  
  // Fallback to Supabase
  const { data, error } = await supabase
    .from('files')
    .update(file)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as File;
};

// Delete a file
export const deleteFile = async (id: string): Promise<void> => {
  // Try MySQL delete if it's a numeric ID
  if (!isNaN(Number(id))) {
    try {
      // Delete file features first (due to foreign key constraint)
      await execute(`DELETE FROM file_features WHERE file_id = ?`, [id]);
      
      // Then delete the file itself
      await execute(`DELETE FROM files WHERE id = ?`, [id]);
      
      return;
    } catch (error) {
      console.error("MySQL error, falling back to Supabase:", error);
    }
  }
  
  // Fallback to Supabase
  const { error } = await supabase
    .from('files')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Get files by category
export const getFilesByCategory = async (category: string): Promise<File[]> => {
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
      JOIN file_features ff ON f.id = ff.file_id
      WHERE ff.category = ?
      ORDER BY f.created_at DESC
    `;
    
    const files = await query<any>(sql, [category]);
    
    return files.map(file => ({
      id: String(file.id),
      title: file.title,
      titleAr: file.titleAr || file.title,
      description: file.description || "",
      descriptionAr: file.descriptionAr || "",
      category: file.category,
      fileType: file.mime_type,
      size: file.size,
      date: new Date(file.created_at).toISOString().split('T')[0],
      downloadUrl: file.url,
      fullPath: file.path,
      featured: file.featured === 1
    }));
  } catch (error) {
    console.error("MySQL error, falling back to Supabase:", error);
    
    // Fallback to Supabase
    const { data, error: supabaseError } = await supabase
      .from('files')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false });

    if (supabaseError) throw supabaseError;
    return data as File[];
  }
};

// Get featured files
export const getFeaturedFiles = async (limit: number = 6): Promise<File[]> => {
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
      JOIN file_features ff ON f.id = ff.file_id
      WHERE ff.featured = 1
      ORDER BY f.created_at DESC
      LIMIT ?
    `;
    
    const files = await query<any>(sql, [limit]);
    
    return files.map(file => ({
      id: String(file.id),
      title: file.title,
      titleAr: file.titleAr || file.title,
      description: file.description || "",
      descriptionAr: file.descriptionAr || "",
      category: file.category,
      fileType: file.mime_type,
      size: file.size,
      date: new Date(file.created_at).toISOString().split('T')[0],
      downloadUrl: file.url,
      fullPath: file.path,
      featured: file.featured === 1
    }));
  } catch (error) {
    console.error("MySQL error, falling back to Supabase:", error);
    
    // Fallback to Supabase
    const { data, error: supabaseError } = await supabase
      .from('files')
      .select('*')
      .eq('featured', true)
      .order('date', { ascending: false })
      .limit(limit);

    if (supabaseError) throw supabaseError;
    return data as File[];
  }
};

// Track file downloads
export const trackFileDownload = async (fileId: string): Promise<void> => {
  try {
    if (!isNaN(Number(fileId))) {
      // Insert download record into MySQL
      const sql = `
        INSERT INTO file_downloads (file_id)
        VALUES (?)
      `;
      
      await execute(sql, [fileId]);
      console.log(`File ${fileId} download tracked in MySQL`);
    } else {
      // Fallback to just logging for Supabase files
      console.log(`File ${fileId} was downloaded`);
    }
  } catch (error) {
    console.error("Error tracking download:", error);
  }
};
