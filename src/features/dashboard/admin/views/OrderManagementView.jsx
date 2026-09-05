import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Minus,
  RefreshCw,
  Search,
  ArrowUpRight,
  ShieldCheck,
  Mail,
  MapPin,
  CreditCard,
  Hash,
  Activity,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const AdminOrderManagementView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      toast.error('Order Archive Sync Failed');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    if (newStatus === 'Cancelled') {
      const confirmCancel = window.confirm('Are you sure you want to cancel this order? This action cannot be reversed.');
      if (!confirmCancel) return;
    }

    const loadingToast = toast.loading('Updating Protocol...');
    try {
      await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.update(loadingToast, {
        render: 'Status Updated',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });

      // ডাটা রিফ্রেশ না করে লোকাল স্টেট আপডেট করা (Better UX)
      setOrders(prev =>
        prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      toast.update(loadingToast, {
        render: 'Protocol Failed',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  // --- Intelligence Stats ---
  const stats = useMemo(() => {
    const total = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const pending = orders.filter(o => o.status !== 'Delivered').length;
    return { total, pending, count: orders.length };
  }, [orders]);

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
    const matchesSearch =
      o._id.includes(searchTerm) ||
      (o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-12 font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* 1. EDITORIAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Logistics Intelligence
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Order <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — fulfillment.
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchOrders}
            className="p-4 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. STATS GRID (Ledger Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard
          id="01"
          label="Revenue Archive"
          value={`৳${stats.total.toLocaleString()}`}
        />
        <StatCard id="02" label="Active Shipments" value={stats.pending} />
        <StatCard id="03" label="Total Ingress" value={stats.count} />
      </div>

      {/* 3. FILTER & SEARCH MATRIX */}
      <div className="flex flex-col lg:flex-row gap-px bg-stone-100 border border-stone-100">
        <div className="flex-1 bg-white p-6 flex items-center gap-6">
          <Search size={18} className="text-stone-300" />
          <input
            type="text"
            placeholder="SEARCH BY ORDER ID OR CLIENT..."
            className="w-full text-[11px] font-black uppercase tracking-widest outline-none placeholder:text-stone-200"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white p-2 gap-2">
          {['All', 'Processing', 'Shipped', 'Delivered'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-400 hover:text-stone-900'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. ORDERS LEDGER */}
      <div className="space-y-12">
        {filteredOrders.length === 0 ? (
          <div className="py-40 text-center border border-dashed border-stone-100">
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
              Archive Empty.
            </p>
          </div>
        ) : (
          filteredOrders.map((order, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              key={order._id}
              className="group bg-white border border-stone-100 overflow-hidden hover:shadow-2xl transition-all duration-700 relative"
            >
              {/* Top Order Ribbon */}
              <div className="flex flex-col lg:flex-row border-b border-stone-50">
                <div className="flex-1 p-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                        Protocol #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <div className="h-4 w-[1px] bg-stone-200" />
                      <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
                        <Clock size={12} />{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                    {/* Client Info */}
                    <div className="space-y-4">
                      <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.3em]">
                        Client Narrative —
                      </p>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-white font-black text-xs">
                          {order.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h4 className="text-[13px] font-black text-stone-900 uppercase tracking-tight">
                            {order.user?.name || 'Guest Client'}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-stone-400 font-medium">
                            <Mail size={10} /> {order.user?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logistics Info */}
                    <div className="space-y-4">
                      <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.3em]">
                        Destination Protocol —
                      </p>
                      <div className="flex items-start gap-3 text-stone-600">
                        <MapPin size={14} className="text-red-600 shrink-0" />
                        <p className="text-[11px] font-medium leading-relaxed">
                          {order.shippingAddress?.address},{' '}
                          {order.shippingAddress?.city} <br />
                          <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest">
                            Contact: {order.shippingAddress?.phone}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commercial Panel */}
                <div className="w-full lg:w-80 bg-stone-50 p-10 flex flex-col justify-between border-l border-stone-100 relative">
                  {/* Top Right Cancel Button for New Orders */}
                  {(order.status === 'Order Placed' || order.status === 'Pending') && (
                    <div className="absolute top-6 right-6">
                      <button
                        onClick={() => updateStatus(order._id, 'Cancelled')}
                        className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 text-[8px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em]">
                      Total Commercials
                    </p>
                    <h3 className="text-4xl font-black text-stone-900 tracking-tighter leading-none">
                      ৳{order.totalPrice.toLocaleString()}
                    </h3>
                    <div className="flex items-center gap-2 pt-2">
                      <CreditCard size={12} className="text-stone-400" />
                      <span className="text-[9px] font-black text-stone-900 uppercase tracking-widest">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {order.status !== 'Successfully Delivered' && (
                    <div className="pt-8 space-y-4">
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em]">
                        Update Status —
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <ActionButton
                          label="Verify"
                          onClick={() => updateStatus(order._id, 'Processing & Verification')}
                          active={order.status === 'Order Placed' || order.status === 'Pending'}
                        />
                        <ActionButton
                          label="Ship"
                          onClick={() => updateStatus(order._id, 'En Route to Destination')}
                          active={
                            order.status === 'Processing & Verification' ||
                            order.status === 'Processing'
                          }
                        />
                        <ActionButton
                          label="Out for Delivery"
                          onClick={() => updateStatus(order._id, 'Out for Delivery')}
                          active={
                            order.status === 'En Route to Destination' ||
                            order.status === 'Shipped'
                          }
                        />
                        <ActionButton
                          label="Deliver"
                          onClick={() => updateStatus(order._id, 'Successfully Delivered')}
                          active={
                            order.status === 'Out for Delivery' ||
                            order.status === 'En Route to Destination' ||
                            order.status === 'Shipped'
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Summary (Expendable or simple list) */}
              <div className="px-10 py-6 bg-white flex items-center gap-6 overflow-x-auto no-scrollbar">
                {order.orderItems?.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 shrink-0 border-r border-stone-100 pr-6 last:border-0"
                  >
                    <div className="w-12 h-12 bg-stone-50 border border-stone-100 p-1">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-stone-900 uppercase truncate max-w-[120px]">
                        {item.name}
                      </p>
                      <p className="text-[9px] font-bold text-stone-400 uppercase">
                        Qty: {item.qty} × ৳{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Hairline Decor */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-1000 group-hover:w-full" />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Sub-Components (Theme Consistent) ---

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
    'Successfully Delivered': 'border-emerald-200 text-emerald-600 bg-emerald-50/50',
    'En Route to Destination': 'border-blue-200 text-blue-600 bg-blue-50/50',
    'Processing & Verification':
      'border-orange-200 text-orange-600 bg-orange-50/50 animate-pulse',
    'Out for Delivery': 'border-purple-200 text-purple-600 bg-purple-50/50',
    'Order Placed': 'border-stone-200 text-stone-400',
    default: 'border-stone-200 text-stone-400',
  };
  return (
    <span
      className={`px-4 py-1.5 border text-[9px] font-black uppercase tracking-[0.2em] ${styles[status] || styles.default}`}
    >
      {status}
    </span>
  );
};

const ActionButton = ({ label, onClick, active }) => (
  <button
    disabled={!active}
    onClick={onClick}
    className={`py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${active ? 'border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white shadow-lg' : 'border-stone-100 text-stone-200 cursor-not-allowed'}`}
  >
    {label}
  </button>
);

export default AdminOrderManagementView;
