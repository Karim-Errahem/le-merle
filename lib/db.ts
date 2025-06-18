// lib/db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: "sql7.freesqldatabase.com",
  user: "sql7783497",
  password: "hfQbsYADTP",
  database: "sql7783497",
  waitForConnections: true,
  connectionLimit: 200,
  queueLimit: 0,
});

export default pool;


