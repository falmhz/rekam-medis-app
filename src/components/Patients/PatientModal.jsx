import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, AlertCircle, ShieldAlert, Heart, Calendar } from 'lucide-react';

export default function PatientModal({ isOpen, onClose, onSave, patientToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    birthDate: '',
    gender: 'Laki-laki',
    bloodType: 'O+',
    phone: '',
    address: '',
    paymentType: 'BPJS Kesehatan',
    bpjsNumber: '',
    allergies: '',
    emergencyContact: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        name: patientToEdit.name || '',
        nik: patientToEdit.nik || '',
        birthDate: patientToEdit.birthDate || '',
        gender: patientToEdit.gender || 'Laki-laki',
        bloodType: patientToEdit.bloodType || 'O+',
        phone: patientToEdit.phone || '',
        address: patientToEdit.address || '',
        paymentType: patientToEdit.paymentType || 'BPJS Kesehatan',
        bpjsNumber: patientToEdit.bpjsNumber || '',
        allergies: patientToEdit.allergies || '',
        emergencyContact: patientToEdit.emergencyContact || ''
      });
    } else {
      setFormData({
        name: '',
        nik: '',
        birthDate: '1995-05-15',
        gender: 'Laki-laki',
        bloodType: 'O+',
        phone: '',
        address: '',
        paymentType: 'BPJS Kesehatan',
        bpjsNumber: '',
        allergies: 'Tidak ada alergi yang diketahui',
        emergencyContact: ''
      });
    }
    setErrors({});
  }, [patientToEdit, isOpen]);

  if (!isOpen) return null;

  // Compute age from birthDate
  const computeAge = (birthDateStr) => {
    if (!birthDateStr) return 0;
    const birth = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nama pasien wajib diisi';
    if (!formData.nik.trim()) {
      errs.nik = 'NIK 16 digit wajib diisi';
    } else if (formData.nik.length !== 16 && !patientToEdit) {
      errs.nik = 'NIK harus tepat 16 digit';
    }
    if (!formData.birthDate) errs.birthDate = 'Tanggal lahir wajib diisi';
    if (!formData.phone.trim()) errs.phone = 'Nomor telepon/WhatsApp wajib diisi';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const age = computeAge(formData.birthDate);
    onSave({
      ...(patientToEdit || {}),
      ...formData,
      age
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-in my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-teal-300" />
            <div>
              <h3 className="font-bold text-base">
                {patientToEdit ? 'Edit Data Pasien' : 'Registrasi Pasien Baru'}
              </h3>
              <p className="text-xs text-teal-200">
                Lengkapi identitas rekam medis dan data jaminan kesehatan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-600/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Baris 1: Nama & NIK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap Pasien <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Budi Pratama, S.Kom"
                className={`w-full px-3 py-2 rounded-xl border text-slate-800 focus:outline-teal-600 ${
                  errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-0.5">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIK (Nomor Induk Kependudukan) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                placeholder="16 digit angka KTP"
                className={`w-full px-3 py-2 rounded-xl border text-slate-800 font-mono focus:outline-teal-600 ${
                  errors.nik ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              />
              {errors.nik && <p className="text-[11px] text-rose-500 mt-0.5">{errors.nik}</p>}
            </div>
          </div>

          {/* Baris 2: Tanggal Lahir, Jenis Kelamin, Golongan Darah */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Lahir <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
              />
              {formData.birthDate && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Usia: {computeAge(formData.birthDate)} tahun
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Golongan Darah
              </label>
              <select
                value={formData.bloodType}
                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
              >
                <option value="A+">A (+)</option>
                <option value="B+">B (+)</option>
                <option value="AB+">AB (+)</option>
                <option value="O+">O (+)</option>
                <option value="A-">A (-)</option>
                <option value="B-">B (-)</option>
                <option value="AB-">AB (-)</option>
                <option value="O-">O (-)</option>
              </select>
            </div>
          </div>

          {/* Baris 3: Telepon & Jaminan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. Telepon / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Contoh: 0812-3456-7890"
                className={`w-full px-3 py-2 rounded-xl border text-slate-800 focus:outline-teal-600 ${
                  errors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              />
              {errors.phone && <p className="text-[11px] text-rose-500 mt-0.5">{errors.phone}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenis Jaminan / Pembayaran
              </label>
              <select
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
              >
                <option value="BPJS Kesehatan">BPJS Kesehatan</option>
                <option value="Mandiri / Umum">Mandiri / Pasien Umum</option>
                <option value="Asuransi Swasta">Asuransi Swasta</option>
              </select>
            </div>
          </div>

          {/* Baris 4: No. BPJS / Asuransi (jika relevan) */}
          {formData.paymentType !== 'Mandiri / Umum' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Kartu {formData.paymentType}
              </label>
              <input
                type="text"
                value={formData.bpjsNumber}
                onChange={(e) => setFormData({ ...formData, bpjsNumber: e.target.value })}
                placeholder="Nomor kartu peserta BPJS / polis asuransi"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-mono focus:outline-teal-600"
              />
            </div>
          )}

          {/* Baris 5: Alamat Lengkap */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alamat Domisili Lengkap
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
            />
          </div>

          {/* Baris 6: Alergi Pasien (Penting dalam Rekam Medis) */}
          <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200">
            <label className="flex items-center gap-1.5 font-bold text-rose-800 mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Riwayat Alergi Obat / Makanan (Kritis untuk Keselamatan Pasien)</span>
            </label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder="Contoh: Alergi Amoxicillin, Alergi Paracetamol, Alergi Seafood, atau Tidak ada"
              className="w-full px-3 py-2 rounded-lg border border-rose-300 bg-white text-slate-800 focus:outline-rose-600 text-xs"
            />
            <p className="text-[11px] text-rose-600 mt-1">
              Informasi ini akan selalu ditampilkan dengan peringatan merah di seluruh lembar rekam medis.
            </p>
          </div>

          {/* Baris 7: Kontak Darurat */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Kontak Darurat (Keluarga Terdekat)
            </label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder="Contoh: Siti Aminah (Istri) - 0812-3344-5566"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-medium transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition shadow-md shadow-teal-600/20 cursor-pointer"
            >
              {patientToEdit ? 'Simpan Perubahan' : 'Daftarkan Pasien'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
