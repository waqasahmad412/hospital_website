import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Clock,
  Building,
  CheckCircle2,
  HeartHandshake,
  User,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { StaffMember } from '../../types/hospital';

export const NursesStaffView: React.FC = () => {
  const { staff, departments, addToast } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [shiftFilter, setShiftFilter] = useState('All');

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || s.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesShift = shiftFilter === 'All' || s.shift.includes(shiftFilter);
    return matchesSearch && matchesRole && matchesShift;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Clinical Nursing Faculty & Hospital Staff</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered nurses (RN, BSN), scrub technicians, biomedical specialists, and duty shifts.
          </p>
        </div>
      </div>

      {/* Search & Shift Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nurse, technician, role..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
          >
            <option value="All">All Shifts</option>
            <option value="Morning">Morning Shift (07:00 - 15:30)</option>
            <option value="Evening">Evening Shift (15:00 - 23:30)</option>
            <option value="Night">Night STAT Shift (23:00 - 07:30)</option>
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map((person) => (
          <div
            key={person.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <div className="h-14 w-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg shrink-0">
                  {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{person.name}</h3>
                  <p className="text-xs font-semibold text-teal-700 mt-0.5">{person.role}</p>
                  <p className="text-[11px] text-slate-500">{person.department} ({person.empId})</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Duty Shift:</span>
                  <span className="rounded bg-teal-50 px-2 py-0.5 text-teal-800 font-semibold text-[10px]">
                    {person.shift}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-mono text-[11px]">{person.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-mono text-[11px]">{person.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Joined: {person.joinedDate}</span>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                person.attendance === 'Present'
                  ? 'bg-emerald-50 text-emerald-700'
                  : person.attendance === 'On Leave'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {person.attendance}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
