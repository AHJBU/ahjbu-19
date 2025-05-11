
import { query, queryOne, execute } from '@/lib/mysql';
import { Course, CourseOrder } from '@/types/course';

// Define the database model
export interface CourseDbModel {
  id: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  content: string;
  content_ar: string;
  image: string;
  category: string;
  level: string;
  price: number;
  currency: string;
  duration: number;
  lessons: number;
  is_free: boolean;
  show_orders: boolean;
  featured: boolean;
  students: number;
  tags: string;
  created_at: string;
  updated_at: string;
}

// Map DB model to application model
const mapDbToCourse = (dbCourse: CourseDbModel): Course => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
    titleAr: dbCourse.title_ar,
    description: dbCourse.description,
    descriptionAr: dbCourse.description_ar,
    content: dbCourse.content,
    contentAr: dbCourse.content_ar,
    image: dbCourse.image,
    category: dbCourse.category,
    level: dbCourse.level as "Beginner" | "Intermediate" | "Advanced",
    price: dbCourse.price,
    currency: dbCourse.currency,
    duration: dbCourse.duration,
    lessons: dbCourse.lessons,
    isFree: dbCourse.is_free === 1,
    showOrders: dbCourse.show_orders === 1,
    featured: dbCourse.featured === 1,
    students: dbCourse.students,
    tags: dbCourse.tags ? JSON.parse(dbCourse.tags) : [],
    created_at: dbCourse.created_at,
    updated_at: dbCourse.updated_at
  };
};

// Get all courses
export const getCourses = async (): Promise<Course[]> => {
  const courses = await query<CourseDbModel>('SELECT * FROM courses ORDER BY created_at DESC');
  return courses.map(mapDbToCourse);
};

// Get featured courses
export const getFeaturedCourses = async (): Promise<Course[]> => {
  const courses = await query<CourseDbModel>('SELECT * FROM courses WHERE featured = 1 ORDER BY created_at DESC');
  return courses.map(mapDbToCourse);
};

// Get course by ID
export const getCourse = async (id: string): Promise<Course> => {
  const course = await queryOne<CourseDbModel>('SELECT * FROM courses WHERE id = ?', [id]);
  if (!course) throw new Error('Course not found');
  return mapDbToCourse(course);
};

// Create a new course
export const createCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  await execute(`
    INSERT INTO courses (
      id, title, title_ar, description, description_ar, content, content_ar, 
      image, category, level, price, currency, duration, lessons,
      is_free, show_orders, featured, students, tags, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id, course.title, course.titleAr, course.description, course.descriptionAr, 
    course.content, course.contentAr, course.image, course.category, course.level,
    course.price || 0, course.currency || 'USD', course.duration, course.lessons,
    course.isFree ? 1 : 0, course.showOrders ? 1 : 0, course.featured ? 1 : 0,
    course.students || 0, JSON.stringify(course.tags || []), now, now
  ]);
  
  return getCourse(id);
};

// Update an existing course
export const updateCourse = async (id: string, course: Partial<Course>): Promise<Course> => {
  const existingCourse = await getCourse(id);
  const updatedCourse = { ...existingCourse, ...course };
  
  await execute(`
    UPDATE courses SET
      title = ?, title_ar = ?, description = ?, description_ar = ?, 
      content = ?, content_ar = ?, image = ?, category = ?, level = ?,
      price = ?, currency = ?, duration = ?, lessons = ?, is_free = ?,
      show_orders = ?, featured = ?, students = ?, tags = ?,
      updated_at = ?
    WHERE id = ?
  `, [
    updatedCourse.title, updatedCourse.titleAr, updatedCourse.description, updatedCourse.descriptionAr,
    updatedCourse.content, updatedCourse.contentAr, updatedCourse.image, updatedCourse.category,
    updatedCourse.level, updatedCourse.price || 0, updatedCourse.currency || 'USD',
    updatedCourse.duration, updatedCourse.lessons, updatedCourse.isFree ? 1 : 0,
    updatedCourse.showOrders ? 1 : 0, updatedCourse.featured ? 1 : 0,
    updatedCourse.students || 0, JSON.stringify(updatedCourse.tags || []),
    new Date().toISOString(), id
  ]);
  
  return getCourse(id);
};

// Delete a course
export const deleteCourse = async (id: string): Promise<void> => {
  await execute('DELETE FROM courses WHERE id = ?', [id]);
};

// Get course orders count
export const getCourseOrdersCount = async (courseId: string): Promise<number> => {
  const result = await queryOne<{ count: number }>('SELECT COUNT(*) as count FROM course_orders WHERE course_id = ?', [courseId]);
  return result?.count || 0;
};

// Get course orders
export const getCourseOrders = async (courseId: string): Promise<CourseOrder[]> => {
  const orders = await query<any>('SELECT * FROM course_orders WHERE course_id = ? ORDER BY created_at DESC', [courseId]);
  return orders.map(order => ({
    id: order.id,
    course_id: order.course_id,
    user_id: order.user_id,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
    payment_method: order.payment_method,
    payment_id: order.payment_id,
    created_at: order.created_at
  }));
};

// Create a course order
export const createCourseOrder = async (order: Omit<CourseOrder, 'id' | 'created_at'>): Promise<CourseOrder> => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  await execute(`
    INSERT INTO course_orders (
      id, course_id, user_id, amount, currency, 
      status, payment_method, payment_id, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id, order.course_id, order.user_id, order.amount, order.currency,
    order.status, order.payment_method || null, order.payment_id || null, now
  ]);
  
  const createdOrder = await queryOne<any>('SELECT * FROM course_orders WHERE id = ?', [id]);
  return {
    id: createdOrder.id,
    course_id: createdOrder.course_id,
    user_id: createdOrder.user_id,
    amount: createdOrder.amount,
    currency: createdOrder.currency,
    status: createdOrder.status,
    payment_method: createdOrder.payment_method,
    payment_id: createdOrder.payment_id,
    created_at: createdOrder.created_at
  };
};

// Analytics functions
export const getCoursesAnalytics = async (): Promise<{
  totalCourses: number;
  freeCourses: number;
  paidCourses: number;
  featuredCourses: number;
  totalOrders: number;
  totalStudents: number;
}> => {
  const statsQuery = await queryOne<any>(`
    SELECT
      COUNT(*) as totalCourses,
      SUM(CASE WHEN is_free = 1 THEN 1 ELSE 0 END) as freeCourses,
      SUM(CASE WHEN is_free = 0 THEN 1 ELSE 0 END) as paidCourses,
      SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) as featuredCourses,
      SUM(students) as totalStudents
    FROM courses
  `);
  
  const ordersQuery = await queryOne<{totalOrders: number}>('SELECT COUNT(*) as totalOrders FROM course_orders');
  
  return {
    totalCourses: statsQuery?.totalCourses || 0,
    freeCourses: statsQuery?.freeCourses || 0,
    paidCourses: statsQuery?.paidCourses || 0,
    featuredCourses: statsQuery?.featuredCourses || 0,
    totalOrders: ordersQuery?.totalOrders || 0,
    totalStudents: statsQuery?.totalStudents || 0
  };
};
