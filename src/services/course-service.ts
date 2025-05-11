
import { Course } from '@/types/course';
import { 
  getCourses as getMysqlCourses,
  getCourse as getMysqlCourse,
  createCourse as createMysqlCourse,
  updateCourse as updateMysqlCourse,
  deleteCourse as deleteMysqlCourse,
  getFeaturedCourses as getMysqlFeaturedCourses
} from './mysql-course-service';

// Get all courses
export const getCourses = async (): Promise<Course[]> => {
  return getMysqlCourses();
};

// Get featured courses
export const getFeaturedCourses = async (): Promise<Course[]> => {
  return getMysqlFeaturedCourses();
};

// Get a course by ID
export const getCourse = async (id: string): Promise<Course> => {
  return getMysqlCourse(id);
};

// Create a new course
export const createCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  return createMysqlCourse(course);
};

// Update an existing course
export const updateCourse = async (id: string, course: Partial<Course>): Promise<Course> => {
  return updateMysqlCourse(id, course);
};

// Delete a course
export const deleteCourse = async (id: string): Promise<void> => {
  return deleteMysqlCourse(id);
};

// Get course orders
export const getCourseOrders = async (courseId: string): Promise<number> => {
  // This will be implemented using MySQL in the future
  return 0;
};

// Create a new order
export const createOrder = async (order: any): Promise<any> => {
  // This will be implemented using MySQL in the future
  return {};
};
