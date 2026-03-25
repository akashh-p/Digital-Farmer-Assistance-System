// db.js — MySQL connection pool using mysql2
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'farmer_db',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅  MySQL connected to', process.env.DB_NAME || 'farmer_db');
    conn.release();
  })
  .catch(err => {
    console.error('❌  MySQL connection failed:', err.message);
    console.error('    Make sure MySQL is running and .env is configured.');
  });

module.exports = pool;
