
import { supabase } from '@/lib/supabase';
import { ProjectType } from '@/data/projects';
import { PostType } from '@/data/posts';

// Project Services
export const getProjects = async (): Promise<ProjectType[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ProjectType[];
};

export const getFeaturedProjects = async (): Promise<ProjectType[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ProjectType[];
};

export const getProject = async (id: string): Promise<ProjectType> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ProjectType;
};

export const createProject = async (project: Omit<ProjectType, 'id'>): Promise<ProjectType> => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();

  if (error) throw error;
  return data as ProjectType;
};

export const updateProject = async (id: string, project: Partial<ProjectType>): Promise<ProjectType> => {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as ProjectType;
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Blog Post Services
export const getPosts = async (): Promise<PostType[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PostType[];
};

export const getRecentPosts = async (limit: number = 3): Promise<PostType[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as PostType[];
};

export const getPost = async (id: string): Promise<PostType> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as PostType;
};

export const createPost = async (post: Omit<PostType, 'id'>): Promise<PostType> => {
  const { data, error } = await supabase
    .from('posts')
    .insert([post])
    .select()
    .single();

  if (error) throw error;
  return data as PostType;
};

export const updatePost = async (id: string, post: Partial<PostType>): Promise<PostType> => {
  const { data, error } = await supabase
    .from('posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as PostType;
};

export const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
