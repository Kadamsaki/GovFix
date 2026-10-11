import React from 'react';
import {
  Trash2,
  Droplets,
  AlertTriangle,
  Lightbulb,
  Waves,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const serviceIcons = {
  garbage: Trash2,
  water: Droplets,
  roads: AlertTriangle,
  streetlights: Lightbulb,
  drainage: Waves,
};

const serviceCategoryCodes = {
  garbage: "CIV-SAN-01",
  water: "CIV-WAT-02",
  roads: "CIV-ROD-03",
  streetlights: "CIV-ELE-04",
  drainage: "CIV-DRN-05",
};

export default function ServicesSection({ t, onOpenRegister }) {
  return (
    <section id="services" className="py-16 sm:py-20 bg-white border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-gov-navy text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck size={14} className="text-gov-blue" />
            <span>{t.servicesTag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gov-navy tracking-tight">
            {t.servicesTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* 5 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.services.map((service, index) => {
            const Icon = serviceIcons[service.id] || Trash2;
            const code = serviceCategoryCodes[service.id] || `CIV-0${index + 1}`;

            return (
              <div
                key={service.id}
                className="group bg-gov-bg rounded-xl border border-slate-200/90 p-6 flex flex-col justify-between hover:bg-white hover:border-gov-blue hover:shadow-gov transition-all duration-200"
              >
                <div>
                  {/* Top Header in Card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 text-gov-blue flex items-center justify-center group-hover:bg-gov-blue group-hover:text-white transition-colors">
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                      {code}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg font-bold text-gov-navy group-hover:text-gov-blue transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                {/* Card CTA Action */}
                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => onOpenRegister(service.title)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gov-blue group-hover:text-gov-blueHover group-hover:underline cursor-pointer"
                  >
                    <span>{t.btnReportIssue}</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <span className="text-[11px] font-medium text-slate-400">
                    {t.serviceSlaGeneral}
                  </span>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Other / General Municipal Inquiries */}
          <div className="bg-gradient-to-br from-slate-900 to-gov-navy text-white rounded-xl p-6 flex flex-col justify-between border border-slate-800 shadow-sm">
            <div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-sky-300">
                CIV-GEN-ALL
              </span>
              <h3 className="text-lg font-bold text-white mt-4">
                {t.otherCivicTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                {t.otherCivicDesc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => onOpenRegister(t.otherCivicTitle)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300 cursor-pointer"
              >
                <span>{t.btnReportIssue}</span>
                <ArrowRight size={15} />
              </button>
              <span className="text-[11px] text-slate-400">{t.serviceSlaExtended}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
