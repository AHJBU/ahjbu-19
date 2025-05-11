
import { supabase } from '@/lib/supabase';
import { Achievement } from '@/types/achievement';

// Get all achievements
export const getAchievements = async (): Promise<Achievement[]> => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Achievement[];
};

// Get an achievement by ID
export const getAchievement = async (id: string): Promise<Achievement> => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Achievement;
};

// Create a new achievement
export const createAchievement = async (achievement: Omit<Achievement, 'id'>): Promise<Achievement> => {
  const { data, error } = await supabase
    .from('achievements')
    .insert([achievement])
    .select()
    .single();

  if (error) throw error;
  return data as Achievement;
};

// Update an existing achievement
export const updateAchievement = async (id: string, achievement: Partial<Achievement>): Promise<Achievement> => {
  const { data, error } = await supabase
    .from('achievements')
    .update(achievement)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Achievement;
};

// Delete an achievement
export const deleteAchievement = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('achievements')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Get featured achievements
export const getFeaturedAchievements = async (limit: number = 3): Promise<Achievement[]> => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('featured', true)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Achievement[];
};
