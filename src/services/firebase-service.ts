
/**
 * DEPRECATED SERVICE - DO NOT USE
 * 
 * This service is kept only for backwards compatibility.
 * All functionality has been migrated to MySQL services.
 * Use file-mysql-service.ts or mysql-file-service.ts instead.
 */

import { storage } from "@/lib/firebase";
import { MediaItem } from "@/types/mediaItem";
import { getMediaFromFolder as getMySQLMedia, uploadFile as uploadMySQLFile } from '@/services/mysql-file-service';

// DEPRECATED: Get all media from a specific folder (Fallback to MySQL)
export const getMediaFromFolder = async (folderPath: string): Promise<MediaItem[]> => {
  console.warn("firebase-service is deprecated. Using MySQL service instead.");
  return getMySQLMedia(folderPath);
};

// DEPRECATED: Upload a file (Fallback to MySQL)
export const uploadFile = async (
  file: File, 
  folderPath: string, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  console.warn("firebase-service is deprecated. Using MySQL service instead.");
  return uploadMySQLFile(file, folderPath, onProgress);
};

// DEPRECATED: Delete a file (Fallback to No-op)
export const deleteFile = async (fullPath: string): Promise<void> => {
  console.warn("firebase-service is deprecated. Using MySQL service instead.");
  return Promise.resolve();
};

// DEPRECATED: Get a specific file by its path (Fallback to empty object)
export const getFile = async (fullPath: string): Promise<MediaItem> => {
  console.warn("firebase-service is deprecated. Using MySQL service instead.");
  return {
    name: '',
    url: '',
    fullPath: '',
    contentType: '',
    size: 0,
    timeCreated: ''
  };
};
