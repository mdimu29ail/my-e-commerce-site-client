import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Star,
  Minus,
  User,
  Package,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../../../../components/shared/Loader';

const ModeratorCorrespondenceView = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products/all-reviews`, {
        withCredentials: true,
      });
      setReviews(data);
    } finally {
      setLoading(false);
    }
  };

  const updateSentiment = async (productId, reviewId, status) => {
    try {
      await axios.put(
        `${API_URL}/products/${productId}/reviews/${reviewId}/status`,
        { status },
        { withCredentials: true }
      );
      toast.success(`SENTIMENT: ${status.toUpperCase()}`);
      setReviews(prev =>
        prev.map(r => (r._id === reviewId ? { ...r, status } : r))
      );
    } catch (err) {
      toast.error('SENTIMENT OVERRIDE FAILED');
    }
  };

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-12 font-sans selection:bg-red-50 pb-32">
      <div className="border-b border-stone-100 pb-12 mt-10 space-y-6">
        <div className="flex items-center gap-4 text-red-600">
          <Minus size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">
            Sentiment Ingestion
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter uppercase leading-none">
          Reviews <br />
          <span className="italic font-serif text-red-600 lowercase">
            — correspondence.
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-white border border-stone-100 p-8 space-y-8 hover:shadow-2xl transition-all duration-700 relative overflow-hidden group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-white font-black text-xs">
                  {rev.user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-[11px] font-black text-stone-900 uppercase tracking-tighter">
                    {rev.user?.name}
                  </p>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={10} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <span
                className={`px-4 py-1.5 border text-[8px] font-black uppercase tracking-widest ${rev.status === 'Approved' ? 'border-emerald-100 text-emerald-600' : 'border-orange-100 text-orange-600 animate-pulse'}`}
              >
                {rev.status}
              </span>
            </div>

            <p className="text-[12px] font-medium text-stone-500 leading-loose uppercase tracking-[0.1em]">
              "{rev.comment}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-stone-50">
              <div className="flex items-center gap-2 text-stone-400">
                <Package size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {rev.product?.nameEn}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSentiment(rev.product._id, rev._id, 'Approved')
                  }
                  className="p-3 bg-stone-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                >
                  <CheckCircle2 size={16} />
                </button>
                <button
                  onClick={() =>
                    updateSentiment(rev.product._id, rev._id, 'Rejected')
                  }
                  className="p-3 bg-stone-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                >
                  <XCircle size={16} />
                </button>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModeratorCorrespondenceView;
