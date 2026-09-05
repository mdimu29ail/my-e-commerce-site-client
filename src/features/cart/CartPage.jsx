import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import EmptyState from '../../components/shared/EmptyState';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, clearCart } =
    useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="w-24 h-24 border border-dashed border-stone-200 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={32} className="text-stone-300" strokeWidth={1} />
          </div>
          <h2 className="text-3xl font-light uppercase tracking-[0.5em] text-stone-900">
            Archive Empty.
          </h2>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto">
            Your curated selection is currently empty. Explore our archives to
            add pieces.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-4 bg-stone-900 text-white px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-red-600 transition-all shadow-2xl active:scale-95"
          >
            Explore Collections <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* ১. এডিটোরিয়াল হেডার */}
      <div className="bg-[#F9F9F9] border-b border-stone-100 py-16 md:py-24">
        <div className="container mx-auto  px-6 md:px-12 flex flex-col items-center text-center space-y-6">
          <nav className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
            <Link to="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <Minus size={12} className="text-stone-200" />
            <span className="text-red-600">The Bag</span>
          </nav>
          <h1 className="text-5xl md:text-8xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Your <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — selection.
            </span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto  px-6 md:px-12 py-16">
        <div className="grid lg:grid-cols-12 gap-20">
          {/* ২. লেফট কলাম: প্রোডাক্ট লিস্ট */}
          <div className="lg:col-span-8 space-y-12">
            {/* টেবিল হেডার */}
            <div className="hidden md:grid grid-cols-6 gap-6 pb-6 border-b border-stone-100 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
              <div className="col-span-3">Item Detail</div>
              <div className="text-center">Quantity</div>
              <div className="col-span-2 text-right">Value</div>
            </div>

            <div className="divide-y divide-stone-50">
              <AnimatePresence>
                {cartItems.map(item => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="py-10 grid grid-cols-1 md:grid-cols-6 gap-8 items-center group"
                  >
                    {/* প্রোডাক্ট ইমেজ ও টাইটেল */}
                    <div className="col-span-1 md:col-span-3 flex items-center gap-8">
                      <div className="relative w-24 md:w-32 aspect-[4/5] bg-stone-50 overflow-hidden border border-stone-100">
                        <img
                          src={item.images[0]}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={item.nameEn}
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.3em]">
                          — {item.category?.nameEn || 'Piece'}
                        </span>
                        <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest leading-snug">
                          {i18n.language === 'en' ? item.nameEn : item.nameBn}
                        </h3>
                        <div className="flex items-center gap-4 pt-2">
                          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-tighter italic">
                            Unit Price: ৳{item.discountPrice || item.price}
                          </span>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-stone-300 hover:text-red-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* কোয়ান্টিটি কন্ট্রোল (Linear Style) */}
                    <div className="flex justify-center">
                      <div className="flex items-center border border-stone-100 p-1">
                        <button
                          onClick={() => updateQuantity(item._id, item.qty - 1)}
                          className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-red-600 transition-colors"
                        >
                          —
                        </button>
                        <span className="w-12 text-center font-black text-sm text-stone-900 tracking-tighter">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.qty + 1)}
                          className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-red-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* টোটাল ভ্যালু */}
                    <div className="col-span-1 md:col-span-2 text-right space-y-1">
                      <p className="text-lg font-black text-stone-900 tracking-tighter">
                        ৳
                        {(
                          (item.discountPrice || item.price) * item.qty
                        ).toLocaleString()}
                      </p>
                      <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">
                        VAT Inclusive
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* একশন বাটনস */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-stone-100">
              <Link
                to="/shop"
                className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 hover:text-stone-900 transition-all"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-2 transition-transform"
                />{' '}
                Continue Archiving
              </Link>
              <button
                onClick={clearCart}
                className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-300 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <Minus size={14} /> Clear Selection
              </button>
            </div>
          </div>

          {/* ৩. রাইট কলাম: সামারি (Editorial Panel) */}
          <div className="lg:col-span-4">
            <div className="bg-[#FBFBFB] p-10 md:p-12 sticky top-32 border border-stone-100">
              <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-900 mb-10 border-b border-stone-200 pb-6 flex items-center gap-3">
                <Minus size={16} className="text-red-600" /> Order Summary
              </h4>

              <div className="space-y-6">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-stone-400">
                  <span>Selection Total</span>
                  <span className="text-stone-900">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-stone-400">
                  <span>Shipping Est.</span>
                  <span className="italic text-stone-300 lowercase font-serif">
                    Calculated next —
                  </span>
                </div>

                <div className="pt-8 border-t border-stone-200 flex justify-between items-end">
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-900">
                    Total Value
                  </span>
                  <span className="text-3xl font-black text-stone-900 tracking-tighter">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-stone-900 text-white py-6 mt-12 font-black text-[11px] uppercase tracking-[0.4em] hover:bg-red-600 transition-all shadow-2xl flex items-center justify-center gap-4 group"
              >
                Confirm Selection{' '}
                <ArrowUpRight
                  size={16}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </button>

              <div className="mt-12 space-y-6 pt-10 border-t border-stone-200">
                <div className="flex items-center gap-4 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all cursor-default">
                  <ShieldCheck size={18} className="text-red-600" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-stone-500">
                    Secured Signature Transaction
                  </p>
                </div>
                <p className="text-[8px] text-stone-300 font-bold uppercase tracking-widest leading-relaxed">
                  By proceeding, you acknowledge our artisanal quality standards
                  and signature return policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ৪. ডেকোরেটিভ বটম */}
      <div className="mt-20 py-20 flex flex-col items-center justify-center space-y-8 opacity-20">
        <div className="flex items-center space-x-16">
          <div className="h-[1px] w-32 bg-stone-900" />
          <Minus size={20} className="text-stone-900" />
          <div className="h-[1px] w-32 bg-stone-900" />
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-stone-500">
          — Established Atelier Bag 2024 —
        </p>
      </div>
    </div>
  );
};

export default CartPage;
