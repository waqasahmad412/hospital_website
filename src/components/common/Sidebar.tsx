import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Building2,
  HeartPulse,
  UserPlus,
  LogOut,
  AlertCircle,
  Clock,
  BedDouble,
  Microscope,
  Pill,
  FileText,
  Radio,
  Droplets,
  Scissors,
  Activity,
  Ambulance,
  Grid,
  CreditCard,
  DollarSign,
  Shield,
  BarChart3,
  Package,
  BadgeDollarSign,
  Bell,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useHospital, NavigationView } from '../../context/HospitalContext';

interface NavGroup {
  groupName: string;
  items: {
    id: NavigationView;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    emergencyCases,
    appointments,
    notifications,
    settings,
  } = useHospital();

  const emergencyCount = emergencyCases.filter((c) => c.status !== 'Stabilized').length;
  const todayAppointmentsCount = appointments.filter((a) => a.date === '2026-09-23').length;
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const navigationGroups: NavGroup[] = [
    {
      groupName: 'General',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        {
          id: 'emergency',
          label: 'Emergency / Triage',
          icon: AlertCircle,
          badge: emergencyCount > 0 ? emergencyCount : undefined,
          badgeColor: 'bg-rose-500 text-white',
        },
      ],
    },
    {
      groupName: 'Clinical Services',
      items: [
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'doctors', label: 'Doctors', icon: UserCheck },
        {
          id: 'appointments',
          label: 'Appointments',
          icon: Calendar,
          badge: todayAppointmentsCount > 0 ? todayAppointmentsCount : undefined,
          badgeColor: 'bg-teal-600 text-white',
        },
        { id: 'departments', label: 'Departments', icon: Building2 },
        { id: 'opd', label: 'OPD (Outpatient)', icon: Clock },
      ],
    },
    {
      groupName: 'Inpatient & Wards',
      items: [
        { id: 'ipd', label: 'IPD (Inpatient)', icon: BedDouble },
        { id: 'admissions', label: 'Admissions', icon: UserPlus },
        { id: 'discharge', label: 'Discharge', icon: LogOut },
        { id: 'rooms-beds', label: 'Rooms & Beds', icon: Grid },
        { id: 'icu', label: 'ICU Telemetry', icon: Activity },
        { id: 'operation-theatre', label: 'Operation Theatre', icon: Scissors },
      ],
    },
    {
      groupName: 'Diagnostics & Pharmacy',
      items: [
        { id: 'laboratory', label: 'Laboratory', icon: Microscope },
        { id: 'radiology', label: 'Radiology / PACS', icon: Radio },
        { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
        { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
        { id: 'blood-bank', label: 'Blood Bank', icon: Droplets },
      ],
    },
    {
      groupName: 'Operations & Staff',
      items: [
        { id: 'nurses', label: 'Nurses', icon: HeartPulse },
        { id: 'staff', label: 'Staff Directory', icon: UserCheck },
        { id: 'ambulance', label: 'Ambulance & EMS', icon: Ambulance },
        { id: 'inventory', label: 'Hospital Supplies', icon: Package },
      ],
    },
    {
      groupName: 'Finance & Administration',
      items: [
        { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
        { id: 'payments', label: 'Payments', icon: DollarSign },
        { id: 'insurance', label: 'Insurance (TPA)', icon: Shield },
        { id: 'hr-payroll', label: 'HR & Payroll', icon: BadgeDollarSign },
        { id: 'reports', label: 'Analytics Reports', icon: BarChart3 },
      ],
    },
    {
      groupName: 'System',
      items: [
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          badge: unreadNotifCount > 0 ? unreadNotifCount : undefined,
          badgeColor: 'bg-amber-500 text-white',
        },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleNavClick = (view: NavigationView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white shadow-md">
            <HeartPulse className="h-6 w-6" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-white text-sm tracking-tight leading-tight truncate">
                {settings.hospitalName}
              </span>
              <span className="text-[10px] text-teal-400 font-medium tracking-wide uppercase">
                Clinical Enterprise
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        {navigationGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            {!sidebarCollapsed && (
              <p className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider">
                {group.groupName}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-teal-600/90 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge !== undefined && (
                    <span
                      className={`ml-auto rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        item.badgeColor || 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      {!sidebarCollapsed ? (
        <div className="border-t border-slate-800 p-3 bg-slate-950/40">
          <div className="rounded-lg bg-slate-800/80 p-2.5 text-xs">
            <div className="flex items-center gap-2 text-teal-400 font-semibold mb-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Accredited Center</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Emergency Code Blue: <span className="font-semibold text-white">Ext. 911</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="border-t border-slate-800 p-2 text-center">
          <div className="h-2 w-2 rounded-full bg-emerald-500 mx-auto" title="System Operational" />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } border-r border-slate-800`}
      >
        <div className="sticky top-0 h-screen overflow-hidden">{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-slate-900 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
