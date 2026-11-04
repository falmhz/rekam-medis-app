-- Skema Database Sistem Rekam Medis Klinik
-- Dibuat untuk PostgreSQL

-- Hapus tabel jika sudah ada (urut sesuai ketergantungan relasi)
DROP TABLE IF EXISTS resep CASCADE;
DROP TABLE IF EXISTS rekam_medis CASCADE;
DROP TABLE IF EXISTS kunjungan CASCADE;
DROP TABLE IF EXISTS obat CASCADE;
DROP TABLE IF EXISTS pasien CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Tabel Pengguna (Users)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'petugas', 'dokter')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Pasien
CREATE TABLE pasien (
    id SERIAL PRIMARY KEY,
    no_rm VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    nik VARCHAR(16) UNIQUE NOT NULL,
    tgl_lahir DATE NOT NULL,
    jenis_kelamin VARCHAR(15) NOT NULL CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
    alamat TEXT NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Kunjungan Pasien
CREATE TABLE kunjungan (
    id SERIAL PRIMARY KEY,
    pasien_id INT NOT NULL REFERENCES pasien(id) ON DELETE CASCADE,
    dokter_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    keluhan TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Menunggu' CHECK (status IN ('Menunggu', 'Diperiksa', 'Selesai')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Rekam Medis (1 kunjungan memiliki 1 rekam medis)
CREATE TABLE rekam_medis (
    id SERIAL PRIMARY KEY,
    kunjungan_id INT NOT NULL UNIQUE REFERENCES kunjungan(id) ON DELETE CASCADE,
    tekanan_darah VARCHAR(20) NOT NULL,
    suhu NUMERIC(4, 1) NOT NULL,
    berat_badan NUMERIC(5, 1) NOT NULL,
    diagnosis TEXT NOT NULL,
    tindakan TEXT NOT NULL,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Obat
CREATE TABLE obat (
    id SERIAL PRIMARY KEY,
    nama_obat VARCHAR(100) NOT NULL,
    stok INT NOT NULL DEFAULT 0 CHECK (stok >= 0),
    satuan VARCHAR(20) NOT NULL
);

-- 6. Tabel Resep Obat (Detail obat yang diberikan pada rekam medis)
CREATE TABLE resep (
    id SERIAL PRIMARY KEY,
    rekam_medis_id INT NOT NULL REFERENCES rekam_medis(id) ON DELETE CASCADE,
    obat_id INT NOT NULL REFERENCES obat(id) ON DELETE RESTRICT,
    jumlah INT NOT NULL CHECK (jumlah > 0),
    aturan_pakai VARCHAR(100) NOT NULL
);

-- Indeks untuk mempercepat pencarian data
CREATE INDEX idx_kunjungan_pasien ON kunjungan(pasien_id);
CREATE INDEX idx_kunjungan_dokter ON kunjungan(dokter_id);
CREATE INDEX idx_kunjungan_status ON kunjungan(status);
CREATE INDEX idx_kunjungan_tanggal ON kunjungan(tanggal);
CREATE INDEX idx_rekam_medis_kunjungan ON rekam_medis(kunjungan_id);
CREATE INDEX idx_resep_rekam_medis ON resep(rekam_medis_id);
CREATE INDEX idx_pasien_nama ON pasien(nama);
CREATE INDEX idx_pasien_norm ON pasien(no_rm);
