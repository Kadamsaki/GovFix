import React from 'react';
import { ShieldCheck, Cpu, Users, Clock, CheckCircle } from 'lucide-react';

const pillarIcons = [Users, Cpu, Clock];

export default function AboutSection({ t }) {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-gov-blue text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck size={14} />
            <span>{t.aboutTag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gov-navy tracking-tight">
            {t.aboutTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t.aboutDesc}
          </p>
        </div>

        {/* 3 Impact Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.aboutPillars.map((pillar, index) => {
            const Icon = pillarIcons[index] || Users;
            const iconBg =
              index === 0
                ? 'bg-blue-100 text-gov-blue'
                : index === 1
                ? 'bg-purple-100 text-purple-700'
                : 'bg-emerald-100 text-emerald-800';

            return (
              <div
                key={index}
                className="bg-gov-bg rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-gov-blue transition-all"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 font-bold ${iconBg}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gov-navy mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs font-semibold text-gov-navy flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600" />
                  <span>{pillar.badge}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
