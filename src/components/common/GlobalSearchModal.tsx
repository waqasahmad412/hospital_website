import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Users,
  UserCheck,
  Calendar,
  Pill,
  CreditCard,
  Building,
  ArrowRight,
} from 'lucide-react';
import { useHospital, NavigationView } from '../../context/HospitalContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    setCurrentView,
    patients,
    doctors,
    appointments,
    medicines,
    invoices,
    staff,
    setSelectedPatientId,
  } = useHospital();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  // Reset query on open
  useEffect(() => {
    if (searchModalOpen) {
      setQuery('');
    }
  }, [searchModalOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { patients: [], doctors: [], appointments: [], medicines: [], invoices: [], staff: [] };

    return {
      patients: patients
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.mrn.toLowerCase().includes(q) ||
            p.phone.includes(q) ||
            p.bloodGroup.toLowerCase().includes(q)
        )
        .slice(0, 4),
      doctors: doctors
        .filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.specialization.toLowerCase().includes(q) ||
            d.department.toLowerCase().includes(q)
        )
        .slice(0, 4),
      appointments: appointments
        .filter(
          (a) =>
            a.patientName.toLowerCase().includes(q) ||
            a.doctorName.toLowerCase().includes(q) ||
            a.department.toLowerCase().includes(q)
        )
        .slice(0, 3),
      medicines: medicines
        .filter(
          (m) =>
            m.brandName.toLowerCase().includes(q) ||
            m.genericName.toLowerCase().includes(q) ||
            m.category.toLowerCase().includes(q)
        )
        .slice(0, 4),
      invoices: invoices
        .filter(
          (i) =>
            i.invoiceNumber.toLowerCase().includes(q) ||
            i.patientName.toLowerCase().includes(q)
        )
        .slice(0, 3),
      staff: staff
        .filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.role.toLowerCase().includes(q) ||
            s.department.toLowerCase().includes(q)
        )
        .slice(0, 3),
    };
  }, [query, patients, doctors, appointments, medicines, invoices, staff]);

  const totalResults =
    results.patients.length +
    results.doctors.length +
    results.appointments.length +
    results.medicines.length +
    results.invoices.length +
    results.staff.length;

  const navigateTo = (view: NavigationView, patientId?: string) => {
    if (patientId) {
      setSelectedPatientId(patientId);
    }
    setCurrentView(view);
    setSearchModalOpen(false);
  };

  if (!searchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setSearchModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-200 bg-slate-50/50">
          <Search className="h-5 w-5 text-teal-600 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients, doctors, drugs, appointments, invoices..."
            className="h-14 w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="ml-2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Type a patient name, doctor, MRN, prescription drug, or invoice number...
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Eleanor', 'Marcus', 'Cardiology', 'Augmentin', 'ER', 'Dr. Lin'].map((pill) => (
                  <button
                    key={pill}
                    onClick={() => setQuery(pill)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-colors"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm font-semibold text-slate-700">No medical records matched "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by partial name, MRN ID, or department.</p>
            </div>
          )}

          {/* Patients Results */}
          {results.patients.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-2 pb-1.5 text-xs font-semibold text-teal-800">
                <Users className="h-3.5 w-3.5" />
                <span>Patients ({results.patients.length})</span>
              </div>
              <div className="space-y-1">
                {results.patients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigateTo('patients', p.id)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-100 transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 group-hover:text-teal-700">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {p.mrn} · {p.age}y {p.gender} · Blood: {p.bloodGroup} · Status: {p.status}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Doctors Results */}
          {results.doctors.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-2 pb-1.5 text-xs font-semibold text-teal-800">
                <UserCheck className="h-3.5 w-3.5" />
                <span>Doctors & Specialists ({results.doctors.length})</span>
              </div>
              <div className="space-y-1">
                {results.doctors.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => navigateTo('doctors')}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-100 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={d.avatar} alt={d.name} className="h-7 w-7 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900 group-hover:text-teal-700">
                          {d.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {d.specialization} · {d.department}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-teal-700 font-medium">{d.availability}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Medicines Results */}
          {results.medicines.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-2 pb-1.5 text-xs font-semibold text-teal-800">
                <Pill className="h-3.5 w-3.5" />
                <span>Pharmacy Formulary ({results.medicines.length})</span>
              </div>
              <div className="space-y-1">
                {results.medicines.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => navigateTo('pharmacy')}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-100 transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 group-hover:text-teal-700">
                        {m.brandName} <span className="font-normal text-slate-500">({m.genericName})</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {m.form} · Stock: {m.stockQuantity} units · Batch: {m.batchNumber}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-700">${m.sellingPrice.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {results.invoices.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-2 pb-1.5 text-xs font-semibold text-teal-800">
                <CreditCard className="h-3.5 w-3.5" />
                <span>Invoices ({results.invoices.length})</span>
              </div>
              <div className="space-y-1">
                {results.invoices.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => navigateTo('billing')}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-100 transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 group-hover:text-teal-700">
                        {inv.invoiceNumber} — {inv.patientName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Total: ${inv.total.toFixed(2)} · Paid: ${inv.paidAmount.toFixed(2)} · Status: {inv.status}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2 text-[11px] text-slate-400">
          <span>St. Jude Enterprise Clinical Index</span>
          <span>Click any record to navigate</span>
        </div>
      </div>
    </div>
  );
};
