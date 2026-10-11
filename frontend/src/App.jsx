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
import HelpdeskModal from './components/HelpdeskModal';
import CitizenDashboardView from './components/CitizenDashboardView';
import OfficerDashboardView from './components/OfficerDashboardView';
import SupervisorDashboardView from './components/SupervisorDashboardView';
import AdminDashboardView from './components/AdminDashboardView';
import {
  User,
  LogOut,
  LayoutDashboard,
  Wrench,
  UserCheck,
  Building,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { loginUser } from './services/api';

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


  // Focus complaint ID in dashboard and refresh trigger
  const [focusedComplaintId, setFocusedComplaintId] = useState(null);
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);

  // Active Authenticated User (supports all 4 roles: citizen, officer, supervisor, admin)
  const [currentUser, setCurrentUser] = useState(null);

  // Active Translations
  const t = translations[currentLang] || translations.en;

  // Apply root font-size to <html> element
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

  // Called when a new complaint is registered
  const handleComplaintCreated = (newId) => {
    setFocusedComplaintId(newId);
    setDashboardRefreshKey((prev) => prev + 1);

    if (currentUser) {
      setCurrentView('dashboard');
    } else {
      // If citizen submitted while on homepage, sign in as default citizen to show their dashboard
      loginUser('citizen-1')
        .then((user) => {
          setCurrentUser(user);
          setCurrentView('dashboard');
        })
        .catch(() => {
          setCurrentView('dashboard');
        });
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
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

      {/* RENDER ROLE-SPECIFIC DASHBOARD VIEWS WHEN LOGGED IN AND ON 'dashboard' */}
      {currentView === 'dashboard' && currentUser ? (
        <>
          {currentUser.role === 'citizen' && (
            <CitizenDashboardView
              citizenUser={currentUser}
              onBackToPortal={() => setCurrentView('portal')}
              onSignOut={handleSignOut}
              onOpenRegister={handleOpenRegister}
              initialSelectedId={focusedComplaintId}
              refreshKey={dashboardRefreshKey}
              t={t}
            />
          )}

          {currentUser.role === 'officer' && (
            <OfficerDashboardView
              officerUser={currentUser}
              onBackToPortal={() => setCurrentView('portal')}
              onSignOut={handleSignOut}
              t={t}
            />
          )}

          {currentUser.role === 'supervisor' && (
            <SupervisorDashboardView
              supervisorUser={currentUser}
              onBackToPortal={() => setCurrentView('portal')}
              onSignOut={handleSignOut}
              t={t}
            />
          )}

          {currentUser.role === 'admin' && (
            <AdminDashboardView
              adminUser={currentUser}
              onBackToPortal={() => setCurrentView('portal')}
              onSignOut={handleSignOut}
              t={t}
            />
          )}
        </>
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
            currentUser={currentUser}
            onOpenDashboard={() => setCurrentView('dashboard')}
            onSignOut={handleSignOut}
          />

          {/* Main Content Sections */}
          <main className="flex-1">
            {/* 1. Hero Section */}
            <HeroSection
              t={t}
              onOpenRegister={handleOpenRegister}
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
            />
          </main>

          {/* Government Footer */}
          <Footer
            t={t}
            onOpenRegister={handleOpenRegister}
          />
        </>
      )}

      {/* Modals Accessible from Any View */}
      <RegisterComplaintModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        initialCategory={selectedServiceCategory}
        onComplaintCreated={handleComplaintCreated}
        currentUser={currentUser}
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
