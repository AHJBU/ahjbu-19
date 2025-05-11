
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL, listAll, getMetadata, deleteObject } from "firebase/storage";
import { File } from "@/types/file";

// Upload a file to Firebase Storage
export const uploadFile = async (
  file: Blob, 
  folderPath: string, 
  fileName: string,
  metadata?: any,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const timestamp = new Date().getTime();
  const fullFileName = `${timestamp}-${fileName}`;
  const storageRef = ref(storage, `${folderPath}/${fullFileName}`);
  
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  
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
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadUrl);
      }
    );
  });
};

// Get all files from a folder
export const getFilesFromFolder = async (folderPath: string): Promise<File[]> => {
  try {
    const storageRef = ref(storage, folderPath);
    const result = await listAll(storageRef);
    
    const filesPromises = result.items.map(async (item) => {
      const url = await getDownloadURL(item);
      const metadata = await getMetadata(item);
      
      // Parse the file name to extract any metadata we stored in it
      const nameParts = item.name.split('-');
      const timestamp = nameParts[0];
      const originalName = nameParts.slice(1).join('-');
      
      return {
        id: item.name,
        title: originalName,
        titleAr: originalName, // You can update this if you store Arabic titles
        description: metadata.customMetadata?.description || "",
        descriptionAr: metadata.customMetadata?.descriptionAr || "",
        category: metadata.customMetadata?.category || "Uncategorized",
        fileType: metadata.contentType?.split('/')[1] || "file",
        size: metadata.size,
        date: metadata.timeCreated,
        downloadUrl: url,
        fullPath: item.fullPath,
        featured: metadata.customMetadata?.featured === 'true'
      };
    });

    return await Promise.all(filesPromises);
  } catch (error) {
    console.error("Error getting files from folder:", error);
    throw error;
  }
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

// Update file metadata
export const updateFileMetadata = async (fullPath: string, metadata: any): Promise<void> => {
  try {
    // Unfortunately, Firebase Storage doesn't allow updating metadata directly
    // We would need to re-upload the file or create a Firestore document to store additional metadata
    console.warn("Firebase Storage doesn't support updating metadata. Consider using Firestore for metadata.");
  } catch (error) {
    console.error("Error updating file metadata:", error);
    throw error;
  }
};
