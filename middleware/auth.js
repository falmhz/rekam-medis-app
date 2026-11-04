// Middleware Autentikasi dan Otorisasi Berdasarkan Role

// Cek apakah pengguna sudah login
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.session.flash = {
      type: 'warning',
      message: 'Silakan masuk (login) terlebih dahulu untuk mengakses halaman tersebut.'
    };
    return res.redirect('/auth/login');
  }
  next();
};

// Cek hak akses peran (Role-Based Access Control)
// Contoh penggunaan: requireRole('admin') atau requireRole('dokter', 'petugas')
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.session.flash = {
        type: 'warning',
        message: 'Silakan masuk terlebih dahulu.'
      };
      return res.redirect('/auth/login');
    }

    const userRole = req.session.user.role;
    if (!allowedRoles.includes(userRole)) {
      // Tampilkan halaman Akses Ditolak (HTTP 403)
      return res.status(403).render('error/403', {
        title: 'Akses Ditolak',
        message: `Peran Anda (${userRole}) tidak memiliki izin untuk membuka halaman ini.`
      });
    }

    next();
  };
};

module.exports = {
  requireAuth,
  requireRole
};
