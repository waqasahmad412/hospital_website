import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  Building,
  CheckCircle2,
  DollarSign,
  Activity,
  Users,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const ReportsAnalyticsView: React.FC = () => {
  const { patients, doctors, admissions, appointments, invoices, addToast } = useHospital();
  const [timeRange, setTimeRange] = useState('Month');

  const handleExport = () => {
    addToast('success', 'Report Exported', 'Executive hospital report compiled and exported successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Hospital Intelligence & Clinical Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational census, revenue cycles, average length of stay (ALOS), and JCI clinical quality KPIs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none"
          >
            <option value="Week">This Week</option>
            <option value="Month">This Month (September 2026)</option>
            <option value="Quarter">Q3 2026</option>
            <option value="Year">Fiscal Year 2026</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors shrink-0"
          >
            <Download className="h-4 w-4" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* Top Level Clinical Quality Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">JCI Quality Score</span>
          <p className="text-2xl font-bold font-mono text-teal-800 mt-1">99.4%</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Gold Seal Standard
          </span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Average Stay (ALOS)</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">3.8 Days</p>
          <span className="text-[10px] text-teal-600 font-semibold mt-1 inline-block">
            -0.4d vs Benchmark
          </span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Hospital Acquired Infection</span>
          <p className="text-2xl font-bold font-mono text-emerald-700 mt-1">0.12%</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">
            Zero Tolerance Protocol
          </span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Patient Satisfaction Index</span>
          <p className="text-2xl font-bold font-mono text-teal-800 mt-1">96.8%</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">
            4.9 / 5.0 (3,400 reviews)
          </span>
        </div>
      </div>

      {/* Chart 1: Bed Occupancy & Inpatient Census Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Bed Occupancy Trajectory</h2>
              <p className="text-xs text-slate-500">Weekly occupancy trends across 180 licensed beds</p>
            </div>
            <span className="rounded bg-teal-50 px-2.5 py-1 text-xs font-mono font-bold text-teal-800">
              Avg 84.6%
            </span>
          </div>

          <div className="h-56 w-full flex items-end gap-3 pt-6 pb-2 border-b border-slate-100">
            {[
              { day: 'Mon', rate: 78, beds: 140 },
              { day: 'Tue', rate: 82, beds: 147 },
              { day: 'Wed', rate: 88, beds: 158 },
              { day: 'Thu', rate: 91, beds: 164 },
              { day: 'Fri', rate: 85, beds: 153 },
              { day: 'Sat', rate: 74, beds: 133 },
              { day: 'Sun', rate: 72, beds: 129 },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-mono font-bold text-slate-600 group-hover:text-teal-800">
                  {col.rate}%
                </span>
                <div
                  style={{ height: `${col.rate}%` }}
                  className="w-full rounded-t-lg bg-teal-600/80 group-hover:bg-teal-700 transition-all shadow-sm"
                />
                <span className="text-[11px] font-medium text-slate-500 mt-1">{col.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Optimal Operational Range: 75% - 88%</span>
            <span className="font-semibold text-slate-700">ICU Surge Reserve: 12 Beds Ready</span>
          </div>
        </div>

        {/* Chart 2: Revenue Distribution by Clinical Service */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Clinical Revenue by Division</h2>
              <p className="text-xs text-slate-500">Gross billing share across key clinical centers</p>
            </div>
            <span className="font-mono text-xs font-bold text-slate-900">
              Total: $1.28M
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { label: 'Cardiology & Cath Lab', pct: 32, val: '$410,000', color: 'bg-teal-600' },
              { label: 'Inpatient Wards & Deluxe Suites', pct: 24, val: '$307,200', color: 'bg-teal-500' },
              { label: 'Surgical Theatres (OT)', pct: 20, val: '$256,000', color: 'bg-teal-400' },
              { label: 'Central Pathology & Radiology PACS', pct: 14, val: '$179,200', color: 'bg-teal-700' },
              { label: 'Pharmacy Dispensary & Outpatient OPD', pct: 10, val: '$128,000', color: 'bg-teal-800' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="font-mono font-bold text-slate-900">{item.val} ({item.pct}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div style={{ width: `${item.pct}%` }} className={`h-full rounded-full ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
