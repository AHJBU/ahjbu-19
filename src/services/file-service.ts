
import { supabase } from '@/lib/supabase';
import { File } from '@/types/file';

// Get all files
export const getFiles = async (): Promise<File[]> => {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data as File[];
};

// Get a file by ID
export const getFile = async (id: string): Promise<File> => {
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
  const { error } = await supabase
    .from('files')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Get files by category
export const getFilesByCategory = async (category: string): Promise<File[]> => {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('category', category)
    .order('date', { ascending: false });

  if (error) throw error;
  return data as File[];
};

// Get featured files
export const getFeaturedFiles = async (limit: number = 6): Promise<File[]> => {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('featured', true)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as File[];
};

// Track file downloads
export const trackFileDownload = async (fileId: string): Promise<void> => {
  // This function would update a downloads counter
  // In a real implementation, you might track in a separate table
  const { data } = await supabase
    .from('files')
    .select('*')
    .eq('id', fileId)
    .single();
    
  if (!data) return;
  
  // For now we'll just console log the download
  console.log(`File ${fileId} was downloaded`);
};
