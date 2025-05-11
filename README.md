
# Project Integration Guide

## MySQL Integration

This project uses MySQL for database operations. To properly integrate MySQL with this project, follow these steps:

### 1. Server-side Integration

The MySQL operations should be performed on the server side, as browser environments cannot directly connect to MySQL databases.

#### Setting up the MySQL Server

1. Make sure MySQL server is installed and running on your VPS.
2. Create the database and user:

```sql
CREATE DATABASE ahjbu_ah_db;
CREATE USER 'ahjbu_ah_user'@'localhost' IDENTIFIED BY 'BASem1462015%';
GRANT ALL PRIVILEGES ON ahjbu_ah_db.* TO 'ahjbu_ah_user'@'localhost';
FLUSH PRIVILEGES;
```

3. Create the necessary tables:

```sql
-- Files table
CREATE TABLE files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  path VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  folder VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- File features table
CREATE TABLE file_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  category VARCHAR(100),
  featured TINYINT(1) DEFAULT 0,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

-- File downloads tracking
CREATE TABLE file_downloads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_id INT NOT NULL,
  downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

-- Media table
CREATE TABLE media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  path VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  folder VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  content LONGTEXT,
  content_ar LONGTEXT,
  image VARCHAR(255),
  category VARCHAR(100),
  level VARCHAR(50),
  price DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  duration INT DEFAULT 0,
  lessons INT DEFAULT 0,
  is_free TINYINT(1) DEFAULT 1,
  show_orders TINYINT(1) DEFAULT 0,
  featured TINYINT(1) DEFAULT 0,
  students INT DEFAULT 0,
  tags TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Course orders table
CREATE TABLE course_orders (
  id VARCHAR(36) PRIMARY KEY,
  course_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
```

#### Running the File Upload Server

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install express multer cors mysql2 uuid
```

3. Start the server:

```bash
node file-upload.js
```

### 2. API Configuration

For the frontend to communicate with your MySQL database, you need to set up API endpoints. The project is already configured to use API endpoints instead of direct MySQL connections in the browser.

### 3. Production Deployment

For production deployment, you'll need to:

1. Set up a reverse proxy with Nginx to route API requests to your Node.js server
2. Configure CORS to allow your frontend to communicate with your backend
3. Set up proper environment variables for database credentials

## VPS Deployment Guide

To deploy this project on your VPS at the specified location `/home/ahjbu/web/ahjbu.com`:

1. Build the React application:

```bash
npm run build
```

2. Transfer the built files to your VPS:

```bash
scp -r dist/* user@84.46.240.246:/home/ahjbu/web/ahjbu.com/
```

3. Configure Nginx to serve the files:

```nginx
server {
    listen 80;
    server_name ahjbu.com www.ahjbu.com;

    root /home/ahjbu/web/ahjbu.com;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy for file upload server
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded files
    location /uploads {
        alias /home/ahjbu/web/ahjbu.com/uploads;
    }
}
```

4. Start the file upload server as a background service using PM2:

```bash
npm install -g pm2
cd /home/ahjbu/web/ahjbu.com/server
pm2 start file-upload.js
pm2 startup
pm2 save
```

5. Restart Nginx:

```bash
sudo systemctl restart nginx
```

## Remaining Tasks

1. Complete Course Management System
2. Implement Advanced Analytics Dashboard
3. Add Account and Appearance Settings
4. Implement Performance Improvements (Lazy Loading, Virtualization)
5. Add Automated Testing
