// Modul koneksi PostgreSQL menggunakan 'pg'
const { Pool } = require('pg');
require('dotenv').config();

// Inisialisasi pool koneksi PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rekam_medis_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Listener saat koneksi error di luar penanganan query
pool.on('error', (err) => {
  console.error('[DATABASE ERROR] Kesalahan tidak terduga pada klien idle:', err.message);
});

// Helper untuk menjalankan query berparameter (prepared statement)
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // Log singkat hanya jika diperlukan debugging
    // console.log(`[QUERY] Executed in ${duration}ms: ${text.slice(0, 50)}...`);
    return res;
  } catch (err) {
    console.error('[DATABASE QUERY ERROR]', {
      query: text,
      params,
      message: err.message
    });
    throw err;
  }
};

// Helper untuk mendapatkan client khusus transaksi (BEGIN / COMMIT / ROLLBACK)
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

// Fungsi cek koneksi saat aplikasi mulai
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
    console.log(`[SUCCESS] Database terhubung ke PostgreSQL: "${res.rows[0].db_name}" pada ${res.rows[0].current_time}`);
    return true;
  } catch (err) {
    console.error(`[ERROR] Gagal terhubung ke database PostgreSQL "${process.env.DB_NAME}":`, err.message);
    console.error('Pastikan PostgreSQL berjalan dan konfigurasi pada .env sudah benar.');
    return false;
  }
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection
};
