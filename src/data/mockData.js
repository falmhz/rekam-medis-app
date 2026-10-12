// Data Awal (Mock Data) untuk Sistem Rekam Medis Elektronik (RME)
// Standar Faskes Tingkat Pertama (FKTP) / Klinik Pratama Indonesia

export const CLINIC_INFO = {
  name: "Klinik Pratama Sehat Medika",
  legalNumber: "Izin Faskes: 445/028/SIP-KLINIK/2023",
  address: "Jl. Kesehatan Bahagia No. 45, Kebayoran Baru, Jakarta Selatan 12160",
  phone: "(021) 7890-1234",
  email: "info@sehatmedika.co.id",
  website: "www.sehatmedika.co.id",
  logoUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&auto=format&fit=crop&q=80"
};

export const ADMIN_USER = {
  id: "admin-1",
  name: "Admin Klinik",
  email: "admin@sehatmedika.com",
  password: "admin123",
  role: "admin",
  spec: "Administrator Klinik",
  sip: "ADM-2024-001"
};

export const CLINIC_POLIS = [
  { id: "poli-umum", name: "Poli Umum", code: "U", color: "blue", icon: "Stethoscope" },
  { id: "poli-gigi", name: "Poli Gigi", code: "G", color: "amber", icon: "Smile" },
  { id: "poli-anak", name: "Poli Anak", code: "A", color: "emerald", icon: "Baby" },
  { id: "poli-dalam", name: "Poli Penyakit Dalam", code: "D", color: "purple", icon: "HeartPulse" },
  { id: "poli-kia", name: "Poli KIA & Kandungan", code: "K", color: "rose", icon: "Sparkles" }
];

export const DOCTORS = [
  { 
    id: "doc-1", 
    name: "dr. Budi Santoso", 
    spec: "Dokter Umum", 
    sip: "503/SIP.DU/2024/001", 
    poliId: "poli-umum",
    poliName: "Poli Umum",
    email: "dokter@sehatmedika.com",
    password: "dokter123",
    schedule: "Senin - Sabtu, 08:00 - 14:00 WIB",
    experience: "8 Tahun Pengalaman",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
    diseasesHandled: [
      "flu", "batuk", "pilek", "demam", "ispa", "masuk angin", "pusing", "sakit kepala", 
      "mual", "kelelahan", "radang tenggorokan", "alergi ringan", "luka lecet", 
      "medical check-up", "surat keterangan sehat", "vaksinasi umum"
    ]
  },
  { 
    id: "doc-2", 
    name: "dr. Aris Pratama, Sp.PD", 
    spec: "Spesialis Penyakit Dalam", 
    sip: "503/SIP.SpPD/2023/045", 
    poliId: "poli-dalam",
    poliName: "Poli Penyakit Dalam",
    email: "dr.aris@sehatmedika.com",
    password: "dokter123",
    schedule: "Senin - Jumat, 09:00 - 16:00 WIB",
    experience: "14 Tahun Pengalaman",
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80",
    diseasesHandled: [
      "penyakit dalam", "hipertensi", "darah tinggi", "diabetes", "kencing manis", 
      "gula darah", "lambung", "maag", "asam lambung", "gerd", "gastritis", 
      "kolesterol", "ginjal", "jantung", "tiroid", "asam urat", "hati / liver", 
      "dispepsia", "autoimun", "infeksi paru", "sesak napas"
    ]
  },
  { 
    id: "doc-3", 
    name: "dr. Siti Sarah, Sp.A", 
    spec: "Spesialis Anak (Pediatri)", 
    sip: "503/SIP.SpA/2022/012", 
    poliId: "poli-anak",
    poliName: "Poli Anak",
    email: "dr.siti@sehatmedika.com",
    password: "dokter123",
    schedule: "Senin - Kamis, 08:30 - 14:30 WIB",
    experience: "11 Tahun Pengalaman",
    photoUrl: "https://images.unsplash.com/photo-1594824813576-9262e3d360ec?w=300&auto=format&fit=crop&q=80",
    diseasesHandled: [
      "anak", "bayi", "pediatri", "demam anak", "kejang demam", "batuk pilek anak", 
      "diare anak", "imunisasi anak", "tumbuh kembang", "stunting", "alergi susu sapi", 
      "gizi kurang", "asma anak", "cacar air", "campak"
    ]
  },
  { 
    id: "doc-4", 
    name: "drg. Amanda Putri", 
    spec: "Dokter Gigi & Mulut", 
    sip: "503/SIP.DG/2023/078", 
    poliId: "poli-gigi",
    poliName: "Poli Gigi",
    email: "drg.amanda@sehatmedika.com",
    password: "dokter123",
    schedule: "Selasa - Sabtu, 10:00 - 17:00 WIB",
    experience: "9 Tahun Pengalaman",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80",
    diseasesHandled: [
      "gigi", "sakit gigi", "gigi berlubang", "karies gigi", "cabut gigi", 
      "tambal gigi", "karang gigi", "scaling", "gusi berdarah", "gingivitis", 
      "bau mulut", "behel gigi", "pemasangan kawat gigi", "gigi bungsu"
    ]
  },
  { 
    id: "doc-5", 
    name: "dr. Ratna Wulandari, Sp.OG", 
    spec: "Spesialis Kebidanan & Kandungan", 
    sip: "503/SIP.SpOG/2024/033", 
    poliId: "poli-kia",
    poliName: "Poli KIA & Kandungan",
    email: "dr.ratna@sehatmedika.com",
    password: "dokter123",
    schedule: "Senin, Rabu, Jumat, 13:00 - 19:00 WIB",
    experience: "15 Tahun Pengalaman",
    photoUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80",
    diseasesHandled: [
      "kandungan", "kebidanan", "hamil", "kehamilan", "ibu hamil", "usg 4d", 
      "usg kandungan", "persalinan", "melahirkan", "haid", "menstruasi tidak teratur", 
      "keputihan", "program hamil", "promil", "kb", "kista ovarium", "miom"
    ]
  }
];

export const ICD10_LIST = [
  { code: "J06.9", name: "Infeksi Saluran Pernapasan Akut (ISPA)", category: "Respirasi" },
  { code: "I10", name: "Hipertensi Esensial (Primer)", category: "Kardiovaskular" },
  { code: "K29.7", name: "Gastritis / Dispepsia Akut", category: "Pencernaan" },
  { code: "E11.9", name: "Diabetes Melitus Tipe 2 Tanpa Komplikasi", category: "Endokrin" },
  { code: "A09", name: "Diare dan Gastroenteritis Akut", category: "Pencernaan" },
  { code: "M79.1", name: "Myalgia (Nyeri Otot / Pegal-pegal)", category: "Muskuloskeletal" },
  { code: "J45.9", name: "Asma Bronkial Tidak Terspesifikasi", category: "Respirasi" },
  { code: "R50.9", name: "Demam Tanpa Penyebab Jelas (Febris)", category: "Gejala Umum" },
  { code: "L20.9", name: "Dermatitis Atopik / Alergi Kulit", category: "Kulit" },
  { code: "K02.9", name: "Karies Gigi / Gigi Berlubang", category: "Gigi & Mulut" },
  { code: "H10.9", name: "Konjungtivitis (Mata Merah)", category: "Mata" },
  { code: "Z00.0", name: "Pemeriksaan Kesehatan Umum (Medical Check-up)", category: "Pencegahan" }
];

export const INITIAL_MEDICINES = [
  {
    id: "med-1",
    name: "Paracetamol 500 mg",
    category: "Analgesik / Antipiretik",
    form: "Tablet",
    stock: 250,
    unit: "Tablet",
    price: 1500,
    dosageHint: "3 x 1 tablet sesudah makan"
  },
  {
    id: "med-2",
    name: "Amoxicillin 500 mg",
    category: "Antibiotik",
    form: "Kaplet",
    stock: 120,
    unit: "Kaplet",
    price: 3500,
    dosageHint: "3 x 1 kaplet sesudah makan (habiskan)"
  },
  {
    id: "med-3",
    name: "Omeprazole 20 mg",
    category: "Antasida & Lambung",
    form: "Kapsul",
    stock: 95,
    unit: "Kapsul",
    price: 4000,
    dosageHint: "1 x 1 kapsul 30 menit sebelum makan pagi"
  },
  {
    id: "med-4",
    name: "Cetirizine 10 mg",
    category: "Antihistamin / Alergi",
    form: "Tablet",
    stock: 80,
    unit: "Tablet",
    price: 2500,
    dosageHint: "1 x 1 tablet malam sebelum tidur"
  },
  {
    id: "med-5",
    name: "Amlodipine 5 mg",
    category: "Antihipertensi",
    form: "Tablet",
    stock: 150,
    unit: "Tablet",
    price: 3000,
    dosageHint: "1 x 1 tablet malam hari secara teratur"
  },
  {
    id: "med-6",
    name: "Metformin 500 mg",
    category: "Antidiabetes",
    form: "Tablet",
    stock: 140,
    unit: "Tablet",
    price: 2800,
    dosageHint: "2 x 1 tablet bersamaan / sesudah makan"
  },
  {
    id: "med-7",
    name: "Antasida Doen",
    category: "Antasida & Lambung",
    form: "Tablet Kunyah",
    stock: 200,
    unit: "Tablet",
    price: 1200,
    dosageHint: "3 x 1 tablet dikunyah 1 jam sebelum makan"
  },
  {
    id: "med-8",
    name: "Ibuprofen 400 mg",
    category: "Antiinflamasi & Analgesik",
    form: "Tablet",
    stock: 110,
    unit: "Tablet",
    price: 2000,
    dosageHint: "3 x 1 tablet sesudah makan bila nyeri"
  },
  {
    id: "med-9",
    name: "Oralit Sachet",
    category: "Rehidrasi",
    form: "Serbuk",
    stock: 180,
    unit: "Sachet",
    price: 1500,
    dosageHint: "Larutkan 1 sachet dalam 200ml air setiap BAB cair"
  },
  {
    id: "med-10",
    name: "Vitamin C 500 mg",
    category: "Suplemen",
    form: "Tablet",
    stock: 300,
    unit: "Tablet",
    price: 2000,
    dosageHint: "1 x 1 tablet sesudah makan"
  }
];

export const INITIAL_PATIENTS = [
  {
    id: "pat-1",
    mrn: "RM-2026-0001",
    nik: "3171012504880003",
    email: "ahmad@gmail.com",
    password: "pasien123",
    name: "Ahmad Dahlan Saputra",
    gender: "Laki-laki",
    birthDate: "1988-04-25",
    age: 38,
    bloodType: "O+",
    phone: "0812-9876-5432",
    address: "Jl. Tebet Barat Dalam No. 12, Jakarta Selatan",
    paymentType: "BPJS Kesehatan",
    bpjsNumber: "0001234567890",
    allergies: "Alergi Penisilin (Ampisilin, Amoxicillin)",
    registeredDate: "2026-01-15",
    emergencyContact: "Ratna (Istri) - 0812-9876-5433"
  },
  {
    id: "pat-2",
    mrn: "RM-2026-0002",
    nik: "3275026208920001",
    email: "dewi@gmail.com",
    password: "pasien123",
    name: "Dewi Lestari Kusuma",
    gender: "Perempuan",
    birthDate: "1992-08-22",
    age: 34,
    bloodType: "A+",
    phone: "0857-1122-3344",
    address: "Komplek Melati Indah Blok C3, Jakarta Selatan",
    paymentType: "Mandiri / Umum",
    bpjsNumber: "-",
    allergies: "Tidak ada alergi",
    registeredDate: "2026-02-10",
    emergencyContact: "Bambang (Suami) - 0857-1122-3345"
  },
  {
    id: "pat-3",
    mrn: "RM-2026-0003",
    nik: "3174031506650002",
    email: "sudirman@gmail.com",
    password: "pasien123",
    name: "Haji Sudirman",
    gender: "Laki-laki",
    birthDate: "1965-06-15",
    age: 61,
    bloodType: "B+",
    phone: "0813-4455-6677",
    address: "Jl. Panglima Polim Raya No. 88, Kebayoran Baru",
    paymentType: "BPJS Kesehatan",
    bpjsNumber: "0002345678901",
    allergies: "Alergi Seafood (Udang/Kepiting)",
    registeredDate: "2026-02-18",
    emergencyContact: "Fajar (Anak) - 0813-4455-6678"
  },
  {
    id: "pat-4",
    mrn: "RM-2026-0004",
    nik: "3171055011980004",
    email: "nadia@gmail.com",
    password: "pasien123",
    name: "Nadia Putri Maharani",
    gender: "Perempuan",
    birthDate: "1998-11-10",
    age: 28,
    bloodType: "AB+",
    phone: "0878-9900-1122",
    address: "Jl. Gandaria Tengah IV No. 5, Jakarta Selatan",
    paymentType: "Asuransi Swasta",
    bpjsNumber: "PRU-88992019",
    allergies: "Alergi Debu & Sulfa",
    registeredDate: "2026-03-01",
    emergencyContact: "Ibu Hartati - 0878-9900-1123"
  },
  {
    id: "pat-5",
    mrn: "RM-2026-0005",
    nik: "3275080509170006",
    email: "kenzo@gmail.com",
    password: "pasien123",
    name: "Kenzo Alvaro Pratama",
    gender: "Laki-laki",
    birthDate: "2017-09-05",
    age: 9,
    bloodType: "O+",
    phone: "0812-7788-9900",
    address: "Jl. Wijaya Kusuma No. 20, Jakarta Selatan",
    paymentType: "BPJS Kesehatan",
    bpjsNumber: "0003456789012",
    allergies: "Tidak ada riwayat alergi",
    registeredDate: "2026-03-12",
    emergencyContact: "Rina (Ibu) - 0812-7788-9900"
  }
];

export const INITIAL_RECORDS = [
  {
    id: "rec-1",
    recordNumber: "EMR-2026-0089",
    date: "2026-10-08",
    time: "09:30",
    patientId: "pat-1",
    patientName: "Ahmad Dahlan Saputra",
    patientMrn: "RM-2026-0001",
    doctorName: "dr. Budi Santoso",
    doctorId: "doc-1",
    poliName: "Poli Umum",
    poliId: "poli-umum",
    paymentType: "BPJS Kesehatan",
    // SOAP FORMAT
    subjective: {
      chiefComplaint: "Batuk berdahak dan pilek sejak 3 hari yang lalu, badan terasa meriang dan tenggorokan gatal.",
      historyOfPresentIllness: "Pasien mengeluhkan demam ringan naik turun, batuk dengan dahak keputihan, pilek hidung tersumbat. Sudah minum air hangat dan paracetamol warung tapi belum berkurang.",
      allergies: "Alergi Penisilin (Amoxicillin dilarang)"
    },
    objective: {
      vitalSigns: {
        bloodPressure: "120/80",
        heartRate: 82,
        respiratoryRate: 19,
        temperature: 37.8,
        oxygenSaturation: 98,
        weight: 68,
        height: 170,
        bmi: 23.5,
        bmiStatus: "Normal"
      },
      physicalExam: "Faring hiperemis (+), pembesaran tonsil T1/T1 tenang. Rhonki -/-, Wheezing -/-. Abdomen supel."
    },
    assessment: {
      primaryDiagnosis: "J06.9 - Infeksi Saluran Pernapasan Akut (ISPA)",
      secondaryDiagnosis: "R50.9 - Demam Ringan",
      clinicalNotes: "ISPA ec suspek viral infection, kondisi umum baik, dehidrasi ringan."
    },
    plan: {
      prescriptions: [
        { medicineName: "Paracetamol 500 mg", dosage: "3 x 1 tablet sesudah makan", quantity: 10, note: "Bila demam / pusing" },
        { medicineName: "Cetirizine 10 mg", dosage: "1 x 1 tablet malam hari", quantity: 5, note: "Untuk pilek & alergi saluran napas" },
        { medicineName: "Vitamin C 500 mg", dosage: "1 x 1 tablet sesudah makan", quantity: 5, note: "Meningkatkan daya tahan tubuh" }
      ],
      actions: ["Pemeriksaan fisik TTV & THT", "Edukasi hidrasi & istirahat cukup"],
      education: "Istirahat cukup minimal 8 jam, minum air hangat minimal 2 liter per hari, gunakan masker bila keluar rumah, hindari minuman dingin dan gorengan.",
      followUp: "Kontrol kembali dalam 3-5 hari bila demam berlanjut atau sesak napas.",
      disposition: "Rawat Jalan (Pulang)"
    }
  },
  {
    id: "rec-2",
    recordNumber: "EMR-2026-0090",
    date: "2026-10-08",
    time: "10:15",
    patientId: "pat-3",
    patientName: "Haji Sudirman",
    patientMrn: "RM-2026-0003",
    doctorName: "dr. Aris Pratama, Sp.PD",
    doctorId: "doc-2",
    poliName: "Poli Penyakit Dalam",
    poliId: "poli-dalam",
    paymentType: "BPJS Kesehatan",
    subjective: {
      chiefComplaint: "Kontrol rutin tekanan darah dan gula darah. Mengeluh tengkuk terasa agak kaku pagi hari.",
      historyOfPresentIllness: "Pasien riwayat hipertensi 5 tahun, rutin minum obat amlodipine. 2 hari terakhir sering begadang karena acara keluarga, tensi naik.",
      allergies: "Alergi Seafood"
    },
    objective: {
      vitalSigns: {
        bloodPressure: "150/95",
        heartRate: 86,
        respiratoryRate: 20,
        temperature: 36.6,
        oxygenSaturation: 97,
        weight: 75,
        height: 165,
        bmi: 27.5,
        bmiStatus: "Kelebihan Berat Badan (Overweight)"
      },
      physicalExam: "Kepala leher: JVP 5-2 cmH2O. Cor S1 S2 reguler, murmur (-). Pulmo vesikuler normal. Ekstremitas edema pretibial (-)."
    },
    assessment: {
      primaryDiagnosis: "I10 - Hipertensi Esensial (Primer) Derajat 1 Tidak Terkontrol",
      secondaryDiagnosis: "E11.9 - DM Tipe 2 Terkontrol Baik",
      clinicalNotes: "Target tekanan darah < 130/80 mmHg. Evaluasi kepatuhan minum obat."
    },
    plan: {
      prescriptions: [
        { medicineName: "Amlodipine 5 mg", dosage: "1 x 1 tablet malam hari", quantity: 30, note: "Rutin setiap malam sebelum tidur" },
        { medicineName: "Metformin 500 mg", dosage: "2 x 1 tablet bersamaan makan", quantity: 60, note: "Pagi & malam sesudah makan" }
      ],
      actions: ["Pemeriksaan TTV & EKG skrining", "Cek Gula Darah Sewaktu (GDS: 135 mg/dL)"],
      education: "Diet rendah garam (< 1 sendok teh garam per hari), kurangi gorengan & santan, jalan santai 30 menit 3x seminggu, minum obat teratur jangan sampai putus obat.",
      followUp: "Kontrol ulang 30 hari kemudian untuk evaluasi profil lipid dan fungsi ginjal.",
      disposition: "Rawat Jalan (Pulang)"
    }
  },
  {
    id: "rec-3",
    recordNumber: "EMR-2026-0091",
    date: "2026-10-09",
    time: "08:45",
    patientId: "pat-2",
    patientName: "Dewi Lestari Kusuma",
    patientMrn: "RM-2026-0002",
    doctorName: "dr. Budi Santoso",
    doctorId: "doc-1",
    poliName: "Poli Umum",
    paymentType: "Mandiri / Umum",
    subjective: {
      chiefComplaint: "Nyeri ulu hati, mual dan perut terasa kembung sejak 2 hari yang lalu.",
      historyOfPresentIllness: "Keluhan nyeri perih seperti terbakar di ulu hati, memberat setelah terlambat makan dan minum kopi. Tidak ada muntah darah.",
      allergies: "Tidak ada alergi"
    },
    objective: {
      vitalSigns: {
        bloodPressure: "115/75",
        heartRate: 78,
        respiratoryRate: 18,
        temperature: 36.5,
        oxygenSaturation: 99,
        weight: 54,
        height: 160,
        bmi: 21.1,
        bmiStatus: "Normal"
      },
      physicalExam: "Abdomen: Nyeri tekan epigastrium (+), bising usus normal (+), hepar & lien tidak teraba."
    },
    assessment: {
      primaryDiagnosis: "K29.7 - Gastritis / Dispepsia Akut",
      secondaryDiagnosis: "-",
      clinicalNotes: "Sindrom dispepsia dipicu pola makan tidak teratur dan kafein."
    },
    plan: {
      prescriptions: [
        { medicineName: "Omeprazole 20 mg", dosage: "1 x 1 kapsul 30 menit sebelum makan pagi", quantity: 7, note: "Sebelum sarapan pagi" },
        { medicineName: "Antasida Doen", dosage: "3 x 1 tablet dikunyah 1 jam sebelum makan", quantity: 15, note: "Kunyah halus" }
      ],
      actions: ["Pemeriksaan fisik abdomen", "Edukasi nutrisi lambung"],
      education: "Makan tepat waktu porsi kecil tapi sering, hindari kopi, teh pekat, makanan pedas, asam dan bersoda.",
      followUp: "Bila nyeri hebat berlanjut atau muntah hitam segera ke IGD.",
      disposition: "Rawat Jalan (Pulang)"
    }
  }
];

export const INITIAL_QUEUES = [
  {
    id: "q-1",
    queueNumber: "U-001",
    patientId: "pat-1",
    patientName: "Ahmad Dahlan Saputra",
    patientMrn: "RM-2026-0001",
    poliId: "poli-umum",
    poliName: "Poli Umum",
    doctorName: "dr. Budi Santoso",
    status: "Selesai", // Menunggu, Sedang Diperiksa, Selesai, Dibatalkan
    arrivalTime: "08:15",
    paymentType: "BPJS Kesehatan"
  },
  {
    id: "q-2",
    queueNumber: "D-001",
    patientId: "pat-3",
    patientName: "Haji Sudirman",
    patientMrn: "RM-2026-0003",
    poliId: "poli-dalam",
    poliName: "Poli Penyakit Dalam",
    doctorName: "dr. Aris Pratama, Sp.PD",
    status: "Selesai",
    arrivalTime: "08:30",
    paymentType: "BPJS Kesehatan"
  },
  {
    id: "q-3",
    queueNumber: "U-002",
    patientId: "pat-2",
    patientName: "Dewi Lestari Kusuma",
    patientMrn: "RM-2026-0002",
    poliId: "poli-umum",
    doctorName: "dr. Budi Santoso",
    poliName: "Poli Umum",
    status: "Sedang Diperiksa",
    arrivalTime: "08:40",
    paymentType: "Mandiri / Umum"
  },
  {
    id: "q-4",
    queueNumber: "A-001",
    patientId: "pat-5",
    patientName: "Kenzo Alvaro Pratama",
    patientMrn: "RM-2026-0005",
    poliId: "poli-anak",
    poliName: "Poli Anak",
    doctorName: "dr. Siti Sarah, Sp.A",
    status: "Menunggu",
    arrivalTime: "09:10",
    paymentType: "BPJS Kesehatan"
  },
  {
    id: "q-5",
    queueNumber: "K-001",
    patientId: "pat-4",
    patientName: "Nadia Putri Maharani",
    patientMrn: "RM-2026-0004",
    poliId: "poli-kia",
    poliName: "Poli KIA & Kandungan",
    doctorName: "dr. Ratna Wulandari, Sp.OG",
    status: "Menunggu",
    arrivalTime: "09:25",
    paymentType: "Asuransi Swasta"
  }
];
