
-- MySQL Database Setup Script for ahjbu.com Website

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ahjbu_ah_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE ahjbu_ah_db;

-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  title_ar VARCHAR(255),
  bio TEXT,
  bio_ar TEXT,
  email VARCHAR(255),
  phone VARCHAR(100),
  avatar VARCHAR(500),
  cover_image VARCHAR(500),
  location VARCHAR(255),
  location_ar VARCHAR(255),
  social_links JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id VARCHAR(36) PRIMARY KEY,
  profile_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  company_ar VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  location_ar VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  description_ar TEXT,
  current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id VARCHAR(36) PRIMARY KEY,
  profile_id VARCHAR(36) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  degree_ar VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  institution_ar VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  location_ar VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  description_ar TEXT,
  current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id VARCHAR(36) PRIMARY KEY,
  profile_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  level INT NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id VARCHAR(36) PRIMARY KEY,
  profile_id VARCHAR(36) NOT NULL,
  url VARCHAR(500) NOT NULL,
  title VARCHAR(255),
  title_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  description TEXT,
  description_ar TEXT,
  image VARCHAR(500),
  link VARCHAR(500),
  tags JSON,
  featured BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create posts table (blog posts)
CREATE TABLE IF NOT EXISTS posts (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  content TEXT,
  content_ar TEXT,
  excerpt TEXT,
  excerpt_ar TEXT,
  image VARCHAR(500),
  author_id VARCHAR(36),
  published BOOLEAN DEFAULT FALSE,
  tags JSON,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create publications table
CREATE TABLE IF NOT EXISTS publications (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  description TEXT,
  description_ar TEXT,
  image VARCHAR(500),
  file_url VARCHAR(500),
  published_date DATE NOT NULL,
  publisher VARCHAR(255),
  publisher_ar VARCHAR(255),
  authors TEXT,
  authors_ar TEXT,
  category VARCHAR(100),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  description TEXT,
  description_ar TEXT,
  image VARCHAR(500),
  price DECIMAL(10,2),
  duration VARCHAR(100),
  duration_ar VARCHAR(100),
  level VARCHAR(50),
  level_ar VARCHAR(50),
  category VARCHAR(100),
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create course_lessons table
CREATE TABLE IF NOT EXISTS course_lessons (
  id VARCHAR(36) PRIMARY KEY,
  course_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  content TEXT,
  content_ar TEXT,
  video_url VARCHAR(500),
  duration_minutes INT,
  order_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  description TEXT,
  description_ar TEXT,
  image VARCHAR(500),
  date DATE NOT NULL,
  issuer VARCHAR(255),
  issuer_ar VARCHAR(255),
  category VARCHAR(100),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create files table for file management
CREATE TABLE IF NOT EXISTS files (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  file_url VARCHAR(500) NOT NULL,
  file_size INT,
  file_type VARCHAR(100),
  category VARCHAR(100),
  is_public BOOLEAN DEFAULT TRUE,
  download_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100),
  address TEXT,
  address_ar TEXT,
  map_url TEXT,
  social_links JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create navigation_links table
CREATE TABLE IF NOT EXISTS navigation_links (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  href VARCHAR(255) NOT NULL,
  parent_id VARCHAR(36),
  enabled BOOLEAN DEFAULT TRUE,
  order_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES navigation_links(id) ON DELETE SET NULL
);

-- Create static_content table
CREATE TABLE IF NOT EXISTS static_content (
  id VARCHAR(36) PRIMARY KEY,
  key_name VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255),
  title_ar VARCHAR(255),
  content TEXT,
  content_ar TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  avatar VARCHAR(500),
  role VARCHAR(50) DEFAULT 'user',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(36) PRIMARY KEY,
  site_name VARCHAR(255) NOT NULL,
  site_name_ar VARCHAR(255) NOT NULL,
  site_description TEXT,
  site_description_ar TEXT,
  logo_url VARCHAR(500),
  favicon_url VARCHAR(500),
  theme_color VARCHAR(50),
  primary_color VARCHAR(50),
  secondary_color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create access_logs table
CREATE TABLE IF NOT EXISTS access_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  ip_address VARCHAR(50),
  user_agent TEXT,
  path VARCHAR(255),
  method VARCHAR(10),
  status_code INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default admin user
INSERT INTO users (id, email, name, role) 
VALUES ('1', 'admin@example.com', 'Admin', 'admin')
ON DUPLICATE KEY UPDATE email = email;

-- Insert default site settings
INSERT INTO site_settings (id, site_name, site_name_ar, site_description, site_description_ar, theme_color) 
VALUES ('1', 'Abdullah Husseini', 'عبد الله الحسيني', 'Personal website and portfolio', 'الموقع الشخصي والمحفظة', '#3182ce')
ON DUPLICATE KEY UPDATE site_name = site_name;

-- Index creation for better performance
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_courses_featured ON courses(featured);
CREATE INDEX idx_achievements_date ON achievements(date);
CREATE INDEX idx_files_category ON files(category);
CREATE INDEX idx_contact_messages_read ON contact_messages(read);
