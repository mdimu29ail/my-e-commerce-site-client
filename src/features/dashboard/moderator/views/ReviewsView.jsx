import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Star,
  MessageSquare,
  Check,
  X,
  ShieldAlert,
  RefreshCw,
  Minus,
  Search,
  User,
  Package,
  Trash2,
  Activity,
  Hash,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const ReviewsView = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchSentimentLedger();
  }, []);

  const fetchSentimentLedger = async () => {
    setLoading(true);
    try {
      // ব্যাকএন্ড থেকে সব রিভিউ নিয়ে আসা
      const { data } = await axios.get(`${API_URL}/products/all-reviews`, {
        withCredentials: true,
      });
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('SENTIMENT SYNC FAILED');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (productId, reviewId, newStatus) => {
    const loadingToast = toast.loading(
      `Transitioning to ${newStatus.toUpperCase()}...`
    );
    try {
      await axios.put(
        `${API_URL}/products/${productId}/reviews/${reviewId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      toast.update(loadingToast, {
        render: 'PROTOCOL UPDATED',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });

      // লোকাল স্টেট আপডেট
      setReviews(prev =>
        prev.map(r => (r._id === reviewId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      toast.update(loadingToast, {
        render: 'TRANSITION FAILED',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  // --- Intelligence Stats ---
  const stats = useMemo(() => {
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
    const pending = reviews.filter(r => r.status === 'Pending').length;
    return { avg: avg.toFixed(1), total: reviews.length, pending };
  }, [reviews]);

  const filteredReviews = reviews.filter(r => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesSearch =
      (r.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.product?.nameEn || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
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
              Sentiment Management
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Review <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — archive.
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-4">
          <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">
            Ledger Active: {reviews.length} Manifests
          </p>
          <button
            onClick={fetchSentimentLedger}
            className="p-4 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. STATS GRID (Linear Clostich) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard id="01" label="Total Feedback" value={stats.total} />
        <StatCard id="02" label="Global Sentiment" value={`${stats.avg} ★`} />
        <StatCard id="03" label="Awaiting Protocol" value={stats.pending} red />
      </div>

      {/* 3. SEARCH & FILTER MATRIX */}
      <div className="flex flex-col lg:flex-row gap-px bg-stone-100 border border-stone-100">
        <div className="flex-1 bg-white p-6 flex items-center gap-6">
          <Search size={18} className="text-stone-300" />
          <input
            type="text"
            placeholder="FILTER BY CITIZEN OR ARTIFACT..."
            className="w-full text-[11px] font-black uppercase tracking-widest outline-none placeholder:text-stone-200"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white p-2 gap-2 overflow-x-auto no-scrollbar">
          {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-3 whitespace-nowrap text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-400 hover:text-stone-900'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. SENTIMENT LEDGER TABLE */}
      <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Citizen Identity</th>
                <th className="px-10 py-8">Sentiment Narrative</th>
                <th className="px-10 py-8 text-center">Magnitude</th>
                <th className="px-10 py-8 text-right">Protocol Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredReviews.map(rev => (
                <tr
                  key={rev._id}
                  className="hover:bg-stone-50/30 transition-all group"
                >
                  {/* Identity */}
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white text-xs font-black relative overflow-hidden">
                        {rev.user?.avatar || rev.user?.image ? (
                          <img
                            src={rev.user.avatar || rev.user.image}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          rev.user?.name?.charAt(0)
                        )}
                        <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[12px] font-black text-stone-900 uppercase tracking-tight">
                          {rev.user?.name || 'Anonymous'}
                        </p>
                        <p className="text-[9px] font-bold text-stone-400 uppercase flex items-center gap-2">
                          <Package size={10} className="text-red-600" />{' '}
                          {rev.product?.nameEn}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Comment */}
                  <td className="px-10 py-8">
                    <p className="text-[12px] font-medium text-stone-600 leading-relaxed uppercase tracking-tight italic font-serif">
                      "{rev.comment}"
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`px-3 py-0.5 border text-[8px] font-black uppercase tracking-widest ${rev.status === 'Approved' ? 'border-emerald-100 text-emerald-600' : 'border-orange-100 text-orange-600'}`}
                      >
                        {rev.status}
                      </span>
                      <span className="text-[8px] font-bold text-stone-300 uppercase tracking-[0.2em]">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-10 py-8 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-stone-100">
                      <span className="text-[13px] font-black text-stone-900">
                        {rev.rating}
                      </span>
                      <Star
                        size={12}
                        className="text-amber-500 fill-amber-500"
                      />
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                      {rev.status !== 'Approved' && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              rev.product._id,
                              rev._id,
                              'Approved'
                            )
                          }
                          className="p-3 bg-white border border-stone-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {rev.status !== 'Rejected' && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              rev.product._id,
                              rev._id,
                              'Rejected'
                            )
                          }
                          className="p-3 bg-white border border-stone-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredReviews.length === 0 && (
            <div className="py-32 text-center border-t border-stone-50">
              <p className="text-[10px] font-black text-stone-200 uppercase tracking-[0.5em]">
                No Narrative Protocol Matches Found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const StatCard = ({ label, value, id, red = false }) => (
  <div className="bg-white p-10 space-y-4 relative overflow-hidden group">
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

export default ReviewsView;
