
import { Course } from '@/types/course';

// API endpoint for courses
const COURSES_API_ENDPOINT = '/api/courses';

// Get all courses
export const getCourses = async (): Promise<Course[]> => {
  try {
    // For now, return empty array to avoid browser-side mysql issues
    return [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

// Get featured courses
export const getFeaturedCourses = async (): Promise<Course[]> => {
  try {
    // For now, return empty array to avoid browser-side mysql issues
    return [];
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    return [];
  }
};

// Get a course by ID
export const getCourse = async (id: string): Promise<Course> => {
  try {
    // Mock response for now
    return {
      id: id,
      title: "Sample Course",
      titleAr: "نموذج دورة",
      description: "This is a sample course",
      descriptionAr: "هذه دورة نموذجية",
      content: "<p>Sample content</p>",
      contentAr: "<p>محتوى نموذجي</p>",
      image: "/placeholder.svg",
      category: "Web Development",
      level: "Beginner",
      price: 0,
      currency: "USD",
      duration: 10,
      lessons: 5,
      isFree: true,
      showOrders: false,
      featured: false,
      students: 0,
      tags: ["sample"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    throw new Error('Course not found');
  }
};

// Create a new course
export const createCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  try {
    // Mock response
    return {
      ...course,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// Update an existing course
export const updateCourse = async (id: string, course: Partial<Course>): Promise<Course> => {
  try {
    // Mock response
    const existingCourse = await getCourse(id);
    return {
      ...existingCourse,
      ...course,
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error updating course ${id}:`, error);
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (id: string): Promise<void> => {
  try {
    console.log(`Course ${id} would be deleted`);
  } catch (error) {
    console.error(`Error deleting course ${id}:`, error);
    throw error;
  }
};

// Get course orders
export const getCourseOrders = async (courseId: string): Promise<number> => {
  try {
    // Mock response
    return 0;
  } catch (error) {
    console.error(`Error fetching orders for course ${courseId}:`, error);
    return 0;
  }
};

// Create a new order
export const createOrder = async (order: any): Promise<any> => {
  try {
    // Mock response
    return {
      id: crypto.randomUUID(),
      ...order,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
