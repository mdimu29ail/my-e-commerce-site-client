import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Sparkles,
  Copy,
  CheckCircle2,
  Gem,
  MousePointer2,
} from 'lucide-react';
import { motion } from 'framer-motion';

const PromotionBanner = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const promoCode = 'BAZAAR20';

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-[#FDFCFB] overflow-hidden select-none">
      <div className="container mx-auto  px-4 md:px-10">
        <div className="grid lg:grid-cols-2 items-center gap-0 bg-white rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.04)] border border-stone-100">
          {/* ১. লেফট সেকশন: হিউম্যানিস্ট টাইপোগ্রাফি ফোকাস */}
          <div className="p-12 md:p-24 space-y-12 order-2 lg:order-1">
            {/* ছোট ব্যাজ - Humanist Spacing */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 text-stone-400"
            >
              <Gem size={14} className="text-red-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] font-sans">
                {t('home.artisanal_quality') || 'Artisanal Quality'}
              </span>
            </motion.div>

            {/* মেইন হেডিং - হিউম্যানিস্ট স্টাইল (High Contrast & Elegant) */}
            <div className="space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-light text-stone-900 leading-[1.05] tracking-tight"
                style={{
                  fontFamily:
                    "'Optima', 'Candara', 'Source Sans Pro', sans-serif",
                }}
              >
                The Art of <br />
                <span className="italic font-serif text-red-600 font-normal">
                  Modern
                </span>{' '}
                <br />
                Essence.
              </motion.h2>
              <p className="text-stone-500 text-base md:text-lg font-medium max-w-sm leading-relaxed font-sans">
                Redefine your presence with our limited season collection. A
                touch of luxury in every thread.
              </p>
            </div>

            {/* কুপন সেকশন - Tailor Label Style */}
            <div className="pt-4 space-y-5">
              <div className="flex items-center gap-3 text-stone-400">
                <MousePointer2 size={14} />
                <p className="text-[11px] font-bold uppercase tracking-widest">
                  Click to copy your code
                </p>
              </div>

              <div
                onClick={handleCopy}
                className="inline-flex items-center group cursor-pointer"
              >
                <div className="bg-stone-50 border border-stone-100 px-10 py-5 rounded-l-3xl font-serif italic text-3xl text-stone-800 transition-colors group-hover:bg-white group-hover:border-red-200">
                  {promoCode}
                </div>
                <div
                  className={`px-8 py-5 rounded-r-3xl transition-all flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em] shadow-lg ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-stone-900 text-white group-hover:bg-red-600'
                  }`}
                >
                  {copied ? <CheckCircle2 size={18} /> : 'Apply'}
                </div>
              </div>
            </div>

            {/* অ্যাকশন বাটন */}
            <div className="pt-10 flex flex-col sm:flex-row items-center gap-10">
              <Link
                to="/shop"
                className="group bg-stone-900 text-white px-14 py-5 rounded-full font-bold text-xs uppercase tracking-[0.3em] flex items-center transition-all hover:bg-red-600 shadow-2xl shadow-stone-200 active:scale-95"
              >
                {t('home.discover') || 'Discover Now'}
                <ArrowRight
                  className="ml-3 group-hover:translate-x-2 transition-transform"
                  size={16}
                />
              </Link>

              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                  Ending Soon
                </span>
                <span className="text-xs font-bold text-stone-400 mt-1 uppercase tracking-tighter italic">
                  November 2024
                </span>
              </div>
            </div>
          </div>

          {/* ২. রাইট সেকশন: হাই-এন্ড ফ্যাশন ইমেজ উইথ লাক্সারি ওভারলে */}
          <div className="relative h-[500px] lg:h-full order-1 lg:order-2 overflow-hidden">
            <motion.img
              initial={{ scale: 1.1, filter: 'grayscale(20%)' }}
              whileInView={{ scale: 1, filter: 'grayscale(0%)' }}
              transition={{ duration: 2 }}
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt="Luxury Promo"
            />
            {/* সফট এডিটোরিয়াল ওভারলে */}
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/40 via-transparent to-transparent opacity-60"></div>

            {/* ফ্লোটিং টেক্সট ব্যাজ */}
            <div className="absolute bottom-12 left-12 text-white">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="h-[1px] w-16 bg-white mb-4"
              ></motion.div>
              <h4 className="text-6xl font-light tracking-tighter mb-2">20%</h4>
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-80">
                Storewide Privilege
              </p>
            </div>

            {/* ডেকোরেটিভ বর্ডার বক্স */}
            <div className="absolute top-12 right-12 w-32 h-32 border border-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="text-white/50" size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner;
