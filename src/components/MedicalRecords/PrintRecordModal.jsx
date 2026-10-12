import React from 'react';
import { X, Printer, Download, Activity, ShieldCheck, HeartPulse } from 'lucide-react';
import { CLINIC_INFO } from '../../data/mockData';

export default function PrintRecordModal({ isOpen, onClose, record, patient }) {
  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  const v = record.objective?.vitalSigns || {};
  const prescriptions = record.plan?.prescriptions || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-in my-6">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-slate-800 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Pratinjau Cetak Resume Medis Resmi</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-teal-900/20 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CONTENT (Visible on screen and on print) */}
        <div id="printable-medical-record" className="p-8 sm:p-12 text-slate-800 bg-white max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible text-xs leading-normal font-sans">
          
          {/* KOP RESMI FASKES */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-teal-700 flex items-center justify-center text-white shrink-0">
              <Activity className="w-10 h-10 stroke-[2.2]" />
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-extrabold uppercase tracking-wide text-slate-900">
                {CLINIC_INFO.name}
              </h1>
              <p className="text-[11px] font-semibold text-slate-700">
                {CLINIC_INFO.legalNumber}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {CLINIC_INFO.address}
              </p>
              <p className="text-[10px] text-slate-500">
                Telp: {CLINIC_INFO.phone} | Email: {CLINIC_INFO.email}
              </p>
            </div>
          </div>

          {/* JUDUL DOKUMEN */}
          <div className="text-center my-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider underline">
              RESUME MEDIS RAWAT JALAN & RESEP ELEKTRONIK
            </h2>
            <div className="font-mono text-[11px] text-slate-600 font-semibold mt-0.5">
              No. Berkas: {record.recordNumber}
            </div>
          </div>

          {/* IDENTITAS PASIEN & PEMERIKSAAN */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 my-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
            <div>
              <span className="text-slate-500 inline-block w-28">No. Rekam Medis:</span>
              <span className="font-bold font-mono text-slate-900">{record.patientMrn}</span>
            </div>
            <div>
              <span className="text-slate-500 inline-block w-28">Tanggal Periksa:</span>
              <span className="font-semibold text-slate-900">{record.date} ({record.time} WIB)</span>
            </div>
            <div>
              <span className="text-slate-500 inline-block w-28">Nama Pasien:</span>
              <span className="font-bold text-slate-900">{record.patientName}</span>
            </div>
            <div>
              <span className="text-slate-500 inline-block w-28">Poliklinik:</span>
              <span className="font-semibold text-slate-900">{record.poliName}</span>
            </div>
            <div>
              <span className="text-slate-500 inline-block w-28">Jaminan Pasien:</span>
              <span className="font-semibold text-slate-900">{record.paymentType}</span>
            </div>
            <div>
              <span className="text-slate-500 inline-block w-28">Dokter Pemeriksa:</span>
              <span className="font-semibold text-slate-900">{record.doctorName}</span>
            </div>
          </div>

          {/* PERINGATAN ALERGI */}
          {record.subjective?.allergies && record.subjective.allergies.toLowerCase() !== 'tidak ada' && (
            <div className="border border-rose-400 bg-rose-50 text-rose-800 p-2 rounded mb-4 font-semibold text-[11px]">
              ⚠️ RIWAYAT ALERGI: {record.subjective.allergies}
            </div>
          )}

          {/* RESUME SOAP */}
          <div className="space-y-4 my-4">
            
            {/* SUBJEKTIF */}
            <div className="border border-slate-300 rounded-lg p-3">
              <div className="font-bold text-[11px] text-teal-800 uppercase tracking-wide border-b border-slate-200 pb-1 mb-2">
                I. Anamnesis & Keluhan (Subjektif)
              </div>
              <div className="grid grid-cols-1 gap-1 text-[11px]">
                <div>
                  <span className="font-semibold text-slate-700">Keluhan Utama:</span>{' '}
                  <span className="text-slate-900">{record.subjective?.chiefComplaint}</span>
                </div>
                {record.subjective?.historyOfPresentIllness && (
                  <div>
                    <span className="font-semibold text-slate-700">Riwayat Penyakit Sekarang:</span>{' '}
                    <span className="text-slate-800">{record.subjective.historyOfPresentIllness}</span>
                  </div>
                )}
              </div>
            </div>

            {/* OBJEKTIF */}
            <div className="border border-slate-300 rounded-lg p-3">
              <div className="font-bold text-[11px] text-teal-800 uppercase tracking-wide border-b border-slate-200 pb-1 mb-2">
                II. Pemeriksaan Fisik & Tanda Vital (Objektif)
              </div>
              <div className="grid grid-cols-4 gap-2 text-[11px] bg-slate-50 p-2 rounded mb-2 font-mono">
                <div>TD: <b>{v.bloodPressure || '-'}</b> mmHg</div>
                <div>Nadi: <b>{v.heartRate || '-'}</b> x/mnt</div>
                <div>Napas: <b>{v.respiratoryRate || '-'}</b> x/mnt</div>
                <div>Suhu: <b>{v.temperature || '-'}</b> °C</div>
                <div>SpO2: <b>{v.oxygenSaturation || '-'}</b> %</div>
                <div>BB: <b>{v.weight || '-'}</b> kg</div>
                <div>TB: <b>{v.height || '-'}</b> cm</div>
                <div>IMT: <b>{v.bmi || '-'}</b> ({v.bmiStatus || '-'})</div>
              </div>
              <div className="text-[11px]">
                <span className="font-semibold text-slate-700">Hasil Fisik:</span>{' '}
                <span className="text-slate-800">{record.objective?.physicalExam}</span>
              </div>
            </div>

            {/* ASESMEN */}
            <div className="border border-slate-300 rounded-lg p-3">
              <div className="font-bold text-[11px] text-teal-800 uppercase tracking-wide border-b border-slate-200 pb-1 mb-2">
                III. Diagnosa Medis (Asesmen)
              </div>
              <div className="text-[11px] space-y-1">
                <div>
                  <span className="font-bold text-slate-700">Diagnosa Utama (ICD-10):</span>{' '}
                  <span className="font-extrabold text-slate-900">{record.assessment?.primaryDiagnosis}</span>
                </div>
                {record.assessment?.secondaryDiagnosis && (
                  <div>
                    <span className="font-semibold text-slate-700">Diagnosa Sekunder:</span>{' '}
                    <span>{record.assessment.secondaryDiagnosis}</span>
                  </div>
                )}
                {record.assessment?.clinicalNotes && (
                  <div>
                    <span className="font-semibold text-slate-700">Catatan Klinis:</span>{' '}
                    <span className="italic">{record.assessment.clinicalNotes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* PLAN & RESEP OBAT */}
            <div className="border border-slate-300 rounded-lg p-3">
              <div className="font-bold text-[11px] text-teal-800 uppercase tracking-wide border-b border-slate-200 pb-1 mb-2">
                IV. Penatalaksanaan & Resep Terapi (Plan)
              </div>
              
              {/* Prescriptions */}
              {prescriptions.length > 0 && (
                <div className="mb-3">
                  <div className="font-bold text-[11px] text-slate-800 mb-1">Salinan Resep Dokter (R/):</div>
                  <table className="w-full text-left border-collapse border border-slate-200 text-[10px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="border border-slate-200 p-1 w-8">No</th>
                        <th className="border border-slate-200 p-1">Nama Obat & Sediaan</th>
                        <th className="border border-slate-200 p-1">Aturan Pakai (Signa)</th>
                        <th className="border border-slate-200 p-1 w-16 text-center">Jumlah</th>
                        <th className="border border-slate-200 p-1">Catatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map((rx, idx) => (
                        <tr key={idx}>
                          <td className="border border-slate-200 p-1 font-mono font-bold text-center">R/{idx + 1}</td>
                          <td className="border border-slate-200 p-1 font-semibold">{rx.medicineName}</td>
                          <td className="border border-slate-200 p-1">{rx.dosage}</td>
                          <td className="border border-slate-200 p-1 text-center font-bold">{rx.quantity}</td>
                          <td className="border border-slate-200 p-1 italic">{rx.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Edukasi & Tindak Lanjut */}
              <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                <div>
                  <span className="font-semibold text-slate-700">Edukasi Dokter:</span>
                  <p className="text-slate-800 mt-0.5">{record.plan?.education || '-'}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Tindak Lanjut & Jadwal Kontrol:</span>
                  <p className="text-slate-800 mt-0.5 font-bold">{record.plan?.disposition} • {record.plan?.followUp || '-'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* LEMBAR PENGESAHAN DOKTER */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end text-[11px]">
            <div>
              <p className="text-[10px] text-slate-400">
                Dokumen ini merupakan salinan rekam medis elektronik sah klinik.
              </p>
              <p className="text-[10px] text-slate-400">
                Dicetak pada: {new Date().toLocaleString('id-ID')}
              </p>
            </div>

            <div className="text-center w-56">
              <p className="text-slate-600 mb-12">
                Jakarta, {record.date}<br />
                Dokter Pemeriksa,
              </p>
              <div className="border-b border-slate-900 w-44 mx-auto pb-0.5 font-bold text-slate-900">
                {record.doctorName}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                SIP: 503/SIP.DU/2024/001
              </p>
            </div>
          </div>

        </div>

        {/* Bottom footer button for screen view */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Ini</span>
          </button>
        </div>

      </div>
    </div>
  );
}
