import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  Clock, 
  Calendar, 
  Pill, 
  Printer, 
  ShieldAlert, 
  Heart, 
  Activity, 
  LogOut, 
  Plus, 
  CheckCircle2, 
  CreditCard, 
  MapPin, 
  Phone, 
  Stethoscope, 
  QrCode,
  AlertCircle
} from 'lucide-react';
import { CLINIC_INFO, CLINIC_POLIS, DOCTORS } from '../../data/mockData';

export default function PatientPortalView({ 
  currentPatient, 
  records, 
  queues, 
  onLogout, 
  onPrintRecord, 
  onRegisterQueue,
  showToast 
}) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'records' | 'queue'
  const [selectedPoliId, setSelectedPoliId] = useState('poli-umum');

  // Filter records belonging to this logged-in patient
  const myRecords = records.filter(
    r => r.patientId === currentPatient.id || r.patientMrn === currentPatient.mrn
  );

  // Active queues for this patient today
  const myTodayQueues = queues.filter(
    q => q.patientId === currentPatient.id || q.patientMrn === currentPatient.mrn
  );
  const activeQueue = myTodayQueues.find(q => q.status !== 'Selesai');

  // Latest vital signs from most recent medical record
  const latestRecord = myRecords[0] || null;
  const latestVitals = latestRecord?.objective?.vitalSigns || null;

  // Handle take online queue
  const handleTakeQueue = (e) => {
    e.preventDefault();
    const poli = CLINIC_POLIS.find(p => p.id === selectedPoliId) || CLINIC_POLIS[0];
    const doc = DOCTORS.find(d => d.poliId === selectedPoliId) || DOCTORS[0];

    // Compute queue number
    const existingPoli = queues.filter(q => q.queueNumber?.startsWith(poli.code));
    const nextNum = existingPoli.length + 1;
    const queueNumber = `${poli.code}-${String(nextNum).padStart(3, '0')}`;

    onRegisterQueue({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientMrn: currentPatient.mrn,
      paymentType: currentPatient.paymentType,
      poliId: poli.id,
      poliName: poli.name,
      doctorId: doc.id,
      doctorName: doc.name,
      queueNumber,
      status: 'Menunggu'
    });

    showToast(`Berhasil mendaftar antrean ${queueNumber} di ${poli.name}!`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased selection:bg-teal-500 selection:text-white">
      
      {/* PATIENT PORTAL TOPBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900 tracking-tight">
                  {CLINIC_INFO.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  Portal Pasien
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Layanan Informasi Rekam Medis & Antrean Mandiri
              </p>
            </div>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900">{currentPatient.name}</div>
              <div className="text-[11px] font-mono text-teal-700 font-semibold">{currentPatient.mrn}</div>
            </div>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              title="Keluar dari Portal Pasien"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* SUB-HEADER / TAB NAVIGATION */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto text-xs py-2">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-2 px-3.5 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Kartu & Ringkasan Saya</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`py-2 px-3.5 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'records'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Riwayat Rekam Medis ({myRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`py-2 px-3.5 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Antrean Poliklinik {activeQueue ? '(Aktif)' : ''}</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* TAB 1: SUMMARY & DIGITAL CARD */}
        {activeTab === 'summary' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-teal-200 font-semibold uppercase tracking-wider">
                  Selamat Datang di Portal Mandiri
                </span>
                <h1 className="text-2xl font-extrabold text-white mt-1">
                  Halo, {currentPatient.name}!
                </h1>
                <p className="text-xs text-teal-100 mt-1 max-w-xl">
                  Nomor Rekam Medis Anda adalah <b className="font-mono text-white">{currentPatient.mrn}</b>. Seluruh berkas riwayat medis, hasil diagnosa dokter, dan resep obat tersimpan aman di sini.
                </p>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('queue')}
                  className="px-4 py-2 bg-white text-teal-800 rounded-xl font-bold text-xs shadow transition hover:bg-teal-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-teal-600" />
                  <span>Daftar Antrean Hari Ini</span>
                </button>
              </div>
            </div>

            {/* Grid 2 Cols: Digital Card & Allergy/Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* DIGITAL PATIENT CARD */}
              <div className="bg-gradient-to-tr from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-teal-500/30 relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs uppercase tracking-wider text-teal-300">
                        {CLINIC_INFO.name}
                      </div>
                      <div className="text-[10px] text-slate-300">KARTU BEROBAT ELEKTRONIK</div>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white/10 border border-white/20">
                    {currentPatient.paymentType}
                  </span>
                </div>

                <div className="relative z-10 my-6 space-y-3">
                  <div>
                    <span className="text-[10px] text-teal-300 uppercase tracking-widest font-semibold">Nama Pasien</span>
                    <div className="text-xl font-extrabold text-white tracking-wide">{currentPatient.name}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-teal-300 block">No. Rekam Medis</span>
                      <span className="font-mono font-bold text-white text-sm">{currentPatient.mrn}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-teal-300 block">NIK</span>
                      <span className="font-mono font-semibold text-slate-200">{currentPatient.nik}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-teal-300 block">Gol. Darah</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                        {currentPatient.bloodType || 'O+'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1">
                    <QrCode className="w-4 h-4 text-teal-400" />
                    QR-Verified Faskes
                  </span>
                  <span>Lahir: {currentPatient.birthDate} ({currentPatient.age} thn)</span>
                </div>

                {/* Ambient glow */}
                <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />
              </div>

              {/* HEALTH SNAPSHOT & ALLERGY ALERT */}
              <div className="space-y-4">
                
                {/* Allergy Banner */}
                {currentPatient.allergies && currentPatient.allergies.toLowerCase() !== 'tidak ada' && currentPatient.allergies.toLowerCase() !== 'tidak ada alergi' ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 shadow-2xs">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-800 text-xs uppercase tracking-wide">
                        Peringatan Riwayat Alergi Anda:
                      </span>
                      <p className="text-rose-700 font-semibold text-xs mt-1">
                        {currentPatient.allergies}
                      </p>
                      <p className="text-[11px] text-rose-500 mt-1">
                        Selalu informasikan riwayat alergi ini kepada dokter atau apoteker saat periksa.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 shadow-2xs text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold">Status Alergi Bersih</span>
                      <p className="text-[11px] text-emerald-600">Tidak ada riwayat alergi obat berbahaya yang tercatat.</p>
                    </div>
                  </div>
                )}

                {/* Latest Vitals Snapshot */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <Stethoscope className="w-4 h-4 text-teal-600" />
                      Pemeriksaan Fisik Terakhir ({latestRecord?.date || 'Belum ada data'})
                    </span>
                    {latestRecord && (
                      <span className="text-[11px] text-teal-700 font-semibold">{latestRecord.poliName}</span>
                    )}
                  </div>

                  {latestVitals ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400">Tekanan Darah</span>
                        <div className="font-bold font-mono text-slate-900 mt-0.5">{latestVitals.bloodPressure} mmHg</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400">Denyut Nadi</span>
                        <div className="font-bold font-mono text-slate-900 mt-0.5">{latestVitals.heartRate} x/mnt</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400">Suhu Tubuh</span>
                        <div className="font-bold font-mono text-slate-900 mt-0.5">{latestVitals.temperature} °C</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400">Status IMT</span>
                        <div className="font-bold text-teal-700 mt-0.5">{latestVitals.bmi} ({latestVitals.bmiStatus})</div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-3 text-center">Belum ada rekam jejak tanda vital.</p>
                  )}
                </div>

                {/* Active Queue Card if any */}
                {activeQueue && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                        Antrean Aktif Hari Ini:
                      </span>
                      <div className="text-xl font-extrabold text-amber-900 font-mono mt-0.5">
                        {activeQueue.queueNumber} • {activeQueue.poliName}
                      </div>
                      <div className="text-xs text-amber-700">Status: <b>{activeQueue.status}</b> ({activeQueue.doctorName})</div>
                    </div>

                    <button
                      onClick={() => setActiveTab('queue')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Pantau
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MEDICAL RECORDS LIST */}
        {activeTab === 'records' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Riwayat Rekam Medis Saya</h2>
                <p className="text-xs text-slate-500">Seluruh berkas pemeriksaan dan salinan resep dokter yang pernah Anda jalani</p>
              </div>
            </div>

            {myRecords.length > 0 ? (
              <div className="space-y-4">
                {myRecords.map((rec) => (
                  <div 
                    key={rec.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <span className="font-mono font-bold text-xs text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                          {rec.recordNumber}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">
                          {rec.date} • {rec.time} WIB
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-700">
                        {rec.poliName} • <span className="text-slate-500">{rec.doctorName}</span>
                      </div>
                    </div>

                    {/* SOAP Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-800 block mb-0.5">Keluhan Pasien:</span>
                        <p className="text-slate-600 italic">"{rec.subjective?.chiefComplaint}"</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-800 block mb-0.5">Diagnosa Dokter (ICD-10):</span>
                        <p className="font-bold text-teal-800">{rec.assessment?.primaryDiagnosis}</p>
                      </div>

                      {/* Prescriptions */}
                      {rec.plan?.prescriptions && rec.plan.prescriptions.length > 0 && (
                        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 md:col-span-2">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1.5">
                            <Pill className="w-3.5 h-3.5 text-emerald-600" />
                            Resep Obat yang Diberikan:
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-700">
                            {rec.plan.prescriptions.map((rx, idx) => (
                              <li key={idx}>
                                <b className="text-slate-900">{rx.medicineName}</b> ({rx.dosage}) - {rx.quantity} {rx.note ? `• Catatan: ${rx.note}` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Doctor Education */}
                      {rec.plan?.education && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 md:col-span-2">
                          <span className="font-bold text-slate-800 block mb-0.5">Nasihat & Edukasi Dokter:</span>
                          <p className="text-slate-600">{rec.plan.education}</p>
                        </div>
                      )}
                    </div>

                    {/* Print Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onPrintRecord(rec)}
                        className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak / Simpan PDF Resume Medis</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700 text-sm">Belum ada riwayat rekam medis</p>
                <p className="text-xs text-slate-400 mt-1">
                  Kunjungan pemeriksaan dokter akan tercatat otomatis di sini setelah selesai diperiksa.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: QUEUE TRACKER & ONLINE REGISTRATION */}
        {activeTab === 'queue' && (
          <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            
            {/* Active Queue Display */}
            {activeQueue ? (
              <div className="bg-white p-6 rounded-3xl border-2 border-amber-300 shadow-lg text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  Antrean Sedang Berjalan
                </div>

                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold block">Nomor Antrean Anda</span>
                  <div className="text-5xl font-black text-amber-600 font-mono mt-1">
                    {activeQueue.queueNumber}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-1 text-xs">
                  <div className="font-bold text-slate-900 text-sm">{activeQueue.poliName}</div>
                  <div className="text-slate-600">{activeQueue.doctorName}</div>
                  <div className="text-amber-800 font-semibold pt-1">
                    Status: <span className="underline">{activeQueue.status}</span> (Masuk: {activeQueue.arrivalTime} WIB)
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Silakan menunggu hingga nomor Anda dipanggil di layar monitor dan speaker poliklinik.
                </p>
              </div>
            ) : (
              /* ONLINE QUEUE REGISTRATION FORM */
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Daftar Antrean Poliklinik Hari Ini
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pilih poli yang ingin dituju untuk mendapatkan nomor antrean online secara langsung
                  </p>
                </div>

                <form onSubmit={handleTakeQueue} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Pilih Poliklinik Tujuan
                    </label>
                    <select
                      value={selectedPoliId}
                      onChange={(e) => setSelectedPoliId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:outline-teal-600"
                    >
                      {CLINIC_POLIS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Kode: {p.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-500">Pasien Terdaftar:</span>
                    <div className="font-bold text-slate-800">{currentPatient.name} ({currentPatient.mrn})</div>
                    <div className="text-[11px] text-teal-700 font-medium">Jaminan: {currentPatient.paymentType}</div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Ambil Nomor Antrean Sekarang
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}
