
import { supabase } from '@/lib/supabase';

export interface Course {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  content: string;
  contentAr: string;
  image: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  currency: string;
  duration: number;
  students: number;
  isFree: boolean;
  isPublished: boolean;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CourseOrder {
  id: string;
  course_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  payment_id?: string;
  created_at: string;
}

// الحصول على جميع الدورات
export const getCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(course => ({
      ...course,
      level: course.level as "Beginner" | "Intermediate" | "Advanced"
    })) as Course[];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

// الحصول على دورة بواسطة المعرف
export const getCourse = async (id: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      level: data.level as "Beginner" | "Intermediate" | "Advanced"
    } as Course;
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    return null;
  }
};

// الحصول على الدورات المميزة
export const getFeaturedCourses = async (limit: number = 3): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('featured', true)
      .eq('isPublished', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data.map(course => ({
      ...course,
      level: course.level as "Beginner" | "Intermediate" | "Advanced"
    })) as Course[];
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    return [];
  }
};

// الحصول على الدورات حسب الفئة
export const getCoursesByCategory = async (category: string): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('category', category)
      .eq('isPublished', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(course => ({
      ...course,
      level: course.level as "Beginner" | "Intermediate" | "Advanced"
    })) as Course[];
  } catch (error) {
    console.error(`Error fetching courses by category ${category}:`, error);
    return [];
  }
};

// إنشاء دورة جديدة
export const createCourse = async (course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([course])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      level: data.level as "Beginner" | "Intermediate" | "Advanced"
    } as Course;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// تحديث دورة موجودة
export const updateCourse = async (id: string, course: Partial<Course>): Promise<Course> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update(course)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      level: data.level as "Beginner" | "Intermediate" | "Advanced"
    } as Course;
  } catch (error) {
    console.error(`Error updating course ${id}:`, error);
    throw error;
  }
};

// حذف دورة
export const deleteCourse = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting course ${id}:`, error);
    throw error;
  }
};

// أرشفة دورة بدلاً من حذفها
export const archiveCourse = async (id: string): Promise<Course> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update({ isPublished: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      level: data.level as "Beginner" | "Intermediate" | "Advanced"
    } as Course;
  } catch (error) {
    console.error(`Error archiving course ${id}:`, error);
    throw error;
  }
};

// إنشاء طلب للدورة
export const createOrder = async (order: Omit<CourseOrder, 'id' | 'created_at'>): Promise<CourseOrder> => {
  try {
    const { data, error } = await supabase
      .from('course_orders')
      .insert([order])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as CourseOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// الحصول على طلبات الدورة مع التفاصيل
export const getCourseOrdersWithDetails = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('course_orders')
      .select(`
        *,
        courses:course_id (title, titleAr, image),
        profiles:user_id (name, email, avatar)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching course orders with details:', error);
    return [];
  }
};

// تحديث حالة الطلب
export const updateOrderStatus = async (id: string, status: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('course_orders')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error updating order status ${id}:`, error);
    throw error;
  }
};

// حذف طلب
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('course_orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting order ${id}:`, error);
    throw error;
  }
};

// إنشاء جداول الدورات في Supabase
export const createCoursesTables = async (): Promise<void> => {
  try {
    // هذا سيتم تنفيذه عبر واجهة Supabase بدلاً من الكود
    console.log("Courses tables are created through Supabase interface");
  } catch (error) {
    console.error("Error creating courses tables:", error);
    throw error;
  }
};
