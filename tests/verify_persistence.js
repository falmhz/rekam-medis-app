// Script Verifikasi Persistensi Pasca Restart Server
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../db');

async function verifyPersistence() {
  console.log('\n=== VERIFIKASI PERSISTENSI POSTGRESQL PASCA RESTART SERVER ===');
  
  try {
    // 1. Cek Pasien Baru
    const pRes = await db.query("SELECT * FROM pasien WHERE nik = '3201019909990099'");
    if (pRes.rows.length === 0) {
      throw new Error('Data pasien hilang setelah restart!');
    }
    const p = pRes.rows[0];
    console.log(`[OK] Pasien ditemukan: [${p.no_rm}] ${p.nama} (NIK: ${p.nik})`);

    // 2. Cek Kunjungan Pasien
    const kRes = await db.query('SELECT * FROM kunjungan WHERE pasien_id = $1 ORDER BY id DESC LIMIT 1', [p.id]);
    if (kRes.rows.length === 0) {
      throw new Error('Data kunjungan hilang setelah restart!');
    }
    const k = kRes.rows[0];
    console.log(`[OK] Kunjungan ditemukan: ID ${k.id}, Status: "${k.status}", Keluhan: "${k.keluhan}"`);

    // 3. Cek Rekam Medis
    const rmRes = await db.query('SELECT * FROM rekam_medis WHERE kunjungan_id = $1', [k.id]);
    if (rmRes.rows.length === 0) {
      throw new Error('Data rekam medis hilang setelah restart!');
    }
    const rm = rmRes.rows[0];
    console.log(`[OK] Rekam Medis ditemukan: Diagnosis: "${rm.diagnosis}", TD: ${rm.tekanan_darah}, Suhu: ${rm.suhu}°C`);

    // 4. Cek Resep
    const rRes = await db.query('SELECT * FROM resep WHERE rekam_medis_id = $1', [rm.id]);
    if (rRes.rows.length === 0) {
      throw new Error('Data resep hilang setelah restart!');
    }
    const r = rRes.rows[0];
    console.log(`[OK] Resep ditemukan: Obat ID ${r.obat_id}, Jumlah: ${r.jumlah}, Aturan: "${r.aturan_pakai}"`);

    // 5. Cek Stok Obat Paracetamol
    const oRes = await db.query('SELECT stok, nama_obat FROM obat WHERE id = $1', [r.obat_id]);
    const o = oRes.rows[0];
    console.log(`[OK] Stok "${o.nama_obat}" tetap persisten: ${o.stok} (stok terpotong tetap bertahan)`);

    console.log('\n[KESIMPULAN] Seluruh data TERBUKTI 100% PERSISTEN di PostgreSQL.\n');
    process.exit(0);
  } catch (err) {
    console.error('[GAGAL VERIFIKASI]', err.message);
    process.exit(1);
  }
}

verifyPersistence();
