import React, { useMemo } from 'react';
import { useCart } from '../../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { Minus, Tag, ShieldCheck, Truck, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutSummary = ({
  shippingCost = 0,
  discountAmount = 0,
  totalWithDiscount = 0,
}) => {
  const { cartItems } = useCart();
  const { i18n } = useTranslation();

  // ১. সাবটোটাল ক্যালকুলেশন (নিরাপত্তার জন্য সরাসরি আইটেম থেকে)
  const archiveSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = Number(item.discountPrice || item.price || 0);
      const qty = Number(item.qty || 1);
      return acc + price * qty;
    }, 0);
  }, [cartItems]);

  // ২. ডাইনামিক ফাইনাল ক্যালকুলেশন (NaN প্রোটেকশন সহ)
  const calculatedFinalTotal = useMemo(() => {
    const sub = Number(archiveSubtotal) || 0;
    const ship = Number(shippingCost) || 0;
    const disc = Number(discountAmount) || 0;

    // মেইন লজিক: (সাবটোটাল + শিপিং) - ডিসকাউন্ট
    const result = sub + ship - disc;
    return result > 0 ? result : 0;
  }, [archiveSubtotal, shippingCost, discountAmount]);

  // ৩. যদি প্যারেন্ট থেকে আসা ভ্যালু ০ হয়, তবে ইন্টারনাল ক্যালকুলেশন দেখাবে (Sync Fix)
  const displayTotal =
    totalWithDiscount > 0 ? totalWithDiscount : calculatedFinalTotal;

  return (
    <div className="bg-[#FBFBFB] p-8 md:p-10 border border-stone-100 font-sans shadow-sm selection:bg-red-50 selection:text-red-600">
      {/* এডিটোরিয়াল হেডার */}
      <div className="flex items-center gap-3 mb-10 border-b border-stone-200 pb-6">
        <Minus size={16} className="text-red-600" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-900">
          ORDER.SUMMARY
        </h3>
      </div>

      {/* প্রোডাক্ট লিস্ট - আর্কাইভ স্টাইল */}
      <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
        {cartItems.map(item => {
          const itemPrice = Number(item.discountPrice || item.price || 0);
          return (
            <div key={item._id} className="flex gap-6 group">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-18 bg-white border border-stone-100 overflow-hidden">
                  <img
                    src={item.images?.[0]}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    alt=""
                  />
                </div>
                <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                  {item.qty}
                </span>
              </div>
              <div className="flex-1 space-y-1 py-1">
                <p className="text-[8px] font-black text-red-600 uppercase tracking-[0.3em]">
                  — {item.category?.nameEn || 'Fashion'}
                </p>
                <h4 className="text-[11px] font-bold text-stone-800 uppercase tracking-widest line-clamp-1 leading-tight">
                  {i18n.language === 'en' ? item.nameEn : item.nameBn}
                </h4>
                <p className="text-[11px] font-black text-stone-900">
                  ৳{(itemPrice * item.qty).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ভ্যালু ব্রেকডাউন সেকশন */}
      <div className="space-y-5 pt-8 border-t border-stone-200">
        {/* ১. সাবটোটাল */}
        <div className="flex justify-between items-center text-stone-400">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
            Archive Subtotal
          </span>
          <span className="text-[13px] font-black text-stone-900">
            ৳{archiveSubtotal.toLocaleString()}
          </span>
        </div>

        {/* ২. লজিস্টিক ফি (Shipping) */}
        <div className="flex justify-between items-center text-stone-400">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            <Truck size={12} /> Logistics Fee
          </span>
          <span className="text-[13px] font-black text-stone-900">
            ৳{Number(shippingCost).toLocaleString()}
          </span>
        </div>

        {/* ৩. ডিসকাউন্ট রো (আপনার রিকোয়ারমেন্ট অনুযায়ী যোগ করা হয়েছে) */}
        <AnimatePresence>
          {Number(discountAmount) > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex justify-between items-center text-red-600 font-bold border-t border-red-50 pt-4"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                <Tag size={12} /> Privilege Savings
              </span>
              <span className="text-[13px] font-black tracking-tighter">
                — ৳{Number(discountAmount).toLocaleString()}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* এডিটোরিয়াল ডিভাইডার লাইন */}
        <div className="h-[1px] w-full bg-stone-900 mt-6" />

        {/* ৪. ফাইনাল সেটেলমেন্ট (Calculated Total) */}
        <div className="pt-8 flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-900">
              Final Settlement
            </span>
            <p className="text-[8px] font-bold text-stone-300 uppercase tracking-widest leading-none">
              Inclusive of all duties
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-stone-900 tracking-tighter">
              ৳{Number(displayTotal).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* সিকিউরিটি ট্যাগ */}
      <div className="mt-12 flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity cursor-default">
        <ShieldCheck size={18} className="text-red-600" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-500">
          Secured Transaction Portal
        </p>
      </div>
    </div>
  );
};

export default CheckoutSummary;
