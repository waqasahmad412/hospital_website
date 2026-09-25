import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Building,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Invoice } from '../../types/hospital';

export const BillingInvoicesView: React.FC = () => {
  const {
    invoices,
    createInvoice,
    recordPayment,
    patients,
    setActivePrintDoc,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    patientName: patients[0]?.name || '',
    total: 1450,
    insuranceClaimed: 1160,
    paidAmount: 290,
    dueDate: '2026-10-10',
    description: 'Inpatient Ward, Diagnostic Workup, Pharmacy Drugs',
  });

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.mrn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = invoices.reduce((acc, i) => acc + i.total, 0);
  const totalPaid = invoices.filter((i) => i.status === 'Paid').reduce((acc, i) => acc + i.total, 0);
  const totalDue = invoices.filter((i) => i.status !== 'Paid').reduce((acc, i) => acc + (i.total - i.paidAmount), 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName) return;
    const pat = patients.find((p) => p.id === formData.patientId) || patients[0];
    createInvoice({
      patientId: pat.id,
      patientName: pat.name,
      mrn: pat.mrn,
      date: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      subtotal: Number(formData.total),
      tax: 0,
      discount: 0,
      total: Number(formData.total),
      paidAmount: 0,
      insuranceClaimed: Number(formData.insuranceClaimed),
      status: 'Unpaid',
      items: [
        {
          id: `ITEM-1`,
          description: formData.description,
          category: 'Nursing & Misc',
          quantity: 1,
          unitPrice: Number(formData.total),
          total: Number(formData.total),
        },
      ],
    });
    setIsCreateModalOpen(false);
  };

  const handleSettleInvoice = (inv: Invoice) => {
    recordPayment({
      invoiceNumber: inv.invoiceNumber,
      patientName: inv.patientName,
      amount: inv.total - inv.paidAmount,
      paymentMethod: 'Credit Card',
      date: new Date().toISOString().split('T')[0],
      processedBy: 'Main Hospital Cashier',
      transactionRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Successful',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Hospital Billing & Patient Invoices</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent medical invoices, insurance co-pay itemization, and discharge billing clearance.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Gross Revenue Billed</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">
            ${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-emerald-700 uppercase">Settled Payments</span>
          <p className="text-2xl font-bold text-emerald-800 font-mono mt-1">
            ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-amber-700 uppercase">Outstanding Receivables</span>
          <p className="text-2xl font-bold text-amber-800 font-mono mt-1">
            ${totalDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
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
            placeholder="Search invoice number, patient, MRN..."
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
            <option value="All">All Invoices</option>
            <option value="Paid">Paid (Settled)</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Patient Name (MRN)</th>
                <th className="py-3 px-4">Issue & Due Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Insurance Paid</th>
                <th className="py-3 px-4">Patient Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                    No hospital invoices match current filters.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{inv.patientName}</div>
                      <div className="text-[10px] text-teal-700 font-mono">{inv.mrn}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                      <div>Issued: {inv.date}</div>
                      <div className="text-[10px] text-slate-400">Due: {inv.dueDate}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      ${inv.total.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-teal-700 font-semibold whitespace-nowrap">
                      ${(inv.insuranceClaimed || 0).toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      ${(inv.total - inv.paidAmount).toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : inv.status === 'Partial'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActivePrintDoc({ type: 'invoice', data: inv })}
                          className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                        >
                          <Printer className="h-3.5 w-3.5 text-teal-600" />
                          <span>Print</span>
                        </button>

                        {inv.status !== 'Paid' && (
                          <button
                            onClick={() => handleSettleInvoice(inv)}
                            className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100"
                          >
                            Mark Paid
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

      {/* Generate Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Generate Patient Bill / Invoice</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Patient *</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => {
                    const pat = patients.find((p) => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      patientId: e.target.value,
                      patientName: pat?.name || '',
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
                <label className="block font-medium text-slate-700 mb-1">Billing Summary Items</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Total Bill ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.total}
                    onChange={(e) => {
                      const tot = Number(e.target.value);
                      setFormData({
                        ...formData,
                        total: tot,
                      });
                    }}
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Insurance Claimed ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.insuranceClaimed}
                    onChange={(e) => setFormData({ ...formData, insuranceClaimed: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Payment Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Create & Itemize Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
