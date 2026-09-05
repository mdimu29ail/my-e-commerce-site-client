import React, { useMemo } from 'react'; // useMemo যোগ করা হয়েছে
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
  Minus as Dash,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = ({ isOpen, onClose }) => {
  // context থেকে ডাটা নেওয়া হচ্ছে
  const { cartItems = [], removeFromCart, updateQuantity } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // ১. সরাসরি এখানে টোটাল ক্যালকুলেট করা হচ্ছে (যাতে কখনও undefined না হয়)
  const totalValue = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.discountPrice || item.price || 0;
      return acc + price * (item.qty || 1);
    }, 0);
  }, [cartItems]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden font-sans">
          {/* ব্যাকড্রপ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white shadow-[0_0_100px_rgba(0,0,0,0.2)] flex flex-col"
            >
              {/* হেডার */}
              <div className="px-8 py-10 flex items-center justify-between border-b border-stone-100 bg-[#FBFBFB]">
                <div className="space-y-1">
                  <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-stone-900 flex items-center gap-3">
                    <Dash size={16} className="text-red-600" />{' '}
                    {t('cart.title') || 'Your Bag'}
                  </h2>
                  <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest pl-7">
                    Archive Selection — {cartItems.length} Pieces
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center border border-stone-100 hover:bg-stone-900 hover:text-white transition-all duration-500 rounded-full"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* প্রোডাক্ট লিস্ট */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10 no-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 border border-dashed border-stone-200 rounded-full flex items-center justify-center opacity-30">
                      <ShoppingBag size={32} strokeWidth={1} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300 italic">
                      Bag currently empty.
                    </p>
                  </div>
                ) : (
                  cartItems.map((item, index) => {
                    const price = item.discountPrice || item.price || 0;
                    return (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-6 group"
                      >
                        <div className="relative w-24 aspect-[4/5] bg-[#F7F7F7] overflow-hidden border border-stone-50">
                          <img
                            src={
                              item.images?.[0] ||
                              item.image ||
                              '/placeholder.jpg'
                            }
                            alt={item.nameEn}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.3em]">
                                — {item.category?.nameEn || 'Piece'}
                              </span>
                              <button
                                onClick={() => removeFromCart(item._id)}
                                className="text-stone-300 hover:text-red-600 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <h3 className="text-[12px] font-black text-stone-900 uppercase tracking-widest leading-snug line-clamp-2">
                              {i18n.language === 'en'
                                ? item.nameEn
                                : item.nameBn}
                            </h3>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-stone-100 p-1">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item._id,
                                    Math.max(1, (item.qty || 1) - 1)
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-600 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-[11px] font-black text-stone-900">
                                {item.qty}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item._id, (item.qty || 1) + 1)
                                }
                                className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-600 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <p className="text-[13px] font-black text-stone-900 tracking-tighter">
                              ৳{(price * item.qty).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* ৪. ফুটার এবং টোটাল ভ্যালু সেকশন */}
              {cartItems.length > 0 && (
                <div className="border-t border-stone-100 p-8 bg-[#FBFBFB] space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-400">
                        Total Value
                      </p>
                      {/* এখন এটি নিশ্চিতভাবে ভ্যালু দেখাবে */}
                      <p className="text-3xl font-black text-stone-900 tracking-tighter">
                        ৳{totalValue.toLocaleString()}
                      </p>
                    </div>
                    <div className="h-[1px] w-full bg-stone-100" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <button
                      onClick={() => {
                        navigate('/checkout');
                        onClose();
                      }}
                      className="w-full bg-stone-900 text-white py-6 font-black text-[11px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-red-600 transition-all shadow-2xl active:scale-95 group"
                    >
                      {t('cart.checkout_btn') || 'Proceed to Atelier'}
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-2 transition-transform"
                      />
                    </button>

                    <Link
                      to="/cart"
                      onClick={onClose}
                      className="w-full text-center text-stone-400 py-2 text-[10px] font-black uppercase tracking-[0.4em] hover:text-stone-900 transition-all"
                    >
                      {t('cart.view_full_cart') || 'Open Bag Narrative'}
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
