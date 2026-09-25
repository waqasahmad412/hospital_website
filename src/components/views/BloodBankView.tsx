import React, { useState } from 'react';
import {
  Droplets,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  Heart,
  Phone,
  Calendar,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { BloodGroup } from '../../types/hospital';

export const BloodBankView: React.FC = () => {
  const { bloodStock, bloodDonors, requestBloodUnit } = useHospital();

  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');
  const [requestUnits, setRequestUnits] = useState(2);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const totalUnits = bloodStock.reduce((acc, b) => acc + b.unitsAvailable, 0);
  const lowStockGroups = bloodStock.filter((b) => b.unitsAvailable <= b.criticalThreshold);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestBloodUnit(selectedGroup, Number(requestUnits));
    setIsRequestModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Transfusion Medicine & Blood Bank</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryopreserved packed red cells, fresh frozen plasma, apheresis platelets, and donor registry.
          </p>
        </div>
        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors shrink-0"
        >
          <Droplets className="h-4 w-4" />
          <span>STAT Blood Unit Requisition</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Available Units</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{totalUnits} Units</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-rose-700 uppercase">Critical Deficit Groups</span>
          <p className="text-2xl font-bold text-rose-800 font-mono mt-1">{lowStockGroups.length}</p>
        </div>
        <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-teal-700 uppercase">Registered Donors</span>
          <p className="text-2xl font-bold text-teal-800 font-mono mt-1">{bloodDonors.length}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-emerald-700 uppercase">Universal Donor (O-)</span>
          <p className="text-2xl font-bold text-emerald-800 font-mono mt-1">
            {bloodStock.find((b) => b.group === 'O-')?.unitsAvailable || 0} Units
          </p>
        </div>
      </div>

      {/* 8 Blood Group Inventory Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3">Live Blood Bank Stock Inventory</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {bloodStock.map((b) => {
            const isDeficit = b.unitsAvailable <= b.criticalThreshold;
            return (
              <div
                key={b.group}
                className={`rounded-2xl border p-4 shadow-sm transition-all bg-white ${
                  isDeficit ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 font-mono font-extrabold text-xl shadow-inner">
                    {b.group}
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      isDeficit ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {isDeficit ? 'Low Stock' : 'Optimal'}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">{b.unitsAvailable}</span>
                  <span className="text-xs text-slate-500 ml-1">Units available</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Threshold: {b.criticalThreshold} units</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedGroup(b.group);
                    setIsRequestModalOpen(true);
                  }}
                  className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Request {b.group}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registered Voluntary Donors */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-800">Voluntary Blood Donors Registry</span>
          <span>Screened & Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Donor Name</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Last Donated</th>
                <th className="py-3 px-4">Total Donations</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bloodDonors.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{d.name}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-700 text-sm">{d.bloodGroup}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{d.phone}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{d.lastDonationDate}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{d.totalDonations} pints</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700 text-[10px] font-bold">
                      Eligible Donor
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-rose-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Droplets className="h-5 w-5 text-rose-600" />
              <span>STAT Blood Bank Dispatch Request</span>
            </h3>

            <form onSubmit={handleRequestSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Blood Group *</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value as BloodGroup)}
                  className="w-full rounded-lg border border-slate-300 p-2 font-mono font-bold text-rose-700 focus:border-rose-500 focus:outline-none"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Units Required (Pints) *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={requestUnits}
                  onChange={(e) => setRequestUnits(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2 font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 shadow"
                >
                  Dispatch Units
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
