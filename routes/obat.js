// Router Manajemen Data Obat (Khusus Role Admin)
const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

// Semua rute di file ini mewajibkan peran 'admin'
router.use(requireAuth, requireRole('admin'));

// 1. Daftar Obat (Tandai stok menipis < 10)
router.get('/', async (req, res) => {
  const search = req.query.q ? req.query.q.trim() : '';

  try {
    let queryText = 'SELECT * FROM obat';
    let params = [];

    if (search) {
      queryText += ' WHERE nama_obat ILIKE $1';
      params.push(`%${search}%`);
    }

    // Urutan: stok menipis (<10) diprioritaskan di atas, lalu abjad nama_obat
    queryText += `
      ORDER BY 
        CASE WHEN stok < 10 THEN 0 ELSE 1 END,
        nama_obat ASC
    `;

    const result = await db.query(queryText, params);

    res.render('obat/index', {
      title: 'Manajemen Data Obat',
      obatList: result.rows,
      searchQuery: search
    });
  } catch (err) {
    console.error('[OBAT INDEX ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal memuat data obat: ' + err.message };
    res.render('obat/index', {
      title: 'Manajemen Data Obat',
      obatList: [],
      searchQuery: search
    });
  }
});

// 2. Form Tambah Obat
router.get('/tambah', (req, res) => {
  res.render('obat/form', {
    title: 'Tambah Data Obat Baru',
    obat: { nama_obat: '', stok: 0, satuan: 'Tablet' },
    isEdit: false
  });
});

// 3. Simpan Obat Baru
router.post('/tambah', async (req, res) => {
  const { nama_obat, stok, satuan } = req.body;

  if (!nama_obat || stok === undefined || !satuan) {
    req.session.flash = { type: 'danger', message: 'Semua kolom obat wajib diisi.' };
    return res.redirect('/obat/tambah');
  }

  const stokNum = parseInt(stok, 10);
  if (isNaN(stokNum) || stokNum < 0) {
    req.session.flash = { type: 'danger', message: 'Jumlah stok harus berupa angka >= 0.' };
    return res.redirect('/obat/tambah');
  }

  try {
    await db.query(
      'INSERT INTO obat (nama_obat, stok, satuan) VALUES ($1, $2, $3)',
      [nama_obat.trim(), stokNum, satuan.trim()]
    );
    req.session.flash = { type: 'success', message: `Obat "${nama_obat}" berhasil ditambahkan.` };
    res.redirect('/obat');
  } catch (err) {
    console.error('[OBAT TAMBAH ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal menyimpan obat: ' + err.message };
    res.redirect('/obat/tambah');
  }
});

// 4. Form Edit Obat
router.get('/:id/edit', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM obat WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      req.session.flash = { type: 'danger', message: 'Data obat tidak ditemukan.' };
      return res.redirect('/obat');
    }

    res.render('obat/form', {
      title: 'Ubah Data Obat',
      obat: result.rows[0],
      isEdit: true
    });
  } catch (err) {
    console.error('[OBAT EDIT FORM ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal memuat data obat: ' + err.message };
    res.redirect('/obat');
  }
});

// 5. Simpan Perubahan Obat
router.post('/:id/edit', async (req, res) => {
  const obatId = req.params.id;
  const { nama_obat, stok, satuan } = req.body;

  if (!nama_obat || stok === undefined || !satuan) {
    req.session.flash = { type: 'danger', message: 'Semua kolom obat wajib diisi.' };
    return res.redirect(`/obat/${obatId}/edit`);
  }

  const stokNum = parseInt(stok, 10);
  if (isNaN(stokNum) || stokNum < 0) {
    req.session.flash = { type: 'danger', message: 'Jumlah stok harus berupa angka >= 0.' };
    return res.redirect(`/obat/${obatId}/edit`);
  }

  try {
    await db.query(
      'UPDATE obat SET nama_obat = $1, stok = $2, satuan = $3 WHERE id = $4',
      [nama_obat.trim(), stokNum, satuan.trim(), obatId]
    );
    req.session.flash = { type: 'success', message: `Data obat "${nama_obat}" berhasil diperbarui.` };
    res.redirect('/obat');
  } catch (err) {
    console.error('[OBAT EDIT ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal memperbarui obat: ' + err.message };
    res.redirect(`/obat/${obatId}/edit`);
  }
});

// 6. Hapus Data Obat
router.post('/:id/hapus', async (req, res) => {
  const obatId = req.params.id;

  try {
    // Cek apakah obat sudah pernah digunakan dalam resep
    const checkResep = await db.query('SELECT id FROM resep WHERE obat_id = $1 LIMIT 1', [obatId]);
    if (checkResep.rows.length > 0) {
      req.session.flash = {
        type: 'danger',
        message: 'Obat ini tidak dapat dihapus karena sudah tercatat dalam riwayat resep pasien. Anda dapat mengubah stoknya menjadi 0 jika obat sudah tidak aktif.'
      };
      return res.redirect('/obat');
    }

    const result = await db.query('DELETE FROM obat WHERE id = $1 RETURNING nama_obat', [obatId]);
    if (result.rows.length > 0) {
      req.session.flash = { type: 'success', message: `Obat "${result.rows[0].nama_obat}" berhasil dihapus.` };
    } else {
      req.session.flash = { type: 'warning', message: 'Data obat tidak ditemukan.' };
    }
  } catch (err) {
    console.error('[OBAT HAPUS ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal menghapus obat: ' + err.message };
  }
  res.redirect('/obat');
});

module.exports = router;
