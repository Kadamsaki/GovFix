import React, { useState } from 'react';
import { Shield, Menu, X, User, FilePlus, LogOut, LayoutDashboard } from 'lucide-react';

export default function MainNavbar({
  t,
  onOpenLogin,
  onOpenRegister,
  currentUser,
  citizenUser,
  onOpenDashboard,
  onSignOut,
}) {
  const activeUser = currentUser || citizenUser;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gov-border shadow-gov-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Civic Emblem */}
          <div
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            {/* Civic Emblem Badge */}
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gov-navy to-gov-blue flex items-center justify-center text-white shadow-md border border-slate-200 group-hover:shadow-lg transition-shadow">
              <Shield size={26} className="text-white drop-shadow" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold text-gov-navy tracking-tight">
                  Gov<span className="text-gov-blue">Fix</span>
                </span>
                <span className="bg-sky-100 text-gov-blue text-[10px] font-bold px-1.5 py-0.5 rounded border border-sky-200 uppercase tracking-wider">
                  AI-Redressal
                </span>
              </div>
              <p className="text-xs text-gov-muted font-medium">
                {t.portalSubtitle}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 font-medium text-xs xl:text-sm text-gov-text ml-6 xl:ml-8 mr-auto shrink-0">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gov-navy font-semibold hover:text-gov-blue transition-colors py-1 border-b-2 border-transparent hover:border-gov-blue cursor-pointer whitespace-nowrap"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gov-muted hover:text-gov-blue transition-colors py-1 border-b-2 border-transparent hover:border-gov-blue cursor-pointer whitespace-nowrap"
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-gov-muted hover:text-gov-blue transition-colors py-1 border-b-2 border-transparent hover:border-gov-blue cursor-pointer whitespace-nowrap"
            >
              {t.navServices}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-gov-muted hover:text-gov-blue transition-colors py-1 border-b-2 border-transparent hover:border-gov-blue cursor-pointer whitespace-nowrap"
            >
              {t.navHowItWorks}
            </button>
            <button
              onClick={() => scrollToSection('transparency')}
              className="text-gov-muted hover:text-gov-blue transition-colors py-1 border-b-2 border-transparent hover:border-gov-blue cursor-pointer whitespace-nowrap"
            >
              {t.navTransparency}
            </button>
            <button
              onClick={() => scrollToSection('citizen-info')}
              className="text-gov-muted hover:text-gov-blue transition-colors py-1 border-b-2 border-transparent hover:border-gov-blue cursor-pointer whitespace-nowrap"
            >
              {t.navCitizenInfo}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gov-muted hover:text-gov-blue transition-colors py-1 border-b-2 border-transparent hover:border-gov-blue cursor-pointer whitespace-nowrap"
            >
              {t.navContact}
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0 ml-6 pl-6 border-l border-slate-200">
            {activeUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenDashboard}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-gov-navy bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                  title="Open Municipal Dashboard"
                >
                  <div className="w-6 h-6 rounded-full bg-gov-navy text-white flex items-center justify-center text-[10px] font-bold">
                    {activeUser.name?.charAt(0) || 'U'}
                  </div>
                  <span>{activeUser.name}</span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-mono uppercase font-bold">
                    {activeUser.role}
                  </span>
                  <LayoutDashboard size={13} className="text-gov-blue ml-1" />
                </button>
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold text-gov-navy bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all hover:shadow-sm cursor-pointer whitespace-nowrap"
              >
                <User size={15} className="text-gov-navy" />
                <span>{t.btnLogin}</span>
              </button>
            )}

            {/* Register Complaint CTA */}
            <button
              onClick={() => onOpenRegister()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-white bg-gov-blue hover:bg-gov-blueHover shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
            >
              <FilePlus size={16} />
              <span>{t.btnRegister}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onOpenRegister()}
              className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white bg-gov-blue hover:bg-gov-blueHover"
            >
              <FilePlus size={14} />
              <span>{t.btnRegister}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gov-navy hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gov-border shadow-lg px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium">
            <button
              onClick={() => scrollToSection('home')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-gov-navy font-semibold"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-gov-text"
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-gov-text"
            >
              {t.navServices}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-gov-text"
            >
              {t.navHowItWorks}
            </button>
            <button
              onClick={() => scrollToSection('transparency')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-gov-text"
            >
              {t.navTransparency}
            </button>
            <button
              onClick={() => scrollToSection('citizen-info')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-gov-text"
            >
              {t.navCitizenInfo}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-gov-text"
            >
              {t.navContact}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {activeUser ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDashboard();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold text-gov-navy bg-slate-100 border border-slate-300"
                >
                  <LayoutDashboard size={16} />
                  <span>{activeUser.name} ({activeUser.role.toUpperCase()} Dashboard)</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignOut && onSignOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200"
                >
                  <LogOut size={14} />
                  <span>{t.btnSignOut || 'Sign Out'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold text-gov-navy bg-slate-100 hover:bg-slate-200 border border-slate-300"
              >
                <User size={16} />
                <span>{t.btnLogin}</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold text-white bg-gov-blue hover:bg-gov-blueHover shadow"
            >
              <FilePlus size={16} />
              <span>{t.btnRegister}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
