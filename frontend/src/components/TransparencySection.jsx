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

export default function TransparencySection({ t }) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      </div>
    </section>
  );
}
