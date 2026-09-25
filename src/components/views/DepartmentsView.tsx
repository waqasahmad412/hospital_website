import React from 'react';
import {
  Building2,
  Users,
  BedDouble,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Brain,
  Bone,
  ShieldAlert,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const DepartmentsView: React.FC = () => {
  const { departments, doctors, setCurrentView } = useHospital();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Clinical Departments & Centers of Excellence</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Specialized clinical divisions, accredited fellowship programs, and dedicated specialty wards.
          </p>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => {
          const deptDocs = doctors.filter((d) => d.department === dept.name);
          return (
            <div
              key={dept.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                    {dept.bedCount} Beds
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dept.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Head of Department:</span>
                    <span className="font-semibold text-slate-800">{dept.headDoctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Faculty:</span>
                    <span className="font-semibold text-teal-800">{dept.doctorCount} Specialists</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setCurrentView('doctors')}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-teal-800 hover:bg-teal-50 transition-colors"
                >
                  <span>View Attending Faculty</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
