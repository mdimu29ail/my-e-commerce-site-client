import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Zap,
  Clock,
  ShoppingCart,
  Star,
  Minus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Loader from '../../components/shared/Loader';

const FlashSalePage = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products?flashSale=true`);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Archive sync failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashSale();

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59);
      const diff = end - now;
      if (diff <= 0) clearInterval(timer);
      else {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [API_URL]);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* ১. এডিটোরিয়াল হেডার (Editorial Banner) */}
      <div className="bg-[#F9F9F9] border-b border-stone-100 py-20 md:py-28 overflow-hidden relative">
        <div className="container mx-auto  px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 text-red-600"
              >
                <div className="h-[1px] w-12 bg-red-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                  Limited Duration
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-8xl font-light text-stone-900 tracking-tighter leading-none uppercase"
              >
                Flash <br />
                <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
                  — archive sale.
                </span>
              </motion.h1>

              <p className="text-stone-400 text-xs md:text-sm font-medium uppercase tracking-[0.3em] max-w-sm leading-loose">
                Access curated essentials at exceptional value. Authenticity and
                quality guaranteed.
              </p>
            </div>

            {/* মডার্ন লিনিয়ার টাইমার */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-10 md:p-16 border border-stone-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] relative group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-stone-100 overflow-hidden">
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="w-1/2 h-full bg-red-600"
                />
              </div>

              <div className="flex flex-col items-center gap-8">
                <div className="flex items-center gap-3 text-stone-400">
                  <Clock size={16} className="text-red-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                    Inventory Syncing
                  </span>
                </div>

                <div className="flex items-center space-x-6 md:space-x-12">
                  <TimerUnit value={timeLeft.hours} label="Hours" />
                  <div className="text-stone-200 text-3xl font-light mt-[-20px]">
                    —
                  </div>
                  <TimerUnit value={timeLeft.minutes} label="Minutes" />
                  <div className="text-stone-200 text-3xl font-light mt-[-20px]">
                    —
                  </div>
                  <TimerUnit value={timeLeft.seconds} label="Seconds" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ২. প্রোডাক্ট গ্রিড (Editorial Grid) */}
      <div className="container mx-auto  px-6 md:px-12 py-24">
        {products.length === 0 ? (
          <div className="py-32 text-center">
            <h3 className="text-3xl font-light uppercase tracking-tighter text-stone-300 italic">
              No active flash sessions.
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col h-full relative"
              >
                {/* ইমেজ সেকশন - Sharp & Linear */}
                <div className="relative aspect-[4/5] bg-[#F7F7F7] overflow-hidden border border-stone-100 mb-6">
                  {/* ডিসকাউন্ট লেবেল (Atelier Style) */}
                  <div className="absolute top-0 left-0 bg-stone-900 text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-widest z-10">
                    -
                    {Math.round(
                      ((product.oldPrice - product.price) / product.oldPrice) *
                        100
                    )}
                    % Off
                  </div>

                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
                  />

                  {/* কুইক অ্যাড অ্যাকশন */}
                  <button className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md py-4 text-[10px] font-black uppercase tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-transform duration-500 hover:bg-red-600 hover:text-white flex items-center justify-center gap-3">
                    <ShoppingCart size={14} /> Collect Now
                  </button>
                </div>

                {/* কন্টেন্ট সেকশন */}
                <div className="flex flex-col flex-grow px-1">
                  <div className="flex items-center justify-between mb-3 text-[9px] font-bold text-stone-400 uppercase tracking-[0.3em]">
                    <span>{product.category?.nameEn || 'Archive'}</span>
                    <div className="flex items-center gap-1 text-amber-500/60">
                      <Star size={10} fill="currentColor" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-[13px] font-black text-stone-900 uppercase tracking-widest leading-tight mb-4 line-clamp-1 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* স্টক প্রগ্রেস রেখা (No Dots, Only Line) */}
                  <div className="mb-6 space-y-3">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-stone-300">
                      <span>
                        Sold —{' '}
                        {Math.round(
                          (product.soldCount / product.totalStock) * 100
                        )}
                        %
                      </span>
                      <span className="text-red-600 italic">
                        Limited Archive
                      </span>
                    </div>
                    <div className="h-[1px] w-full bg-stone-100 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${Math.round((product.soldCount / product.totalStock) * 100)}%`,
                        }}
                        transition={{ duration: 1, ease: 'circOut' }}
                        className="absolute h-full bg-stone-900"
                      />
                    </div>
                  </div>

                  <div className="mt-auto flex items-baseline gap-4 pt-4 border-t border-stone-50">
                    <span className="text-lg font-black text-red-600 tracking-tighter">
                      ৳{product.price}
                    </span>
                    <span className="text-[10px] text-stone-300 line-through font-bold uppercase tracking-widest">
                      ৳{product.oldPrice}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ৩. বটম ডেকোরেশন লাইন */}
      <div className="mt-20 py-12 flex flex-col items-center justify-center space-y-8 opacity-30">
        <div className="flex items-center space-x-16">
          <div className="h-[1px] w-32 bg-stone-900" />
          <TrendingUp size={24} className="text-stone-900" />
          <div className="h-[1px] w-32 bg-stone-900" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-stone-500">
          — Authenticated Flash Archives 2024 —
        </p>
      </div>
    </div>
  );
};

// এডিটোরিয়াল টাইমার ইউনিট
const TimerUnit = ({ value, label }) => (
  <div className="flex flex-col items-center min-w-[60px]">
    <span className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.4em] mt-3">
      {label}
    </span>
  </div>
);

export default FlashSalePage;
