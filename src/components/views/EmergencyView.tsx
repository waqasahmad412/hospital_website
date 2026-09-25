import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Plus,
  Activity,
  HeartPulse,
  User,
  BedDouble,
  Clock,
  CheckCircle2,
  Zap,
  ArrowRight,
  Stethoscope,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { EmergencyCase, EmergencyPriority } from '../../types/hospital';

export const EmergencyView: React.FC = () => {
  const {
    emergencyCases,
    addEmergencyCase,
    updateEmergencyStatus,
    doctors,
    addToast,
    setCurrentView,
  } = useHospital();

  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('All');

  // Form State
  const [formData, setFormData] = useState({
    patientName: '',
    age: 40,
    gender: 'Male',
    priority: 'Critical' as EmergencyPriority,
    chiefComplaint: '',
    assignedDoctor: doctors[doctors.length - 1]?.name || 'Dr. Tariq Al-Mansoor, MD, FACEP',
    bedAssigned: 'ER Trauma Bay 1',
  });

  const filteredCases = emergencyCases.filter((c) => {
    return filterPriority === 'All' || c.priority === filterPriority;
  });

  const handleTriageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.chiefComplaint) return;
    addEmergencyCase({
      patientName: formData.patientName,
      age: Number(formData.age),
      gender: formData.gender,
      priority: formData.priority,
      chiefComplaint: formData.chiefComplaint,
      assignedDoctor: formData.assignedDoctor,
      bedAssigned: formData.bedAssigned,
    });
    setIsTriageModalOpen(false);
    setFormData({
      patientName: '',
      age: 40,
      gender: 'Male',
      priority: 'Critical',
      chiefComplaint: '',
      assignedDoctor: doctors[doctors.length - 1]?.name || 'Dr. Tariq Al-Mansoor, MD, FACEP',
      bedAssigned: 'ER Trauma Bay 1',
    });
  };

  const triggerCodeBlue = () => {
    addToast(
      'error',
      'CODE BLUE ACTIVATED',
      'Emergency Resuscitation Team Dispatched to STAT Trauma Unit!'
    );
  };

  return (
    <div className="space-y-6">
      {/* Alert Header */}
      <div className="rounded-2xl border-2 border-rose-400 bg-rose-50/70 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md animate-pulse">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Emergency & Acute Trauma Deck</h1>
                <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white tracking-wide">
                  Level 1 Trauma Verified
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-1 font-medium">
                Real-time clinical triage, acute resuscitation status, and trauma surgeon deployment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={triggerCodeBlue}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-rose-400 border border-rose-500/50 hover:bg-black transition-colors"
            >
              <Zap className="h-4 w-4 text-rose-500" />
              <span>Broadcast CODE BLUE</span>
            </button>
            <button
              onClick={() => setIsTriageModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-rose-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>STAT Triage Admission</span>
            </button>
          </div>
        </div>
      </div>

      {/* Priority Filter Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700">Triage Severity Filter:</span>
        <div className="flex gap-1.5 text-xs">
          {['All', 'Critical', 'High', 'Medium', 'Low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                filterPriority === p
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Cases Active Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map((ec) => (
          <div
            key={ec.id}
            className={`rounded-2xl border p-5 shadow-sm transition-all bg-white ${
              ec.priority === 'Critical'
                ? 'border-rose-300 ring-2 ring-rose-100'
                : 'border-slate-200'
            }`}
          >
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                      ec.priority === 'Critical'
                        ? 'bg-rose-600 text-white'
                        : ec.priority === 'High'
                        ? 'bg-orange-500 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Priority: {ec.priority}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">Arrived: {ec.arrivalTime}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{ec.patientName}</h3>
                <p className="text-xs text-slate-500">{ec.age} Years · {ec.gender}</p>
              </div>

              <div className="text-right">
                <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono font-bold text-slate-800">
                  {ec.bedAssigned}
                </span>
                <p className="text-[11px] text-teal-700 font-semibold mt-1">{ec.status}</p>
              </div>
            </div>

            {/* Chief Complaint */}
            <div className="mt-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">Chief Clinical Complaint</span>
              <p className="text-xs font-medium text-slate-800 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {ec.chiefComplaint}
              </p>
            </div>

            {/* Vitals Telemetry */}
            <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">BP</span>
                <span className="font-mono font-bold text-slate-900">{ec.vitals.bp}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Pulse</span>
                <span className="font-mono font-bold text-slate-900">{ec.vitals.pulse} bpm</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">SpO2</span>
                <span className="font-mono font-bold text-teal-800">{ec.vitals.spO2}%</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">GCS</span>
                <span className="font-mono font-bold text-slate-900">{ec.vitals.gcs}/15</span>
              </div>
            </div>

            {/* Attending & Nurse */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
              <div>
                <span className="text-slate-400">Attending: </span>
                <span className="font-semibold text-slate-700">{ec.assignedDoctor}</span>
              </div>
              <div>
                <span className="text-slate-400">Triage RN: </span>
                <span className="font-semibold text-slate-700">{ec.triageNurse}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-slate-100 justify-end text-xs">
              {ec.status !== 'In Resuscitation' && (
                <button
                  onClick={() => updateEmergencyStatus(ec.id, 'In Resuscitation')}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 font-semibold text-rose-700 hover:bg-rose-100"
                >
                  Resuscitate
                </button>
              )}
              {ec.status !== 'In Surgery' && (
                <button
                  onClick={() => updateEmergencyStatus(ec.id, 'In Surgery')}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50"
                >
                  Move to OT
                </button>
              )}
              <button
                onClick={() => {
                  updateEmergencyStatus(ec.id, 'Transferred to ICU');
                  setCurrentView('icu');
                }}
                className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 font-semibold text-blue-700 hover:bg-blue-100"
              >
                Transfer to ICU
              </button>
              {ec.status !== 'Stabilized' && (
                <button
                  onClick={() => updateEmergencyStatus(ec.id, 'Stabilized')}
                  className="rounded-lg bg-emerald-600 px-2.5 py-1 font-semibold text-white hover:bg-emerald-700"
                >
                  Mark Stabilized
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Triage Admission Modal */}
      {isTriageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-rose-300 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              <span>STAT Emergency Triage Intake</span>
            </h3>
            <form onSubmit={handleTriageSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="e.g. Richard Hendricks"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-rose-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Triage Priority *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full rounded-lg border border-rose-300 p-2 font-bold text-rose-700 focus:outline-none"
                  >
                    <option value="Critical">Critical (Immediate STAT)</option>
                    <option value="High">High (Urgent &lt; 15 mins)</option>
                    <option value="Medium">Medium (Semi-Urgent)</option>
                    <option value="Low">Low (Non-Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Bed / Bay Assigned</label>
                <input
                  type="text"
                  value={formData.bedAssigned}
                  onChange={(e) => setFormData({ ...formData, bedAssigned: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Chief Trauma / Medical Complaint *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                  placeholder="e.g. Blunt thoracic impact, diaphoresis, severe acute respiratory distress..."
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTriageModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 shadow"
                >
                  Confirm ER Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
