import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Mail,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  Send,
  Minus,
  Hash,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email) {
      return toast.error('PROTOCOL ERROR: IDENTITY REQUIRED');
    }

    setLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      await axios.post(
        `${API_URL}/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );

      setIsSubmitted(true);
      toast.success('RECOVERY MANIFEST DISPATCHED');
    } catch (error) {
      toast.error(error.response?.data?.message || 'RECOVERY PROTOCOL FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans selection:bg-red-50 selection:text-red-600 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-12 bg-white border border-stone-100 p-10 md:p-16 shadow-2xl shadow-stone-200/20 relative overflow-hidden group"
      >
        {/* ১. এডিটোরিয়াল হেডার */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <Minus size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Identity Recovery
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Reset <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — access.
            </span>
          </h2>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-loose">
            {isSubmitted
              ? 'The recovery manifest has been ingested into your inbox.'
              : 'Enter your archival email to initialize the security reversal protocol.'}
          </p>
        </div>

        {!isSubmitted ? (
          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-3 group/input">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Hash size={12} className="text-red-600" /> Archive Identity
                (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="IDENTITY@DOMAIN.COM —"
                  className="w-full bg-stone-50 border-b border-stone-200 p-4 text-[13px] font-mono font-black uppercase tracking-widest focus:outline-none focus:border-red-600 transition-all placeholder:text-stone-200"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-8 bg-stone-900 text-white text-[12px] font-black uppercase tracking-[0.6em] flex items-center justify-center gap-4 hover:bg-red-600 transition-all shadow-2xl disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <>
                  <span>Dispatch Link</span>
                  <Send
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    size={16}
                  />
                </>
              )}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 border border-emerald-100 bg-emerald-50/30 text-center space-y-4"
          >
            <p className="text-emerald-700 text-[10px] font-black uppercase tracking-widest leading-loose">
              Manifest synchronized. <br /> Check your digital archive for the
              recovery link.
            </p>
          </motion.div>
        )}

        {/* ব্যাক টু লগইন */}
        <div className="pt-8 border-t border-stone-50 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="mr-3" size={14} />
            Return to Authentication
          </Link>
        </div>

        {/* ব্যাকগ্রাউন্ড একসেন্ট */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
          <ShieldAlert size={120} />
        </div>

        {/* Bottom Hairline */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-1000 group-hover:w-full" />
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
