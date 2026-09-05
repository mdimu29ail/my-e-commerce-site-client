import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Minus,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  User,
  Package,
  Filter,
  Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminReviewForm from '../components/AdminReviewForm';
import Loader from '../../../../components/shared/Loader';

const AdminReviewsView = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // এই রাউটটি আপনার ব্যাকএন্ডে (productRoutes.js) ইমপ্লিমেন্ট করা থাকতে হবে
      const { data } = await axios.get(`${API_URL}/products/all-reviews`, {
        withCredentials: true,
      });
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Archive Sync Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusChange = async (productId, reviewId, status) => {
    const loadingToast = toast.loading('Updating Protocol...');
    try {
      await axios.put(
        `${API_URL}/products/${productId}/reviews/${reviewId}/status`,
        { status },
        { withCredentials: true }
      );
      toast.update(loadingToast, {
        render: `Sentiment ${status}`,
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      fetchReviews();
    } catch (error) {
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
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
    const pending = reviews.filter(r => r.status === 'Pending').length;
    return { avg: avg.toFixed(1), total: reviews.length, pending };
  }, [reviews]);

  const filteredReviews = reviews.filter(r => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesSearch =
      (r.product?.nameEn || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (r.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading && reviews.length === 0)
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
              Sentiment Intelligence
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Archive <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — sentiment.
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchReviews}
            className="p-4 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-stone-900 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 hover:bg-red-600 transition-all shadow-2xl"
          >
            {showAddForm ? <Minus size={16} /> : <Plus size={16} />}
            {showAddForm ? 'View Ledger' : 'Ingest Sentiment'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showAddForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            <AdminReviewForm
              onReviewAdded={() => {
                setShowAddForm(false);
                fetchReviews();
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="ledger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            {/* 2. STATS MATRIX */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
              <StatCard id="01" label="Total Feedback" value={stats.total} />
              <StatCard
                id="02"
                label="Avg Sentiment"
                value={`${stats.avg} ★`}
              />
              <StatCard
                id="03"
                label="Awaiting Protocol"
                value={stats.pending}
                red
              />
            </div>

            {/* 3. FILTER MATRIX */}
            <div className="flex flex-col lg:flex-row gap-px bg-stone-100 border border-stone-100">
              <div className="flex-1 bg-white p-6 flex items-center gap-6">
                <Search size={18} className="text-stone-300" />
                <input
                  type="text"
                  placeholder="SEARCH BY CLIENT OR PRODUCT..."
                  className="w-full text-[11px] font-black uppercase tracking-widest outline-none placeholder:text-stone-200"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex bg-white p-2 gap-2">
                {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-400 hover:text-stone-900'}`}
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
                      <th className="px-10 py-8">Client Narrative</th>
                      <th className="px-10 py-8">Product Archive</th>
                      <th className="px-10 py-8 text-center">Sentiment</th>
                      <th className="px-10 py-8 text-center">Status</th>
                      <th className="px-10 py-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredReviews.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-20 text-center text-[10px] font-black uppercase text-stone-300 tracking-[0.5em]"
                        >
                          No sentiments found in archive.
                        </td>
                      </tr>
                    ) : (
                      filteredReviews.map(rev => (
                        <tr
                          key={rev._id}
                          className="hover:bg-stone-50/30 transition-all group"
                        >
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-white font-black text-xs">
                                {rev.user?.name?.charAt(0) || (
                                  <User size={14} />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-[12px] font-black text-stone-900 uppercase tracking-tighter">
                                  {rev.user?.name || 'Anonymous'}
                                </p>
                                <p className="text-[10px] text-stone-400 font-medium italic line-clamp-1 max-w-xs">
                                  "{rev.comment}"
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-3">
                              <Package size={14} className="text-stone-300" />
                              <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest truncate max-w-[150px]">
                                {rev.product?.nameEn}
                              </span>
                            </div>
                          </td>
                          <td className="px-10 py-8 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-[12px] font-black text-stone-900">
                                {rev.rating}
                              </span>
                              <Star
                                size={12}
                                className="text-amber-500 fill-amber-500"
                              />
                            </div>
                          </td>
                          <td className="px-10 py-8 text-center">
                            <StatusBadge status={rev.status} />
                          </td>
                          <td className="px-10 py-8 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                              {rev.status !== 'Approved' && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(
                                      rev.product._id,
                                      rev._id,
                                      'Approved'
                                    )
                                  }
                                  className="p-3 bg-white border border-stone-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                              )}
                              {rev.status !== 'Rejected' && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(
                                      rev.product._id,
                                      rev._id,
                                      'Rejected'
                                    )
                                  }
                                  className="p-3 bg-white border border-stone-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                >
                                  <XCircle size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-Components (Theme Consistent) ---

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

const StatusBadge = ({ status }) => {
  const styles = {
    Approved: 'border-emerald-100 text-emerald-600 bg-emerald-50/30',
    Rejected: 'border-red-100 text-red-600 bg-red-50/30',
    Pending: 'border-amber-100 text-amber-600 bg-amber-50/30 animate-pulse',
    default: 'border-stone-100 text-stone-400',
  };
  return (
    <span
      className={`px-4 py-1.5 border text-[9px] font-black uppercase tracking-[0.2em] ${styles[status] || styles.default}`}
    >
      {status || 'Unknown'}
    </span>
  );
};

export default AdminReviewsView;
