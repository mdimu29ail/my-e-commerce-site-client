import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Truck,
  Search,
  Package,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
  Navigation,
  Hash,
  Minus,
  Globe,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';
import ShippingTracker from '../../../tracking/components/ShippingTracker';
import { useChat } from '../../../../context/ChatContext';

const UserTrackMyOrder = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { socket } = useChat();

  const queryParams = new URLSearchParams(location.search);
  const urlId = queryParams.get('id') || '';

  const [orderIdInput, setOrderIdInput] = useState(urlId);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchTracking = useCallback(
    async targetId => {
      if (!targetId) return;

      const cleanId = targetId.trim().replace('#', '');
      setLoading(true);
      setError('');

      try {
        let response;
        if (cleanId.toUpperCase().startsWith('TRK')) {
          response = await axios.get(`${API_URL}/tracking/id/${cleanId}`, {
            withCredentials: true,
          });
        } else {
          response = await axios.get(`${API_URL}/tracking/${cleanId}`, {
            withCredentials: true,
          });
        }
        setTrackingData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || 'LOGISTICS ERROR: MANIFEST NOT FOUND.'
        );
        setTrackingData(null);
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  useEffect(() => {
    if (urlId) {
      setOrderIdInput(urlId);
      fetchTracking(urlId);
    }
  }, [urlId, fetchTracking]);

  // Real-time socket listener for order status updates
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = data => {
      if (trackingData && trackingData.order && String(trackingData.order._id) === String(data.orderId)) {
        // Re-fetch tracking info or update local state
        fetchTracking(data.orderId);
      }
    };

    socket.on('orderStatusUpdated', handleStatusUpdate);

    return () => {
      socket.off('orderStatusUpdated', handleStatusUpdate);
    };
  }, [socket, trackingData, fetchTracking]);

  const handleSearchSubmit = e => {
    e.preventDefault();
    fetchTracking(orderIdInput);
  };

  if (loading && !trackingData)
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
              Logistics Intelligence
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Track <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — manifest.
            </span>
          </h2>
        </div>
        <p className="max-w-xs text-stone-400 text-[9px] font-bold uppercase leading-loose tracking-[0.3em]">
          Initialize logistics synchronization by entering your archival
          protocol ID.
        </p>
      </div>

      {/* ২. ব্রুটালিস্ট সার্চ ম্যাট্রিক্স */}
      <div className="bg-white border border-stone-100 p-10 shadow-2xl shadow-stone-200/20 relative overflow-hidden group">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row gap-6 relative z-10"
        >
          <div className="relative flex-1">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-3">
              Protocol Identity —
            </label>
            <div className="relative">
              <Hash
                className="absolute left-0 top-1/2 -translate-y-1/2 text-red-600"
                size={16}
              />
              <input
                type="text"
                placeholder="INGEST ORDER OR TRACKING ID..."
                className="w-full pl-8 bg-transparent border-b border-stone-200 pb-4 text-[14px] font-mono font-black uppercase tracking-widest focus:outline-none focus:border-red-600 transition-all placeholder:text-stone-200"
                value={orderIdInput}
                onChange={e => setOrderIdInput(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-12 py-5 bg-stone-900 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-600 transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={16} />
              ) : (
                <Activity size={16} />
              )}
              Initialize Sync
            </button>
          </div>
        </form>
        {/* Decorative Hairline */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-1000 group-hover:w-full" />
      </div>

      {/* ৩. এরর ম্যানিফেস্ট */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-8 border border-red-100 bg-red-50/30 flex items-center gap-4 text-red-600"
          >
            <AlertCircle size={18} />
            <p className="text-[10px] font-black uppercase tracking-widest">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ৪. ট্র্যাকিং রেজাল্ট লেজার */}
      {trackingData ? (
        <div className="space-y-12 animate-in fade-in zoom-in duration-700">
          {/* Manifest Summary Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100 shadow-2xl">
            <ManifestStat
              label="Archive Ref"
              value={`#${trackingData.order?._id?.slice(-12).toUpperCase()}`}
              icon={<Package size={16} />}
            />
            <ManifestStat
              label="Logistics Partner"
              value={trackingData.courierName || 'ATELIER DISPATCH'}
              icon={<Truck size={16} />}
            />
            <ManifestStat
              label="ETA Projection"
              value={
                trackingData.estimatedDeliveryDate
                  ? new Date(
                      trackingData.estimatedDeliveryDate
                    ).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'CALCULATING...'
              }
              icon={<Calendar size={16} />}
            />
          </div>

          {/* Detailed Visual Tracker */}
          <div className="bg-white border border-stone-100 p-10 md:p-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
              <Globe size={200} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-16">
                <Minus size={20} className="text-red-600" />
                <h3 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.5em]">
                  Real-time Movement Manifest —
                </h3>
              </div>
              <ShippingTracker
                currentStatus={trackingData.currentStatus}
                history={trackingData.history}
                order={trackingData.order}
              />
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-1000 group-hover:w-full" />
          </div>
        </div>
      ) : (
        /* ৫. ওয়েটিং স্টেট (Empty State) */
        !loading && (
          <div className="py-40 text-center border border-dashed border-stone-100">
            <div className="mb-8 opacity-20 flex justify-center">
              <Navigation size={60} strokeWidth={1} />
            </div>
            <h3 className="text-[11px] font-black text-stone-300 uppercase tracking-[0.5em]">
              Awaiting Manifest Ingestion.
            </h3>
            <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mt-4 italic">
              Protocol ID Required to Initialize Global Sync.
            </p>
          </div>
        )
      )}
    </div>
  );
};

// --- সাব-কম্পোনেন্টস (Signature Style) ---

const ManifestStat = ({ label, value, icon }) => (
  <div className="bg-white p-10 space-y-4 group hover:bg-stone-50 transition-colors">
    <div className="flex items-center gap-3 text-red-600">
      {icon}
      <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
        {label}
      </p>
    </div>
    <h3 className="text-lg font-black text-stone-900 uppercase tracking-tighter leading-none group-hover:text-red-600 transition-colors">
      {value}
    </h3>
  </div>
);

export default UserTrackMyOrder;
