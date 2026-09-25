import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Building,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

interface InsuranceClaim {
  id: string;
  claimId: string;
  patientName: string;
  policyNumber: string;
  provider: string;
  admissionReason: string;
  amountClaimed: number;
  amountApproved: number;
  status: 'Approved' | 'In Review' | 'Pre-Auth Submitted' | 'Rejected';
  dateSubmitted: string;
}

export const InsuranceView: React.FC = () => {
  const { patients, addToast } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const [claims, setClaims] = useState<InsuranceClaim[]>([
    {
      id: 'CLM-01',
      claimId: 'CLM-2026-9041',
      patientName: 'Eleanor Vance',
      policyNumber: 'BCBS-8839210',
      provider: 'Blue Cross Blue Shield',
      admissionReason: 'Coronary Angiogram & Stenting',
      amountClaimed: 4200,
      amountApproved: 3950,
      status: 'Approved',
      dateSubmitted: '2026-09-20',
    },
    {
      id: 'CLM-02',
      claimId: 'CLM-2026-9042',
      patientName: 'Sarah Jenkins',
      policyNumber: 'AET-4491023',
      provider: 'Aetna Healthcare',
      admissionReason: 'Severe Migraine Neurological Workup',
      amountClaimed: 1450,
      amountApproved: 1160,
      status: 'Approved',
      dateSubmitted: '2026-09-21',
    },
    {
      id: 'CLM-03',
      claimId: 'CLM-2026-9043',
      patientName: 'Michael Chang',
      policyNumber: 'UHC-7712903',
      provider: 'UnitedHealthcare',
      admissionReason: 'Type 2 Diabetes Glycemic Control',
      amountClaimed: 950,
      amountApproved: 0,
      status: 'In Review',
      dateSubmitted: '2026-09-22',
    },
    {
      id: 'CLM-04',
      claimId: 'CLM-2026-9044',
      patientName: 'David Miller',
      policyNumber: 'MED-9920112',
      provider: 'Medicare Advantage',
      admissionReason: 'Acute Bronchitis & Respiratory Therapy',
      amountClaimed: 1850,
      amountApproved: 0,
      status: 'Pre-Auth Submitted',
      dateSubmitted: '2026-09-23',
    },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    patientName: patients[0]?.name || '',
    policyNumber: 'CIG-5541092',
    provider: 'Cigna Global Health',
    admissionReason: 'Emergency Appendectomy',
    amountClaimed: 3500,
  });

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const newClaim: InsuranceClaim = {
      id: `CLM-${Date.now().toString(36).slice(-4)}`,
      claimId: `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: formData.patientName,
      policyNumber: formData.policyNumber,
      provider: formData.provider,
      admissionReason: formData.admissionReason,
      amountClaimed: Number(formData.amountClaimed),
      amountApproved: 0,
      status: 'Pre-Auth Submitted',
      dateSubmitted: new Date().toISOString().split('T')[0],
    };
    setClaims([newClaim, ...claims]);
    setIsClaimModalOpen(false);
    addToast('success', 'Claim Submitted', `Pre-authorization filed with ${formData.provider}`);
  };

  const filteredClaims = claims.filter((c) => {
    return (
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Health Insurance & TPA Pre-Authorization</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated cashless claim adjudication, policy verification, and direct insurer settlement.
          </p>
        </div>
        <button
          onClick={() => setIsClaimModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Submit Pre-Authorization</span>
        </button>
      </div>

      {/* Partner Insurers Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { name: 'Blue Cross Blue Shield', plan: 'National PPO Network', status: 'Direct API Active' },
          { name: 'Aetna Healthcare', plan: 'Select Network', status: 'Direct API Active' },
          { name: 'UnitedHealthcare', plan: 'Choice Plus', status: 'Direct API Active' },
          { name: 'Medicare Advantage', plan: 'Federal Senior Care', status: 'Direct API Active' },
          { name: 'Cigna Global Health', plan: 'Open Access', status: 'Direct API Active' },
        ].map((ins, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-3 space-y-1 shadow-sm">
            <span className="font-bold text-slate-900 text-xs block truncate">{ins.name}</span>
            <p className="text-[10px] text-slate-500">{ins.plan}</p>
            <span className="inline-block text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
              {ins.status}
            </span>
          </div>
        ))}
      </div>

      {/* Claims List Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claim, patient, insurer..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Claim ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Insurer & Policy #</th>
                <th className="py-3 px-4">Clinical Procedure / Indication</th>
                <th className="py-3 px-4">Claimed</th>
                <th className="py-3 px-4">Approved</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {claim.claimId}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{claim.patientName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Date: {claim.dateSubmitted}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{claim.provider}</div>
                    <div className="text-[10px] text-teal-700 font-mono">{claim.policyNumber}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {claim.admissionReason}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    ${claim.amountClaimed.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                    ${claim.amountApproved.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        claim.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : claim.status === 'In Review'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-teal-50 text-teal-700'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Claim Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Submit Insurance Pre-Authorization</h3>
            <form onSubmit={handleCreateClaim} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="e.g. Richard Hendricks"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Insurance Provider</label>
                  <select
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                    <option value="Aetna Healthcare">Aetna Healthcare</option>
                    <option value="UnitedHealthcare">UnitedHealthcare</option>
                    <option value="Medicare Advantage">Medicare Advantage</option>
                    <option value="Cigna Global Health">Cigna Global Health</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Policy / Member ID</label>
                  <input
                    type="text"
                    required
                    value={formData.policyNumber}
                    onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Clinical Indication / Procedure</label>
                <input
                  type="text"
                  required
                  value={formData.admissionReason}
                  onChange={(e) => setFormData({ ...formData, admissionReason: e.target.value })}
                  placeholder="e.g. Total Knee Arthroplasty"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Estimated Cost Claimed ($)</label>
                <input
                  type="number"
                  required
                  value={formData.amountClaimed}
                  onChange={(e) => setFormData({ ...formData, amountClaimed: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  File Pre-Auth Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
