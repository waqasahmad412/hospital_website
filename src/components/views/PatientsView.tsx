import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  FileText,
  Calendar,
  Activity,
  HeartPulse,
  CreditCard,
  Printer,
  ChevronRight,
  Shield,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Patient, BloodGroup, PatientStatus } from '../../types/hospital';

export const PatientsView: React.FC = () => {
  const {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    appointments,
    prescriptions,
    labOrders,
    invoices,
    setActivePrintDoc,
    selectedPatientId,
    setSelectedPatientId,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [bloodFilter, setBloodFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'appointments' | 'prescriptions' | 'labs' | 'billing'>('overview');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: 35,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: 'O+' as BloodGroup,
    phone: '',
    email: '',
    address: '',
    allergies: '',
    medicalHistory: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: 'Blue Cross Blue Shield',
    policyNumber: 'BCBS-109283',
    status: 'Outpatient' as PatientStatus,
  });

  // Selected patient for detail drawer/page
  const activePatient = patients.find((p) => p.id === selectedPatientId) || null;

  // Filtered patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesBlood = bloodFilter === 'All' || p.bloodGroup === bloodFilter;
    return matchesSearch && matchesStatus && matchesBlood;
  });

  // Handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    const newPat = addPatient({
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      dob: '1991-05-14',
      bloodGroup: formData.bloodGroup,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      address: formData.address || '742 Park Ave, New York, NY',
      emergencyContact: {
        name: formData.emergencyContactName || 'Family Member',
        relationship: 'Primary Contact',
        phone: formData.emergencyContactPhone || formData.phone,
      },
      allergies: formData.allergies ? formData.allergies.split(',').map((s) => s.trim()) : ['None Reported'],
      medicalHistory: formData.medicalHistory ? formData.medicalHistory.split(',').map((s) => s.trim()) : ['Annual Wellness Check'],
      status: formData.status,
      insuranceProvider: formData.insuranceProvider,
      policyNumber: formData.policyNumber,
      vitals: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        spO2: 99,
        recordedAt: '2026-09-23 09:00',
      },
    });
    setIsAddModalOpen(false);
    setSelectedPatientId(newPat.id);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientToEdit) return;
    updatePatient(patientToEdit.id, {
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      status: formData.status,
      insuranceProvider: formData.insuranceProvider,
      policyNumber: formData.policyNumber,
    });
    setIsEditModalOpen(false);
    setPatientToEdit(null);
  };

  const openEdit = (p: Patient) => {
    setPatientToEdit(p);
    setFormData({
      name: p.name,
      age: p.age,
      gender: p.gender,
      bloodGroup: p.bloodGroup,
      phone: p.phone,
      email: p.email,
      address: p.address,
      allergies: p.allergies.join(', '),
      medicalHistory: p.medicalHistory.join(', '),
      emergencyContactName: p.emergencyContact.name,
      emergencyContactPhone: p.emergencyContact.phone,
      insuranceProvider: p.insuranceProvider || '',
      policyNumber: p.policyNumber || '',
      status: p.status,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Patient Electronic Health Records (EHR)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage comprehensive clinical profiles, allergies, prescriptions, diagnostic reports, and admission histories.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: '',
              age: 35,
              gender: 'Male' as 'Male' | 'Female' | 'Other',
              bloodGroup: 'O+',
              phone: '',
              email: '',
              address: '',
              allergies: '',
              medicalHistory: '',
              emergencyContactName: '',
              emergencyContactPhone: '',
              insuranceProvider: 'Blue Cross Blue Shield',
              policyNumber: 'BCBS-109283',
              status: 'Outpatient',
            });
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, MRN, phone..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Inpatient">Inpatient</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Emergency">Emergency</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          {/* Blood Group Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400">Blood:</span>
            <select
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none font-mono"
            >
              <option value="All">All Blood Groups</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Split List and Patient Profile Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Patient List (5 cols or full if none selected) */}
        <div className={selectedPatientId ? 'lg:col-span-5 space-y-3' : 'lg:col-span-12 space-y-3'}>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-800">Patients Directory ({filteredPatients.length})</span>
              <span>Showing active EHR records</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
              {filteredPatients.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No patient records match the selected filters.
                </div>
              ) : (
                filteredPatients.map((patient) => {
                  const isSelected = selectedPatientId === patient.id;
                  return (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatientId(patient.id)}
                      className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between ${
                        isSelected ? 'bg-teal-50/70 border-l-4 border-teal-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-teal-800 font-bold text-xs uppercase font-mono">
                          {patient.bloodGroup}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900">{patient.name}</p>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                patient.status === 'Inpatient'
                                  ? 'bg-blue-50 text-blue-700'
                                  : patient.status === 'Emergency'
                                  ? 'bg-rose-50 text-rose-700 font-bold animate-pulse'
                                  : patient.status === 'Discharged'
                                  ? 'bg-slate-100 text-slate-500'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {patient.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            MRN: <span className="font-mono text-teal-700 font-semibold">{patient.mrn}</span> · {patient.age}y {patient.gender}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{patient.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedPatientId(patient.id)}
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg"
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(patient)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                          title="Edit Patient"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setPatientToDelete(patient)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg"
                          title="Archive Patient"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Comprehensive Patient Detail Profile with Interactive Tabs (7 cols) */}
        {activePatient && (
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-in fade-in duration-200">
            {/* Header with quick close and patient hero */}
            <div className="border-b border-slate-100 p-5 bg-gradient-to-r from-slate-50 to-teal-50/20">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-white font-mono font-bold text-lg shadow-md">
                    {activePatient.bloodGroup}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">{activePatient.name}</h2>
                      <span className="rounded bg-teal-100/80 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                        {activePatient.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      MRN: {activePatient.mrn} · DOB: {activePatient.dob} ({activePatient.age} yrs) · {activePatient.gender}
                    </p>
                    {activePatient.roomBed && (
                      <p className="text-xs font-semibold text-teal-700 mt-1">
                        Currently Admitted: {activePatient.roomBed}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(activePatient)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setSelectedPatientId(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-1 mt-5 border-t border-slate-200/80 pt-3">
                {[
                  { id: 'overview', label: 'Overview & Vitals' },
                  { id: 'history', label: 'History & Allergies' },
                  { id: 'appointments', label: 'Appointments' },
                  { id: 'prescriptions', label: 'Prescriptions (Rx)' },
                  { id: 'labs', label: 'Lab Reports' },
                  { id: 'billing', label: 'Billing & Invoices' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-5 max-h-[60vh] overflow-y-auto text-xs">
              {/* TAB 1: OVERVIEW & VITALS */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  {/* Latest Vitals Bar */}
                  {activePatient.vitals && (
                    <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-teal-900 flex items-center gap-1.5">
                          <Activity className="h-4 w-4 text-teal-600" />
                          Latest Clinical Vitals
                        </span>
                        <span className="text-[10px] text-teal-700 font-mono">
                          Recorded: {activePatient.vitals.recordedAt}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="bg-white p-2.5 rounded-lg border border-teal-100 shadow-sm">
                          <span className="text-[10px] text-slate-400 block font-medium">Blood Pressure</span>
                          <span className="text-sm font-bold text-slate-900 font-mono">{activePatient.vitals.bloodPressure}</span>
                          <span className="text-[10px] text-slate-400 block">mmHg</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-teal-100 shadow-sm">
                          <span className="text-[10px] text-slate-400 block font-medium">Heart Rate</span>
                          <span className="text-sm font-bold text-slate-900 font-mono">{activePatient.vitals.heartRate}</span>
                          <span className="text-[10px] text-slate-400 block">bpm</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-teal-100 shadow-sm">
                          <span className="text-[10px] text-slate-400 block font-medium">Temperature</span>
                          <span className="text-sm font-bold text-slate-900 font-mono">{activePatient.vitals.temperature}°F</span>
                          <span className="text-[10px] text-slate-400 block">Normal</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-teal-100 shadow-sm">
                          <span className="text-[10px] text-slate-400 block font-medium">Oxygen Saturation</span>
                          <span className="text-sm font-bold text-teal-800 font-mono">{activePatient.vitals.spO2}%</span>
                          <span className="text-[10px] text-slate-400 block">SpO2 Room Air</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Demographics & Contact Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                      <p className="font-bold text-slate-900 text-xs uppercase tracking-wide">Contact Information</p>
                      <div className="space-y-1 text-slate-600">
                        <p className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{activePatient.phone}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span className="truncate">{activePatient.email}</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{activePatient.address}</span>
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                      <p className="font-bold text-slate-900 text-xs uppercase tracking-wide">Emergency Contact</p>
                      <div className="space-y-1 text-slate-600">
                        <p><strong className="text-slate-800">{activePatient.emergencyContact.name}</strong> ({activePatient.emergencyContact.relationship})</p>
                        <p className="font-mono text-slate-700">{activePatient.emergencyContact.phone}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 mt-2">
                        <p className="text-[11px] font-bold text-slate-800">Insurance Policy</p>
                        <p className="text-slate-600">{activePatient.insuranceProvider || 'No Commercial Insurance'}</p>
                        <p className="text-slate-400 font-mono text-[10px]">{activePatient.policyNumber || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDICAL HISTORY & ALLERGIES */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-4">
                    <div className="flex items-center gap-2 text-rose-700 font-bold mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Known Drug & Food Allergies</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activePatient.allergies.map((allergy, i) => (
                        <span key={i} className="rounded-md bg-rose-100 border border-rose-200 px-2 py-1 text-rose-800 font-semibold text-xs">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="font-bold text-slate-900 mb-2">Chronic Conditions & Surgical History</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {activePatient.medicalHistory.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div className="space-y-2">
                  {appointments.filter((a) => a.patientId === activePatient.id || a.patientName === activePatient.name).length === 0 ? (
                    <p className="text-slate-400 py-4 text-center">No appointment records found for this patient.</p>
                  ) : (
                    appointments
                      .filter((a) => a.patientId === activePatient.id || a.patientName === activePatient.name)
                      .map((apt) => (
                        <div key={apt.id} className="rounded-xl border border-slate-200 p-3 flex justify-between items-center bg-slate-50/50">
                          <div>
                            <p className="font-bold text-slate-900">{apt.reason || 'Clinical Consultation'}</p>
                            <p className="text-slate-500">{apt.doctorName} · {apt.department}</p>
                            <p className="text-slate-400 font-mono text-[11px]">{apt.date} at {apt.time}</p>
                          </div>
                          <span className="rounded bg-teal-50 px-2 py-1 text-teal-800 font-bold text-[10px]">
                            {apt.status}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* TAB 4: PRESCRIPTIONS */}
              {activeTab === 'prescriptions' && (
                <div className="space-y-3">
                  {prescriptions.filter((p) => p.patientId === activePatient.id || p.patientName === activePatient.name).length === 0 ? (
                    <p className="text-slate-400 py-4 text-center">No digital prescriptions on file.</p>
                  ) : (
                    prescriptions
                      .filter((p) => p.patientId === activePatient.id || p.patientName === activePatient.name)
                      .map((rx) => (
                        <div key={rx.id} className="rounded-xl border border-slate-200 p-3.5 space-y-2 bg-slate-50/40">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-slate-900">{rx.rxNumber}</p>
                              <p className="text-slate-500">Dr. {rx.doctorName} · {rx.date}</p>
                              <p className="text-teal-800 font-medium mt-0.5">Dx: {rx.diagnosis}</p>
                            </div>
                            <button
                              onClick={() => setActivePrintDoc({ type: 'prescription', data: rx })}
                              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              <Printer className="h-3.5 w-3.5 text-teal-600" />
                              <span>Print Rx</span>
                            </button>
                          </div>

                          <div className="border-t border-slate-200 pt-2 space-y-1">
                            {rx.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-slate-700 text-[11px]">
                                <span><strong>{it.medicineName}</strong> ({it.dosage})</span>
                                <span className="text-slate-500 font-mono">{it.frequency} · {it.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* TAB 5: LAB REPORTS */}
              {activeTab === 'labs' && (
                <div className="space-y-2">
                  {labOrders.filter((l) => l.patientId === activePatient.id || l.patientName === activePatient.name).length === 0 ? (
                    <p className="text-slate-400 py-4 text-center">No pathology lab tests ordered yet.</p>
                  ) : (
                    labOrders
                      .filter((l) => l.patientId === activePatient.id || l.patientName === activePatient.name)
                      .map((lo) => (
                        <div key={lo.id} className="rounded-xl border border-slate-200 p-3.5 flex justify-between items-center bg-slate-50/50">
                          <div>
                            <p className="font-bold text-slate-900">{lo.testName}</p>
                            <p className="text-slate-500">Ordered by {lo.doctorName} on {lo.orderDate}</p>
                            {lo.value && (
                              <p className="text-teal-800 font-mono font-semibold mt-1">
                                Result: {lo.value} {lo.unit} ({lo.flag})
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-teal-50 px-2 py-0.5 text-teal-800 font-bold text-[10px]">
                              {lo.status}
                            </span>
                            {lo.status === 'Completed' && (
                              <button
                                onClick={() => setActivePrintDoc({ type: 'labReport', data: lo })}
                                className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg"
                                title="Print Lab Report"
                              >
                                <Printer className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* TAB 6: BILLING */}
              {activeTab === 'billing' && (
                <div className="space-y-2">
                  {invoices.filter((i) => i.patientId === activePatient.id || i.patientName === activePatient.name).length === 0 ? (
                    <p className="text-slate-400 py-4 text-center">No invoices recorded for this patient.</p>
                  ) : (
                    invoices
                      .filter((i) => i.patientId === activePatient.id || i.patientName === activePatient.name)
                      .map((inv) => (
                        <div key={inv.id} className="rounded-xl border border-slate-200 p-3.5 flex justify-between items-center bg-slate-50/50">
                          <div>
                            <p className="font-bold text-slate-900">{inv.invoiceNumber}</p>
                            <p className="text-slate-500">Date: {inv.date} · Due: {inv.dueDate}</p>
                            <p className="font-mono font-bold text-slate-800 mt-1">
                              Total: ${inv.total.toFixed(2)} (Paid: ${inv.paidAmount.toFixed(2)})
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                inv.status === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : inv.status === 'Partial'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {inv.status}
                            </span>
                            <button
                              onClick={() => setActivePrintDoc({ type: 'invoice', data: inv })}
                              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg"
                              title="Print Invoice"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}

      {/* Register Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4">Patient EHR Admission / Intake</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Legal Patient Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Samuel J. Drake"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as any })}
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
                  <label className="block font-medium text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patient@gmail.com"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street Address, City, State"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Allergies (comma separated)</label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="Penicillin, Peanuts"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Clinical Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Outpatient">Outpatient</option>
                    <option value="Inpatient">Inpatient</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Edit Patient Profile</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Outpatient">Outpatient</option>
                    <option value="Inpatient">Inpatient</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Insurance Provider</label>
                <input
                  type="text"
                  value={formData.insuranceProvider}
                  onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {patientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-2">Archive Patient Record</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900">{patientToDelete.name}</strong> ({patientToDelete.mrn}) from the active roster? The electronic health record will be transferred to hospital long-term archives.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPatientToDelete(null)}
                className="rounded-lg px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deletePatient(patientToDelete.id);
                  if (selectedPatientId === patientToDelete.id) {
                    setSelectedPatientId(null);
                  }
                  setPatientToDelete(null);
                }}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow"
              >
                Archive Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
