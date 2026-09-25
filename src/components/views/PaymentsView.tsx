import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Search,
  CheckCircle2,
  Calendar,
  Building,
  ArrowUpRight,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const PaymentsView: React.FC = () => {
  const { invoices, addToast } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');

  const paidInvoices = invoices.filter((i) => i.status === 'Paid');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Hospital Cashier & Payment Settlements</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time merchant clearing, POS terminals, insurance remittance, and treasury reconciliation.
          </p>
        </div>
      </div>

      {/* Payment methods stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Settled Transactions</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{paidInvoices.length}</p>
        </div>
        <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-teal-700 uppercase">Merchant Credit Card</span>
          <p className="text-2xl font-bold text-teal-800 font-mono mt-1">68%</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-blue-700 uppercase">Direct Insurance TPA</span>
          <p className="text-2xl font-bold text-blue-800 font-mono mt-1">26%</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-emerald-700 uppercase">Total Collected</span>
          <p className="text-2xl font-bold text-emerald-800 font-mono mt-1">
            ${paidInvoices.reduce((a, b) => a + b.total, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Payment logs table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-800">Cashier Settlement Ledger</span>
          <span>Verified Merchant Gateway</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Patient Name (MRN)</th>
                <th className="py-3 px-4">Invoice Reference</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Settled Date</th>
                <th className="py-3 px-4">Amount Cleared</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paidInvoices.map((inv, idx) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    TXN-882{idx + 10}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{inv.patientName}</div>
                    <div className="text-[10px] text-teal-700 font-mono">{inv.mrn}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 font-medium">
                      {idx % 2 === 0 ? 'Visa / Mastercard' : 'Direct Electronic Insurance Remittance'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {inv.date}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 text-sm">
                    ${inv.total.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700 text-[10px] font-bold">
                      Settled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
