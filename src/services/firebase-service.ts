
import { storage } from "@/lib/firebase";
import { ref, listAll, getDownloadURL, uploadBytesResumable, deleteObject, getMetadata } from "firebase/storage";

export interface MediaItem {
  name: string;
  url: string;
  fullPath: string;
  contentType: string;
  size: number;
  timeCreated: string;
}

// Get all media from a specific folder
export const getMediaFromFolder = async (folderPath: string): Promise<MediaItem[]> => {
  try {
    const storageRef = ref(storage, folderPath);
    const result = await listAll(storageRef);
    
    const mediaPromises = result.items.map(async (item) => {
      const url = await getDownloadURL(item);
      const metadata = await getMetadata(item);
      
      return {
        name: item.name,
        url,
        fullPath: item.fullPath,
        contentType: metadata.contentType || "",
        size: metadata.size || 0,
        timeCreated: metadata.timeCreated || "",
      };
    });

    return await Promise.all(mediaPromises);
  } catch (error) {
    console.error("Error getting media from folder:", error);
    throw error;
  }
};

// Upload a file to Firebase Storage
export const uploadFile = async (
  file: File, 
  folderPath: string, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  const timestamp = new Date().getTime();
  const fileName = `${timestamp}-${file.name}`;
  const storageRef = ref(storage, `${folderPath}/${fileName}`);
  
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        // Upload completed successfully
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadUrl);
      }
    );
  });
};

// Delete a file from Firebase Storage
export const deleteFile = async (fullPath: string): Promise<void> => {
  try {
    const fileRef = ref(storage, fullPath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

// Get a specific file by its path
export const getFile = async (fullPath: string): Promise<MediaItem> => {
  try {
    const fileRef = ref(storage, fullPath);
    const url = await getDownloadURL(fileRef);
    const metadata = await getMetadata(fileRef);
    
    return {
      name: fileRef.name,
      url,
      fullPath,
      contentType: metadata.contentType || "",
      size: metadata.size || 0,
      timeCreated: metadata.timeCreated || "",
    };
  } catch (error) {
    console.error("Error getting file:", error);
    throw error;
  }
};
