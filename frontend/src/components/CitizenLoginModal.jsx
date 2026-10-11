import React, { useState } from 'react';
import { X, User, Phone, KeyRound, Shield, RefreshCw } from 'lucide-react';

export default function CitizenLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('7K9P2');

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (mobile.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    onLoginSuccess({ name: 'Aarav Sharma', mobile: mobile || '9876543210' });
    onClose();
  };

  const handleDemoLogin = () => {
    onLoginSuccess({ name: 'Citizen Demo User', mobile: '9876543210' });
    onClose();
  };

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
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
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
            Sign in with your registered mobile number to check complaint history, reopen tickets, and give officer feedback.
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gov-navy mb-1">
                  Mobile Number
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
                    className="w-full text-xs sm:text-sm p-2.5 pl-12 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue font-mono"
                    required
                  />
                </div>
              </div>

              {/* Captcha Mockup */}
              <div>
                <label className="block text-xs font-bold text-gov-navy mb-1">
                  Security Code (CAPTCHA)
                </label>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-200 tracking-widest font-mono font-black text-slate-700 px-3 py-2 rounded border border-slate-300 text-sm select-none">
                    {captchaCode}
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2 text-slate-500 hover:text-gov-blue hover:bg-slate-100 rounded"
                    title="Refresh Captcha"
                  >
                    <RefreshCw size={16} />
                  </button>
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 text-xs sm:text-sm p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue font-mono uppercase"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gov-blue hover:bg-gov-blueHover text-white rounded-lg text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                Send One-Time Password (OTP)
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gov-navy mb-1">
                  Enter 4-Digit OTP sent to +91 {mobile}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 1 2 3 4"
                  maxLength={4}
                  className="w-full text-center tracking-widest text-lg font-mono font-bold p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1 text-center">
                  (For testing/demo: enter any 4 digits or use Demo Login)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gov-blue hover:bg-gov-blueHover text-white rounded-lg text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                Verify &amp; Enter Portal
              </button>
            </form>
          )}

          {/* Demo Instant Login Shortcut */}
          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              Demo Quick Login (1-Click Preview)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
