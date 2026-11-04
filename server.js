// Server Utama Aplikasi Sistem Rekam Medis Klinik
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const db = require('./db');
const { requireAuth } = require('./middleware/auth');

// Inisialisasi Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parsing Body Request (JSON dan Form URL-Encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sajikan File Statis (CSS, JS, Gambar)
app.use(express.static(path.join(__dirname, 'public')));

// Konfigurasi Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'rekam_medis_klinik_secret_default_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 8, // 8 jam
      httpOnly: true
    }
  })
);

// Middleware Global untuk Mengirim Variabel ke Seluruh Template EJS
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.flash = req.session.flash || null;
  // Hapus flash dari session setelah dimasukkan ke locals agar tidak muncul dua kali
  delete req.session.flash;
  next();
});

// Routing Modul
const authRoutes = require('./routes/auth');
const pasienRoutes = require('./routes/pasien');
const kunjunganRoutes = require('./routes/kunjungan');
const pemeriksaanRoutes = require('./routes/pemeriksaan');
const obatRoutes = require('./routes/obat');
const userRoutes = require('./routes/user');

app.use('/auth', authRoutes);
app.use('/pasien', pasienRoutes);
app.use('/kunjungan', kunjunganRoutes);
app.use('/pemeriksaan', pemeriksaanRoutes);
app.use('/obat', obatRoutes);
app.use('/user', userRoutes);

// Halaman Dashboard Utama
app.get('/dashboard', requireAuth, async (req, res) => {
  const user = req.session.user;

  try {
    // 1. Hitung total data untuk statistik kartu
    const totalPasienRes = await db.query('SELECT COUNT(*) AS total FROM pasien');
    const kunjunganHariIniRes = await db.query(
      'SELECT COUNT(*) AS total FROM kunjungan WHERE tanggal = CURRENT_DATE'
    );
    const antreanMenungguRes = await db.query(
      "SELECT COUNT(*) AS total FROM kunjungan WHERE tanggal = CURRENT_DATE AND status = 'Menunggu'"
    );
    const antreanDiperiksaRes = await db.query(
      "SELECT COUNT(*) AS total FROM kunjungan WHERE tanggal = CURRENT_DATE AND status = 'Diperiksa'"
    );
    const kunjunganSelesaiRes = await db.query(
      "SELECT COUNT(*) AS total FROM kunjungan WHERE tanggal = CURRENT_DATE AND status = 'Selesai'"
    );
    const obatMenipisRes = await db.query(
      'SELECT COUNT(*) AS total FROM obat WHERE stok < 10'
    );

    // Khusus dokter: antrean milik dokter hari ini
    let antreanDokterHariIni = 0;
    if (user.role === 'dokter') {
      const dokterAntreanRes = await db.query(
        "SELECT COUNT(*) AS total FROM kunjungan WHERE tanggal = CURRENT_DATE AND dokter_id = $1 AND status IN ('Menunggu', 'Diperiksa')",
        [user.id]
      );
      antreanDokterHariIni = parseInt(dokterAntreanRes.rows[0].total, 10);
    }

    // Ambil 5 antrean kunjungan hari ini
    const antreanTerbaruRes = await db.query(
      `SELECT 
         k.id,
         k.tanggal,
         k.keluhan,
         k.status,
         p.no_rm,
         p.nama AS nama_pasien,
         u.nama AS nama_dokter
       FROM kunjungan k
       JOIN pasien p ON k.pasien_id = p.id
       JOIN users u ON k.dokter_id = u.id
       WHERE k.tanggal = CURRENT_DATE
       ORDER BY 
         CASE 
           WHEN k.status = 'Diperiksa' THEN 1 
           WHEN k.status = 'Menunggu' THEN 2 
           ELSE 3 
         END,
         k.id ASC
       LIMIT 5`
    );

    res.render('dashboard/index', {
      title: 'Dashboard Klinik',
      stats: {
        totalPasien: parseInt(totalPasienRes.rows[0].total, 10),
        kunjunganHariIni: parseInt(kunjunganHariIniRes.rows[0].total, 10),
        antreanMenunggu: parseInt(antreanMenungguRes.rows[0].total, 10),
        antreanDiperiksa: parseInt(antreanDiperiksaRes.rows[0].total, 10),
        kunjunganSelesai: parseInt(kunjunganSelesaiRes.rows[0].total, 10),
        obatMenipis: parseInt(obatMenipisRes.rows[0].total, 10),
        antreanDokterHariIni
      },
      antreanTerbaru: antreanTerbaruRes.rows
    });
  } catch (err) {
    console.error('[DASHBOARD ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal memuat statistik dashboard: ' + err.message };
    res.render('dashboard/index', {
      title: 'Dashboard Klinik',
      stats: {
        totalPasien: 0,
        kunjunganHariIni: 0,
        antreanMenunggu: 0,
        antreanDiperiksa: 0,
        kunjunganSelesai: 0,
        obatMenipis: 0,
        antreanDokterHariIni: 0
      },
      antreanTerbaru: []
    });
  }
});

// Halaman Utama: alihkan ke dashboard jika login, ke login jika belum
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  return res.redirect('/auth/login');
});

// Halaman 404 (Tidak Ditemukan)
app.use((req, res) => {
  res.status(404).render('error/404', {
    title: 'Halaman Tidak Ditemukan'
  });
});

// Handler Error Global 500
app.use((err, req, res, next) => {
  console.error('[SERVER GLOBAL ERROR]', err.stack);
  res.status(500).render('error/500', {
    title: 'Terjadi Kesalahan Sistem',
    errorMessage: err.message
  });
});

// Jalankan Server & Verifikasi Koneksi Database
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(` Server Sistem Rekam Medis Klinik Berjalan`);
  console.log(` Port: http://localhost:${PORT}`);
  console.log(`====================================================`);

  // Tes koneksi database pada saat start
  const isConnected = await db.testConnection();
  if (isConnected) {
    console.log('[INFO] Server siap menerima permintaan.');
  } else {
    console.error('[PERINGATAN] Aplikasi berjalan tetapi database PostgreSQL belum terhubung!');
  }
});
