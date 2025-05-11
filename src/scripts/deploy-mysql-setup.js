
#!/usr/bin/env node
// Comprehensive MySQL database setup script for the ahjbu.com website
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'ahjbu_ah_user',
  password: 'BASem1462015%',
  database: 'ahjbu_ah_db',
};

// Helper function to run SQL file
async function executeSqlFile(connection, filePath) {
  try {
    console.log(`Executing SQL file: ${filePath}`);
    const content = await fs.readFile(filePath, 'utf8');
    const statements = content
      .split(';')
      .filter(statement => statement.trim())
      .map(statement => statement.trim());

    for (const statement of statements) {
      if (statement) {
        await connection.execute(statement);
      }
    }
    console.log(`Successfully executed ${filePath}`);
  } catch (error) {
    console.error(`Error executing ${filePath}:`, error);
    throw error;
  }
}

// Main setup function
async function setupDatabase() {
  let connection;
  
  try {
    console.log('Connecting to MySQL database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Successfully connected to the database');
    
    // Execute migration scripts
    const scriptsDir = path.join(__dirname, '../scripts');
    
    // Create files tables
    await executeSqlFile(connection, path.join(scriptsDir, 'mysql-migration.js'));
    
    // Create courses tables
    await executeSqlFile(connection, path.join(scriptsDir, 'mysql-courses-migration.js'));
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
      console.log('Created uploads directory');
    } catch (err) {
      console.log('Uploads directory already exists');
    }
    
    // Create subdirectories
    const dirs = ['images', 'videos', 'documents', 'files'];
    for (const dir of dirs) {
      try {
        await fs.mkdir(path.join(uploadsDir, dir), { recursive: true });
        console.log(`Created ${dir} directory`);
      } catch (err) {
        console.log(`${dir} directory already exists`);
      }
    }
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the setup
setupDatabase().catch(console.error);
