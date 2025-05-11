
import { query, execute, queryOne } from "@/lib/mysql";
import { File as FileModel } from "@/types/file";
import { MediaItem } from "@/services/firebase-service";
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the upload directory path relative to the server
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

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
      const filePath = path.join(UPLOAD_DIR, folderPath, uniqueFilename);
      const directoryPath = path.dirname(filePath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }
      
      // In a server environment, we would use fs streams
      // For the client, we'll need to send this file to an API endpoint
      // This is a placeholder for the client-side implementation
      
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
      // and the server would save the file and add the record to MySQL
      
      // For client UI demonstration, we'll simulate the API response
      setTimeout(async () => {
        const publicUrl = `/uploads/${folderPath}/${uniqueFilename}`;
        
        // In a real implementation, this would be done on the server
        // after file upload
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
            `${folderPath}/${uniqueFilename}`,
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
    
    // Delete the file from the filesystem (in a server context)
    // const filePath = path.join(UPLOAD_DIR, file.path);
    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
    // }
    
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
