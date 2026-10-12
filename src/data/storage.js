// LocalStorage Persistence Service untuk MediCare RME
import { INITIAL_PATIENTS, INITIAL_RECORDS, INITIAL_QUEUES, INITIAL_MEDICINES } from './mockData';

const STORAGE_KEYS = {
  PATIENTS: 'medicare_rme_patients_v1',
  RECORDS: 'medicare_rme_records_v1',
  QUEUES: 'medicare_rme_queues_v1',
  MEDICINES: 'medicare_rme_medicines_v1',
};

// Inisialisasi data default jika belum ada
export function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_RECORDS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUEUES)) {
    localStorage.setItem(STORAGE_KEYS.QUEUES, JSON.stringify(INITIAL_QUEUES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEDICINES)) {
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
  }
}

// === PATIENTS ===
export function getPatients() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return data ? JSON.parse(data) : INITIAL_PATIENTS;
  } catch (e) {
    return INITIAL_PATIENTS;
  }
}

export function savePatients(patients) {
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
}

export function addPatient(patient) {
  const patients = getPatients();
  // generate No. RM otomatis jika belum ada
  const nextNum = String(patients.length + 1).padStart(4, '0');
  const year = new Date().getFullYear();
  const mrn = patient.mrn || `RM-${year}-${nextNum}`;
  
  const newPatient = {
    ...patient,
    id: `pat-${Date.now()}`,
    mrn,
    registeredDate: patient.registeredDate || new Date().toISOString().split('T')[0]
  };
  const updated = [newPatient, ...patients];
  savePatients(updated);
  return newPatient;
}

export function updatePatient(updatedPatient) {
  const patients = getPatients();
  const updated = patients.map(p => p.id === updatedPatient.id ? updatedPatient : p);
  savePatients(updated);
  return updatedPatient;
}

export function deletePatient(patientId) {
  const patients = getPatients();
  const updated = patients.filter(p => p.id !== patientId);
  savePatients(updated);
  return updated;
}

// === MEDICAL RECORDS (REKAM MEDIS) ===
export function getRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : INITIAL_RECORDS;
  } catch (e) {
    return INITIAL_RECORDS;
  }
}

export function saveRecords(records) {
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
}

export function addRecord(record) {
  const records = getRecords();
  const count = records.length + 1;
  const year = new Date().getFullYear();
  const recordNumber = record.recordNumber || `EMR-${year}-${String(count).padStart(4, '0')}`;
  
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

  const newRecord = {
    ...record,
    id: `rec-${Date.now()}`,
    recordNumber,
    date: record.date || dateStr,
    time: record.time || timeStr
  };
  const updated = [newRecord, ...records];
  saveRecords(updated);
  return newRecord;
}

export function updateRecord(updatedRecord) {
  const records = getRecords();
  const updated = records.map(r => r.id === updatedRecord.id ? updatedRecord : r);
  saveRecords(updated);
  return updatedRecord;
}

export function deleteRecord(recordId) {
  const records = getRecords();
  const updated = records.filter(r => r.id !== recordId);
  saveRecords(updated);
  return updated;
}

// === QUEUES (ANTEAN) ===
export function getQueues() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUEUES);
    return data ? JSON.parse(data) : INITIAL_QUEUES;
  } catch (e) {
    return INITIAL_QUEUES;
  }
}

export function saveQueues(queues) {
  localStorage.setItem(STORAGE_KEYS.QUEUES, JSON.stringify(queues));
}

export function addQueue(queueData) {
  const queues = getQueues();
  const newQueue = {
    ...queueData,
    id: `q-${Date.now()}`,
    arrivalTime: new Date().toTimeString().split(' ')[0].substring(0, 5)
  };
  const updated = [...queues, newQueue];
  saveQueues(updated);
  return newQueue;
}

export function updateQueueStatus(queueId, status) {
  const queues = getQueues();
  const updated = queues.map(q => q.id === queueId ? { ...q, status } : q);
  saveQueues(updated);
  return updated;
}

export function deleteQueue(queueId) {
  const queues = getQueues();
  const updated = queues.filter(q => q.id !== queueId);
  saveQueues(updated);
  return updated;
}

// === MEDICINES (OBAT) ===
export function getMedicines() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEDICINES);
    return data ? JSON.parse(data) : INITIAL_MEDICINES;
  } catch (e) {
    return INITIAL_MEDICINES;
  }
}

export function saveMedicines(medicines) {
  localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
}

export function addMedicine(medicine) {
  const medicines = getMedicines();
  const newMed = {
    ...medicine,
    id: `med-${Date.now()}`
  };
  const updated = [newMed, ...medicines];
  saveMedicines(updated);
  return newMed;
}

export function updateMedicine(updatedMed) {
  const medicines = getMedicines();
  const updated = medicines.map(m => m.id === updatedMed.id ? updatedMed : m);
  saveMedicines(updated);
  return updatedMed;
}

export function deleteMedicine(medId) {
  const medicines = getMedicines();
  const updated = medicines.filter(m => m.id !== medId);
  saveMedicines(updated);
  return updated;
}

// === BACKUP & RESET ===
export function resetAllDataToDefault() {
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_RECORDS));
  localStorage.setItem(STORAGE_KEYS.QUEUES, JSON.stringify(INITIAL_QUEUES));
  localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
}

export function exportAllDataAsJSON() {
  const backup = {
    exportDate: new Date().toISOString(),
    patients: getPatients(),
    records: getRecords(),
    queues: getQueues(),
    medicines: getMedicines()
  };
  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup_rekam_medis_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
