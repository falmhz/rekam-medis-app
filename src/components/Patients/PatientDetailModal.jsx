import React from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  FileText, 
  Activity, 
  Pill, 
  Clock, 
  Stethoscope,
  Heart,
  CreditCard,
  Plus
} from 'lucide-react';

export default function PatientDetailModal({ 
  isOpen, 
  onClose, 
  patient, 
  records, 
  onStartNewSoap,
  onPrintRecord
}) {
  if (!isOpen || !patient) return null;

  // Filter records that belong to this patient
  const patientRecords = records.filter(
    (r) => r.patientId === patient.id || r.patientMrn === patient.mrn
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-in my-8">
        
        {/* Header with Patient MRN and Name */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-teal-200 font-bold text-lg shrink-0">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-teal-900/60 text-teal-200 border border-teal-500/40">
                  {patient.mrn}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  {patient.paymentType}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">
                {patient.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onStartNewSoap(patient);
              }}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-900/20 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4" />
              <span>+ Pemeriksaan Baru</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Critical Allergy Banner */}
          {patient.allergies && patient.allergies.toLowerCase() !== 'tidak ada' && patient.allergies.toLowerCase() !== 'tidak ada alergi' ? (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-800 text-xs uppercase tracking-wide">
                  Peringatan Alergi Pasien:
                </span>
                <p className="text-rose-700 font-semibold text-xs mt-0.5">
                  {patient.allergies}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800">
              <span className="font-medium">Tidak ada riwayat alergi obat/makanan yang dilaporkan.</span>
            </div>
          )}

          {/* Demographic Information Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">NIK</span>
              <div className="font-mono font-bold text-slate-800 mt-0.5">{patient.nik}</div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Tgl Lahir / Usia</span>
              <div className="font-semibold text-slate-800 mt-0.5">{patient.birthDate} ({patient.age} thn)</div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Jenis Kelamin</span>
              <div className="font-semibold text-slate-800 mt-0.5">{patient.gender}</div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Golongan Darah</span>
              <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                {patient.bloodType || 'Belum diketahui'}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200">
              <Phone className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">Telepon / WA</div>
                <div className="font-semibold text-slate-800">{patient.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200">
              <CreditCard className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">No. Jaminan / BPJS</div>
                <div className="font-semibold text-slate-800 font-mono">{patient.bpjsNumber || '-'}</div>
              </div>
            </div>
            <div className="sm:col-span-2 flex items-start gap-2 p-3 rounded-xl bg-white border border-slate-200">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] text-slate-400">Alamat Tempat Tinggal</div>
                <div className="font-medium text-slate-800">{patient.address || '-'}</div>
              </div>
            </div>
          </div>

          {/* Medical Visit History Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Riwayat Rekam Medis Pasien ({patientRecords.length} Kunjungan)
              </h3>
            </div>

            {patientRecords.length > 0 ? (
              <div className="space-y-4">
                {patientRecords.map((rec) => (
                  <div 
                    key={rec.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 transition bg-white shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[11px]">
                          {rec.recordNumber}
                        </span>
                        <span className="text-slate-500 font-medium">
                          {rec.date} • {rec.time}
                        </span>
                      </div>
                      <div className="text-slate-700 font-semibold">
                        {rec.poliName} • <span className="text-slate-500">{rec.doctorName}</span>
                      </div>
                    </div>

                    {/* SOAP Breakdown Mini */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="font-bold text-teal-800 uppercase text-[10px]">S (Subjektif)</span>
                        <p className="mt-0.5 text-slate-600 italic">"{rec.subjective?.chiefComplaint}"</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="font-bold text-teal-800 uppercase text-[10px]">O (Objektif / TTV)</span>
                        <div className="mt-0.5 text-slate-700">
                          TD: <b>{rec.objective?.vitalSigns?.bloodPressure}</b> mmHg • Suhu: <b>{rec.objective?.vitalSigns?.temperature}</b>°C • Nadi: <b>{rec.objective?.vitalSigns?.heartRate}</b>x/m
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 md:col-span-2">
                        <span className="font-bold text-teal-800 uppercase text-[10px]">A (Asesmen / Diagnosa)</span>
                        <div className="mt-0.5 font-bold text-slate-900">
                          {rec.assessment?.primaryDiagnosis}
                        </div>
                      </div>

                      {/* Prescriptions */}
                      {rec.plan?.prescriptions && rec.plan.prescriptions.length > 0 && (
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 md:col-span-2">
                          <span className="font-bold text-teal-800 uppercase text-[10px] flex items-center gap-1">
                            <Pill className="w-3 h-3 text-teal-600" />
                            P (Resep Obat)
                          </span>
                          <ul className="mt-1 list-disc list-inside space-y-0.5 text-slate-700">
                            {rec.plan.prescriptions.map((rx, idx) => (
                              <li key={idx}>
                                <span className="font-semibold">{rx.medicineName}</span> ({rx.dosage}) - {rx.quantity} {rx.note ? `• ${rx.note}` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onPrintRecord(rec)}
                        className="text-xs font-semibold text-teal-600 hover:text-teal-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Cetak Lembar Rekam Medis Ini &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium">Belum ada riwayat rekam medis untuk pasien ini.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Klik tombol "+ Pemeriksaan Baru" di atas untuk memulai pencatatan SOAP pertama.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
