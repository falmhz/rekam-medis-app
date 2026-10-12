import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ListOrdered, 
  Pill, 
  Calculator, 
  UserPlus, 
  Stethoscope, 
  ShieldCheck,
  X,
  Building
} from 'lucide-react';
import { CLINIC_INFO } from '../data/mockData';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  patientCount, 
  recordCount, 
  queueWaitingCount, 
  onNewPatient, 
  onNewRecord, 
  isMobileOpen, 
  setIsMobileOpen,
  currentUser
}) {
  const isAdmin = currentUser?.role === 'admin';
  const isDoctor = currentUser?.role === 'doctor';

  // Menu yang tersedia untuk semua (admin & dokter)
  const commonMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Ringkasan & Analitik',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'queues',
      label: 'Antrean Poli',
      description: 'Panggilan & Status',
      icon: ListOrdered,
      badge: queueWaitingCount > 0 ? queueWaitingCount : null,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'records',
      label: 'Rekam Medis',
      description: 'SOAP & Riwayat Berkas',
      icon: FileText,
      badge: recordCount,
      badgeColor: 'bg-teal-100 text-teal-800'
    },
  ];

  // Menu eksklusif Admin
  const adminOnlyMenuItems = [
    {
      id: 'patients',
      label: 'Data Pasien',
      description: 'Registrasi & Rekam Jejak',
      icon: Users,
      badge: patientCount,
      badgeColor: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'pharmacy',
      label: 'Farmasi & Obat',
      description: 'Katalog & Stok Apotek',
      icon: Pill,
      badge: null
    },
  ];

  // Menu tools tersedia untuk semua
  const toolMenuItems = [
    {
      id: 'calculator',
      label: 'Kalkulator Medis',
      description: 'IMT, Dosis Anak & HPL',
      icon: Calculator,
      badge: 'Alat',
      badgeColor: 'bg-emerald-100 text-emerald-700'
    }
  ];

  const handleSelect = (id) => {
    setCurrentTab(id);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const renderMenuButton = (item) => {
    const Icon = item.icon;
    const isActive = currentTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => handleSelect(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition text-xs font-medium cursor-pointer ${
          isActive
            ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200/80 shadow-2xs'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${isActive ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="leading-tight">{item.label}</div>
            <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
              {item.description}
            </div>
          </div>
        </div>
        {item.badge !== null && item.badge !== undefined && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 md:top-[61px] left-0 h-screen md:h-[calc(100vh-61px)] w-64 bg-white border-r border-slate-200 z-50 md:z-20 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col flex-1 overflow-y-auto">
          {/* Mobile header close button */}
          <div className="flex md:hidden items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Menu Navigasi
            </span>
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Quick Launch Buttons */}
          <div className="space-y-2 mb-6">
            {/* Tombol SOAP — tersedia untuk semua */}
            <button
              onClick={() => {
                onNewRecord();
                if (setIsMobileOpen) setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl font-semibold text-xs shadow-md shadow-teal-600/20 transition cursor-pointer"
            >
              <Stethoscope className="w-4 h-4" />
              <span>+ Periksa Pasien (SOAP)</span>
            </button>

            {/* Tombol Daftar Pasien — hanya Admin */}
            {isAdmin && (
              <button
                onClick={() => {
                  onNewPatient();
                  if (setIsMobileOpen) setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                <span>+ Daftar Pasien Baru</span>
              </button>
            )}
          </div>

          {/* Navigation Links — Menu Umum (Admin & Dokter) */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu Utama
            </div>
            {commonMenuItems.map(renderMenuButton)}
          </div>

          {/* Navigation Links — Menu Eksklusif Admin */}
          {isAdmin && (
            <div className="space-y-1 mt-4">
              <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" />
                Manajemen (Admin)
              </div>
              {adminOnlyMenuItems.map(renderMenuButton)}
            </div>
          )}

          {/* Navigation Links — Tools */}
          <div className="space-y-1 mt-4">
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Alat Bantu
            </div>
            {toolMenuItems.map(renderMenuButton)}
          </div>

          {/* Info role dokter */}
          {isDoctor && (
            <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-700">
              <div className="font-semibold mb-0.5 flex items-center gap-1.5">
                <Stethoscope className="w-3 h-3" />
                Mode Dokter
              </div>
              <div className="text-blue-600 leading-snug">
                Akses Data Pasien & Farmasi hanya tersedia untuk Admin.
              </div>
            </div>
          )}
        </div>

        {/* Footer info box */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <Building className="w-3.5 h-3.5 text-teal-600" />
              <span>Fasilitas Pelayanan</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
              {CLINIC_INFO.legalNumber}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Database Aktif
              </span>
              <span className="text-slate-400">v1.2</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
