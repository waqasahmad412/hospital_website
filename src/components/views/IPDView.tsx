import React, { useState } from 'react';
import {
  BedDouble,
  Search,
  Plus,
  UserCheck,
  Calendar,
  LogOut,
  FileText,
  Printer,
  ChevronRight,
  HeartPulse,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Admission } from '../../types/hospital';

export const IPDView: React.FC = () => {
  const {
    admissions,
    beds,
    doctors,
    patients,
    admitPatient,
    dischargePatient,
    setActivePrintDoc,
    setCurrentView,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterWard, setFilterWard] = useState('All');
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    patientName: patients[0]?.name || '',
    doctorId: doctors[0]?.id || '',
    roomNumber: 'Room 304',
    bedNumber: 'Bed-304B',
    wardType: 'General Ward' as const,
    diagnosis: 'Acute Gastroenteritis with moderate dehydration',
  });

  const activeAdmissions = admissions.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWard = filterWard === 'All' || a.wardType === filterWard;
    return matchesSearch && matchesWard && a.status === 'Admitted';
  });

  const handleAdmitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName) return;
    const doc = doctors.find((d) => d.id === formData.doctorId) || doctors[0];
    admitPatient({
      patientId: formData.patientId,
      patientName: formData.patientName,
      doctorName: doc.name,
      doctorId: doc.id,
      admissionDate: new Date().toISOString().split('T')[0],
      roomNumber: formData.roomNumber,
      bedNumber: formData.bedNumber,
      wardType: formData.wardType,
      diagnosis: formData.diagnosis,
      condition: 'Stable',
      dailyCharge: 350,
      status: 'Admitted',
      expectedDischarge: '2026-09-28',
      nursingNotes: ['Intake vitals baseline nominal', 'Started IV maintenance fluids'],
    });
    setIsAdmitModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Inpatient Department (IPD)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admitted inpatient census, attending physician rounds, and clinical care milestones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('rooms-beds')}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Beds Matrix
          </button>
          <button
            onClick={() => setIsAdmitModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Admit Inpatient</span>
          </button>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Current Inpatients</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{activeAdmissions.length}</p>
        </div>
        <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-teal-700 uppercase">General Ward</span>
          <p className="text-2xl font-bold text-teal-800 font-mono mt-1">
            {activeAdmissions.filter((a) => a.wardType === 'General Ward').length}
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-blue-700 uppercase">Private / Deluxe</span>
          <p className="text-2xl font-bold text-blue-800 font-mono mt-1">
            {activeAdmissions.filter((a) => a.wardType.includes('Private') || a.wardType.includes('Deluxe')).length}
          </p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-rose-700 uppercase">Critical / ICU</span>
          <p className="text-2xl font-bold text-rose-800 font-mono mt-1">
            {activeAdmissions.filter((a) => a.wardType === 'ICU' || a.wardType === 'CCU').length}
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inpatient, MRN, physician..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterWard}
            onChange={(e) => setFilterWard(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
          >
            <option value="All">All Inpatient Wards</option>
            <option value="General Ward">General Ward</option>
            <option value="Semi-Private">Semi-Private</option>
            <option value="Private Deluxe">Private Deluxe</option>
            <option value="ICU Suite">ICU Suite</option>
          </select>
        </div>
      </div>

      {/* Inpatient Roster Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Bed & Room</th>
                <th className="py-3 px-4">Patient (MRN)</th>
                <th className="py-3 px-4">Admit Date</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Diagnosis</th>
                <th className="py-3 px-4">Nursing Milestones</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    No active inpatients currently matching filters.
                  </td>
                </tr>
              ) : (
                activeAdmissions.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div>{adm.bedNumber}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{adm.roomNumber} ({adm.wardType})</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{adm.patientName}</div>
                      <div className="text-[10px] text-teal-700 font-mono">{adm.mrn}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {adm.admissionDate}
                    </td>

                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      {adm.doctorName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {adm.diagnosis}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {adm.nursingNotes[adm.nursingNotes.length - 1] || 'Vitals nominal'}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActivePrintDoc({ type: 'dischargeSummary', data: adm })}
                          className="rounded border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                        >
                          <Printer className="h-3.5 w-3.5 text-teal-600" />
                          <span>Summary</span>
                        </button>
                        <button
                          onClick={() => dischargePatient(adm.id)}
                          className="rounded border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 flex items-center gap-1"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Discharge</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admit Modal */}
      {isAdmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Inpatient Admission Order</h3>
            <form onSubmit={handleAdmitSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Patient *</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => {
                    const selected = patients.find((p) => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      patientId: e.target.value,
                      patientName: selected?.name || '',
                    });
                  }}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.mrn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Attending Physician</label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Ward Category</label>
                  <select
                    value={formData.wardType}
                    onChange={(e) => setFormData({ ...formData, wardType: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="General Ward">General Ward</option>
                    <option value="Semi-Private">Semi-Private</option>
                    <option value="Private Deluxe">Private Deluxe</option>
                    <option value="ICU Suite">ICU Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Bed Number</label>
                  <input
                    type="text"
                    required
                    value={formData.bedNumber}
                    onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Primary Admission Diagnosis *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Clinical indication for inpatient admission..."
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdmitModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Confirm Inpatient Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
