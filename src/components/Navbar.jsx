import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Clock, 
  Calendar, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  Menu, 
  Stethoscope,
  Building2,
  LogOut
} from 'lucide-react';
import { CLINIC_INFO } from '../data/mockData';
import { exportAllDataAsJSON } from '../data/storage';

export default function Navbar({ onResetData, onToggleMobileMenu, showToast, currentUser, onLogout }) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const isAdmin = currentUser?.role === 'admin';
  const isDoctor = currentUser?.role === 'doctor';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatIndonesianDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatIndonesianTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' WIB';
  };

  const handleExport = () => {
    exportAllDataAsJSON();
    showToast('Data Rekam Medis berhasil diekspor ke file JSON.', 'success');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Clinic Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                  {CLINIC_INFO.name}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  RME Kemenkes
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Sistem Informasi Manajemen Rekam Medis Elektronik
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Date & Clock */}
        <div className="hidden lg:flex items-center gap-5 px-4 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>{formatIndonesianDate(currentDateTime)}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 font-mono text-slate-800">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>{formatIndonesianTime(currentDateTime)}</span>
          </div>
        </div>

        {/* Right: Quick Tools & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Export JSON Button — hanya Admin */}
          {isAdmin && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition shadow-2xs hover:border-slate-300 cursor-pointer"
              title="Ekspor Backup Data JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Ekspor Data</span>
            </button>
          )}

          {/* Reset Demo Data Button — hanya Admin */}
          {isAdmin && (
            <button
              onClick={onResetData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition cursor-pointer"
              title="Reset ke Data Bawaan / Demo"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>
          )}

          <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

          {/* User badge */}
          <div className="flex items-center gap-2 pl-1">
            {/* Avatar — warna beda untuk admin vs dokter */}
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${
              isAdmin
                ? 'bg-rose-100 border-rose-200 text-rose-800'
                : 'bg-teal-100 border-teal-200 text-teal-800'
            }`}>
              {isAdmin
                ? <ShieldCheck className="w-4 h-4 text-rose-600" />
                : (currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'DR')
              }
            </div>

            <div className="hidden xl:block text-left">
              <div className="flex items-center gap-1.5">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser?.name || 'Pengguna'}
                </div>
                {/* Badge role */}
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isAdmin
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-teal-100 text-teal-700 border border-teal-200'
                }`}>
                  {isAdmin
                    ? <><ShieldCheck className="w-2.5 h-2.5" /> Admin</>
                    : <><Stethoscope className="w-2.5 h-2.5" /> Dokter</>
                  }
                </span>
              </div>
              <div className={`text-[11px] font-medium ${isAdmin ? 'text-rose-600' : 'text-teal-600'}`}>
                {currentUser?.spec || (isAdmin ? 'Administrator' : 'Dokter Jaga')}
                {!isAdmin && currentUser?.sip && ` • ${currentUser.sip}`}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition ml-1 cursor-pointer"
              title="Ganti Akun / Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
