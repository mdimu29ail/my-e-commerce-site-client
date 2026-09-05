import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import CheckoutSummary from './components/CheckoutSummary';
import PaymentForm from './components/PaymentForm';
import { MapPin, Phone, Minus, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { t } = useTranslation();
  const { cartItems, totalPrice: subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  
  // Enhanced Discount State
  const [discount, setDiscount] = useState({
    value: 0,
    type: 'percentage', // 'percentage' or 'fixed'
    code: ''
  });

  const [shippingAddress, setShippingAddress] = useState({
    division: '',
    district: '',
    upazila: '',
    addressDetail: '',
    phone: user?.phone || '',
  });

  // --- Dynamic Calculation Engine ---
  const { shippingCost, discountAmount, taxAmount, finalTotalPrice } = useMemo(() => {
    const safeSubtotal = Number(subtotal) || 0;
    const sCost = 80; // Fixed Logistics Fee
    const tRate = 0; // Tax rate (e.g., 0.05 for 5%)
    
    let dAmount = 0;
    if (discount.type === 'percentage') {
      dAmount = Math.floor((safeSubtotal * discount.value) / 100);
    } else {
      dAmount = discount.value;
    }

    const tAmount = Math.floor((safeSubtotal - dAmount) * tRate);
    const fTotal = (safeSubtotal - dAmount) + sCost + tAmount;

    return {
      shippingCost: sCost,
      discountAmount: dAmount,
      taxAmount: tAmount,
      finalTotalPrice: fTotal > 0 ? fTotal : 0,
    };
  }, [subtotal, discount]);

  const handleChange = e => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (
      !shippingAddress.division ||
      !shippingAddress.district ||
      !shippingAddress.upazila ||
      !shippingAddress.addressDetail ||
      !shippingAddress.phone
    ) {
      return toast.error('Selection required: Complete logistics details');
    }

    setLoading(true);
    try {
      const formattedOrderItems = cartItems.map(item => ({
        nameEn: item.nameEn,
        nameBn: item.nameBn,
        qty: item.qty,
        image: item.images?.[0] || 'https://via.placeholder.com/150',
        price: item.discountPrice || item.price,
        product: item._id,
        seller: item.seller?._id || item.seller,
      }));

      const orderData = {
        orderItems: formattedOrderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shippingCost,
        taxPrice: taxAmount,
        discountAmount: discountAmount,
        totalPrice: finalTotalPrice,
        couponCode: discount.code,
      };

      const API_URL =
        import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const { data } = await axios.post(`${API_URL}/orders`, orderData, {
        withCredentials: true,
      });

      if (paymentMethod !== 'Cash on Delivery') {
        const payRes = await axios.post(
          `${API_URL}/payment/initiate`,
          { orderId: data._id },
          { withCredentials: true }
        );
        if (payRes.data.url) window.location.href = payRes.data.url;
      } else {
        toast.success('Archive Order Confirmed');
        clearCart();
        window.location.href = `/order-success/${data._id}`;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Transaction could not be completed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      <div className="bg-[#F9F9F9] border-b border-stone-100 py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start space-y-8"
          >
            <nav className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
              <Link to="/" className="hover:text-red-600 transition-colors">
                Atelier
              </Link>
              <Minus size={12} className="text-stone-200" />
              <Link to="/cart" className="hover:text-red-600 transition-colors">
                Bag
              </Link>
              <Minus size={12} className="text-stone-200" />
              <span className="text-red-600">Secure Checkout</span>
            </nav>
            <h1 className="text-5xl md:text-8xl font-light text-stone-900 tracking-tighter leading-none uppercase">
              Finalize <br />{' '}
              <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
                — transaction.
              </span>
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24">
          <div className="lg:col-span-8 space-y-24">
            <section className="space-y-12">
              <div className="flex items-center justify-between border-b border-stone-100 pb-6">
                <h2 className="text-[14px] font-black uppercase tracking-[0.5em] text-stone-900 flex items-center gap-4">
                  <MapPin size={18} className="text-red-600" /> 01. Delivery
                  Logistics
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="md:col-span-2">
                  <HumanistInput
                    label="Contact Phone"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    icon={<Phone size={14} />}
                  />
                </div>
                <HumanistInput
                  label="Division"
                  name="division"
                  value={shippingAddress.division}
                  onChange={handleChange}
                  placeholder="e.g. Dhaka"
                />
                <HumanistInput
                  label="District"
                  name="district"
                  value={shippingAddress.district}
                  onChange={handleChange}
                  placeholder="e.g. Dhaka"
                />
                <HumanistInput
                  label="Upazila"
                  name="upazila"
                  value={shippingAddress.upazila}
                  onChange={handleChange}
                  placeholder="e.g. Gulshan"
                />
                <div className="md:col-span-2">
                  <HumanistInput
                    label="Detailed Address"
                    name="addressDetail"
                    value={shippingAddress.addressDetail}
                    onChange={handleChange}
                    placeholder="House, Road, Floor..."
                    isTextArea
                  />
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center justify-between border-b border-stone-100 pb-6">
                <h2 className="text-[14px] font-black uppercase tracking-[0.5em] text-stone-900 flex items-center gap-4">
                  <ShieldCheck size={18} className="text-red-600" /> 02. Secure
                  Settlement
                </h2>
              </div>
              <div className="bg-stone-50/50 p-8 md:p-12 border border-stone-100">
                <PaymentForm
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  handlePlaceOrder={handlePlaceOrder}
                  loading={loading}
                  finalTotal={finalTotalPrice}
                  discountAmount={discountAmount}
                  onCouponApply={(value, type, code) =>
                    setDiscount({ value, type, code })
                  }
                  onCouponRemove={() =>
                    setDiscount({ value: 0, type: 'percentage', code: '' })
                  }
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <CheckoutSummary
                shippingCost={shippingCost}
                discountAmount={discountAmount}
                taxAmount={taxAmount}
                totalWithDiscount={finalTotalPrice}
              />
              <div className="mt-10 px-4 flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-all duration-700">
                <div className="flex items-center gap-4 w-full">
                  <div className="h-[1px] flex-1 bg-stone-900" />
                  <Minus size={16} />
                  <div className="h-[1px] flex-1 bg-stone-900" />
                </div>
                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-center">
                  Authenticated Portal — v.2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HumanistInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  isTextArea = false,
  icon,
}) => (
  <div className="space-y-4 group">
    <label className="text-[9px] font-black text-stone-400 uppercase tracking-[0.4em] flex items-center gap-2 group-focus-within:text-red-600 transition-colors">
      {icon} {label} —
    </label>
    {isTextArea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows="2"
        className="w-full bg-transparent border-b border-stone-100 py-3 text-[13px] font-bold text-stone-900 placeholder:text-stone-200 focus:outline-none focus:border-red-600 transition-all uppercase tracking-widest resize-none"
        placeholder={placeholder}
      />
    ) : (
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border-b border-stone-100 py-3 text-[13px] font-bold text-stone-900 placeholder:text-stone-200 focus:outline-none focus:border-red-600 transition-all uppercase tracking-widest"
        placeholder={placeholder}
      />
    )}
  </div>
);

export default Checkout;
