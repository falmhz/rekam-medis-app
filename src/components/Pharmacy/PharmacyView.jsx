import React, { useState } from 'react';
import { 
  Pill, 
  Search, 
  Plus, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  Package, 
  Layers, 
  DollarSign, 
  CheckCircle2,
  Filter
} from 'lucide-react';

export default function PharmacyView({ 
  medicines, 
  onAddMedicine, 
  onEditMedicine, 
  onDeleteMedicine 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalStock = medicines.reduce((sum, m) => sum + (m.stock || 0), 0);
  const lowStockCount = medicines.filter(m => m.stock < 100).length;
  const criticalStockCount = medicines.filter(m => m.stock < 50).length;
  const totalValue = medicines.reduce((sum, m) => sum + ((m.stock || 0) * (m.price || 0)), 0);

  const categories = Array.from(new Set(medicines.map(m => m.category)));

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-6 h-6 text-teal-600" />
            Manajemen Farmasi & Apotek Klinik
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Katalog persediaan obat, pemantauan stok menipis, dan integrasi resep elektronik
          </p>
        </div>

        <button
          onClick={onAddMedicine}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Stok Obat Baru</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>Total Item Obat</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{medicines.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Jenis formularium</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>Total Butir / Unit</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{totalStock}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Seluruh persediaan</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>Stok Menipis (&lt; 100)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">{lowStockCount}</div>
          <div className="text-[11px] text-amber-600 mt-0.5">{criticalStockCount} kritis (&lt; 50)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>Estimasi Nilai Stok</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 mt-2 font-mono">
            Rp {totalValue.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Nilai perolehan</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Nama Obat atau Kategori..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-teal-600 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Kategori:</span>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 focus:outline-teal-600"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Obat</th>
                <th className="py-3 px-4">Kategori & Bentuk</th>
                <th className="py-3 px-4">Sisa Stok</th>
                <th className="py-3 px-4">Harga Satuan</th>
                <th className="py-3 px-4">Petunjuk Pakai Bawaan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMedicines.map((med) => {
                const isCritical = med.stock < 50;
                const isLow = med.stock < 100;

                return (
                  <tr key={med.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {med.name}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{med.category}</div>
                      <div className="text-[11px] text-slate-400">{med.form}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold font-mono text-[11px] ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isLow
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {med.stock} {med.unit}
                        {isCritical ? ' (Kritis)' : isLow ? ' (Menipis)' : ' (Aman)'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      Rp {med.price?.toLocaleString('id-ID')}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {med.dosageHint || '-'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEditMedicine(med)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition cursor-pointer"
                          title="Ubah Obat"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteMedicine(med.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Hapus Obat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredMedicines.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    <Pill className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">Tidak ada data obat ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
