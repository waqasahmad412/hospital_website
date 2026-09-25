import React, { useState } from 'react';
import {
  Scan,
  Search,
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ZoomIn,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { HOSPITAL_IMAGES } from '../../data/mockHospitalData';
import { RadiologyOrder } from '../../types/hospital';

export const RadiologyView: React.FC = () => {
  const { radiologyOrders, addRadiologyOrder, patients, doctors, addToast } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalityFilter, setModalityFilter] = useState('All');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedScanForPACS, setSelectedScanForPACS] = useState<RadiologyOrder | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    patientName: patients[0]?.name || '',
    modality: 'MRI' as 'X-Ray' | 'CT Scan' | 'MRI' | 'Ultrasound' | 'Mammography',
    bodyPart: 'Brain with Contrast',
    orderingDoctor: doctors[0]?.name || '',
    urgency: 'Routine' as 'Routine' | 'Urgent' | 'Stat',
  });

  const filteredOrders = radiologyOrders.filter((scan) => {
    const matchesSearch =
      scan.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.bodyPart.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMod = modalityFilter === 'All' || scan.modality === modalityFilter;
    return matchesSearch && matchesMod;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName) return;
    addRadiologyOrder({
      patientName: formData.patientName,
      modality: formData.modality,
      bodyPart: formData.bodyPart,
      orderingDoctor: formData.orderingDoctor,
      radiologist: 'Dr. Jennifer Wu, MD',
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Scheduled',
      urgency: formData.urgency,
    });
    setIsOrderModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg">
        <div className="absolute inset-0">
          <img
            src={HOSPITAL_IMAGES.laboratory}
            alt="Advanced Diagnostic Imaging Suite"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-teal-950/70" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-teal-500/20 px-2.5 py-0.5 text-xs font-semibold text-teal-300 border border-teal-500/30 mb-2">
              <Scan className="h-3.5 w-3.5" />
              <span>Diagnostic Imaging & PACS DICOM Cloud</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Radiology & Advanced Imaging
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
              3T MRI, 128-Slice Dual-Source CT, Digital Fluoroscopy, High-Resolution 4D Ultrasound, and Nuclear Medicine.
            </p>
          </div>

          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-teal-500 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Order Imaging Study</span>
          </button>
        </div>
      </div>

      {/* Modality Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {['All', 'MRI', 'CT Scan', 'X-Ray', 'Ultrasound', 'Mammography'].map((mod) => (
          <button
            key={mod}
            onClick={() => setModalityFilter(mod)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              modalityFilter === mod
                ? 'bg-teal-700 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Scans Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scan number, patient, body part..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>
          <span className="text-xs text-slate-400">Total Imaging Orders: {filteredOrders.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Study #</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Modality & Body Part</th>
                <th className="py-3 px-4">Ordering Physician</th>
                <th className="py-3 px-4">Study Date</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">PACS Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                    No radiology orders match criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {scan.orderNumber}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {scan.patientName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-teal-800">{scan.modality}</div>
                      <div className="text-[11px] text-slate-500">{scan.bodyPart}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {scan.orderingDoctor}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {scan.orderDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        scan.urgency === 'Stat'
                          ? 'bg-rose-50 text-rose-700 font-extrabold animate-pulse'
                          : scan.urgency === 'Urgent'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {scan.urgency}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          scan.status === 'Report Verified'
                            ? 'bg-emerald-50 text-emerald-700'
                            : scan.status === 'Awaiting Report'
                            ? 'bg-amber-50 text-amber-700'
                            : scan.status === 'In Scan'
                            ? 'bg-teal-50 text-teal-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {scan.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedScanForPACS(scan)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <ZoomIn className="h-3.5 w-3.5 text-teal-600" />
                        <span>View PACS</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PACS Viewer Simulation Modal */}
      {selectedScanForPACS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-950 p-6 text-white border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-teal-400">PACS DICOM # {selectedScanForPACS.orderNumber}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedScanForPACS.patientName}</h3>
                <p className="text-xs text-slate-400">{selectedScanForPACS.modality} · {selectedScanForPACS.bodyPart}</p>
              </div>
              <button
                onClick={() => setSelectedScanForPACS(null)}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
              >
                Close Viewer
              </button>
            </div>

            {/* Diagnostic viewer canvas */}
            <div className="my-5 rounded-xl bg-slate-900 border border-slate-800 h-64 flex flex-col items-center justify-center relative overflow-hidden">
              <Scan className="h-20 w-20 text-teal-500/40 animate-pulse" />
              <p className="text-xs text-slate-400 mt-2 font-mono">DICOM 512x512 Lossless Slice Reconstructed</p>
              <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-500">
                W: 400 L: 40 | Window: Bone/Soft Tissue | FOV: 240mm
              </div>
            </div>

            {/* Radiologist Finding */}
            <div className="rounded-xl bg-slate-900/80 p-3.5 border border-slate-800 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold text-teal-400">Radiologist Impression</span>
                <span className="text-slate-400 font-mono text-[10px]">{selectedScanForPACS.radiologist}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedScanForPACS.findings || 'No acute intracranial hemorrhage or territorial infarction identified. Ventricular system is symmetric and normal in caliber. Paranasal sinuses and mastoid air cells are clear.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Scan Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Requisition Diagnostic Imaging</h3>
            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Patient *</label>
                <select
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.name}>{p.name} ({p.mrn})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Imaging Modality</label>
                  <select
                    value={formData.modality}
                    onChange={(e) => setFormData({ ...formData, modality: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="MRI">MRI (Magnetic Resonance)</option>
                    <option value="CT Scan">CT Scan (Computed Tomography)</option>
                    <option value="X-Ray">Digital X-Ray</option>
                    <option value="Ultrasound">4D Ultrasound</option>
                    <option value="Mammography">Digital Mammography</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Stat">Stat (Trauma/Emergency)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Anatomical Region / Body Part *</label>
                <input
                  type="text"
                  required
                  value={formData.bodyPart}
                  onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
                  placeholder="e.g. Lumbar Spine L1-S1 without contrast"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Ordering Physician</label>
                <select
                  value={formData.orderingDoctor}
                  onChange={(e) => setFormData({ ...formData, orderingDoctor: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>{d.name} ({d.department})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Schedule Imaging Study
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
