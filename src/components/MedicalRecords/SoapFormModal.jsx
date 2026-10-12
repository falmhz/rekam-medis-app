import React, { useState, useEffect } from 'react';
import { 
  X, 
  Stethoscope, 
  User, 
  HeartPulse, 
  Activity, 
  FileText, 
  Pill, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  AlertCircle, 
  Printer, 
  Calendar,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { DOCTORS, CLINIC_POLIS, ICD10_LIST } from '../../data/mockData';

export default function SoapFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  recordToEdit, 
  initialPatient, 
  patients, 
  medicines 
}) {
  // Main Form State
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('doc-1');
  const [poliId, setPoliId] = useState('poli-umum');
  const [recordDate, setRecordDate] = useState('');
  const [recordTime, setRecordTime] = useState('');

  // S - Subjektif
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [historyOfIllness, setHistoryOfIllness] = useState('');
  const [patientAllergies, setPatientAllergies] = useState('');

  // O - Objektif / TTV
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [heartRate, setHeartRate] = useState(80);
  const [respiratoryRate, setRespiratoryRate] = useState(18);
  const [temperature, setTemperature] = useState(36.6);
  const [oxygenSaturation, setOxygenSaturation] = useState(98);
  const [weight, setWeight] = useState(65);
  const [height, setHeight] = useState(165);
  const [physicalExam, setPhysicalExam] = useState('');

  // A - Asesmen / Diagnosa
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('');
  const [secondaryDiagnosis, setSecondaryDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');

  // P - Plan / Terapi
  const [prescriptions, setPrescriptions] = useState([]);
  const [actions, setActions] = useState('');
  const [education, setEducation] = useState('');
  const [disposition, setDisposition] = useState('Rawat Jalan (Pulang)');
  const [followUpDate, setFollowUpDate] = useState('');

  const [activeTab, setActiveTab] = useState('S'); // S, O, A, P

  // Calculate BMI automatically
  const computeBmi = (w, h) => {
    if (!w || !h || h <= 0) return { bmi: 0, status: '-' };
    const heightInMeters = h / 100;
    const bmiVal = Number((w / (heightInMeters * heightInMeters)).toFixed(1));
    let status = 'Normal';
    if (bmiVal < 18.5) status = 'Kurus (Underweight)';
    else if (bmiVal < 25.0) status = 'Normal';
    else if (bmiVal < 30.0) status = 'Kelebihan Berat Badan (Overweight)';
    else status = 'Obesitas';
    return { bmi: bmiVal, status };
  };

  const currentBmi = computeBmi(weight, height);

  // Initialize or update fields when modal opens or edits
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toTimeString().split(' ')[0].substring(0, 5);

    if (recordToEdit) {
      setPatientId(recordToEdit.patientId || '');
      setDoctorId(recordToEdit.doctorId || 'doc-1');
      setPoliId(recordToEdit.poliId || 'poli-umum');
      setRecordDate(recordToEdit.date || today);
      setRecordTime(recordToEdit.time || timeNow);

      setChiefComplaint(recordToEdit.subjective?.chiefComplaint || '');
      setHistoryOfIllness(recordToEdit.subjective?.historyOfPresentIllness || '');
      setPatientAllergies(recordToEdit.subjective?.allergies || '');

      const v = recordToEdit.objective?.vitalSigns || {};
      setBloodPressure(v.bloodPressure || '120/80');
      setHeartRate(v.heartRate || 80);
      setRespiratoryRate(v.respiratoryRate || 18);
      setTemperature(v.temperature || 36.6);
      setOxygenSaturation(v.oxygenSaturation || 98);
      setWeight(v.weight || 65);
      setHeight(v.height || 165);
      setPhysicalExam(recordToEdit.objective?.physicalExam || '');

      setPrimaryDiagnosis(recordToEdit.assessment?.primaryDiagnosis || '');
      setSecondaryDiagnosis(recordToEdit.assessment?.secondaryDiagnosis || '');
      setClinicalNotes(recordToEdit.assessment?.clinicalNotes || '');

      setPrescriptions(recordToEdit.plan?.prescriptions || []);
      setActions(Array.isArray(recordToEdit.plan?.actions) ? recordToEdit.plan.actions.join(', ') : (recordToEdit.plan?.actions || ''));
      setEducation(recordToEdit.plan?.education || '');
      setDisposition(recordToEdit.plan?.disposition || 'Rawat Jalan (Pulang)');
      setFollowUpDate(recordToEdit.plan?.followUp || '');
    } else {
      // New record
      setRecordDate(today);
      setRecordTime(timeNow);
      if (initialPatient) {
        setPatientId(initialPatient.id);
        setPatientAllergies(initialPatient.allergies || '');
      } else if (patients.length > 0) {
        setPatientId(patients[0].id);
        setPatientAllergies(patients[0].allergies || '');
      }

      setChiefComplaint('');
      setHistoryOfIllness('');
      setBloodPressure('120/80');
      setHeartRate(80);
      setRespiratoryRate(18);
      setTemperature(36.5);
      setOxygenSaturation(98);
      setWeight(65);
      setHeight(165);
      setPhysicalExam('Keadaan umum baik, kesadaran compos mentis.');
      setPrimaryDiagnosis(ICD10_LIST[0].code + ' - ' + ICD10_LIST[0].name);
      setSecondaryDiagnosis('');
      setClinicalNotes('');
      setPrescriptions([]);
      setActions('Pemeriksaan fisik standar');
      setEducation('Istirahat cukup, minum air putih 2L/hari, konsumsi makanan bergizi.');
      setDisposition('Rawat Jalan (Pulang)');
      setFollowUpDate('3 hari kemudian jika gejala tidak membaik');
    }
  }, [isOpen, recordToEdit, initialPatient, patients]);

  // When patient changes, auto update allergies
  const handlePatientChange = (pId) => {
    setPatientId(pId);
    const pat = patients.find(p => p.id === pId);
    if (pat) {
      setPatientAllergies(pat.allergies || '');
    }
  };

  // Add prescription item
  const handleAddPrescription = (medicine) => {
    const medName = medicine ? medicine.name : (medicines[0]?.name || 'Paracetamol 500 mg');
    const defaultDose = medicine?.dosageHint || '3 x 1 tablet sesudah makan';
    setPrescriptions([
      ...prescriptions,
      {
        medicineName: medName,
        dosage: defaultDose,
        quantity: 10,
        note: 'Sesudah makan'
      }
    ]);
  };

  const handleUpdatePrescription = (index, field, value) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const handleRemovePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, idx) => idx !== index));
  };

  if (!isOpen) return null;

  const currentPatient = patients.find(p => p.id === patientId);
  const currentDoctor = DOCTORS.find(d => d.id === doctorId);
  const currentPoli = CLINIC_POLIS.find(p => p.id === poliId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPatient) {
      alert('Pilih pasien terlebih dahulu');
      return;
    }

    const payload = {
      ...(recordToEdit || {}),
      date: recordDate,
      time: recordTime,
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientMrn: currentPatient.mrn,
      paymentType: currentPatient.paymentType,
      doctorId: currentDoctor?.id || doctorId,
      doctorName: currentDoctor?.name || 'dr. Budi Santoso',
      poliId: currentPoli?.id || poliId,
      poliName: currentPoli?.name || 'Poli Umum',
      subjective: {
        chiefComplaint,
        historyOfPresentIllness: historyOfIllness,
        allergies: patientAllergies
      },
      objective: {
        vitalSigns: {
          bloodPressure,
          heartRate: Number(heartRate),
          respiratoryRate: Number(respiratoryRate),
          temperature: Number(temperature),
          oxygenSaturation: Number(oxygenSaturation),
          weight: Number(weight),
          height: Number(height),
          bmi: currentBmi.bmi,
          bmiStatus: currentBmi.status
        },
        physicalExam
      },
      assessment: {
        primaryDiagnosis,
        secondaryDiagnosis,
        clinicalNotes
      },
      plan: {
        prescriptions,
        actions: actions.split(',').map(s => s.trim()).filter(Boolean),
        education,
        disposition,
        followUp: followUpDate
      }
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-in my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-white">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight">
                {recordToEdit ? `Edit Rekam Medis #${recordToEdit.recordNumber}` : 'Lembar Pemeriksaan Rekam Medis (SOAP)'}
              </h2>
              <p className="text-xs text-teal-200">
                Pencatatan klinis standar faskes: Subjektif, Objektif, Asesmen, dan Plan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient & Doctor Meta Selector Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          {/* Pilih Pasien */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Pasien Pemeriksaan <span className="text-rose-500">*</span>
            </label>
            <select
              value={patientId}
              onChange={(e) => handlePatientChange(e.target.value)}
              disabled={!!recordToEdit}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-teal-600 disabled:bg-slate-100"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.mrn} - {p.name} ({p.paymentType})
                </option>
              ))}
            </select>
            {currentPatient && (
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                <span>{currentPatient.gender}, {currentPatient.age} thn</span>
                <span>•</span>
                <span className="font-semibold text-teal-700">{currentPatient.paymentType}</span>
              </div>
            )}
          </div>

          {/* Pilih Dokter Pemeriksa */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Dokter Pemeriksa <span className="text-rose-500">*</span>
            </label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-teal-600"
            >
              {DOCTORS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.spec})
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-500 mt-1">
              {currentDoctor?.sip}
            </div>
          </div>

          {/* Pilih Poliklinik */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Poliklinik Tujuan
            </label>
            <select
              value={poliId}
              onChange={(e) => setPoliId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-teal-600"
            >
              {CLINIC_POLIS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              Tanggal: {recordDate} {recordTime}
            </div>
          </div>

        </div>

        {/* Allergy Alert Indicator if Any */}
        {patientAllergies && patientAllergies.toLowerCase() !== 'tidak ada' && patientAllergies.toLowerCase() !== 'tidak ada alergi' && (
          <div className="px-6 py-2 bg-rose-50 border-b border-rose-200 flex items-center gap-2 text-rose-800 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Peringatan Alergi Pasien:</span>
            <span className="text-rose-900 font-bold underline">{patientAllergies}</span>
          </div>
        )}

        {/* Tab Navigation for SOAP */}
        <div className="border-b border-slate-200 px-6 flex items-center gap-2 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('S')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'S'
                ? 'border-teal-600 text-teal-800 bg-teal-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px]">S</span>
            <span>Subjektif (Keluhan)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('O')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'O'
                ? 'border-teal-600 text-teal-800 bg-teal-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px]">O</span>
            <span>Objektif (TTV & Fisik)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('A')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'A'
                ? 'border-teal-600 text-teal-800 bg-teal-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px]">A</span>
            <span>Asesmen (Diagnosa)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('P')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'P'
                ? 'border-teal-600 text-teal-800 bg-teal-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px]">P</span>
            <span>Plan (Resep & Terapi)</span>
          </button>
        </div>

        {/* Modal Body / Tab Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[55vh] overflow-y-auto text-xs space-y-4">
            
            {/* TAB S: SUBJEKTIF */}
            {activeTab === 'S' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Keluhan Utama (Chief Complaint) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    placeholder="Contoh: Demam sejak 3 hari yang lalu, disertai batuk berdahak dan pilek..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-0.5">Keluhan yang membawa pasien datang mencari pengobatan</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Riwayat Penyakit Sekarang (RPS)
                  </label>
                  <textarea
                    rows={3}
                    value={historyOfIllness}
                    onChange={(e) => setHistoryOfIllness(e.target.value)}
                    placeholder="Jelaskan onset, durasi, faktor yang memperberat/memperingan, gejala penyerta, riwayat obat yang telah diminum..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Riwayat Alergi Pasien
                  </label>
                  <input
                    type="text"
                    value={patientAllergies}
                    onChange={(e) => setPatientAllergies(e.target.value)}
                    placeholder="Alergi obat (penisilin, sulfa), makanan laut, telur, dll..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
                  />
                </div>
              </div>
            )}

            {/* TAB O: OBJEKTIF */}
            {activeTab === 'O' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-teal-600" />
                    Tanda-Tanda Vital (TTV)
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Tekanan Darah */}
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Tekanan Darah (mmHg)
                      </label>
                      <input
                        type="text"
                        value={bloodPressure}
                        onChange={(e) => setBloodPressure(e.target.value)}
                        placeholder="120/80"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-800 font-mono font-bold focus:outline-teal-600"
                      />
                    </div>

                    {/* Denyut Nadi */}
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Denyut Nadi (x/menit)
                      </label>
                      <input
                        type="number"
                        value={heartRate}
                        onChange={(e) => setHeartRate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-800 font-mono font-bold focus:outline-teal-600"
                      />
                    </div>

                    {/* Pernapasan */}
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Laju Napas (x/menit)
                      </label>
                      <input
                        type="number"
                        value={respiratoryRate}
                        onChange={(e) => setRespiratoryRate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-800 font-mono font-bold focus:outline-teal-600"
                      />
                    </div>

                    {/* Suhu Tubuh */}
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Suhu Tubuh (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-xl border font-mono font-bold focus:outline-teal-600 ${
                          Number(temperature) >= 37.5 ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-slate-300 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Antropometri & IMT */}
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Berat Badan (kg)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-mono font-bold focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Tinggi Badan (cm)
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-mono font-bold focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Saturasi Oksigen SpO2
                      </label>
                      <input
                        type="number"
                        value={oxygenSaturation}
                        onChange={(e) => setOxygenSaturation(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-mono font-bold focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        IMT (Kalkulasi Otomatis)
                      </label>
                      <div className="font-bold text-slate-800 py-1.5">
                        {currentBmi.bmi} kg/m²
                        <div className="text-[10px] text-teal-700 font-semibold">{currentBmi.status}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hasil Pemeriksaan Fisik */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Hasil Pemeriksaan Fisik Terarah
                  </label>
                  <textarea
                    rows={3}
                    value={physicalExam}
                    onChange={(e) => setPhysicalExam(e.target.value)}
                    placeholder="Kepala/Mata/THT: faring hiperemis (-), tonsil T1-T1. Thorax: Pulmo vesikuler +/+, rhonki -/-, wheezing -/-. Abdomen: supel, bising usus normal, hepar/lien ttb. Ekstremitas: akral hangat..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
                  />
                </div>
              </div>
            )}

            {/* TAB A: ASESMEN */}
            {activeTab === 'A' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Diagnosa Utama (ICD-10) <span className="text-rose-500">*</span>
                  </label>
                  
                  {/* Quick ICD-10 Picker */}
                  <div className="flex gap-2 mb-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) setPrimaryDiagnosis(e.target.value);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-medium focus:outline-teal-600 bg-slate-50/50"
                    >
                      <option value="">-- Pilih dari Referensi Kode ICD-10 Populer --</option>
                      {ICD10_LIST.map((icd) => (
                        <option key={icd.code} value={`${icd.code} - ${icd.name}`}>
                          [{icd.code}] {icd.name} ({icd.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="text"
                    required
                    value={primaryDiagnosis}
                    onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                    placeholder="Kode & Nama Penyakit (Contoh: J06.9 - ISPA Akut)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-bold focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Diagnosa Sekunder / Komorbiditas
                  </label>
                  <input
                    type="text"
                    value={secondaryDiagnosis}
                    onChange={(e) => setSecondaryDiagnosis(e.target.value)}
                    placeholder="Contoh: I10 - Hipertensi Esensial, atau Kosongkan jika tidak ada"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Catatan Klinis & Diferensial Diagnosa Dokter
                  </label>
                  <textarea
                    rows={3}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Catatan pertimbangan klinis, faktor risiko komplikasi, atau rencana pemeriksaan penunjang (lab/rontgen)..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
                  />
                </div>
              </div>
            )}

            {/* TAB P: PLAN / RESEP & TERAPI */}
            {activeTab === 'P' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* E-Resep Obat */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-teal-600" />
                      <span className="font-bold text-slate-800 text-xs">Resep Obat Elektronik (e-Resep)</span>
                    </div>

                    {/* Quick Add Medicine Button */}
                    <div className="flex items-center gap-2">
                      <select
                        onChange={(e) => {
                          const med = medicines.find(m => m.id === e.target.value);
                          if (med) {
                            handleAddPrescription(med);
                            e.target.value = '';
                          }
                        }}
                        className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-teal-600"
                      >
                        <option value="">+ Tambah Obat dari Apotek</option>
                        {medicines.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} (Sisa: {m.stock} {m.unit})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Prescription Items List */}
                  {prescriptions.length > 0 ? (
                    <div className="space-y-2.5">
                      {prescriptions.map((rx, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-2.5 shadow-2xs">
                          <span className="font-mono font-bold text-teal-700 w-6 shrink-0">R/{idx + 1}</span>
                          
                          <div className="flex-1 w-full sm:w-auto">
                            <input
                              type="text"
                              value={rx.medicineName}
                              onChange={(e) => handleUpdatePrescription(idx, 'medicineName', e.target.value)}
                              placeholder="Nama Obat & Dosis"
                              className="w-full px-2 py-1 rounded border border-slate-200 text-xs font-semibold text-slate-800"
                            />
                          </div>

                          <div className="w-full sm:w-44">
                            <input
                              type="text"
                              value={rx.dosage}
                              onChange={(e) => handleUpdatePrescription(idx, 'dosage', e.target.value)}
                              placeholder="Aturan Pakai (misal: 3x1)"
                              className="w-full px-2 py-1 rounded border border-slate-200 text-xs text-slate-700"
                            />
                          </div>

                          <div className="w-20">
                            <input
                              type="number"
                              value={rx.quantity}
                              onChange={(e) => handleUpdatePrescription(idx, 'quantity', Number(e.target.value))}
                              placeholder="Jumlah"
                              className="w-full px-2 py-1 rounded border border-slate-200 text-xs text-slate-800 font-mono text-center font-bold"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemovePrescription(idx)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-slate-400 text-xs">
                      Belum ada obat diresepkan. Klik menu dropdown di kanan atas untuk menambahkan obat.
                    </div>
                  )}
                </div>

                {/* Tindakan Medis */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Tindakan / Prosedur Medis yang Diberikan
                  </label>
                  <input
                    type="text"
                    value={actions}
                    onChange={(e) => setActions(e.target.value)}
                    placeholder="Contoh: Nebulisasi, Pembersihan Luka Aseptik, Injeksi Ketorolac, EKG..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
                  />
                </div>

                {/* Edukasi & Rencana Tindak Lanjut */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Edukasi & Nasihat Dokter
                    </label>
                    <textarea
                      rows={2}
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="Anjuran diet, istirahat, cara minum obat, pantangan..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Status Keluar & Jadwal Kontrol
                    </label>
                    <select
                      value={disposition}
                      onChange={(e) => setDisposition(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 mb-2 focus:outline-teal-600"
                    >
                      <option value="Rawat Jalan (Pulang)">Rawat Jalan (Pulang)</option>
                      <option value="Rujuk Rumah Sakit Lanjutan">Rujuk Rumah Sakit Lanjutan (FKRTL)</option>
                      <option value="Observasi di Klinik">Observasi di Klinik</option>
                    </select>

                    <input
                      type="text"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      placeholder="Jadwal kontrol ulang (misal: 3 hari lagi bila belum reda)"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-teal-600 text-xs"
                    />
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Tab navigation buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  const tabs = ['S', 'O', 'A', 'P'];
                  const idx = tabs.indexOf(activeTab);
                  if (idx > 0) setActiveTab(tabs[idx - 1]);
                }}
                disabled={activeTab === 'S'}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
              >
                &larr; Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => {
                  const tabs = ['S', 'O', 'A', 'P'];
                  const idx = tabs.indexOf(activeTab);
                  if (idx < 3) setActiveTab(tabs[idx + 1]);
                }}
                disabled={activeTab === 'P'}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
              >
                Selanjutnya &rarr;
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>
              
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md shadow-teal-600/20 transition flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Simpan Rekam Medis (SOAP)</span>
              </button>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
