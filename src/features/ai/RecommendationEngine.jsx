import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ProductCard from '../products/components/ProductCard';
import { Sparkle, RefreshCw, Minus, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecommendationEngine = ({ currentProductId, categoryId }) => {
  const { t } = useTranslation();
  const [recommendations, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIRecommendations = async () => {
      setLoading(true);
      try {
        const API_URL =
          import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

        const { data } = await axios.get(
          `${API_URL}/products/recommendations?exclude=${currentProductId}&category=${categoryId}`
        );

        setProducts(data);
      } catch (error) {
        console.error('AI Engine Sync Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchAIRecommendations();
  }, [currentProductId, categoryId]);

  // ১. প্রিমিয়াম এডিটোরিয়াল লোডার (Linear Animation)
  if (loading)
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center gap-4 text-red-600">
          <div className="h-[1px] w-12 bg-red-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
            Archive Syncing
          </span>
          <div className="h-[1px] w-12 bg-red-600" />
        </div>
        <div className="w-48 h-[1px] bg-stone-100 relative overflow-hidden">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="absolute inset-0 w-1/2 bg-red-600"
          />
        </div>
      </div>
    );

  if (recommendations.length === 0) return null;

  return (
    <section className="py-24 border-t border-stone-100 mt-24 overflow-hidden font-sans selection:bg-red-50 selection:text-red-600">
      {/* ২. এডিটোরিয়াল হেডার (Humanist Layout) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 text-red-600"
          >
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">
              Intelligence Curation
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-7xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Recommended <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — for you.
            </span>
          </h2>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-stone-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] max-w-[240px] leading-loose"
        >
          {t('ai.recommended_subtitle') ||
            'A machine-learning generated archive of pieces tailored to your aesthetic.'}
        </motion.p>
      </div>

      {/* ৩. প্রোডাক্ট গ্রিড (Editorial Linear Grid) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
      >
        {recommendations.map((product, index) => (
          <motion.div
            key={product._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="group relative"
          >
            {/* ব্যাকগ্রাউন্ড ইনডেক্স নাম্বার */}
            <span className="absolute -top-6 left-0 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors duration-500 pointer-events-none">
              — 0{index + 1}
            </span>

            <div className="relative z-10 h-full bg-white transition-all duration-700">
              <ProductCard product={product} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ৪. বটম ডেকোরেশন (Line Based) */}
      <div className="mt-32 flex flex-col items-center justify-center space-y-6 opacity-30">
        <div className="flex items-center space-x-12">
          <div className="h-[1px] w-24 bg-stone-900" />
          <Sparkle size={18} className="text-stone-900" />
          <div className="h-[1px] w-24 bg-stone-900" />
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-500">
          — Artificial Intelligence Synthesis v.2.4 —
        </p>
      </div>
    </section>
  );
};

export default RecommendationEngine;
