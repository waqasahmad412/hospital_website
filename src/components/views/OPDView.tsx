import React, { useState } from 'react';
import {
  Clock,
  Search,
  Plus,
  User,
  Building,
  CheckCircle,
  PlayCircle,
  XCircle,
  Ticket,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const OPDView: React.FC = () => {
  const {
    opdTokens,
    addOPDToken,
    updateOPDStatus,
    doctors,
    departments,
  } = useHospital();

  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    patientName: '',
    doctorId: doctors[0]?.id || '',
    department: 'Cardiology',
    complaint: '',
  });

  const filteredTokens = opdTokens.filter((token) => {
    const matchesSearch =
      token.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.tokenNumber.toString().includes(searchQuery);
    const matchesDept = filterDept === 'All' || token.department === filterDept;
    const matchesStatus = filterStatus === 'All' || token.status === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName) return;
    addOPDToken(formData.patientName, formData.doctorId, formData.department, formData.complaint);
    setIsTokenModalOpen(false);
    setFormData({
      patientName: '',
      doctorId: doctors[0]?.id || '',
      department: 'Cardiology',
      complaint: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Outpatient Department (OPD)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated token queue, walk-in patient triage, and specialist clinic assignment.
          </p>
        </div>
        <button
          onClick={() => setIsTokenModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors shrink-0"
        >
          <Ticket className="h-4 w-4" />
          <span>Issue OPD Queue Token</span>
        </button>
      </div>

      {/* OPD Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Tokens Issued</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{opdTokens.length}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-amber-700 uppercase">Waiting in Lobby</span>
          <p className="text-2xl font-bold text-amber-800 font-mono mt-1">
            {opdTokens.filter((t) => t.status === 'Waiting').length}
          </p>
        </div>
        <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-teal-700 uppercase">In Consultation</span>
          <p className="text-2xl font-bold text-teal-800 font-mono mt-1">
            {opdTokens.filter((t) => t.status === 'Consulting').length}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-emerald-700 uppercase">Consulted Today</span>
          <p className="text-2xl font-bold text-emerald-800 font-mono mt-1">
            {opdTokens.filter((t) => t.status === 'Completed').length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, token number..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Waiting">Waiting</option>
            <option value="Consulting">Consulting</option>
            <option value="Completed">Completed</option>
            <option value="Skipped">Skipped</option>
          </select>
        </div>
      </div>

      {/* OPD Tokens Roster Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Department & Doctor</th>
                <th className="py-3 px-4">Issue Time</th>
                <th className="py-3 px-4">Complaint / Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    No OPD tokens currently active in queue.
                  </td>
                </tr>
              ) : (
                filteredTokens.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-extrabold text-base text-teal-800">
                      #{t.tokenNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{t.patientName}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{t.doctorName}</div>
                      <div className="text-[11px] text-slate-500">{t.department}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{t.issueTime}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{t.complaint}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : t.status === 'Consulting'
                            ? 'bg-teal-50 text-teal-800 ring-1 ring-teal-200 animate-pulse'
                            : t.status === 'Skipped'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.status === 'Waiting' && (
                          <button
                            onClick={() => updateOPDStatus(t.id, 'Consulting')}
                            className="rounded border border-teal-200 bg-teal-50 px-2 py-1 text-[11px] font-semibold text-teal-800 hover:bg-teal-100"
                          >
                            Call Next
                          </button>
                        )}
                        {t.status === 'Consulting' && (
                          <button
                            onClick={() => updateOPDStatus(t.id, 'Completed')}
                            className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100"
                          >
                            Finish
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

      {/* Token Modal */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Generate Walk-in OPD Token</h3>
            <form onSubmit={handleCreateToken} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="e.g. Thomas Wayne"
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

              <div>
                <label className="block font-medium text-slate-700 mb-1">Consulting Physician</label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Chief Symptoms / Complaint</label>
                <textarea
                  rows={2}
                  value={formData.complaint}
                  onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                  placeholder="Mild fever, routine vitals check, hypertension checkup..."
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTokenModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Print Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
