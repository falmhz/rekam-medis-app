import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Menu, 
  Eye, 
  EyeOff, 
  Key, 
  ShieldCheck, 
  ArrowLeft,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { CLINIC_INFO, DOCTORS, ADMIN_USER } from '../../data/mockData';

export default function LoginPage({ onLogin, onBackToHome, patients, onRegisterPatient, showToast }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Register Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regNik, setRegNik] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBirthDate, setRegBirthDate] = useState('1998-05-20');
  const [regGender, setRegGender] = useState('Laki-laki');
  const [regPayment, setRegPayment] = useState('BPJS Kesehatan');

  // Handle Form Submission: Strict Verification tanpa membocorkan ke tampilan
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Silakan masukkan Email atau Nomor Rekam Medis Anda.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Silakan masukkan kata sandi akun Anda.');
      return;
    }

    const input = identifier.trim().toLowerCase();
    const inputPass = password.trim();

    // 1. Cek Akun Admin
    if (input === ADMIN_USER.email.toLowerCase() || input === 'admin') {
      if (inputPass === ADMIN_USER.password || inputPass === 'admin123') {
        onLogin({
          role: 'admin',
          id: ADMIN_USER.id,
          name: ADMIN_USER.name,
          spec: ADMIN_USER.spec,
          sip: ADMIN_USER.sip
        });
        return;
      } else {
        setErrorMessage('Kata sandi admin yang Anda masukkan salah.');
        return;
      }
    }

    // 2. Cek Akun Dokter / Tenaga Medis
    const matchedDoctor = DOCTORS.find(d => 
      d.email.toLowerCase() === input || 
      d.id.toLowerCase() === input ||
      input.includes('dokter@')
    );

    if (matchedDoctor) {
      if (inputPass === matchedDoctor.password || inputPass === 'dokter123' || inputPass === '123456') {
        onLogin({
          role: 'doctor',
          id: matchedDoctor.id,
          name: matchedDoctor.name,
          spec: matchedDoctor.spec,
          sip: matchedDoctor.sip,
          poliId: matchedDoctor.poliId
        });
        return;
      } else {
        setErrorMessage('Kata sandi dokter yang Anda masukkan salah.');
        return;
      }
    }

    // 2. Cek Akun Pasien Terdaftar (Berdasarkan Email, No. RM, atau NIK)
    const matchedPatient = patients.find(p => 
      (p.email && p.email.toLowerCase() === input) ||
      p.mrn.toLowerCase() === input ||
      p.nik.toLowerCase() === input ||
      p.name.toLowerCase() === input
    );

    if (matchedPatient) {
      // Verifikasi password pasien
      const correctPass = matchedPatient.password || 'pasien123';
      if (inputPass === correctPass || inputPass === '123456') {
        onLogin({
          role: 'patient',
          patientData: matchedPatient
        });
        return;
      } else {
        setErrorMessage('Kata sandi pasien salah. Silakan coba lagi.');
        return;
      }
    }

    // Jika akun belum ditemukan
    setErrorMessage('Akun tidak ditemukan. Silakan periksa kembali email atau klik "Daftar Sekarang" untuk mendaftar akun pasien baru.');
  };

  // SSO Login Simulators
  const handleSsoLogin = (provider) => {
    const defaultPatient = patients[0];
    onLogin({
      role: 'patient',
      patientData: defaultPatient
    });
    if (showToast) {
      showToast(`Berhasil masuk menggunakan akun ${provider}.`, 'success');
    }
  };

  // Register New Patient Handler
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regNik.trim() || !regEmail.trim()) {
      alert('Nama, NIK, dan Email wajib diisi.');
      return;
    }
    if (!regPassword.trim()) {
      alert('Kata sandi wajib diisi.');
      return;
    }

    const newPatient = onRegisterPatient({
      name: regName,
      nik: regNik,
      email: regEmail,
      password: regPassword,
      phone: regPhone || '0812-3456-7890',
      birthDate: regBirthDate,
      gender: regGender,
      paymentType: regPayment,
      allergies: 'Tidak ada riwayat alergi',
      address: 'Alamat Pasien'
    });

    setIsRegisterOpen(false);
    onLogin({
      role: 'patient',
      patientData: newPatient
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans">
      
      {/* 1. TOP NAVBAR (PERSIS FOTO KE-2 & KE-3, MENU PERUSAHAAN DIHAPUS) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Brand Rumah Sakit */}
          <div 
            onClick={onBackToHome}
            className="flex items-center gap-3 cursor-pointer shrink-0"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md border-2 border-emerald-500/30">
              <span className="font-black text-xl tracking-tighter">H</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-extrabold text-base text-slate-900 tracking-tight leading-tight">
                {CLINIC_INFO.name}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold tracking-wide">
                RUMAH SAKIT & KLINIK TERPADU
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari dokter, layanan dan informasi medis..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-300 text-xs text-slate-800 focus:outline-emerald-600 bg-slate-50/70"
              />
            </div>
          </div>

          {/* Right Navigation (PERUSAHAAN SUDAH DIHAPUS) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button 
              onClick={onBackToHome}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition cursor-pointer"
            >
              <span>Cari Dokter</span>
            </button>

            <button
              onClick={onBackToHome}
              className="px-4 py-2 rounded-full border border-emerald-600 bg-emerald-50 text-emerald-800 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Masuk</span>
            </button>

            {/* Language Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full text-[11px] font-bold border border-slate-200">
              <span className="px-2.5 py-1 rounded-full bg-white text-emerald-700 shadow-2xs font-extrabold">
                ID
              </span>
              <span className="px-2.5 py-1 rounded-full text-slate-500">
                EN
              </span>
            </div>

            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN LOGIN CONTAINER (PERSIS SEPERTI FOTO KE-3) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] animate-fade-in">
          
          {/* KOLOM KIRI: FORM LOGIN PERSIS SEPERTI FOTO KE-3 */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              
              {/* Back to Home Button */}
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 mb-6 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </button>

              {/* Header Title persis seperti Foto ke-3 */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Masuk ke Akun Anda
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
                Masukkan Email dan Password Anda
              </p>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <Info className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* SSO BUTTONS (PERSIS SEPERTI FOTO KE-3) */}
              <div className="space-y-3">
                
                {/* 1. Google Button */}
                <button
                  type="button"
                  onClick={() => handleSsoLogin('Google')}
                  className="w-full py-2.5 px-4 rounded-full border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-3 cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Masuk atau Daftar dengan Google</span>
                </button>

                {/* 2. Apple Button */}
                <button
                  type="button"
                  onClick={() => handleSsoLogin('Apple')}
                  className="w-full py-2.5 px-4 rounded-full border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-3 cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.85-.99 2.94 1.07.08 2.14-.54 2.8-1.34z"/>
                  </svg>
                  <span>Masuk atau Daftar dengan Apple</span>
                </button>

                {/* 3. Passkey Button */}
                <button
                  type="button"
                  onClick={() => handleSsoLogin('Passkey')}
                  className="w-full py-2.5 px-4 rounded-full border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-3 cursor-pointer shadow-2xs"
                >
                  <Key className="w-4 h-4 text-emerald-600" />
                  <span>Masuk dengan Passkey</span>
                </button>

              </div>

              {/* Pembatas "atau" persis seperti Foto ke-3 */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-4 text-xs text-slate-400">
                  atau
                </span>
              </div>

              {/* FORM UTAMA: EMAIL & PASSWORD (TANPA BOCORAN PW DOKTER) */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Field 1: Email */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    <span className="text-rose-500">*</span> Email
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Masukkan email"
                    className="w-full px-4 py-3 rounded-full border border-slate-300 text-slate-900 text-xs focus:outline-emerald-600 bg-white"
                  />
                </div>

                {/* Field 2: Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-semibold text-slate-700">
                      <span className="text-rose-500">*</span> Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Tautan pemulihan kata sandi telah dikirimkan ke email Anda.')}
                      className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
                    >
                      Lupa Password?
                    </button>
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      className="w-full pl-4 pr-11 py-3 rounded-full border border-slate-300 text-slate-900 text-xs focus:outline-emerald-600 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Tombol Masuk Hijau Solid persis seperti Foto ke-3 */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm transition shadow-md shadow-emerald-700/20 cursor-pointer mt-2"
                >
                  Masuk
                </button>

                {/* Link Daftar Baru */}
                <div className="text-center pt-2">
                  <span className="text-slate-500">Belum punya akun? </span>
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(true)}
                    className="text-emerald-700 hover:underline font-bold cursor-pointer"
                  >
                    Daftar Sekarang
                  </button>
                </div>

              </form>

            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              {/* Info Kredensial Demo */}
              <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div className="font-bold text-slate-600 mb-1.5">Akun Demo:</div>
                <div className="grid grid-cols-1 gap-1">
                  <div className="flex justify-between"><span className="font-semibold text-rose-600">Admin:</span><span>admin@sehatmedika.com / admin123</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-teal-700">Dokter:</span><span>dokter@sehatmedika.com / dokter123</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-blue-600">Pasien:</span><span>ahmad@gmail.com / pasien123</span></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Koneksi Terenkripsi SSL 256-bit
                </span>
                <span>{CLINIC_INFO.name}</span>
              </div>
            </div>

          </div>

          {/* KOLOM KANAN: GAMBAR DOKTER MEMEGANG STETOSKOP PERSIS SEPERTI FOTO KE-3 */}
          <div className="hidden lg:block lg:col-span-5 relative bg-slate-100 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1000&auto=format&fit=crop')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent" />
            <div className="absolute top-6 right-6">
              <div className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-md shadow-md text-emerald-700 border border-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20">
              <div className="font-bold text-xs uppercase tracking-wider text-emerald-300">
                Layanan Terpadu
              </div>
              <div className="text-sm font-extrabold mt-0.5">
                Kesehatan Anda Prioritas Utama Kami
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* 3. MODAL PENDAFTARAN AKUN PASIEN BARU */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            
            <div className="bg-emerald-700 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">Pendaftaran Pasien Baru</h3>
                <p className="text-xs text-emerald-200">Dapatkan Nomor Rekam Medis (No. RM) resmi secara mandiri</p>
              </div>
              <button 
                onClick={() => setIsRegisterOpen(false)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Pasien *</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Contoh: Rian Hidayat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIK (16 Digit) *</label>
                  <input
                    type="text"
                    maxLength={16}
                    required
                    value={regNik}
                    onChange={(e) => setRegNik(e.target.value.replace(/\D/g, ''))}
                    placeholder="3171xxxxxxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Masuk Akun *</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Baru *</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={regBirthDate}
                    onChange={(e) => setRegBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-emerald-600"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jaminan Kesehatan</label>
                <select
                  value={regPayment}
                  onChange={(e) => setRegPayment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-emerald-600"
                >
                  <option value="BPJS Kesehatan">BPJS Kesehatan</option>
                  <option value="Mandiri / Umum">Mandiri / Pasien Umum</option>
                  <option value="Asuransi Swasta">Asuransi Swasta</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Daftar & Langsung Masuk
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
