import React from 'react';
import { Shield, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

export default function Footer({ t, onOpenRegister }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-gov-navy text-slate-300 text-xs border-t-4 border-gov-blue">
      {/* Tricolor accent bar */}
      <div className="gov-tricolor-bar w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main 4-Column Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-700/80">
          
          {/* Col 1: Brand & Municipal Overview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gov-blue text-white flex items-center justify-center font-bold shadow-md">
                <Shield size={22} />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Gov<span className="text-sky-400">Fix</span>
                </span>
                <p className="text-[11px] text-slate-400 font-medium">
                  {t.portalSubtitle}
                </p>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed pr-2">
              {t.footerDesc}
            </p>

            <div className="space-y-2 pt-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gov-saffron shrink-0" />
                <span>{t.footerTollFree}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-sky-400 shrink-0" />
                <span>{t.footerHelpdeskEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-400 shrink-0" />
                <span>{t.footerHQAddress}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-b border-slate-700 pb-2">
              {t.quickLinksHeader}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="hover:text-white transition-colors"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="hover:text-white transition-colors"
                >
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  {t.navHowItWorks}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('transparency')}
                  className="hover:text-white transition-colors"
                >
                  {t.navTransparency}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('citizen-info')}
                  className="hover:text-white transition-colors"
                >
                  {t.navCitizenInfo}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-b border-slate-700 pb-2">
              {t.servicesHeader}
            </h4>
            <ul className="space-y-2 text-slate-400">
              {t.services.map((svc) => (
                <li key={svc.id}>
                  <button
                    onClick={() => onOpenRegister(svc.title)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {svc.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Help, Accessibility & Policies */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-b border-slate-700 pb-2">
              {t.accessibilityHeader}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#accessibility" className="hover:text-white transition-colors">
                  {t.policyAccessibility}
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  {t.policyPrivacy}
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  {t.policyTerms}
                </a>
              </li>
              <li>
                <a href="#charter" className="hover:text-white transition-colors">
                  {t.policyCharter}
                </a>
              </li>
              <li>
                <a href="#hyperlink" className="hover:text-white transition-colors">
                  {t.policyHyperlink}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Mandatory Hackathon Prototype Disclaimer */}
        <div className="my-8 p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 flex items-start gap-3">
          <AlertCircle size={20} className="text-gov-saffron shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">
              {t.disclaimerHeading}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.footerDisclaimer}
            </p>
          </div>
        </div>

        {/* Bottom Copyright & Compliance */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <div>{t.copyright}</div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{t.footerContentManaged}</span>
            <span>•</span>
            <span>{t.footerWcag}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
