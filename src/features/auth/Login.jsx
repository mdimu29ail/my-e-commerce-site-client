import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Minus,
  ShieldCheck,
  ArrowLeft,
  KeySquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const { t, i18n } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // স্টেটস
  const [step, setStep] = useState('login'); // 'login' or 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) navigate(redirectPath);
  }, [isAuthenticated, navigate, redirectPath]);

  // ধাপ ১: লগইন সাবমিট (ক্রেডেন্সিয়াল চেক)
  const handleLoginSubmit = async e => {
    e.preventDefault();
    if (!email || !password) return toast.error('Credentials required.');

    setLoading(true);
    // এখানে আপনার ব্যাকএন্ড এপিআই কল হবে যা ইমেইলে ওটিপি পাঠাবে
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
      toast.info('Verification code dispatched to your archive email.');
    }, 1500);
  };

  // ধাপ ২: ওটিপি ভেরিফাই
  const handleVerifyOTP = async e => {
    e.preventDefault();
    if (otp.length < 4) return toast.error('Complete verification protocol.');

    setLoading(true);
    const result = await login(email, password); // আপনার মেইন লগইন ফাংশন
    setLoading(false);

    if (result.success) {
      toast.success('Identity Authenticated');
      navigate(redirectPath);
    } else {
      toast.error(result.message || 'Protocol Error');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20 font-sans selection:bg-red-50 selection:text-red-600">
      {/* মেইন কন্টেইনার - এডিটোরিয়াল কার্ড স্টাইল */}
      <div className="max-w-md w-full bg-white border border-stone-100 p-10 md:p-16 relative shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* ব্যাকগ্রাউন্ড ডেকোরেশন লাইন */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-stone-50" />

        <AnimatePresence mode="wait">
          {step === 'login' ? (
            <motion.div
              key="login-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-10"
            >
              {/* হেডার */}
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-3 text-red-600 mb-2">
                  <Minus size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                    Identity Access
                  </span>
                  <Minus size={14} />
                </div>
                <h1 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tighter leading-tight uppercase">
                  Archive <br />
                  <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
                    — ingress.
                  </span>
                </h1>
              </div>

              {/* ফর্ম */}
              <form onSubmit={handleLoginSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="group space-y-2">
                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] group-focus-within:text-red-600 transition-colors">
                      Archive Email —
                    </label>
                    <input
                      type="email"
                      className="w-full bg-transparent border-b border-stone-100 py-3 text-sm font-bold text-stone-900 focus:outline-none focus:border-red-600 transition-all placeholder:text-stone-200 uppercase tracking-widest"
                      placeholder="ENTER EMAIL..."
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="group space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] group-focus-within:text-red-600 transition-colors">
                        Access Cipher —
                      </label>
                      <Link
                        to="/forgot-password"
                        size={14}
                        className="text-[8px] font-black text-stone-300 uppercase tracking-widest hover:text-red-600 transition-colors"
                      >
                        Reset?
                      </Link>
                    </div>
                    <input
                      type="password"
                      className="w-full bg-transparent border-b border-stone-100 py-3 text-sm font-bold text-stone-900 focus:outline-none focus:border-red-600 transition-all placeholder:text-stone-200 uppercase tracking-widest"
                      placeholder="ENTER PASSWORD..."
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 text-white py-5 rounded-full font-black text-[11px] uppercase tracking-[0.5em] flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-2xl active:scale-95 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Initialize{' '}
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-2 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="verify-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              {/* ভেরিফিকেশন হেডার */}
              <div className="space-y-4 text-center">
                <button
                  onClick={() => setStep('login')}
                  className="flex items-center gap-2 text-[9px] font-black text-stone-400 uppercase tracking-widest hover:text-red-600 transition-all mx-auto mb-4"
                >
                  <ArrowLeft size={14} /> Back to credentials
                </button>
                <h1 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tighter leading-tight uppercase">
                  Security <br />
                  <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
                    — protocol.
                  </span>
                </h1>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                  A 6-digit manifest was sent to your inbox.
                </p>
              </div>

              {/* ওটিপি ফর্ম */}
              <form onSubmit={handleVerifyOTP} className="space-y-8">
                <div className="group space-y-4 text-center">
                  <label className="text-[9px] font-black text-stone-400 uppercase tracking-[0.4em]">
                    Enter Code Fragment —
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    className="w-full bg-stone-50 border-b-2 border-stone-100 py-6 text-3xl font-serif italic text-center text-stone-900 focus:outline-none focus:border-red-600 transition-all tracking-[0.5em]"
                    placeholder="000000"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 text-white py-5 rounded-full font-black text-[11px] uppercase tracking-[0.5em] flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-2xl active:scale-95 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Verify Identity{' '}
                      <ShieldCheck
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                      />
                    </>
                  )}
                </button>

                <p className="text-center text-[8px] text-stone-300 font-bold uppercase tracking-widest">
                  Didn't receive the manifest?{' '}
                  <button
                    type="button"
                    className="text-red-600 hover:underline"
                  >
                    Resend Code
                  </button>
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ফুটার লিঙ্ক */}
        <div className="text-center mt-12 pt-8 border-t border-stone-50">
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
            {t('auth.no_account')}{' '}
            <Link
              to="/register"
              className="text-red-600 font-black hover:underline transition-all"
            >
              {t('auth.register_link')}
            </Link>
          </p>
        </div>

        {/* ডেকোরেটিভ কর্নার আইকন */}
        <div className="absolute bottom-0 right-0 p-4 opacity-5">
          <KeySquare size={60} strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

export default Login;
