import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 text-white';
        let Icon = Info;

        if (toast.type === 'success') {
          bg = 'bg-emerald-600 text-white';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-600 text-white';
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border border-white/10 ${bg} animate-in slide-in-from-bottom-3 duration-200`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-medium flex-1 leading-snug">
              {toast.message}
            </p>
            <button
              onClick={() => onDismiss(toast.id)}
              aria-label="Tutup notifikasi"
              className="p-1 rounded-lg hover:bg-black/15 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
