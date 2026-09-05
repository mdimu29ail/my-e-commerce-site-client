import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  MessageSquare,
  Check,
  X,
  ShieldAlert,
  RefreshCw,
  Minus,
  Hash,
  Star,
  User,
  Package,
  Search,
  Activity,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const CommentReviewView = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchPendingSentiments();
  }, []);

  const fetchPendingSentiments = async () => {
    setLoading(true);
    try {
      // ব্যাকএন্ড থেকে সব পেন্ডিং রিভিউ নিয়ে আসা
      const { data } = await axios.get(`${API_URL}/products/all-reviews`, {
        withCredentials: true,
      });
      // শুধু 'Pending' স্ট্যাটাসগুলো ফিল্টার করা (যদি ব্যাকএন্ড সব পাঠায়)
      const pendingOnes = data.filter(r => r.status === 'Pending');
      setReviews(pendingOnes);
    } catch (err) {
      toast.error('SENTIMENT ARCHIVE SYNC FAILED');
    } finally {
      setLoading(false);
    }
  };

  const handleProtocolAction = async (productId, reviewId, action) => {
    const status = action === 'approve' ? 'Approved' : 'Rejected';
    const loadingToast = toast.loading(
      `Executing ${status.toUpperCase()} protocol...`
    );

    try {
      await axios.put(
        `${API_URL}/products/${productId}/reviews/${reviewId}/status`,
        { status },
        { withCredentials: true }
      );

      toast.update(loadingToast, {
        render: `SENTIMENT ${status.toUpperCase()}`,
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });

      // লিস্ট থেকে সরিয়ে ফেলা
      setReviews(prev => prev.filter(r => r._id !== reviewId));
    } catch (err) {
      toast.update(loadingToast, {
        render: 'ACTION FAILED',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const filteredReviews = reviews.filter(
    r =>
      r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Sentiment Filtration
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Comment <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — review.
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-4">
          <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">
            Pending Manifests: {reviews.length}
          </p>
          <button
            onClick={fetchPendingSentiments}
            className="p-4 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. SEARCH MATRIX */}
      <div className="bg-white border border-stone-100 flex items-center px-8 py-2 shadow-2xl shadow-stone-200/20">
        <Search size={18} className="text-stone-300" />
        <input
          type="text"
          placeholder="FILTER NARRATIVES..."
          className="w-full p-4 text-[11px] font-black uppercase tracking-widest outline-none placeholder:text-stone-200"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 3. SENTIMENT LEDGER TABLE */}
      <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Citizen Identity</th>
                <th className="px-10 py-8">Narrative Manifest</th>
                <th className="px-10 py-8 text-center">Rating</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-32 text-center">
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
                      No Pending Sentiments in Archive.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map(rev => (
                  <tr
                    key={rev._id}
                    className="hover:bg-stone-50/30 transition-all group"
                  >
                    {/* Identity */}
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-white text-[10px] font-black overflow-hidden border border-stone-800">
                          {rev.user?.avatar || rev.user?.image ? (
                            <img
                              src={rev.user.avatar || rev.user.image}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          ) : (
                            rev.user?.name?.charAt(0)
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-black text-stone-900 uppercase tracking-tight">
                            {rev.user?.name || 'Unknown'}
                          </p>
                          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
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
                      <p className="text-[8px] font-bold text-stone-300 uppercase mt-2 tracking-widest">
                        INGESTED: {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    {/* Rating */}
                    <td className="px-10 py-8 text-center">
                      <div className="inline-flex items-center gap-1 px-3 py-1 border border-stone-100">
                        <span className="text-[12px] font-black text-stone-900">
                          {rev.rating}
                        </span>
                        <Star
                          size={10}
                          className="text-amber-500 fill-amber-500"
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                        <button
                          onClick={() =>
                            handleProtocolAction(
                              rev.product._id,
                              rev._id,
                              'approve'
                            )
                          }
                          className="p-3 bg-white border border-stone-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          title="Approve Protocol"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleProtocolAction(
                              rev.product._id,
                              rev._id,
                              'reject'
                            )
                          }
                          className="p-3 bg-white border border-stone-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Reject & Purge"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Footer */}
      <div className="p-8 bg-stone-50 border border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-stone-400 uppercase tracking-widest text-[9px] font-black">
          <ShieldAlert size={14} className="text-red-600" />
          Moderator Supervision Active
        </div>
        <span className="text-[8px] font-bold text-stone-300 uppercase tracking-[0.4em]">
          Archive Protocol v3.6.0
        </span>
      </div>
    </div>
  );
};

export default CommentReviewView;
