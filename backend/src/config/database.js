const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'food_ordering',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection and select database
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// Execute query helper function
const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Query execution error:', error.message);
    throw error;
  }
};

// Execute query with single row result
const queryOne = async (sql, params = []) => {
  try {
    const rows = await query(sql, params);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Query execution error:', error.message);
    throw error;
  }
};

// Execute insert query and return insert ID
const insert = async (sql, params = []) => {
  try {
    const [result] = await pool.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error('Insert execution error:', error.message);
    throw error;
  }
};

// Execute update/delete query and return affected rows
const execute = async (sql, params = []) => {
  try {
    const [result] = await pool.execute(sql, params);
    return result.affectedRows;
  } catch (error) {
    console.error('Execution error:', error.message);
    throw error;
  }
};

// Begin transaction
const beginTransaction = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
};

// Commit transaction
const commitTransaction = async (connection) => {
  await connection.commit();
  connection.release();
};

// Rollback transaction
const rollbackTransaction = async (connection) => {
  await connection.rollback();
  connection.release();
};

module.exports = {
  pool,
  query,
  queryOne,
  insert,
  execute,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  testConnection
};
