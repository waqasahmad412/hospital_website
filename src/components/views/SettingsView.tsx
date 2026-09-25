import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Phone,
  Mail,
  Save,
  Bell,
  Lock,
  Globe,
  DollarSign,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const SettingsView: React.FC = () => {
  const { addToast } = useHospital();

  const [hospitalName, setHospitalName] = useState('St. Jude Metropolitan Hospital & Medical Center');
  const [tagline, setTagline] = useState('Excellence in Tertiary Medicine, Clinical Research & Acute Trauma Care');
  const [address, setAddress] = useState('742 Healthcare Parkway, Medical District, Suite 100');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 911-STAT');
  const [accreditation, setAccreditation] = useState('Joint Commission International (JCI) Gold Seal #99482');
  const [currency, setCurrency] = useState('USD ($)');
  const [timezone, setTimezone] = useState('America/New_York (EST)');

  // Notification toggles
  const [notifyCodeBlue, setNotifyCodeBlue] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [notifyCriticalLab, setNotifyCriticalLab] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Hospital Configuration Saved', 'Facility metadata and clinical alert parameters updated.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Hospital Administration & System Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Institution profile, emergency hotlines, Joint Commission accreditation, and telemetry notification protocols.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Institution Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="h-5 w-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">Facility Profile & Identity</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Hospital Legal Identity *</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 font-bold text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Clinical Tagline / Mission</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-700 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-700 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Clinical Accreditation & License</label>
                <input
                  type="text"
                  value={accreditation}
                  onChange={(e) => setAccreditation(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-700 focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Hospital Switchboard Contact</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-700 focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-rose-700 mb-1">Emergency STAT Trauma Hotline</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full rounded-lg border border-rose-300 bg-rose-50/50 p-2.5 text-rose-900 font-bold focus:border-rose-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Alerts and Notification Preferences */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="h-5 w-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">Clinical Alert & Telemetry Broadcasts</h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">CODE BLUE Broadcast Triggers</span>
                <span className="text-slate-500">Audio-visual alert to all trauma and resuscitation personnel</span>
              </div>
              <input
                type="checkbox"
                checked={notifyCodeBlue}
                onChange={(e) => setNotifyCodeBlue(e.target.checked)}
                className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Critical Pathology Specimen Flags</span>
                <span className="text-slate-500">Instant notification when lab results enter critical alert thresholds</span>
              </div>
              <input
                type="checkbox"
                checked={notifyCriticalLab}
                onChange={(e) => setNotifyCriticalLab(e.target.checked)}
                className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Pharmacy Low Stock Auto-Reorder Alerts</span>
                <span className="text-slate-500">Notify dispensary manager when formulary items fall below minimum buffer</span>
              </div>
              <input
                type="checkbox"
                checked={notifyLowStock}
                onChange={(e) => setNotifyLowStock(e.target.checked)}
                className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save System Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
