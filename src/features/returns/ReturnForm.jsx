import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  AlertTriangle,
  Upload,
  Send,
  Loader2,
  Image as ImageIcon,
  ArrowLeft,
  Minus,
  Hash,
  MessageSquare,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { motion } from 'framer-motion';

const ReturnForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialOrderId = queryParams.get('orderId') || '';

  const [formData, setFormData] = useState({
    orderId: initialOrderId,
    reason: '',
    additionalDetails: '',
    images: [],
  });

  const [loading, setLoading] = useState(false);

  const reasons = [
    { value: 'Defective Product', label: t('returns.reason_defective') },
    { value: 'Wrong Item Received', label: t('returns.reason_wrong') },
    { value: 'Damaged in Transit', label: t('returns.reason_damaged') },
    { value: 'Quality not as expected', label: t('returns.reason_quality') },
    { value: 'Missing Parts', label: t('returns.reason_missing') },
  ];

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.orderId || !formData.reason) {
      return toast.error('PROTOCOL ERROR: REQUIRED FIELDS MISSING');
    }

    setLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/returns`, formData, {
        withCredentials: true,
      });

      toast.success('MANIFEST INGESTED SUCCESSFULLY');
      navigate('/returns');
    } catch (error) {
      toast.error(error.response?.data?.message || 'SUBMISSION FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-white border border-stone-100 p-10 md:p-16 shadow-2xl shadow-stone-200/20 relative overflow-hidden"
    >
      {/* ১. এডিটোরিয়াল হেডার */}
      <div className="space-y-6 mb-16">
        <div className="flex items-center gap-4 text-red-600">
          <Minus size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">
            Logistics Protocol
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tighter leading-none uppercase">
          Return <br />
          <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
            — manifest.
          </span>
        </h2>
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-loose max-w-md">
          Please provide the archival order reference and technical reasoning to
          initialize the reverse logistics ingestion.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* ২. ডাটা ইনপুট ম্যাট্রিক্স */}
        <div className="space-y-10">
          {/* অর্ডার রেফারেন্স (Monospaced ID) */}
          <div className="space-y-3 group">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <Hash size={12} className="text-red-600" />{' '}
              {t('returns.order_id_label')}
            </label>
            <input
              type="text"
              placeholder="INGEST HEX-ID —"
              className="w-full bg-stone-50 border-b border-stone-200 p-4 text-[13px] font-mono font-black uppercase tracking-widest focus:outline-none focus:border-red-600 transition-all placeholder:text-stone-200"
              value={formData.orderId}
              onChange={e =>
                setFormData({ ...formData, orderId: e.target.value })
              }
              required
            />
          </div>

          {/* কারণ সিলেকশন */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={12} className="text-red-600" />{' '}
              {t('returns.reason_label')}
            </label>
            <select
              className="w-full bg-transparent border-b border-stone-200 p-4 text-[11px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-stone-900 cursor-pointer appearance-none"
              value={formData.reason}
              onChange={e =>
                setFormData({ ...formData, reason: e.target.value })
              }
              required
            >
              <option value="">{t('returns.select_reason')}</option>
              {reasons.map(r => (
                <option key={r.value} value={r.value}>
                  {r.label.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* এভিডেন্স ইনজেশন (Image Upload Placeholder) */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <Upload size={12} className="text-red-600" />{' '}
              {t('returns.upload_evidence')}
            </label>
            <div className="border border-dashed border-stone-200 p-12 flex flex-col items-center justify-center group hover:bg-stone-50 hover:border-red-600 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white mb-4 group-hover:bg-red-600 transition-colors">
                <Plus size={20} />
              </div>
              <p className="text-[10px] font-black text-stone-900 uppercase tracking-widest">
                {t('returns.click_to_upload')}
              </p>
              <p className="text-[9px] text-stone-400 uppercase tracking-widest mt-2">
                Maximum magnitude: 3 images
              </p>
            </div>
          </div>

          {/* বিস্তারিত ন্যারেটিভ */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={12} className="text-red-600" />{' '}
              {t('returns.details_label')}
            </label>
            <textarea
              rows="5"
              placeholder="DESCRIBE THE DISPLACEMENT..."
              className="w-full bg-stone-50 border-none p-5 text-[11px] font-medium tracking-wider text-stone-600 focus:bg-white focus:ring-1 focus:ring-red-600 transition-all resize-none"
              value={formData.additionalDetails}
              onChange={e =>
                setFormData({ ...formData, additionalDetails: e.target.value })
              }
            ></textarea>
          </div>
        </div>

        {/* সাবমিট প্রোটোকল */}
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
              {t('returns.submit_btn')}
            </>
          )}
        </button>
      </form>

      {/* ব্যাকগ্রাউন্ড একসেন্ট */}
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <RotateCcwIcon size={200} />
      </div>
    </motion.div>
  );
};

// --- Custom Component ---
const RotateCcwIcon = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export default ReturnForm;
