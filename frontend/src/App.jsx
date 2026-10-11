import React, { useState } from 'react';
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
import HelpdeskModal from './components/HelpdeskModal';
import { User, LogOut } from 'lucide-react';

export default function App() {
  // State for Language: 'en' | 'hi' | 'mr'
  const [currentLang, setCurrentLang] = useState('en');

  // State for Font Scale: 'sm' | 'base' | 'lg'
  const [fontScale, setFontScale] = useState('base');

  // Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isHelpdeskOpen, setIsHelpdeskOpen] = useState(false);

  // Citizen Authentication State (Mock)
  const [citizenUser, setCitizenUser] = useState(null);

  // Active Translations
  const t = translations[currentLang] || translations.en;

  // Handlers
  const handleOpenRegister = (categoryName = '') => {
    setSelectedServiceCategory(categoryName);
    setIsRegisterOpen(true);
  };

  const handleTrackComplaint = (id) => {
    const timelineEl = document.getElementById('sample-timeline');
    if (timelineEl) {
      timelineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Visual feedback highlight
      timelineEl.classList.add('ring-4', 'ring-gov-blue/50');
      setTimeout(() => {
        timelineEl.classList.remove('ring-4', 'ring-gov-blue/50');
      }, 2500);
    }
  };

  const fontScaleClass =
    fontScale === 'sm'
      ? 'font-scale-sm'
      : fontScale === 'lg'
      ? 'font-scale-lg'
      : 'font-scale-base';

  const langFontClass = currentLang === 'en' ? 'font-sans' : 'font-devanagari';

  return (
    <div className={`min-h-screen bg-gov-bg text-gov-text ${fontScaleClass} ${langFontClass} flex flex-col selection:bg-gov-blue selection:text-white`}>
      
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
      />

      {/* Citizen Logged-in Notice Banner */}
      {citizenUser && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs text-emerald-800 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <User size={14} className="text-emerald-600" />
            <span>
              Signed in as: <strong>{citizenUser.name}</strong> (+91 {citizenUser.mobile})
            </span>
          </div>
          <button
            onClick={() => setCitizenUser(null)}
            className="flex items-center gap-1 font-semibold text-emerald-900 hover:underline"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
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

        {/* 5. Transparency & Accountability */}
        <TransparencySection t={t} />

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

      {/* Modals */}
      <RegisterComplaintModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        initialCategory={selectedServiceCategory}
        onComplaintCreated={(id) => handleTrackComplaint(id)}
      />

      <CitizenLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => setCitizenUser(user)}
      />

      <HelpdeskModal
        isOpen={isHelpdeskOpen}
        onClose={() => setIsHelpdeskOpen(false)}
      />

    </div>
  );
}
