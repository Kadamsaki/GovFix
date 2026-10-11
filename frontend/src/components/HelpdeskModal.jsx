import React from 'react';
import { X, Phone, Mail, Clock, MapPin } from 'lucide-react';

export default function HelpdeskModal({ isOpen, onClose, t }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-gov-saffron" />
            <h3 className="text-sm sm:text-base font-bold">
              {t.modalHelpdeskTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          
          {/* Toll Free Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-gov-blue">
                {t.helpdeskTollFreeBadge}
              </span>
              <div className="text-xl font-black text-gov-navy font-mono">
                1800-11-2026
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-gov-blue text-white text-xs font-bold">
              Toll-Free
            </span>
          </div>

          {/* Directory Grid */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <Clock size={16} className="text-gov-teal shrink-0 mt-0.5" />
              <div>
                <strong className="text-gov-navy block">{t.helpdeskHoursTitle}</strong>
                <span className="text-slate-600">
                  {t.helpdeskHoursText}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <Mail size={16} className="text-gov-blue shrink-0 mt-0.5" />
              <div>
                <strong className="text-gov-navy block">{t.helpdeskEmailTitle}</strong>
                <span className="text-slate-600">{t.helpdeskEmailText}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <MapPin size={16} className="text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gov-navy block">{t.helpdeskHqTitle}</strong>
                <span className="text-slate-600">
                  {t.helpdeskHqText}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gov-navy hover:bg-slate-800 text-white rounded-lg font-bold text-xs sm:text-sm"
            >
              {t.btnCloseHelpdesk}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
