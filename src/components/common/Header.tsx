import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  User,
  HeartPulse,
} from 'lucide-react';
import { useHospital, NavigationView } from '../../context/HospitalContext';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    user,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSearchModalOpen,
    setMobileMenuOpen,
    emergencyCases,
  } = useHospital();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalEmergencyCount = emergencyCases.filter((c) => c.priority === 'Critical').length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format current view title
  const viewTitles: Record<NavigationView, string> = {
    dashboard: 'Hospital Executive Command',
    patients: 'Patient Directory & Health Records',
    doctors: 'Medical Faculty & Specialists',
    appointments: 'Clinical Appointments & Calendar',
    departments: 'Clinical & Diagnostic Departments',
    nurses: 'Nursing Staff Management',
    staff: 'Hospital Staff Directory & HR',
    admissions: 'Inpatient Admissions',
    discharge: 'Discharge Summaries & Planning',
    emergency: 'Emergency & Acute Trauma Center',
    opd: 'Outpatient Department (OPD)',
    ipd: 'Inpatient Department (IPD)',
    laboratory: 'Pathology & Diagnostic Laboratory',
    pharmacy: 'Central Pharmacy & Dispensary',
    prescriptions: 'Clinical e-Prescriptions',
    radiology: 'Diagnostic Radiology & Imaging',
    'blood-bank': 'Transfusion Medicine & Blood Bank',
    'operation-theatre': 'Surgical Suites & Operation Theatre',
    icu: 'Intensive Care Unit (ICU) Telemetry',
    ambulance: 'Emergency Fleet & Mobile EMS',
    'rooms-beds': 'Ward & Bed Occupancy Grid',
    billing: 'Patient Billing & Invoicing',
    payments: 'Treasury & Payment Ledger',
    insurance: 'Health Insurance Claims & TPA',
    reports: 'Clinical & Operational Analytics',
    inventory: 'Hospital Supplies & Consumables',
    'hr-payroll': 'Human Resources & Payroll',
    notifications: 'Hospital Notification Center',
    settings: 'Facility Parameters & Settings',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 md:px-6 backdrop-blur-sm">
      {/* Zone 1: Hospital Brand Logo & Current View */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-base leading-none">
                St. Jude Metropolitan
              </span>
              <span className="hidden xl:inline-flex rounded-md bg-teal-100/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-800">
                Hospital System
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-1 truncate max-w-[160px] sm:max-w-none">
              {viewTitles[currentView] || 'Executive Command'}
            </p>
          </div>
        </button>
      </div>

      {/* Zone 2: Global Search Bar Affordance (Properly sized, centered & padded from all 4 sides) */}
      <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-3 lg:mx-6 min-w-0">
        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="group flex h-10 w-full items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3.5 py-2 text-xs lg:text-sm text-slate-500 shadow-xs hover:border-teal-400 hover:bg-white hover:text-slate-700 transition-all cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
            <Search className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-teal-600 transition-colors" />
            <span className="truncate whitespace-nowrap text-slate-400 group-hover:text-slate-600 font-normal">
              Search patients, doctors, drugs, invoices...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center shrink-0 rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-400 shadow-[0_1px_1px_rgba(0,0,0,0.04)] group-hover:border-slate-300">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Quick Emergency Indicator if critical cases */}
        {criticalEmergencyCount > 0 && (
          <button
            onClick={() => setCurrentView('emergency')}
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors animate-pulse"
          >
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            <span>{criticalEmergencyCount} Critical ER</span>
          </button>
        )}

        {/* Search trigger on mobile */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
          title="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Quick Calendar */}
        <button
          onClick={() => setCurrentView('appointments')}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          title="Appointments Calendar"
        >
          <Calendar className="h-5 w-5" />
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 pb-2.5 pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded bg-teal-50 px-1.5 py-0.5 text-xs font-semibold text-teal-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs font-medium text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No active alerts</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.targetView) {
                          setCurrentView(notif.targetView as NavigationView);
                        }
                        setNotifDropdownOpen(false);
                      }}
                      className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        notif.read ? 'hover:bg-slate-50 opacity-70' : 'bg-teal-50/30 hover:bg-teal-50/60'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {notif.category === 'Emergency' ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                            <HeartPulse className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                          <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-600 line-clamp-2">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-100 pt-2 px-3">
                <button
                  onClick={() => {
                    setCurrentView('notifications');
                    setNotifDropdownOpen(false);
                  }}
                  className="w-full text-center text-xs font-medium text-teal-600 hover:text-teal-700 py-1"
                >
                  View full notification center &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 rounded-lg p-1 hover:bg-slate-100 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover border border-teal-200"
            />
            <div className="hidden lg:block text-left text-xs leading-tight">
              <p className="font-semibold text-slate-800">{user.name}</p>
              <p className="text-[11px] text-teal-700 font-medium">{user.role}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <div className="mt-1 inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
                  Role: {user.role}
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentView('settings');
                  setProfileDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                <SettingsIcon className="h-3.5 w-3.5 text-slate-400" />
                Hospital Settings
              </button>

              <button
                onClick={() => {
                  setCurrentView('staff');
                  setProfileDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                <User className="h-3.5 w-3.5 text-slate-400" />
                Staff Directory
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={() => {
                  logout();
                  setProfileDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-500" />
                Sign Out Portal
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
