import { File as FileType } from '@/types/file';
import { MediaItem } from '@/types/mediaItem';
import { toast } from '@/components/ui/use-toast';

// Base API URL for file operations
const API_BASE_URL = '/api/files';

// Function to get all files
export const getFiles = async (): Promise<FileType[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch files:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch files.',
      variant: 'destructive',
    });
    return [];
  }
};

// Function to get a file by ID
export const getFileById = async (id: string): Promise<FileType | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch file:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch file.',
      variant: 'destructive',
    });
    return null;
  }
};

// Function to upload a file
export const uploadFile = async (file: File): Promise<MediaItem | null> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to upload file:', error);
    toast({
      title: 'Error',
      description: 'Failed to upload file.',
      variant: 'destructive',
    });
    return null;
  }
};

// Function to delete a file
export const deleteFile = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('Failed to delete file:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete file.',
      variant: 'destructive',
    });
    return false;
  }
};
