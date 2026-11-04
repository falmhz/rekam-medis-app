# Sistem Rekam Medis Klinik

Aplikasi web sistem informasi rekam medis klinik rawat jalan berbasis **Node.js**, **Express**, **EJS**, dan **PostgreSQL**. Dibuat lengkap dan siap digunakan untuk pemenuhan tugas kuliah Pemrograman Web dengan tampilan modern bertema kesehatan, arsitektur *Role-Based Access Control* (RBAC), transaksi database atomik (*ACID Transaction*), serta validasi dua arah (klien dan server).

---

## 🚀 Fitur Utama

1. **Autentikasi & Otorisasi Peran (Role-Based Access Control)**
   - **Admin**: Mengelola data akun pengguna klinik (dokter, petugas, admin) dan manajemen data obat serta stok.
   - **Petugas Pendaftaran**: Mendaftarkan pasien baru (Nomor RM otomatis `RM-xxxx`), membuat kunjungan berobat, dan memantau antrean.
   - **Dokter**: Membuka antrean pemeriksaan, memeriksa pasien (tanda vital, diagnosis, tindakan), meresepkan obat secara dinamis, dan melihat riwayat rekam medis terdahulu.
   - Pembatasan rute halaman per peran menggunakan *middleware* (`requireAuth` dan `requireRole`). Jika mengakses halaman di luar haknya, sistem menampilkan halaman **403: Akses Ditolak**.

2. **Alur Pelayanan Medis Lengkap**
   - Petugas mendaftarkan pasien (NIK 16 digit terverifikasi).
   - Petugas membuat kunjungan berobat (status awal: `Menunggu`).
   - Dokter membuka antrean pemeriksaan (status berubah otomatis: `Diperiksa`).
   - Dokter mengisi tanda vital, diagnosis medis, tindakan/terapi, dan menambahkan resep obat secara dinamis (+ / - baris obat).
   - Sistem menyimpan pemeriksaan dalam **Transaksi PostgreSQL (BEGIN / COMMIT / ROLLBACK)**, status kunjungan berubah menjadi `Selesai`, dan stok obat di apotek klinik berkurang secara otomatis.
   - Seluruh riwayat kunjungan tersimpan rapi dan dapat ditelusuri per pasien, urut dari yang paling baru.

3. **Frontend Interaktif Tanpa Framework (Vanilla JS)**
   - Validasi formulir di sisi klien (NIK 16 digit angka, suhu tubuh logis 35–43 °C, field wajib).
   - Penambahan dan penghapusan baris resep obat dinamis.
   - Pencarian langsung pada tabel data (*live table filter* saat mengetik).
   - Dialog konfirmasi sebelum menghapus data penting.
   - Notifikasi *flash alert* yang memudar dan tertutup otomatis setelah 4 detik.

4. **Keamanan & Kualitas Data**
   - Kata sandi dienkripsi menggunakan **bcryptjs** (salt round 10).
   - Semua manipulasi data memakai *Prepared Statements* (query berparameter `$1, $2, ...`) untuk mencegah SQL Injection.
   - Output template di-escape secara aman melalui sintaks `<%= %>` pada EJS.
   - Data tersimpan persisten secara langsung di database PostgreSQL.

---

## 📋 Prasyarat Sistem

Sebelum menjalankan aplikasi, pastikan perangkat Anda telah terpasang:
- **Node.js** (versi 16.x atau yang lebih baru) & **npm**
- **PostgreSQL** (versi 12.x atau yang lebih baru, service berstatus running pada port 5432)

---

## 🛠️ Langkah Instalasi & Menjalankan

Cukup 3 langkah mudah di terminal:

### 1. Pasang Dependensi
```bash
npm install
```

### 2. Salin Pengaturan Lingkungan (.env) & Isi Password
Salin file `.env.example` menjadi `.env`, lalu isi kata sandi PostgreSQL Anda:
```bash
cp .env.example .env
```
Isi konfigurasi pada file `.env`:
```env
PORT=3000
SESSION_SECRET=klinik_rekam_medis_secret_key_super_aman_2026

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=isi_password_postgres_anda
DB_NAME=rekam_medis_db
```

### 3. Inisialisasi Database & Data Awal (Setup)
Perintah ini akan secara otomatis membuat database `rekam_medis_db` jika belum ada, membangun seluruh tabel relasional dari `db/schema.sql`, dan mengisi data awal (*dummy data*) yang siap pakai:
```bash
npm run setup
```

### 4. Jalankan Aplikasi
```bash
npm start
```
Buka browser dan akses: **http://localhost:3000**

*(Untuk pengembangan dengan auto-reload, dapat menggunakan: `npm run dev`)*

---

## 👥 Akun Login Contoh (Demo)

Sistem telah dilengkapi dengan data akun awal untuk masing-masing peran pengguna:

| Peran (Role) | Nama Pengguna (Username) | Kata Sandi (Password) | Hak Akses Utama |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | Kelola akun pengguna, reset sandi, CRUD obat, pantau stok menipis (< 10) |
| **Petugas** | `petugas` | `petugas123` | Pendaftaran pasien baru, kelola data pasien, buat kunjungan, pantau antrean |
| **Dokter** | `dokter` | `dokter123` | Periksa pasien di antrean, isi diagnosis & tindakan, buat resep dinamis, riwayat RM |

---

## 📁 Struktur Folder Proyek

```text
├── .env.example            # Contoh template konfigurasi environment
├── .env                    # Konfigurasi aktif (diabaikan oleh git)
├── .gitignore              # Daftar file yang diabaikan git (node_modules, .env, log)
├── package.json            # Daftar dependensi dan scripts npm
├── README.md               # Dokumentasi lengkap proyek
├── server.js               # Entry point Express, routing utama, dan error handling
├── .vscode/                # Konfigurasi IDE VS Code (launch, tasks, settings, extensions)
├── db/
│   ├── index.js            # Inisialisasi pool PostgreSQL (pg) dan helper query
│   ├── schema.sql          # DDL pembuatan tabel, relasi, constraint, dan indeks
│   └── setup.js            # Script otomatisasi pembuatan database dan seeding data
├── middleware/
│   └── auth.js             # Middleware requireAuth dan requireRole (RBAC)
├── routes/
│   ├── auth.js             # Rute login dan logout
│   ├── pasien.js           # Rute CRUD data pasien dan rekam medis
│   ├── kunjungan.js        # Rute pendaftaran kunjungan dan filter antrean
│   ├── pemeriksaan.js      # Rute form pemeriksaan medis dokter dan transaksi resep
│   ├── obat.js             # Rute CRUD obat klinik (khusus Admin)
│   └── user.js             # Rute CRUD akun pengguna dan reset password (khusus Admin)
├── views/
│   ├── partials/
│   │   ├── header.ejs      # Topbar, flash alert, meta head
│   │   ├── sidebar.ejs     # Menu navigasi samping berbasis role pengguna
│   │   └── footer.ejs      # Penutup HTML dan pemanggil script
│   ├── auth/
│   │   └── login.ejs       # Halaman login modern
│   ├── dashboard/
│   │   └── index.ejs       # Dashboard ringkasan kartu statistik dan antrean hari ini
│   ├── pasien/
│   │   ├── index.ejs       # Tabel daftar pasien dan pencarian
│   │   ├── form.ejs        # Form pendaftaran dan ubah data pasien
│   │   └── detail.ejs      # Profil pasien dan timeline riwayat rekam medis lengkap
│   ├── kunjungan/
│   │   ├── index.ejs       # Daftar antrean pasien dengan filter status dan tanggal
│   │   └── form.ejs        # Form pembuatan kunjungan baru
│   ├── pemeriksaan/
│   │   ├── index.ejs       # Daftar antrean pemeriksaan dokter
│   │   └── form.ejs        # Form rekam medis dokter dan input resep dinamis
│   ├── obat/
│   │   ├── index.ejs       # Daftar obat dengan penanda stok menipis
│   │   └── form.ejs        # Form tambah dan ubah data obat
│   ├── user/
│   │   ├── index.ejs       # Manajemen akun pengguna
│   │   └── form.ejs        # Form tambah dan ubah data pengguna
│   └── error/
│       ├── 403.ejs         # Halaman ramah: Akses Ditolak
│       ├── 404.ejs         # Halaman ramah: Tidak Ditemukan
│       └── 500.ejs         # Halaman ramah: Kesalahan Server
├── public/
│   ├── css/
│   │   └── style.css       # Desain antarmuka responsif murni bertema kesehatan
│   └── js/
│       └── app.js          # Skrip vanilla JS: validasi, baris resep dinamis, filter live
└── tests/
    ├── test_app.js         # Pengujian otomatis integrasi alur web & transaksi
    └── verify_persistence.js # Pengujian verifikasi persistensi data pasca restart server
```

---

## 🗄️ Skema Tabel Database (PostgreSQL)

Berikut adalah entitas dan relasi tabel pada database:

```
  +------------------+         +------------------+
  |      users       |         |      pasien      |
  +------------------+         +------------------+
  | id (PK)          |<---+    | id (PK)          |<---+
  | nama             |    |    | no_rm (UNIQUE)   |    |
  | username (UNIQUE)|    |    | nama             |    |
  | password_hash    |    |    | nik (UNIQUE)     |    |
  | role             |    |    | tgl_lahir        |    |
  | created_at       |    |    | jenis_kelamin    |    |
  +------------------+    |    | alamat, no_hp    |    |
                          |    +------------------+    |
                          |              |             |
                          | 1            | 1           |
                          |              |             |
                          |    N         | N           |
                     +-----------------------+         |
                     |       kunjungan       |         |
                     +-----------------------+         |
                     | id (PK)               |         |
                     | pasien_id (FK) -------+---------+
                     | dokter_id (FK) -------+
                     | tanggal               |
                     | keluhan               |
                     | status                |
                     | created_at            |
                     +-----------------------+
                                 | 1
                                 |
                                 | 1 (UNIQUE)
                     +-----------------------+
                     |      rekam_medis      |
                     +-----------------------+
                     | id (PK)               |<---+
                     | kunjungan_id (FK-UNQ) |    |
                     | tekanan_darah         |    |
                     | suhu, berat_badan     |    |
                     | diagnosis, tindakan   |    |
                     | catatan, created_at   |    |
                     +-----------------------+    |
                                 | 1              |
                                 |                |
                                 | N              |
  +------------------+       +------------------+ |
  |       obat       |       |      resep       | |
  +------------------+       +------------------+ |
  | id (PK)          |<------| id (PK)          | |
  | nama_obat        | 1   N | rekam_medis_id(FK)-+
  | stok (>= 0)      |       | obat_id (FK)     |
  | satuan           |       | jumlah (> 0)     |
  +------------------+       | aturan_pakai     |
                             +------------------+
```

### Rincian Tabel:
1. `users`: Menyimpan data akun pengguna klinik (id, nama, username unik, password_hash bcrypt, role `admin`/`petugas`/`dokter`).
2. `pasien`: Menyimpan identitas pasien (id, no_rm unik berformat `RM-xxxx`, nama, nik unik 16 digit, tgl_lahir, jenis_kelamin, alamat, no_hp).
3. `kunjungan`: Mencatat riwayat pendaftaran berobat (pasien_id FK, dokter_id FK, tanggal, keluhan, status `Menunggu`/`Diperiksa`/`Selesai`).
4. `rekam_medis`: Hasil pemeriksaan medis pasien (kunjungan_id FK-UNIQUE, tekanan_darah, suhu, berat_badan, diagnosis, tindakan, catatan).
5. `obat`: Master persediaan obat klinik (nama_obat, stok dengan constraint non-negatif, satuan).
6. `resep`: Rincian obat yang diresepkan dokter (rekam_medis_id FK, obat_id FK, jumlah, aturan_pakai).

---

## 🧪 Alur Pengujian Mandiri

Aplikasi telah diuji mandiri meliputi:
1. **Siklus Pendaftaran hingga Rekam Medis Selesai**:
   - Login Petugas (`petugas` / `petugas123`).
   - Mendaftarkan Pasien baru dengan No. RM otomatis `RM-0011`.
   - Membuat Kunjungan baru dengan status `Menunggu`.
   - Logout dan Login Dokter (`dokter` / `dokter123`).
   - Membuka antrean, status kunjungan berubah menjadi `Diperiksa`.
   - Mengisi tanda vital, diagnosis, dan meresepkan obat Paracetamol & Cetirizine.
   - Menyimpan pemeriksaan (transaksi dieksekusi, status menjadi `Selesai`, stok obat otomatis berkurang).
   - Melihat riwayat rekam medis pasien yang langsung tertera lengkap.
2. **Uji Transaksi & Validasi Stok**:
   - Jika obat diminta melebihi sisa stok, sistem otomatis melakukan `ROLLBACK` dan menampilkan pesan kesalahan transparan ke dokter.
3. **Uji Keamanan Hak Akses**:
   - Petugas/Dokter mengakses `/obat` atau `/user` langsung ditolak dengan halaman `403`.
4. **Uji Persistensi Database**:
   - Server dimatikan dan direstart, seluruh data pasien, kunjungan, dan resep tetap aman tersimpan di PostgreSQL.
#   r e k a m - m e d i s  
 #   r e k a m - m e d i s  
 #   r e k a m - m e d i s - a p p  
 