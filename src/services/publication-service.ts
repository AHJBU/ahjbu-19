
import { supabase } from '@/lib/supabase';
import { Publication } from '@/types/publication';

// الحصول على جميع المنشورات
export const getPublications = async (): Promise<Publication[]> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Publication[];
};

// الحصول على منشور بواسطة المعرف
export const getPublication = async (id: string): Promise<Publication> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Publication;
};

// الحصول على المنشورات المميزة
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

// إنشاء منشور جديد
export const createPublication = async (publication: Omit<Publication, 'id'>): Promise<Publication> => {
  const { data, error } = await supabase
    .from('publications')
    .insert([publication])
    .select()
    .single();

  if (error) throw error;
  return data as Publication;
};

// تحديث منشور موجود
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

// حذف منشور
export const deletePublication = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('publications')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// وضع المنشور في الأرشيف بدلاً من حذفه
export const archivePublication = async (id: string): Promise<Publication> => {
  const { data, error } = await supabase
    .from('publications')
    .update({ archived: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Publication;
};

// استعادة منشور من الأرشيف
export const restorePublication = async (id: string): Promise<Publication> => {
  const { data, error } = await supabase
    .from('publications')
    .update({ archived: false })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Publication;
};

// الحصول على المنشورات المؤرشفة
export const getArchivedPublications = async (): Promise<Publication[]> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('archived', true)
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Publication[];
};

// الحصول على المنشورات حسب الفئة
export const getPublicationsByCategory = async (category: string): Promise<Publication[]> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('category', category)
    .eq('archived', false)
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Publication[];
};
