import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBag,
  Search,
  ChevronRight,
  Clock,
  CheckCircle2,
  Package,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
  Calendar,
  Eye,
  Truck,
  Minus,
  Hash,
  Activity,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';
import EmptyState from '../../../../components/shared/EmptyState';

const UserMyOrders = () => {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/orders/myorders`, {
        withCredentials: true,
      });
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      toast.error('Archive Sync Failed');
    } finally {
      setLoading(false);
    }
  };

  // --- Intelligence Stats ---
  const stats = useMemo(() => {
    const total = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    return { total, delivered, count: orders.length };
  }, [orders]);

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-12 font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* ১. এডিটোরিয়াল হেডার */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12 mt-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Personal Purchase Manifest
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            My <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — archives.
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-4">
          <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">
            Historical Ledger Active
          </p>
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300"
              size={16}
            />
            <input
              type="text"
              placeholder="INGEST ORDER ID —"
              className="w-full pl-12 pr-4 py-4 bg-white border border-stone-100 text-[11px] font-black uppercase tracking-widest outline-none focus:border-red-600 transition-all placeholder:text-stone-200 shadow-xl shadow-stone-100/50"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ২. ইন্টেলিজেন্স গ্রিড (Linear Clostich Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard
          id="01"
          label="Total Outflow"
          value={`৳${stats.total.toLocaleString()}`}
        />
        <StatCard id="02" label="Successful Ingress" value={stats.delivered} />
        <StatCard id="03" label="Archive Count" value={stats.count} />
      </div>

      {/* ৩. অর্ডার লেজার লিস্ট */}
      {filteredOrders.length === 0 ? (
        <div className="py-40 text-center border border-dashed border-stone-100">
          <AlertCircle size={40} className="mx-auto text-stone-100 mb-6" />
          <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
            Ledger Currently Empty.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-8 text-[10px] font-black text-red-600 uppercase tracking-widest border-b border-red-100 pb-1"
          >
            Initialize Ingress
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredOrders.map((order, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              key={order._id}
              className="group bg-white border border-stone-100 overflow-hidden hover:shadow-2xl transition-all duration-700 relative"
            >
              <div className="p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* Identity & Visual */}
                <div className="flex items-center gap-10 w-full lg:w-auto">
                  <div className="relative shrink-0">
                    <div className="w-20 h-28 bg-stone-50 border border-stone-100 overflow-hidden group/img">
                      <img
                        src={order.orderItems[0]?.image}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110"
                        alt="Manifest"
                      />
                    </div>
                    {order.orderItems.length > 1 && (
                      <div className="absolute -bottom-3 -right-3 bg-stone-900 text-white text-[9px] font-black px-2 py-1 shadow-2xl">
                        +{order.orderItems.length - 1} PIECES
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Hash size={12} className="text-red-600" />
                      <span className="text-[11px] font-mono font-black text-stone-900 tracking-tighter">
                        PROTOCOL #{order._id.slice(-12).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest">
                          Ingestion Date
                        </p>
                        <p className="text-[10px] font-black text-stone-900 uppercase">
                          {new Date(order.createdAt).toLocaleDateString(
                            'en-GB',
                            { day: '2-digit', month: 'short', year: 'numeric' }
                          )}
                        </p>
                      </div>
                      <div className="h-6 w-[1px] bg-stone-100" />
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest">
                          Payment
                        </p>
                        <span
                          className={`text-[9px] font-black uppercase ${order.isPaid ? 'text-emerald-600' : 'text-red-600'}`}
                        >
                          {order.isPaid ? 'Verified' : 'Awaiting'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Magnitude (Total) */}
                <div className="flex flex-col items-center lg:items-start gap-1 w-full lg:w-40 border-y lg:border-0 border-stone-50 py-6 lg:py-0">
                  <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.3em]">
                    Magnitude —
                  </p>
                  <h4 className="text-3xl font-black text-stone-900 tracking-tighter">
                    ৳{order.totalPrice.toLocaleString()}
                  </h4>
                </div>

                {/* Status & Protocol Actions */}
                <div className="flex flex-col md:flex-row items-center gap-8 w-full lg:w-auto justify-between lg:justify-end">
                  <StatusBadge status={order.status} />

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/order-success/${order._id}`}
                      className="w-14 h-14 bg-white border border-stone-100 flex items-center justify-center text-stone-300 hover:text-stone-900 hover:border-stone-900 transition-all shadow-sm"
                      title="Examine Protocol"
                    >
                      <Eye size={20} strokeWidth={1.5} />
                    </Link>
                    <Link
                      to={`/user/tracking?id=${order._id}`}
                      className="w-14 h-14 bg-stone-900 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-xl"
                      title="Initialize Tracking"
                    >
                      <Truck size={20} strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Hairline Decor */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-1000 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Sub-Components (Signature Styles) ---

const StatCard = ({ label, value, id }) => (
  <div className="bg-white p-10 space-y-4 relative overflow-hidden group">
    <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors">
      — {id}
    </span>
    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] relative z-10">
      {label}
    </p>
    <h3 className="text-3xl font-black text-stone-900 tracking-tighter uppercase relative z-10">
      {value}
    </h3>
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Delivered: 'border-emerald-100 text-emerald-600 bg-emerald-50/50',
    Shipped: 'border-blue-100 text-blue-600 bg-blue-50/50',
    Processing:
      'border-orange-100 text-orange-600 bg-orange-50/50 animate-pulse',
    Cancelled: 'border-red-100 text-red-600 bg-red-50/50',
    default: 'border-stone-100 text-stone-300',
  };
  return (
    <span
      className={`px-6 py-2 border text-[9px] font-black uppercase tracking-[0.3em] ${styles[status] || styles.default}`}
    >
      {status || 'Manifested'}
    </span>
  );
};

export default UserMyOrders;
