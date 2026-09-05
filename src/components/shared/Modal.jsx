import React, { useEffect, useCallback } from 'react';
import { X, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @param {boolean} isOpen - মোডালটি খোলা আছে কি না
 * @param {function} onClose - মোডাল বন্ধ করার ফাংশন
 * @param {string} title - মোডাল হেডার টাইটেল (e.g., "MANIFEST OVERRIDE")
 * @param {React.ReactNode} children - মোডালের ভেতরের কন্টেন্ট
 * @param {string} size - মোডালের সাইজ (sm, md, lg, xl, full)
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  // ১. কিবোর্ড 'Escape' বাটন চাপলে মোডাল বন্ধ করার লজিক
  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // মোডাল খুললে ব্যাকগ্রাউন্ড স্ক্রল বন্ধ করে দেওয়া
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  // সাইজ অনুযায়ী উইডথ নির্ধারণ (Editorial Proportions)
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-[95%] h-[90vh]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-red-50 selection:text-red-600">
          {/* ২. এডিটোরিয়াল ব্লার ব্যাকড্রপ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* ৩. মেইন মোডাল কন্টেইনার (Sharp & Linear) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`relative bg-white w-full ${sizeClasses[size]} shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden`}
          >
            {/* সিগনেচার টপ রেড লাইন */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600 z-50" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-8 bg-stone-100 z-50" />

            {/* ৪. হেডার সেকশন */}
            <div className="flex items-center justify-between px-8 py-8 md:px-12 border-b border-stone-100 bg-[#FBFBFB]">
              <div className="flex items-center gap-4 text-red-600">
                <Minus size={16} />
                <h3 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.4em] leading-none">
                  {title}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="group p-2 text-stone-300 hover:text-red-600 transition-colors duration-300"
              >
                <X
                  size={24}
                  strokeWidth={1}
                  className="group-hover:rotate-90 transition-transform duration-500"
                />
              </button>
            </div>

            {/* ৫. বডি সেকশন (Scrollable) */}
            <div className="overflow-y-auto max-h-[80vh] bg-white no-scrollbar">
              {children}
            </div>

            {/* ৬. ডেকোরেটিভ কর্নার লাইনস */}
            <div className="absolute bottom-0 left-0 w-8 h-[1px] bg-stone-200 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[1px] h-8 bg-stone-200 pointer-events-none" />
          </motion.div>
        </div>
      )}

      {/* গ্লোবাল স্টাইল ফর হাইডিং স্ক্রলবার */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </AnimatePresence>
  );
};

export default Modal;
