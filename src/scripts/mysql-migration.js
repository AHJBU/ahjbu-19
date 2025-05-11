
// MySQL database migration script
// This script will create the necessary tables for file management

const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'ahjbu_ah_user',
  password: 'BASem1462015%',
  database: 'ahjbu_ah_db',
};

// Create tables for file management
async function createTables() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('Connected to MySQL database');
    
    // Create files table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS files (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size BIGINT NOT NULL,
        path VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        folder VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_path (path)
      )
    `);
    console.log('Files table created or already exists');
    
    // Create file_features table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS file_features (
        id INT PRIMARY KEY AUTO_INCREMENT,
        file_id INT NOT NULL,
        title VARCHAR(255),
        title_ar VARCHAR(255),
        description TEXT,
        description_ar TEXT,
        category VARCHAR(100) DEFAULT 'Document',
        featured BOOLEAN DEFAULT 0,
        FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
      )
    `);
    console.log('File_features table created or already exists');
    
    // Create file_downloads table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS file_downloads (
        id INT PRIMARY KEY AUTO_INCREMENT,
        file_id INT NOT NULL,
        download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
      )
    `);
    console.log('File_downloads table created or already exists');
    
    // Create additional tables for media management
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS media (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size BIGINT NOT NULL,
        path VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        folder VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_media_path (path)
      )
    `);
    console.log('Media table created or already exists');
    
    // Create directory to store uploads if needed
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Created uploads directory');
    }
    
    const mediaFolders = ['images', 'videos', 'files'];
    mediaFolders.forEach(folder => {
      const folderPath = path.join(uploadDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Created ${folder} directory`);
      }
    });
    
    console.log('MySQL migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await connection.end();
  }
}

// Run migration
createTables().catch(console.error);
