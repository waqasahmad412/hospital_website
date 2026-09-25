import React, { useState, useRef } from 'react';
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
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  X,
} from 'lucide-react';
import { useHospital, NavigationView } from '../../context/HospitalContext';

export interface TopNavItem {
  id: NavigationView;
  label: string;
  category: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  description?: string;
}

export const TopNavigation: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    emergencyCases,
    appointments,
    notifications,
  } = useHospital();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [megaMenuOpen, setMegaMenuOpen] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const emergencyCount = emergencyCases.filter((c) => c.status !== 'Stabilized').length;
  const todayAppointmentsCount = appointments.filter((a) => a.date === '2026-09-23').length;
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const allNavItems: TopNavItem[] = [
    // General
    { id: 'dashboard', label: 'Dashboard', category: 'General & System', icon: LayoutDashboard, description: 'Executive command & live clinical KPI metrics' },
    {
      id: 'emergency',
      label: 'Emergency / Triage',
      category: 'General & System',
      icon: AlertCircle,
      badge: emergencyCount > 0 ? emergencyCount : undefined,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
      description: 'Acute trauma intake & Manchester/ESI triage stratification',
    },
    // Clinical Services
    { id: 'patients', label: 'Patients', category: 'Clinical Services', icon: Users, description: 'Electronic Health Records (EHR) & patient directory' },
    { id: 'doctors', label: 'Doctors', category: 'Clinical Services', icon: UserCheck, description: 'Physicians, specialists & faculty duty schedules' },
    {
      id: 'appointments',
      label: 'Appointments',
      category: 'Clinical Services',
      icon: Calendar,
      badge: todayAppointmentsCount > 0 ? todayAppointmentsCount : undefined,
      badgeColor: 'bg-teal-600 text-white',
      description: 'Consultation scheduling engine & lifecycle tracker',
    },
    { id: 'departments', label: 'Departments', category: 'Clinical Services', icon: Building2, description: 'Hospital clinical wings, specialties & facilities' },
    { id: 'opd', label: 'OPD (Outpatient)', category: 'Clinical Services', icon: Clock, description: 'Outpatient consultation queue & token allocation' },

    // Inpatient & Wards
    { id: 'ipd', label: 'IPD (Inpatient)', category: 'Inpatient & Wards', icon: BedDouble, description: 'Inpatient census, bed allocation & nursing progress' },
    { id: 'admissions', label: 'Admissions', category: 'Inpatient & Wards', icon: UserPlus, description: 'Patient admission registry & room assignment' },
    { id: 'discharge', label: 'Discharge', category: 'Inpatient & Wards', icon: LogOut, description: 'Discharge clearance summaries & discharge tracking' },
    { id: 'rooms-beds', label: 'Rooms & Beds', category: 'Inpatient & Wards', icon: Grid, description: 'Real-time bed matrix, occupancy & sanitation turnover' },
    { id: 'icu', label: 'ICU Telemetry', category: 'Inpatient & Wards', icon: Activity, description: 'Critical care multi-parameter monitors & waveforms' },
    { id: 'operation-theatre', label: 'Operation Theatre', category: 'Inpatient & Wards', icon: Scissors, description: 'Surgical suites scheduling & lead surgeon roster' },

    // Diagnostics & Pharmacy
    { id: 'laboratory', label: 'Laboratory', category: 'Diagnostics & Pharmacy', icon: Microscope, description: 'Biochemistry, hematology & diagnostic sample testing' },
    { id: 'radiology', label: 'Radiology / PACS', category: 'Diagnostics & Pharmacy', icon: Radio, description: 'MRI, CT, X-Ray diagnostic imaging & DICOM impressions' },
    { id: 'pharmacy', label: 'Pharmacy', category: 'Diagnostics & Pharmacy', icon: Pill, description: 'Hospital dispensary formulary & inventory restocking' },
    { id: 'prescriptions', label: 'Prescriptions', category: 'Diagnostics & Pharmacy', icon: FileText, description: 'Digital electronic prescriptions & drug regimens' },
    { id: 'blood-bank', label: 'Blood Bank', category: 'Diagnostics & Pharmacy', icon: Droplets, description: 'ABO/Rh blood reserves & STAT transfusion requests' },

    // Operations & Staff
    { id: 'nurses', label: 'Nurses', category: 'Operations & Staff', icon: HeartPulse, description: 'Nursing staff roster & inpatient shift coordination' },
    { id: 'staff', label: 'Staff Directory', category: 'Operations & Staff', icon: UserCheck, description: 'Hospital administrative & clinical staff directory' },
    { id: 'ambulance', label: 'Ambulance & EMS', category: 'Operations & Staff', icon: Ambulance, description: 'Emergency response ambulance fleet & dispatch log' },
    { id: 'inventory', label: 'Hospital Supplies', category: 'Operations & Staff', icon: Package, description: 'Medical equipment, surgical consumables & stock' },

    // Finance & Administration
    { id: 'billing', label: 'Billing & Invoices', category: 'Finance & Administration', icon: CreditCard, description: 'Itemized billing, charges & hospital cash collection' },
    { id: 'payments', label: 'Payments', category: 'Finance & Administration', icon: DollarSign, description: 'Treasury payment transactions & cashier register' },
    { id: 'insurance', label: 'Insurance (TPA)', category: 'Finance & Administration', icon: Shield, description: 'Health insurance claims, pre-auth & settlements' },
    { id: 'hr-payroll', label: 'HR & Payroll', category: 'Finance & Administration', icon: BadgeDollarSign, description: 'Physician & staff payroll calculations' },
    { id: 'reports', label: 'Analytics Reports', category: 'Finance & Administration', icon: BarChart3, description: 'Hospital operational analytics & performance reports' },

    // System
    {
      id: 'notifications',
      label: 'Notifications',
      category: 'General & System',
      icon: Bell,
      badge: unreadNotifCount > 0 ? unreadNotifCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
      description: 'Hospital broadcast alerts & real-time telemetry alarms',
    },
    { id: 'settings', label: 'Settings', category: 'General & System', icon: Settings, description: 'Hospital parameters, ward tariffs & system configs' },
  ];

  const categories = [
    'All',
    'Clinical Services',
    'Inpatient & Wards',
    'Diagnostics & Pharmacy',
    'Operations & Staff',
    'Finance & Administration',
    'General & System',
  ];

  const filteredItems = activeCategory === 'All'
    ? allNavItems
    : allNavItems.filter((item) => item.category === activeCategory);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSelectView = (view: NavigationView) => {
    setCurrentView(view);
    setMegaMenuOpen(false);
  };

  return (
    <div className="sticky top-16 z-20 border-b border-slate-200/90 bg-white/95 shadow-xs backdrop-blur-md">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tier 1: Category Filter Pills + All Modules Mega Menu Button */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 gap-2 overflow-x-auto no-scrollbar">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto py-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden lg:inline">
              Sections:
            </span>
            {categories.map((cat) => {
              const count = cat === 'All'
                ? allNavItems.length
                : allNavItems.filter((i) => i.category === cat).length;
              const isActive = activeCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.2 text-[10px] font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick All Modules Mega Menu Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                megaMenuOpen
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 text-teal-600" />
              <span className="hidden sm:inline">All 29 Modules</span>
              <span className="sm:hidden">All (29)</span>
            </button>
          </div>
        </div>

        {/* Tier 2: The Navigation Buttons Row with Left & Right Scroll Arrows */}
        <div className="relative flex items-center py-2">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-100 hover:text-slate-900 transition-colors mr-1.5 z-10"
            title="Scroll left"
            aria-label="Scroll navigation buttons left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Horizontal Buttons Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth py-1 px-0.5 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectView(item.id)}
                  title={item.description || item.label}
                  className={`group relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer shadow-xs ${
                    isActive
                      ? 'bg-teal-600 text-white font-semibold shadow-md ring-2 ring-teal-500/30'
                      : 'border border-slate-200/90 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-900'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-teal-600'
                    }`}
                  />
                  <span>{item.label}</span>

                  {item.badge !== undefined && (
                    <span
                      className={`ml-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                        item.badgeColor || 'bg-teal-600 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-100 hover:text-slate-900 transition-colors ml-1.5 z-10"
            title="Scroll right"
            aria-label="Scroll navigation buttons right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mega Menu Drawer / Popover (Shows All 29 Modules in Structured Matrix) */}
      {megaMenuOpen && (
        <div className="border-t border-slate-200 bg-slate-50/95 backdrop-blur-md shadow-xl py-6 px-4 sm:px-6 lg:px-8 max-h-[75vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-w-[1920px] mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                  <LayoutGrid className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Hospital Enterprise Modules Directory</h3>
                  <p className="text-xs text-slate-500">Quickly jump to any clinical, inpatient, diagnostic, or financial system</p>
                </div>
              </div>
              <button
                onClick={() => setMegaMenuOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-5">
              {[
                { name: 'General & System', items: allNavItems.filter((i) => i.category === 'General & System') },
                { name: 'Clinical Services', items: allNavItems.filter((i) => i.category === 'Clinical Services') },
                { name: 'Inpatient & Wards', items: allNavItems.filter((i) => i.category === 'Inpatient & Wards') },
                { name: 'Diagnostics & Rx', items: allNavItems.filter((i) => i.category === 'Diagnostics & Pharmacy') },
                { name: 'Operations & Staff', items: allNavItems.filter((i) => i.category === 'Operations & Staff') },
                { name: 'Finance & Admin', items: allNavItems.filter((i) => i.category === 'Finance & Administration') },
              ].map((group) => (
                <div key={group.name} className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-200 pb-1">
                    {group.name}
                  </span>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectView(item.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs text-left transition-all ${
                            isActive
                              ? 'bg-teal-600 text-white font-semibold shadow-xs'
                              : 'text-slate-700 hover:bg-white hover:text-teal-700 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span
                              className={`shrink-0 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                                item.badgeColor || 'bg-teal-600 text-white'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
