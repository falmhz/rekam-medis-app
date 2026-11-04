// Router Autentikasi (Login & Logout)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// Halaman form login
router.get('/login', (req, res) => {
  // Jika sudah login, langsung alihkan ke dashboard
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login', {
    title: 'Masuk ke Sistem Rekam Medis'
  });
});

// Proses autentikasi login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    req.session.flash = {
      type: 'danger',
      message: 'Nama pengguna dan kata sandi wajib diisi.'
    };
    return res.redirect('/auth/login');
  }

  try {
    // Cari user berdasarkan username (parameterized query)
    const result = await db.query(
      'SELECT id, nama, username, password_hash, role FROM users WHERE username = $1',
      [username.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      req.session.flash = {
        type: 'danger',
        message: 'Nama pengguna atau kata sandi tidak cocok.'
      };
      return res.redirect('/auth/login');
    }

    const user = result.rows[0];

    // Verifikasi kata sandi dengan bcryptjs
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      req.session.flash = {
        type: 'danger',
        message: 'Nama pengguna atau kata sandi tidak cocok.'
      };
      return res.redirect('/auth/login');
    }

    // Simpan data login ke session (kecuali password_hash)
    req.session.user = {
      id: user.id,
      nama: user.nama,
      username: user.username,
      role: user.role
    };

    req.session.flash = {
      type: 'success',
      message: `Selamat datang, ${user.nama}! Anda masuk sebagai ${user.role}.`
    };

    return res.redirect('/dashboard');
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    req.session.flash = {
      type: 'danger',
      message: 'Terjadi kesalahan sistem saat memproses login. Silakan coba lagi.'
    };
    return res.redirect('/auth/login');
  }
});

// Proses logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('[LOGOUT ERROR]', err);
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;
