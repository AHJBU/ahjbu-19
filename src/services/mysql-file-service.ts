
import { query, execute, queryOne } from "@/lib/mysql";
import { File as FileModel } from "@/types/file";
import { MediaItem } from "@/services/firebase-service";
import { v4 as uuidv4 } from 'uuid';

// Client-side version of the file service - no direct file system access
// All operations are performed via APIs

// Define upload directory path (used for URL construction)
const UPLOAD_DIR = '/uploads';

// Interface for files stored in MySQL
export interface MySQLFile {
  id: number;
  name: string;
  original_name: string;
  mime_type: string;
  size: number;
  path: string;
  url: string;
  created_at: string;
  folder: string;
}

// Get all media files from a specific folder
export const getMediaFromFolder = async (folderPath: string): Promise<MediaItem[]> => {
  try {
    const sql = `
      SELECT * FROM files 
      WHERE folder = ?
      ORDER BY created_at DESC
    `;
    
    const files = await query<MySQLFile>(sql, [folderPath]);
    
    return files.map(file => ({
      name: file.original_name,
      url: file.url,
      fullPath: file.path,
      contentType: file.mime_type,
      size: file.size,
      timeCreated: file.created_at
    }));
  } catch (error) {
    console.error("Error getting media from folder:", error);
    throw error;
  }
};

// Upload a file to the server and store metadata in MySQL
export const uploadFile = async (
  file: File,
  folderPath: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Generate a unique filename
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop() || '';
      const uniqueFilename = `${timestamp}-${uuidv4()}.${fileExtension}`;
      const filePath = `${folderPath}/${uniqueFilename}`;
      
      // In a browser environment, we would use FormData to upload to an API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', filePath);
      
      // Simulate progress for the client
      if (onProgress) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          onProgress(Math.min(progress, 99));
          if (progress >= 100) clearInterval(interval);
        }, 100);
      }
      
      // In a real implementation, we would upload to a server API
      // For client UI demonstration, we'll simulate the API response
      setTimeout(async () => {
        const publicUrl = `${UPLOAD_DIR}/${filePath}`;
        
        try {
          const sql = `
            INSERT INTO files (name, original_name, mime_type, size, path, url, folder, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
          `;
          
          await execute(sql, [
            uniqueFilename,
            file.name,
            file.type,
            file.size,
            filePath,
            publicUrl,
            folderPath
          ]);
          
          if (onProgress) onProgress(100);
          resolve(publicUrl);
        } catch (error) {
          reject(error);
        }
      }, 1000);
      
    } catch (error) {
      console.error("Upload error:", error);
      reject(error);
    }
  });
};

// Delete a file from the server and remove its record from MySQL
export const deleteFile = async (fullPath: string): Promise<void> => {
  try {
    // Get the file record from MySQL
    const sql = `SELECT * FROM files WHERE path = ?`;
    const file = await queryOne<MySQLFile>(sql, [fullPath]);
    
    if (!file) {
      throw new Error('File not found');
    }
    
    // In a browser environment, we would call an API to delete the file
    // Delete the record from MySQL
    const deleteSql = `DELETE FROM files WHERE id = ?`;
    await execute(deleteSql, [file.id]);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

// Get a specific file by its path
export const getFile = async (fullPath: string): Promise<MediaItem> => {
  try {
    const sql = `SELECT * FROM files WHERE path = ?`;
    const file = await queryOne<MySQLFile>(sql, [fullPath]);
    
    if (!file) {
      throw new Error('File not found');
    }
    
    return {
      name: file.original_name,
      url: file.url,
      fullPath: file.path,
      contentType: file.mime_type,
      size: file.size,
      timeCreated: file.created_at
    };
  } catch (error) {
    console.error("Error getting file:", error);
    throw error;
  }
};

// Get all files from the database
export const getAllFiles = async (): Promise<FileModel[]> => {
  const sql = `
    SELECT f.*, ff.featured 
    FROM files f
    LEFT JOIN file_features ff ON f.id = ff.file_id
    ORDER BY f.created_at DESC
  `;
  
  const mysqlFiles = await query<MySQLFile & { featured: number }>(sql);
  
  return mysqlFiles.map(file => ({
    id: String(file.id),
    title: file.original_name,
    titleAr: file.original_name, // Default to original name if no Arabic title
    description: "",
    descriptionAr: "",
    category: "Document",
    fileType: file.mime_type,
    size: file.size,
    date: file.created_at,
    downloadUrl: file.url,
    fullPath: file.path,
    featured: file.featured === 1
  }));
};

// Update file metadata
export const updateFileMetadata = async (
  fileId: string,
  metadata: {
    title?: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    category?: string;
    featured?: boolean;
  }
): Promise<void> => {
  try {
    // First, check if file_features record exists
    const checkSql = `
      SELECT * FROM file_features 
      WHERE file_id = ?
    `;
    
    const existingFeature = await queryOne(checkSql, [fileId]);
    
    if (existingFeature) {
      // Update existing record
      const updates: string[] = [];
      const values: any[] = [];
      
      if (metadata.title !== undefined) {
        updates.push('title = ?');
        values.push(metadata.title);
      }
      
      if (metadata.titleAr !== undefined) {
        updates.push('title_ar = ?');
        values.push(metadata.titleAr);
      }
      
      if (metadata.description !== undefined) {
        updates.push('description = ?');
        values.push(metadata.description);
      }
      
      if (metadata.descriptionAr !== undefined) {
        updates.push('description_ar = ?');
        values.push(metadata.descriptionAr);
      }
      
      if (metadata.category !== undefined) {
        updates.push('category = ?');
        values.push(metadata.category);
      }
      
      if (metadata.featured !== undefined) {
        updates.push('featured = ?');
        values.push(metadata.featured ? 1 : 0);
      }
      
      if (updates.length > 0) {
        const updateSql = `
          UPDATE file_features 
          SET ${updates.join(', ')}
          WHERE file_id = ?
        `;
        
        values.push(fileId);
        await execute(updateSql, values);
      }
    } else {
      // Insert new record
      const insertSql = `
        INSERT INTO file_features (
          file_id, title, title_ar, description, description_ar, category, featured
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      await execute(insertSql, [
        fileId,
        metadata.title || null,
        metadata.titleAr || null,
        metadata.description || null,
        metadata.descriptionAr || null,
        metadata.category || 'Document',
        metadata.featured ? 1 : 0
      ]);
    }
  } catch (error) {
    console.error(`Error updating file metadata for file ${fileId}:`, error);
    throw error;
  }
};

// Track file download
export const trackFileDownload = async (
  fileId: string,
  userData?: { 
    ipAddress?: string;
    userAgent?: string;
  }
): Promise<void> => {
  try {
    const sql = `
      INSERT INTO file_downloads (
        file_id, download_date, ip_address, user_agent
      )
      VALUES (?, NOW(), ?, ?)
    `;
    
    await execute(sql, [
      fileId,
      userData?.ipAddress || null,
      userData?.userAgent || null
    ]);
  } catch (error) {
    console.error(`Error tracking download for file ${fileId}:`, error);
    // Don't throw error to avoid disrupting download flow
  }
};

// Get download statistics for a file
export const getFileDownloadStats = async (fileId: string): Promise<{ total: number, recent: number }> => {
  try {
    // Total downloads
    const totalSql = `
      SELECT COUNT(*) as count 
      FROM file_downloads 
      WHERE file_id = ?
    `;
    
    const totalResult = await queryOne<{count: number}>(totalSql, [fileId]);
    
    // Recent downloads (last 30 days)
    const recentSql = `
      SELECT COUNT(*) as count 
      FROM file_downloads 
      WHERE file_id = ? AND download_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `;
    
    const recentResult = await queryOne<{count: number}>(recentSql, [fileId]);
    
    return {
      total: totalResult?.count || 0,
      recent: recentResult?.count || 0
    };
  } catch (error) {
    console.error(`Error getting download stats for file ${fileId}:`, error);
    return { total: 0, recent: 0 };
  }
};

// Create the necessary MySQL tables
export const createRequiredTables = async (): Promise<void> => {
  try {
    // Files table
    await execute(`
      CREATE TABLE IF NOT EXISTS files (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size BIGINT NOT NULL,
        path VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        folder VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_path (path)
      )
    `);
    
    // File features table (for additional metadata like featured status)
    await execute(`
      CREATE TABLE IF NOT EXISTS file_features (
        id INT PRIMARY KEY AUTO_INCREMENT,
        file_id INT NOT NULL,
        title VARCHAR(255),
        title_ar VARCHAR(255),
        description TEXT,
        description_ar TEXT,
        category VARCHAR(100) DEFAULT 'Document',
        featured BOOLEAN DEFAULT 0,
        FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
      )
    `);
    
    // File downloads tracking
    await execute(`
      CREATE TABLE IF NOT EXISTS file_downloads (
        id INT PRIMARY KEY AUTO_INCREMENT,
        file_id INT NOT NULL,
        download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
      )
    `);
    
    console.log("MySQL tables for files have been created or already exist.");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
};
