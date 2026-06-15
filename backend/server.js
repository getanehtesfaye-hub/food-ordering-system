const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is working!' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    const result = await pool.query('SELECT current_database() AS database');
    res.json({ status: 'DB OK', database: result.rows[0].database });
  } catch (error) {
    res.json({ status: 'DB FAILED', error: error.message });
  }
});

module.exports = app;