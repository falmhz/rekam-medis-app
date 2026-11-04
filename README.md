# 🏥 Sistem Rekam Medis Klinik - Medika Sehat

**Sistem Informasi Rekam Medis Elektronik (EMR) untuk Manajemen Klinik Modern**

Aplikasi berbasis web yang dirancang untuk mengelola data pasien, kunjungan, rekam medis, dan inventory obat secara efisien dan terintegrasi.

---

## ✨ Fitur Utama

### 👥 **Manajemen Pengguna**
- Login dengan role-based access (Admin, Petugas, Dokter)
- Manajemen user dengan sistem autentikasi bcryptjs
- Session management dengan timeout 8 jam

### 🏃 **Manajemen Pasien**
- CRUD data pasien lengkap (nama, NIK, alamat, no HP, dll)
- Nomor Rekam Medis (RM) otomatis dan unik
- History kunjungan pasien

### 📋 **Manajemen Kunjungan**
- Pendaftaran kunjungan pasien
- Sistem antrean (Menunggu, Diperiksa, Selesai)
- Penugasan dokter otomatis
- Filter berdasarkan tanggal, status, dan dokter

### 🩺 **Rekam Medis**
- Input data pemeriksaan (tekanan darah, suhu, berat badan)
- Diagnosis dan tindakan medis
- Catatan klinis untuk setiap kunjungan

### 💊 **Manajemen Obat & Resep**
- Inventaris obat dengan tracking stok
- Alert stok obat menipis (< 10 unit)
- Pemberian resep obat per rekam medis
- Detail aturan pakai obat

### 📊 **Dashboard Statistik**
- Total pasien terdaftar
- Kunjungan hari ini
- Antrean pasien berdasarkan status
- Monitoring obat yang perlu restok
- Quick access antrean terbaru

---

## 🛠️ Teknologi Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js + Express.js |
| **Frontend** | EJS (Embedded JavaScript Templating) |
| **Database** | PostgreSQL 12+ |
| **Authentication** | bcryptjs, express-session |
| **HTTP Client** | Built-in Node.js |

### Dependencies:
```json
{
  "express": "^4.21.2",
  "express-session": "^1.18.1",
  "ejs": "^3.1.10",
  "pg": "^8.13.1",
  "bcryptjs": "^2.4.3",
  "dotenv": "^16.4.7"
}
```

---

## 📦 Instalasi & Setup

### **Prasyarat**
- Node.js v16+ ([Download](https://nodejs.org/))
- PostgreSQL 12+ ([Download](https://www.postgresql.org/download/))
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/falmhz/rekam-medis-app.git
cd rekam-medis-app
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Konfigurasi Database**

Buat file `.env` dari template `.env.example`:
```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi PostgreSQL Anda:
```env
# Konfigurasi Server
PORT=3000
SESSION_SECRET=klinik_rekam_medis_secret_key_super_aman_2026

# Konfigurasi Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password_anda
DB_NAME=rekam_medis_db
```

**Catatan:** Ganti `password_anda` dengan password PostgreSQL Anda.

### **4. Setup Database**

Jalankan script setup untuk membuat database dan tabel:
```bash
npm run setup
```

Script ini akan:
- Membuat database `rekam_medis_db`
- Membuat semua tabel sesuai schema
- Insert default user demo

### **5. Jalankan Aplikasi**

**Mode Production:**
```bash
npm start
```

**Mode Development (dengan auto-reload):**
```bash
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:3000**

---

## 📚 Default User Demo

Setelah setup, gunakan akun berikut untuk login:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Petugas | petugas1 | petugas123 |
| Dokter | dokter1 | dokter123 |

> ⚠️ **PENTING**: Ubah password ini di production!

---

## 📁 Struktur Proyek

```
rekam-medis-app/
├── db/                          # Database configuration
│   ├── index.js                 # Connection pool & helpers
│   ├── schema.sql               # Database schema
│   └── setup.js                 # Database initialization
│
├── middleware/                  # Express middleware
│   └── auth.js                  # Authentication middleware
│
├── routes/                      # API Routes
│   ├── auth.js                  # Login & logout
│   ├── pasien.js                # Patient management
│   ├── kunjungan.js             # Visit management
│   ├── pemeriksaan.js           # Medical examination
│   ├── obat.js                  # Medicine inventory
│   └── user.js                  # User management
│
├── views/                       # EJS Templates
│   ├── auth/
│   │   └── login.ejs            # Login page
│   ├── dashboard/
│   │   └── index.ejs            # Dashboard
│   ├── pasien/                  # Patient pages
│   ├── kunjungan/               # Visit pages
│   ├── pemeriksaan/             # Examination pages
│   ├── obat/                    # Medicine pages
│   ├── user/                    # User pages
│   ├── error/                   # Error pages (404, 500)
│   └── partials/                # Reusable components
│
├── public/                      # Static files
│   ├── css/
│   │   └── style.css            # Main stylesheet
│   ├── js/
│   │   └── app.js               # Client-side JS
│   └── images/
│       └── logo.svg             # Medical logo
│
├── tests/                       # Test files
│   ├── test_app.js
│   └── verify_persistence.js
│
├── server.js                    # Main server file
├── package.json                 # Dependencies
├── .env.example                 # Environment template
└── README.md                    # Documentation (this file)
```

---

## 🚀 Penggunaan

### **Akses Aplikasi**
1. Buka browser: `http://localhost:3000`
2. Login dengan salah satu akun demo
3. Navigasi ke menu sesuai kebutuhan

### **Menu Utama**

#### **Dashboard**
- Ringkasan statistik klinik hari ini
- Monitoring antrean pasien real-time
- Alert obat yang perlu restok

#### **Data Pasien**
- Lihat daftar semua pasien
- Tambah pasien baru
- Edit data pasien
- Lihat history kunjungan

#### **Kunjungan Pasien**
- Daftar kunjungan baru
- Kelola status antrean
- Penugasan ke dokter

#### **Pemeriksaan Medis**
- Input hasil pemeriksaan
- Diagnosis dan tindakan
- Resep obat

#### **Inventaris Obat**
- Kelola stok obat
- Tambah/edit obat
- Alert stok menipis

#### **Manajemen User** (Admin only)
- Lihat daftar user
- Tambah user baru
- Edit data user
- Reset password user

---

## 🗄️ Database Schema

### **Tabel Users**
```sql
id | nama | username | password_hash | role | created_at
```
Role: `admin`, `petugas`, `dokter`

### **Tabel Pasien**
```sql
id | no_rm | nama | nik | tgl_lahir | jenis_kelamin | alamat | no_hp | created_at
```

### **Tabel Kunjungan**
```sql
id | pasien_id | dokter_id | tanggal | keluhan | status | created_at
```
Status: `Menunggu`, `Diperiksa`, `Selesai`

### **Tabel Rekam Medis**
```sql
id | kunjungan_id | tekanan_darah | suhu | berat_badan | diagnosis | tindakan | catatan | created_at
```

### **Tabel Obat**
```sql
id | nama_obat | stok | satuan
```

### **Tabel Resep**
```sql
id | rekam_medis_id | obat_id | jumlah | aturan_pakai
```

---

## 🔐 Security Features

- ✅ Password hashing dengan bcryptjs
- ✅ Session-based authentication
- ✅ Role-based access control (RBAC)
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS & security headers
- ✅ HTTP-only cookies
- ✅ 8-hour session timeout

---

## 🐛 Troubleshooting

### **Error: "Cannot find module 'pg'"**
Solusi:
```bash
npm install
```

### **Error: "SASL: client password must be a string"**
Pastikan password di `.env` tidak kosong atau gunakan string kosong `""`:
```env
DB_PASSWORD=your_password
```

### **Error: "Database connection failed"**
Periksa:
1. PostgreSQL service berjalan
2. Konfigurasi `.env` benar
3. Database sudah dibuat dengan `npm run setup`

### **Error: "Port 3000 already in use"**
Ganti port di `.env`:
```env
PORT=3001
```

---

## 📝 Scripts

```bash
# Install dependencies
npm install

# Setup database (create tables & seed data)
npm run setup

# Start production server
npm start

# Start development server (with auto-reload)
npm run dev

# Run tests
npm test
```

---

## 🤝 Kontribusi

Kami menerima kontribusi! Silakan:
1. Fork repository
2. Buat branch feature: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push ke branch: `git push origin feature/your-feature`
5. Buka Pull Request

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **ISC License**. Lihat file `LICENSE` untuk detail.

---

## 📞 Kontak & Support

- **Author**: Falmhz
- **Repository**: https://github.com/falmhz/rekam-medis-app
- **Issues**: Silakan buat issue di GitHub untuk melaporkan bug atau request fitur

---

## 🎯 Roadmap Fitur Mendatang

- [ ] Export data ke Excel/PDF
- [ ] SMS notification untuk reminder kunjungan
- [ ] Mobile app (React Native)
- [ ] Multi-branch support
- [ ] Advanced analytics & reporting
- [ ] API documentation (Swagger)
- [ ] Unit testing & CI/CD pipeline

---

## 📸 Screenshots

### Login Page
![Medika Sehat Login](public/images/logo.svg)

Halaman login dengan branding Medika Sehat dan logo medis modern.

---

**Made with ❤️ for healthcare management**
