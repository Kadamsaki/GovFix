import React from 'react';
import { Phone, Globe, HelpCircle } from 'lucide-react';

export default function TopGovernmentBar({
  currentLang,
  onLanguageChange,
  fontScale,
  onFontScaleChange,
  t,
  onOpenHelp,
}) {
  return (
    <div className="w-full bg-gov-navy text-white text-xs border-b border-slate-700/60 no-print">
      {/* Subtle National Tricolor Top Ribbon */}
      <div className="gov-tricolor-bar w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Initiative Banner */}
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-block w-2 h-2 rounded-full bg-gov-saffron animate-pulse" />
            <span className="font-medium text-slate-200 tracking-wide">
              {t.initiativeText}
            </span>
          </div>

          {/* Right Tools: Helpline, Accessibility, Language */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-5">
            {/* Helpline */}
            <div className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors">
              <Phone size={13} className="text-gov-saffron" />
              <span className="font-semibold">{t.helplineText}</span>
            </div>

            {/* Support link */}
            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <HelpCircle size={13} className="text-emerald-400" />
              <span>{t.contactSupport}</span>
            </button>

            {/* Accessibility: Font Resizing (A- A A+) */}
            <div className="flex items-center bg-slate-800/80 rounded px-1.5 py-0.5 border border-slate-700">
              <span className="text-[11px] text-slate-400 mr-1.5 hidden md:inline">
                {t.accessibility}:
              </span>
              <button
                onClick={() => onFontScaleChange('sm')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  fontScale === 'sm'
                    ? 'bg-gov-blue text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                onClick={() => onFontScaleChange('base')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors mx-0.5 ${
                  fontScale === 'base'
                    ? 'bg-gov-blue text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => onFontScaleChange('lg')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  fontScale === 'lg'
                    ? 'bg-gov-blue text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* Prominent Working Language Selector */}
            <div className="relative flex items-center bg-slate-800/90 rounded px-2 py-1 border border-slate-600">
              <Globe size={13} className="text-sky-400 mr-1.5" />
              <label htmlFor="gov-language-select" className="sr-only">
                {t.selectLanguage}
              </label>
              <select
                id="gov-language-select"
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-slate-900 text-white">
                  English
                </option>
                <option value="hi" className="bg-slate-900 text-white">
                  हिंदी (Hindi)
                </option>
                <option value="mr" className="bg-slate-900 text-white">
                  मराठी (Marathi)
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
