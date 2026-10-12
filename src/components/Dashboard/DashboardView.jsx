import React from 'react';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  Stethoscope, 
  UserPlus, 
  AlertCircle, 
  ChevronRight, 
  Pill,
  Calendar,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { CLINIC_POLIS } from '../../data/mockData';

export default function DashboardView({ 
  patients, 
  records, 
  queues, 
  medicines, 
  onNavigateTab, 
  onStartExam, 
  onNewPatient, 
  onNewRecord 
}) {
  const waitingQueues = queues.filter(q => q.status === 'Menunggu');
  const inProgressQueues = queues.filter(q => q.status === 'Sedang Diperiksa');
  const completedQueues = queues.filter(q => q.status === 'Selesai');

  // Low stock medicines (< 100)
  const lowStockMedicines = medicines.filter(m => m.stock < 100);

  // Top Diagnoses from actual records
  const diagnosisCount = {};
  records.forEach(r => {
    const diag = r.assessment?.primaryDiagnosis || 'Lainnya';
    diagnosisCount[diag] = (diagnosisCount[diag] || 0) + 1;
  });

  const topDiagnoses = Object.entries(diagnosisCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Sample 7-day visit chart data
  const visitTrend = [
    { day: 'Senin', count: 18 },
    { day: 'Selasa', count: 24 },
    { day: 'Rabu', count: 20 },
    { day: 'Kamis', count: 29 },
    { day: 'Jumat', count: 26 },
    { day: 'Sabtu', count: 14 },
    { day: 'Hari Ini', count: records.length || 8, current: true }
  ];
  const maxTrend = Math.max(...visitTrend.map(d => d.count), 30);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 text-white p-6 md:p-8 shadow-lg shadow-teal-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-600/40 border border-teal-400/30 text-teal-100 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistem Aktif • Rekam Medis Berstandar Kemenkes RI
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Selamat Bertugas di MediCare RME
            </h1>
            <p className="mt-2 text-sm text-teal-100/90 leading-relaxed">
              Kelola antrean poliklinik, pencatatan rekam medis standar SOAP, riwayat pasien terpadu, dan resep obat secara digital, cepat, dan akurat.
            </p>
          </div>

          {/* Quick Action Group in Banner */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNewRecord}
              className="px-4 py-2.5 bg-white text-teal-800 hover:bg-teal-50 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Input Rekam Medis (SOAP)</span>
            </button>
            <button
              onClick={onNewPatient}
              className="px-4 py-2.5 bg-teal-900/60 hover:bg-teal-900/80 border border-teal-500/40 text-white rounded-xl font-semibold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-teal-300" />
              <span>Daftar Pasien Baru</span>
            </button>
          </div>
        </div>

        {/* Background ambient decor */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <Activity className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Pasien */}
        <div 
          onClick={() => onNavigateTab('patients')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pasien Terdaftar</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{patients.length}</span>
            <span className="text-xs font-medium text-slate-500">Jiwa</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Terdata dalam basis RME</span>
          </div>
        </div>

        {/* Card 2: Total Berkas EMR */}
        <div 
          onClick={() => onNavigateTab('records')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Berkas Rekam Medis</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{records.length}</span>
            <span className="text-xs font-medium text-slate-500">Pemeriksaan</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-teal-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Format SOAP lengkap</span>
          </div>
        </div>

        {/* Card 3: Antrean Menunggu */}
        <div 
          onClick={() => onNavigateTab('queues')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Antrean Menunggu</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{waitingQueues.length}</span>
            <span className="text-xs font-medium text-slate-500">Pasien</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Di seluruh poli klinik</span>
          </div>
        </div>

        {/* Card 4: Selesai Diperiksa Hari Ini */}
        <div 
          onClick={() => onNavigateTab('queues')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Selesai Hari Ini</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{completedQueues.length}</span>
            <span className="text-xs font-medium text-slate-500">Pelayanan Selesai</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>+{inProgressQueues.length} sedang berlangsung</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Charts & Live Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visual Visit Trend & Diagnoses (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Tren Kunjungan Pasien (7 Hari Terakhir)</h3>
                <p className="text-xs text-slate-500">Jumlah pasien rawat jalan yang mendapatkan pelayanan medis</p>
              </div>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                Pekan Ini
              </span>
            </div>

            {/* SVG Visual Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
              {visitTrend.map((item, idx) => {
                const heightPercent = Math.max((item.count / maxTrend) * 100, 15);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-teal-700 transition">
                      {item.count}
                    </span>
                    <div className="w-full bg-slate-100 rounded-t-lg h-32 flex items-end overflow-hidden">
                      <div 
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-500 group-hover:opacity-90 ${
                          item.current 
                            ? 'bg-gradient-to-t from-teal-600 to-emerald-500 shadow-md shadow-teal-500/20' 
                            : 'bg-gradient-to-t from-slate-400 to-slate-300'
                        }`}
                      />
                    </div>
                    <span className={`text-[11px] truncate ${item.current ? 'font-bold text-teal-800' : 'text-slate-500'}`}>
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Diagnoses Table / Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">5 Besar Diagnosa Terbanyak (ICD-10)</h3>
                <p className="text-xs text-slate-500">Pola morbiditas penyakit pasien klinik</p>
              </div>
              <button 
                onClick={() => onNavigateTab('records')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
              >
                Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {topDiagnoses.length > 0 ? (
                topDiagnoses.map(([diag, count], idx) => {
                  const percent = Math.round((count / records.length) * 100) || 10;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-800 truncate max-w-[80%]">
                          {idx + 1}. {diag}
                        </span>
                        <span className="text-slate-500 font-medium">{count} kasus ({percent}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          style={{ width: `${percent}%` }}
                          className={`h-full rounded-full ${
                            idx === 0 ? 'bg-teal-500' :
                            idx === 1 ? 'bg-emerald-500' :
                            idx === 2 ? 'bg-sky-500' : 'bg-slate-400'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 py-3 text-center">Belum ada data diagnosa tercatat.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Active Live Queue & Medicine Warnings */}
        <div className="space-y-6">
          
          {/* Active Queue Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 className="text-sm font-bold text-slate-900">Antrean Poli Hari Ini</h3>
              </div>
              <button 
                onClick={() => onNavigateTab('queues')}
                className="text-xs text-teal-600 hover:underline font-semibold cursor-pointer"
              >
                Papan Lengkap
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {queues.slice(0, 4).map((q) => {
                const isExamining = q.status === 'Sedang Diperiksa';
                const isWaiting = q.status === 'Menunggu';
                return (
                  <div 
                    key={q.id}
                    className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                      isExamining 
                        ? 'border-emerald-300 bg-emerald-50/50' 
                        : isWaiting 
                          ? 'border-slate-200 bg-slate-50/70 hover:bg-slate-100' 
                          : 'border-slate-100 bg-white opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isExamining ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {q.queueNumber}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-800 truncate">
                          {q.patientName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {q.poliName} • {q.arrivalTime}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {isExamining ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Diperiksa
                        </span>
                      ) : isWaiting ? (
                        <button
                          onClick={() => onStartExam(q)}
                          className="px-2.5 py-1 text-[11px] font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-2xs transition cursor-pointer"
                        >
                          Periksa
                        </button>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                          Selesai
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {queues.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Tidak ada antrean saat ini.
                </div>
              )}
            </div>
          </div>

          {/* Pharmacy Low-Stock Alert */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Perhatian Stok Obat</h3>
              </div>
              <button 
                onClick={() => onNavigateTab('pharmacy')}
                className="text-xs text-amber-600 hover:underline font-semibold cursor-pointer"
              >
                Apotek
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {lowStockMedicines.length > 0 ? (
                lowStockMedicines.slice(0, 3).map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">{med.name}</span>
                      <div className="text-[10px] text-slate-500">{med.category}</div>
                    </div>
                    <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      Sisa {med.stock} {med.unit}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-emerald-600 py-2">Semua stok obat dalam kondisi aman.</p>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Recent Medical Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Rekam Medis Terbaru (SOAP)</h3>
            <p className="text-xs text-slate-500">Pencatatan medis yang baru saja diselesaikan</p>
          </div>
          <button
            onClick={() => onNavigateTab('records')}
            className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            Lihat Semua Berkas <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">No. EMR & Waktu</th>
                <th className="py-3 px-4">Pasien</th>
                <th className="py-3 px-4">Poli & Dokter</th>
                <th className="py-3 px-4">Keluhan Utama (S)</th>
                <th className="py-3 px-4">Diagnosa (A)</th>
                <th className="py-3 px-4 text-center">Tanda Vital (O)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {records.slice(0, 5).map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">
                    <div>{rec.recordNumber}</div>
                    <div className="text-[11px] text-slate-400 font-sans">{rec.date} • {rec.time}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{rec.patientName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{rec.patientMrn}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{rec.poliName}</div>
                    <div className="text-[11px] text-slate-500">{rec.doctorName}</div>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={rec.subjective?.chiefComplaint}>
                    {rec.subjective?.chiefComplaint || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-md font-semibold text-teal-800 bg-teal-50 border border-teal-200">
                      {rec.assessment?.primaryDiagnosis || '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-slate-600 font-medium">
                      TD: {rec.objective?.vitalSigns?.bloodPressure || '-'} | Suhu: {rec.objective?.vitalSigns?.temperature || '-'}°C
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
