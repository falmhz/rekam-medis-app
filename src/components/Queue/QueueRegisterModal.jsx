import React, { useState } from 'react';
import { X, ListOrdered, User, Calendar, Clock, Stethoscope } from 'lucide-react';
import { CLINIC_POLIS, DOCTORS } from '../../data/mockData';

export default function QueueRegisterModal({ isOpen, onClose, onRegister, patients, preselectedPatient, queues }) {
  const [patientId, setPatientId] = useState(preselectedPatient?.id || (patients[0]?.id || ''));
  const [poliId, setPoliId] = useState('poli-umum');
  const [doctorId, setDoctorId] = useState('doc-1');

  if (!isOpen) return null;

  const currentPatient = patients.find(p => p.id === patientId) || preselectedPatient || patients[0];
  const currentPoli = CLINIC_POLIS.find(p => p.id === poliId);
  const currentDoctor = DOCTORS.find(d => d.id === doctorId);

  // Auto-generate queue number based on poli code
  const getNextQueueNumber = (pCode) => {
    const existingInPoli = queues.filter(q => q.queueNumber?.startsWith(pCode));
    const nextNum = existingInPoli.length + 1;
    return `${pCode}-${String(nextNum).padStart(3, '0')}`;
  };

  const handlePoliChange = (pId) => {
    setPoliId(pId);
    const relatedDoc = DOCTORS.find(d => d.poliId === pId);
    if (relatedDoc) {
      setDoctorId(relatedDoc.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPatient) return;

    const queueNumber = getNextQueueNumber(currentPoli?.code || 'U');

    onRegister({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientMrn: currentPatient.mrn,
      paymentType: currentPatient.paymentType,
      poliId: currentPoli.id,
      poliName: currentPoli.name,
      doctorId: currentDoctor?.id || doctorId,
      doctorName: currentDoctor?.name || 'dr. Budi Santoso',
      queueNumber,
      status: 'Menunggu'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-in my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ListOrdered className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-bold text-base">Pendaftaran Antrean Poli</h3>
              <p className="text-xs text-amber-100">Ambil nomor antrean untuk pemeriksaan hari ini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-amber-600/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Pilih Pasien */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Pasien <span className="text-rose-500">*</span>
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-amber-600"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.mrn} - {p.name} ({p.paymentType})
                </option>
              ))}
            </select>
            {currentPatient && (
              <div className="text-[11px] text-slate-500 mt-1">
                NIK: {currentPatient.nik} • Usia: {currentPatient.age} thn
              </div>
            )}
          </div>

          {/* Pilih Poli */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Poliklinik Tujuan <span className="text-rose-500">*</span>
            </label>
            <select
              value={poliId}
              onChange={(e) => handlePoliChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-amber-600"
            >
              {CLINIC_POLIS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Kode: {p.code})
                </option>
              ))}
            </select>
          </div>

          {/* Pilih Dokter */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Dokter Bertugas <span className="text-rose-500">*</span>
            </label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-amber-600"
            >
              {DOCTORS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.spec})
                </option>
              ))}
            </select>
          </div>

          {/* Preview Queue Number */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
              Estimasi Nomor Antrean
            </span>
            <div className="text-3xl font-extrabold text-amber-700 font-mono mt-1">
              {getNextQueueNumber(currentPoli?.code || 'U')}
            </div>
            <p className="text-[11px] text-amber-600 mt-1">
              Nomor akan dipanggil di ruang tunggu {currentPoli?.name}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-medium transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition shadow-md shadow-amber-600/20 cursor-pointer"
            >
              Terbitkan Nomor Antrean
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
