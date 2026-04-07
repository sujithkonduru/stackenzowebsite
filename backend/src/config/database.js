const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

// Validate required env vars
if (!process.env.DB_PASSWORD) {
  throw new Error('DB_PASSWORD is required in backend/.env');
}
if (!process.env.DB_USER) {
  throw new Error('DB_USER is required in backend/.env');
}

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'stackenzo_db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT 1 as ping');
    console.log('✅ PostgreSQL connected successfully');
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    return false;
  }
};

module.exports = { pool, testConnection };
