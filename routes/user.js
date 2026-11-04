// Router Manajemen Pengguna (Khusus Role Admin)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

// Hanya admin yang dapat mengakses rute manajemen pengguna
router.use(requireAuth, requireRole('admin'));

// 1. Daftar Pengguna
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, nama, username, role, created_at FROM users ORDER BY id ASC'
    );
    res.render('user/index', {
      title: 'Manajemen Akun Pengguna',
      userList: result.rows
    });
  } catch (err) {
    console.error('[USER INDEX ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal memuat daftar pengguna: ' + err.message };
    res.render('user/index', {
      title: 'Manajemen Akun Pengguna',
      userList: []
    });
  }
});

// 2. Form Tambah Pengguna Baru
router.get('/tambah', (req, res) => {
  res.render('user/form', {
    title: 'Tambah Pengguna Baru',
    userItem: { nama: '', username: '', role: 'petugas' },
    isEdit: false
  });
});

// 3. Simpan Pengguna Baru
router.post('/tambah', async (req, res) => {
  const { nama, username, password, role } = req.body;

  if (!nama || !username || !password || !role) {
    req.session.flash = { type: 'danger', message: 'Semua kolom wajib diisi.' };
    return res.redirect('/user/tambah');
  }

  if (password.length < 6) {
    req.session.flash = { type: 'danger', message: 'Kata sandi minimal 6 karakter.' };
    return res.redirect('/user/tambah');
  }

  const cleanUsername = username.trim().toLowerCase();

  try {
    // Cek username unik
    const checkUser = await db.query('SELECT id FROM users WHERE username = $1', [cleanUsername]);
    if (checkUser.rows.length > 0) {
      req.session.flash = { type: 'danger', message: 'Username sudah digunakan, pilih username lain.' };
      return res.redirect('/user/tambah');
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await db.query(
      'INSERT INTO users (nama, username, password_hash, role) VALUES ($1, $2, $3, $4)',
      [nama.trim(), cleanUsername, passwordHash, role]
    );

    req.session.flash = {
      type: 'success',
      message: `Pengguna "${nama}" dengan role ${role} berhasil didaftarkan.`
    };
    res.redirect('/user');
  } catch (err) {
    console.error('[USER TAMBAH ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal mendaftarkan pengguna: ' + err.message };
    res.redirect('/user/tambah');
  }
});

// 4. Form Edit Pengguna
router.get('/:id/edit', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, nama, username, role FROM users WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      req.session.flash = { type: 'danger', message: 'Pengguna tidak ditemukan.' };
      return res.redirect('/user');
    }

    res.render('user/form', {
      title: 'Ubah Data Pengguna',
      userItem: result.rows[0],
      isEdit: true
    });
  } catch (err) {
    console.error('[USER EDIT FORM ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal memuat data pengguna: ' + err.message };
    res.redirect('/user');
  }
});

// 5. Simpan Perubahan Pengguna
router.post('/:id/edit', async (req, res) => {
  const userId = req.params.id;
  const { nama, role } = req.body;

  if (!nama || !role) {
    req.session.flash = { type: 'danger', message: 'Nama dan role wajib diisi.' };
    return res.redirect(`/user/${userId}/edit`);
  }

  try {
    // Cegah admin mengubah rolenya sendiri menjadi bukan admin
    if (parseInt(userId, 10) === req.session.user.id && role !== 'admin') {
      req.session.flash = {
        type: 'danger',
        message: 'Anda tidak dapat mengubah role akun Anda sendiri yang sedang aktif.'
      };
      return res.redirect(`/user/${userId}/edit`);
    }

    await db.query(
      'UPDATE users SET nama = $1, role = $2 WHERE id = $3',
      [nama.trim(), role, userId]
    );

    // Update nama di session jika mengedit akun sendiri
    if (parseInt(userId, 10) === req.session.user.id) {
      req.session.user.nama = nama.trim();
    }

    req.session.flash = { type: 'success', message: 'Data pengguna berhasil diperbarui.' };
    res.redirect('/user');
  } catch (err) {
    console.error('[USER EDIT ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal mengubah data pengguna: ' + err.message };
    res.redirect(`/user/${userId}/edit`);
  }
});

// 6. Reset Password Pengguna
router.post('/:id/reset-password', async (req, res) => {
  const userId = req.params.id;
  const { new_password } = req.body;

  if (!new_password || new_password.length < 6) {
    req.session.flash = {
      type: 'danger',
      message: 'Kata sandi baru minimal harus 6 karakter.'
    };
    return res.redirect('/user');
  }

  try {
    const passwordHash = bcrypt.hashSync(new_password, 10);
    const result = await db.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING nama',
      [passwordHash, userId]
    );

    if (result.rows.length > 0) {
      req.session.flash = {
        type: 'success',
        message: `Kata sandi untuk "${result.rows[0].nama}" berhasil direset.`
      };
    } else {
      req.session.flash = { type: 'warning', message: 'Pengguna tidak ditemukan.' };
    }
  } catch (err) {
    console.error('[USER RESET PASSWORD ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal mereset kata sandi: ' + err.message };
  }
  res.redirect('/user');
});

// 7. Hapus Pengguna
router.post('/:id/hapus', async (req, res) => {
  const userId = req.params.id;

  // Cegah menghapus akun sendiri yang sedang aktif
  if (parseInt(userId, 10) === req.session.user.id) {
    req.session.flash = {
      type: 'danger',
      message: 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.'
    };
    return res.redirect('/user');
  }

  try {
    // Cek apakah dokter terkait dengan data kunjungan
    const checkKunjungan = await db.query('SELECT id FROM kunjungan WHERE dokter_id = $1 LIMIT 1', [userId]);
    if (checkKunjungan.rows.length > 0) {
      req.session.flash = {
        type: 'danger',
        message: 'Akun dokter ini tidak dapat dihapus karena sudah memiliki riwayat kunjungan pasien.'
      };
      return res.redirect('/user');
    }

    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING nama', [userId]);
    if (result.rows.length > 0) {
      req.session.flash = {
        type: 'success',
        message: `Akun "${result.rows[0].nama}" berhasil dihapus.`
      };
    } else {
      req.session.flash = { type: 'warning', message: 'Pengguna tidak ditemukan.' };
    }
  } catch (err) {
    console.error('[USER HAPUS ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal menghapus pengguna: ' + err.message };
  }
  res.redirect('/user');
});

module.exports = router;
