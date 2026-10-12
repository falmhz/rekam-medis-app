import React, { useState, useEffect } from 'react';
import { X, Pill, Package, DollarSign, Tag } from 'lucide-react';

export default function MedicineModal({ isOpen, onClose, onSave, medicineToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Analgesik / Antipiretik',
    form: 'Tablet',
    stock: 100,
    unit: 'Tablet',
    price: 2000,
    dosageHint: '3 x 1 tablet sesudah makan'
  });

  useEffect(() => {
    if (medicineToEdit) {
      setFormData(medicineToEdit);
    } else {
      setFormData({
        name: '',
        category: 'Analgesik / Antipiretik',
        form: 'Tablet',
        stock: 100,
        unit: 'Tablet',
        price: 2000,
        dosageHint: '3 x 1 tablet sesudah makan'
      });
    }
  }, [medicineToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave({
      ...(medicineToEdit || {}),
      ...formData,
      stock: Number(formData.stock),
      price: Number(formData.price)
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-in my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Pill className="w-5 h-5 text-teal-300" />
            <div>
              <h3 className="font-bold text-base">
                {medicineToEdit ? 'Ubah Data Obat' : 'Tambah Obat Baru'}
              </h3>
              <p className="text-xs text-teal-200">Katalog farmasi klinik & stok gudang obat</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-teal-200 hover:text-white transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nama Obat & Kekuatan Sediaan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Paracetamol 500 mg"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-semibold focus:outline-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Obat</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
              >
                <option value="Analgesik / Antipiretik">Analgesik / Antipiretik</option>
                <option value="Antibiotik">Antibiotik</option>
                <option value="Antasida & Lambung">Antasida & Lambung</option>
                <option value="Antihistamin / Alergi">Antihistamin / Alergi</option>
                <option value="Antihipertensi">Antihipertensi</option>
                <option value="Antidiabetes">Antidiabetes</option>
                <option value="Antiinflamasi">Antiinflamasi</option>
                <option value="Suplemen & Vitamin">Suplemen & Vitamin</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bentuk Sediaan</label>
              <select
                value={formData.form}
                onChange={(e) => setFormData({ ...formData, form: e.target.value, unit: e.target.value })}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
              >
                <option value="Tablet">Tablet</option>
                <option value="Kaplet">Kaplet</option>
                <option value="Kapsul">Kapsul</option>
                <option value="Sirup">Sirup</option>
                <option value="Salep">Salep</option>
                <option value="Tetes Mata/Telinga">Tetes Mata/Telinga</option>
                <option value="Injeksi">Injeksi</option>
                <option value="Sachet">Sachet</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Jumlah Stok Fisik</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-mono font-bold focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Harga Satuan (Rp)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-mono font-bold focus:outline-teal-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Petunjuk Dosis Standar (Signa)
            </label>
            <input
              type="text"
              value={formData.dosageHint}
              onChange={(e) => setFormData({ ...formData, dosageHint: e.target.value })}
              placeholder="Contoh: 3 x 1 tablet sesudah makan"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition shadow-md shadow-teal-600/20 cursor-pointer"
            >
              Simpan Obat
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
