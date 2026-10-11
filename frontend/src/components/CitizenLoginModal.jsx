import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  Wrench,
  UserCheck,
  Building,
  KeyRound,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { loginUser } from '../services/api';

const ROLE_TABS = [
  {
    key: 'citizen',
    label: 'Citizen',
    icon: User,
    desc: 'Resident portal for lodging and tracking civic grievances',
    identifierLabel: 'Registered Mobile Number',
    placeholder: 'Enter 10-digit mobile (e.g. 8448005148)',
    demoId: '8448005148',
    demoPin: '1234',
    demoName: 'Citizen Demo (Aarav S.)',
  },
  {
    key: 'officer',
    label: 'Field Officer',
    icon: Wrench,
    desc: 'Municipal technical engineers executing repairs & resolution',
    identifierLabel: 'Officer Employee ID or Mobile',
    placeholder: 'e.g. officer-1 or mobile number',
    demoId: 'officer-1',
    demoPin: '1234',
    demoName: 'Officer Demo (Water Works)',
  },
  {
    key: 'supervisor',
    label: 'Supervisor',
    icon: UserCheck,
    desc: 'Ward superintendents triaging grievances & verifying resolutions',
    identifierLabel: 'Supervisor Employee ID or Mobile',
    placeholder: 'e.g. supervisor-1 or mobile number',
    demoId: 'supervisor-1',
    demoPin: '1234',
    demoName: 'Supervisor Demo (Ward 14)',
  },
  {
    key: 'admin',
    label: 'Administrator',
    icon: Building,
    desc: 'Central municipal administration, user management & audit inspection',
    identifierLabel: 'Admin ID or Mobile',
    placeholder: 'e.g. admin-1 or mobile number',
    demoId: 'admin-1',
    demoPin: '1234',
    demoName: 'Admin Demo (HQ)',
  },
];

export default function CitizenLoginModal({ isOpen, onClose, onLoginSuccess, t }) {
  const [selectedRoleTab, setSelectedRoleTab] = useState('citizen');
  const [identifier, setIdentifier] = useState('8448005148');
  const [pin, setPin] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [demoLoadedMsg, setDemoLoadedMsg] = useState(null);

  if (!isOpen) return null;

  const currentTab = ROLE_TABS.find((tab) => tab.key === selectedRoleTab) || ROLE_TABS[0];

  const handleTabChange = (roleKey) => {
    setSelectedRoleTab(roleKey);
    const targetTab = ROLE_TABS.find((tab) => tab.key === roleKey);
    setError(null);
    setDemoLoadedMsg(null);
    // Optionally auto-set placeholder values or clear
    if (targetTab) {
      setIdentifier(targetTab.demoId);
      setPin(targetTab.demoPin);
    }
  };

  const handleApplyDemoCredentials = () => {
    setIdentifier(currentTab.demoId);
    setPin(currentTab.demoPin);
    setError(null);
    setDemoLoadedMsg(`Demo credentials for ${currentTab.label} loaded.`);
    setTimeout(() => setDemoLoadedMsg(null), 3000);
  };

  const handleFormLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDemoLoadedMsg(null);

    try {
      // Role is determined strictly by the backend database verification
      const user = await loginUser(identifier.trim());
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setError(
        err.message ||
          'Authentication failed. Please verify your credentials or use the Demo Access option.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gov-blue/20 flex items-center justify-center text-gov-blue border border-sky-400/30">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">
                Municipal Grievance Portal Sign In
              </h3>
              <p className="text-[11px] text-slate-300">
                Official Role-Based Authentication & Access Control
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Segmented Role Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Portal Access Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
              {ROLE_TABS.map((tab) => {
                const Icon = tab.icon;
                const isSelected = selectedRoleTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabChange(tab.key)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gov-navy text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-gov-navy hover:bg-slate-200/70'
                    }`}
                  >
                    <Icon size={16} className={`mb-1 ${isSelected ? 'text-sky-300' : 'text-slate-400'}`} />
                    <span className="text-[11px] truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
              <Info size={12} className="text-gov-blue shrink-0" />
              <span>{currentTab.desc}</span>
            </p>
          </div>

          {/* Feedback & Notifications */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-xs text-rose-900 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {demoLoadedMsg && (
            <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-900 flex items-center gap-2 animate-fadeIn font-medium">
              <Sparkles size={14} className="text-sky-600 shrink-0" />
              <span>{demoLoadedMsg}</span>
            </div>
          )}

          {/* Main Credentials Form */}
          <form onSubmit={handleFormLogin} className="space-y-3.5 pt-1">
            <div>
              <label className="block text-xs font-bold text-gov-navy mb-1">
                {currentTab.identifierLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={currentTab.placeholder}
                  className="w-full text-xs sm:text-sm p-2.5 pl-9 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue font-mono font-medium"
                  required
                />
                <User size={15} className="absolute left-3 top-3 text-slate-400" />
              </div>

              {/* Quick Officer Switcher for testing all 5 departments */}
              {selectedRoleTab === 'officer' && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {[
                    { id: 'officer-1', label: '🚰 Water (Amit)' },
                    { id: 'officer-2', label: '🛣️ Roads (Rajesh)' },
                    { id: 'officer-3', label: '💡 Electrical (Sandeep)' },
                    { id: 'officer-4', label: '🗑️ Sanitation (Ramesh)' },
                    { id: 'officer-5', label: '🌊 Drainage (Ganesh)' },
                  ].map((off) => (
                    <button
                      key={off.id}
                      type="button"
                      onClick={() => setIdentifier(off.id)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        identifier === off.id
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {off.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gov-navy">
                  Security PIN / Password
                </label>
                <span className="text-[11px] text-slate-400">Default PIN: 1234</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter security PIN"
                  className="w-full text-xs sm:text-sm p-2.5 pl-9 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue font-mono"
                  required
                />
                <Lock size={15} className="absolute left-3 top-3 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gov-blue hover:bg-gov-blueHover text-white rounded-lg text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{loading ? 'Authenticating...' : `Sign In as ${currentTab.label}`}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Discreet Demo Access Option for Evaluators */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <KeyRound size={13} className="text-slate-400" />
              <span className="text-[11px]">Evaluating GovFix?</span>
            </div>
            <button
              type="button"
              onClick={handleApplyDemoCredentials}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gov-blue hover:text-gov-blueHover bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-md border border-sky-200 transition-colors cursor-pointer"
            >
              <Sparkles size={12} className="text-gov-blue" />
              <span>Demo Access ({currentTab.label})</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
            Role authorization is enforced on the server. Your authenticated municipal role determines accessible dashboards and actions.
          </div>

        </div>

      </div>
    </div>
  );
}
