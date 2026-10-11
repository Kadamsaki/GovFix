import React from 'react';
import {
  ShieldAlert,
  Clock,
  TrendingUp,
  FileCheck,
  UserCheck,
  MapPin,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Award,
} from 'lucide-react';

const pillarIcons = [
  Clock,
  Clock,
  TrendingUp,
  FileCheck,
  UserCheck,
];

export default function TransparencySection({ t }) {
  return (
    <section id="transparency" className="py-16 sm:py-20 bg-white border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-gov-teal text-xs font-bold uppercase tracking-wider mb-3">
            <Award size={14} />
            <span>Public Accountability Standards</span>
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

          {/* 6th Box: Citizen Audit Charter */}
          <div className="bg-gradient-to-br from-gov-navy to-slate-900 text-white rounded-xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-sky-400 flex items-center justify-center mb-4">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Citizen Social Audit
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Aggregated ward resolution data and department performance rankings are publicly accessible every 30 days.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/80 text-[11px] text-sky-300 font-semibold">
              Open Public Data Compliant
            </div>
          </div>
        </div>

        {/* Visual Sample Complaint-Tracking Timeline */}
        <div id="sample-timeline" className="bg-slate-50 rounded-2xl border-2 border-slate-300/80 p-6 sm:p-8 shadow-gov">
          
          {/* Header of Mock Timeline Card */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-gov-blue mb-2">
                <span>{t.sampleTimelineBadge}</span>
              </div>
              <h3 className="text-xl font-bold text-gov-navy flex items-center gap-2">
                <span>{t.sampleComplaintNumber}</span>
                <span className="text-xs px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {t.sampleStatus}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" />
                <span>{t.sampleWard}</span>
              </p>
            </div>

            {/* Officer & SLA Summary Chips */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">Assigned Officer</div>
                <div className="font-semibold text-gov-navy">{t.sampleOfficer}</div>
              </div>
              <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">SLA Performance</div>
                <div className="font-semibold text-emerald-700">{t.sampleSla}</div>
              </div>
            </div>
          </div>

          {/* Stepper Timeline Events */}
          <div className="mt-8 relative">
            <div className="hidden md:block absolute left-4 top-3 bottom-3 w-0.5 bg-slate-300" />

            <div className="space-y-6">
              {t.timelineEvents.map((evt, idx) => (
                <div key={idx} className="relative flex flex-col md:flex-row md:items-start gap-4 pl-0 md:pl-10">
                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute left-2.5 -translate-x-1/2 top-1 w-4 h-4 rounded-full bg-gov-blue border-4 border-white shadow-sm items-center justify-center z-10" />

                  {/* Timestamp Box */}
                  <div className="md:w-36 shrink-0 text-xs font-mono font-bold text-slate-500 bg-white md:bg-transparent px-2 py-1 md:p-0 rounded border md:border-0 border-slate-200 w-fit">
                    {evt.time}
                  </div>

                  {/* Content Box */}
                  <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-gov-navy flex items-center gap-2">
                      <CheckCircle size={15} className="text-emerald-600" />
                      <span>{evt.title}</span>
                    </h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {evt.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
