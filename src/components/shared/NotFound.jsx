import React from 'react';
import { Link } from 'react-router-dom';
import { Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button'; // আপনার আপডেট করা প্রিমিয়াম বাটন

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center px-6 py-20 font-sans selection:bg-red-50 selection:text-red-600 text-center relative overflow-hidden">
      {/* আর্কিটেকচারাল ডেকোরেশন লাইন */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-stone-200" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-stone-200" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-12 z-10"
      >
        {/* ১. স্ট্যাটাস লেবেল */}
        <div className="flex items-center justify-center gap-4 text-red-600 mb-2">
          <Minus size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.6em]">
            Error 404
          </span>
          <Minus size={14} />
        </div>

        {/* ২. মিক্সড টাইপোগ্রাফি হেডলাইন */}
        <h1 className="text-6xl md:text-9xl font-light text-stone-900 tracking-tighter leading-none uppercase">
          Archive <br />
          <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
            — untraceable.
          </span>
        </h1>

        {/* ৩. এডিটোরিয়াল সাব-টাইটেল */}
        <p className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-[0.3em] max-w-lg mx-auto leading-loose">
          The requested curation fragment does not exist in our current
          manifest. It may have been relocated or permanently purged.
        </p>

        {/* ৪. অ্যাকশন বাটন */}
        <div className="pt-10 flex justify-center">
          <Link to="/">
            <Button variant="primary">Return to Atelier</Button>
          </Link>
        </div>
      </motion.div>

      {/* ব্যাকগ্রাউন্ড জলছাপ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-black text-stone-50 opacity-50 pointer-events-none z-0">
        404
      </div>
    </div>
  );
};

export default NotFound;
