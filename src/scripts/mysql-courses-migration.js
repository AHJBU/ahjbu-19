
// MySQL database migration script for courses
const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'ahjbu_ah_user',
  password: 'BASem1462015%',
  database: 'ahjbu_ah_db',
};

// Create tables for course management
async function createCoursesTables() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('Connected to MySQL database');
    
    // Create courses table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        description TEXT,
        description_ar TEXT,
        content LONGTEXT,
        content_ar LONGTEXT,
        image VARCHAR(255),
        category VARCHAR(100),
        level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
        price DECIMAL(10,2) DEFAULT 0,
        currency VARCHAR(10) DEFAULT 'USD',
        duration INT DEFAULT 0,
        lessons INT DEFAULT 0,
        is_free BOOLEAN DEFAULT 1,
        show_orders BOOLEAN DEFAULT 0,
        featured BOOLEAN DEFAULT 0,
        students INT DEFAULT 0,
        tags JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Courses table created or already exists');
    
    // Create course_orders table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course_orders (
        id VARCHAR(36) PRIMARY KEY,
        course_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        payment_method VARCHAR(50),
        payment_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);
    console.log('Course_orders table created or already exists');
    
    // Create course analytics table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course_analytics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id VARCHAR(36) NOT NULL,
        views INT DEFAULT 0,
        unique_views INT DEFAULT 0,
        completion_rate DECIMAL(5,2) DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);
    console.log('Course_analytics table created or already exists');
    
    console.log('MySQL courses migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await connection.end();
  }
}

// Run migration
createCoursesTables().catch(console.error);
