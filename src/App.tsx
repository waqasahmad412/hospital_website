import React from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Header } from './components/common/Header';
import { TopNavigation } from './components/common/TopNavigation';
import { ToastContainer } from './components/common/Toast';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { PrintDocumentModal } from './components/common/PrintDocumentModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { PatientsView } from './components/views/PatientsView';
import { DoctorsView } from './components/views/DoctorsView';
import { AppointmentsView } from './components/views/AppointmentsView';
import { EmergencyView } from './components/views/EmergencyView';
import { OPDView } from './components/views/OPDView';
import { IPDView } from './components/views/IPDView';
import { RoomsBedsView } from './components/views/RoomsBedsView';
import { AdmissionsView } from './components/views/AdmissionsView';
import { DischargeView } from './components/views/DischargeView';
import { LaboratoryView } from './components/views/LaboratoryView';
import { PharmacyView } from './components/views/PharmacyView';
import { PrescriptionsView } from './components/views/PrescriptionsView';
import { RadiologyView } from './components/views/RadiologyView';
import { BloodBankView } from './components/views/BloodBankView';
import { OperationTheatreView } from './components/views/OperationTheatreView';
import { ICUView } from './components/views/ICUView';
import { BillingInvoicesView } from './components/views/BillingInvoicesView';
import { PaymentsView } from './components/views/PaymentsView';
import { InsuranceView } from './components/views/InsuranceView';
import { DepartmentsView } from './components/views/DepartmentsView';
import { NursesStaffView } from './components/views/NursesStaffView';
import { AmbulanceView } from './components/views/AmbulanceView';
import { ReportsAnalyticsView } from './components/views/ReportsAnalyticsView';
import { SettingsView } from './components/views/SettingsView';

const AppContent: React.FC = () => {
  const { currentView } = useHospital();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'patients':
        return <PatientsView />;
      case 'doctors':
        return <DoctorsView />;
      case 'appointments':
        return <AppointmentsView />;
      case 'emergency':
        return <EmergencyView />;
      case 'opd':
        return <OPDView />;
      case 'ipd':
        return <IPDView />;
      case 'rooms-beds':
        return <RoomsBedsView />;
      case 'admissions':
        return <AdmissionsView />;
      case 'discharge':
        return <DischargeView />;
      case 'laboratory':
        return <LaboratoryView />;
      case 'pharmacy':
        return <PharmacyView />;
      case 'prescriptions':
        return <PrescriptionsView />;
      case 'radiology':
        return <RadiologyView />;
      case 'blood-bank':
        return <BloodBankView />;
      case 'operation-theatre':
        return <OperationTheatreView />;
      case 'icu':
        return <ICUView />;
      case 'billing':
        return <BillingInvoicesView />;
      case 'payments':
        return <PaymentsView />;
      case 'insurance':
        return <InsuranceView />;
      case 'departments':
        return <DepartmentsView />;
      case 'nurses':
      case 'staff':
        return <NursesStaffView />;
      case 'ambulance':
        return <AmbulanceView />;
      case 'reports':
        return <ReportsAnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <Header />

      {/* Top Navigation Bar with all hospital system buttons */}
      <TopNavigation />

      {/* Scrollable View Container */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="mx-auto max-w-7xl">
          {renderView()}
        </div>
      </main>

      {/* Global Interactive Modals & Toast System */}
      <GlobalSearchModal />
      <PrintDocumentModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <AppContent />
    </HospitalProvider>
  );
}
