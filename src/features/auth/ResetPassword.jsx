import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Lock,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Minus,
  ArrowLeft,
  KeySquare,
  Sparkle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams();

  // স্টেট ম্যানেজমেন্ট
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('Narrative Error: Passwords do not match.');
    }

    if (password.length < 6) {
      return toast.error('Security Error: Cipher length too short.');
    }

    setLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.put(`${API_URL}/auth/reset-password/${token}`, { password });

      setIsSuccess(true);
      toast.success('Security Cipher Updated');

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Protocol Reset Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20 font-sans selection:bg-red-50 selection:text-red-600">
      {/* মেইন কন্টেইনার - এডিটোরিয়াল ডিজাইন */}
      <div className="max-w-md w-full bg-white border border-stone-100 p-10 md:p-16 relative shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* ব্যাকগ্রাউন্ড ডেকোরেশন লাইন */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-stone-50" />

        {/* ১. হেডার সেকশন */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3 text-red-600 mb-2">
            <Minus size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Security Protocol
            </span>
            <Minus size={14} />
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Reset <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — cipher.
            </span>
          </h1>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest italic">
            {isSuccess
              ? 'Identity successfully re-established.'
              : 'Establish a new access fragment for your archive.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.form
              key="reset-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
              onSubmit={handleSubmit}
            >
              <div className="space-y-10">
                <HumanistInput
                  label="New Access Cipher"
                  name="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock size={14} />}
                />
                <HumanistInput
                  label="Confirm Cipher"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<ShieldCheck size={14} />}
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
                    Re-establish Protocol{' '}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success-message"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-10 space-y-8"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center">
                  <CheckCircle2
                    size={40}
                    className="text-green-500"
                    strokeWidth={1.5}
                  />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[-10px] border border-dashed border-stone-100 rounded-full"
                />
              </div>

              <div className="text-center space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
                  Redirecting to Sign-In
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-stone-900 font-black text-[11px] uppercase tracking-[0.4em] border-b-2 border-red-600 pb-1 hover:text-red-600 transition-all"
                >
                  Manual Ingress <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ডেকোরেটিভ কর্নার আইকন */}
        <div className="absolute bottom-0 right-0 p-4 opacity-5">
          <KeySquare size={60} strokeWidth={1} />
        </div>
      </div>

      {/* ব্যাকগ্রাউন্ড ডেকোরেশন এলিমেন্ট */}
      <div className="fixed top-10 right-10 opacity-20 pointer-events-none">
        <Sparkle size={150} strokeWidth={0.5} className="text-stone-100" />
      </div>
    </div>
  );
};

// --- Humanist Input Component (Shared UI Theme) ---
const HumanistInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
}) => (
  <div className="space-y-4 group">
    <label className="text-[9px] font-black text-stone-400 uppercase tracking-[0.4em] flex items-center gap-2 group-focus-within:text-red-600 transition-colors">
      {icon} {label} —
    </label>
    <input
      name={name}
      type={type}
      required
      value={value}
      onChange={onChange}
      className="w-full bg-transparent border-b border-stone-100 py-3 text-[13px] font-bold text-stone-900 placeholder:text-stone-200 focus:outline-none focus:border-red-600 transition-all duration-500 uppercase tracking-widest"
      placeholder={placeholder}
    />
  </div>
);

export default ResetPassword;
