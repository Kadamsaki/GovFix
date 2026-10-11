import React, { useState, useEffect } from 'react';
import { translations } from './translations/translations';
import TopGovernmentBar from './components/TopGovernmentBar';
import MainNavbar from './components/MainNavbar';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import AboutSection from './components/AboutSection';
import HowItWorksSection from './components/HowItWorksSection';
import TransparencySection from './components/TransparencySection';
import CitizenInfoSection from './components/CitizenInfoSection';
import Footer from './components/Footer';
import RegisterComplaintModal from './components/RegisterComplaintModal';
import CitizenLoginModal from './components/CitizenLoginModal';
import CitizenDashboardView from './components/CitizenDashboardView';
import HelpdeskModal from './components/HelpdeskModal';
import { User, LogOut, LayoutDashboard } from 'lucide-react';

export default function App() {
  // Navigation View: 'portal' | 'dashboard'
  const [currentView, setCurrentView] = useState('portal');

  // State for Language: 'en' | 'hi' | 'mr'
  const [currentLang, setCurrentLang] = useState('en');

  // State for Font Scale: 'sm' | 'base' | 'lg'
  const [fontScale, setFontScale] = useState('base');
  const [fontToast, setFontToast] = useState(null);

  // Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isHelpdeskOpen, setIsHelpdeskOpen] = useState(false);

  // Tracked complaint ID for timeline demonstration
  const [trackedComplaintId, setTrackedComplaintId] = useState('GFX-2026-3109');

  // Citizen Authentication State
  const [citizenUser, setCitizenUser] = useState(null);

  // Active Translations
  const t = translations[currentLang] || translations.en;

  // Apply root font-size to <html> element to make Zoom in / Zoom out genuinely scale all rem-based typography and layout
  useEffect(() => {
    const sizeMap = {
      sm: '14px',
      base: '16px',
      lg: '18.5px',
    };
    const scaleTextMap = {
      sm: 'A- (87.5%)',
      base: 'A (100% Normal)',
      lg: 'A+ (115% Zoomed)',
    };
    const targetSize = sizeMap[fontScale] || '16px';
    document.documentElement.style.fontSize = targetSize;

    // Show temporary feedback toast
    setFontToast(`${t.textSizeNotice} ${scaleTextMap[fontScale]}`);
    const timer = setTimeout(() => {
      setFontToast(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [fontScale, t]);

  // Handlers
  const handleOpenRegister = (categoryName = '') => {
    setSelectedServiceCategory(categoryName);
    setIsRegisterOpen(true);
  };

  const handleTrackComplaint = (id) => {
    setTrackedComplaintId(id);
    if (currentView === 'dashboard') {
      // If on dashboard, switch back to portal to see public tracking or stay on dashboard
      setCurrentView('portal');
    }
    setTimeout(() => {
      const timelineEl = document.getElementById('sample-timeline');
      if (timelineEl) {
        timelineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Visual feedback highlight
        timelineEl.classList.add('ring-4', 'ring-gov-blue/50');
        setTimeout(() => {
          timelineEl.classList.remove('ring-4', 'ring-gov-blue/50');
        }, 2500);
      }
    }, 100);
  };

  const handleLoginSuccess = (user) => {
    setCitizenUser(user);
    // Upon login, open the FULL PROPER CITIZEN DASHBOARD!
    setCurrentView('dashboard');
  };

  const handleSignOut = () => {
    setCitizenUser(null);
    setCurrentView('portal');
  };

  const langFontClass = currentLang === 'en' ? 'font-sans' : 'font-devanagari';

  return (
    <div className={`min-h-screen bg-gov-bg text-gov-text ${langFontClass} flex flex-col selection:bg-gov-blue selection:text-white relative`}>
      
      {/* Font Size Feedback Toast */}
      {fontToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gov-navy text-white text-xs px-3.5 py-2 rounded-lg shadow-xl border border-slate-700 animate-fadeIn font-semibold">
          {fontToast}
        </div>
      )}

      {/* RENDER FULL CITIZEN DASHBOARD VIEW WHEN LOGGED IN AND ON 'dashboard' */}
      {currentView === 'dashboard' && citizenUser ? (
        <CitizenDashboardView
          citizenUser={citizenUser}
          onBackToPortal={() => setCurrentView('portal')}
          onSignOut={handleSignOut}
          onOpenRegister={handleOpenRegister}
          t={t}
        />
      ) : (
        /* RENDER PUBLIC CITIZEN PORTAL HOMEPAGE */
        <>
          {/* Top Government Bar */}
          <TopGovernmentBar
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
            fontScale={fontScale}
            onFontScaleChange={setFontScale}
            t={t}
            onOpenHelp={() => setIsHelpdeskOpen(true)}
          />

          {/* Main Official Navbar */}
          <MainNavbar
            t={t}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenRegister={handleOpenRegister}
            citizenUser={citizenUser}
            onOpenDashboard={() => setCurrentView('dashboard')}
          />

          {/* Citizen Logged-in Notice Banner (When on homepage) */}
          {citizenUser && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs text-emerald-800 flex items-center justify-between max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-2">
                <User size={14} className="text-emerald-600" />
                <span>
                  {t.signedInAs} <strong>{citizenUser.name}</strong> (+91 {citizenUser.mobile}) • {citizenUser.ward}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="inline-flex items-center gap-1 font-bold text-gov-blue hover:underline cursor-pointer"
                >
                  <LayoutDashboard size={13} />
                  <span>Open Citizen Dashboard</span>
                </button>
                <span>•</span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1 font-semibold text-emerald-900 hover:underline cursor-pointer"
                >
                  <LogOut size={12} />
                  <span>{t.btnSignOut}</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Content Sections */}
          <main className="flex-1">
            {/* 1. Hero Section */}
            <HeroSection
              t={t}
              onOpenRegister={handleOpenRegister}
              onTrackComplaint={handleTrackComplaint}
            />

            {/* 2. Important Citizen Services */}
            <ServicesSection
              t={t}
              onOpenRegister={handleOpenRegister}
            />

            {/* 3. About GovFix Civic Platform */}
            <AboutSection t={t} />

            {/* 4. How GovFix Works */}
            <HowItWorksSection t={t} />

            {/* 5. Transparency & Accountability (Dynamic Timelines!) */}
            <TransparencySection
              t={t}
              trackedComplaintId={trackedComplaintId}
            />

            {/* 6. Citizen Guide, Notices & FAQ */}
            <CitizenInfoSection
              t={t}
              onOpenRegister={handleOpenRegister}
              onTrackComplaint={handleTrackComplaint}
            />
          </main>

          {/* Government Footer */}
          <Footer
            t={t}
            onOpenRegister={handleOpenRegister}
            onTrackComplaint={handleTrackComplaint}
          />
        </>
      )}

      {/* Modals Accessible from Any View */}
      <RegisterComplaintModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        initialCategory={selectedServiceCategory}
        onComplaintCreated={(id) => handleTrackComplaint(id)}
        t={t}
      />

      <CitizenLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        t={t}
      />

      <HelpdeskModal
        isOpen={isHelpdeskOpen}
        onClose={() => setIsHelpdeskOpen(false)}
        t={t}
      />

    </div>
  );
}
