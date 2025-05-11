
import { Course } from '@/types/course';
import { query, execute, queryOne } from '@/lib/mysql';

// API endpoint for courses
const COURSES_API_ENDPOINT = '/api/courses';

// Interface for courses stored in MySQL
export interface MySQLCourse {
  id: number;
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
  is_free: number;
  show_orders: number;
  featured: number;
  students: number;
  tags: string;
  created_at: string;
  updated_at: string;
}

// Get all courses
export const getCourses = async (): Promise<Course[]> => {
  try {
    const sql = `
      SELECT * FROM courses 
      ORDER BY created_at DESC
    `;
    
    const courses = await query<MySQLCourse>(sql);
    
    return courses.map(course => ({
      id: String(course.id),
      title: course.title,
      titleAr: course.title_ar,
      description: course.description,
      descriptionAr: course.description_ar,
      content: course.content,
      contentAr: course.content_ar,
      image: course.image,
      category: course.category,
      level: course.level,
      price: course.price,
      currency: course.currency,
      duration: course.duration,
      lessons: course.lessons,
      isFree: course.is_free === 1,
      showOrders: course.show_orders === 1,
      featured: course.featured === 1,
      students: course.students,
      tags: course.tags.split(','),
      created_at: course.created_at,
      updated_at: course.updated_at
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

// Get featured courses
export const getFeaturedCourses = async (limit: number = 6): Promise<Course[]> => {
  try {
    const sql = `
      SELECT * FROM courses 
      WHERE featured = 1
      ORDER BY created_at DESC
      LIMIT ?
    `;
    
    const courses = await query<MySQLCourse>(sql, [limit]);
    
    return courses.map(course => ({
      id: String(course.id),
      title: course.title,
      titleAr: course.title_ar,
      description: course.description,
      descriptionAr: course.description_ar,
      content: course.content,
      contentAr: course.content_ar,
      image: course.image,
      category: course.category,
      level: course.level,
      price: course.price,
      currency: course.currency,
      duration: course.duration,
      lessons: course.lessons,
      isFree: course.is_free === 1,
      showOrders: course.show_orders === 1,
      featured: course.featured === 1,
      students: course.students,
      tags: course.tags.split(','),
      created_at: course.created_at,
      updated_at: course.updated_at
    }));
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    return [];
  }
};

// Get a course by ID
export const getCourse = async (id: string): Promise<Course> => {
  try {
    const sql = `SELECT * FROM courses WHERE id = ?`;
    const course = await queryOne<MySQLCourse>(sql, [id]);
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    return {
      id: String(course.id),
      title: course.title,
      titleAr: course.title_ar,
      description: course.description,
      descriptionAr: course.description_ar,
      content: course.content,
      contentAr: course.content_ar,
      image: course.image,
      category: course.category,
      level: course.level,
      price: course.price,
      currency: course.currency,
      duration: course.duration,
      lessons: course.lessons,
      isFree: course.is_free === 1,
      showOrders: course.show_orders === 1,
      featured: course.featured === 1,
      students: course.students,
      tags: course.tags.split(','),
      created_at: course.created_at,
      updated_at: course.updated_at
    };
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    
    // Return a mock course for development
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
  }
};

// Create a new course
export const createCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  try {
    const sql = `
      INSERT INTO courses (
        title, title_ar, description, description_ar, 
        content, content_ar, image, category, 
        level, price, currency, duration, 
        lessons, is_free, show_orders, featured, 
        students, tags, created_at, updated_at
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const result = await execute(sql, [
      course.title,
      course.titleAr,
      course.description,
      course.descriptionAr,
      course.content,
      course.contentAr,
      course.image,
      course.category,
      course.level,
      course.price,
      course.currency,
      course.duration,
      course.lessons,
      course.isFree ? 1 : 0,
      course.showOrders ? 1 : 0,
      course.featured ? 1 : 0,
      course.students,
      course.tags.join(',')
    ]);
    
    return {
      ...course,
      id: String(result.insertId),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating course:', error);
    
    // Return a mock response for development
    return {
      ...course,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
};

// Update an existing course
export const updateCourse = async (id: string, course: Partial<Course>): Promise<Course> => {
  try {
    // Build dynamic SQL update based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    
    if (course.title !== undefined) {
      updates.push('title = ?');
      values.push(course.title);
    }
    
    if (course.titleAr !== undefined) {
      updates.push('title_ar = ?');
      values.push(course.titleAr);
    }
    
    if (course.description !== undefined) {
      updates.push('description = ?');
      values.push(course.description);
    }
    
    if (course.descriptionAr !== undefined) {
      updates.push('description_ar = ?');
      values.push(course.descriptionAr);
    }
    
    if (course.content !== undefined) {
      updates.push('content = ?');
      values.push(course.content);
    }
    
    if (course.contentAr !== undefined) {
      updates.push('content_ar = ?');
      values.push(course.contentAr);
    }
    
    if (course.image !== undefined) {
      updates.push('image = ?');
      values.push(course.image);
    }
    
    if (course.category !== undefined) {
      updates.push('category = ?');
      values.push(course.category);
    }
    
    if (course.level !== undefined) {
      updates.push('level = ?');
      values.push(course.level);
    }
    
    if (course.price !== undefined) {
      updates.push('price = ?');
      values.push(course.price);
    }
    
    if (course.currency !== undefined) {
      updates.push('currency = ?');
      values.push(course.currency);
    }
    
    if (course.duration !== undefined) {
      updates.push('duration = ?');
      values.push(course.duration);
    }
    
    if (course.lessons !== undefined) {
      updates.push('lessons = ?');
      values.push(course.lessons);
    }
    
    if (course.isFree !== undefined) {
      updates.push('is_free = ?');
      values.push(course.isFree ? 1 : 0);
    }
    
    if (course.showOrders !== undefined) {
      updates.push('show_orders = ?');
      values.push(course.showOrders ? 1 : 0);
    }
    
    if (course.featured !== undefined) {
      updates.push('featured = ?');
      values.push(course.featured ? 1 : 0);
    }
    
    if (course.students !== undefined) {
      updates.push('students = ?');
      values.push(course.students);
    }
    
    if (course.tags !== undefined) {
      updates.push('tags = ?');
      values.push(course.tags.join(','));
    }
    
    updates.push('updated_at = NOW()');
    
    if (updates.length > 0) {
      const sql = `
        UPDATE courses 
        SET ${updates.join(', ')}
        WHERE id = ?
      `;
      
      values.push(id);
      await execute(sql, values);
    }
    
    // Return updated course
    return await getCourse(id);
  } catch (error) {
    console.error(`Error updating course ${id}:`, error);
    
    // Return a mock response for development
    const existingCourse = await getCourse(id);
    return {
      ...existingCourse,
      ...course,
      updated_at: new Date().toISOString()
    };
  }
};

// Delete a course
export const deleteCourse = async (id: string): Promise<void> => {
  try {
    const sql = `DELETE FROM courses WHERE id = ?`;
    await execute(sql, [id]);
  } catch (error) {
    console.error(`Error deleting course ${id}:`, error);
  }
};

// Get course orders
export const getCourseOrders = async (courseId: string): Promise<number> => {
  try {
    const sql = `
      SELECT COUNT(*) as count 
      FROM course_orders 
      WHERE course_id = ?
    `;
    
    const result = await queryOne<{count: number}>(sql, [courseId]);
    return result ? result.count : 0;
  } catch (error) {
    console.error(`Error fetching orders for course ${courseId}:`, error);
    return 0;
  }
};

// Get all orders for a course with details
export const getCourseOrdersWithDetails = async (courseId: string): Promise<any[]> => {
  try {
    const sql = `
      SELECT * 
      FROM course_orders 
      WHERE course_id = ?
      ORDER BY created_at DESC
    `;
    
    const orders = await query(sql, [courseId]);
    return orders;
  } catch (error) {
    console.error(`Error fetching detailed orders for course ${courseId}:`, error);
    return [];
  }
};

// Create a new order
export const createOrder = async (order: {
  courseId: string;
  userId?: string;
  email: string;
  name: string;
  price: number;
  status: string;
}): Promise<any> => {
  try {
    const sql = `
      INSERT INTO course_orders (
        course_id, user_id, email, name, price, status, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const result = await execute(sql, [
      order.courseId,
      order.userId || null,
      order.email,
      order.name,
      order.price,
      order.status
    ]);
    
    return {
      id: result.insertId,
      ...order,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Return a mock response for development
    return {
      id: crypto.randomUUID(),
      ...order,
      created_at: new Date().toISOString()
    };
  }
};

// Get all orders for admin dashboard
export const getAllOrders = async (): Promise<any[]> => {
  try {
    const sql = `
      SELECT co.*, c.title, c.title_ar 
      FROM course_orders co
      JOIN courses c ON co.course_id = c.id
      ORDER BY co.created_at DESC
    `;
    
    const orders = await query(sql);
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (orderId: number, status: string): Promise<void> => {
  try {
    const sql = `
      UPDATE course_orders
      SET status = ?
      WHERE id = ?
    `;
    
    await execute(sql, [status, orderId]);
  } catch (error) {
    console.error(`Error updating order status for order ${orderId}:`, error);
  }
};

// Delete an order
export const deleteOrder = async (orderId: number): Promise<void> => {
  try {
    const sql = `DELETE FROM course_orders WHERE id = ?`;
    await execute(sql, [orderId]);
  } catch (error) {
    console.error(`Error deleting order ${orderId}:`, error);
  }
};

// Create the necessary MySQL tables for courses
export const createCoursesTables = async (): Promise<void> => {
  try {
    // Courses table
    await execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        description TEXT,
        description_ar TEXT,
        content LONGTEXT,
        content_ar LONGTEXT,
        image VARCHAR(255),
        category VARCHAR(100),
        level VARCHAR(50),
        price DECIMAL(10, 2) DEFAULT 0,
        currency VARCHAR(10) DEFAULT 'USD',
        duration INT DEFAULT 0,
        lessons INT DEFAULT 0,
        is_free BOOLEAN DEFAULT 1,
        show_orders BOOLEAN DEFAULT 0,
        featured BOOLEAN DEFAULT 0,
        students INT DEFAULT 0,
        tags VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Course orders table
    await execute(`
      CREATE TABLE IF NOT EXISTS course_orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        user_id VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);
    
    // Course content sections table
    await execute(`
      CREATE TABLE IF NOT EXISTS course_sections (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        order_num INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);
    
    // Course lectures table
    await execute(`
      CREATE TABLE IF NOT EXISTS course_lectures (
        id INT PRIMARY KEY AUTO_INCREMENT,
        section_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        content TEXT,
        content_ar TEXT,
        video_url VARCHAR(255),
        duration INT DEFAULT 0,
        order_num INT DEFAULT 0,
        is_free BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (section_id) REFERENCES course_sections(id) ON DELETE CASCADE
      )
    `);
    
    console.log("MySQL tables for courses have been created or already exist.");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
};
