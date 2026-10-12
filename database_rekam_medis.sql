-- ============================================================================
-- DATABASE SKEMA REKAM MEDIS ELEKTRONIK (RME) - KLINIK PRATAMA SEHAT MEDIKA
-- Standar Faskes Kemenkes RI & ICD-10
-- Engine: MySQL / MariaDB (XAMPP Compatible)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `db_rekam_medis` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `db_rekam_medis`;

-- ----------------------------------------------------------------------------
-- 1. TABEL POLIKLINIK (Fasilitas Pelayanan)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `polis`;
CREATE TABLE `polis` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(10) NOT NULL,
  `color` VARCHAR(50) DEFAULT 'blue',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `polis` (`id`, `name`, `code`, `color`) VALUES
('poli-umum', 'Poli Umum', 'U', 'blue'),
('poli-gigi', 'Poli Gigi', 'G', 'amber'),
('poli-anak', 'Poli Anak (Pediatri)', 'A', 'emerald'),
('poli-dalam', 'Poli Penyakit Dalam', 'D', 'purple'),
('poli-kia', 'Poli KIA & Kandungan', 'K', 'rose');

-- ----------------------------------------------------------------------------
-- 2. TABEL DOKTER (Tenaga Medis)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `doctors`;
CREATE TABLE `doctors` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `spec` VARCHAR(100) NOT NULL,
  `sip` VARCHAR(100) NOT NULL,
  `poli_id` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `schedule` VARCHAR(150) NOT NULL,
  `experience` VARCHAR(50) DEFAULT NULL,
  `photo_url` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`poli_id`) REFERENCES `polis` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `doctors` (`id`, `name`, `spec`, `sip`, `poli_id`, `email`, `password`, `schedule`, `experience`) VALUES
('doc-1', 'dr. Budi Santoso', 'Dokter Umum', '503/SIP.DU/2024/001', 'poli-umum', 'dokter@sehatmedika.com', 'dokter123', 'Senin - Sabtu, 08:00 - 14:00 WIB', '8 Tahun'),
('doc-2', 'dr. Aris Pratama, Sp.PD', 'Spesialis Penyakit Dalam', '503/SIP.SpPD/2023/045', 'poli-dalam', 'dr.aris@sehatmedika.com', 'dokter123', 'Senin - Jumat, 09:00 - 16:00 WIB', '14 Tahun'),
('doc-3', 'dr. Siti Sarah, Sp.A', 'Spesialis Anak (Pediatri)', '503/SIP.SpA/2022/012', 'poli-anak', 'dr.siti@sehatmedika.com', 'dokter123', 'Senin - Kamis, 08:30 - 14:30 WIB', '11 Tahun'),
('doc-4', 'drg. Amanda Putri', 'Dokter Gigi & Mulut', '503/SIP.DG/2023/078', 'poli-gigi', 'drg.amanda@sehatmedika.com', 'dokter123', 'Selasa - Sabtu, 10:00 - 17:00 WIB', '9 Tahun'),
('doc-5', 'dr. Ratna Wulandari, Sp.OG', 'Spesialis Kebidanan & Kandungan', '503/SIP.SpOG/2024/033', 'poli-kia', 'dr.ratna@sehatmedika.com', 'dokter123', 'Senin, Rabu, Jumat, 13:00 - 19:00 WIB', '15 Tahun');

-- ----------------------------------------------------------------------------
-- 3. TABEL PASIEN (Master Data Pasien)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `patients`;
CREATE TABLE `patients` (
  `id` VARCHAR(50) NOT NULL,
  `mrn` VARCHAR(50) NOT NULL UNIQUE, -- Nomor Rekam Medis (RM-2026-0001)
  `nik` VARCHAR(16) NOT NULL UNIQUE,
  `email` VARCHAR(100) DEFAULT NULL,
  `password` VARCHAR(255) DEFAULT 'pasien123',
  `name` VARCHAR(150) NOT NULL,
  `gender` ENUM('Laki-laki', 'Perempuan') NOT NULL,
  `birth_date` DATE NOT NULL,
  `age` INT DEFAULT NULL,
  `blood_type` VARCHAR(5) DEFAULT 'O+',
  `phone` VARCHAR(25) NOT NULL,
  `address` TEXT DEFAULT NULL,
  `payment_type` VARCHAR(50) NOT NULL DEFAULT 'BPJS Kesehatan',
  `bpjs_number` VARCHAR(50) DEFAULT '-',
  `allergies` TEXT DEFAULT NULL,
  `registered_date` DATE NOT NULL,
  `emergency_contact` VARCHAR(150) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `patients` (`id`, `mrn`, `nik`, `email`, `password`, `name`, `gender`, `birth_date`, `age`, `blood_type`, `phone`, `address`, `payment_type`, `bpjs_number`, `allergies`, `registered_date`) VALUES
('pat-1', 'RM-2026-0001', '3171012504880003', 'ahmad@gmail.com', 'pasien123', 'Ahmad Dahlan Saputra', 'Laki-laki', '1988-04-25', 38, 'O+', '0812-9876-5432', 'Jl. Tebet Barat Dalam No. 12, Jakarta Selatan', 'BPJS Kesehatan', '0001234567890', 'Alergi Penisilin (Ampisilin, Amoxicillin)', '2026-01-15'),
('pat-2', 'RM-2026-0002', '3275026208920001', 'dewi@gmail.com', 'pasien123', 'Dewi Lestari Kusuma', 'Perempuan', '1992-08-22', 34, 'A+', '0857-1122-3344', 'Komplek Melati Indah Blok C3, Jakarta Selatan', 'Mandiri / Umum', '-', 'Tidak ada alergi', '2026-02-10'),
('pat-3', 'RM-2026-0003', '3174031506650002', 'sudirman@gmail.com', 'pasien123', 'Haji Sudirman', 'Laki-laki', '1965-06-15', 61, 'B+', '0813-4455-6677', 'Jl. Panglima Polim Raya No. 88, Kebayoran Baru', 'BPJS Kesehatan', '0002345678901', 'Alergi Seafood (Udang/Kepiting)', '2026-02-18'),
('pat-4', 'RM-2026-0004', '3171055011980004', 'nadia@gmail.com', 'pasien123', 'Nadia Putri Maharani', 'Perempuan', '1998-11-10', 28, 'AB+', '0878-9900-1122', 'Jl. Gandaria Tengah IV No. 5, Jakarta Selatan', 'Asuransi Swasta', 'PRU-88992019', 'Alergi Debu & Sulfa', '2026-03-01'),
('pat-5', 'RM-2026-0005', '3275080509170006', 'kenzo@gmail.com', 'pasien123', 'Kenzo Alvaro Pratama', 'Laki-laki', '2017-09-05', 9, 'O+', '0812-7788-9900', 'Jl. Wijaya Kusuma No. 20, Jakarta Selatan', 'BPJS Kesehatan', '0003456789012', 'Tidak ada riwayat alergi', '2026-03-12');

-- ----------------------------------------------------------------------------
-- 4. TABEL REKAM MEDIS ELEKTRONIK (SOAP Format)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `medical_records`;
CREATE TABLE `medical_records` (
  `id` VARCHAR(50) NOT NULL,
  `record_number` VARCHAR(50) NOT NULL UNIQUE, -- EMR-2026-0089
  `date` DATE NOT NULL,
  `time` TIME NOT NULL,
  `patient_id` VARCHAR(50) NOT NULL,
  `doctor_id` VARCHAR(50) NOT NULL,
  `poli_id` VARCHAR(50) NOT NULL,
  
  -- S: SUBJEKTIF
  `chief_complaint` TEXT NOT NULL,
  `history_of_illness` TEXT DEFAULT NULL,
  `patient_allergies` TEXT DEFAULT NULL,

  -- O: OBJEKTIF (Tanda-Tanda Vital & Fisik)
  `blood_pressure` VARCHAR(20) DEFAULT NULL, -- 120/80
  `heart_rate` INT DEFAULT NULL, -- bpm
  `respiratory_rate` INT DEFAULT NULL, -- x/mnt
  `temperature` DECIMAL(4,1) DEFAULT NULL, -- Celsius
  `oxygen_saturation` INT DEFAULT NULL, -- %
  `weight` DECIMAL(5,2) DEFAULT NULL, -- kg
  `height` DECIMAL(5,2) DEFAULT NULL, -- cm
  `bmi` DECIMAL(4,1) DEFAULT NULL,
  `bmi_status` VARCHAR(50) DEFAULT NULL,
  `physical_exam` TEXT DEFAULT NULL,

  -- A: ASESMEN / DIAGNOSA (ICD-10)
  `primary_diagnosis` VARCHAR(255) NOT NULL,
  `secondary_diagnosis` VARCHAR(255) DEFAULT NULL,
  `clinical_notes` TEXT DEFAULT NULL,

  -- P: PLAN / RENCANA & TERAPI
  `prescriptions_json` JSON DEFAULT NULL, -- Daftar resep obat terstruktur
  `actions` TEXT DEFAULT NULL,
  `education` TEXT DEFAULT NULL,
  `disposition` VARCHAR(100) DEFAULT 'Rawat Jalan (Pulang)',
  `follow_up` VARCHAR(150) DEFAULT NULL,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`poli_id`) REFERENCES `polis` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `medical_records` (
  `id`, `record_number`, `date`, `time`, `patient_id`, `doctor_id`, `poli_id`, 
  `chief_complaint`, `history_of_illness`, `patient_allergies`, 
  `blood_pressure`, `heart_rate`, `respiratory_rate`, `temperature`, `oxygen_saturation`, `weight`, `height`, `bmi`, `bmi_status`, `physical_exam`,
  `primary_diagnosis`, `secondary_diagnosis`, `prescriptions_json`, `education`, `disposition`, `follow_up`
) VALUES
(
  'rec-1', 'EMR-2026-0089', '2026-10-08', '09:30:00', 'pat-1', 'doc-1', 'poli-umum',
  'Batuk berdahak dan pilek sejak 3 hari yang lalu, badan meriang.',
  'Pasien mengeluhkan demam ringan, pilek hidung tersumbat, batuk dengan dahak putih.',
  'Alergi Penisilin (Amoxicillin dilarang)',
  '120/80', 82, 19, 37.8, 98, 68.0, 170.0, 23.5, 'Normal',
  'Faring hiperemis (+), tonsil tenang T1/T1. Rhonki -/-, Wheezing -/-.',
  'J06.9 - Infeksi Saluran Pernapasan Akut (ISPA)', 'R50.9 - Demam Ringan',
  '[{"medicineName": "Paracetamol 500 mg", "dosage": "3 x 1 tablet sesudah makan", "quantity": 10}, {"medicineName": "Cetirizine 10 mg", "dosage": "1 x 1 tablet malam", "quantity": 5}]',
  'Istirahat cukup 8 jam, minum air hangat 2L/hari, hindari gorengan.',
  'Rawat Jalan (Pulang)', 'Kontrol kembali dalam 3 hari bila demam berlanjut.'
);

-- ----------------------------------------------------------------------------
-- 5. TABEL ANTREAN POLIKLINIK (Queue Management)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `queues`;
CREATE TABLE `queues` (
  `id` VARCHAR(50) NOT NULL,
  `queue_number` VARCHAR(20) NOT NULL, -- U-001, D-001
  `patient_id` VARCHAR(50) NOT NULL,
  `poli_id` VARCHAR(50) NOT NULL,
  `doctor_id` VARCHAR(50) NOT NULL,
  `status` ENUM('Menunggu', 'Sedang Diperiksa', 'Selesai', 'Batal') DEFAULT 'Menunggu',
  `arrival_time` VARCHAR(10) NOT NULL,
  `date` DATE NOT NULL DEFAULT (CURRENT_DATE),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`poli_id`) REFERENCES `polis` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `queues` (`id`, `queue_number`, `patient_id`, `poli_id`, `doctor_id`, `status`, `arrival_time`, `date`) VALUES
('q-1', 'U-001', 'pat-1', 'poli-umum', 'doc-1', 'Selesai', '08:15', '2026-10-09'),
('q-2', 'D-001', 'pat-3', 'poli-dalam', 'doc-2', 'Selesai', '08:30', '2026-10-09'),
('q-3', 'U-002', 'pat-2', 'poli-umum', 'doc-1', 'Sedang Diperiksa', '08:40', '2026-10-09'),
('q-4', 'A-001', 'pat-5', 'poli-anak', 'doc-3', 'Menunggu', '09:10', '2026-10-09');

-- ----------------------------------------------------------------------------
-- 6. TABEL MASTER OBAT & FARMASI APOTEK
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `medicines`;
CREATE TABLE `medicines` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `form` VARCHAR(50) NOT NULL, -- Tablet, Sirup, Kaplet
  `stock` INT NOT NULL DEFAULT 0,
  `unit` VARCHAR(50) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `dosage_hint` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `medicines` (`id`, `name`, `category`, `form`, `stock`, `unit`, `price`, `dosage_hint`) VALUES
('med-1', 'Paracetamol 500 mg', 'Analgesik / Antipiretik', 'Tablet', 250, 'Tablet', 1500.00, '3 x 1 tablet sesudah makan'),
('med-2', 'Amoxicillin 500 mg', 'Antibiotik', 'Kaplet', 120, 'Kaplet', 3500.00, '3 x 1 kaplet sesudah makan (habiskan)'),
('med-3', 'Omeprazole 20 mg', 'Antasida & Lambung', 'Kapsul', 95, 'Kapsul', 4000.00, '1 x 1 kapsul 30 menit sebelum makan pagi'),
('med-4', 'Cetirizine 10 mg', 'Antihistamin / Alergi', 'Tablet', 80, 'Tablet', 2500.00, '1 x 1 tablet malam hari'),
('med-5', 'Amlodipine 5 mg', 'Antihipertensi', 'Tablet', 150, 'Tablet', 3000.00, '1 x 1 tablet malam hari teratur'),
('med-6', 'Metformin 500 mg', 'Antidiabetes', 'Tablet', 140, 'Tablet', 2800.00, '2 x 1 tablet sesudah makan'),
('med-7', 'Antasida Doen', 'Antasida & Lambung', 'Tablet', 200, 'Tablet', 1200.00, '3 x 1 tablet dikunyah 1 jam sebelum makan');
