import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Star,
  Send,
  Minus,
  Hash,
  User,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminReviewForm = ({ productId: propProductId, onReviewAdded }) => {
  const [formData, setFormData] = useState({
    productId: propProductId || '',
    rating: 5,
    comment: '',
    userId: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.productId) {
      toast.error('Archive Reference (ProductID) Required');
      return;
    }
    setLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(
        `${API_URL}/products/${formData.productId}/admin-reviews`,
        {
          rating: formData.rating,
          comment: formData.comment,
          userId: formData.userId,
        },
        {
          withCredentials: true,
        }
      );
      toast.success('Sentiment successfully ingested into Archive');
      setFormData({
        productId: propProductId || '',
        rating: 5,
        comment: '',
        userId: '',
      });
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Protocol Failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-stone-100 p-10 space-y-12 shadow-2xl shadow-stone-200/20 max-w-2xl mx-auto relative overflow-hidden"
    >
      {/* 1. EDITORIAL HEADER */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-red-600">
          <Minus size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">
            Sentiment Ingestion
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-light text-stone-900 tracking-tighter uppercase leading-none">
          Add Archive <br />
          <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
            — review protocol.
          </span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-8">
          {/* Product ID Reference */}
          {!propProductId && (
            <div className="space-y-3">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Hash size={12} /> Archive Reference (Product ID)
              </label>
              <input
                type="text"
                placeholder="INGEST PRODUCT ID —"
                className="w-full bg-stone-50 border-b border-stone-200 p-4 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-red-600 transition-colors"
                value={formData.productId}
                onChange={e =>
                  setFormData({ ...formData, productId: e.target.value })
                }
                required
              />
            </div>
          )}

          {/* User ID Reference */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <User size={12} /> Client Reference (User ID)
            </label>
            <input
              type="text"
              placeholder="INGEST CLIENT ID —"
              className="w-full bg-stone-50 border-b border-stone-200 p-4 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-red-600 transition-colors"
              value={formData.userId}
              onChange={e =>
                setFormData({ ...formData, userId: e.target.value })
              }
              required
            />
          </div>

          {/* Rating Matrix */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <Star size={12} /> Sentiment Weight (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: num })}
                  className={`flex-1 py-3 text-[11px] font-black border transition-all ${formData.rating >= num ? 'bg-stone-900 border-stone-900 text-white shadow-lg' : 'bg-white border-stone-100 text-stone-300'}`}
                >
                  {num} ★
                </button>
              ))}
            </div>
          </div>

          {/* Narrative Fragment */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={12} /> Narrative Fragment (Comment)
            </label>
            <textarea
              placeholder="WRITE CLIENT NARRATIVE..."
              className="w-full bg-stone-50 border-none p-5 text-[11px] font-medium tracking-wider text-stone-600 focus:bg-white focus:ring-1 focus:ring-red-600 transition-all resize-none"
              rows="5"
              value={formData.comment}
              onChange={e =>
                setFormData({ ...formData, comment: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-8 bg-stone-900 text-white text-[12px] font-black uppercase tracking-[0.6em] flex items-center justify-center gap-4 hover:bg-red-600 transition-all shadow-2xl disabled:opacity-50 group"
        >
          {loading ? (
            <RefreshCw className="animate-spin" size={18} />
          ) : (
            <>
              <Send
                size={16}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
              Commit to Archive
            </>
          )}
        </button>
      </form>

      {/* Background Accent */}
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <Star size={120} />
      </div>
    </motion.div>
  );
};

export default AdminReviewForm;
