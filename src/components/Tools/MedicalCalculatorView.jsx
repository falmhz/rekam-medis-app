import React, { useState } from 'react';
import { 
  Calculator, 
  Activity, 
  Baby, 
  Calendar, 
  HeartPulse, 
  Info,
  CheckCircle2
} from 'lucide-react';

export default function MedicalCalculatorView() {
  const [activeTab, setActiveTab] = useState('bmi');

  // BMI States
  const [bmiWeight, setBmiWeight] = useState(65);
  const [bmiHeight, setBmiHeight] = useState(168);
  const [bmiGender, setBmiGender] = useState('Laki-laki');

  // Pediatric Dose States
  const [childWeight, setChildWeight] = useState(15);
  const [mgPerKgDose, setMgPerKgDose] = useState(10);
  const [frequency, setFrequency] = useState(3);
  const [syrupConcentration, setSyrupConcentration] = useState(120); // mg per 5ml (e.g. Paracetamol sirup 120mg/5ml)

  // Pregnancy Naegele States
  const [hpht, setHpht] = useState('2026-03-01');

  // BMI Calculation
  const calculateBmi = () => {
    if (!bmiWeight || !bmiHeight) return { bmi: 0, category: '-', ideal: 0, color: 'text-slate-700' };
    const hMeter = bmiHeight / 100;
    const bmiVal = Number((bmiWeight / (hMeter * hMeter)).toFixed(1));

    // Standar Kemenkes RI
    let category = 'Normal';
    let color = 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (bmiVal < 17.0) {
      category = 'Kurus Berat (Severe Thinness)';
      color = 'text-rose-600 bg-rose-50 border-rose-200';
    } else if (bmiVal < 18.5) {
      category = 'Kurus Ringan (Mild Thinness)';
      color = 'text-amber-600 bg-amber-50 border-amber-200';
    } else if (bmiVal <= 25.0) {
      category = 'Normal (Gizi Baik)';
      color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (bmiVal <= 27.0) {
      category = 'Kelebihan Berat Badan (Overweight)';
      color = 'text-amber-700 bg-amber-50 border-amber-200';
    } else {
      category = 'Obesitas';
      color = 'text-rose-700 bg-rose-50 border-rose-200';
    }

    // Berat Badan Ideal (Rumus Broca modifikasi Kemenkes)
    const idealWeight = bmiGender === 'Laki-laki' 
      ? Number(((bmiHeight - 100) - (0.1 * (bmiHeight - 100))).toFixed(1))
      : Number(((bmiHeight - 100) - (0.15 * (bmiHeight - 100))).toFixed(1));

    return { bmi: bmiVal, category, ideal: idealWeight, color };
  };

  const bmiResult = calculateBmi();

  // Pediatric Dose Calculation
  const singleDoseMg = Number((childWeight * mgPerKgDose).toFixed(1));
  const dailyTotalMg = Number((singleDoseMg * frequency).toFixed(1));
  const syrupMlPerDose = Number(((singleDoseMg / syrupConcentration) * 5).toFixed(1));

  // Pregnancy Calculation (Naegele)
  const calculateNaegele = () => {
    if (!hpht) return { edd: '-', gestationalWeeks: 0, gestationalDays: 0 };
    const date = new Date(hpht);
    if (isNaN(date.getTime())) return { edd: '-', gestationalWeeks: 0, gestationalDays: 0 };

    // Naegele: +7 hari, -3 bulan, +1 tahun (atau +280 hari)
    const eddDate = new Date(date);
    eddDate.setDate(eddDate.getDate() + 280);

    const today = new Date();
    const diffTime = today - date;
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;

    return {
      edd: eddDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      gestationalWeeks: weeks >= 0 ? weeks : 0,
      gestationalDays: remDays >= 0 ? remDays : 0
    };
  };

  const pregResult = calculateNaegele();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Calculator className="w-6 h-6 text-teal-600" />
          Kalkulator & Alat Klinis Medis
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Perhitungan praktis IMT antropometri, dosis obat anak, dan taksiran tanggal persalinan (HPL)
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 bg-white p-2 rounded-2xl shadow-2xs">
        <button
          onClick={() => setActiveTab('bmi')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'bmi'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>IMT & Gizi (Kemenkes)</span>
        </button>

        <button
          onClick={() => setActiveTab('pediatric')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'pediatric'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Baby className="w-4 h-4" />
          <span>Dosis Obat Pediatrik (Anak)</span>
        </button>

        <button
          onClick={() => setActiveTab('pregnancy')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'pregnancy'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>HPL & Gestasi (Naegele)</span>
        </button>
      </div>

      {/* TAB 1: BMI */}
      {activeTab === 'bmi' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Parameter Pasien</h3>
            
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
              <div className="flex gap-2">
                {['Laki-laki', 'Perempuan'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setBmiGender(g)}
                    className={`flex-1 py-2 rounded-xl font-bold transition cursor-pointer ${
                      bmiGender === g
                        ? 'bg-teal-100 text-teal-800 border border-teal-300'
                        : 'bg-slate-50 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Berat Badan: {bmiWeight} kg</label>
              <input
                type="range"
                min="30"
                max="160"
                value={bmiWeight}
                onChange={(e) => setBmiWeight(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <input
                type="number"
                value={bmiWeight}
                onChange={(e) => setBmiWeight(Number(e.target.value))}
                className="mt-1 w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tinggi Badan: {bmiHeight} cm</label>
              <input
                type="range"
                min="100"
                max="210"
                value={bmiHeight}
                onChange={(e) => setBmiHeight(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <input
                type="number"
                value={bmiHeight}
                onChange={(e) => setBmiHeight(Number(e.target.value))}
                className="mt-1 w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          {/* BMI Result Panel */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hasil Indeks Massa Tubuh (IMT)</span>
              <div className="mt-2 text-4xl font-extrabold text-slate-900 font-mono">
                {bmiResult.bmi} <span className="text-sm font-normal text-slate-500">kg/m²</span>
              </div>
              <div className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-bold border ${bmiResult.color}`}>
                {bmiResult.category}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Berat Badan Ideal (Broca):</span>
                <span className="font-bold text-slate-900">{bmiResult.ideal} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Selisih dengan Berat Sekarang:</span>
                <span className="font-bold text-slate-900">
                  {Number((bmiWeight - bmiResult.ideal).toFixed(1))} kg
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pt-2">
                *Berdasarkan pedoman gizi Kementerian Kesehatan Republik Indonesia.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PEDIATRIC DOSAGE */}
      {activeTab === 'pediatric' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Parameter Anak & Sediaan</h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Berat Badan Anak (kg)</label>
              <input
                type="number"
                step="0.5"
                value={childWeight}
                onChange={(e) => setChildWeight(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Dosis Acuan per kg (mg/kgBB per kali minum)
              </label>
              <input
                type="number"
                value={mgPerKgDose}
                onChange={(e) => setMgPerKgDose(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-800"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Contoh: Paracetamol 10 - 15 mg/kgBB, Amoxicillin 20 - 40 mg/kgBB/hari
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Frekuensi Pemberian per Hari</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
              >
                <option value={1}>1 kali sehari (tiap 24 jam)</option>
                <option value={2}>2 kali sehari (tiap 12 jam)</option>
                <option value={3}>3 kali sehari (tiap 8 jam)</option>
                <option value={4}>4 kali sehari (tiap 6 jam)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kekuatan Sirup (mg dalam 5 ml sendok takar)
              </label>
              <input
                type="number"
                value={syrupConcentration}
                onChange={(e) => setSyrupConcentration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-800"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Umumnya 120 mg/5ml atau 250 mg/5ml sirup forte
              </span>
            </div>
          </div>

          {/* Pediatric Result */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Rekomendasi Dosis Resep
              </span>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px]">Dosis Sekali Minum:</span>
                <div className="text-2xl font-extrabold text-teal-700 font-mono mt-0.5">
                  {singleDoseMg} mg
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-teal-300 bg-teal-50/50">
                <span className="text-teal-800 font-bold text-[11px]">Bila Menggunakan Sirup (Volume):</span>
                <div className="text-3xl font-extrabold text-teal-800 font-mono mt-0.5">
                  {syrupMlPerDose} ml <span className="text-xs font-normal text-slate-600">per kali minum</span>
                </div>
                <div className="text-[11px] text-teal-700 font-semibold mt-1">
                  Signa: {frequency} x {syrupMlPerDose} ml ({frequency} kali sehari)
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px]">Total Dosis Harian (Kumulatif):</span>
                <div className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">
                  {dailyTotalMg} mg / 24 jam
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 pt-4">
              *Selalu perhatikan kontraindikasi dan penyesuaian fungsi ginjal/hati anak.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: PREGNANCY (NAEGELE) */}
      {activeTab === 'pregnancy' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Perhitungan Kehamilan (Rumus Naegele)</h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hari Pertama Haid Terakhir (HPHT)
              </label>
              <input
                type="date"
                value={hpht}
                onChange={(e) => setHpht(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-800"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Hari pertama siklus menstruasi normal terakhir ibu hamil
              </span>
            </div>

            <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-800">
              <span className="font-bold block mb-1">Rumus Naegele Standar Medis:</span>
              <p className="text-[11px] leading-relaxed">
                Hari + 7, Bulan - 3, Tahun + 1 (untuk siklus teratur 28 hari).
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Hasil Taksiran Persalinan
              </span>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px]">Taksiran Tanggal Persalinan (HPL):</span>
                <div className="text-2xl font-extrabold text-rose-700 mt-1">
                  {pregResult.edd}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px]">Usia Kehamilan Hari Ini:</span>
                <div className="text-2xl font-extrabold text-slate-800 mt-1">
                  {pregResult.gestationalWeeks} Minggu {pregResult.gestationalDays} Hari
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 pt-4">
              *Taksiran dapat disesuaikan kembali dengan hasil pemeriksaan USG Trimester 1.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
