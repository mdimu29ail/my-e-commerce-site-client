import React, { useState } from 'react';
import {
  CreditCard,
  Truck,
  Smartphone,
  ShieldCheck,
  CreditCard as CardIcon,
  RefreshCw,
  Minus,
  Lock,
  Copy,
  Check,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentForm = ({
  paymentMethod,
  setPaymentMethod,
  handlePlaceOrder,
  loading,
  finalTotal = 0, // Parent (Checkout.jsx) থেকে আসা মোট দাম
  onCouponApply,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // MFS Selection State
  const [mfsProvider, setMfsProvider] = useState('bKash');
  const [copied, setCopied] = useState(false);

  const mfsNumbers = {
    bKash: '01711-000000',
    Nagad: '01811-000000',
  };

  const copyToClipboard = number => {
    navigator.clipboard.writeText(number);
    setCopied(true);
    toast.success('Number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // ১. কার্ড ইনফরমেশন এবং টাইপ ডিটেকশন স্টেট
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // --- ফিক্সড: নিশ্চিত করা হচ্ছে এটি একটি বৈধ সংখ্যা ---
  const safeTotal = Number(finalTotal) || 0;

  // ২. কার্ড টাইপ ডিটেকশন ফাংশন
  const getCardType = num => {
    const rawNum = num.replace(/\s?/g, '');
    if (rawNum.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(rawNum) || /^2[2-7]/.test(rawNum)) return 'mastercard';
    return 'unknown';
  };

  // ৩. স্মার্ট কার্ড নাম্বার হ্যান্ডলার (Max 16 Digits + Formatting)
  const handleCardNumberChange = e => {
    let value = e.target.value.replace(/\D/g, ''); // শুধু নাম্বার রাখা
    if (value.length > 16) value = value.slice(0, 16); // ১৬ ডিজিট লিমিট

    // ৪ ডিজিট পর পর স্পেস বসানো (0000 0000 0000 0000)
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardInfo({ ...cardInfo, number: formattedValue });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return toast.warn('Please enter a privilege code');
    setCouponLoading(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/coupons/validate`,
        { code: couponCode },
        { withCredentials: true }
      );
      setAppliedCoupon(data);
      if (onCouponApply) onCouponApply(data.discount);
      toast.success(`Exclusive ${data.discount}% discount applied`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setCouponLoading(false);
    }
  };

  const cardType = getCardType(cardInfo.number);

  const methods = [
    {
      id: 'bKash',
      label: 'MFS (bKash / Nagad)',
      icon: <Smartphone size={20} strokeWidth={1.5} />,
    },
    {
      id: 'Card',
      label: 'Digital Card (Visa / MC)',
      icon: <CreditCard size={20} strokeWidth={1.5} />,
    },
    {
      id: 'Cash on Delivery',
      label: 'Pay at Destination',
      icon: <Truck size={20} strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="space-y-16 font-sans selection:bg-red-50 selection:text-red-600">
      {/* কুপন সেকশন */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 text-red-600">
          <Minus size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">
            Privilege Access
          </span>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full space-y-4 group">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] ml-1 group-focus-within:text-red-600 transition-colors">
              Promo Code —
            </label>
            <input
              type="text"
              placeholder="ENTER CODE..."
              className="w-full bg-transparent border-b border-stone-100 py-3 text-[13px] font-bold text-stone-900 placeholder:text-stone-200 focus:outline-none focus:border-red-600 transition-all uppercase tracking-widest"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              disabled={appliedCoupon}
            />
          </div>
          <button
            type="button"
            onClick={handleApplyCoupon}
            disabled={couponLoading || appliedCoupon}
            className={`px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 border ${appliedCoupon ? 'bg-green-50 border-green-100 text-green-600' : 'bg-stone-900 text-white border-stone-900 hover:bg-red-600 hover:border-red-600'}`}
          >
            {couponLoading ? '...' : appliedCoupon ? 'Applied' : 'Apply Code'}
          </button>
        </div>
      </section>

      {/* মেথড সিলেকশন */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 text-stone-900">
          <Minus size={14} className="text-red-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">
            Settlement Method
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100">
          {methods.map(method => {
            const isActive = paymentMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id)}
                className={`relative p-8 flex flex-col items-center justify-center gap-6 transition-all duration-700 bg-white ${isActive ? 'z-10 shadow-2xl scale-[1.02]' : 'hover:bg-stone-50/50'}`}
              >
                <div
                  className={`transition-all duration-500 ${isActive ? 'text-red-600 scale-110' : 'text-stone-300'}`}
                >
                  {method.icon}
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-stone-900' : 'text-stone-400'}`}
                >
                  {method.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="active-method"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600"
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* পেমেন্ট ডিটেইলস */}
      <div className="min-h-[150px]">
        <AnimatePresence mode="wait">
          {paymentMethod === 'bKash' && (
            <motion.div
              key="mfs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-10 bg-stone-50 border-l-4 border-red-600 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-900 flex items-center gap-3">
                  <Smartphone size={16} strokeWidth={1.5} /> Mobile Banking
                  Gateway
                </h4>
                <div className="flex gap-4">
                  {['bKash', 'Nagad'].map(provider => (
                    <button
                      key={provider}
                      onClick={() => setMfsProvider(provider)}
                      className={`px-4 py-2 text-[10px] font-black uppercase border transition-all ${mfsProvider === provider ? 'bg-stone-900 text-white' : 'bg-white text-stone-400 border-stone-200'}`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between bg-white p-4 border border-stone-200">
                <span className="text-lg font-mono font-bold">
                  {mfsNumbers[mfsProvider]}
                </span>
                <button
                  onClick={() => copyToClipboard(mfsNumbers[mfsProvider])}
                  className="p-2 text-stone-400 hover:text-red-600"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </motion.div>
          )}

          {paymentMethod === 'Card' && (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-10 bg-stone-50 border-l-4 border-stone-900 space-y-10"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-900 flex items-center gap-3">
                  <CardIcon size={16} strokeWidth={1.5} />
                  {cardType === 'visa'
                    ? 'Visa Processing'
                    : cardType === 'mastercard'
                      ? 'Mastercard Processing'
                      : 'Card Information'}
                </h4>
                <div className="flex gap-4 items-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg"
                    className={`h-3 transition-all duration-500 ${cardType === 'visa' ? 'opacity-100 grayscale-0 scale-110' : 'opacity-20 grayscale'}`}
                    alt="Visa"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    className={`h-5 transition-all duration-500 ${cardType === 'mastercard' ? 'opacity-100 grayscale-0 scale-110' : 'opacity-20 grayscale'}`}
                    alt="Mastercard"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="NAME ON CARD"
                    className="w-full bg-transparent border-b border-stone-200 py-2 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest tracking-widest flex justify-between">
                    <span>Card Number</span>
                    <span
                      className={
                        cardInfo.number.replace(/\s/g, '').length === 16
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {cardInfo.number.replace(/\s/g, '').length}/16
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardInfo.number}
                    onChange={handleCardNumberChange}
                    className="w-full bg-transparent border-b border-stone-200 py-2 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full bg-transparent border-b border-stone-200 py-2 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">
                    Security CVV
                  </label>
                  <input
                    type="password"
                    maxLength="3"
                    placeholder="***"
                    className="w-full bg-transparent border-b border-stone-200 py-2 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-600 transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {paymentMethod === 'Cash on Delivery' && (
            <motion.div
              key="cod"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-10 bg-stone-50 border-l-4 border-amber-600 flex items-start gap-6"
            >
              <Truck size={24} strokeWidth={1} className="text-stone-400" />
              <div className="space-y-2">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-900">
                  Pay at Destination
                </h4>
                <p className="text-[11px] text-stone-400 uppercase tracking-widest leading-loose">
                  Settle the transaction in cash upon receiving your archive
                  piece.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-10 border-t border-stone-100">
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-stone-900 text-white py-6 rounded-full font-black text-xs uppercase tracking-[0.5em] hover:bg-red-600 transition-all duration-700 shadow-2xl flex items-center justify-center disabled:bg-stone-100 group"
        >
          {loading ? (
            <RefreshCw className="animate-spin mr-4" size={20} />
          ) : (
            <ShieldCheck
              className="mr-4 group-hover:scale-110 transition-transform"
              size={20}
            />
          )}
          {/* ফিক্সড: এখানে এখন সাবটোটাল নয় বরং ফাইনাল টোটাল (shipping সহ) শো করবে */}
          {paymentMethod === 'Cash on Delivery'
            ? 'Confirm Archive Order'
            : `Pay ৳${safeTotal.toLocaleString()} Securely`}
        </button>
        <div className="mt-8 flex flex-col items-center gap-3 opacity-20">
          <div className="flex items-center gap-4 w-full">
            <div className="h-[1px] flex-1 bg-stone-900" />
            <div className="flex items-center gap-2">
              <Lock size={12} className="text-red-600" />
              <span className="text-[8px] font-black uppercase tracking-[0.4em]">
                Secure Gateway
              </span>
            </div>
            <div className="h-[1px] flex-1 bg-stone-900" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
