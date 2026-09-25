import React from 'react';
import {
  Activity,
  HeartPulse,
  Wind,
  AlertTriangle,
  CheckCircle2,
  BellRing,
  ShieldAlert,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const ICUView: React.FC = () => {
  const { icuMonitors } = useHospital();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Intensive Care Unit (ICU) Telemetry</h1>
            <span className="rounded bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5">
              Live Bedside Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous invasive arterial pressure monitoring, central venous pressure, pulse oximetry, and ventilator waveforms.
          </p>
        </div>
      </div>

      {/* Bedside Monitors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {icuMonitors.map((mon) => {
          const isCritical = mon.alarmStatus === 'Critical';
          const isWarning = mon.alarmStatus === 'Warning';
          return (
            <div
              key={mon.bedNumber}
              className={`rounded-2xl border p-5 shadow-sm transition-all bg-slate-950 text-white flex flex-col justify-between ${
                isCritical
                  ? 'border-rose-500/80 ring-2 ring-rose-500/30'
                  : isWarning
                  ? 'border-amber-500/80 ring-2 ring-amber-500/20'
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Card top */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-teal-400">{mon.bedNumber}</span>
                      {mon.alarmStatus !== 'Normal' && (
                        <span
                          className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isCritical
                              ? 'text-rose-400 bg-rose-950/80 border border-rose-800 animate-pulse'
                              : 'text-amber-400 bg-amber-950/80 border border-amber-800'
                          }`}
                        >
                          <AlertTriangle className="h-3 w-3" />
                          <span>{mon.alarmStatus.toUpperCase()}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">{mon.patientName}</h3>
                    <p className="text-[11px] text-slate-400 font-sans">
                      {mon.age} yrs · {mon.diagnosis}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        mon.ventilatorSupport
                          ? 'text-teal-300 bg-teal-950/80 border-teal-800'
                          : 'text-slate-400 bg-slate-900 border-slate-800'
                      }`}
                    >
                      {mon.ventilatorSupport ? 'Ventilated' : 'Spontaneous'}
                    </span>
                  </div>
                </div>

                {/* Simulated ECG Waveform Graphic */}
                <div className="my-3 h-14 w-full rounded-lg bg-slate-900/90 border border-slate-800/80 flex items-center px-2 overflow-hidden relative">
                  <svg className="w-full h-full text-emerald-400 stroke-current fill-none" viewBox="0 0 300 40">
                    <path
                      d="M0 20 L40 20 L45 20 L50 5 L55 35 L60 15 L65 22 L70 20 L120 20 L125 20 L130 5 L135 35 L140 15 L145 22 L150 20 L200 20 L205 20 L210 5 L215 35 L220 15 L225 22 L230 20 L300 20"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="absolute right-2 top-1 text-[9px] font-mono text-emerald-400">LEAD II · 25mm/s</div>
                </div>

                {/* Vitals Telemetry Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  {/* Heart Rate */}
                  <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                    <span className="text-[10px] text-emerald-400 font-bold block">HR (bpm)</span>
                    <span className="font-mono font-extrabold text-lg text-emerald-300">{mon.heartRate}</span>
                  </div>

                  {/* Blood Pressure */}
                  <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                    <span className="text-[10px] text-rose-400 font-bold block">NIBP</span>
                    <span className="font-mono font-bold text-xs text-rose-300">{mon.bloodPressure}</span>
                  </div>

                  {/* SpO2 */}
                  <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                    <span className="text-[10px] text-teal-400 font-bold block">SpO2 %</span>
                    <span className="font-mono font-extrabold text-lg text-teal-300">{mon.spO2}%</span>
                  </div>

                  {/* Respiration */}
                  <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                    <span className="text-[10px] text-amber-400 font-bold block">RESP</span>
                    <span className="font-mono font-extrabold text-lg text-amber-300">{mon.respRate}</span>
                  </div>
                </div>

                {/* Active Alarms / Notes */}
                {mon.alarmStatus !== 'Normal' ? (
                  <div className="mt-3 rounded-lg bg-rose-950/40 border border-rose-800/60 p-2 text-[11px] text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                    <span>Telemetry alert triggered: Continuous vital deviation</span>
                  </div>
                ) : (
                  <div className="mt-3 rounded-lg bg-slate-900/60 p-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Telemetry parameters nominal · Temp: {mon.temperature}°F</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>RN: {mon.assignedNurse}</span>
                <span className="font-mono text-teal-400">{mon.assignedIntensivist}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
