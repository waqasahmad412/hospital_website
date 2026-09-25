import React, { useState } from 'react';
import {
  Users,
  Calendar,
  UserCheck,
  AlertCircle,
  BedDouble,
  DollarSign,
  TrendingUp,
  UserPlus,
  PlusCircle,
  CreditCard,
  HeartPulse,
  Activity,
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  Stethoscope,
  Building,
  Microscope,
  Pill,
} from 'lucide-react';
import { useHospital, NavigationView } from '../../context/HospitalContext';
import { HOSPITAL_IMAGES } from '../../data/mockHospitalData';
import { BloodGroup, EmergencyPriority } from '../../types/hospital';

export const DashboardView: React.FC = () => {
  const {
    setCurrentView,
    patients,
    doctors,
    appointments,
    emergencyCases,
    admissions,
    invoices,
    payments,
    departments,
    toggleDoctorAvailability,
    updateAppointmentStatus,
    addPatient,
    bookAppointment,
    addDoctor,
    addEmergencyCase,
    createInvoice,
    settings,
  } = useHospital();

  // Quick Action Modal states
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [bookAptOpen, setBookAptOpen] = useState(false);
  const [addDocOpen, setAddDocOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);

  // Form states for quick actions
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    age: 30,
    gender: 'Male' as const,
    bloodGroup: 'O+' as BloodGroup,
    phone: '',
    email: '',
    address: 'New York, NY',
    allergies: 'None',
    medicalHistory: 'None reported',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [newAptData, setNewAptData] = useState({
    patientName: '',
    doctorId: doctors[0]?.id || '',
    date: '2026-09-23',
    time: '11:00 AM',
    reason: '',
  });

  const [newDocData, setNewDocData] = useState({
    name: '',
    specialization: '',
    department: 'Cardiology',
    qualification: '',
    experienceYears: 10,
    phone: '',
    email: '',
    consultationFee: 200,
    schedule: 'Mon - Fri (09:00 - 17:00)',
    avatar: 'https://images.unsplash.com/photo-1594824813567-c376c66cf17f?w=300&auto=format&fit=crop&q=80',
    availability: 'Available' as const,
  });

  const [newEmergencyData, setNewEmergencyData] = useState({
    patientName: '',
    age: 35,
    gender: 'Male',
    priority: 'Critical' as EmergencyPriority,
    chiefComplaint: '',
    assignedDoctor: doctors[doctors.length - 1]?.name || 'Dr. Tariq Al-Mansoor, MD, FACEP',
    bedAssigned: 'ER Trauma Bay 1',
  });

  const [newInvoiceData, setNewInvoiceData] = useState({
    patientName: '',
    description: 'Comprehensive Clinical Consultation & Care',
    subtotal: 350,
  });

  // Calculate statistics
  const totalPatientsCount = patients.length;
  const todayAppointments = appointments.filter((a) => a.date === '2026-09-23');
  const availableDoctorsCount = doctors.filter((d) => d.availability === 'Available').length;
  const emergencyActiveCount = emergencyCases.filter((c) => c.status !== 'Stabilized').length;
  const activeAdmissionsCount = admissions.filter((a) => a.status === 'Admitted').length;
  const dischargesCount = admissions.filter((a) => a.status === 'Discharged').length;
  const pendingInvoices = invoices.filter((i) => i.status !== 'Paid');
  const pendingPaymentsAmount = pendingInvoices.reduce((acc, i) => acc + (i.total - i.paidAmount), 0);
  const todayRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  // Form Handlers
  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientData.name || !newPatientData.phone) return;
    addPatient({
      name: newPatientData.name,
      age: Number(newPatientData.age),
      gender: newPatientData.gender,
      dob: '1995-01-01',
      bloodGroup: newPatientData.bloodGroup,
      phone: newPatientData.phone,
      email: newPatientData.email || 'patient@stjude.org',
      address: newPatientData.address,
      emergencyContact: {
        name: newPatientData.emergencyContactName || 'Family Member',
        relationship: 'Primary',
        phone: newPatientData.emergencyContactPhone || newPatientData.phone,
      },
      allergies: newPatientData.allergies.split(',').map((s) => s.trim()),
      medicalHistory: newPatientData.medicalHistory.split(',').map((s) => s.trim()),
      status: 'Outpatient',
    });
    setAddPatientOpen(false);
    setNewPatientData({
      name: '',
      age: 30,
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '',
      email: '',
      address: 'New York, NY',
      allergies: 'None',
      medicalHistory: 'None reported',
      emergencyContactName: '',
      emergencyContactPhone: '',
    });
  };

  const handleBookAptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAptData.patientName) return;
    const doc = doctors.find((d) => d.id === newAptData.doctorId) || doctors[0];
    bookAppointment({
      patientId: `PAT-GEN-${Date.now().toString(36).slice(-4)}`,
      patientName: newAptData.patientName,
      doctorId: doc.id,
      doctorName: doc.name,
      department: doc.department,
      date: newAptData.date,
      time: newAptData.time,
      appointmentType: 'General Checkup',
      status: 'Scheduled',
      reason: newAptData.reason || 'General health consultation',
      fee: doc.consultationFee,
    });
    setBookAptOpen(false);
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocData.name || !newDocData.specialization) return;
    addDoctor(newDocData);
    setAddDocOpen(false);
  };

  const handleAddEmergencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmergencyData.patientName || !newEmergencyData.chiefComplaint) return;
    addEmergencyCase(newEmergencyData);
    setEmergencyModalOpen(false);
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceData.patientName) return;
    const tax = Number((newInvoiceData.subtotal * 0.05).toFixed(2));
    const total = Number((newInvoiceData.subtotal + tax).toFixed(2));
    createInvoice({
      patientId: 'PAT-WALKIN',
      patientName: newInvoiceData.patientName,
      mrn: `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: '2026-09-23',
      dueDate: '2026-10-07',
      items: [
        {
          id: 'item-1',
          description: newInvoiceData.description,
          category: 'Consultation',
          quantity: 1,
          unitPrice: newInvoiceData.subtotal,
          total: newInvoiceData.subtotal,
        },
      ],
      subtotal: newInvoiceData.subtotal,
      tax,
      discount: 0,
      total,
      paidAmount: 0,
      status: 'Unpaid',
    });
    setCreateInvoiceOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Visual Showcase: Hospital Campus Building (Left) + Doctor in Medical Attire (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left: Hospital Campus Showcase Image */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md group">
          <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
            <img
              src={HOSPITAL_IMAGES.heroBuilding}
              alt="St. Jude Metropolitan Hospital Main Campus"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

            {/* Top badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600/90 text-white px-3 py-1 text-xs font-bold backdrop-blur-md shadow-md border border-teal-400/30">
                <Building className="h-3.5 w-3.5" />
                <span>Hospital Campus</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900/80 text-emerald-400 px-2.5 py-1 text-xs font-medium backdrop-blur-md border border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>JCI & NABH Accredited</span>
              </span>
            </div>

            {/* Bottom Campus Details Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
              <div>
                <p className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                  Multi-Super Specialty Healthcare Complex
                </p>
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
                  St. Jude Metropolitan Medical Pavilion
                </h2>
                <p className="text-xs text-slate-200 mt-1 max-w-xl drop-shadow line-clamp-2">
                  500+ Bed Inpatient Facility · Level-1 Adult & Pediatric Trauma Center · 24/7 STAT Emergency Response
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2.5 bg-slate-950/70 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shrink-0 shadow-lg">
                <div className="text-center">
                  <span className="block text-[9px] text-slate-400 uppercase font-semibold">Wards</span>
                  <span className="text-xs font-bold text-white font-mono">14 Wings</span>
                </div>
                <div className="h-5 w-px bg-white/20" />
                <div className="text-center">
                  <span className="block text-[9px] text-slate-400 uppercase font-semibold">Trauma Deck</span>
                  <span className="text-xs font-bold text-rose-400 font-mono">STAT 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Senior Doctor in Medical Attire (White Coat & Stethoscope) */}
        <div
          onClick={() => setCurrentView('doctors')}
          className="lg:col-span-4 relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 shadow-md group cursor-pointer hover:border-teal-400 hover:shadow-lg transition-all"
        >
          <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
            {/* Doctor Image with white coat and stethoscope */}
            <img
              src={HOSPITAL_IMAGES.chiefDoctor}
              onError={(e) => {
                // Fallback to high-res medical doctor portrait in coat with stethoscope
                e.currentTarget.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80';
              }}
              alt="Chief Physician Dr. Evelyn Vance in Medical Coat & Stethoscope"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle gradient overlay to ensure crisp readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-slate-900/10" />

            {/* Top Doctor Badge */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700/90 text-white px-2.5 py-1 text-xs font-bold backdrop-blur-md border border-teal-400/30 shadow-sm">
                <Stethoscope className="h-3.5 w-3.5 text-teal-200" />
                <span>Chief Medical Officer</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                <span>On Duty</span>
              </span>
            </div>

            {/* Bottom Doctor Details & Credentials */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300 uppercase tracking-wide">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
                <span>Board Certified Specialist</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 group-hover:text-teal-200 transition-colors">
                Dr. Evelyn Vance, MD, FACP
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                Senior Consultant Physician & Critical Care Specialist
              </p>

              <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1">
                  <UserCheck className="h-3 w-3 text-teal-400" />
                  <span>Faculty Lead · 18+ Yrs Exp</span>
                </span>
                <span className="text-teal-300 font-semibold group-hover:underline">
                  View Doctors →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Acute Care & Clinical Operations Command Center */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-teal-950/70" />

        <div className="relative z-10 p-6 sm:p-8 md:p-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-md bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300 border border-teal-500/30 mb-4 backdrop-blur-sm">
            <HeartPulse className="h-4 w-4" />
            <span>Acute Care & Clinical Operations Command</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white text-balance leading-tight">
            Welcome to {settings.hospitalName}
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium max-w-2xl leading-relaxed">
            Complete Hospital Management System — Real-time telemetry, acute clinical triage, inpatient tracking, pharmacy dispensing, and surgical suites.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
            <button
              onClick={() => setAddPatientOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-teal-500 transition-all hover:shadow-lg active:scale-95"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Patient</span>
            </button>

            <button
              onClick={() => setBookAptOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-all active:scale-95"
            >
              <Calendar className="h-4 w-4 text-teal-300" />
              <span>Book Appointment</span>
            </button>

            <button
              onClick={() => setAddDocOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-all active:scale-95"
            >
              <UserCheck className="h-4 w-4 text-teal-300" />
              <span>Add Doctor</span>
            </button>

            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-rose-500 transition-all hover:shadow-lg active:scale-95"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Emergency Triage</span>
            </button>

            <button
              onClick={() => setCreateInvoiceOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-all active:scale-95"
            >
              <CreditCard className="h-4 w-4 text-teal-400" />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Statistics Grid (8 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Patients */}
        <div
          onClick={() => setCurrentView('patients')}
          className="group cursor-pointer rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm hover:border-teal-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Patients</span>
            <Users className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">{totalPatientsCount}</p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="text-emerald-700 font-semibold">+4 registered</span>
            <span>today</span>
          </div>
        </div>

        {/* Today's Appointments */}
        <div
          onClick={() => setCurrentView('appointments')}
          className="group cursor-pointer rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm hover:border-teal-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Today's Appts</span>
            <Calendar className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">{todayAppointments.length}</p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="text-teal-700 font-semibold">{todayAppointments.filter((a) => a.status === 'Completed').length} done</span>
            <span>· {todayAppointments.filter((a) => a.status === 'In-Progress').length} in room</span>
          </div>
        </div>

        {/* Available Doctors */}
        <div
          onClick={() => setCurrentView('doctors')}
          className="group cursor-pointer rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm hover:border-teal-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Available Doctors</span>
            <UserCheck className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-700 font-mono tabular-nums">{availableDoctorsCount} <span className="text-sm font-normal text-slate-400">/ {doctors.length}</span></p>
          <div className="mt-1 text-[11px] text-slate-500 truncate">
            All major clinical departments covered
          </div>
        </div>

        {/* Emergency Patients */}
        <div
          onClick={() => setCurrentView('emergency')}
          className="group cursor-pointer rounded-xl border border-rose-200 bg-rose-50/40 p-4 shadow-sm hover:border-rose-300 hover:bg-rose-50/70 transition-all"
        >
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wide">Emergency Cases</span>
            <AlertCircle className="h-4 w-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-700 font-mono tabular-nums">{emergencyActiveCount}</p>
          <div className="mt-1 text-[11px] text-rose-700 font-semibold">
            {emergencyCases.filter((c) => c.priority === 'Critical').length} Critical · Level 1 Trauma Active
          </div>
        </div>

        {/* Inpatient Admissions */}
        <div
          onClick={() => setCurrentView('admissions')}
          className="group cursor-pointer rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm hover:border-teal-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Admissions</span>
            <BedDouble className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">{activeAdmissionsCount}</p>
          <div className="mt-1 text-[11px] text-slate-500">
            Ward & ICU occupancy active
          </div>
        </div>

        {/* Discharges */}
        <div
          onClick={() => setCurrentView('discharge')}
          className="group cursor-pointer rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm hover:border-teal-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Discharges</span>
            <CheckCircle2 className="h-4 w-4 text-slate-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">{dischargesCount}</p>
          <div className="mt-1 text-[11px] text-slate-500">
            Discharge summaries approved
          </div>
        </div>

        {/* Pending Payments */}
        <div
          onClick={() => setCurrentView('billing')}
          className="group cursor-pointer rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm hover:border-amber-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending Due</span>
            <DollarSign className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-700 font-mono tabular-nums">${pendingPaymentsAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          <div className="mt-1 text-[11px] text-slate-500">
            {pendingInvoices.length} invoices pending settlement
          </div>
        </div>

        {/* Today's Revenue */}
        <div
          onClick={() => setCurrentView('payments')}
          className="group cursor-pointer rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Today's Revenue</span>
            <TrendingUp className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-700 font-mono tabular-nums">${todayRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          <div className="mt-1 text-[11px] text-emerald-700 font-semibold">
            Reconciled through central billing
          </div>
        </div>
      </div>

      {/* 3. Clinical Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Registrations & Admissions Trend (SVG Chart) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Patient Volume & Inpatient Occupancy</h2>
              <p className="text-xs text-slate-400">Weekly patient admissions and discharge flow trends</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-teal-600" />
                Admissions
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                Discharges
              </span>
            </div>
          </div>

          <div className="mt-4">
            {/* Responsive SVG Chart */}
            <div className="h-48 w-full">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 500 150">
                {/* Grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" strokeWidth="1" />

                {/* Bars for 7 days */}
                {[
                  { day: 'Thu', adm: 32, dis: 24, x: 25 },
                  { day: 'Fri', adm: 45, dis: 30, x: 95 },
                  { day: 'Sat', adm: 28, dis: 38, x: 165 },
                  { day: 'Sun', adm: 22, dis: 18, x: 235 },
                  { day: 'Mon', adm: 52, dis: 40, x: 305 },
                  { day: 'Tue', adm: 48, dis: 44, x: 375 },
                  { day: 'Wed (Today)', adm: 58, dis: 35, x: 445 },
                ].map((item, idx) => {
                  const hAdm = (item.adm / 60) * 90;
                  const hDis = (item.dis / 60) * 90;
                  return (
                    <g key={idx}>
                      {/* Admissions Bar */}
                      <rect
                        x={item.x - 14}
                        y={120 - hAdm}
                        width="12"
                        height={hAdm}
                        rx="3"
                        className="fill-teal-600 hover:fill-teal-700 transition-colors cursor-pointer"
                      >
                        <title>{`${item.day}: ${item.adm} Admissions`}</title>
                      </rect>
                      {/* Discharges Bar */}
                      <rect
                        x={item.x + 2}
                        y={120 - hDis}
                        width="12"
                        height={hDis}
                        rx="3"
                        className="fill-slate-300 hover:fill-slate-400 transition-colors cursor-pointer"
                      >
                        <title>{`${item.day}: ${item.dis} Discharges`}</title>
                      </rect>
                      {/* Label */}
                      <text
                        x={item.x}
                        y="140"
                        textAnchor="middle"
                        className="text-[10px] fill-slate-400 font-medium"
                      >
                        {item.day}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Department Bed Utilization & Breakdown */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Bed Occupancy by Wing</h2>
              <button
                onClick={() => setCurrentView('rooms-beds')}
                className="text-xs text-teal-600 hover:underline font-medium"
              >
                View Map
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {[
                { name: 'Cardiology Ward', used: 38, total: 45, pct: 84 },
                { name: 'Intensive Care Unit (ICU)', used: 14, total: 16, pct: 88, alert: true },
                { name: 'Orthopedics & Surgery', used: 31, total: 38, pct: 82 },
                { name: 'Emergency Trauma Beds', used: 19, total: 28, pct: 68 },
                { name: 'Pediatrics Wing', used: 28, total: 40, pct: 70 },
              ].map((ward) => (
                <div key={ward.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{ward.name}</span>
                    <span className="font-mono text-slate-500">
                      {ward.used}/{ward.total} ({ward.pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        ward.alert ? 'bg-amber-500' : 'bg-teal-600'
                      }`}
                      style={{ width: `${ward.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100 flex items-center justify-between">
            <span>Overall Facility Utilization:</span>
            <span className="font-mono font-bold text-teal-800">79.2% Nominal</span>
          </div>
        </div>
      </div>

      {/* 4. Active Tables: Today's Appointments & Emergency Room Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments List */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">Today's Appointment Schedule</h2>
            </div>
            <button
              onClick={() => setCurrentView('appointments')}
              className="text-xs text-teal-600 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {todayAppointments.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No appointments scheduled today</div>
            ) : (
              todayAppointments.map((apt) => (
                <div key={apt.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-teal-700 font-bold text-xs">
                      {apt.time.split(' ')[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{apt.patientName}</p>
                      <p className="text-[11px] text-slate-500">
                        {apt.doctorName} · {apt.department}
                      </p>
                      <p className="text-[11px] text-slate-400 italic line-clamp-1">{apt.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        apt.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : apt.status === 'In-Progress'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-teal-50 text-teal-700'
                      }`}
                    >
                      {apt.status}
                    </span>
                    {apt.status === 'Scheduled' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'In-Progress')}
                        className="rounded border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-100"
                      >
                        Call
                      </button>
                    )}
                    {apt.status === 'In-Progress' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                        className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700 hover:bg-emerald-100"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Emergency Cases Live Alert Board */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              <h2 className="text-sm font-bold text-slate-900">Emergency & Triage Queue</h2>
            </div>
            <button
              onClick={() => setCurrentView('emergency')}
              className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Full ER Deck</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {emergencyCases.map((ec) => (
              <div key={ec.id} className="py-3 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        ec.priority === 'Critical'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : ec.priority === 'High'
                          ? 'bg-orange-500 text-white'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ec.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{ec.patientName}</span>
                    <span className="text-[11px] text-slate-400">({ec.age}y {ec.gender})</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{ec.chiefComplaint}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span>BP: {ec.vitals.bp}</span>
                    <span>HR: {ec.vitals.pulse} bpm</span>
                    <span>SpO2: {ec.vitals.spO2}%</span>
                    <span className="text-teal-700 font-semibold">{ec.bedAssigned}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-mono">{ec.arrivalTime}</span>
                  <span className="text-[11px] font-semibold text-slate-700">{ec.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Doctor Availability Roster & Recent Patient Records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Availability Bar */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Attending Specialists</h2>
            <button
              onClick={() => setCurrentView('doctors')}
              className="text-xs text-teal-600 hover:underline font-semibold"
            >
              All Doctors
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {doctors.slice(0, 4).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img src={doc.avatar} alt={doc.name} className="h-9 w-9 rounded-full object-cover border border-slate-200" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{doc.name}</p>
                    <p className="text-[11px] text-slate-500">{doc.department}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleDoctorAvailability(doc.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    doc.availability === 'Available'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : doc.availability === 'In Consultation'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  {doc.availability}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Patient Registrations</h2>
              <p className="text-xs text-slate-400">Electronic Health Record (EHR) quick view</p>
            </div>
            <button
              onClick={() => setCurrentView('patients')}
              className="text-xs text-teal-600 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Patient Directory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="py-2">MRN</th>
                  <th className="py-2">Patient</th>
                  <th className="py-2">Blood</th>
                  <th className="py-2">Contact</th>
                  <th className="py-2">Condition / Notes</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 font-mono text-[11px] font-semibold text-teal-700">{p.mrn}</td>
                    <td className="py-2.5">
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.age}y · {p.gender}</p>
                    </td>
                    <td className="py-2.5">
                      <span className="font-bold text-slate-700 font-mono">{p.bloodGroup}</span>
                    </td>
                    <td className="py-2.5 text-slate-600 font-mono text-[11px]">{p.phone}</td>
                    <td className="py-2.5 text-slate-500 max-w-[180px] truncate">
                      {p.medicalHistory.join(', ') || 'Normal'}
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'Inpatient'
                            ? 'bg-blue-50 text-blue-700'
                            : p.status === 'Emergency'
                            ? 'bg-rose-50 text-rose-700'
                            : p.status === 'Discharged'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* QUICK ACTION MODALS */}

      {/* Modal 1: Add Patient */}
      {addPatientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Register New Patient</h3>
            <form onSubmit={handleAddPatientSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newPatientData.name}
                  onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                  placeholder="e.g. Johnathan Miller"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={newPatientData.age}
                    onChange={(e) => setNewPatientData({ ...newPatientData, age: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Gender</label>
                  <select
                    value={newPatientData.gender}
                    onChange={(e) => setNewPatientData({ ...newPatientData, gender: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Blood Group</label>
                  <select
                    value={newPatientData.bloodGroup}
                    onChange={(e) => setNewPatientData({ ...newPatientData, bloodGroup: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none font-mono"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newPatientData.phone}
                    onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newPatientData.email}
                    onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                    placeholder="patient@gmail.com"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Known Allergies</label>
                <input
                  type="text"
                  value={newPatientData.allergies}
                  onChange={(e) => setNewPatientData({ ...newPatientData, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Peanuts, Latex"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddPatientOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Book Appointment */}
      {bookAptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Book Clinical Consultation</h3>
            <form onSubmit={handleBookAptSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  value={newAptData.patientName}
                  onChange={(e) => setNewAptData({ ...newAptData, patientName: e.target.value })}
                  placeholder="e.g. Eleanor Vance-Hayes"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Select Physician / Specialist</label>
                <select
                  value={newAptData.doctorId}
                  onChange={(e) => setNewAptData({ ...newAptData, doctorId: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialization} (${d.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={newAptData.date}
                    onChange={(e) => setNewAptData({ ...newAptData, date: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={newAptData.time}
                    onChange={(e) => setNewAptData({ ...newAptData, time: e.target.value })}
                    placeholder="10:30 AM"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Chief Reason for Visit</label>
                <textarea
                  rows={2}
                  value={newAptData.reason}
                  onChange={(e) => setNewAptData({ ...newAptData, reason: e.target.value })}
                  placeholder="Cardiac follow-up, general health checkup, migraine..."
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBookAptOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add Doctor */}
      {addDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Medical Faculty / Doctor</h3>
            <form onSubmit={handleAddDoctorSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  value={newDocData.name}
                  onChange={(e) => setNewDocData({ ...newDocData, name: e.target.value })}
                  placeholder="e.g. Dr. Julian Vance, MD"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Specialization *</label>
                  <input
                    type="text"
                    required
                    value={newDocData.specialization}
                    onChange={(e) => setNewDocData({ ...newDocData, specialization: e.target.value })}
                    placeholder="Interventional Cardiology"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Department</label>
                  <select
                    value={newDocData.department}
                    onChange={(e) => setNewDocData({ ...newDocData, department: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  >
                    {departments.map((dep) => (
                      <option key={dep.id} value={dep.name}>{dep.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Qualifications</label>
                  <input
                    type="text"
                    value={newDocData.qualification}
                    onChange={(e) => setNewDocData({ ...newDocData, qualification: e.target.value })}
                    placeholder="MD (Harvard), Board Certified"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    value={newDocData.consultationFee}
                    onChange={(e) => setNewDocData({ ...newDocData, consultationFee: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddDocOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Register Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Emergency Rapid Admit */}
      {emergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-rose-300 animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-rose-600 font-bold mb-3">
              <ShieldAlert className="h-5 w-5" />
              <h3 className="text-base font-bold text-slate-900">STAT Emergency Room Triage</h3>
            </div>
            <form onSubmit={handleAddEmergencySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Emergency Patient Name *</label>
                <input
                  type="text"
                  required
                  value={newEmergencyData.patientName}
                  onChange={(e) => setNewEmergencyData({ ...newEmergencyData, patientName: e.target.value })}
                  placeholder="e.g. Mark Robinson"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Triage Priority</label>
                  <select
                    value={newEmergencyData.priority}
                    onChange={(e) => setNewEmergencyData({ ...newEmergencyData, priority: e.target.value as any })}
                    className="w-full rounded-lg border border-rose-300 p-2 focus:border-rose-500 font-bold text-rose-700"
                  >
                    <option value="Critical">Critical (Immediate STAT)</option>
                    <option value="High">High (Urgent &lt; 15m)</option>
                    <option value="Medium">Medium (Semi-Urgent)</option>
                    <option value="Low">Low (Non-Urgent Fast-Track)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Assigned Bed</label>
                  <input
                    type="text"
                    value={newEmergencyData.bedAssigned}
                    onChange={(e) => setNewEmergencyData({ ...newEmergencyData, bedAssigned: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Chief Trauma / Medical Complaint *</label>
                <textarea
                  rows={2}
                  required
                  value={newEmergencyData.chiefComplaint}
                  onChange={(e) => setNewEmergencyData({ ...newEmergencyData, chiefComplaint: e.target.value })}
                  placeholder="Sudden severe dyspnea, acute chest pressure, trauma collision..."
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEmergencyModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 shadow"
                >
                  Dispatch Trauma Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Create Invoice */}
      {createInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create Patient Invoice</h3>
            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  value={newInvoiceData.patientName}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, patientName: e.target.value })}
                  placeholder="e.g. Eleanor Vance-Hayes"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Service / Description</label>
                <input
                  type="text"
                  value={newInvoiceData.description}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Subtotal Amount ($)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={newInvoiceData.subtotal}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, subtotal: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Medical Tax (5%):</span>
                  <span className="font-mono">${(newInvoiceData.subtotal * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Grand Total:</span>
                  <span className="font-mono text-teal-800">${(newInvoiceData.subtotal * 1.05).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateInvoiceOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
