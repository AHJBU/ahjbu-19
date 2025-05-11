
// Express server for file upload and API endpoints
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

// Create express app
const app = express();
const PORT = process.env.PORT || 3001;

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'ahjbu_ah_user',
  password: 'BASem1462015%',
  database: 'ahjbu_ah_db',
};

// Set up middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'files';
    
    // Determine folder based on file type
    if (file.mimetype.startsWith('image/')) {
      folder = 'images';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'videos';
    } else if (
      file.mimetype.startsWith('application/') || 
      file.mimetype.startsWith('text/')
    ) {
      folder = 'documents';
    }
    
    const uploadPath = path.join(__dirname, '../../uploads', folder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage: storage });

// Database connection pool
const pool = mysql.createPool(dbConfig);

// File upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const folder = path.basename(path.dirname(file.path));
    
    // Get base URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${folder}/${file.filename}`;
    
    // Save file info to database
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(`
        INSERT INTO media (name, original_name, mime_type, size, path, url, folder)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        file.filename,
        file.originalname,
        file.mimetype,
        file.size,
        file.path,
        fileUrl,
        folder
      ]);
      
      const [fileData] = await connection.execute(
        'SELECT * FROM media WHERE id = ?', 
        [result.insertId]
      );
      
      res.status(200).json({
        success: true,
        file: fileData[0]
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Get all media files
app.get('/api/media', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [files] = await connection.execute(
        'SELECT * FROM media ORDER BY created_at DESC'
      );
      res.status(200).json(files);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to retrieve media' });
  }
});

// Delete media file
app.delete('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    try {
      // Get file info first
      const [files] = await connection.execute(
        'SELECT * FROM media WHERE id = ?',
        [id]
      );
      
      if (files.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      const file = files[0];
      
      // Delete from database
      await connection.execute(
        'DELETE FROM media WHERE id = ?',
        [id]
      );
      
      // Delete from filesystem
      fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
      
      res.status(200).json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
