import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Package,
  ArrowRight,
  ShoppingBag,
  Truck,
  Minus,
  Check,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20 font-sans selection:bg-red-50 selection:text-red-600">
      {/* মেইন কন্টেইনার - এডিটোরিয়াল কার্ড স্টাইল */}
      <div className="max-w-xl w-full bg-white border border-stone-100 p-10 md:p-16 text-center relative shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* ব্যাকগ্রাউন্ড ডেকোরেশন লাইন */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-stone-100" />

        {/* ১. সাকসেস আইকন - হিউম্যানিস্ট ডিজাইন */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'circOut' }}
          className="relative mx-auto w-24 h-24 mb-10"
        >
          <div className="absolute inset-[-10px] border border-stone-50 rounded-full" />
          <div className="relative flex items-center justify-center w-24 h-24 bg-stone-900 text-white rounded-full shadow-2xl">
            <Check size={40} strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* ২. অভিনন্দন বার্তা - Editorial Style */}
        <div className="space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 text-red-600 mb-2"
          >
            <Minus size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Transaction Secured
            </span>
            <Minus size={14} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-light text-stone-900 tracking-tighter leading-tight uppercase"
          >
            Confirmed <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — selection.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-stone-400 text-[11px] font-bold uppercase tracking-[0.3em] leading-relaxed max-w-xs mx-auto"
          >
            {t('checkout.success_msg_detail') ||
              'Your selection has been archived and is awaiting curation for shipment.'}
          </motion.p>
        </div>

        {/* ৩. অর্ডার আইডি আর্কাইভ ট্যাগ */}
        <div className="bg-[#FBFBFB] border border-stone-100 p-6 mb-12 flex flex-col items-center group transition-colors hover:bg-white hover:border-red-100">
          <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.4em] mb-3">
            Archive Reference —
          </p>
          <p className="text-sm font-black text-stone-900 tracking-[0.2em] break-all uppercase">
            # {id?.toUpperCase()}
          </p>
        </div>

        {/* ৪. অ্যাকশন বাটনসমূহ - Sharp & Powerful */}
        <div className="space-y-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/tracking"
              className="w-full flex items-center justify-center bg-stone-900 text-white py-5 rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-red-600 transition-all shadow-2xl shadow-stone-200 group"
            >
              <span>{t('tracking.track_btn') || 'Shipment Narrative'}</span>
              <ArrowUpRight
                size={16}
                className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </Link>
          </motion.div>

          <Link
            to="/shop"
            className="w-full flex items-center justify-center bg-white text-stone-400 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] border border-stone-100 hover:border-stone-900 hover:text-stone-900 transition-all"
          >
            {t('cart.continue_shopping') || 'Return to Archive'}
          </Link>
        </div>

        {/* ৫. লজিস্টিক নোটিশ - লিনিয়ার লজিক */}
        <div className="mt-12 pt-8 border-t border-stone-50 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-all cursor-default">
          <div className="flex items-center gap-3">
            <ShieldCheck size={16} className="text-red-600" />
            <span className="text-[9px] font-black text-stone-900 uppercase tracking-[0.4em]">
              Guaranteed Quality
            </span>
          </div>
          <p className="text-[8px] font-bold text-stone-400 uppercase tracking-[0.2em] leading-relaxed">
            Shipment preparation within 24 hours — Global Standards v.2024
          </p>
        </div>

        {/* ডেকোরেটিভ কর্নার লাইন */}
        <div className="absolute bottom-0 right-0 p-4 opacity-5">
          <Package size={80} strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
