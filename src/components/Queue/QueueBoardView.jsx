import React, { useState } from 'react';
import { 
  ListOrdered, 
  Plus, 
  Volume2, 
  Stethoscope, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Building2, 
  Trash2,
  Play
} from 'lucide-react';
import { CLINIC_POLIS } from '../../data/mockData';

export default function QueueBoardView({ 
  queues, 
  onNewQueue, 
  onUpdateStatus, 
  onDeleteQueue, 
  onStartExam,
  showToast 
}) {
  const [selectedPoli, setSelectedPoli] = useState('ALL');
  const [callingQueueId, setCallingQueueId] = useState(null);

  // Play synthetic audio chime + optional Indonesian voice call
  const callPatient = (queue) => {
    setCallingQueueId(queue.id);

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.25); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.7);

      // Voice call using Web Speech Synthesis if supported
      if ('speechSynthesis' in window) {
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(
            `Nomor antrean ${queue.queueNumber}, atas nama ${queue.patientName}, silakan menuju ke ${queue.poliName}`
          );
          utterance.lang = 'id-ID';
          utterance.rate = 0.95;
          window.speechSynthesis.speak(utterance);
        }, 600);
      }
    } catch (e) {
      console.warn('Audio call error', e);
    }

    showToast(`Memanggil antrean ${queue.queueNumber} - ${queue.patientName}`, 'info');

    setTimeout(() => {
      setCallingQueueId(null);
    }, 4000);
  };

  // Filter queues by poli
  const filteredQueues = queues.filter((q) => {
    if (selectedPoli === 'ALL') return true;
    return q.poliId === selectedPoli;
  });

  const waitingCount = filteredQueues.filter(q => q.status === 'Menunggu').length;
  const inProgressCount = filteredQueues.filter(q => q.status === 'Sedang Diperiksa').length;
  const completedCount = filteredQueues.filter(q => q.status === 'Selesai').length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ListOrdered className="w-6 h-6 text-amber-600" />
            Papan Antrean Poliklinik Real-time
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan antrean pasien, pemanggilan suara elektronik, dan alur periksa dokter
          </p>
        </div>

        <button
          onClick={onNewQueue}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md shadow-amber-600/20 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Ambil Antrean Baru</span>
        </button>
      </div>

      {/* Queue Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="font-semibold text-amber-800">Menunggu Panggilan</span>
            <div className="text-2xl font-extrabold text-amber-900 mt-1">{waitingCount} Pasien</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-200/60 text-amber-800">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="font-semibold text-emerald-800">Sedang Diperiksa</span>
            <div className="text-2xl font-extrabold text-emerald-900 mt-1">{inProgressCount} Pasien</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-200/60 text-emerald-800">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="font-semibold text-slate-700">Pelayanan Selesai</span>
            <div className="text-2xl font-extrabold text-slate-800 mt-1">{completedCount} Pasien</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-200 text-slate-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Poli Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setSelectedPoli('ALL')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
            selectedPoli === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Poli ({queues.length})
        </button>

        {CLINIC_POLIS.map((p) => {
          const count = queues.filter(q => q.poliId === p.id).length;
          const isSelected = selectedPoli === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPoli(p.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{p.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-teal-900 text-teal-100' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Queue Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQueues.map((q) => {
          const isCalling = callingQueueId === q.id;
          const isExamining = q.status === 'Sedang Diperiksa';
          const isWaiting = q.status === 'Menunggu';
          const isDone = q.status === 'Selesai';

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-2xs relative overflow-hidden ${
                isCalling
                  ? 'border-amber-400 ring-4 ring-amber-300/40 bg-amber-50/40'
                  : isExamining
                    ? 'border-emerald-300 ring-2 ring-emerald-200/50'
                    : isDone
                      ? 'border-slate-200 opacity-60'
                      : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Top Card Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold font-mono text-lg shadow-xs ${
                    isExamining
                      ? 'bg-emerald-600 text-white'
                      : isWaiting
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                  }`}>
                    <span className="text-[10px] uppercase font-sans font-medium tracking-wider opacity-80">Antrean</span>
                    <span className="leading-tight font-extrabold">{q.queueNumber}</span>
                  </div>

                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isExamining
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : isWaiting
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                    }`}>
                      {q.status}
                    </span>
                    <div className="font-extrabold text-slate-900 text-sm mt-1 line-clamp-1">
                      {q.patientName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {q.patientMrn} • {q.paymentType}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteQueue(q.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Batalkan Antrean"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Poli and Doctor Details */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs flex items-center justify-between text-slate-600">
                <div>
                  <div className="font-bold text-slate-800">{q.poliName}</div>
                  <div className="text-[11px] text-slate-500">{q.doctorName}</div>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono">
                  Masuk: {q.arrivalTime}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                
                {/* Voice Call Button */}
                <button
                  onClick={() => callPatient(q)}
                  disabled={isDone}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 ${
                    isCalling
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                  title="Panggil Pasien dengan Notifikasi Suara"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isCalling ? 'Memanggil...' : 'Panggil'}</span>
                </button>

                {/* Start Examination / SOAP Button */}
                <button
                  onClick={() => {
                    onUpdateStatus(q.id, 'Sedang Diperiksa');
                    onStartExam(q);
                  }}
                  disabled={isDone}
                  className="flex-1 py-2 px-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-40"
                  title="Mulai Pemeriksaan SOAP untuk Pasien Ini"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Periksa</span>
                </button>

                {/* Toggle Status to Selesai */}
                {isExamining && (
                  <button
                    onClick={() => onUpdateStatus(q.id, 'Selesai')}
                    className="p-2 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition cursor-pointer"
                    title="Tandai Selesai"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}

        {filteredQueues.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            <ListOrdered className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-600 text-sm">Tidak ada antrean aktif pada poli ini</p>
            <p className="text-xs text-slate-400 mt-1">Klik "+ Ambil Antrean Baru" untuk mendaftarkan pasien ke antrean poli.</p>
          </div>
        )}
      </div>

    </div>
  );
}
