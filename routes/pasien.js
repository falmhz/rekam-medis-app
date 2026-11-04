// Router Manajemen Pasien
const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

// Helper untuk menghasilkan Nomor Rekam Medis otomatis (RM-0001, RM-0002, dst)
async function generateNoRm() {
  const result = await db.query(
    "SELECT no_rm FROM pasien WHERE no_rm ~ '^RM-[0-9]+$' ORDER BY id DESC LIMIT 1"
  );
  let nextNumber = 1;
  if (result.rows.length > 0) {
    const parts = result.rows[0].no_rm.split('-');
    if (parts.length === 2 && !isNaN(parts[1])) {
      nextNumber = parseInt(parts[1], 10) + 1;
    }
  }
  return `RM-${String(nextNumber).padStart(4, '0')}`;
}

// 1. Daftar Pasien + Pencarian (bisa diakses admin, petugas, dokter)
router.get('/', requireAuth, async (req, res) => {
  const search = req.query.q ? req.query.q.trim() : '';
  try {
    let queryText = 'SELECT * FROM pasien';
    let params = [];

    if (search) {
      queryText += ' WHERE nama ILIKE $1 OR no_rm ILIKE $1 OR nik ILIKE $1';
      params.push(`%${search}%`);
    }

    queryText += ' ORDER BY id DESC';

    const result = await db.query(queryText, params);

    res.render('pasien/index', {
      title: 'Data Pasien',
      pasienList: result.rows,
      searchQuery: search
    });
  } catch (err) {
    console.error('[PASIEN INDEX ERROR]', err);
    req.session.flash = {
      type: 'danger',
      message: 'Gagal memuat data pasien: ' + err.message
    };
    res.render('pasien/index', {
      title: 'Data Pasien',
      pasienList: [],
      searchQuery: search
    });
  }
});

// 2. Form Tambah Pasien (Petugas dan Admin)
router.get('/tambah', requireAuth, requireRole('petugas', 'admin'), async (req, res) => {
  try {
    const autoNoRm = await generateNoRm();
    res.render('pasien/form', {
      title: 'Pendaftaran Pasien Baru',
      pasien: {
        no_rm: autoNoRm,
        nama: '',
        nik: '',
        tgl_lahir: '',
        jenis_kelamin: 'Laki-laki',
        alamat: '',
        no_hp: ''
      },
      isEdit: false
    });
  } catch (err) {
    console.error('[PASIEN FORM ERROR]', err);
    req.session.flash = {
      type: 'danger',
      message: 'Gagal membuat nomor rekam medis otomatis: ' + err.message
    };
    res.redirect('/pasien');
  }
});

// 3. Simpan Pasien Baru (Petugas dan Admin)
router.post('/tambah', requireAuth, requireRole('petugas', 'admin'), async (req, res) => {
  const { nama, nik, tgl_lahir, jenis_kelamin, alamat, no_hp } = req.body;

  // Validasi di sisi server
  if (!nama || !nik || !tgl_lahir || !jenis_kelamin || !alamat || !no_hp) {
    req.session.flash = {
      type: 'danger',
      message: 'Semua kolom wajib diisi dengan benar.'
    };
    return res.redirect('/pasien/tambah');
  }

  // Validasi format NIK 16 digit angka
  if (!/^\d{16}$/.test(nik)) {
    req.session.flash = {
      type: 'danger',
      message: 'NIK harus tepat 16 digit angka.'
    };
    return res.redirect('/pasien/tambah');
  }

  try {
    // Cek apakah NIK sudah digunakan
    const checkNik = await db.query('SELECT id FROM pasien WHERE nik = $1', [nik]);
    if (checkNik.rows.length > 0) {
      req.session.flash = {
        type: 'danger',
        message: 'NIK sudah terdaftar dalam sistem.'
      };
      return res.redirect('/pasien/tambah');
    }

    // Generate no_rm terbaru
    const no_rm = await generateNoRm();

    await db.query(
      `INSERT INTO pasien (no_rm, nama, nik, tgl_lahir, jenis_kelamin, alamat, no_hp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [no_rm, nama.trim(), nik.trim(), tgl_lahir, jenis_kelamin, alamat.trim(), no_hp.trim()]
    );

    req.session.flash = {
      type: 'success',
      message: `Pasien ${nama} berhasil didaftarkan dengan No. RM: ${no_rm}`
    };
    return res.redirect('/pasien');
  } catch (err) {
    console.error('[PASIEN TAMBAH ERROR]', err);
    req.session.flash = {
      type: 'danger',
      message: 'Gagal menyimpan pasien: ' + err.message
    };
    return res.redirect('/pasien/tambah');
  }
});

// 4. Detail Pasien & Riwayat Rekam Medis (Bisa diakses semua role)
router.get('/:id', requireAuth, async (req, res) => {
  const pasienId = req.params.id;

  try {
    // Ambil data pasien
    const pasienResult = await db.query('SELECT * FROM pasien WHERE id = $1', [pasienId]);
    if (pasienResult.rows.length === 0) {
      req.session.flash = { type: 'danger', message: 'Data pasien tidak ditemukan.' };
      return res.redirect('/pasien');
    }
    const pasien = pasienResult.rows[0];

    // Ambil riwayat kunjungan dan rekam medis (urut dari terbaru)
    const riwayatResult = await db.query(
      `SELECT 
         k.id AS kunjungan_id,
         k.tanggal,
         k.keluhan,
         k.status,
         u.nama AS nama_dokter,
         rm.id AS rekam_medis_id,
         rm.tekanan_darah,
         rm.suhu,
         rm.berat_badan,
         rm.diagnosis,
         rm.tindakan,
         rm.catatan
       FROM kunjungan k
       LEFT JOIN users u ON k.dokter_id = u.id
       LEFT JOIN rekam_medis rm ON k.id = rm.kunjungan_id
       WHERE k.pasien_id = $1
       ORDER BY k.tanggal DESC, k.id DESC`,
      [pasienId]
    );

    // Ambil resep obat untuk tiap rekam medis
    const riwayat = [];
    for (const item of riwayatResult.rows) {
      let resepList = [];
      if (item.rekam_medis_id) {
        const resepRes = await db.query(
          `SELECT r.jumlah, r.aturan_pakai, o.nama_obat, o.satuan
           FROM resep r
           JOIN obat o ON r.obat_id = o.id
           WHERE r.rekam_medis_id = $1`,
          [item.rekam_medis_id]
        );
        resepList = resepRes.rows;
      }
      riwayat.push({
        ...item,
        resep: resepList
      });
    }

    res.render('pasien/detail', {
      title: `Detail Pasien - ${pasien.nama} (${pasien.no_rm})`,
      pasien,
      riwayat
    });
  } catch (err) {
    console.error('[PASIEN DETAIL ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Terjadi kesalahan: ' + err.message };
    res.redirect('/pasien');
  }
});

// 5. Form Edit Pasien (Petugas dan Admin)
router.get('/:id/edit', requireAuth, requireRole('petugas', 'admin'), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pasien WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      req.session.flash = { type: 'danger', message: 'Data pasien tidak ditemukan.' };
      return res.redirect('/pasien');
    }

    // Format tanggal lahir agar sesuai input date (YYYY-MM-DD)
    const pasien = result.rows[0];
    if (pasien.tgl_lahir instanceof Date) {
      pasien.tgl_lahir = pasien.tgl_lahir.toISOString().split('T')[0];
    }

    res.render('pasien/form', {
      title: 'Ubah Data Pasien',
      pasien,
      isEdit: true
    });
  } catch (err) {
    console.error('[PASIEN EDIT FORM ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal memuat form edit: ' + err.message };
    res.redirect('/pasien');
  }
});

// 6. Simpan Perubahan Data Pasien (Petugas dan Admin)
router.post('/:id/edit', requireAuth, requireRole('petugas', 'admin'), async (req, res) => {
  const pasienId = req.params.id;
  const { nama, nik, tgl_lahir, jenis_kelamin, alamat, no_hp } = req.body;

  if (!nama || !nik || !tgl_lahir || !jenis_kelamin || !alamat || !no_hp) {
    req.session.flash = { type: 'danger', message: 'Semua kolom wajib diisi.' };
    return res.redirect(`/pasien/${pasienId}/edit`);
  }

  if (!/^\d{16}$/.test(nik)) {
    req.session.flash = { type: 'danger', message: 'NIK harus tepat 16 digit angka.' };
    return res.redirect(`/pasien/${pasienId}/edit`);
  }

  try {
    // Cek duplikasi NIK pada pasien lain
    const checkNik = await db.query(
      'SELECT id FROM pasien WHERE nik = $1 AND id <> $2',
      [nik, pasienId]
    );
    if (checkNik.rows.length > 0) {
      req.session.flash = { type: 'danger', message: 'NIK sudah digunakan oleh pasien lain.' };
      return res.redirect(`/pasien/${pasienId}/edit`);
    }

    await db.query(
      `UPDATE pasien 
       SET nama = $1, nik = $2, tgl_lahir = $3, jenis_kelamin = $4, alamat = $5, no_hp = $6 
       WHERE id = $7`,
      [nama.trim(), nik.trim(), tgl_lahir, jenis_kelamin, alamat.trim(), no_hp.trim(), pasienId]
    );

    req.session.flash = { type: 'success', message: 'Data pasien berhasil diperbarui.' };
    res.redirect(`/pasien/${pasienId}`);
  } catch (err) {
    console.error('[PASIEN EDIT ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal memperbarui data: ' + err.message };
    res.redirect(`/pasien/${pasienId}/edit`);
  }
});

// 7. Hapus Pasien (Petugas dan Admin)
router.post('/:id/hapus', requireAuth, requireRole('petugas', 'admin'), async (req, res) => {
  const pasienId = req.params.id;
  try {
    const result = await db.query('DELETE FROM pasien WHERE id = $1 RETURNING nama', [pasienId]);
    if (result.rows.length > 0) {
      req.session.flash = {
        type: 'success',
        message: `Pasien ${result.rows[0].nama} dan seluruh riwayatnya berhasil dihapus.`
      };
    } else {
      req.session.flash = { type: 'warning', message: 'Pasien tidak ditemukan.' };
    }
  } catch (err) {
    console.error('[PASIEN HAPUS ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal menghapus pasien: ' + err.message };
  }
  res.redirect('/pasien');
});

module.exports = router;
