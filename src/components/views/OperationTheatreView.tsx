import React, { useState } from 'react';
import {
  Scissors,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Plus,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const OperationTheatreView: React.FC = () => {
  const { surgeries } = useHospital();
  const [filterOT, setFilterOT] = useState('All');

  const filteredSurgeries = surgeries.filter((s) => {
    return filterOT === 'All' || s.otRoom.includes(filterOT);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Surgical Suites & Operation Theatre (OT)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Laminar airflow suites, surgical team rosters, sterile supply readiness, and live operative status.
          </p>
        </div>
      </div>

      {/* OT Suites Roster */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['OT-1 (Cardiac/Neuro)', 'OT-2 (General)', 'OT-3 (Orthopedics)', 'OT-4 (Laparoscopic)'].map((suite, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">{suite}</span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" title="Sterile Ready" />
            </div>
            <p className="text-[11px] text-slate-500">HEPA Filtration: Active · Sterility Check: Passed</p>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px]">
              <span className="text-slate-400">Next Case:</span>
              <span className="font-semibold text-teal-800">Scheduled Today</span>
            </div>
          </div>
        ))}
      </div>

      {/* Surgeries Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-800">Surgical Schedule & Live Cases ({filteredSurgeries.length})</span>
          <span>Today's Surgical Deck</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">OT Suite</th>
                <th className="py-3 px-4">Procedure</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Lead Surgeon</th>
                <th className="py-3 px-4">Anesthetist</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSurgeries.map((surg) => (
                <tr key={surg.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                    {surg.otRoom}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{surg.surgeryName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Case #{surg.surgeryCode}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-800">
                    {surg.patientName}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {surg.leadSurgeon}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {surg.anesthetist}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                    <div>{surg.scheduledTime}</div>
                    <div className="text-[10px] text-slate-400">{surg.scheduledDate} ({surg.durationMinutes}m)</div>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        surg.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : surg.status === 'Surgery in Progress'
                          ? 'bg-rose-50 text-rose-700 font-extrabold animate-pulse'
                          : surg.status === 'Pre-Op Prep'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-teal-50 text-teal-700'
                      }`}
                    >
                      {surg.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
