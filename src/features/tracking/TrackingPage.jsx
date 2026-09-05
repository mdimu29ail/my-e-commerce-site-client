import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Package,
  ArrowRight,
  AlertCircle,
  Minus,
  Hash,
  Globe,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ShippingTracker from './components/ShippingTracker';
import Loader from '../../components/shared/Loader';
import { toast } from 'react-toastify';

const TrackingPage = () => {
  const { t } = useTranslation();
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleTrack = async e => {
    e.preventDefault();
    let inputId = orderId.trim();
    if (inputId.startsWith('#')) {
      inputId = inputId.substring(1);
    }

    if (!inputId) return toast.error('PROTOCOL ERROR: ARCHIVE ID REQUIRED');

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      let response;
      if (inputId.toUpperCase().startsWith('TRK')) {
        response = await axios.get(`${API_URL}/tracking/id/${inputId}`, {
          withCredentials: true,
        });
      } else {
        if (inputId.length !== 24) {
          setLoading(false);
          return setError('MANIFEST ERROR: INVALID HEX-ID FORMAT');
        }
        response = await axios.get(`${API_URL}/tracking/${inputId}`, {
          withCredentials: true,
        });
      }
      setTrackingData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'LOGISTICS ERROR: MANIFEST NOT FOUND'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-50 selection:text-red-600 pb-40">
      {/* ১. এডিটোরিয়াল হেডার */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 pt-20 pb-16 border-b border-stone-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-red-600">
              <div className="h-[1px] w-12 bg-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                Real-time Dispatch Protocol
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-light text-stone-900 tracking-tighter leading-none uppercase">
              Track <br />
              <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
                — manifest.
              </span>
            </h1>
          </div>
          <p className="max-w-xs text-stone-400 text-[10px] font-bold uppercase leading-loose tracking-widest">
            Enter your archival order ID or global tracking manifest to
            initialize logistics synchronization.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-20">
        {/* ২. ব্রুটালিস্ট সার্চ ইনপুট */}
        <div className="bg-white border border-stone-100 p-10 shadow-2xl shadow-stone-200/20 relative overflow-hidden group">
          <form onSubmit={handleTrack} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block flex items-center gap-2">
                <Hash size={12} className="text-red-600" /> Archive Identity
                (Order / Tracking ID)
              </label>
              <div className="relative flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="INGEST PROTOCOL ID —"
                    className="w-full bg-stone-50 border-b border-stone-200 p-5 text-[14px] font-mono font-black uppercase tracking-widest focus:outline-none focus:border-red-600 transition-all placeholder:text-stone-200"
                    value={orderId}
                    onChange={e => setOrderId(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-stone-900 text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-600 transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={16} />
                  ) : (
                    <Activity size={16} />
                  )}
                  Initialize Sync
                </button>
              </div>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 p-4 border border-red-100 bg-red-50/30 flex items-center text-red-600 text-[10px] font-black uppercase tracking-widest"
            >
              <AlertCircle size={14} className="mr-3" /> {error}
            </motion.div>
          )}
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-1000 group-hover:w-full" />
        </div>

        {/* ৩. ট্র্যাকিং রেজাল্ট ম্যানিফেস্ট */}
        <div className="mt-20">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 flex justify-center"
              >
                <Loader />
              </motion.div>
            ) : trackingData ? (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* Meta Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-100 border border-stone-100 shadow-xl">
                  <div className="bg-white p-8 space-y-2">
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                      Manifest Identity —
                    </p>
                    <h3 className="text-xl font-black text-stone-900 tracking-tighter uppercase font-mono">
                      #
                      {trackingData.order?._id?.slice(-12).toUpperCase() ||
                        orderId}
                    </h3>
                  </div>
                  <div className="bg-white p-8 space-y-2 md:text-right">
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                      Logistics Provider —
                    </p>
                    <h3 className="text-lg font-black text-red-600 tracking-widest uppercase">
                      {trackingData.courierName ||
                        trackingData.trackingId ||
                        'INTERNAL DISPATCH'}
                    </h3>
                  </div>
                </div>

                {/* Main Visual Tracker */}
                <div className="bg-white border border-stone-100 p-10 md:p-20 shadow-2xl shadow-stone-200/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <Globe size={150} />
                  </div>
                  <ShippingTracker
                    currentStatus={trackingData.currentStatus}
                    history={trackingData.history}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center border border-dashed border-stone-100"
              >
                <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
                  Awaiting Manifest Ingestion.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
