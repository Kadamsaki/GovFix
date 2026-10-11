import React from 'react';
import { ShieldCheck, Cpu, Users, BarChart3, Clock, CheckCircle } from 'lucide-react';

export default function AboutSection({ t }) {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-gov-blue text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck size={14} />
            <span>Civic Mission &amp; Purpose</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gov-navy tracking-tight">
            About GovFix Platform
          </h2>
          <p className="mt-3 text-base text-slate-600">
            GovFix bridges the critical gap between citizens and municipal bodies by modernizing public grievance redressal into an intelligent, transparent, and time-bound civic resolution system.
          </p>
        </div>

        {/* 3 Impact Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="bg-gov-bg rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-gov-blue flex items-center justify-center mb-5 font-bold">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-gov-navy mb-2">
                Citizen-Centric Access
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Simple, accessible reporting for every citizen across English, Hindi, and Marathi. Submit grievances in under 60 seconds with photos and geo-location.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs font-semibold text-gov-blue flex items-center gap-1">
              <CheckCircle size={14} />
              <span>Zero Technical Friction</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-gov-bg rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5 font-bold">
                <Cpu size={24} />
              </div>
              <h3 className="text-lg font-bold text-gov-navy mb-2">
                AI-Powered Triage &amp; Routing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Eliminate bureaucratic delays with automated classification. AI accurately categorizes grievances, tags jurisdictional wards, and detects duplicate complaints.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs font-semibold text-purple-700 flex items-center gap-1">
              <CheckCircle size={14} />
              <span>Instant Ward Dispatch</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-gov-bg rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5 font-bold">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-gov-navy mb-2">
                Enforceable SLAs &amp; Accountability
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every grievance is time-stamped with clear Citizen Charter deadlines. Automatic alerts notify senior municipal officers if maintenance is delayed.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle size={14} />
              <span>Verified Photo Resolution</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
