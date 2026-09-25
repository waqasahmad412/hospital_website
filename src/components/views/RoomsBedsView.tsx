import React, { useState } from 'react';
import {
  BedDouble,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { BedStatus } from '../../types/hospital';

export const RoomsBedsView: React.FC = () => {
  const { beds, updateBedStatus } = useHospital();
  const [filterWard, setFilterWard] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBeds = beds.filter((bed) => {
    const matchesSearch =
      bed.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bed.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bed.currentPatientName && bed.currentPatientName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesWard = filterWard === 'All' || bed.ward === filterWard;
    const matchesStatus = filterStatus === 'All' || bed.status === filterStatus;
    return matchesSearch && matchesWard && matchesStatus;
  });

  const availableBeds = beds.filter((b) => b.status === 'Available').length;
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const cleaningBeds = beds.filter((b) => b.status === 'Cleaning').length;
  const reservedBeds = beds.filter((b) => b.status === 'Reserved').length;
  const totalBeds = beds.length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const statusColors: Record<BedStatus, { bg: string; text: string; ring: string }> = {
    Available: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
    Occupied: { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-200' },
    Cleaning: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
    Reserved: { bg: 'bg-teal-50', text: 'text-teal-700', ring: 'ring-teal-200' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Rooms & Bed Occupancy Matrix</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time ward census, sanitation turnover status, and inpatient bed availability.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Capacity</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{totalBeds} Beds</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-emerald-700 uppercase">Available Ready</span>
          <p className="text-2xl font-bold text-emerald-800 font-mono mt-1">{availableBeds}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-rose-700 uppercase">Occupied Beds</span>
          <p className="text-2xl font-bold text-rose-800 font-mono mt-1">{occupiedBeds}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-amber-700 uppercase">Turnover / Sanitizing</span>
          <p className="text-2xl font-bold text-amber-800 font-mono mt-1">{cleaningBeds}</p>
        </div>
        <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-teal-700 uppercase">Occupancy Rate</span>
          <p className="text-2xl font-bold text-teal-800 font-mono mt-1">{occupancyRate}%</p>
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
            placeholder="Search bed, room number, patient..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterWard}
            onChange={(e) => setFilterWard(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
          >
            <option value="All">All Wards</option>
            <option value="General Ward">General Ward</option>
            <option value="Private Room">Private Room</option>
            <option value="Semi Private">Semi Private</option>
            <option value="ICU">ICU</option>
            <option value="CCU">CCU</option>
            <option value="Emergency">Emergency</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Cleaning">Sanitizing</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>
      </div>

      {/* Bed Grid Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const cfg = statusColors[bed.status] || statusColors.Available;
          return (
            <div
              key={bed.id}
              className={`rounded-2xl border p-4 bg-white shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
                bed.status === 'Occupied' ? 'border-slate-200' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${cfg.bg} ${cfg.text}`}>
                      <BedDouble className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-sm">{bed.bedNumber}</span>
                      <p className="text-[10px] text-slate-400">Room {bed.roomNumber}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
                    {bed.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ward:</span>
                    <span className="font-semibold text-slate-800">{bed.ward}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Daily Charge:</span>
                    <span className="font-mono text-slate-700 font-semibold">${bed.dailyRate}/day</span>
                  </div>
                  {bed.currentPatientName && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Admitted Patient</span>
                      <span className="font-bold text-slate-900 text-xs">{bed.currentPatientName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update Quick Controls */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Quick Set:</span>
                <div className="flex gap-1">
                  {bed.status !== 'Available' && (
                    <button
                      onClick={() => updateBedStatus(bed.id, 'Available')}
                      className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                    >
                      Ready
                    </button>
                  )}
                  {bed.status !== 'Cleaning' && (
                    <button
                      onClick={() => updateBedStatus(bed.id, 'Cleaning')}
                      className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold"
                    >
                      Sanitize
                    </button>
                  )}
                  {bed.status === 'Available' && (
                    <button
                      onClick={() => updateBedStatus(bed.id, 'Reserved')}
                      className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold"
                    >
                      Reserve
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
