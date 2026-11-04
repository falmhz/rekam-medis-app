// Router Manajemen Kunjungan & Antrean Pasien
const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

// 1. Daftar Antrean Kunjungan (Bisa filter status & tanggal)
router.get('/', requireAuth, async (req, res) => {
  const statusFilter = req.query.status || 'Semua';
  const tanggalFilter = req.query.tanggal || ''; // Format YYYY-MM-DD
  const userRole = req.session.user.role;
  const userId = req.session.user.id;

  try {
    let queryText = `
      SELECT 
        k.id,
        k.tanggal,
        k.keluhan,
        k.status,
        k.created_at,
        p.id AS pasien_id,
        p.no_rm,
        p.nama AS nama_pasien,
        p.jenis_kelamin,
        p.tgl_lahir,
        u.id AS dokter_id,
        u.nama AS nama_dokter
      FROM kunjungan k
      JOIN pasien p ON k.pasien_id = p.id
      JOIN users u ON k.dokter_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Filter status jika bukan 'Semua'
    if (statusFilter && statusFilter !== 'Semua') {
      queryText += ` AND k.status = $${paramIndex}`;
      params.push(statusFilter);
      paramIndex++;
    }

    // Filter tanggal jika dipilih
    if (tanggalFilter) {
      queryText += ` AND k.tanggal = $${paramIndex}`;
      params.push(tanggalFilter);
      paramIndex++;
    }

    // Jika dokter yang login ingin melihat hanya pasien miliknya (atau default untuk dokter)
    const dokterFilter = req.query.milik_saya === '1' || (userRole === 'dokter' && req.query.milik_saya !== '0');
    if (dokterFilter && userRole === 'dokter') {
      queryText += ` AND k.dokter_id = $${paramIndex}`;
      params.push(userId);
      paramIndex++;
    }

    // Urutan: Menunggu dan Diperiksa prioritas di atas, lalu urut waktu
    queryText += `
      ORDER BY 
        CASE 
          WHEN k.status = 'Diperiksa' THEN 1
          WHEN k.status = 'Menunggu' THEN 2
          ELSE 3
        END,
        k.tanggal DESC,
        k.id ASC
    `;

    const result = await db.query(queryText, params);

    res.render('kunjungan/index', {
      title: 'Antrean Kunjungan Pasien',
      kunjunganList: result.rows,
      statusFilter,
      tanggalFilter,
      dokterFilter: dokterFilter ? '1' : '0'
    });
  } catch (err) {
    console.error('[KUNJUNGAN INDEX ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal memuat antrean: ' + err.message };
    res.render('kunjungan/index', {
      title: 'Antrean Kunjungan Pasien',
      kunjunganList: [],
      statusFilter,
      tanggalFilter,
      dokterFilter: '0'
    });
  }
});

// 2. Form Pendaftaran Kunjungan Baru (Petugas dan Admin)
router.get('/tambah', requireAuth, requireRole('petugas', 'admin'), async (req, res) => {
  const selectedPasienId = req.query.pasien_id || null;

  try {
    // Ambil daftar pasien untuk dropdown/pilihan
    const pasienRes = await db.query('SELECT id, no_rm, nama FROM pasien ORDER BY nama ASC');
    // Ambil daftar dokter yang aktif
    const dokterRes = await db.query("SELECT id, nama FROM users WHERE role = 'dokter' ORDER BY nama ASC");

    if (dokterRes.rows.length === 0) {
      req.session.flash = {
        type: 'warning',
        message: 'Belum ada data dokter yang terdaftar. Harap hubungi Admin.'
      };
    }

    res.render('kunjungan/form', {
      title: 'Pendaftaran Kunjungan Pasien',
      pasienList: pasienRes.rows,
      dokterList: dokterRes.rows,
      selectedPasienId: selectedPasienId ? parseInt(selectedPasienId, 10) : null,
      today: new Date().toISOString().split('T')[0]
    });
  } catch (err) {
    console.error('[KUNJUNGAN FORM ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal memuat form kunjungan: ' + err.message };
    res.redirect('/kunjungan');
  }
});

// 3. Simpan Kunjungan Baru (Petugas dan Admin)
router.post('/tambah', requireAuth, requireRole('petugas', 'admin'), async (req, res) => {
  const { pasien_id, dokter_id, tanggal, keluhan } = req.body;

  if (!pasien_id || !dokter_id || !tanggal || !keluhan) {
    req.session.flash = {
      type: 'danger',
      message: 'Semua kolom formulir kunjungan wajib diisi.'
    };
    return res.redirect('/kunjungan/tambah');
  }

  try {
    await db.query(
      `INSERT INTO kunjungan (pasien_id, dokter_id, tanggal, keluhan, status)
       VALUES ($1, $2, $3, $4, 'Menunggu')`,
      [pasien_id, dokter_id, tanggal, keluhan.trim()]
    );

    req.session.flash = {
      type: 'success',
      message: 'Kunjungan berhasil didaftarkan dan masuk ke antrean dokter.'
    };
    res.redirect('/kunjungan');
  } catch (err) {
    console.error('[KUNJUNGAN TAMBAH ERROR]', err);
    req.session.flash = {
      type: 'danger',
      message: 'Gagal mendaftarkan kunjungan: ' + err.message
    };
    res.redirect('/kunjungan/tambah');
  }
});

// 4. Batalkan / Hapus Kunjungan
router.post('/:id/hapus', requireAuth, requireRole('petugas', 'admin'), async (req, res) => {
  const kunjunganId = req.params.id;
  try {
    await db.query('DELETE FROM kunjungan WHERE id = $1', [kunjunganId]);
    req.session.flash = {
      type: 'success',
      message: 'Data kunjungan berhasil dihapus dari antrean.'
    };
  } catch (err) {
    console.error('[KUNJUNGAN HAPUS ERROR]', err);
    req.session.flash = {
      type: 'danger',
      message: 'Gagal menghapus kunjungan: ' + err.message
    };
  }
  res.redirect('/kunjungan');
});

module.exports = router;
