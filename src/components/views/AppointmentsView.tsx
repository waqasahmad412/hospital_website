import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Plus,
  Clock,
  User,
  Building,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  DollarSign,
  Printer,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment } from '../../types/hospital';

export const AppointmentsView: React.FC = () => {
  const {
    appointments,
    doctors,
    departments,
    bookAppointment,
    updateAppointmentStatus,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState('2026-09-23');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientName: '',
    doctorId: doctors[0]?.id || '',
    date: '2026-09-23',
    time: '11:30 AM',
    appointmentType: 'General Checkup' as const,
    reason: '',
  });

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    const matchesDept = deptFilter === 'All' || apt.department === deptFilter;
    const matchesDate = !selectedDate || apt.date === selectedDate;
    return matchesSearch && matchesStatus && matchesDept && matchesDate;
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName) return;
    const doc = doctors.find((d) => d.id === formData.doctorId) || doctors[0];
    bookAppointment({
      patientId: `PAT-${Date.now().toString(36).slice(-4)}`,
      patientName: formData.patientName,
      doctorId: doc.id,
      doctorName: doc.name,
      department: doc.department,
      date: formData.date,
      time: formData.time,
      appointmentType: formData.appointmentType,
      status: 'Scheduled',
      reason: formData.reason || 'General medical follow-up',
      fee: doc.consultationFee,
    });
    setIsBookModalOpen(false);
    setFormData({
      patientName: '',
      doctorId: doctors[0]?.id || '',
      date: '2026-09-23',
      time: '11:30 AM',
      appointmentType: 'General Checkup',
      reason: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Clinical Appointments & Scheduling</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Book consultations, track patient queue status, and manage attending physician clinic slots.
          </p>
        </div>
        <button
          onClick={() => setIsBookModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient or doctor..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Date Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none font-mono"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-[11px] text-teal-600 hover:underline"
              >
                All Dates
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Dept:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-800">
            Appointments Queue ({filteredAppointments.length})
          </span>
          <span className="font-mono">Active Clinic Sessions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Physician & Dept</th>
                <th className="py-3 px-4">Visit Type</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4">Fee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                    No appointments found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div>{apt.time}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{apt.date}</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {apt.patientName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{apt.doctorName}</div>
                      <div className="text-[11px] text-slate-500">{apt.department}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                        {apt.appointmentType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {apt.reason}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                      ${apt.fee}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          apt.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : apt.status === 'In-Progress'
                            ? 'bg-amber-50 text-amber-700 animate-pulse'
                            : apt.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-teal-50 text-teal-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === 'Scheduled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'In-Progress')}
                            className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800 hover:bg-amber-100"
                          >
                            Call In
                          </button>
                        )}
                        {apt.status === 'In-Progress' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                            className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100"
                          >
                            Complete
                          </button>
                        )}
                        {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                            className="rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Book Clinical Consultation</h3>
            <form onSubmit={handleBookSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="e.g. Maria Gonzalez"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Attending Specialist</label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
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
                  <label className="block font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="11:30 AM"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Visit Classification</label>
                <select
                  value={formData.appointmentType}
                  onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                >
                  <option value="General Checkup">General Checkup</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Consultation">Specialist Consultation</option>
                  <option value="Emergency">Emergency Evaluation</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Chief Reason for Consultation</label>
                <textarea
                  rows={2}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Describe patient complaint or follow-up note..."
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
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
    </div>
  );
};
