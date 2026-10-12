import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Common/Toast';

// Landing & Auth
import HospitalLandingPage from './components/Landing/HospitalLandingPage';
import LoginPage from './components/Auth/LoginPage';
import PatientPortalView from './components/PatientPortal/PatientPortalView';

// Doctor Views
import DashboardView from './components/Dashboard/DashboardView';
import PatientListView from './components/Patients/PatientListView';
import RecordListView from './components/MedicalRecords/RecordListView';
import QueueBoardView from './components/Queue/QueueBoardView';
import PharmacyView from './components/Pharmacy/PharmacyView';
import MedicalCalculatorView from './components/Tools/MedicalCalculatorView';

// Modals
import PatientModal from './components/Patients/PatientModal';
import PatientDetailModal from './components/Patients/PatientDetailModal';
import SoapFormModal from './components/MedicalRecords/SoapFormModal';
import PrintRecordModal from './components/MedicalRecords/PrintRecordModal';
import QueueRegisterModal from './components/Queue/QueueRegisterModal';
import MedicineModal from './components/Pharmacy/MedicineModal';

// Storage
import {
  initStorage,
  getPatients,
  savePatients,
  addPatient,
  updatePatient,
  deletePatient,
  getRecords,
  addRecord,
  updateRecord,
  deleteRecord,
  getQueues,
  addQueue,
  updateQueueStatus,
  deleteQueue,
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  resetAllDataToDefault
} from './data/storage';

export default function App() {
  // Initialize persistence storage
  useEffect(() => {
    initStorage();
  }, []);

  // Public View Mode: 'landing' (Foto ke-2) | 'login' (Foto ke-3)
  const [publicView, setPublicView] = useState('landing');

  // Authentication State: Selalu null saat pertama buka agar tidak auto-login
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    showToast(`Selamat datang, ${user.role === 'doctor' ? user.name : user.patientData.name}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPublicView('landing');
    try {
      localStorage.removeItem('medicare_rme_active_session_v1');
    } catch (e) {}
    showToast('Anda telah keluar dari akun.', 'info');
  };

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Data Collections
  const [patients, setPatients] = useState(() => getPatients());
  const [records, setRecords] = useState(() => getRecords());
  const [queues, setQueues] = useState(() => getQueues());
  const [medicines, setMedicines] = useState(() => getMedicines());

  // Toast Notification State
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Modals State
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPatientForDetail, setSelectedPatientForDetail] = useState(null);

  const [isSoapModalOpen, setIsSoapModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [patientForNewSoap, setPatientForNewSoap] = useState(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [recordToPrint, setRecordToPrint] = useState(null);

  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [patientForQueue, setPatientForQueue] = useState(null);

  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [medicineToEdit, setMedicineToEdit] = useState(null);

  // --- PATIENT HANDLERS ---
  const handleOpenAddPatient = () => {
    setPatientToEdit(null);
    setIsPatientModalOpen(true);
  };

  const handleOpenEditPatient = (pat) => {
    setPatientToEdit(pat);
    setIsPatientModalOpen(true);
  };

  const handleSavePatient = (patData) => {
    if (patientToEdit) {
      updatePatient(patData);
      setPatients(getPatients());
      showToast(`Data pasien ${patData.name} berhasil diperbarui.`, 'success');
      return patData;
    } else {
      const created = addPatient(patData);
      setPatients(getPatients());
      showToast(`Pasien baru ${created.name} (${created.mrn}) berhasil didaftarkan.`, 'success');
      return created;
    }
  };

  const handleDeletePatient = (patId) => {
    const pat = patients.find(p => p.id === patId);
    if (window.confirm(`Yakin ingin menghapus data pasien ${pat?.name || ''}?`)) {
      deletePatient(patId);
      setPatients(getPatients());
      showToast('Data pasien telah dihapus.', 'info');
    }
  };

  const handleViewPatientDetail = (pat) => {
    setSelectedPatientForDetail(pat);
    setIsDetailModalOpen(true);
  };

  // --- MEDICAL RECORD (SOAP) HANDLERS ---
  const handleOpenNewSoap = (prePatient = null) => {
    setRecordToEdit(null);
    setPatientForNewSoap(prePatient);
    setIsSoapModalOpen(true);
  };

  const handleOpenEditSoap = (rec) => {
    setRecordToEdit(rec);
    setPatientForNewSoap(patients.find(p => p.id === rec.patientId) || null);
    setIsSoapModalOpen(true);
  };

  const handleSaveSoap = (soapData) => {
    if (recordToEdit) {
      updateRecord(soapData);
      setRecords(getRecords());
      showToast(`Rekam medis ${soapData.recordNumber} berhasil diperbarui.`, 'success');
    } else {
      const created = addRecord(soapData);
      setRecords(getRecords());
      showToast(`Rekam medis ${created.recordNumber} atas nama ${created.patientName} berhasil disimpan.`, 'success');

      // If this examination was from an active queue, mark queue as completed
      const matchingQueue = queues.find(
        q => (q.patientId === soapData.patientId || q.patientMrn === soapData.patientMrn) && q.status !== 'Selesai'
      );
      if (matchingQueue) {
        updateQueueStatus(matchingQueue.id, 'Selesai');
        setQueues(getQueues());
      }
    }
    setIsSoapModalOpen(false);
  };

  const handleDeleteSoap = (recId) => {
    if (window.confirm('Hapus berkas rekam medis ini? Tindakan ini tidak dapat dibatalkan.')) {
      deleteRecord(recId);
      setRecords(getRecords());
      showToast('Berkas rekam medis berhasil dihapus.', 'info');
    }
  };

  const handlePrintRecord = (rec) => {
    setRecordToPrint(rec);
    setIsPrintModalOpen(true);
  };

  // --- QUEUE HANDLERS ---
  const handleOpenNewQueue = (prePatient = null) => {
    setPatientForQueue(prePatient);
    setIsQueueModalOpen(true);
  };

  const handleSaveQueue = (queueData) => {
    const created = addQueue(queueData);
    setQueues(getQueues());
    showToast(`Antrean ${created.queueNumber} (${created.patientName}) diterbitkan.`, 'success');
    setIsQueueModalOpen(false);
  };

  const handleUpdateQueueStatus = (queueId, newStatus) => {
    updateQueueStatus(queueId, newStatus);
    setQueues(getQueues());
    showToast(`Status antrean diperbarui: ${newStatus}`, 'info');
  };

  const handleDeleteQueue = (queueId) => {
    deleteQueue(queueId);
    setQueues(getQueues());
    showToast('Antrean dibatalkan.', 'info');
  };

  const handleStartExamFromQueue = (queue) => {
    const pat = patients.find(p => p.id === queue.patientId || p.mrn === queue.patientMrn);
    handleOpenNewSoap(pat || { id: queue.patientId, name: queue.patientName, mrn: queue.patientMrn });
  };

  // --- PHARMACY HANDLERS ---
  const handleOpenAddMedicine = () => {
    setMedicineToEdit(null);
    setIsMedicineModalOpen(true);
  };

  const handleOpenEditMedicine = (med) => {
    setMedicineToEdit(med);
    setIsMedicineModalOpen(true);
  };

  const handleSaveMedicine = (medData) => {
    if (medicineToEdit) {
      updateMedicine(medData);
      setMedicines(getMedicines());
      showToast(`Data obat ${medData.name} berhasil diperbarui.`, 'success');
    } else {
      addMedicine(medData);
      setMedicines(getMedicines());
      showToast(`Obat ${medData.name} berhasil ditambahkan ke apotek.`, 'success');
    }
    setIsMedicineModalOpen(false);
  };

  const handleDeleteMedicine = (medId) => {
    if (window.confirm('Hapus obat ini dari formularium apotek?')) {
      deleteMedicine(medId);
      setMedicines(getMedicines());
      showToast('Obat berhasil dihapus.', 'info');
    }
  };

  // --- RESET ALL DATA ---
  const handleResetData = () => {
    if (window.confirm('Kembalikan semua data klinik ke pengaturan awal? Perubahan yang dibuat akan digantikan.')) {
      resetAllDataToDefault();
      setPatients(getPatients());
      setRecords(getRecords());
      setQueues(getQueues());
      setMedicines(getMedicines());
      showToast('Data berhasil direset ke data sampel faskes.', 'info');
    }
  };

  const waitingQueueCount = queues.filter(q => q.status === 'Menunggu').length;

  // 1. IF NOT LOGGED IN:
  if (!currentUser) {
    if (publicView === 'landing') {
      return (
        <>
          <HospitalLandingPage
            onOpenLogin={() => setPublicView('login')}
            onOpenRegister={() => setPublicView('login')}
          />
          <Toast toast={toast} onClose={() => setToast(null)} />
        </>
      );
    }

    // publicView === 'login' (Persis seperti Foto ke-3)
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          onBackToHome={() => setPublicView('landing')}
          patients={patients}
          onRegisterPatient={(pData) => {
            const created = handleSavePatient(pData);
            return created;
          }}
          showToast={showToast}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // 2. IF LOGGED IN AS PATIENT: SHOW PATIENT PORTAL
  if (currentUser.role === 'patient') {
    return (
      <>
        <PatientPortalView
          currentPatient={currentUser.patientData}
          records={records}
          queues={queues}
          onLogout={handleLogout}
          onPrintRecord={handlePrintRecord}
          onRegisterQueue={handleSaveQueue}
          showToast={showToast}
        />
        <PrintRecordModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          record={recordToPrint}
          patient={currentUser.patientData}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // 3. IF LOGGED IN AS DOCTOR / ADMIN: SHOW FULL CLINICAL EMR SYSTEM
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased selection:bg-teal-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        onResetData={handleResetData}
        onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
        showToast={showToast}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-full">
        
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          patientCount={patients.length}
          recordCount={records.length}
          queueWaitingCount={waitingQueueCount}
          onNewPatient={handleOpenAddPatient}
          onNewRecord={() => handleOpenNewSoap()}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Dynamic Main Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {currentTab === 'dashboard' && (
            <DashboardView
              patients={patients}
              records={records}
              queues={queues}
              medicines={medicines}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onStartExam={handleStartExamFromQueue}
              onNewPatient={handleOpenAddPatient}
              onNewRecord={() => handleOpenNewSoap()}
            />
          )}

          {currentTab === 'queues' && (
            <QueueBoardView
              queues={queues}
              onNewQueue={() => handleOpenNewQueue()}
              onUpdateStatus={handleUpdateQueueStatus}
              onDeleteQueue={handleDeleteQueue}
              onStartExam={handleStartExamFromQueue}
              showToast={showToast}
            />
          )}

          {currentTab === 'records' && (
            <RecordListView
              records={records}
              onNewRecord={() => handleOpenNewSoap()}
              onEditRecord={handleOpenEditSoap}
              onDeleteRecord={handleDeleteSoap}
              onPrintRecord={handlePrintRecord}
            />
          )}

          {currentTab === 'patients' && (
            <PatientListView
              patients={patients}
              onAddPatient={handleOpenAddPatient}
              onEditPatient={handleOpenEditPatient}
              onDeletePatient={handleDeletePatient}
              onViewDetail={handleViewPatientDetail}
              onStartNewSoap={(pat) => handleOpenNewSoap(pat)}
              onAddToQueue={(pat) => handleOpenNewQueue(pat)}
            />
          )}

          {currentTab === 'pharmacy' && (
            <PharmacyView
              medicines={medicines}
              onAddMedicine={handleOpenAddMedicine}
              onEditMedicine={handleOpenEditMedicine}
              onDeleteMedicine={handleDeleteMedicine}
            />
          )}

          {currentTab === 'calculator' && (
            <MedicalCalculatorView />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Patient Add/Edit Modal */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSave={(patData) => {
          handleSavePatient(patData);
          setIsPatientModalOpen(false);
        }}
        patientToEdit={patientToEdit}
      />

      {/* 2. Patient Detail & Timeline Modal */}
      <PatientDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        patient={selectedPatientForDetail}
        records={records}
        onStartNewSoap={(pat) => handleOpenNewSoap(pat)}
        onPrintRecord={handlePrintRecord}
      />

      {/* 3. SOAP Medical Examination Modal */}
      <SoapFormModal
        isOpen={isSoapModalOpen}
        onClose={() => setIsSoapModalOpen(false)}
        onSave={handleSaveSoap}
        recordToEdit={recordToEdit}
        initialPatient={patientForNewSoap}
        patients={patients}
        medicines={medicines}
      />

      {/* 4. Official Printable Record Modal */}
      <PrintRecordModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        record={recordToPrint}
        patient={patients.find(p => p.id === recordToPrint?.patientId)}
      />

      {/* 5. Queue Registration Modal */}
      <QueueRegisterModal
        isOpen={isQueueModalOpen}
        onClose={() => setIsQueueModalOpen(false)}
        onRegister={handleSaveQueue}
        patients={patients}
        preselectedPatient={patientForQueue}
        queues={queues}
      />

      {/* 6. Medicine Add/Edit Modal */}
      <MedicineModal
        isOpen={isMedicineModalOpen}
        onClose={() => setIsMedicineModalOpen(false)}
        onSave={handleSaveMedicine}
        medicineToEdit={medicineToEdit}
      />

      {/* Floating Interactive Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
