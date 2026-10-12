import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  FileText, 
  Edit, 
  Trash2, 
  ListOrdered, 
  ShieldAlert, 
  Filter, 
  ChevronRight,
  Eye,
  Stethoscope
} from 'lucide-react';

export default function PatientListView({ 
  patients, 
  onAddPatient, 
  onEditPatient, 
  onDeletePatient, 
  onViewDetail, 
  onStartNewSoap, 
  onAddToQueue 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPayment, setFilterPayment] = useState('ALL');
  const [filterGender, setFilterGender] = useState('ALL');

  // Filtered patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.nik.includes(searchQuery) ||
      patient.phone.includes(searchQuery);

    const matchesPayment = filterPayment === 'ALL' || patient.paymentType === filterPayment;
    const matchesGender = filterGender === 'ALL' || patient.gender === filterGender;

    return matchesSearch && matchesPayment && matchesGender;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            Manajemen Data Pasien
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Database rekam medis pasien terdaftar, identitas kependudukan, dan jaminan kesehatan
          </p>
        </div>

        <button
          onClick={onAddPatient}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Tambah Pasien Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Nama, No. RM, NIK, atau Telepon..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-teal-600 bg-slate-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Jaminan:</span>
          </div>

          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 focus:outline-teal-600"
          >
            <option value="ALL">Semua Jaminan</option>
            <option value="BPJS Kesehatan">BPJS Kesehatan</option>
            <option value="Mandiri / Umum">Mandiri / Umum</option>
            <option value="Asuransi Swasta">Asuransi Swasta</option>
          </select>

          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 focus:outline-teal-600"
          >
            <option value="ALL">Semua Gender</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">No. Rekam Medis</th>
                <th className="py-3 px-4">Nama & NIK</th>
                <th className="py-3 px-4">Gender & Usia</th>
                <th className="py-3 px-4">Jaminan Pembayaran</th>
                <th className="py-3 px-4">Riwayat Alergi</th>
                <th className="py-3 px-4">Kontak & Alamat</th>
                <th className="py-3 px-4 text-center">Tindakan / Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPatients.map((patient) => {
                const hasAllergy = 
                  patient.allergies && 
                  patient.allergies.toLowerCase() !== 'tidak ada' && 
                  patient.allergies.toLowerCase() !== 'tidak ada alergi';

                return (
                  <tr key={patient.id} className="hover:bg-slate-50/80 transition group">
                    {/* No. RM */}
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-700 whitespace-nowrap">
                      <span className="bg-teal-50 px-2 py-1 rounded-md border border-teal-200">
                        {patient.mrn}
                      </span>
                    </td>

                    {/* Nama & NIK */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {patient.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        NIK: {patient.nik}
                      </div>
                    </td>

                    {/* Gender & Usia */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{patient.gender}</div>
                      <div className="text-[11px] text-slate-500">
                        {patient.age} tahun ({patient.bloodType || 'Gol. -'})
                      </div>
                    </td>

                    {/* Jaminan */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        patient.paymentType === 'BPJS Kesehatan'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : patient.paymentType === 'Asuransi Swasta'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {patient.paymentType}
                      </span>
                      {patient.bpjsNumber && patient.bpjsNumber !== '-' && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {patient.bpjsNumber}
                        </div>
                      )}
                    </td>

                    {/* Alergi Alert */}
                    <td className="py-3.5 px-4 max-w-[180px]">
                      {hasAllergy ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 truncate" title={patient.allergies}>
                          <ShieldAlert className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="truncate">{patient.allergies}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Tidak ada</span>
                      )}
                    </td>

                    {/* Kontak & Alamat */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="font-medium text-slate-800">{patient.phone}</div>
                      <div className="text-[11px] text-slate-400 truncate" title={patient.address}>
                        {patient.address || '-'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Detail Profil */}
                        <button
                          onClick={() => onViewDetail(patient)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition cursor-pointer"
                          title="Lihat Riwayat & Profil Medis Pasien"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Input SOAP Baru */}
                        <button
                          onClick={() => onStartNewSoap(patient)}
                          className="p-1.5 rounded-lg text-teal-600 hover:text-teal-800 hover:bg-teal-100 transition cursor-pointer"
                          title="Input Rekam Medis (SOAP) Pasien Ini"
                        >
                          <Stethoscope className="w-4 h-4" />
                        </button>

                        {/* Daftarkan ke Antrean Poli */}
                        <button
                          onClick={() => onAddToQueue(patient)}
                          className="p-1.5 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-100 transition cursor-pointer"
                          title="Daftarkan ke Antrean Poli Hari Ini"
                        >
                          <ListOrdered className="w-4 h-4" />
                        </button>

                        {/* Edit Data Pasien */}
                        <button
                          onClick={() => onEditPatient(patient)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition cursor-pointer"
                          title="Ubah Data Pasien"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Hapus Pasien */}
                        <button
                          onClick={() => onDeletePatient(patient.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Hapus Data Pasien"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">Tidak ditemukan data pasien</p>
                    <p className="text-xs text-slate-400 mt-1">Coba kata kunci pencarian lain atau tambahkan pasien baru.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan <b>{filteredPatients.length}</b> dari total <b>{patients.length}</b> pasien</span>
        </div>
      </div>

    </div>
  );
}
