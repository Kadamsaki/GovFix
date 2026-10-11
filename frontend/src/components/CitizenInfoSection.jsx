import React, { useState } from 'react';
import {
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  BookOpen,
  Search,
  PhoneCall,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export default function CitizenInfoSection({
  t,
  onOpenRegister,
  onTrackComplaint,
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  return (
    <section id="citizen-info" className="py-16 sm:py-20 bg-gov-bg border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-gov-navy text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen size={14} className="text-gov-blue" />
            <span>Citizen Resource Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gov-navy tracking-tight">
            {t.citizenInfoTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t.citizenInfoSubtitle}
          </p>
        </div>

        {/* Official Citizen Privacy & Security Notice */}
        <div className="mb-12 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-amber-900">
                {t.noticeHeading}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-amber-800 leading-relaxed font-medium">
                {t.noticeBody}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Content: Quick Access Links & Interactive FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick-Access Links Column */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-gov-navy flex items-center gap-2">
              <FileText size={18} className="text-gov-blue" />
              <span>{t.quickLinksTitle}</span>
            </h3>

            {/* Link 1: How to Register */}
            <div
              onClick={() => onOpenRegister()}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-gov-blue hover:shadow cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-gov-blue flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gov-navy group-hover:text-gov-blue transition-colors">
                    How to Register a Complaint
                  </h4>
                  <p className="text-xs text-slate-500">
                    Step-by-step guidance on submitting grievance details with photos
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className="-rotate-90 text-slate-400 group-hover:text-gov-blue transition-colors" />
            </div>

            {/* Link 2: Track Existing Complaint */}
            <div
              onClick={() => onTrackComplaint('GFX-2026-8942')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-gov-blue hover:shadow cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-gov-teal flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gov-navy group-hover:text-gov-teal transition-colors">
                    Track Existing Complaint
                  </h4>
                  <p className="text-xs text-slate-500">
                    Check current stage, assigned officer, and estimated resolution SLA
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className="-rotate-90 text-slate-400 group-hover:text-gov-teal transition-colors" />
            </div>

            {/* Link 3: Contact Support */}
            <div
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-gov-navy hover:shadow cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-gov-navy flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gov-navy group-hover:text-gov-blue transition-colors">
                    Contact Support &amp; Ward Helpline
                  </h4>
                  <p className="text-xs text-slate-500">
                    Toll-free numbers and zonal municipal contact directory
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className="-rotate-90 text-slate-400 group-hover:text-gov-navy transition-colors" />
            </div>

            {/* Security Assurance Card */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-700 shrink-0" />
              <span>Complaints are safeguarded with public record tamper-evidence and data protection guidelines.</span>
            </div>
          </div>

          {/* Interactive FAQ Column */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-lg font-bold text-gov-navy flex items-center gap-2 mb-4">
              <HelpCircle size={18} className="text-gov-blue" />
              <span>{t.faqTitle}</span>
            </h3>

            {t.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm text-gov-navy hover:text-gov-blue transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-gov-blue' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4.5 pb-4.5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
