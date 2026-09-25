import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  ShieldAlert,
  Fuel,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Ambulance } from '../../types/hospital';

export const AmbulanceView: React.FC = () => {
  const { ambulances, dispatchAmbulance, addToast } = useHospital();
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    vehicleId: ambulances[0]?.id || '',
    emergencyLocation: '450 North Highland Blvd, Apt 4B',
    callerPhone: '+1 (555) 890-2341',
    callerComplaint: 'Suspected acute myocardial infarction with diaphoresis',
  });

  const readyCount = ambulances.filter((a) => a.status === 'Standby / Ready').length;
  const dispatchedCount = ambulances.filter((a) => a.status === 'Dispatched / In Route' || a.status === 'On Scene' || a.status === 'Transporting Patient').length;

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.emergencyLocation) return;
    dispatchAmbulance(formData.vehicleId, formData.emergencyLocation);
    setIsDispatchModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">EMS Fleet & Emergency Ambulance Dispatch</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Advanced Cardiac Life Support (ACLS), mobile tele-medicine, and GPS automated emergency dispatch.
          </p>
        </div>
        <button
          onClick={() => setIsDispatchModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors shrink-0"
        >
          <Truck className="h-4 w-4" />
          <span>STAT Ambulance Dispatch</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Fleet Size</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{ambulances.length} Units</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-emerald-700 uppercase">Standby & Ready</span>
          <p className="text-2xl font-bold text-emerald-800 font-mono mt-1">{readyCount}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-rose-700 uppercase">Active Responding</span>
          <p className="text-2xl font-bold text-rose-800 font-mono mt-1">{dispatchedCount}</p>
        </div>
        <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-teal-700 uppercase">Avg Response Time</span>
          <p className="text-2xl font-bold text-teal-800 font-mono mt-1">7.4 Mins</p>
        </div>
      </div>

      {/* Ambulance Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ambulances.map((amb) => {
          const isReady = amb.status === 'Standby / Ready';
          return (
            <div
              key={amb.id}
              className={`rounded-2xl border p-5 shadow-sm transition-all bg-white flex flex-col justify-between ${
                !isReady ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-slate-900">{amb.vehicleNumber}</span>
                      <span className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                        {amb.callSign}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{amb.type}</p>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      isReady
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700 animate-pulse'
                    }`}
                  >
                    {amb.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{amb.currentLocation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Driver:</span>
                    <span className="font-semibold text-slate-800">{amb.driverName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Paramedic:</span>
                    <span className="font-semibold text-teal-800">{amb.paramedicName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-mono text-[11px]">{amb.driverPhone}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Fuel className="h-3.5 w-3.5 text-slate-400" /> Fuel Level:
                    </span>
                    <span className="font-mono font-bold text-slate-700">{amb.fuelLevel}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                {isReady ? (
                  <button
                    onClick={() => {
                      setFormData({ ...formData, vehicleId: amb.id });
                      setIsDispatchModalOpen(true);
                    }}
                    className="w-full rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-black transition-colors"
                  >
                    Dispatch This Ambulance
                  </button>
                ) : (
                  <div className="rounded-xl bg-rose-50 p-2 text-center text-xs font-semibold text-rose-700 border border-rose-200">
                    Currently Dispatched on Call
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dispatch Modal */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-rose-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-rose-600" />
              <span>Dispatch Emergency EMS Ambulance</span>
            </h3>

            <form onSubmit={handleDispatchSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Ready Ambulance</label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-rose-500 focus:outline-none"
                >
                  {ambulances
                    .filter((a) => a.status === 'Standby / Ready')
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.vehicleNumber} ({a.callSign}) — Driver: {a.driverName}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Incident / Patient Address *</label>
                <input
                  type="text"
                  required
                  value={formData.emergencyLocation}
                  onChange={(e) => setFormData({ ...formData, emergencyLocation: e.target.value })}
                  placeholder="Street, Building, Cross Street..."
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Caller Contact Phone</label>
                <input
                  type="tel"
                  value={formData.callerPhone}
                  onChange={(e) => setFormData({ ...formData, callerPhone: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Chief Clinical Emergency Complaint</label>
                <textarea
                  rows={2}
                  value={formData.callerComplaint}
                  onChange={(e) => setFormData({ ...formData, callerComplaint: e.target.value })}
                  placeholder="Cardiac arrest, multi-vehicle trauma collision, acute stroke signs..."
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 shadow"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
