import React, { useState } from 'react';
import {
  FilePlus,
  Search,
  CheckCircle2,
  Clock,
  Shield,
  Activity,
  ArrowRight,
  Sparkles,
  Building2,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export default function HeroSection({
  t,
  onOpenRegister,
  onTrackComplaint,
}) {
  const [trackingId, setTrackingId] = useState('');

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      onTrackComplaint(trackingId.trim());
    } else {
      onTrackComplaint('GFX-2026-8942');
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-b from-white via-gov-bg to-slate-100 border-b border-gov-border pt-8 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#142B4A_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Official Messaging & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* National / Municipal Initiative Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-gov-blue text-xs font-semibold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gov-blue animate-pulse" />
              <span>{t.heroBadge}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">Digital India Civic Vision</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gov-navy tracking-tight leading-[1.2]">
              {t.heroHeading}
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-normal">
              {t.heroSubtext}
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={() => onOpenRegister()}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-base font-semibold text-white bg-gov-blue hover:bg-gov-blueHover shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <FilePlus size={19} />
                <span>{t.btnHeroRegister}</span>
              </button>

              <button
                onClick={() => onTrackComplaint('GFX-2026-8942')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-base font-semibold text-gov-navy bg-white hover:bg-slate-50 border border-slate-300 shadow-sm hover:shadow transition-all"
              >
                <Search size={19} className="text-gov-blue" />
                <span>{t.btnHeroTrack}</span>
              </button>
            </div>

            {/* Quick Track Input Bar */}
            <form
              onSubmit={handleTrackSubmit}
              className="mt-4 p-2 bg-white rounded-lg border border-slate-300 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl"
            >
              <div className="flex items-center gap-2 px-2.5 flex-1 text-slate-500">
                <Search size={16} className="text-gov-blue shrink-0" />
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder={t.quickTrackPlaceholder}
                  className="w-full text-xs sm:text-sm text-gov-text placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-gov-navy hover:bg-slate-800 text-white rounded text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>{t.btnQuickTrack}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Trust Indicator Pill */}
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Shield size={16} className="text-gov-teal shrink-0" />
              <span>{t.trustIndicator}</span>
            </div>

          </div>

          {/* Right Column: Municipal Command Dashboard Visual */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-gov-lg overflow-hidden">
              {/* Dashboard Top Header */}
              <div className="bg-gov-navy text-white px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-blue-600/40 border border-blue-400/30 flex items-center justify-center">
                    <Activity size={15} className="text-sky-300" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold tracking-wide uppercase text-slate-200">
                      {t.dashboardTitle}
                    </h3>
                    <p className="text-[11px] text-sky-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                      {t.statLiveStatus}
                    </p>
                  </div>
                </div>

                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                  24/7 ACTIVE
                </span>
              </div>

              {/* Real-Time Live Metrics Grid */}
              <div className="p-5 space-y-4 bg-slate-50/70">
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Resolution Rate */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                      <span>{t.statResolutionRate}</span>
                      <TrendingUp size={14} className="text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-gov-navy">94.2%</div>
                    <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      +3.8% faster than SLA
                    </div>
                  </div>

                  {/* Avg SLA */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                      <span>{t.statAvgSla}</span>
                      <Clock size={14} className="text-gov-blue" />
                    </div>
                    <div className="text-2xl font-black text-gov-navy">31.4 <span className="text-xs font-semibold text-slate-500">hrs</span></div>
                    <div className="text-[11px] text-sky-700 font-medium mt-0.5">
                      Standard: 48-72 hrs
                    </div>
                  </div>

                  {/* Active Wards */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                      <span>{t.statActiveWards}</span>
                      <Building2 size={14} className="text-purple-600" />
                    </div>
                    <div className="text-2xl font-black text-gov-navy">48 <span className="text-xs font-semibold text-slate-500">wards</span></div>
                    <div className="text-[11px] text-purple-700 font-medium mt-0.5">
                      100% Ward Coverage
                    </div>
                  </div>

                  {/* Resolved Cases */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                      <span>{t.statResolvedToday}</span>
                      <CheckCircle2 size={14} className="text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-gov-navy">18,490+</div>
                    <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      Verified by citizens
                    </div>
                  </div>

                </div>

                {/* Live Triage Card Preview */}
                <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={13} className="text-gov-blue" />
                      Latest AI Triage &amp; Dispatch
                    </span>
                    <span className="text-[10px] text-slate-400">Just now</span>
                  </div>

                  <div className="mt-2.5 flex items-start gap-3 text-xs">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-gov-blue flex items-center justify-center shrink-0 font-bold">
                      #14
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gov-navy truncate">
                          Water Main Leakage - Ward 14
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          In Progress
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5 truncate flex items-center gap-1">
                        <MapPin size={11} className="text-slate-400" />
                        Station Road • Er. Rajesh Sharma dispatched
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
