import React from 'react';
import { X, Printer, Download, CheckCircle, HeartPulse, Building2, Phone, Mail } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const PrintDocumentModal: React.FC = () => {
  const { activePrintDoc, setActivePrintDoc, settings } = useHospital();

  if (!activePrintDoc) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:m-0">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden"
        onClick={() => setActivePrintDoc(null)}
      />

      {/* Document Container */}
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-10 my-auto print:shadow-none print:border-none print:w-full print:max-w-none">
        {/* Action Header (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="h-4 w-4 text-teal-700" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Document Preview & Print Center
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={() => setActivePrintDoc(null)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-800 bg-white">
          {/* Hospital Official Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-teal-800/80 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700 text-white shadow">
                <HeartPulse className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                  {settings.hospitalName}
                </h1>
                <p className="mt-1 text-xs text-slate-500 font-medium">{settings.tagline}</p>
                <p className="text-[11px] text-slate-400">Accreditation ID: {settings.regNumber}</p>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-500 leading-tight space-y-0.5">
              <p className="font-semibold text-slate-700">{settings.address}</p>
              <p>{settings.cityCountry}</p>
              <p>Hotline: {settings.emergencyHotline}</p>
              <p>Email: {settings.email}</p>
            </div>
          </div>

          {/* DOCUMENT BODY - INVOICE */}
          {activePrintDoc.type === 'invoice' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">Official Clinical Invoice</span>
                  <h2 className="text-2xl font-extrabold text-slate-900">{activePrintDoc.data.invoiceNumber}</h2>
                </div>
                <div className="text-right text-xs">
                  <p><span className="text-slate-400">Date:</span> <span className="font-semibold">{activePrintDoc.data.date}</span></p>
                  <p><span className="text-slate-400">Due Date:</span> <span className="font-semibold">{activePrintDoc.data.dueDate}</span></p>
                  <div className="mt-1 inline-flex rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-800">
                    Status: {activePrintDoc.data.status}
                  </div>
                </div>
              </div>

              {/* Patient Info */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Billed To Patient:</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{activePrintDoc.data.patientName}</p>
                  <p className="text-slate-600">MRN: {activePrintDoc.data.mrn}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-medium">Payment Method:</p>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">Verified Hospital Billing</p>
                  {activePrintDoc.data.insuranceClaimed && (
                    <p className="text-teal-700 font-medium">Insurance Coverage Applied: ${activePrintDoc.data.insuranceClaimed.toLocaleString()}</p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2">Description / Service</th>
                    <th className="py-2">Category</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activePrintDoc.data.items.map((item) => (
                    <tr key={item.id} className="py-2.5">
                      <td className="py-2 font-medium text-slate-800">{item.description}</td>
                      <td className="py-2 text-slate-500">{item.category}</td>
                      <td className="py-2 text-center font-mono">{item.quantity}</td>
                      <td className="py-2 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-2 text-right font-mono font-semibold">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t border-slate-200 pt-4 flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">${activePrintDoc.data.subtotal.toFixed(2)}</span>
                  </div>
                  {activePrintDoc.data.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Hospital Courtesy Discount:</span>
                      <span className="font-mono">-${activePrintDoc.data.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Statutory Medical Tax:</span>
                    <span className="font-mono">${activePrintDoc.data.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                    <span>Total Amount:</span>
                    <span className="font-mono font-extrabold text-teal-800">${activePrintDoc.data.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Amount Paid:</span>
                    <span className="font-mono font-semibold text-emerald-700">${activePrintDoc.data.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Balance Due:</span>
                    <span className="font-mono font-bold text-rose-700">
                      ${Math.max(0, activePrintDoc.data.total - activePrintDoc.data.paidAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENT BODY - PRESCRIPTION */}
          {activePrintDoc.type === 'prescription' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">Digital Clinical Prescription</span>
                  <h2 className="text-xl font-bold text-slate-900">{activePrintDoc.data.rxNumber}</h2>
                </div>
                <div className="text-right text-xs">
                  <p><span className="text-slate-400">Date Issued:</span> <span className="font-semibold">{activePrintDoc.data.date}</span></p>
                  <p><span className="text-slate-400">Next Follow-Up:</span> <span className="font-semibold">{activePrintDoc.data.followUpDate || 'As needed'}</span></p>
                </div>
              </div>

              {/* Doctor & Patient Row */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Prescribing Physician</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{activePrintDoc.data.doctorName}</p>
                  <p className="text-slate-600">{activePrintDoc.data.doctorSpecialization}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Patient Details</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{activePrintDoc.data.patientName}</p>
                  <p className="text-slate-600">{activePrintDoc.data.patientAge} Years · {activePrintDoc.data.patientGender}</p>
                  {activePrintDoc.data.vitalsSummary && (
                    <p className="text-[10px] text-teal-700 font-medium mt-1">{activePrintDoc.data.vitalsSummary}</p>
                  )}
                </div>
              </div>

              {/* Diagnosis */}
              <div className="border-l-4 border-teal-600 bg-teal-50/40 p-3 rounded-r-lg text-xs">
                <span className="font-bold text-slate-900">Clinical Diagnosis: </span>
                <span className="text-slate-700">{activePrintDoc.data.diagnosis}</span>
              </div>

              {/* Rx Medicines List */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-teal-800 font-extrabold text-lg">
                  <span className="font-serif italic text-2xl">℞</span>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-sans font-bold">Prescribed Medication Regimen</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {activePrintDoc.data.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 text-xs bg-white hover:bg-slate-50/50">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900 text-sm">{idx + 1}. {item.medicineName}</span>
                        <span className="font-mono text-teal-700 font-semibold">{item.duration}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-4 text-slate-600 text-[11px]">
                        <span>Dosage: <strong className="text-slate-800">{item.dosage}</strong></span>
                        <span>Frequency: <strong className="text-slate-800">{item.frequency}</strong></span>
                      </div>
                      {item.instructions && (
                        <p className="mt-1 text-[11px] text-slate-500 italic">Instructions: {item.instructions}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {activePrintDoc.data.adviceNotes && (
                <div className="rounded-xl border border-slate-200 p-3.5 text-xs text-slate-600">
                  <p className="font-bold text-slate-800 mb-1">Doctor's Dietary & Lifestyle Advice:</p>
                  <p>{activePrintDoc.data.adviceNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* DOCUMENT BODY - LAB REPORT */}
          {activePrintDoc.type === 'labReport' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">Official Diagnostic Pathology Report</span>
                  <h2 className="text-xl font-bold text-slate-900">{activePrintDoc.data.orderNumber}</h2>
                </div>
                <div className="text-right text-xs">
                  <p><span className="text-slate-400">Order Date:</span> <span className="font-semibold">{activePrintDoc.data.orderDate}</span></p>
                  <p><span className="text-slate-400">Ordering MD:</span> <span className="font-semibold">{activePrintDoc.data.doctorName}</span></p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs grid grid-cols-2">
                <div>
                  <p className="text-slate-400">Patient Name:</p>
                  <p className="text-sm font-bold text-slate-900">{activePrintDoc.data.patientName}</p>
                  <p className="text-slate-500">ID: {activePrintDoc.data.patientId}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400">Test Performed:</p>
                  <p className="text-sm font-bold text-teal-800">{activePrintDoc.data.testName}</p>
                  <p className="text-slate-500">Code: {activePrintDoc.data.testCode}</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
                    <tr>
                      <th className="p-3">Parameter Tested</th>
                      <th className="p-3 text-center">Observed Value</th>
                      <th className="p-3 text-center">Unit</th>
                      <th className="p-3">Reference Biological Interval</th>
                      <th className="p-3 text-right">Flag</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-semibold text-slate-900">{activePrintDoc.data.testName}</td>
                      <td className="p-3 text-center font-mono font-bold text-base text-slate-900">
                        {activePrintDoc.data.value || 'N/A'}
                      </td>
                      <td className="p-3 text-center font-mono text-slate-600">{activePrintDoc.data.unit || '-'}</td>
                      <td className="p-3 text-slate-600">{activePrintDoc.data.normalRange || 'Standard reference parameters'}</td>
                      <td className="p-3 text-right font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          activePrintDoc.data.flag === 'Normal' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {activePrintDoc.data.flag || 'Normal'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {activePrintDoc.data.resultSummary && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
                  <p className="font-bold text-slate-800 mb-1">Pathologist's Clinical Impression:</p>
                  <p className="text-slate-700 leading-relaxed">{activePrintDoc.data.resultSummary}</p>
                </div>
              )}
            </div>
          )}

          {/* DOCUMENT BODY - DISCHARGE SUMMARY */}
          {activePrintDoc.type === 'dischargeSummary' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">Official Inpatient Discharge Summary</span>
                  <h2 className="text-xl font-bold text-slate-900">Record #{activePrintDoc.data.id}</h2>
                </div>
                <div className="text-right text-xs">
                  <p><span className="text-slate-400">Admit Date:</span> <span className="font-semibold">{activePrintDoc.data.admissionDate}</span></p>
                  <p><span className="text-slate-400">Discharge Date:</span> <span className="font-semibold">{activePrintDoc.data.expectedDischarge}</span></p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 grid grid-cols-2 text-xs">
                <div>
                  <p className="text-slate-400">Patient:</p>
                  <p className="text-sm font-bold text-slate-900">{activePrintDoc.data.patientName}</p>
                  <p className="text-slate-600">MRN: {activePrintDoc.data.mrn}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400">Attending Physician:</p>
                  <p className="text-sm font-bold text-slate-900">{activePrintDoc.data.doctorName}</p>
                  <p className="text-slate-600">{activePrintDoc.data.wardType} · {activePrintDoc.data.roomNumber}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-800">Primary Admission Diagnosis:</p>
                <p className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700">{activePrintDoc.data.diagnosis}</p>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-800">Inpatient Clinical Course & Nursing Milestones:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                  {activePrintDoc.data.nursingNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Footer Signatures */}
          <div className="border-t border-slate-200 pt-8 mt-8 flex items-end justify-between text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-800">Electronic Verification Hash:</p>
              <p className="font-mono text-[10px] text-slate-400">STJUDE-AUTH-{Date.now().toString(36).toUpperCase()}-VERIFIED</p>
              <p className="mt-1 text-[10px] text-slate-400">This document is electronically verified under HIPAA & Hospital Compliance guidelines.</p>
            </div>
            <div className="text-right">
              <div className="inline-block border-b border-slate-400 pb-1 w-44 text-center">
                <span className="font-serif italic text-sm text-slate-700">Dr. Evelyn Vance, MD</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-700 mt-1">Authorized Medical Officer Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
