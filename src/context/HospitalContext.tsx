import React, { createContext, useContext, useState } from 'react';
import {
  Patient,
  Doctor,
  Appointment,
  Department,
  OPDToken,
  Admission,
  Bed,
  BedStatus,
  EmergencyCase,
  EmergencyPriority,
  LabTest,
  LabOrder,
  Medicine,
  Prescription,
  RadiologyOrder,
  BloodStockItem,
  BloodDonor,
  BloodGroup,
  OperationSurgery,
  ICUBedMonitor,
  StaffMember,
  Ambulance,
  Invoice,
  PaymentTransaction,
  InsurancePolicy,
  InventorySupply,
  NotificationItem,
  HospitalSettings,
  UserProfile,
} from '../types/hospital';

import {
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_DEPARTMENTS,
  INITIAL_OPD_TOKENS,
  INITIAL_ADMISSIONS,
  INITIAL_BEDS,
  INITIAL_EMERGENCY_CASES,
  INITIAL_LAB_TESTS,
  INITIAL_LAB_ORDERS,
  INITIAL_MEDICINES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_RADIOLOGY_ORDERS,
  INITIAL_BLOOD_STOCK,
  INITIAL_BLOOD_DONORS,
  INITIAL_SURGERIES,
  INITIAL_ICU_MONITORS,
  INITIAL_STAFF,
  INITIAL_AMBULANCES,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_INSURANCE_POLICIES,
  INITIAL_INVENTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  INITIAL_USER,
} from '../data/mockHospitalData';

export type NavigationView =
  | 'dashboard'
  | 'patients'
  | 'doctors'
  | 'appointments'
  | 'departments'
  | 'nurses'
  | 'staff'
  | 'admissions'
  | 'discharge'
  | 'emergency'
  | 'opd'
  | 'ipd'
  | 'laboratory'
  | 'pharmacy'
  | 'prescriptions'
  | 'radiology'
  | 'blood-bank'
  | 'operation-theatre'
  | 'icu'
  | 'ambulance'
  | 'rooms-beds'
  | 'billing'
  | 'payments'
  | 'insurance'
  | 'reports'
  | 'inventory'
  | 'hr-payroll'
  | 'notifications'
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

export type PrintableDocument =
  | { type: 'invoice'; data: Invoice }
  | { type: 'prescription'; data: Prescription }
  | { type: 'labReport'; data: LabOrder }
  | { type: 'dischargeSummary'; data: Admission }
  | null;

interface HospitalContextType {
  // Navigation & Auth
  currentView: NavigationView;
  setCurrentView: (view: NavigationView) => void;
  isAuthenticated: boolean;
  user: UserProfile;
  login: (role?: string) => void;
  logout: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Search & Modals
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  activePrintDoc: PrintableDocument;
  setActivePrintDoc: (doc: PrintableDocument) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;

  // Data Collections
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  departments: Department[];
  opdTokens: OPDToken[];
  admissions: Admission[];
  beds: Bed[];
  emergencyCases: EmergencyCase[];
  labTests: LabTest[];
  labOrders: LabOrder[];
  medicines: Medicine[];
  prescriptions: Prescription[];
  radiologyOrders: RadiologyOrder[];
  bloodStock: BloodStockItem[];
  bloodDonors: BloodDonor[];
  surgeries: OperationSurgery[];
  icuMonitors: ICUBedMonitor[];
  staff: StaffMember[];
  ambulances: Ambulance[];
  invoices: Invoice[];
  payments: PaymentTransaction[];
  insurancePolicies: InsurancePolicy[];
  inventory: InventorySupply[];
  notifications: NotificationItem[];
  settings: HospitalSettings;

  // Toast System
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, description?: string) => void;
  removeToast: (id: string) => void;

  // CRUD & Operational Methods
  addPatient: (patient: Omit<Patient, 'id' | 'mrn'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  addDoctor: (doctor: Omit<Doctor, 'id' | 'rating' | 'totalPatientsConsulted'>) => void;
  toggleDoctorAvailability: (id: string) => void;

  bookAppointment: (apt: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

  addOPDToken: (patientName: string, doctorId: string, department: string, complaint: string) => void;
  updateOPDStatus: (id: string, status: OPDToken['status']) => void;

  admitPatient: (adm: Omit<Admission, 'id' | 'mrn'>) => void;
  dischargePatient: (id: string) => void;

  updateBedStatus: (id: string, status: BedStatus, patientName?: string, patientId?: string) => void;

  addEmergencyCase: (data: {
    patientName: string;
    age: number;
    gender: string;
    priority: EmergencyPriority;
    chiefComplaint: string;
    assignedDoctor: string;
    bedAssigned: string;
  }) => void;
  updateEmergencyStatus: (id: string, status: EmergencyCase['status']) => void;

  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  updateMedicineStock: (id: string, delta: number) => void;

  addPrescription: (rx: Omit<Prescription, 'id' | 'rxNumber'>) => Prescription;

  addLabOrder: (order: Omit<LabOrder, 'id' | 'orderNumber'>) => void;
  enterLabResult: (id: string, resultSummary: string, value: string, unit: string, flag: 'Normal' | 'High' | 'Low' | 'Critical') => void;

  addRadiologyOrder: (order: Omit<RadiologyOrder, 'id' | 'orderNumber'>) => void;

  requestBloodUnit: (group: BloodGroup, units: number) => boolean;

  createInvoice: (inv: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  recordPayment: (payment: Omit<PaymentTransaction, 'id' | 'receiptNumber'>) => void;

  dispatchAmbulance: (id: string, destination: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  updateSettings: (newSettings: Partial<HospitalSettings>) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<NavigationView>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [activePrintDoc, setActivePrintDoc] = useState<PrintableDocument>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // States
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [opdTokens, setOpdTokens] = useState<OPDToken[]>(INITIAL_OPD_TOKENS);
  const [admissions, setAdmissions] = useState<Admission[]>(INITIAL_ADMISSIONS);
  const [beds, setBeds] = useState<Bed[]>(INITIAL_BEDS);
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>(INITIAL_EMERGENCY_CASES);
  const [labTests] = useState<LabTest[]>(INITIAL_LAB_TESTS);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(INITIAL_LAB_ORDERS);
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [radiologyOrders, setRadiologyOrders] = useState<RadiologyOrder[]>(INITIAL_RADIOLOGY_ORDERS);
  const [bloodStock, setBloodStock] = useState<BloodStockItem[]>(INITIAL_BLOOD_STOCK);
  const [bloodDonors] = useState<BloodDonor[]>(INITIAL_BLOOD_DONORS);
  const [surgeries, setSurgeries] = useState<OperationSurgery[]>(INITIAL_SURGERIES);
  const [icuMonitors] = useState<ICUBedMonitor[]>(INITIAL_ICU_MONITORS);
  const [staff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(INITIAL_AMBULANCES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [insurancePolicies] = useState<InsurancePolicy[]>(INITIAL_INSURANCE_POLICIES);
  const [inventory] = useState<InventorySupply[]>(INITIAL_INVENTORY);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<HospitalSettings>(INITIAL_SETTINGS);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (role = 'Admin') => {
    setIsAuthenticated(true);
    setUser({
      ...INITIAL_USER,
      role: role as any,
    });
    addToast('success', 'Logged In Successfully', `Welcome back, ${INITIAL_USER.name}`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    addToast('info', 'Logged Out', 'You have been signed out of the hospital management portal.');
  };

  // Patients CRUD
  const addPatient = (patientData: Omit<Patient, 'id' | 'mrn'>) => {
    const id = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const mrn = `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient: Patient = {
      ...patientData,
      id,
      mrn,
    };
    setPatients((prev) => [newPatient, ...prev]);
    addToast('success', 'Patient Added Successfully', `${newPatient.name} registered under ${mrn}`);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('success', 'Patient Record Updated', `Patient ${id} details saved.`);
  };

  const deletePatient = (id: string) => {
    const target = patients.find((p) => p.id === id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
    addToast('info', 'Patient Record Archived', `${target?.name || id} removed from active roster.`);
  };

  // Doctors
  const addDoctor = (doctorData: Omit<Doctor, 'id' | 'rating' | 'totalPatientsConsulted'>) => {
    const id = `DOC-${Math.floor(200 + Math.random() * 800)}`;
    const newDoc: Doctor = {
      ...doctorData,
      id,
      rating: 5.0,
      totalPatientsConsulted: 0,
    };
    setDoctors((prev) => [...prev, newDoc]);
    addToast('success', 'Doctor Profile Created', `${newDoc.name} registered to ${newDoc.department}.`);
  };

  const toggleDoctorAvailability = (id: string) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const nextState: Doctor['availability'] =
          d.availability === 'Available' ? 'In Consultation' : d.availability === 'In Consultation' ? 'In Surgery' : 'Available';
        return { ...d, availability: nextState };
      })
    );
    addToast('info', 'Availability Status Updated');
  };

  // Appointments
  const bookAppointment = (aptData: Omit<Appointment, 'id'>) => {
    const id = `APT-${Math.floor(500 + Math.random() * 9500)}`;
    const newApt: Appointment = { ...aptData, id };
    setAppointments((prev) => [newApt, ...prev]);
    addToast('success', 'Appointment Booked Successfully', `Appointment for ${newApt.patientName} on ${newApt.date} at ${newApt.time}.`);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    addToast('info', 'Appointment Status Changed', `Status updated to ${status}.`);
  };

  // OPD
  const addOPDToken = (patientName: string, doctorId: string, department: string, complaint: string) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    const tokenNumber = opdTokens.length + 1;
    const newToken: OPDToken = {
      id: `TOK-${Date.now()}`,
      tokenNumber,
      patientName,
      patientId: `PAT-OPD-${tokenNumber}`,
      doctorId,
      doctorName: doctor?.name || 'Assigned Duty Physician',
      department,
      issueTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Waiting',
      vitalsRecorded: false,
      complaint,
    };
    setOpdTokens((prev) => [...prev, newToken]);
    addToast('success', 'OPD Token Generated', `Token #${tokenNumber} assigned to ${patientName}.`);
  };

  const updateOPDStatus = (id: string, status: OPDToken['status']) => {
    setOpdTokens((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    addToast('info', 'OPD Queue Updated', `Token status updated to ${status}.`);
  };

  // Admissions & IPD
  const admitPatient = (admData: Omit<Admission, 'id' | 'mrn'>) => {
    const id = `ADM-${Math.floor(800 + Math.random() * 9000)}`;
    const mrn = `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAdm: Admission = {
      ...admData,
      id,
      mrn,
    };
    setAdmissions((prev) => [newAdm, ...prev]);
    // update bed status to occupied
    setBeds((prev) =>
      prev.map((b) =>
        b.bedNumber === admData.bedNumber
          ? { ...b, status: 'Occupied', currentPatientName: admData.patientName, currentPatientId: admData.patientId }
          : b
      )
    );
    // update patient status
    setPatients((prev) =>
      prev.map((p) =>
        p.id === admData.patientId
          ? { ...p, status: 'Inpatient', roomBed: `${admData.roomNumber} (${admData.bedNumber})` }
          : p
      )
    );
    addToast('success', 'Patient Admitted to IPD', `${newAdm.patientName} assigned to ${newAdm.bedNumber}.`);
  };

  const dischargePatient = (id: string) => {
    const adm = admissions.find((a) => a.id === id);
    if (!adm) return;
    setAdmissions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Discharged' } : a))
    );
    setBeds((prev) =>
      prev.map((b) =>
        b.bedNumber === adm.bedNumber ? { ...b, status: 'Cleaning', currentPatientName: undefined, currentPatientId: undefined } : b
      )
    );
    setPatients((prev) =>
      prev.map((p) =>
        p.id === adm.patientId ? { ...p, status: 'Discharged', dischargeDate: new Date().toISOString().split('T')[0] } : p
      )
    );
    addToast('success', 'Discharge Finalized', `${adm.patientName} successfully discharged. Bed marked for cleaning.`);
  };

  const updateBedStatus = (id: string, status: BedStatus, patientName?: string, patientId?: string) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status,
              currentPatientName: status === 'Occupied' ? patientName || b.currentPatientName : undefined,
              currentPatientId: status === 'Occupied' ? patientId || b.currentPatientId : undefined,
            }
          : b
      )
    );
    addToast('info', 'Bed Allocation Updated', `Bed marked as ${status}.`);
  };

  // Emergency
  const addEmergencyCase = (data: {
    patientName: string;
    age: number;
    gender: string;
    priority: EmergencyPriority;
    chiefComplaint: string;
    assignedDoctor: string;
    bedAssigned: string;
  }) => {
    const id = `ER-${Math.floor(900 + Math.random() * 9000)}`;
    const newCase: EmergencyCase = {
      id,
      patientName: data.patientName,
      age: data.age,
      gender: data.gender,
      priority: data.priority,
      chiefComplaint: data.chiefComplaint,
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assignedDoctor: data.assignedDoctor,
      bedAssigned: data.bedAssigned,
      vitals: {
        bp: '120/80',
        pulse: 88,
        spO2: 97,
        gcs: 15,
      },
      triageNurse: 'RN Brenda Walsh',
      status: 'Under Triage',
    };
    setEmergencyCases((prev) => [newCase, ...prev]);
    // Notification for emergency
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Emergency Alert: Priority ${data.priority}`,
      message: `${data.patientName} (${data.age}y) triaged: ${data.chiefComplaint.slice(0, 60)}...`,
      category: 'Emergency',
      timestamp: 'Just now',
      read: false,
      priority: 'High',
      targetView: 'emergency',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    addToast('error', 'Emergency Triage Alert', `${data.priority.toUpperCase()}: ${data.patientName} assigned to ${data.bedAssigned}`);
  };

  const updateEmergencyStatus = (id: string, status: EmergencyCase['status']) => {
    setEmergencyCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    addToast('info', 'Emergency Status Updated', `Patient status changed to ${status}.`);
  };

  // Pharmacy
  const addMedicine = (medData: Omit<Medicine, 'id'>) => {
    const id = `MED-${Math.floor(300 + Math.random() * 9000)}`;
    const newMed: Medicine = { ...medData, id };
    setMedicines((prev) => [newMed, ...prev]);
    addToast('success', 'Medicine Added to Formulary', `${newMed.brandName} (${newMed.genericName}) cataloged.`);
  };

  const updateMedicineStock = (id: string, delta: number) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const newQty = Math.max(0, m.stockQuantity + delta);
        return { ...m, stockQuantity: newQty };
      })
    );
    addToast('info', 'Pharmacy Stock Adjusted');
  };

  // Prescriptions
  const addPrescription = (rxData: Omit<Prescription, 'id' | 'rxNumber'>) => {
    const id = `RX-${Math.floor(700 + Math.random() * 9000)}`;
    const rxNumber = `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRx: Prescription = { ...rxData, id, rxNumber };
    setPrescriptions((prev) => [newRx, ...prev]);
    addToast('success', 'Digital Prescription Issued', `Prescription ${rxNumber} generated for ${newRx.patientName}.`);
    return newRx;
  };

  // Lab
  const addLabOrder = (orderData: Omit<LabOrder, 'id' | 'orderNumber'>) => {
    const id = `LBO-${Math.floor(4000 + Math.random() * 9000)}`;
    const orderNumber = `LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: LabOrder = { ...orderData, id, orderNumber };
    setLabOrders((prev) => [newOrder, ...prev]);
    addToast('success', 'Diagnostic Test Requisition Sent', `Test ${newOrder.testName} ordered for ${newOrder.patientName}.`);
  };

  const enterLabResult = (
    id: string,
    resultSummary: string,
    value: string,
    unit: string,
    flag: 'Normal' | 'High' | 'Low' | 'Critical'
  ) => {
    setLabOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: 'Completed',
              resultSummary,
              value,
              unit,
              flag,
            }
          : o
      )
    );
    addToast('success', 'Laboratory Result Published', `Diagnostic report verified and released.`);
  };

  // Radiology
  const addRadiologyOrder = (orderData: Omit<RadiologyOrder, 'id' | 'orderNumber'>) => {
    const id = `RAD-${Math.floor(600 + Math.random() * 9000)}`;
    const orderNumber = `RAD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newRad: RadiologyOrder = { ...orderData, id, orderNumber };
    setRadiologyOrders((prev) => [newRad, ...prev]);
    addToast('success', 'Radiology Scan Scheduled', `${newRad.modality} order logged for ${newRad.patientName}.`);
  };

  // Blood Bank
  const requestBloodUnit = (group: BloodGroup, units: number): boolean => {
    const target = bloodStock.find((b) => b.group === group);
    if (!target || target.unitsAvailable < units) {
      addToast('error', 'Blood Bank Deficit', `Insufficient units for Blood Group ${group}. Available: ${target?.unitsAvailable || 0}`);
      return false;
    }
    setBloodStock((prev) =>
      prev.map((b) => (b.group === group ? { ...b, unitsAvailable: b.unitsAvailable - units } : b))
    );
    addToast('success', 'Blood Units Dispatched', `${units} units of ${group} released to Clinical Unit.`);
    return true;
  };

  // Invoices & Payments
  const createInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const id = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInv: Invoice = { ...invData, id, invoiceNumber };
    setInvoices((prev) => [newInv, ...prev]);
    addToast('success', 'Hospital Invoice Generated', `Invoice ${invoiceNumber} created for ${newInv.patientName}.`);
    return newInv;
  };

  const recordPayment = (payData: Omit<PaymentTransaction, 'id' | 'receiptNumber'>) => {
    const id = `PAY-${Math.floor(700 + Math.random() * 9000)}`;
    const receiptNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: PaymentTransaction = { ...payData, id, receiptNumber };
    setPayments((prev) => [newPayment, ...prev]);

    // Update corresponding invoice
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceNumber !== payData.invoiceNumber) return inv;
        const newPaid = inv.paidAmount + payData.amount;
        const status: Invoice['status'] = newPaid >= inv.total ? 'Paid' : newPaid > 0 ? 'Partial' : 'Unpaid';
        return { ...inv, paidAmount: newPaid, status };
      })
    );
    addToast('success', 'Payment Recorded Successfully', `Receipt ${receiptNumber} created for $${payData.amount.toLocaleString()}.`);
  };

  // Ambulance
  const dispatchAmbulance = (id: string, destination: string) => {
    setAmbulances((prev) =>
      prev.map((amb) =>
        amb.id === id
          ? {
              ...amb,
              status: 'Dispatched / In Route',
              currentLocation: `En Route to ${destination}`,
            }
          : amb
      )
    );
    addToast('warning', 'Ambulance Dispatched', `Unit dispatched urgently to ${destination}.`);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('info', 'Notifications Marked Read');
  };

  // Settings
  const updateSettings = (newSettings: Partial<HospitalSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('success', 'Hospital Configuration Saved', 'Facility parameters updated.');
  };

  return (
    <HospitalContext.Provider
      value={{
        currentView,
        setCurrentView,
        isAuthenticated,
        user,
        login,
        logout,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,

        searchModalOpen,
        setSearchModalOpen,
        activePrintDoc,
        setActivePrintDoc,
        selectedPatientId,
        setSelectedPatientId,

        patients,
        doctors,
        appointments,
        departments,
        opdTokens,
        admissions,
        beds,
        emergencyCases,
        labTests,
        labOrders,
        medicines,
        prescriptions,
        radiologyOrders,
        bloodStock,
        bloodDonors,
        surgeries,
        icuMonitors,
        staff,
        ambulances,
        invoices,
        payments,
        insurancePolicies,
        inventory,
        notifications,
        settings,

        toasts,
        addToast,
        removeToast,

        addPatient,
        updatePatient,
        deletePatient,
        addDoctor,
        toggleDoctorAvailability,
        bookAppointment,
        updateAppointmentStatus,
        addOPDToken,
        updateOPDStatus,
        admitPatient,
        dischargePatient,
        updateBedStatus,
        addEmergencyCase,
        updateEmergencyStatus,
        addMedicine,
        updateMedicineStock,
        addPrescription,
        addLabOrder,
        enterLabResult,
        addRadiologyOrder,
        requestBloodUnit,
        createInvoice,
        recordPayment,
        dispatchAmbulance,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
