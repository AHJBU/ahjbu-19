
// Server component for handling file uploads to MySQL
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'ahjbu_ah_user',
  password: 'BASem1462015%',
  database: 'ahjbu_ah_db',
};

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.params.folder || 'files';
    const dir = path.join(__dirname, '../uploads', folder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    const timestamp = Date.now();
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const filename = `${timestamp}-${path.basename(originalName, extension)}${extension}`;
    
    cb(null, filename);
  }
});

const upload = multer({ storage });

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Upload endpoint
app.post('/api/upload/:folder', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const folder = req.params.folder;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Get file data
    const filePath = `${folder}/${file.filename}`;
    const fileUrl = `/uploads/${filePath}`;
    
    // Insert file info into database
    const connection = await pool.getConnection();
    
    try {
      let table = 'files';
      if (folder === 'images' || folder === 'videos') {
        table = 'media';
      }
      
      const [result] = await connection.execute(
        `INSERT INTO ${table} (name, original_name, mime_type, size, path, url, folder) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [file.filename, file.originalname, file.mimetype, file.size, filePath, fileUrl, folder]
      );
      
      connection.release();
      
      res.status(201).json({
        id: result.insertId,
        name: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath,
        url: fileUrl,
        folder
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Delete file endpoint
app.delete('/api/files/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const connection = await pool.getConnection();
    
    try {
      // Get file info
      const [files] = await connection.execute(
        'SELECT * FROM files WHERE id = ?',
        [fileId]
      );
      
      if (files.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'File not found' });
      }
      
      const file = files[0];
      const filePath = path.join(__dirname, '../uploads', file.path);
      
      // Delete file from filesystem
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      // Delete from database
      await connection.execute(
        'DELETE FROM files WHERE id = ?',
        [fileId]
      );
      
      connection.release();
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`File upload server running on port ${PORT}`);
});

// Export for use in other environments
module.exports = app;
