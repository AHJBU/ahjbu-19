
import { supabase } from '@/lib/supabase';
import { Course } from '@/types/course';

// Get all courses
export const getCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Course[];
};

// Get featured courses
export const getFeaturedCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Course[];
};

// Get a course by ID
export const getCourse = async (id: string): Promise<Course> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Course;
};

// Create a new course
export const createCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  const { data, error } = await supabase
    .from('courses')
    .insert([course])
    .select()
    .single();

  if (error) throw error;
  return data as Course;
};

// Update an existing course
export const updateCourse = async (id: string, course: Partial<Course>): Promise<Course> => {
  const { data, error } = await supabase
    .from('courses')
    .update(course)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Course;
};

// Delete a course
export const deleteCourse = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Get course orders
export const getCourseOrders = async (courseId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('course_orders')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', courseId);

  if (error) throw error;
  return count || 0;
};

// Create a new order
export const createOrder = async (order: any): Promise<any> => {
  const { data, error } = await supabase
    .from('course_orders')
    .insert([order])
    .select()
    .single();

  if (error) throw error;
  return data;
};
