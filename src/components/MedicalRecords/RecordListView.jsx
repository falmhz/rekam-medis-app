import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Stethoscope, 
  Printer, 
  Edit, 
  Trash2, 
  Filter, 
  Eye, 
  Calendar,
  Pill,
  ChevronRight
} from 'lucide-react';
import { CLINIC_POLIS } from '../../data/mockData';

export default function RecordListView({ 
  records, 
  onNewRecord, 
  onEditRecord, 
  onDeleteRecord, 
  onPrintRecord 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPoli, setFilterPoli] = useState('ALL');

  const filteredRecords = records.filter((rec) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      rec.recordNumber.toLowerCase().includes(q) ||
      rec.patientName.toLowerCase().includes(q) ||
      rec.patientMrn.toLowerCase().includes(q) ||
      (rec.assessment?.primaryDiagnosis || '').toLowerCase().includes(q) ||
      (rec.subjective?.chiefComplaint || '').toLowerCase().includes(q);

    const matchesPoli = filterPoli === 'ALL' || rec.poliId === filterPoli || rec.poliName === filterPoli;

    return matchesSearch && matchesPoli;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            Berkas Rekam Medis Elektronik (RME)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar seluruh riwayat pemeriksaan klinis pasien berstandar SOAP Kementerian Kesehatan
          </p>
        </div>

        <button
          onClick={onNewRecord}
          className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Stethoscope className="w-4 h-4" />
          <span>+ Input Pemeriksaan (SOAP) Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari No. EMR, Nama, No. RM, atau Diagnosa..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-teal-600 bg-slate-50/50"
          />
        </div>

        {/* Poli Filter */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Poli:</span>
          </div>

          <select
            value={filterPoli}
            onChange={(e) => setFilterPoli(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 focus:outline-teal-600"
          >
            <option value="ALL">Semua Poliklinik</option>
            {CLINIC_POLIS.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">No. EMR & Tanggal</th>
                <th className="py-3 px-4">Pasien & No. RM</th>
                <th className="py-3 px-4">Poliklinik & Dokter</th>
                <th className="py-3 px-4">Keluhan (S) & TTV (O)</th>
                <th className="py-3 px-4">Diagnosa (A)</th>
                <th className="py-3 px-4">Resep Obat (P)</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.map((rec) => {
                const rxCount = rec.plan?.prescriptions?.length || 0;
                return (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition group">
                    {/* No. EMR & Date */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                      <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {rec.recordNumber}
                      </span>
                      <div className="text-[11px] text-slate-400 font-sans mt-1">
                        {rec.date} • {rec.time} WIB
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{rec.patientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {rec.patientMrn} • <span className="font-sans text-teal-700">{rec.paymentType}</span>
                      </div>
                    </td>

                    {/* Poli & Doctor */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{rec.poliName}</div>
                      <div className="text-[11px] text-slate-500">{rec.doctorName}</div>
                    </td>

                    {/* Subjektif & Objektif */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="truncate font-medium text-slate-800" title={rec.subjective?.chiefComplaint}>
                        S: {rec.subjective?.chiefComplaint || '-'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        TD: {rec.objective?.vitalSigns?.bloodPressure || '-'} | Suhu: {rec.objective?.vitalSigns?.temperature || '-'}°C
                      </div>
                    </td>

                    {/* Asesmen / Diagnosa */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <span className="inline-block px-2 py-0.5 rounded-md font-bold text-teal-800 bg-teal-50 border border-teal-200 truncate" title={rec.assessment?.primaryDiagnosis}>
                        {rec.assessment?.primaryDiagnosis || '-'}
                      </span>
                    </td>

                    {/* Resep */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {rxCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Pill className="w-3 h-3 text-emerald-600" />
                          {rxCount} Resep Obat
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Tidak ada resep</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Cetak Resume Medis */}
                        <button
                          onClick={() => onPrintRecord(rec)}
                          className="p-1.5 rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 hover:text-teal-900 border border-teal-200 transition cursor-pointer"
                          title="Cetak Resume Medis & Resep (PDF / Print)"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Edit Record */}
                        <button
                          onClick={() => onEditRecord(rec)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition cursor-pointer"
                          title="Ubah Berkas Rekam Medis"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Record */}
                        <button
                          onClick={() => onDeleteRecord(rec.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Hapus Rekam Medis"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">Tidak ada berkas rekam medis ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1">Gunakan tombol "+ Input Pemeriksaan Baru" untuk mencatat rekam medis.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan <b>{filteredRecords.length}</b> dari total <b>{records.length}</b> berkas pemeriksaan</span>
        </div>
      </div>

    </div>
  );
}
