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
  Hash,
  ShieldCheck,
  Package,
  Activity,
  ExternalLink,
  Filter,
  MapPin,
  User,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const OrderConfirmationView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchOrderManifest();
  }, []);

  const fetchOrderManifest = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/orders`, {
        withCredentials: true,
      });
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      toast.error('ARCHIVE SYNC FAILED');
    } finally {
      setLoading(false);
    }
  };

  const updateProtocol = async (orderId, newStatus) => {
    setActionLoading(orderId);
    const loadingToast = toast.loading(
      `Transitioning to ${newStatus.toUpperCase()}...`
    );
    try {
      await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.update(loadingToast, {
        render: `PROTOCOL: ${newStatus.toUpperCase()}`,
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      setOrders(prev =>
        prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      toast.update(loadingToast, {
        render: 'TRANSITION FAILED',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const stats = useMemo(() => {
    const pending = orders.filter(
      o => o.status !== 'Successfully Delivered' && o.status !== 'Cancelled'
    ).length;
    const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    return { pending, revenue, total: orders.length };
  }, [orders]);

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12 mt-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Logistics Command Protocol
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Order <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — manifest.
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchOrderManifest}
            className="p-4 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. STATS GRID (Linear Clostich Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard id="01" label="Total Ingress" value={stats.total} />
        <StatCard id="02" label="Awaiting Dispatch" value={stats.pending} red />
        <StatCard
          id="03"
          label="Manifest Magnitude"
          value={`৳${stats.revenue.toLocaleString()}`}
        />
      </div>

      {/* 3. SEARCH & FILTER MATRIX */}
      <div className="flex flex-col lg:flex-row gap-px bg-stone-100 border border-stone-100 shadow-xl">
        <div className="flex-1 bg-white p-6 flex items-center gap-6">
          <Search size={18} className="text-stone-300" />
          <input
            type="text"
            placeholder="SEARCH BY MANIFEST ID OR CITIZEN NAME..."
            className="w-full text-[11px] font-black uppercase tracking-widest outline-none placeholder:text-stone-200"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white p-2 gap-2 overflow-x-auto no-scrollbar">
          {[
            'All',
            'Order Placed',
            'Processing & Verification',
            'En Route to Destination',
            'Out for Delivery',
            'Successfully Delivered',
          ].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-3 whitespace-nowrap text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-400 hover:text-stone-900'}`}
            >
              {status === 'En Route to Destination'
                ? 'Shipped'
                : status === 'Processing & Verification'
                  ? 'Processing'
                  : status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. ORDERS LEDGER TABLE */}
      <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Manifest Identity</th>
                <th className="px-10 py-8">Citizen Narrative</th>
                <th className="px-10 py-8 text-center">Current Matrix</th>
                <th className="px-10 py-8 text-right">Protocol Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-32 text-center">
                    <p className="text-[10px] font-black text-stone-200 uppercase tracking-[0.5em]">
                      No Protocol Matches Found in Archive.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr
                    key={order._id}
                    className="hover:bg-stone-50/30 transition-all group"
                  >
                    {/* Hash ID Column */}
                    <td className="px-10 py-8">
                      <div className="space-y-1">
                        <p className="text-[13px] font-mono font-black text-stone-900 tracking-tighter italic">
                          #{order._id.slice(-12).toUpperCase()}
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock size={10} className="text-red-600" />
                          <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Citizen Info Column */}
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white text-xs font-black relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                          {order.user?.name?.charAt(0) || 'U'}
                          <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-black text-stone-900 uppercase tracking-tight">
                            {order.user?.name || 'Guest Citizen'}
                          </p>
                          <div className="flex items-center gap-2 text-stone-400">
                            <MapPin size={10} className="text-stone-300" />
                            <p className="text-[9px] font-bold uppercase tracking-tighter line-clamp-1">
                              {order.shippingAddress?.district ||
                                'Archive coordinates'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status Matrix Column */}
                    <td className="px-10 py-8 text-center">
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Sequential Actions Column */}
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">
                        {/* Sequential Status Logic */}
                        {(order.status === 'Order Placed' ||
                          order.status === 'Pending') && (
                          <ActionButton
                            label="Verify"
                            onClick={() =>
                              updateProtocol(
                                order._id,
                                'Processing & Verification'
                              )
                            }
                          />
                        )}
                        {(order.status === 'Processing & Verification' ||
                          order.status === 'Processing') && (
                          <ActionButton
                            label="Ship"
                            onClick={() =>
                              updateProtocol(
                                order._id,
                                'En Route to Destination'
                              )
                            }
                            color="bg-blue-600"
                          />
                        )}
                        {(order.status === 'En Route to Destination' ||
                          order.status === 'Shipped') && (
                          <ActionButton
                            label="Out"
                            onClick={() =>
                              updateProtocol(order._id, 'Out for Delivery')
                            }
                            color="bg-orange-600"
                          />
                        )}
                        {order.status === 'Out for Delivery' && (
                          <ActionButton
                            label="Deliver"
                            onClick={() =>
                              updateProtocol(
                                order._id,
                                'Successfully Delivered'
                              )
                            }
                            color="bg-emerald-600"
                          />
                        )}

                        <div className="h-6 w-[1px] bg-stone-100 mx-2" />
                        <Link
                          to={`/order-success/${order._id}`}
                          className="p-3 bg-white border border-stone-100 text-stone-300 hover:text-stone-900 hover:border-stone-900 transition-all"
                        >
                          <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Footer Detail */}
      <div className="p-8 border border-dashed border-stone-100 flex justify-between items-center bg-stone-50/30">
        <div className="flex items-center gap-4">
          <ShieldCheck size={14} className="text-red-600" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400">
            Authenticated Moderator Session Active
          </span>
        </div>
        <p className="text-[8px] font-bold text-stone-300 uppercase tracking-widest italic">
          Inventory Protocol v3.6.0.24
        </p>
      </div>
    </div>
  );
};

// --- Sub-Components (Signature Brutalist Style) ---

const StatCard = ({ label, value, id, red = false }) => (
  <div className="bg-white p-10 space-y-4 relative overflow-hidden group transition-all duration-700 hover:bg-stone-50/50">
    <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors">
      — {id}
    </span>
    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] relative z-10">
      {label}
    </p>
    <h3
      className={`text-3xl font-black ${red ? 'text-red-600' : 'text-stone-900'} tracking-tighter uppercase relative z-10`}
    >
      {value}
    </h3>
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'Successfully Delivered':
      'border-emerald-100 text-emerald-600 bg-emerald-50/30',
    'En Route to Destination': 'border-blue-100 text-blue-600 bg-blue-50/30',
    'Processing & Verification':
      'border-orange-100 text-orange-600 bg-orange-50/30 animate-pulse',
    'Out for Delivery': 'border-purple-100 text-purple-600 bg-purple-50/30',
    'Order Placed': 'border-stone-100 text-stone-400',
    default: 'border-stone-100 text-stone-300',
  };
  return (
    <span
      className={`px-5 py-2 border text-[9px] font-black uppercase tracking-[0.2em] inline-block ${styles[status] || styles.default}`}
    >
      {status || 'Manifested'}
    </span>
  );
};

const ActionButton = ({ label, onClick, color = 'bg-stone-900' }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 ${color} text-white text-[9px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl active:scale-95`}
  >
    {label}
  </button>
);

export default OrderConfirmationView;
