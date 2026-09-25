import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHospital();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
          warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
          error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
          info: <Info className="h-5 w-5 text-teal-600 shrink-0" />,
        };

        const borderStyles = {
          success: 'border-emerald-200 bg-white shadow-lg',
          warning: 'border-amber-200 bg-white shadow-lg',
          error: 'border-rose-200 bg-white shadow-lg',
          info: 'border-teal-200 bg-white shadow-lg',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-200 animate-in slide-in-from-bottom-3 ${borderStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-xs">
              <p className="font-bold text-slate-900">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-slate-600 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
