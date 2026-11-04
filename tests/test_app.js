// Script Uji Otomatis Integrasi & Persistensi Data Rekam Medis Klinik
const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../db');

const BASE_URL = 'http://localhost:3000';

// Helper HTTP Request dengan penanganan Cookies (Session)
function makeRequest(options, postData = null, cookie = '') {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(cookie ? { Cookie: cookie } : {})
      }
    };

    if (postData) {
      reqOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        const setCookie = res.headers['set-cookie'];
        let newCookie = cookie;
        if (setCookie) {
          newCookie = setCookie.map((c) => c.split(';')[0]).join('; ');
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
          cookie: newCookie
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log(' MEMULAI PENGUJIAN INTEGRASI & PERSISTENSI DATABASE');
  console.log('======================================================\n');

  try {
    // 1. Tes Akses Halaman Login
    console.log('[TEST 1] Mengakses Halaman Login (GET /auth/login)...');
    const loginPageRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/auth/login',
      method: 'GET'
    });
    console.log(`  -> Status: ${loginPageRes.statusCode} (Expected: 200)`);
    if (loginPageRes.statusCode !== 200) throw new Error('Gagal mengakses login page');

    // 2. Tes Login Petugas Pendaftaran
    console.log('\n[TEST 2] Melakukan Login sebagai Petugas (POST /auth/login)...');
    const loginPetugasPayload = 'username=petugas&password=petugas123';
    const loginPetugasRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/auth/login',
        method: 'POST'
      },
      loginPetugasPayload
    );
    console.log(`  -> Status: ${loginPetugasRes.statusCode} (Expected: 302 Redirect ke /dashboard)`);
    console.log(`  -> Session Cookie: ${loginPetugasRes.cookie.substring(0, 30)}...`);
    const petugasCookie = loginPetugasRes.cookie;

    // 3. Tes Pendaftaran Pasien Baru lewat Web (POST /pasien/tambah)
    console.log('\n[TEST 3] Mendaftarkan Pasien Baru via Web (POST /pasien/tambah)...');
    const testNik = '3201019909990099';
    const pasienPayload = new URLSearchParams({
      nama: 'Siti Aminah (Pasien Tes Web)',
      nik: testNik,
      tgl_lahir: '1996-07-20',
      jenis_kelamin: 'Perempuan',
      alamat: 'Jl. Merdeka Sejahtera No. 45, Jakarta Selatan',
      no_hp: '081299887766'
    }).toString();

    const tambahPasienRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/pasien/tambah',
        method: 'POST'
      },
      pasienPayload,
      petugasCookie
    );
    console.log(`  -> Status: ${tambahPasienRes.statusCode} (Expected: 302 Redirect ke /pasien)`);

    // 4. Verifikasi Langsung ke Database PostgreSQL untuk Pasien Baru
    console.log('\n[TEST 4] Verifikasi Data Pasien Langsung di Database PostgreSQL...');
    const dbPasienCheck = await db.query('SELECT * FROM pasien WHERE nik = $1', [testNik]);
    if (dbPasienCheck.rows.length === 0) {
      throw new Error('Data pasien TIDAK ditemukan di PostgreSQL!');
    }
    const pasienBaru = dbPasienCheck.rows[0];
    console.log('  -> [BERHASIL] Data pasien tersimpan nyata di PostgreSQL:');
    console.log(`     ID: ${pasienBaru.id} | No. RM: ${pasienBaru.no_rm} | Nama: ${pasienBaru.nama}`);
    console.log(`     NIK: ${pasienBaru.nik} | No. HP: ${pasienBaru.no_hp}`);

    // 5. Tes Pendaftaran Kunjungan Pasien (POST /kunjungan/tambah)
    console.log('\n[TEST 5] Membuat Kunjungan Baru via Web (POST /kunjungan/tambah)...');
    const dokterRes = await db.query("SELECT id, nama FROM users WHERE role = 'dokter' LIMIT 1");
    const dokterId = dokterRes.rows[0].id;
    const kunjunganPayload = new URLSearchParams({
      pasien_id: pasienBaru.id,
      dokter_id: dokterId,
      tanggal: new Date().toISOString().split('T')[0],
      keluhan: 'Nyeri tenggorokan dan batuk kering sejak 2 hari'
    }).toString();

    const tambahKunjunganRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/kunjungan/tambah',
        method: 'POST'
      },
      kunjunganPayload,
      petugasCookie
    );
    console.log(`  -> Status: ${tambahKunjunganRes.statusCode} (Expected: 302)`);

    // Verifikasi kunjungan di DB (status awal: Menunggu)
    const dbKunjunganCheck = await db.query(
      'SELECT * FROM kunjungan WHERE pasien_id = $1 ORDER BY id DESC LIMIT 1',
      [pasienBaru.id]
    );
    const kunjunganBaru = dbKunjunganCheck.rows[0];
    console.log(`  -> Kunjungan dibuat: ID ${kunjunganBaru.id}, Status: "${kunjunganBaru.status}"`);

    // 6. Login sebagai Dokter
    console.log('\n[TEST 6] Login sebagai Dokter (POST /auth/login)...');
    const loginDokterPayload = 'username=dokter&password=dokter123';
    const loginDokterRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/auth/login',
        method: 'POST'
      },
      loginDokterPayload
    );
    const dokterCookie = loginDokterRes.cookie;
    console.log(`  -> Status: ${loginDokterRes.statusCode} (Expected: 302)`);

    // 7. Dokter membuka halaman pemeriksaan (GET /pemeriksaan/:id)
    console.log(`\n[TEST 7] Dokter Membuka Form Pemeriksaan (GET /pemeriksaan/${kunjunganBaru.id})...`);
    const periksaOpenRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: `/pemeriksaan/${kunjunganBaru.id}`,
        method: 'GET'
      },
      null,
      dokterCookie
    );
    console.log(`  -> Status: ${periksaOpenRes.statusCode} (Expected: 200)`);

    // Cek perubahan status menjadi "Diperiksa" di PostgreSQL
    const dbStatusCheck1 = await db.query('SELECT status FROM kunjungan WHERE id = $1', [kunjunganBaru.id]);
    console.log(`  -> Status kunjungan otomatis terupdate di DB: "${dbStatusCheck1.rows[0].status}"`);

    // 8. Cek Stok Obat Paracetamol Sebelum Resep
    const obatSebelumRes = await db.query("SELECT id, nama_obat, stok FROM obat WHERE nama_obat ILIKE '%Paracetamol%' LIMIT 1");
    const obatPilihan = obatSebelumRes.rows[0];
    const stokAwal = obatPilihan.stok;
    console.log(`\n[TEST 8] Stok awal "${obatPilihan.nama_obat}": ${stokAwal}`);

    // 9. Dokter Mengisi Pemeriksaan & Resep (POST /pemeriksaan/:id) - TRANSAKSI ATOMIK
    console.log(`\n[TEST 9] Simpan Pemeriksaan & Resep (POST /pemeriksaan/${kunjunganBaru.id})...`);
    const jumlahResep = 5;
    const pemeriksaanPayload = new URLSearchParams();
    pemeriksaanPayload.append('tekanan_darah', '115/75');
    pemeriksaanPayload.append('suhu', '37.2');
    pemeriksaanPayload.append('berat_badan', '55.0');
    pemeriksaanPayload.append('diagnosis', 'Faringitis Akut Non-Spesifik');
    pemeriksaanPayload.append('tindakan', 'Pemberian analgetik-antipiretik dan edukasi banyak minum air hangat');
    pemeriksaanPayload.append('catatan', 'Hindari minuman dingin dan gorengan selama 3 hari');
    pemeriksaanPayload.append('obat_id[]', obatPilihan.id.toString());
    pemeriksaanPayload.append('jumlah[]', jumlahResep.toString());
    pemeriksaanPayload.append('aturan_pakai[]', '3 x 1 tablet sesudah makan');

    const simpanPemeriksaanRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: `/pemeriksaan/${kunjunganBaru.id}`,
        method: 'POST'
      },
      pemeriksaanPayload.toString(),
      dokterCookie
    );
    console.log(`  -> Status: ${simpanPemeriksaanRes.statusCode} (Expected: 302)`);

    // 10. Verifikasi Transaksi di PostgreSQL: Status 'Selesai', Rekam Medis, Resep, dan Pengurangan Stok
    console.log('\n[TEST 10] Verifikasi Hasil Transaksi Database PostgreSQL:');
    
    // a. Status Kunjungan
    const dbKunjunganAkhir = await db.query('SELECT status FROM kunjungan WHERE id = $1', [kunjunganBaru.id]);
    console.log(`  a. Status Kunjungan di DB: "${dbKunjunganAkhir.rows[0].status}" (Expected: Selesai)`);

    // b. Tabel Rekam Medis
    const dbRmCheck = await db.query('SELECT * FROM rekam_medis WHERE kunjungan_id = $1', [kunjunganBaru.id]);
    const rmTersimpan = dbRmCheck.rows[0];
    console.log(`  b. Rekam Medis Tersimpan: TD=${rmTersimpan.tekanan_darah}, Suhu=${rmTersimpan.suhu}°C, Diagnosis="${rmTersimpan.diagnosis}"`);

    // c. Tabel Resep
    const dbResepCheck = await db.query('SELECT * FROM resep WHERE rekam_medis_id = $1', [rmTersimpan.id]);
    const resepTersimpan = dbResepCheck.rows[0];
    console.log(`  c. Resep Obat Tersimpan: Obat ID=${resepTersimpan.obat_id}, Jumlah=${resepTersimpan.jumlah}, Aturan="${resepTersimpan.aturan_pakai}"`);

    // d. Pemotongan Stok Obat
    const obatSetelahRes = await db.query('SELECT stok FROM obat WHERE id = $1', [obatPilihan.id]);
    const stokAkhir = obatSetelahRes.rows[0].stok;
    console.log(`  d. Stok Obat "${obatPilihan.nama_obat}": ${stokAwal} -> ${stokAkhir} (Berkurang ${stokAwal - stokAkhir}, Expected: Berkurang ${jumlahResep})`);
    if (stokAkhir !== stokAwal - jumlahResep) {
      throw new Error('Stok obat tidak berkurang dengan benar!');
    }

    // 11. Pengujian Otorisasi / Role-Based Access Control (RBAC)
    console.log('\n[TEST 11] Pengujian Keamanan Hak Akses (RBAC):');
    const illegalAccessRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/user',
        method: 'GET'
      },
      null,
      petugasCookie
    );
    console.log(`  -> Petugas mengakses /user: Status HTTP ${illegalAccessRes.statusCode} (Expected: 403 Akses Ditolak)`);
    if (illegalAccessRes.statusCode !== 403) {
      throw new Error('Keamanan RBAC gagal! Pengguna non-admin dapat membuka menu admin.');
    }

    console.log('\n======================================================');
    console.log(' SEMUA PENGUJIAN INTEGRASI & TRANSAKSI DATABASE SUKSES!');
    console.log('======================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('\n[GAGAL PENGUJIAN]', err.message);
    console.error(err);
    process.exit(1);
  }
}

runTests();
