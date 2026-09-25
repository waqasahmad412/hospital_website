export type Role = 'Admin' | 'Doctor' | 'Nurse' | 'Pharmacist' | 'Receptionist' | 'Billing';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department?: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type PatientStatus = 'Outpatient' | 'Inpatient' | 'Emergency' | 'Discharged';

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  medicalHistory: string[];
  status: PatientStatus;
  assignedDoctorId?: string;
  roomBed?: string;
  admissionDate?: string;
  dischargeDate?: string;
  insuranceProvider?: string;
  policyNumber?: string;
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    spO2: number;
    recordedAt: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  qualification: string;
  experienceYears: number;
  phone: string;
  email: string;
  consultationFee: number;
  availability: 'Available' | 'In Consultation' | 'In Surgery' | 'On Leave';
  schedule: string;
  avatar: string;
  rating: number;
  totalPatientsConsulted: number;
}

export type AppointmentStatus = 'Scheduled' | 'In-Progress' | 'Completed' | 'Cancelled';
export type AppointmentType = 'General Checkup' | 'Follow-up' | 'Emergency' | 'Surgery Consult' | 'Routine Lab';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  fee: number;
}

export interface Department {
  id: string;
  name: string;
  headDoctor: string;
  phone: string;
  location: string;
  doctorCount: number;
  staffCount: number;
  bedCount: number;
  activePatients: number;
  services: string[];
  icon: string;
  description: string;
}

export interface OPDToken {
  id: string;
  tokenNumber: number;
  patientName: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  department: string;
  issueTime: string;
  status: 'Waiting' | 'Consulting' | 'Completed' | 'Skipped';
  vitalsRecorded: boolean;
  bp?: string;
  pulse?: number;
  temp?: number;
  complaint: string;
}

export interface Admission {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  roomNumber: string;
  bedNumber: string;
  wardType: 'General Ward' | 'Private Room' | 'Semi Private' | 'ICU' | 'CCU' | 'Emergency';
  doctorId: string;
  doctorName: string;
  admissionDate: string;
  expectedDischarge: string;
  condition: 'Stable' | 'Guarded' | 'Critical' | 'Recovering';
  diagnosis: string;
  dailyCharge: number;
  nursingNotes: string[];
  status: 'Admitted' | 'Discharged';
}

export type BedStatus = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning';

export interface Bed {
  id: string;
  bedNumber: string;
  ward: 'General Ward' | 'Private Room' | 'Semi Private' | 'ICU' | 'CCU' | 'Emergency';
  roomNumber: string;
  status: BedStatus;
  currentPatientName?: string;
  currentPatientId?: string;
  dailyRate: number;
}

export type EmergencyPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface EmergencyCase {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  priority: EmergencyPriority;
  chiefComplaint: string;
  arrivalTime: string;
  assignedDoctor: string;
  bedAssigned: string;
  vitals: {
    bp: string;
    pulse: number;
    spO2: number;
    gcs: number; // Glasgow Coma Scale
  };
  triageNurse: string;
  status: 'Under Triage' | 'In Resuscitation' | 'In Surgery' | 'Transferred to ICU' | 'Stabilized';
}

export interface LabTest {
  id: string;
  testCode: string;
  testName: string;
  category: 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Immunology' | 'Endocrinology' | 'Pathology';
  sampleType: 'Blood' | 'Serum' | 'Urine' | 'Swab' | 'Tissue';
  turnaroundTime: string;
  price: number;
  status: 'Available' | 'Under Maintenance';
}

export interface LabOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  testName: string;
  testCode: string;
  orderDate: string;
  status: 'Sample Pending' | 'Sample Collected' | 'In Analysis' | 'Completed';
  resultSummary?: string;
  normalRange?: string;
  value?: string;
  unit?: string;
  flag?: 'Normal' | 'High' | 'Low' | 'Critical';
}

export interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  category: 'Antibiotics' | 'Cardiovascular' | 'Analgesics' | 'Antidiabetic' | 'Respiratory' | 'GI & Hepatology' | 'Emergency & Critical';
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler' | 'Ointment';
  stockQuantity: number;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string;
  manufacturer: string;
  purchasePrice: number;
  sellingPrice: number;
  requiresPrescription: boolean;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  rxNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  diagnosis: string;
  vitalsSummary?: string;
  items: PrescriptionItem[];
  followUpDate?: string;
  adviceNotes?: string;
}

export interface RadiologyOrder {
  id: string;
  orderNumber: string;
  patientName: string;
  modality: 'X-Ray' | 'CT Scan' | 'MRI' | 'Ultrasound' | 'Mammography';
  bodyPart: string;
  orderingDoctor: string;
  radiologist: string;
  orderDate: string;
  status: 'Scheduled' | 'In Scan' | 'Awaiting Report' | 'Report Verified';
  findings?: string;
  urgency: 'Routine' | 'Urgent' | 'Stat';
}

export interface BloodStockItem {
  group: BloodGroup;
  unitsAvailable: number;
  criticalThreshold: number;
  expiringIn7Days: number;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  phone: string;
  lastDonationDate: string;
  totalDonations: number;
  eligibility: 'Eligible' | 'Deferred';
}

export interface OperationSurgery {
  id: string;
  surgeryCode: string;
  patientName: string;
  surgeryName: string;
  leadSurgeon: string;
  anesthetist: string;
  otRoom: 'OT-1 (Cardiac/Neuro)' | 'OT-2 (General)' | 'OT-3 (Orthopedics)' | 'OT-4 (Laparoscopic)';
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  status: 'Scheduled' | 'Pre-Op Prep' | 'Surgery in Progress' | 'In PACU Recovery' | 'Completed';
  priority: 'Emergency' | 'Elective';
}

export interface ICUBedMonitor {
  bedNumber: string;
  patientName: string;
  age: number;
  diagnosis: string;
  heartRate: number; // bpm
  bloodPressure: string;
  spO2: number; // %
  respRate: number; // /min
  temperature: number; // °F
  ventilatorSupport: boolean;
  assignedIntensivist: string;
  assignedNurse: string;
  alarmStatus: 'Normal' | 'Warning' | 'Critical';
}

export interface StaffMember {
  id: string;
  empId: string;
  name: string;
  role: 'Staff Nurse' | 'Charge Nurse' | 'Pharmacist' | 'Lab Technologist' | 'Radiographer' | 'Receptionist' | 'Administrator' | 'Security Officer';
  department: string;
  phone: string;
  email: string;
  shift: 'Morning (07:00 - 15:30)' | 'Evening (15:00 - 23:30)' | 'Night (23:00 - 07:30)' | 'General (09:00 - 17:30)';
  attendance: 'Present' | 'On Leave' | 'Off Duty';
  monthlySalary: number;
  joinedDate: string;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  callSign: string;
  type: 'Advanced Life Support (ALS)' | 'Basic Life Support (BLS)' | 'Mobile ICU';
  driverName: string;
  driverPhone: string;
  paramedicName: string;
  status: 'Standby / Ready' | 'Dispatched / In Route' | 'On Scene' | 'Transporting Patient' | 'Maintenance';
  fuelLevel: number; // percentage
  currentLocation: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'Consultation' | 'Bed Charge' | 'Laboratory' | 'Pharmacy' | 'Radiology' | 'Operation' | 'Nursing & Misc';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  mrn: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paidAmount: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
  insuranceClaimed?: number;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  invoiceNumber: string;
  patientName: string;
  amount: number;
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Wire' | 'Direct Insurance';
  date: string;
  processedBy: string;
  transactionRef: string;
  status: 'Successful' | 'Pending' | 'Reconciled';
}

export interface InsurancePolicy {
  id: string;
  patientName: string;
  companyName: string;
  policyNumber: string;
  planType: 'Comprehensive Health' | 'Corporate Group' | 'Senior Medical Care' | 'Emergency Cover';
  claimId: string;
  claimAmount: number;
  approvedAmount: number;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Settled' | 'Rejected';
  submissionDate: string;
}

export interface InventorySupply {
  id: string;
  itemCode: string;
  name: string;
  category: 'Surgical Disposables' | 'PPE & Safety' | 'Sterilization' | 'Diagnostic Consumables' | 'Linens & Ward';
  quantityOnHand: number;
  reorderThreshold: number;
  unit: string;
  unitCost: number;
  supplier: string;
  lastRestocked: string;
  status: 'In Stock' | 'Low Stock' | 'Critically Depleted';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Emergency' | 'Clinical' | 'Pharmacy' | 'Billing' | 'System';
  timestamp: string;
  read: boolean;
  priority: 'High' | 'Normal' | 'Info';
  targetView?: string;
}

export interface HospitalSettings {
  hospitalName: string;
  tagline: string;
  regNumber: string;
  address: string;
  cityCountry: string;
  phone: string;
  emergencyHotline: string;
  email: string;
  website: string;
  taxId: string;
  currency: string;
  bedCapacity: number;
  activeLanguage: string;
  maintenanceMode: boolean;
}
