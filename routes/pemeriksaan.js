// Router Pemeriksaan Dokter & Input Resep Obat
const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

// 1. Antrean Pemeriksaan Dokter yang Login
router.get('/', requireAuth, requireRole('dokter'), async (req, res) => {
  const dokterId = req.session.user.id;

  try {
    const result = await db.query(
      `SELECT 
         k.id,
         k.tanggal,
         k.keluhan,
         k.status,
         k.created_at,
         p.id AS pasien_id,
         p.no_rm,
         p.nama AS nama_pasien,
         p.jenis_kelamin,
         p.tgl_lahir
       FROM kunjungan k
       JOIN pasien p ON k.pasien_id = p.id
       WHERE k.dokter_id = $1 AND k.status IN ('Menunggu', 'Diperiksa')
       ORDER BY 
         CASE WHEN k.status = 'Diperiksa' THEN 1 ELSE 2 END,
         k.id ASC`,
      [dokterId]
    );

    res.render('pemeriksaan/index', {
      title: 'Antrean Pemeriksaan Pasien',
      antreanList: result.rows
    });
  } catch (err) {
    console.error('[PEMERIKSAAN ANTRIAN ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal memuat antrean dokter: ' + err.message };
    res.render('pemeriksaan/index', {
      title: 'Antrean Pemeriksaan Pasien',
      antreanList: []
    });
  }
});

// 2. Form Pemeriksaan Pasien (Dokter Membuka Kunjungan)
router.get('/:kunjungan_id', requireAuth, requireRole('dokter'), async (req, res) => {
  const { kunjungan_id } = req.params;
  const dokterId = req.session.user.id;

  try {
    // Ambil data kunjungan dan pasien
    const kunjunganRes = await db.query(
      `SELECT 
         k.id AS kunjungan_id,
         k.tanggal,
         k.keluhan,
         k.status,
         k.dokter_id,
         p.id AS pasien_id,
         p.no_rm,
         p.nama AS nama_pasien,
         p.nik,
         p.tgl_lahir,
         p.jenis_kelamin,
         p.alamat,
         p.no_hp
       FROM kunjungan k
       JOIN pasien p ON k.pasien_id = p.id
       WHERE k.id = $1`,
      [kunjungan_id]
    );

    if (kunjunganRes.rows.length === 0) {
      req.session.flash = { type: 'danger', message: 'Data kunjungan tidak ditemukan.' };
      return res.redirect('/pemeriksaan');
    }

    const kunjungan = kunjunganRes.rows[0];

    // Jika kunjungan berstatus "Menunggu", ubah status menjadi "Diperiksa" saat dokter membuka form
    if (kunjungan.status === 'Menunggu') {
      await db.query("UPDATE kunjungan SET status = 'Diperiksa' WHERE id = $1", [kunjungan_id]);
      kunjungan.status = 'Diperiksa';
    }

    // Ambil riwayat rekam medis terdahulu milik pasien ini (untuk referensi dokter)
    const riwayatRes = await db.query(
      `SELECT 
         k.tanggal,
         k.keluhan,
         rm.tekanan_darah,
         rm.suhu,
         rm.berat_badan,
         rm.diagnosis,
         rm.tindakan,
         rm.catatan
       FROM kunjungan k
       JOIN rekam_medis rm ON k.id = rm.kunjungan_id
       WHERE k.pasien_id = $1 AND k.id <> $2
       ORDER BY k.tanggal DESC, k.id DESC
       LIMIT 5`,
      [kunjungan.pasien_id, kunjungan_id]
    );

    // Ambil daftar obat yang tersedia untuk dropdown resep
    const obatRes = await db.query('SELECT id, nama_obat, stok, satuan FROM obat ORDER BY nama_obat ASC');

    // Jika kunjungan sudah Selesai, ambil rekam medis dan resep yang sudah ada
    let existingRm = null;
    let existingResep = [];
    if (kunjungan.status === 'Selesai') {
      const rmRes = await db.query('SELECT * FROM rekam_medis WHERE kunjungan_id = $1', [kunjungan_id]);
      if (rmRes.rows.length > 0) {
        existingRm = rmRes.rows[0];
        const resepRes = await db.query(
          `SELECT r.*, o.nama_obat, o.satuan 
           FROM resep r 
           JOIN obat o ON r.obat_id = o.id 
           WHERE r.rekam_medis_id = $1`,
          [existingRm.id]
        );
        existingResep = resepRes.rows;
      }
    }

    res.render('pemeriksaan/form', {
      title: `Pemeriksaan Pasien - ${kunjungan.nama_pasien} (${kunjungan.no_rm})`,
      kunjungan,
      riwayatTerdahulu: riwayatRes.rows,
      obatList: obatRes.rows,
      existingRm,
      existingResep,
      isReadOnly: kunjungan.status === 'Selesai'
    });
  } catch (err) {
    console.error('[PEMERIKSAAN FORM ERROR]', err);
    req.session.flash = { type: 'danger', message: 'Gagal membuka form pemeriksaan: ' + err.message };
    res.redirect('/pemeriksaan');
  }
});

// 3. Simpan Hasil Pemeriksaan + Resep Obat + Update Stok (TRANSACTION)
router.post('/:kunjungan_id', requireAuth, requireRole('dokter'), async (req, res) => {
  const { kunjungan_id } = req.params;
  const { tekanan_darah, suhu, berat_badan, diagnosis, tindakan, catatan } = req.body;

  // Validasi input wajib
  if (!tekanan_darah || !suhu || !berat_badan || !diagnosis || !tindakan) {
    req.session.flash = {
      type: 'danger',
      message: 'Tekanan darah, suhu, berat badan, diagnosis, dan tindakan wajib diisi.'
    };
    return res.redirect(`/pemeriksaan/${kunjungan_id}`);
  }

  // Parse resep obat (bisa tunggal atau array dari form dinamis)
  let obatIds = req.body['obat_id[]'] || req.body.obat_id || [];
  let jumlahs = req.body['jumlah[]'] || req.body.jumlah || [];
  let aturanPakais = req.body['aturan_pakai[]'] || req.body.aturan_pakai || [];

  if (!Array.isArray(obatIds)) obatIds = [obatIds];
  if (!Array.isArray(jumlahs)) jumlahs = [jumlahs];
  if (!Array.isArray(aturanPakais)) aturanPakais = [aturanPakais];

  // Gunakan database client khusus untuk Transaksi PostgreSQL (BEGIN - COMMIT - ROLLBACK)
  const client = await db.getClient();

  try {
    // Mulai Transaksi
    await client.query('BEGIN');

    // 1. Cek status kunjungan saat ini
    const checkKunjungan = await client.query(
      'SELECT id, pasien_id, status FROM kunjungan WHERE id = $1 FOR UPDATE',
      [kunjungan_id]
    );

    if (checkKunjungan.rows.length === 0) {
      throw new Error('Data kunjungan tidak ditemukan.');
    }

    if (checkKunjungan.rows[0].status === 'Selesai') {
      throw new Error('Kunjungan ini sudah selesai diperiksa sebelumnya.');
    }

    const pasienId = checkKunjungan.rows[0].pasien_id;

    // 2. Simpan Rekam Medis
    const rmResult = await client.query(
      `INSERT INTO rekam_medis (kunjungan_id, tekanan_darah, suhu, berat_badan, diagnosis, tindakan, catatan)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        kunjungan_id,
        tekanan_darah.trim(),
        parseFloat(suhu),
        parseFloat(berat_badan),
        diagnosis.trim(),
        tindakan.trim(),
        catatan ? catatan.trim() : null
      ]
    );

    const rekamMedisId = rmResult.rows[0].id;

    // 3. Simpan Resep Obat dan Kurangi Stok Obat Otomatis
    for (let i = 0; i < obatIds.length; i++) {
      const oId = parseInt(obatIds[i], 10);
      const jml = parseInt(jumlahs[i], 10);
      const aturan = aturanPakais[i] ? aturanPakais[i].trim() : '';

      // Lewati baris jika obat tidak dipilih atau jumlah <= 0
      if (!oId || isNaN(oId) || isNaN(jml) || jml <= 0) {
        continue;
      }

      // Kunci baris obat untuk validasi stok (row lock)
      const obatCheck = await client.query(
        'SELECT id, nama_obat, stok FROM obat WHERE id = $1 FOR UPDATE',
        [oId]
      );

      if (obatCheck.rows.length === 0) {
        throw new Error(`Data obat dengan ID ${oId} tidak ditemukan.`);
      }

      const currentObat = obatCheck.rows[0];

      // Validasi kecukupan stok obat
      if (currentObat.stok < jml) {
        throw new Error(
          `Stok obat "${currentObat.nama_obat}" tidak mencukupi! Sisa stok: ${currentObat.stok}, dibutuhkan: ${jml}.`
        );
      }

      // Simpan item resep
      await client.query(
        `INSERT INTO resep (rekam_medis_id, obat_id, jumlah, aturan_pakai)
         VALUES ($1, $2, $3, $4)`,
        [rekamMedisId, oId, jml, aturan || 'Sesuai petunjuk']
      );

      // Kurangi stok obat
      await client.query(
        'UPDATE obat SET stok = stok - $1 WHERE id = $2',
        [jml, oId]
      );
    }

    // 4. Ubah status kunjungan menjadi 'Selesai'
    await client.query(
      "UPDATE kunjungan SET status = 'Selesai' WHERE id = $1",
      [kunjungan_id]
    );

    // Commit transaksi setelah semua langkah sukses
    await client.query('COMMIT');

    req.session.flash = {
      type: 'success',
      message: 'Pemeriksaan dan resep berhasil disimpan. Status kunjungan diubah menjadi Selesai.'
    };
    return res.redirect(`/pasien/${pasienId}`);
  } catch (err) {
    // Rollback transaksi jika terjadi kesalahan apa pun
    await client.query('ROLLBACK');
    console.error('[PEMERIKSAAN TRANSACTION ERROR]', err);
    req.session.flash = {
      type: 'danger',
      message: 'Gagal menyimpan pemeriksaan: ' + err.message
    };
    return res.redirect(`/pemeriksaan/${kunjungan_id}`);
  } finally {
    // Lepaskan client kembali ke pool
    client.release();
  }
});

module.exports = router;
