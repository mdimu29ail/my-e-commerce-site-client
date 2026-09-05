import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Send,
  Loader2,
  CheckCircle,
  Sparkle,
  ArrowRight,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Newsletter = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async e => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubscribed(true);
      toast.success('Welcome to the Atelier');
      setEmail('');
    } catch (error) {
      toast.error('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden selection:bg-red-50 selection:text-red-600">
      <div className="container mx-auto  px-6 md:px-10">
        {/* মেইন কন্টেইনার - Editorial Split Layout */}
        <div className="relative bg-stone-900 rounded-[3rem] overflow-hidden min-h-[500px] flex flex-col lg:flex-row items-stretch shadow-2xl shadow-stone-200">
          {/* ১. লেফট সেকশন - টেক্সট ইমপ্যাক্ট */}
          <div className="flex-1 p-10 md:p-20 flex flex-col justify-center space-y-10 z-10">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4 text-red-500"
            >
              <div className="h-[1px] w-12 bg-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em]">
                {t('newsletter.exclusive') || 'Member Access'}
              </span>
            </motion.div>

            <div className="space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-7xl font-light text-white tracking-tighter leading-none uppercase"
              >
                Join the <br />
                <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
                  — atelier community.
                </span>
              </motion.h2>
              <p className="text-stone-400 text-xs md:text-sm font-medium uppercase tracking-[0.3em] max-w-sm leading-relaxed">
                {t('newsletter.subtitle') ||
                  'Unlock curated stories, private sales, and seasonal collections.'}
              </p>
            </div>

            {/* ট্রাস্ট ব্যাজ - ডট নেই, শুধু রেখা */}
            <div className="flex items-center space-x-8 text-stone-500 border-t border-stone-800 pt-8">
              <div className="flex items-center space-x-2">
                <ShieldCheck size={14} className="text-red-600" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  No Spam Policy
                </span>
              </div>
              <div className="h-4 w-[1px] bg-stone-800" />
              <div className="flex items-center space-x-2">
                <Mail size={14} className="text-red-600" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Weekly Edits
                </span>
              </div>
            </div>
          </div>

          {/* ২. রাইট সেকশন - ফর্ম এবং সিগনেচার ডিজাইন */}
          <div className="flex-1 bg-stone-800/30 backdrop-blur-sm p-10 md:p-20 flex flex-col justify-center relative border-l border-stone-800">
            {/* ব্যাকগ্রাউন্ড ডেকোরেশন (Artisanal Pattern) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none scale-150">
              <Sparkle size={400} strokeWidth={0.5} />
            </div>

            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md mx-auto lg:mx-0"
                >
                  <form onSubmit={handleSubscribe} className="space-y-6">
                    <div className="relative group">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full bg-transparent border-b border-stone-700 py-5 text-white text-lg font-light tracking-widest focus:outline-none focus:border-red-600 transition-all placeholder:text-stone-600 uppercase"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                      {/* ইনপুট ডেকোরেশন লাইন */}
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 group-focus-within:w-full transition-all duration-700" />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full bg-white text-stone-900 py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 hover:bg-red-600 hover:text-white group"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <span>Subscribe Now</span>
                          <ArrowRight
                            size={16}
                            className="group-hover:translate-x-2 transition-transform"
                          />
                        </>
                      )}
                    </motion.button>
                  </form>
                  <p className="mt-6 text-[8px] text-stone-600 font-bold uppercase tracking-[0.2em] text-center lg:text-left">
                    By subscribing, you agree to our Terms — Established 2024
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-900/50">
                    <CheckCircle size={32} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-light text-white uppercase tracking-tighter">
                    Submission{' '}
                    <span className="italic font-serif text-red-600">
                      — received
                    </span>
                  </h3>
                  <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    Welcome to our exclusive list.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* গ্রাফিক এলিমেন্টস - এডিটোরিয়াল লাইনস */}
          <div className="absolute top-0 left-0 p-8 opacity-10">
            <div className="w-px h-24 bg-white" />
          </div>
          <div className="absolute bottom-0 right-0 p-8 opacity-10">
            <div className="w-24 h-px bg-white" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
