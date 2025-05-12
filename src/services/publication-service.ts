
import { supabase } from '@/lib/supabase';
import { Publication } from '@/types/publication';

// Get all publications
export const getPublications = async (): Promise<Publication[]> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Publication[];
};

// Get a publication by ID
export const getPublication = async (id: string): Promise<Publication> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Publication;
};

// Create a new publication
export const createPublication = async (publication: Omit<Publication, 'id'>): Promise<Publication> => {
  const { data, error } = await supabase
    .from('publications')
    .insert([publication])
    .select()
    .single();

  if (error) throw error;
  return data as Publication;
};

// Update an existing publication
export const updatePublication = async (id: string, publication: Partial<Publication>): Promise<Publication> => {
  const { data, error } = await supabase
    .from('publications')
    .update(publication)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Publication;
};

// Delete a publication
export const deletePublication = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('publications')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Get featured publications
export const getFeaturedPublications = async (limit: number = 3): Promise<Publication[]> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('featured', true)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Publication[];
};
