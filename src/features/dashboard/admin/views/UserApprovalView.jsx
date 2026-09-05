import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserCheck2,
  UserX2,
  Store,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  ShieldAlert,
  Minus,
  RefreshCw,
  Mail,
  Hash,
  ArrowUpRight,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const AdminUserApprovalView = () => {
  const [pendingSellers, setPendingSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const fetchPendingSellers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/users`, {
        withCredentials: true,
      });
      const pending = data.filter(
        u => u.role === 'seller' && u.isApproved === false
      );
      setPendingSellers(pending);
    } catch (error) {
      toast.error('Registry Sync Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId, status) => {
    const loadingToast = toast.loading('Executing Protocol...');
    try {
      await axios.put(
        `${API_URL}/users/${userId}/role`,
        { isApproved: status },
        { withCredentials: true }
      );
      toast.update(loadingToast, {
        render: status ? 'Merchant Protocol Engaged' : 'Application Denied',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      fetchPendingSellers();
    } catch (error) {
      toast.update(loadingToast, {
        render: 'Authorization Failed',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

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
              Identity Verification
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Merchant <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — ingress.
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchPendingSellers}
            className="p-4 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. REGISTRY STATUS */}
      {pendingSellers.length === 0 ? (
        <div className="py-40 text-center border border-dashed border-stone-100">
          <CheckCircle2 size={40} className="mx-auto text-stone-100 mb-6" />
          <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
            Registry currently empty. All protocols clear.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {pendingSellers.map((seller, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={seller._id}
              className="group bg-white border border-stone-100 p-10 space-y-10 hover:shadow-2xl transition-all duration-700 relative overflow-hidden"
            >
              {/* Top Meta */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white font-black text-xs">
                    {seller.shopName?.charAt(0) || 'S'}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-stone-900 uppercase tracking-tighter leading-none">
                      {seller.shopName || 'Unnamed Atelier'}
                    </h3>
                    <div className="flex items-center gap-2 text-stone-400">
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {seller.name}
                      </span>
                      <div className="w-1 h-1 bg-stone-200 rounded-full" />
                      <span className="text-[9px] font-bold text-stone-300 uppercase italic font-serif">
                        Awaiting Auth
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-black text-red-600 border border-red-100 px-3 py-1 uppercase tracking-widest animate-pulse">
                  Pending
                </span>
              </div>

              {/* Information Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-stone-50 py-8">
                <div className="space-y-4">
                  <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.3em]">
                    Communication —
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] font-black text-stone-600 uppercase">
                      <Mail size={12} className="text-stone-300" />{' '}
                      {seller.email}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-black text-stone-600 uppercase">
                      <Phone size={12} className="text-stone-300" />{' '}
                      {seller.phone}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.3em]">
                    Origin —
                  </p>
                  <div className="flex items-start gap-3">
                    <MapPin size={14} className="text-red-600 shrink-0" />
                    <p className="text-[11px] font-medium text-stone-500 leading-relaxed uppercase tracking-tight">
                      {seller.address?.detailAddress}, <br />
                      {seller.address?.district}
                    </p>
                  </div>
                </div>
              </div>

              {/* Protocols (Buttons) */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleApproval(seller._id, false)}
                  className="flex-1 py-4 border border-stone-200 text-stone-400 font-black text-[10px] uppercase tracking-widest hover:text-red-600 hover:border-red-600 transition-all"
                >
                  Deny Protocol
                </button>
                <button
                  onClick={() => handleApproval(seller._id, true)}
                  className="flex-[2] py-4 bg-stone-900 text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-red-600 transition-all flex items-center justify-center gap-3"
                >
                  <ShieldCheck size={16} /> Engage Merchant
                </button>
              </div>

              {/* Background Reference Number */}
              <span className="absolute -bottom-4 -right-2 text-[64px] font-serif italic text-stone-50 pointer-events-none group-hover:text-red-50/50 transition-colors">
                #{seller._id.slice(-4).toUpperCase()}
              </span>

              {/* Side Accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUserApprovalView;
