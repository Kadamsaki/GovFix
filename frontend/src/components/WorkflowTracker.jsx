import React from 'react';
import {
  Check,
  Clock,
  Wrench,
  UserCheck,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from 'lucide-react';

const WORKFLOW_STAGES = [
  { key: 'SUBMITTED', label: 'Submitted', desc: 'Registered' },
  { key: 'UNDER_REVIEW', label: 'Under Review', desc: 'Triaged' },
  { key: 'ASSIGNED', label: 'Assigned', desc: 'Dispatched' },
  { key: 'IN_PROGRESS', label: 'In Progress', desc: 'Work Ongoing' },
  { key: 'RESOLVED', label: 'Resolved', desc: 'Completed' },
  { key: 'CLOSED', label: 'Closed', desc: 'Approved & Closed' },
];

const STAGE_ORDER = ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export default function WorkflowTracker({
  currentStatus = 'SUBMITTED',
  audits = [],
  assignedDepartment = null,
  assignedOfficer = null,
  userRole = 'citizen',
}) {
  const currentKey = (currentStatus || 'SUBMITTED').toUpperCase();
  const currentIndex = STAGE_ORDER.indexOf(currentKey);

  const getStageAudit = (stageKey) => {
    if (!audits || audits.length === 0) return null;
    return audits
      .filter((a) => a.is_accepted && a.requested_status === stageKey)
      .slice(-1)[0];
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'CLOSED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'RESOLVED':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'ASSIGNED':
        return 'bg-blue-100 text-gov-blue border-blue-300';
      case 'UNDER_REVIEW':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      {/* Top Header: Current status and progress */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Complaint Lifecycle
          </span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getStatusBadgeColor(
              currentKey
            )}`}
          >
            {currentKey.replace('_', ' ')}
          </span>
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          {currentKey === 'CLOSED' ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 size={13} />
              <span>Redressal Complete</span>
            </span>
          ) : (
            <span>
              Step <strong>{Math.max(1, currentIndex + 1)}</strong> of 6
            </span>
          )}
        </div>
      </div>

      {/* Horizontal Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
        {WORKFLOW_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex || (idx === currentIndex && currentKey === 'CLOSED');
          const isCurrent = idx === currentIndex && currentKey !== 'CLOSED';
          const isUpcoming = idx > currentIndex;

          const audit = getStageAudit(stage.key);
          const timeStr = audit?.timestamp
            ? new Date(audit.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })
            : null;

          return (
            <div
              key={stage.key}
              className={`p-2.5 rounded-lg border transition-all flex flex-col justify-between ${
                isCompleted
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : isCurrent
                  ? 'bg-blue-50/80 border-gov-blue ring-1 ring-gov-blue/30 text-gov-navy'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold font-mono text-slate-400">
                  0{idx + 1}
                </span>
                {isCompleted ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                    <Check size={11} strokeWidth={3} />
                  </span>
                ) : isCurrent ? (
                  <span className="w-4 h-4 rounded-full bg-gov-blue text-white flex items-center justify-center text-[9px] font-bold animate-pulse">
                    ●
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[9px]">
                    ○
                  </span>
                )}
              </div>

              <div>
                <div
                  className={`text-xs font-bold leading-tight ${
                    isCompleted
                      ? 'text-emerald-900'
                      : isCurrent
                      ? 'text-gov-blue'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {stage.desc}
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-200/50 text-[10px]">
                {isCompleted && timeStr ? (
                  <span className="text-emerald-700 font-medium">✓ {timeStr}</span>
                ) : isCurrent ? (
                  <span className="text-gov-blue font-bold">In Progress</span>
                ) : (
                  <span className="text-slate-400">Pending</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Authorized context info: Department & Assigned officer */}
      {(assignedDepartment || assignedOfficer || currentKey === 'SUBMITTED' || currentKey === 'UNDER_REVIEW') && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200">
          <div>
            <span className="text-slate-400">Department:</span>{' '}
            <strong className="text-gov-navy">{assignedDepartment || 'Municipal Redressal Cell'}</strong>
          </div>
          <div>
            <span className="text-slate-400">Field Officer:</span>{' '}
            {assignedOfficer ? (
              <strong className="text-gov-navy">{assignedOfficer}</strong>
            ) : (
              <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[11px]">
                Awaiting Officer Assignment
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
