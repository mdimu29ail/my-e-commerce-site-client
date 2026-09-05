import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, ArrowRight, Sparkles, Star, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThreeDHeroCanvas from './ThreeDHeroCanvas'; // আপনার ৩ডি কম্পোনেন্ট

const HeroSection = () => {
  const { t } = useTranslation();

  // অ্যানিমেশন ভেরিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative min-h-[600px] lg:h-[800px] flex items-center overflow-hidden bg-[#FBFBFB]">
      {/* ১. ব্যাকগ্রাউন্ড ডিজাইন - ক্লিন এবং ৩ডি ফ্রেন্ডলি */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-slate-200/50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-red-50/50 rounded-full blur-[100px]"></div>
        {/* টেক্সচার্ড ডটস */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23000'/%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto  px-6 w-full grid lg:grid-cols-2 gap-8 items-center z-10 py-16 lg:py-0">
        {/* ২. টেক্সট সেকশন (Clostich Typography) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left space-y-8"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-full"
          >
            <Sparkles size={16} className="text-red-500" />
            <span className="text-slate-900 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase">
              Premium 3D Experience
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter"
          >
            FUTURE <br />
            <span className="italic font-serif font-light text-red-600">
              Fashion.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-slate-500 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed"
          >
            Experience the next generation of online shopping. Interact with our
            3D products and discover unparalleled quality.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <Link
              to="/shop"
              className="group bg-slate-900 hover:bg-red-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              SHOP NOW
              <ShoppingBag
                className="ml-2 group-hover:rotate-12 transition-transform"
                size={20}
              />
            </Link>

            <Link
              to="/collections"
              className="group border-2 border-slate-200 text-slate-800 px-10 py-4 rounded-2xl font-bold hover:bg-white hover:border-slate-900 transition-all flex items-center"
            >
              EXPLORE 3D
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Link>
          </motion.div>

          {/* ট্রাস্ট ব্যাজ */}
          <motion.div
            variants={itemVariants}
            className="pt-6 flex items-center justify-center lg:justify-start space-x-4"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 shadow-sm overflow-hidden"
                >
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <div className="h-10 w-px bg-slate-200 mx-2"></div>
            <div>
              <div className="flex text-amber-500">
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">
                Global Top Rated Store
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ৩. ৩ডি ক্যানভাস সেকশন (Floating Design) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[450px] lg:h-[600px] w-full"
        >
          {/* ৩ডি এর পেছনের ডেকোরেশন */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-slate-200/30 rounded-full blur-3xl"></div>

          <div className="relative z-10 w-full h-full">
            <ThreeDHeroCanvas />

            {/* ৩ডি ইন্টারেক্টিভ ব্যাজ */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-10 right-0 lg:right-10 bg-white/80 backdrop-blur-md border border-slate-100 p-4 rounded-2xl shadow-xl flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-100">
                <Box size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                  Interactive
                </p>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                  Drag to rotate product
                </p>
              </div>
            </motion.div>

            {/* সেকেন্ডারি ব্যাজ */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="absolute top-20 left-0 bg-slate-900 text-white px-4 py-2 rounded-full shadow-2xl flex items-center space-x-2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-[9px] font-black uppercase tracking-widest">
                360° VIEW AVAILABLE
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
