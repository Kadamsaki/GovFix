import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  TrendingUp,
  FileCheck,
  UserCheck,
  MapPin,
  CheckCircle,
  Award,
  Activity,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { mockComplaintsData } from '../data/mockComplaints';

const pillarIcons = [
  Clock,
  Clock,
  TrendingUp,
  FileCheck,
  UserCheck,
];

export default function TransparencySection({ t, trackedComplaintId }) {
  const [activeComplaintId, setActiveComplaintId] = useState(
    trackedComplaintId || mockComplaintsData[0].id
  );

  // If a trackedComplaintId is passed or changes, use it
  const activeComplaint =
    mockComplaintsData.find((c) => c.id === (trackedComplaintId || activeComplaintId)) ||
    mockComplaintsData[0];

  return (
    <section id="transparency" className="py-16 sm:py-20 bg-white border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-gov-teal text-xs font-bold uppercase tracking-wider mb-3">
            <Award size={14} />
            <span>{t.transparencyTag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gov-navy tracking-tight">
            {t.transparencyTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t.transparencySubtitle}
          </p>
        </div>

        {/* 5 Accountability Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {t.pillars.map((pillar, index) => {
            const Icon = pillarIcons[index] || FileCheck;

            return (
              <div
                key={index}
                className="bg-gov-bg rounded-xl border border-slate-200/90 p-6 flex flex-col justify-start hover:border-gov-teal transition-all shadow-gov-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-100/70 text-gov-teal flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold text-gov-navy mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}

          {/* 6th Box: Citizen Social Audit */}
          <div className="bg-gradient-to-br from-gov-navy to-slate-900 text-white rounded-xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-sky-400 flex items-center justify-center mb-4">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {t.socialAuditTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.socialAuditDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/80 text-[11px] text-sky-300 font-semibold">
              {t.socialAuditBadge}
            </div>
          </div>
        </div>

        {/* Visual Dynamic Complaint-Tracking Demonstration */}
        <div id="sample-timeline" className="bg-slate-50 rounded-2xl border-2 border-slate-300/80 p-6 sm:p-8 shadow-gov transition-all">
          
          {/* Timeline Switcher Chips (Dynamic states: In Progress, Under Inspection, Resolved) */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gov-navy uppercase tracking-wide">
                Live Public Demonstrations:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {mockComplaintsData.map((c) => {
                const isSelected = c.id === activeComplaint.id;
                const statusBadge =
                  c.status === 'in_progress'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : c.status === 'assigned'
                    ? 'bg-sky-100 text-sky-900 border-sky-300'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300';

                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveComplaintId(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-gov-navy text-white border-gov-navy shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-mono">{c.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${statusBadge}`}>
                      {c.status === 'in_progress' ? 'In Progress' : c.status === 'assigned' ? 'Assigned' : 'Resolved'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Header of Active Complaint Demonstration */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-gov-blue">
                <span>Complaint ID: {activeComplaint.id}</span>
                <span>•</span>
                <span>{activeComplaint.category}</span>
              </div>
              <h3 className="text-xl font-bold text-gov-navy flex flex-wrap items-center gap-2">
                <span>{activeComplaint.title}</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    activeComplaint.status === 'in_progress'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : activeComplaint.status === 'assigned'
                      ? 'bg-sky-100 text-sky-800 border-sky-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}
                >
                  {activeComplaint.statusLabel}
                </span>
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" />
                <span>{activeComplaint.location} • {activeComplaint.ward}</span>
              </p>
            </div>

            {/* Officer & SLA Summary Chips */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">{t.assignedOfficerLabel}</div>
                <div className="font-semibold text-gov-navy">{activeComplaint.assignedOfficer}</div>
              </div>
              <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">{t.slaPerformanceLabel}</div>
                <div className="font-semibold text-emerald-700">{activeComplaint.slaStatusText}</div>
              </div>
            </div>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="py-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
              <span className="flex items-center gap-1.5 text-gov-navy">
                <Activity size={14} className="text-gov-blue" />
                Current Redressal Stage: Step {activeComplaint.currentStepIndex + 1} of 5
              </span>
              <span className="font-mono text-gov-blue">
                {activeComplaint.status === 'resolved'
                  ? 'All 5 Steps Completed'
                  : `Step ${activeComplaint.currentStepIndex + 1} In Action`}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((idx) => {
                const isDone = idx < activeComplaint.currentStepIndex || activeComplaint.status === 'resolved';
                const isCurrent = idx === activeComplaint.currentStepIndex && activeComplaint.status !== 'resolved';

                return (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      isDone
                        ? 'bg-emerald-500'
                        : isCurrent
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-slate-200'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Stepper Timeline Events */}
          <div className="mt-4 relative">
            <div className="hidden md:block absolute left-4 top-3 bottom-3 w-0.5 bg-slate-300" />

            <div className="space-y-5">
              {activeComplaint.timeline.map((evt, idx) => {
                const isDone = evt.completed;
                const isCurrent = evt.isActive;

                return (
                  <div key={idx} className="relative flex flex-col md:flex-row md:items-start gap-4 pl-0 md:pl-10">
                    {/* Timeline Dot */}
                    <div
                      className={`hidden md:flex absolute left-2.5 -translate-x-1/2 top-1 w-5 h-5 rounded-full border-2 items-center justify-center text-[10px] font-bold z-10 ${
                        isDone
                          ? 'bg-emerald-600 text-white border-white shadow-sm'
                          : isCurrent
                          ? 'bg-amber-500 text-white border-white ring-4 ring-amber-200 animate-pulse'
                          : 'bg-slate-200 text-slate-500 border-white'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </div>

                    {/* Timestamp Box */}
                    <div className="md:w-44 shrink-0 text-xs font-mono font-bold text-slate-500 bg-white md:bg-transparent px-2 py-1 md:p-0 rounded border md:border-0 border-slate-200 w-fit">
                      {evt.time}
                    </div>

                    {/* Content Box */}
                    <div
                      className={`flex-1 p-4 rounded-xl border shadow-sm ${
                        isCurrent
                          ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300'
                          : isDone
                          ? 'bg-white border-slate-200'
                          : 'bg-slate-100/60 border-slate-200 opacity-60'
                      }`}
                    >
                      <h4 className="text-sm font-bold text-gov-navy flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {isDone ? (
                            <CheckCircle size={15} className="text-emerald-600" />
                          ) : isCurrent ? (
                            <Activity size={15} className="text-amber-600 animate-spin" />
                          ) : (
                            <Clock size={15} className="text-slate-400" />
                          )}
                          <span>{evt.title}</span>
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                            Active Step
                          </span>
                        )}
                      </h4>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {evt.detail}
                      </p>
                      <div className="mt-2 text-[11px] text-slate-400 font-medium">
                        Action by: <strong className="text-slate-700">{evt.officer}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
