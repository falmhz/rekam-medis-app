import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  User, 
  Menu, 
  Stethoscope, 
  Heart, 
  PhoneCall, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  CheckCircle2,
  X,
  Sparkles,
  MapPin
} from 'lucide-react';
import { CLINIC_INFO, CLINIC_POLIS, DOCTORS, ICD10_LIST } from '../../data/mockData';

export default function HospitalLandingPage({ onOpenLogin, onOpenRegister }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState('ID');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // SMART SEARCH: Cari dokter berdasarkan nama, spesialisasi, poli, atau penyakit/gejala medis
  const searchResults = DOCTORS.filter((doc) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase().trim();

    // 1. Cocokkan nama dokter
    const matchName = doc.name.toLowerCase().includes(q);

    // 2. Cocokkan spesialisasi & nama poli
    const matchSpec = doc.spec.toLowerCase().includes(q);
    const matchPoli = (doc.poliName || '').toLowerCase().includes(q);

    // 3. Cocokkan daftar penyakit / keluhan klinis yang ditangani dokter ini
    const matchDisease = (doc.diseasesHandled || []).some(d => 
      d.toLowerCase().includes(q) || q.includes(d.toLowerCase())
    );

    return matchName || matchSpec || matchPoli || matchDisease;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans">
      
      {/* 1. TOP NAVBAR (PERSIS FOTO KE-2, MENU PERUSAHAAN DIHAPUS) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Brand Rumah Sakit */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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

          {/* INTERACTIVE SEARCH BAR (DESKTOP) */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-lg mx-4 relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Cari penyakit (misal: penyakit dalam, maag, gigi, flu, anak)..."
                className="w-full pl-10 pr-10 py-2.5 rounded-full border border-slate-300 text-xs text-slate-800 focus:outline-emerald-600 bg-slate-50/70 hover:bg-white focus:bg-white transition shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* LIVE SEARCH RESULTS DROPDOWN MODAL */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-scale-in max-h-[75vh] overflow-y-auto">
                <div className="p-3 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Hasil Pencarian: "{searchQuery}"
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {searchResults.length} Dokter Ditemukan
                  </span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100 p-2">
                    {searchResults.map((doc) => (
                      <div 
                        key={doc.id}
                        className="p-3.5 hover:bg-slate-50/80 rounded-xl transition flex items-start justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <img 
                            src={doc.photoUrl} 
                            alt={doc.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition">
                              {doc.name}
                            </h4>
                            <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                              {doc.spec} • {doc.poliName}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{doc.schedule}</span>
                            </div>

                            {/* Badge penyakit yang cocok */}
                            <div className="mt-2 flex flex-wrap gap-1">
                              {doc.diseasesHandled.slice(0, 4).map((d, idx) => (
                                <span 
                                  key={idx} 
                                  className={`text-[9px] px-2 py-0.5 rounded-md font-medium ${
                                    d.toLowerCase().includes(searchQuery.toLowerCase())
                                      ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={onOpenLogin}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shrink-0 transition shadow-2xs cursor-pointer mt-1"
                        >
                          Daftar Janji
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 space-y-1">
                    <p className="font-bold text-slate-700">Tidak ditemukan dokter untuk keluhan "{searchQuery}"</p>
                    <p className="text-[11px] text-slate-400">
                      Coba kata kunci: <b>penyakit dalam</b>, <b>lambung / maag</b>, <b>gigi</b>, <b>anak</b>, <b>kandungan / hamil</b>, atau <b>flu</b>.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Navigation Items (PERUSAHAAN SUDAH DIHAPUS) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* Link Cari Dokter */}
            <a 
              href="#poli-section"
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 cursor-pointer transition"
            >
              <span>Cari Dokter</span>
            </a>

            {/* Tombol Masuk / Login */}
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-full border border-slate-300 hover:border-emerald-600 bg-white hover:bg-emerald-50/50 text-slate-800 hover:text-emerald-800 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Masuk</span>
            </button>

            {/* Language Switcher Pill (ID | EN) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full text-[11px] font-bold border border-slate-200">
              <button
                onClick={() => setLang('ID')}
                className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                  lang === 'ID' ? 'bg-white text-emerald-700 shadow-2xs font-extrabold' : 'text-slate-500'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLang('EN')}
                className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                  lang === 'EN' ? 'bg-white text-emerald-700 shadow-2xs font-extrabold' : 'text-slate-500'
                }`}
              >
                EN
              </button>
            </div>

            {/* Hamburger Menu Mobile */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Mobile Search Input & Results */}
        <div className="md:hidden px-4 pb-3 relative">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari penyakit (penyakit dalam, maag, gigi)..."
              className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-300 text-xs text-slate-800 focus:outline-emerald-600 bg-slate-50"
            />
          </div>

          {searchQuery.trim() && (
            <div className="mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 max-h-60 overflow-y-auto text-xs">
              {searchResults.length > 0 ? (
                searchResults.map(doc => (
                  <div key={doc.id} onClick={onOpenLogin} className="p-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[10px] text-emerald-700">{doc.spec}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">Pilih &rarr;</span>
                  </div>
                ))
              ) : (
                <p className="p-2 text-slate-400 text-center text-[11px]">Tidak ada dokter ditemukan.</p>
              )}
            </div>
          )}
        </div>
      </header>

      {/* 2. HERO SECTION PERSIS SEPERTI FOTO KE-2 */}
      <section className="relative min-h-[520px] md:min-h-[580px] flex items-end justify-start overflow-hidden bg-slate-900">
        
        {/* Background Image: Dokter memeriksa tensi pasien */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-102"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1920&auto=format&fit=crop')`
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-900/20" />

        {/* Content Box (Bottom Left sesuai Foto ke-2) */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 pt-32">
          <div className="max-w-2xl space-y-4">
            
            <div className="text-white text-base sm:text-lg font-medium drop-shadow-md flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Dengan Senang Hati</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
              Memberikan Upaya Terbaik
            </h1>

            <p className="text-sm sm:text-base text-slate-200/90 max-w-xl font-normal leading-relaxed drop-shadow">
              Pelayanan kesehatan prima dengan dokter spesialis berpengalaman, fasilitas modern, rekam medis digital terpadu, dan layanan gawat darurat 24 jam.
            </p>

            {/* Tombol Aksi Sesuai Foto ke-2 */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              
              <a
                href="#poli-section"
                className="px-5 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-black/20 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-emerald-700" />
                <span>Cari Dokter</span>
              </a>

              <a
                href="#fasilitas-section"
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/40 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Fasilitas Unggulan</span>
              </a>

              <a
                href="#igd-section"
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/40 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>IGD 24 Jam</span>
              </a>

            </div>

          </div>
        </div>

      </section>

      {/* 3. QUICK SERVICE BAR */}
      <section className="bg-emerald-800 text-white py-6 border-b border-emerald-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700/80 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <div className="font-bold text-sm">Pendaftaran Online</div>
                <div className="text-xs text-emerald-200">Ambil nomor antrean mandiri</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700/80 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <div className="font-bold text-sm">Rekam Medis Digital</div>
                <div className="text-xs text-emerald-200">SatuSehat Kemenkes RI ready</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700/80 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <div className="font-bold text-sm">Laboratorium & Obat</div>
                <div className="text-xs text-emerald-200">E-Resep terintegrasi faskes</div>
              </div>
            </div>

            <div className="flex items-center justify-start lg:justify-end">
              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-emerald-900 font-extrabold text-xs hover:bg-emerald-50 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Masuk ke Akun Anda</span>
                <ArrowRight className="w-4 h-4 text-emerald-700" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 4. DAFTAR POLIKLINIK & DOKTER SPESIALIS */}
      <section id="poli-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Fasilitas Pelayanan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Poliklinik & Dokter Spesialis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Ketik keluhan atau penyakit Anda di kolom pencarian atas untuk menemukan dokter spesialis yang tepat
          </p>
        </div>

        {/* Poliklinik Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CLINIC_POLIS.map((poli) => (
            <div 
              key={poli.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 shadow-2xs hover:shadow-md transition text-center space-y-3 group cursor-pointer"
              onClick={onOpenLogin}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white mx-auto flex items-center justify-center transition">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                  {poli.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">Kode Antrean: {poli.code}</p>
              </div>
              <button 
                className="w-full py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50/80 group-hover:bg-emerald-100 transition"
              >
                Daftar Antrean &rarr;
              </button>
            </div>
          ))}
        </div>

        {/* Tim Dokter Kami Lengkap */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tim Dokter Spesialis Kami</h3>
              <p className="text-xs text-slate-500">Dokter terverifikasi dengan Surat Izin Praktik (SIP) resmi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOCTORS.map((doc) => (
              <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <img 
                    src={doc.photoUrl} 
                    alt={doc.name} 
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">{doc.name}</h4>
                    <div className="text-xs text-emerald-700 font-semibold mt-0.5">{doc.spec}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{doc.sip}</div>
                    <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{doc.schedule}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Keahlian & Penyakit:</span>
                  <div className="flex flex-wrap gap-1">
                    {doc.diseasesHandled.slice(0, 5).map((dis, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {dis}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onOpenLogin}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Daftar Konsultasi Dokter</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 5. FASILITAS UNGGULAN & IGD 24 JAM */}
      <section id="igd-section" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Siaga 24 Jam Non-Stop
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Instalasi Gawat Darurat (IGD) & Ambulans Siaga
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tim medis gawat darurat dan ambulans siaga 24/7 siap melayani penanganan darurat dengan peralatan penunjang hidup terkini dan respons cepat.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <a
                href="tel:02178901234"
                className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-rose-600/30"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Hotline IGD: {CLINIC_INFO.phone}</span>
              </a>
            </div>
          </div>

          <div id="fasilitas-section" className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Keunggulan Fasilitas {CLINIC_INFO.name}
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pencatatan Rekam Medis Elektronik (RME) standar Kementerian Kesehatan RI.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Antrean Poliklinik Real-time dengan notifikasi suara panggilan pasien.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Portal Pasien Mandiri untuk cetak resume medis dan e-resep kapan saja.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Apotek & Farmasi obat esensial klinik lengkap dan terstandarisasi.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-sm">
                H
              </div>
              <span className="font-bold text-base">{CLINIC_INFO.name}</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              {CLINIC_INFO.address}
            </p>
            <p className="text-slate-500 font-mono text-[11px]">
              {CLINIC_INFO.legalNumber}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Layanan Klinis</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Poli Penyakit Dalam</li>
              <li>Poli Umum & Gigi</li>
              <li>Poli Anak & Imunisasi</li>
              <li>Poli KIA & Kandungan</li>
              <li>Laboratorium & Farmasi</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Kontak & Informasi</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Telepon: {CLINIC_INFO.phone}</li>
              <li>Email: {CLINIC_INFO.email}</li>
              <li>Ambulans: 24 Jam Siaga</li>
              <li>Jam Pelayanan: 07:00 - 21:00 WIB</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <span>&copy; {new Date().getFullYear()} {CLINIC_INFO.name}. Hak Cipta Dilindungi Undang-Undang.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Kebijakan Privasi Medis</span>
            <span className="hover:text-white cursor-pointer">Syarat & Ketentuan Pasien</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
