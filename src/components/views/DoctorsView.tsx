import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Star,
  Clock,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  Building,
  CheckCircle2,
  X,
  User,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Doctor } from '../../types/hospital';

export const DoctorsView: React.FC = () => {
  const { doctors, departments, toggleDoctorAvailability, addDoctor } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoctorForSchedule, setSelectedDoctorForSchedule] = useState<Doctor | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    department: 'Cardiology',
    qualification: 'MD, Board Certified',
    experienceYears: 12,
    phone: '+1 (555) 300-1122',
    email: '',
    consultationFee: 220,
    schedule: 'Mon - Fri (09:00 - 17:00)',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    availability: 'Available' as const,
  });

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
    const matchesAvailability = selectedAvailability === 'All' || doc.availability === selectedAvailability;
    return matchesSearch && matchesDept && matchesAvailability;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.specialization) return;
    addDoctor({
      name: formData.name,
      specialization: formData.specialization,
      department: formData.department,
      qualification: formData.qualification,
      experienceYears: Number(formData.experienceYears),
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/[^a-z]/g, '')}@stjude.org`,
      consultationFee: Number(formData.consultationFee),
      schedule: formData.schedule,
      avatar: formData.avatar,
      availability: formData.availability,
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Medical Faculty & Attending Specialists</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Board-certified surgeons, attending physicians, chief consultants, and duty medical officers.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Medical Faculty</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by physician name, specialty..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="In Consultation">In Consultation</option>
              <option value="In Surgery">In Surgery</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Doctor Header */}
              <div className="flex items-start gap-4">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{doc.name}</h3>
                    <div className="flex items-center gap-0.5 text-amber-500 font-mono text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-teal-700 mt-0.5">{doc.specialization}</p>
                  <p className="text-[11px] text-slate-500">{doc.qualification}</p>
                </div>
              </div>

              {/* Department badge & experience */}
              <div className="mt-4 flex items-center justify-between text-xs border-y border-slate-100 py-2.5">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                  <Building className="h-3.5 w-3.5 text-slate-400" />
                  {doc.department}
                </span>
                <span className="text-slate-500 font-medium">
                  {doc.experienceYears}+ years exp.
                </span>
              </div>

              {/* Contact info & Schedule */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{doc.schedule}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate font-mono text-[11px]">{doc.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-[11px]">{doc.phone}</span>
                </p>
              </div>
            </div>

            {/* Bottom Actions & Status Toggle */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Consultation</span>
                <span className="font-mono font-bold text-slate-900 text-sm">${doc.consultationFee}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDoctorForSchedule(doc)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Schedule
                </button>

                <button
                  onClick={() => toggleDoctorAvailability(doc.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                    doc.availability === 'Available'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : doc.availability === 'In Consultation'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                  title="Click to toggle availability state"
                >
                  {doc.availability}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Register Attending Specialist</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Legal Physician Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Julian Vance, MD, FACC"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Specialization *</label>
                  <input
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="Interventional Cardiology"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Years of Clinical Experience</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Direct Clinical Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Clinic Working Schedule</label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
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
                  Confirm Specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Quick View Modal */}
      {selectedDoctorForSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedDoctorForSchedule.name}</h3>
                <p className="text-xs text-teal-700">{selectedDoctorForSchedule.specialization}</p>
              </div>
              <button
                onClick={() => setSelectedDoctorForSchedule(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="font-semibold text-slate-700 block">Weekly Outpatient Clinic Hours:</span>
                <span className="font-mono text-teal-800 text-sm font-bold">{selectedDoctorForSchedule.schedule}</span>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-slate-800">Duty Shifts & On-Call Rotation:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded border border-slate-200 p-2">
                    <span className="font-bold text-slate-700 block">Morning Rounds</span>
                    <span className="text-slate-500">08:00 - 10:00 (Inpatient)</span>
                  </div>
                  <div className="rounded border border-slate-200 p-2">
                    <span className="font-bold text-slate-700 block">OPD Consultations</span>
                    <span className="text-slate-500">10:00 - 16:30 (Clinic B)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedDoctorForSchedule(null)}
                className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
