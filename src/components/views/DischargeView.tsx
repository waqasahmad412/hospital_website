import React, { useState } from 'react';
import {
  LogOut,
  Search,
  Printer,
  CheckCircle2,
  FileText,
  User,
  Calendar,
  Building,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const DischargeView: React.FC = () => {
  const { admissions, setActivePrintDoc } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');

  const dischargedPatients = admissions.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    return a.status === 'Discharged' && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Inpatient Discharge Summaries</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Archived discharge summaries, final clearance notes, and patient follow-up instructions.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discharged patient or MRN..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Discharged Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Patient Name (MRN)</th>
                <th className="py-3 px-4">Attending Physician</th>
                <th className="py-3 px-4">Admission Date</th>
                <th className="py-3 px-4">Discharge Date</th>
                <th className="py-3 px-4">Ward / Room</th>
                <th className="py-3 px-4">Diagnosis</th>
                <th className="py-3 px-4 text-right">Discharge Paper</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dischargedPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    No discharged inpatient records found.
                  </td>
                </tr>
              ) : (
                dischargedPatients.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{adm.patientName}</div>
                      <div className="text-[10px] text-teal-700 font-mono">{adm.mrn}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{adm.doctorName}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{adm.admissionDate}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">{adm.expectedDischarge}</td>
                    <td className="py-3.5 px-4 text-slate-600">{adm.wardType} - {adm.roomNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{adm.diagnosis}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActivePrintDoc({ type: 'dischargeSummary', data: adm })}
                        className="rounded border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-1.5 ml-auto"
                      >
                        <Printer className="h-3.5 w-3.5 text-teal-600" />
                        <span>Print Summary</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
