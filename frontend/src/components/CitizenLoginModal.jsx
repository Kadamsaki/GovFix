import React, { useState } from 'react';
import { X, User, Lock, KeyRound, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CitizenLoginModal({ isOpen, onClose, onLoginSuccess, t }) {
  const [mobile, setMobile] = useState('8448005148');
  const [pin, setPin] = useState('1234');

  if (!isOpen) return null;

  const handleFormLogin = (e) => {
    e.preventDefault();
    onLoginSuccess({
      name: mobile === '9822014589' ? 'Priya Patil' : 'Aarav Sharma',
      mobile: mobile || '8448005148',
      ward: mobile === '9822014589' ? 'Ward No. 03 (Central Market)' : 'Ward No. 14 (Shivaji Chowk)',
    });
    onClose();
  };

  const handleProfileClick = (profile) => {
    onLoginSuccess(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={18} className="text-gov-blue" />
            <h3 className="text-sm sm:text-base font-bold">
              Citizen Portal Login
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          <div className="text-xs text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-start gap-2">
            <ShieldCheck size={16} className="text-gov-blue shrink-0 mt-0.5" />
            <span>
              Sign in with your Mobile Number and 4-digit PIN to manage complaints, track resolution timelines, and submit citizen feedback.
            </span>
          </div>

          {/* Simple Form Login (No OTP complexity) */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gov-navy mb-1">
                Registered Mobile Number / Citizen ID
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500 font-mono">
                  +91
                </span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className="w-full text-xs sm:text-sm p-2.5 pl-12 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue font-mono font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gov-navy">
                  Security PIN / Password
                </label>
                <span className="text-[11px] text-slate-400">Demo PIN: 1234</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  maxLength={6}
                  className="w-full text-xs sm:text-sm p-2.5 pl-9 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue font-mono"
                  required
                />
                <Lock size={15} className="absolute left-3 top-3 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gov-blue hover:bg-gov-blueHover text-white rounded-lg text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to Citizen Portal</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Or 1-Click Demo Profiles
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* 1-Click Demo Citizen Profiles */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() =>
                handleProfileClick({
                  name: 'Aarav Sharma',
                  mobile: '8448005148',
                  ward: 'Ward No. 14 (Shivaji Chowk)',
                })
              }
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-gov-blue bg-slate-50 hover:bg-blue-50/50 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-gov-blue flex items-center justify-center font-bold text-xs">
                  AS
                </div>
                <div>
                  <div className="text-xs font-bold text-gov-navy group-hover:text-gov-blue">
                    Aarav Sharma
                  </div>
                  <div className="text-[11px] text-slate-500">
                    +91 8448005148 • Ward 14
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-gov-blue group-hover:translate-x-0.5 transition-transform">
                Sign In →
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleProfileClick({
                  name: 'Priya Patil',
                  mobile: '9822014589',
                  ward: 'Ward No. 03 (Central Market)',
                })
              }
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-gov-teal bg-slate-50 hover:bg-teal-50/50 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-gov-teal flex items-center justify-center font-bold text-xs">
                  PP
                </div>
                <div>
                  <div className="text-xs font-bold text-gov-navy group-hover:text-gov-teal">
                    Priya Patil
                  </div>
                  <div className="text-[11px] text-slate-500">
                    +91 9822014589 • Ward 03
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-gov-teal group-hover:translate-x-0.5 transition-transform">
                Sign In →
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
