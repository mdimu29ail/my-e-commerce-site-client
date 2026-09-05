import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  Minus,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Search,
  ListFilter,
  Archive,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../../../../components/shared/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const SellerOrderManagementView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(null); // নির্দিষ্ট অর্ডারের লোডিং স্টেট
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchOrders();
  }, [API_URL]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/orders/seller/all`, {
        withCredentials: true,
      });
      setOrders(data);
    } catch (err) {
      toast.error('Manifest sync failed');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    if (!newStatus) return;
    setSyncing(orderId);
    try {
      await axios.put(
        `${API_URL}/orders/${orderId}/deliver`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(`Protocol updated to ${newStatus}`);
      fetchOrders(); // রিলোড ছাড়া ডাটা রিফ্রেশ
    } catch (err) {
      toast.error('Override failed');
    } finally {
      setSyncing(null);
    }
  };

  if (loading)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-16 font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* ১. এডিটোরিয়াল হেডার */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-stone-100 pb-12 mt-12">
        <div className="space-y-6 text-left">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Logistics Protocol
            </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Order <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — manifest.
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
          <Minus size={14} className="text-red-600" />
          Active Curation: {orders.length} Deliveries
        </div>
      </div>

      {/* ২. লিনিয়ার অর্ডার আর্কাইভ লিস্ট */}
      <div className="space-y-8">
        {orders.length === 0 ? (
          <div className="py-32 text-center space-y-4 opacity-30 uppercase tracking-[0.5em]">
            <Archive size={40} className="mx-auto mb-4" strokeWidth={1} />
            <p className="text-xs font-black">
              Archive Empty — No orders curated
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-1">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white border border-stone-100 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-10 transition-all duration-700 hover:bg-stone-50/50 hover:shadow-2xl hover:shadow-stone-100"
              >
                {/* ব্যাকগ্রাউন্ড ইনডেক্সিং */}
                <span className="absolute top-6 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors">
                  — 0{index + 1}
                </span>

                <div className="flex-1 space-y-6 z-10 w-full md:w-auto">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.4em]">
                      Archive Reference —
                    </p>
                    <h4 className="text-sm font-black text-stone-900 uppercase tracking-widest break-all">
                      #{order._id.toUpperCase()}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-12">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">
                        Settled Value
                      </p>
                      <p className="text-xl font-black text-stone-900 tracking-tighter">
                        ৳{order.totalPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">
                        Settlement via
                      </p>
                      <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest italic">
                        {order.paymentMethod}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">
                        Ingest Date
                      </p>
                      <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* স্ট্যাটাস ও কন্ট্রোল প্রোটেক্ট */}
                <div className="flex flex-col md:items-end gap-6 w-full md:w-auto z-10">
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-5 py-2 text-[9px] font-black uppercase tracking-[0.3em] border ${
                        order.status === 'Delivered'
                          ? 'border-green-100 bg-green-50 text-green-600'
                          : 'border-red-100 bg-red-50 text-red-600'
                      }`}
                    >
                      {order.status}
                    </span>
                    {syncing === order._id && (
                      <RefreshCw
                        size={14}
                        className="animate-spin text-red-600"
                      />
                    )}
                  </div>

                  {order.status !== 'Delivered' && (
                    <div className="relative group/select w-full md:w-48">
                      <label className="text-[8px] font-black text-stone-300 uppercase tracking-widest block mb-2 text-right">
                        Override Status —
                      </label>
                      <select
                        onChange={e => updateStatus(order._id, e.target.value)}
                        className="w-full bg-stone-900 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 px-5 outline-none cursor-pointer hover:bg-red-600 transition-colors appearance-none"
                      >
                        <option value="">Move Manifest...</option>
                        <option value="Processing">In Process</option>
                        <option value="Shipped">Dispatched</option>
                        <option value="Delivered">Finalized</option>
                      </select>
                      <ChevronRight
                        size={14}
                        className="absolute right-4 bottom-4 text-white pointer-events-none rotate-90"
                      />
                    </div>
                  )}
                </div>

                {/* হোভার রেখা */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ৩. বটম সিগনেচার */}
      <div className="mt-32 flex flex-col items-center justify-center space-y-6 opacity-30">
        <div className="flex items-center space-x-12">
          <div className="h-[1px] w-32 bg-stone-900" />
          <ShieldCheck size={24} className="text-stone-900" strokeWidth={1} />
          <div className="h-[1px] w-32 bg-stone-900" />
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-stone-500">
          — Authenticated Logistics Portal v.2024 —
        </p>
      </div>
    </div>
  );
};

export default SellerOrderManagementView;
