// Script Inisialisasi Database dan Data Awal (Dummy)
// Jalankan dengan: npm run setup

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT, 10) || 5432;
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'rekam_medis_db';

async function runSetup() {
  console.log('=== MEMULAI SETUP DATABASE KLINIK ===');
  console.log(`Menghubungkan ke PostgreSQL di ${dbHost}:${dbPort} sebagai ${dbUser}...`);

  // 1. Hubungkan ke database default 'postgres' untuk memastikan database target ada
  const rootClient = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: 'postgres'
  });

  try {
    await rootClient.connect();
    console.log('[1/4] Terhubung ke server PostgreSQL (db: postgres).');

    // Cek apakah database target sudah ada
    const checkDb = await rootClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (checkDb.rows.length === 0) {
      console.log(`Database "${dbName}" belum ada. Membuat database "${dbName}"...`);
      // Nama database tidak bisa berparameter dalam CREATE DATABASE, sanitasi identifier
      const safeDbName = dbName.replace(/[^a-zA-Z0-9_]/g, '');
      await rootClient.query(`CREATE DATABASE "${safeDbName}"`);
      console.log(`[SUCCESS] Database "${safeDbName}" berhasil dibuat.`);
    } else {
      console.log(`Database "${dbName}" sudah ada.`);
    }
  } catch (err) {
    console.error('[ERROR] Gagal memeriksa atau membuat database:', err.message);
    process.exit(1);
  } finally {
    await rootClient.end();
  }

  // 2. Hubungkan ke database aplikasi
  const appClient = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName
  });

  try {
    await appClient.connect();
    console.log(`[2/4] Terhubung ke database "${dbName}".`);

    // 3. Baca dan eksekusi schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Menjalankan schema.sql untuk membuat tabel-tabel...');
    await appClient.query(schemaSql);
    console.log('[3/4] Semua tabel berhasil dibuat sesuai skema.');

    // 4. Masukkan Data Dummy Awal
    console.log('[4/4] Mengisi data awal (seeding data)...');

    // Buat hash password
    const adminHash = bcrypt.hashSync('admin123', 10);
    const petugasHash = bcrypt.hashSync('petugas123', 10);
    const dokterHash = bcrypt.hashSync('dokter123', 10);

    // a. Masukkan Pengguna (Users)
    const usersData = [
      ['Administrator Klinik', 'admin', adminHash, 'admin'],
      ['Budi Santoso (Petugas)', 'petugas', petugasHash, 'petugas'],
      ['dr. Ahmad Fauzi, Sp.PD', 'dokter', dokterHash, 'dokter'],
      ['dr. Siti Nurhaliza, Sp.A', 'drsiti', dokterHash, 'dokter']
    ];

    for (const u of usersData) {
      await appClient.query(
        'INSERT INTO users (nama, username, password_hash, role) VALUES ($1, $2, $3, $4)',
        u
      );
    }
    console.log('  - Data akun pengguna (admin, petugas, dokter) berhasil disimpan.');

    // b. Masukkan 10 Obat Fiktif (dengan beberapa stok menipis < 10)
    const obatData = [
      ['Paracetamol 500mg', 120, 'Tablet'],
      ['Amoxicillin 500mg', 85, 'Kapsul'],
      ['Ibuprofen 400mg', 60, 'Tablet'],
      ['Cetirizine 10mg', 75, 'Tablet'],
      ['Antasida Doen', 8, 'Botol'], // Stok menipis (<10)
      ['Omeprazole 20mg', 45, 'Kapsul'],
      ['Ciprofloxacin 500mg', 5, 'Strip'], // Stok menipis (<10)
      ['Metformin 500mg', 90, 'Tablet'],
      ['Amlodipine 10mg', 50, 'Tablet'],
      ['Salbutamol Sirup', 4, 'Botol'] // Stok menipis (<10)
    ];

    for (const o of obatData) {
      await appClient.query(
        'INSERT INTO obat (nama_obat, stok, satuan) VALUES ($1, $2, $3)',
        o
      );
    }
    console.log('  - 10 Data obat fiktif berhasil disimpan.');

    // c. Masukkan 10 Pasien Fiktif
    const pasienData = [
      ['RM-0001', 'Andi Pratama', '3201011205850001', '1985-05-12', 'Laki-laki', 'Jl. Kenanga No. 12, Jakarta', '081234567801'],
      ['RM-0002', 'Dewi Lestari', '3201014508900002', '1990-08-15', 'Perempuan', 'Jl. Melati No. 8, Depok', '081234567802'],
      ['RM-0003', 'Bambang Supriyadi', '3201012301780003', '1978-01-23', 'Laki-laki', 'Jl. Mawar No. 45, Bogor', '081234567803'],
      ['RM-0004', 'Rina Wulandari', '3201015609950004', '1995-09-16', 'Perempuan', 'Jl. Anggrek No. 21, Bekasi', '081234567804'],
      ['RM-0005', 'Hendra Kusuma', '3201010304880005', '1988-04-03', 'Laki-laki', 'Jl. Cempaka No. 9, Jakarta', '081234567805'],
      ['RM-0006', 'Siti Rahmawati', '3201016711920006', '1992-11-27', 'Perempuan', 'Jl. Dahlia No. 14, Tangerang', '081234567806'],
      ['RM-0007', 'Eko Prasetyo', '3201011802830007', '1983-02-18', 'Laki-laki', 'Jl. Kamboja No. 30, Depok', '081234567807'],
      ['RM-0008', 'Maya Indah Permata', '3201017006990008', '1999-06-30', 'Perempuan', 'Jl. Flamboyan No. 5, Bogor', '081234567808'],
      ['RM-0009', 'Rudi Hermawan', '3201012912750009', '1975-12-29', 'Laki-laki', 'Jl. Teratai No. 17, Jakarta', '081234567809'],
      ['RM-0010', 'Nur Aini', '3201015203980010', '1998-03-12', 'Perempuan', 'Jl. Bougenville No. 3, Tangerang', '081234567810']
    ];

    for (const p of pasienData) {
      await appClient.query(
        'INSERT INTO pasien (no_rm, nama, nik, tgl_lahir, jenis_kelamin, alamat, no_hp) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        p
      );
    }
    console.log('  - 10 Data pasien fiktif berhasil disimpan.');

    // d. Masukkan Kunjungan Contoh & Rekam Medis (Riwayat)
    // Ambil ID dokter dr. Ahmad Fauzi (id 3)
    const dokterRes = await appClient.query('SELECT id FROM users WHERE username = $1', ['dokter']);
    const dokterId = dokterRes.rows[0].id;

    // Kunjungan 1: Pasien 1 (Selesai, ada rekam medis dan resep)
    const k1 = await appClient.query(
      `INSERT INTO kunjungan (pasien_id, dokter_id, tanggal, keluhan, status)
       VALUES (1, $1, CURRENT_DATE - INTERVAL '2 days', 'Demam tinggi dan sakit kepala sejak 3 hari', 'Selesai')
       RETURNING id`,
      [dokterId]
    );
    const rm1 = await appClient.query(
      `INSERT INTO rekam_medis (kunjungan_id, tekanan_darah, suhu, berat_badan, diagnosis, tindakan, catatan)
       VALUES ($1, '120/80', 38.5, 65.0, 'Febris e.c. Susp. Infeksi Saluran Napas Atas', 'Pemberian antipiretik dan edukasi istirahat cukup', 'Kontrol jika demam > 3 hari')
       RETURNING id`,
      [k1.rows[0].id]
    );
    await appClient.query(
      `INSERT INTO resep (rekam_medis_id, obat_id, jumlah, aturan_pakai)
       VALUES ($1, 1, 10, '3 x 1 tablet sesudah makan'), ($1, 2, 10, '3 x 1 kapsul sesudah makan (habiskan)')`,
      [rm1.rows[0].id]
    );

    // Kunjungan 2: Pasien 2 (Selesai, ada rekam medis dan resep)
    const k2 = await appClient.query(
      `INSERT INTO kunjungan (pasien_id, dokter_id, tanggal, keluhan, status)
       VALUES (2, $1, CURRENT_DATE - INTERVAL '1 days', 'Nyeri lambung, mual dan perih setelah makan pedas', 'Selesai')
       RETURNING id`,
      [dokterId]
    );
    const rm2 = await appClient.query(
      `INSERT INTO rekam_medis (kunjungan_id, tekanan_darah, suhu, berat_badan, diagnosis, tindakan, catatan)
       VALUES ($1, '110/70', 36.8, 52.0, 'Dispepsia / Gastritis Akut', 'Edukasi pola makan teratur dan pantang pedas/asam', 'Hindari kopi dan makanan bersantan')
       RETURNING id`,
      [k2.rows[0].id]
    );
    await appClient.query(
      `INSERT INTO resep (rekam_medis_id, obat_id, jumlah, aturan_pakai)
       VALUES ($1, 5, 1, '3 x 1 sendok takar sebelum makan'), ($1, 6, 7, '1 x 1 kapsul pagi sebelum makan')`,
      [rm2.rows[0].id]
    );

    // Kunjungan 3: Pasien 3 (Status "Menunggu" hari ini - siap dites periksa oleh dokter)
    await appClient.query(
      `INSERT INTO kunjungan (pasien_id, dokter_id, tanggal, keluhan, status)
       VALUES (3, $1, CURRENT_DATE, 'Batuk berdahak dan pilek selama 2 hari', 'Menunggu')`,
      [dokterId]
    );

    // Kunjungan 4: Pasien 4 (Status "Diperiksa" hari ini - sedang di ruang periksa)
    await appClient.query(
      `INSERT INTO kunjungan (pasien_id, dokter_id, tanggal, keluhan, status)
       VALUES (4, $1, CURRENT_DATE, 'Pusing berputar dan tengkuk terasa berat', 'Diperiksa')`,
      [dokterId]
    );

    // Kunjungan 5: Pasien 1 (Kunjungan kedua Pasien 1 untuk membuktikan riwayat multi-kunjungan)
    await appClient.query(
      `INSERT INTO kunjungan (pasien_id, dokter_id, tanggal, keluhan, status)
       VALUES (1, $1, CURRENT_DATE, 'Kontrol ulang demam, sudah membaik namun masih lemas', 'Menunggu')`,
      [dokterId]
    );

    console.log('  - Data kunjungan awal, antrean hari ini, dan rekam medis berhasil disimpan.');
    console.log('\n=== SETUP DATABASE SELESAI DENGAN SUKSES ===');
    console.log('Akun login yang tersedia:');
    console.log('  1. Admin   : username: admin   | password: admin123');
    console.log('  2. Petugas : username: petugas | password: petugas123');
    console.log('  3. Dokter  : username: dokter  | password: dokter123');
  } catch (err) {
    console.error('[ERROR] Gagal saat mengisi skema/data awal:', err.message);
    process.exit(1);
  } finally {
    await appClient.end();
  }
}

runSetup();
