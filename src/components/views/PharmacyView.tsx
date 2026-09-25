import React, { useState } from 'react';
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  Package,
  Layers,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingDown,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { HOSPITAL_IMAGES } from '../../data/mockHospitalData';
import { Medicine } from '../../types/hospital';

export const PharmacyView: React.FC = () => {
  const { medicines, updateMedicineStock, addToast } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    brandName: '',
    genericName: '',
    category: 'Antibiotics' as 'Antibiotics' | 'Cardiovascular' | 'Analgesics' | 'Antidiabetic' | 'Respiratory' | 'GI & Hepatology' | 'Emergency & Critical',
    form: 'Tablet' as 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler' | 'Ointment',
    stockQuantity: 100,
    reorderLevel: 25,
    purchasePrice: 12.0,
    sellingPrice: 18.5,
    manufacturer: 'Pfizer Bio',
    batchNumber: 'BT-88910',
    expiryDate: '2027-12-31',
    requiresPrescription: true,
  });

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || med.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = medicines.filter((m) => m.stockQuantity <= m.reorderLevel).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName) return;
    addToast('success', 'Formulary Item Added', `${formData.brandName} enrolled in central dispensary.`);
    setIsAddModalOpen(false);
    setFormData({
      brandName: '',
      genericName: '',
      category: 'Antibiotics',
      form: 'Tablet',
      stockQuantity: 100,
      reorderLevel: 25,
      purchasePrice: 12.0,
      sellingPrice: 18.5,
      manufacturer: 'Pfizer Bio',
      batchNumber: 'BT-88910',
      expiryDate: '2027-12-31',
      requiresPrescription: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg">
        <div className="absolute inset-0">
          <img
            src={HOSPITAL_IMAGES.pharmacy}
            alt="Central Hospital Pharmacy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-teal-950/70" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-teal-500/20 px-2.5 py-0.5 text-xs font-semibold text-teal-300 border border-teal-500/30 mb-2">
              <Pill className="h-3.5 w-3.5" />
              <span>Inpatient Formulary & Outpatient Dispensary</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Pharmacy & Formulary Management
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
              Strict batch tracking, expiry monitoring, automated cold-chain assurance, and prescription dispensing.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-teal-500 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Formulary Drug</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Formulary Drugs</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{medicines.length} SKUs</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-rose-700 uppercase">Critical Low Stock</span>
          <p className="text-2xl font-bold text-rose-800 font-mono mt-1">{lowStockCount}</p>
        </div>
        <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-teal-700 uppercase">Total Inventory Units</span>
          <p className="text-2xl font-bold text-teal-800 font-mono mt-1">
            {medicines.reduce((acc, m) => acc + m.stockQuantity, 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-emerald-700 uppercase">Dispensary Status</span>
          <p className="text-2xl font-bold text-emerald-800 font-mono mt-1">24/7 Active</p>
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
            placeholder="Search medicine brand, generic, batch..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
          >
            <option value="All">All Therapeutic Classes</option>
            <option value="Antibiotics">Antibiotics</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Analgesics">Analgesics</option>
            <option value="Antidiabetic">Antidiabetic</option>
            <option value="Respiratory">Respiratory</option>
            <option value="GI & Hepatology">GI & Hepatology</option>
            <option value="Emergency & Critical">Emergency & Critical</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Brand & Generic Name</th>
                <th className="py-3 px-4">Form & Category</th>
                <th className="py-3 px-4">Batch #</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4 text-right">Quick Stock Dispense / Add</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.map((med) => {
                const isLow = med.stockQuantity <= med.reorderLevel;
                return (
                  <tr key={med.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{med.brandName}</span>
                        {med.requiresPrescription && (
                          <span className="rounded bg-rose-50 px-1 py-0.2 text-[9px] font-bold text-rose-700 border border-rose-100">
                            Rx
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">{med.genericName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{med.form}</div>
                      <div className="text-[10px] text-slate-400">{med.category}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {med.batchNumber}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {med.expiryDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono font-bold">
                        <span className={isLow ? 'text-rose-600' : 'text-slate-800'}>
                          {med.stockQuantity} units
                        </span>
                        {isLow && (
                          <span className="flex items-center gap-0.5 rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Low</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      ${med.sellingPrice.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateMedicineStock(med.id, -10)}
                          disabled={med.stockQuantity < 10}
                          className="rounded border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                          title="Dispense 10 units"
                        >
                          -10 Dispense
                        </button>
                        <button
                          onClick={() => updateMedicineStock(med.id, 50)}
                          className="rounded border border-teal-200 bg-teal-50 px-2 py-1 text-[11px] font-semibold text-teal-800 hover:bg-teal-100"
                          title="Restock 50 units"
                        >
                          +50 Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Formulary Medicine</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="e.g. Augmentin"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Generic Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="e.g. Amoxicillin Clavulanate"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Therapeutic Class</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Analgesics">Analgesics</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="GI & Hepatology">GI & Hepatology</option>
                    <option value="Emergency & Critical">Emergency & Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Dosage Form</label>
                  <select
                    value={formData.form}
                    onChange={(e) => setFormData({ ...formData, form: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Save to Formulary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
