const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

async function setup() {
  const dbName = process.env.DB_NAME || 'food_ordering';
  const adminPool = new Pool({ ...dbConfig, database: 'postgres' });

  try {
    const exists = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (exists.rows.length === 0) {
      const safeName = dbName.replace(/"/g, '""');
      await adminPool.query(`CREATE DATABASE "${safeName}"`);
      console.log(`Created database: ${dbName}`);
    } else {
      console.log(`Database "${dbName}" already exists`);
    }
  } finally {
    await adminPool.end();
  }

  const pool = new Pool({ ...dbConfig, database: dbName });

  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '..', 'database.sql'),
      'utf8'
    );
    await pool.query(sql);
    console.log('Database schema applied successfully');
  } catch (error) {
    if (error.code === '42P07' || error.code === '42710') {
      console.log('Schema objects already exist — database is ready');
    } else {
      throw error;
    }
  } finally {
    await pool.end();
  }
}

setup().catch((err) => {
  console.error('Database setup failed:', err.message);
  console.error('\nMake sure PostgreSQL is running. Options:');
  console.error('  1. docker compose up -d   (from project root)');
  console.error('  2. Install PostgreSQL locally and update backend/.env');
  process.exit(1);
});
