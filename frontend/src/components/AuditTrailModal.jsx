import React from 'react';
import { X, ShieldAlert, ShieldCheck, Clock, User, AlertCircle, FileText } from 'lucide-react';

export default function AuditTrailModal({ isOpen, onClose, complaintId, audits = [], t }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={20} className="text-gov-blue" />
            <div>
              <h3 className="text-sm sm:text-base font-bold">
                Immutable Audit Trail & Security Log
              </h3>
              <p className="text-[11px] text-slate-300 font-mono">
                Complaint Ref: {complaintId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2">
            <AlertCircle size={16} className="text-gov-blue shrink-0 mt-0.5" />
            <span>
              Every status change attempt is permanently journaled. Both successful transitions and rejected unauthorized attempts are logged for municipal transparency and accountability.
            </span>
          </div>

          {audits.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No audit entries recorded yet for this complaint.
            </div>
          ) : (
            <div className="space-y-3">
              {audits.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    item.is_accepted
                      ? 'bg-slate-50/70 border-slate-200 hover:border-emerald-300'
                      : 'bg-rose-50/70 border-rose-200 hover:border-rose-400'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.is_accepted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1'
                        }`}
                      >
                        {item.is_accepted ? '✓ Accepted' : '✕ Rejected Attempt'}
                      </span>
                      <span className="font-bold text-gov-navy font-mono text-[11px]">
                        {item.action}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                      <Clock size={12} />
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400">Actor:</span>{' '}
                      <strong className="text-slate-800">{item.user_name}</strong>{' '}
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">
                        {item.user_role}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Status Flow:</span>{' '}
                      <span className="font-mono text-slate-700 font-bold">
                        {item.previous_status} → {item.requested_status}
                      </span>
                    </div>
                  </div>

                  {item.reason && (
                    <div
                      className={`mt-2 text-[11px] p-2 rounded ${
                        item.is_accepted
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-100'
                          : 'bg-rose-50 text-rose-900 border border-rose-200 font-medium'
                      }`}
                    >
                      <span className="font-bold">
                        {item.is_accepted ? 'Remarks:' : 'Rejection Reason:'}{' '}
                      </span>
                      {item.reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total Log Entries: <strong>{audits.length}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
