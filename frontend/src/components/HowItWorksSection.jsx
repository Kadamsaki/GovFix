import React from 'react';
import {
  FileText,
  Cpu,
  UserCheck,
  CheckCircle2,
  ThumbsUp,
  Workflow,
} from 'lucide-react';

const stepIcons = [
  FileText,
  Cpu,
  UserCheck,
  CheckCircle2,
  ThumbsUp,
];

export default function HowItWorksSection({ t }) {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-gov-bg border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-gov-blue text-xs font-bold uppercase tracking-wider mb-3">
            <Workflow size={14} />
            <span>{t.howItWorksTag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gov-navy tracking-tight">
            {t.howItWorksTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t.howItWorksSubtitle}
          </p>
        </div>

        {/* 5-Step Connecting Layout */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-slate-300 -translate-y-8 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {t.steps.map((step, index) => {
              const Icon = stepIcons[index] || FileText;

              return (
                <div
                  key={step.number}
                  className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-gov-blue transition-all group"
                >
                  <div>
                    {/* Step Number & Icon Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-gov-blue flex items-center justify-center group-hover:bg-gov-blue group-hover:text-white transition-colors shadow-sm">
                        <Icon size={22} />
                      </div>
                      <span className="text-xl font-black text-slate-300 font-mono group-hover:text-gov-blue transition-colors">
                        {step.number}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-base font-bold text-gov-navy group-hover:text-gov-blue transition-colors">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Step Footer Badge */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>{t.phaseLabel} {index + 1}</span>
                    <span className="text-gov-teal">{t.statusVerified}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom SLA Assurance Callout */}
        <div className="mt-12 bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
              ✓
            </div>
            <div>
              <h4 className="text-sm font-bold text-gov-navy">
                {t.slaGuaranteeTitle}
              </h4>
              <p className="text-xs text-slate-600">
                {t.slaGuaranteeDesc}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-gov-blue">
            <span>{t.slaGuaranteeBadge}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
