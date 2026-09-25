import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Printer,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Prescription, PrescriptionItem } from '../../types/hospital';

export const PrescriptionsView: React.FC = () => {
  const {
    prescriptions,
    addPrescription,
    patients,
    doctors,
    medicines,
    setActivePrintDoc,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    patientName: patients[0]?.name || '',
    doctorId: doctors[0]?.id || '',
    doctorName: doctors[0]?.name || '',
    diagnosis: '',
    adviceNotes: '',
    followUpDate: '2026-10-05',
    items: [
      {
        medicineName: 'Amoxicillin 500mg',
        dosage: '1 capsule',
        frequency: 'TDS (Three times daily)',
        duration: '7 Days',
        instructions: 'Take after meals',
      },
    ] as PrescriptionItem[],
  });

  const [newItem, setNewItem] = useState<PrescriptionItem>({
    medicineName: medicines[0]?.brandName || 'Augmentin 625mg',
    dosage: '1 tablet',
    frequency: 'BD (Twice daily)',
    duration: '5 Days',
    instructions: 'Take with full glass of water',
  });

  const filteredPrescriptions = prescriptions.filter((rx) => {
    return (
      rx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.rxNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddItem = () => {
    if (!newItem.medicineName) return;
    setFormData({
      ...formData,
      items: [...formData.items, { ...newItem }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || formData.items.length === 0) return;
    const pat = patients.find((p) => p.id === formData.patientId) || patients[0];
    const doc = doctors.find((d) => d.id === formData.doctorId) || doctors[0];

    addPrescription({
      patientId: pat.id,
      patientName: pat.name,
      patientAge: pat.age,
      patientGender: pat.gender,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialization: doc.specialization,
      date: new Date().toISOString().split('T')[0],
      diagnosis: formData.diagnosis || 'Clinical Diagnosis',
      items: formData.items,
      followUpDate: formData.followUpDate,
      adviceNotes: formData.adviceNotes,
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Digital Electronic Prescriptions (e-Rx)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Legally valid physician prescriptions, dosage regimen generator, and automated dispensary routing.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Write e-Prescription</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Rx number, patient, physician, diagnosis..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div className="text-xs text-slate-500">
          Total Archived Rx: <strong className="text-slate-800">{prescriptions.length}</strong>
        </div>
      </div>

      {/* Prescriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPrescriptions.map((rx) => (
          <div
            key={rx.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Header inside card */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-teal-800">{rx.rxNumber}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{rx.patientName}</h3>
                  <p className="text-[11px] text-slate-500">{rx.patientAge}y · {rx.patientGender}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400">{rx.date}</span>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mt-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Diagnosis:</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{rx.diagnosis}</p>
              </div>

              {/* Prescribed Items */}
              <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Prescribed Regimen</span>
                {rx.items.map((item, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-2 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{item.medicineName}</span>
                      <span className="font-mono text-teal-700">{item.dosage}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex justify-between mt-0.5">
                      <span>{item.frequency} · {item.duration}</span>
                    </div>
                    {item.instructions && (
                      <div className="text-[10px] text-slate-400 italic mt-0.5">{item.instructions}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Physician */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span>Prescribed by: </span>
                <strong className="text-slate-800">{rx.doctorName}</strong>
                <span className="block text-[11px] text-teal-700">{rx.doctorSpecialization}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Follow-up: {rx.followUpDate || 'As needed'}
              </span>
              <button
                onClick={() => setActivePrintDoc({ type: 'prescription', data: rx })}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Printer className="h-3.5 w-3.5 text-teal-600" />
                <span>Print Rx</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create Electronic Prescription</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Patient *</label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => {
                      const sel = patients.find((p) => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        patientId: e.target.value,
                        patientName: sel?.name || '',
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
                  <label className="block font-medium text-slate-700 mb-1">Attending Physician *</label>
                  <select
                    value={formData.doctorId}
                    onChange={(e) => {
                      const sel = doctors.find((d) => d.id === e.target.value);
                      setFormData({
                        ...formData,
                        doctorId: e.target.value,
                        doctorName: sel?.name || '',
                      });
                    }}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="e.g. Acute Pharyngitis & Upper Respiratory Infection"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Medicine Item Builder */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-2">
                <span className="font-bold text-slate-800 block text-xs">Add Medication to Regimen</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Medicine Name</label>
                    <input
                      type="text"
                      value={newItem.medicineName}
                      onChange={(e) => setNewItem({ ...newItem, medicineName: e.target.value })}
                      className="w-full rounded border border-slate-300 p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Dosage</label>
                    <input
                      type="text"
                      value={newItem.dosage}
                      onChange={(e) => setNewItem({ ...newItem, dosage: e.target.value })}
                      placeholder="1 tab / 5ml"
                      className="w-full rounded border border-slate-300 p-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Frequency</label>
                    <input
                      type="text"
                      value={newItem.frequency}
                      onChange={(e) => setNewItem({ ...newItem, frequency: e.target.value })}
                      placeholder="TDS / BD"
                      className="w-full rounded border border-slate-300 p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Duration</label>
                    <input
                      type="text"
                      value={newItem.duration}
                      onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })}
                      placeholder="5 Days"
                      className="w-full rounded border border-slate-300 p-1.5"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full rounded bg-teal-600 py-1.5 text-white font-semibold hover:bg-teal-700"
                    >
                      + Add Drug
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Items Table in Modal */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Regimen Items ({formData.items.length})</span>
                {formData.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded bg-white p-2 border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-900">{it.medicineName}</span>
                      <span className="text-slate-500 ml-2">({it.dosage} · {it.frequency} · {it.duration})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Follow-Up Date</label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Clinical Advice / Notes</label>
                  <input
                    type="text"
                    value={formData.adviceNotes}
                    onChange={(e) => setFormData({ ...formData, adviceNotes: e.target.value })}
                    placeholder="Adequate hydration, bed rest"
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Authorize e-Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
