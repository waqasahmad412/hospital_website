import React, { useState } from 'react';
import {
  Microscope,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { HOSPITAL_IMAGES } from '../../data/mockHospitalData';
import { LabOrder } from '../../types/hospital';

export const LaboratoryView: React.FC = () => {
  const {
    labTests,
    labOrders,
    addLabOrder,
    enterLabResult,
    patients,
    doctors,
    setActivePrintDoc,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderForResult, setSelectedOrderForResult] = useState<LabOrder | null>(null);

  // Form State for New Lab Order
  const [orderFormData, setOrderFormData] = useState({
    patientId: patients[0]?.id || '',
    patientName: patients[0]?.name || '',
    testCode: labTests[0]?.testCode || 'LAB-CBC',
    testName: labTests[0]?.testName || 'Complete Blood Count (CBC)',
    doctorId: doctors[0]?.id || '',
    doctorName: doctors[0]?.name || '',
  });

  // Form State for Entering Result
  const [resultFormData, setResultFormData] = useState({
    value: '',
    unit: 'mg/dL',
    flag: 'Normal' as 'Normal' | 'High' | 'Low' | 'Critical',
    resultSummary: '',
  });

  const filteredOrders = labOrders.filter((order) => {
    const matchesSearch =
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderFormData.patientName) return;
    const test = labTests.find((t) => t.testCode === orderFormData.testCode) || labTests[0];
    const doc = doctors.find((d) => d.id === orderFormData.doctorId) || doctors[0];
    addLabOrder({
      patientId: orderFormData.patientId,
      patientName: orderFormData.patientName,
      doctorName: doc.name,
      testName: test.testName,
      testCode: test.testCode,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Sample Pending',
      normalRange: '13.5 - 17.5 g/dL',
    });
    setIsOrderModalOpen(false);
  };

  const handleResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForResult) return;
    enterLabResult(
      selectedOrderForResult.id,
      resultFormData.resultSummary || 'Parameter evaluated within acceptable clinical limits.',
      resultFormData.value,
      resultFormData.unit,
      resultFormData.flag
    );
    setSelectedOrderForResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner with high quality lab image */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg">
        <div className="absolute inset-0">
          <img
            src={HOSPITAL_IMAGES.laboratory}
            alt="Central Pathology Diagnostic Laboratory"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-teal-950/70" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-teal-500/20 px-2.5 py-0.5 text-xs font-semibold text-teal-300 border border-teal-500/30 mb-2">
              <Microscope className="h-3.5 w-3.5" />
              <span>Diagnostic Pathology & Automated Analyzers</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Central Pathology & Diagnostic Laboratory
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
              Hematology, Clinical Biochemistry, Serology, Microbiology, and STAT emergency blood diagnostics.
            </p>
          </div>

          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-teal-500 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Order Diagnostic Test</span>
          </button>
        </div>
      </div>

      {/* Tests Catalog Quick Reference */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Diagnostic Test Formulary & Biological Ranges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {labTests.map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 space-y-1">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900">{t.testName}</span>
                <span className="font-mono text-teal-700 font-semibold">${t.price}</span>
              </div>
              <p className="text-[11px] text-slate-500">{t.category} ({t.testCode})</p>
              <p className="text-[10px] text-slate-400 font-mono">Sample: {t.sampleType} · TAT: {t.turnaroundTime}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Orders List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requisition, patient..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="All">All Requisitions</option>
              <option value="Sample Pending">Sample Pending</option>
              <option value="Sample Collected">Sample Collected</option>
              <option value="In Analysis">In Analysis</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Test Requested</th>
                <th className="py-3 px-4">Ordering Physician</th>
                <th className="py-3 px-4">Result Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    No pathology requisitions match current search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {order.orderNumber}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{order.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{order.orderDate}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-teal-800">
                      {order.testName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {order.doctorName}
                    </td>

                    <td className="py-3.5 px-4">
                      {order.value ? (
                        <div className="font-mono text-slate-900 font-bold">
                          {order.value} <span className="text-[10px] text-slate-500">{order.unit}</span>
                          <span className={`ml-2 px-1.5 py-0.2 rounded text-[10px] ${
                            order.flag === 'Normal' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {order.flag}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Awaiting specimen</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : order.status === 'In Analysis'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status !== 'Completed' ? (
                          <button
                            onClick={() => {
                              setSelectedOrderForResult(order);
                              setResultFormData({
                                value: '',
                                unit: order.testName.includes('Blood') ? 'g/dL' : 'mg/dL',
                                flag: 'Normal',
                                resultSummary: 'Specimen processed and verified within reference standards.',
                              });
                            }}
                            className="rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-800 hover:bg-teal-100"
                          >
                            Enter Results
                          </button>
                        ) : (
                          <button
                            onClick={() => setActivePrintDoc({ type: 'labReport', data: order })}
                            className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                          >
                            <Printer className="h-3.5 w-3.5 text-teal-600" />
                            <span>Print Report</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Test Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Diagnostic Test Requisition</h3>
            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Patient *</label>
                <select
                  value={orderFormData.patientId}
                  onChange={(e) => {
                    const sel = patients.find((p) => p.id === e.target.value);
                    setOrderFormData({
                      ...orderFormData,
                      patientId: e.target.value,
                      patientName: sel?.name || '',
                    });
                  }}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.mrn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Diagnostic Test *</label>
                <select
                  value={orderFormData.testCode}
                  onChange={(e) => {
                    const t = labTests.find((x) => x.testCode === e.target.value);
                    setOrderFormData({
                      ...orderFormData,
                      testCode: e.target.value,
                      testName: t?.testName || '',
                    });
                  }}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                >
                  {labTests.map((t) => (
                    <option key={t.id} value={t.testCode}>{t.testName} (${t.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Ordering Physician</label>
                <select
                  value={orderFormData.doctorId}
                  onChange={(e) => {
                    const d = doctors.find((x) => x.id === e.target.value);
                    setOrderFormData({
                      ...orderFormData,
                      doctorId: e.target.value,
                      doctorName: d?.name || '',
                    });
                  }}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enter Result Modal */}
      {selectedOrderForResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-2">Publish Pathology Result</h3>
            <p className="text-xs text-slate-500 mb-4">
              Patient: <strong className="text-slate-800">{selectedOrderForResult.patientName}</strong> · Test: <strong className="text-teal-800">{selectedOrderForResult.testName}</strong>
            </p>

            <form onSubmit={handleResultSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Measured Value *</label>
                  <input
                    type="text"
                    required
                    value={resultFormData.value}
                    onChange={(e) => setResultFormData({ ...resultFormData, value: e.target.value })}
                    placeholder="e.g. 14.2"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Unit of Measurement</label>
                  <input
                    type="text"
                    value={resultFormData.unit}
                    onChange={(e) => setResultFormData({ ...resultFormData, unit: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Diagnostic Flag</label>
                <select
                  value={resultFormData.flag}
                  onChange={(e) => setResultFormData({ ...resultFormData, flag: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 font-bold"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High (Elevated)</option>
                  <option value="Low">Low (Sub-normal)</option>
                  <option value="Critical">Critical (STAT Alert)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Clinical Impression / Summary</label>
                <textarea
                  rows={2}
                  value={resultFormData.resultSummary}
                  onChange={(e) => setResultFormData({ ...resultFormData, resultSummary: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForResult(null)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Verify & Release Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
