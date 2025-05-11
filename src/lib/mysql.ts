
// MySQL database connection utilities
import mysql from 'mysql2/promise';

// Database connection configuration
export const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'ahjbu_ah_user',
  password: 'BASem1462015%',
  database: 'ahjbu_ah_db',
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Execute a query with parameters
export async function query<T>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Get a single row from a query
export async function queryOne<T>(sql: string, params?: any[]): Promise<T | null> {
  try {
    const rows = await query<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Execute a query that doesn't return rows (INSERT, UPDATE, DELETE)
export async function execute(sql: string, params?: any[]): Promise<mysql.ResultSetHeader> {
  try {
    const [result] = await pool.execute(sql, params);
    return result as mysql.ResultSetHeader;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
