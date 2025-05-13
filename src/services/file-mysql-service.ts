
import { File as FileType } from '@/types/file';
import { toast } from '@/components/ui/use-toast';

export interface MediaItem {
  id: number;
  name: string;
  original_name: string;
  mime_type: string;
  size: number;
  path: string;
  url: string;
  folder: string;
  created_at: string;
  updated_at?: string;
}

// Base API URL for file operations
const API_URL = '/api';

// Get all media from a specific folder
export const getMediaFromFolder = async (folderPath: string): Promise<MediaItem[]> => {
  try {
    const response = await fetch(`${API_URL}/media?folder=${folderPath}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting media from folder:", error);
    throw error;
  }
};

// Upload a file to the server
export const uploadFile = async (
  file: File, 
  folderPath: string, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Set up the upload with progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', `${API_URL}/upload/${folderPath}`);
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.url);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => {
        reject(new Error('Network error occurred during upload'));
      };
      
      xhr.send(formData);
    });
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

// Delete a file from the server
export const deleteFile = async (fullPath: string): Promise<void> => {
  try {
    // Extract file ID from path if possible
    let fileId: string | null = null;
    
    // If the path contains an ID that we can extract
    const idMatch = fullPath.match(/\/(\d+)[\/\-_.]/);
    if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    }
    
    if (!fileId) {
      // If we couldn't extract an ID, use the path as a query parameter
      const response = await fetch(`${API_URL}/media?path=${encodeURIComponent(fullPath)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } else {
      // If we have an ID, use it directly
      const response = await fetch(`${API_URL}/media/${fileId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

// Get a specific file by its path
export const getFile = async (fullPath: string): Promise<MediaItem> => {
  try {
    const response = await fetch(`${API_URL}/media?path=${encodeURIComponent(fullPath)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    
    throw new Error('File not found');
  } catch (error) {
    console.error("Error getting file:", error);
    throw error;
  }
};

// Convert a MySQL MediaItem to a File type
export const convertMediaItemToFile = (item: MediaItem): FileType => {
  return {
    id: String(item.id),
    title: item.original_name,
    titleAr: item.original_name, // Default if no Arabic title
    description: "",
    descriptionAr: "",
    category: "Document",
    fileType: item.mime_type,
    size: item.size,
    date: new Date(item.created_at).toISOString().split('T')[0],
    downloadUrl: item.url,
    fullPath: item.path
  };
};

// Create, update, delete, and get files with metadata
export const getAllFiles = getMediaFromFolder;
