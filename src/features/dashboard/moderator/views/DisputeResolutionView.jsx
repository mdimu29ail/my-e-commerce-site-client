import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  AlertTriangle,
  CheckCircle2,
  Minus,
  RefreshCw,
  Search,
  Hash,
  User,
  ShieldAlert,
  ArrowUpRight,
  Activity,
  Clock,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const DisputeResolutionView = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchConflictManifest();
  }, []);

  const fetchConflictManifest = async () => {
    setLoading(true);
    try {
      // আপনার ব্যাকএন্ডে রিটার্ন বা ডিসপিউট রুটে হিট করবে
      const { data } = await axios.get(`${API_URL}/returns`, {
        withCredentials: true,
      });
      // শুধু 'Pending' বা ওপেন কেসগুলো ফিল্টার করা
      setDisputes(
        Array.isArray(data)
          ? data.filter(d => d.status !== 'Refunded' && d.status !== 'Rejected')
          : []
      );
    } catch (err) {
      toast.error('MANIFEST SYNC FAILED');
    } finally {
      setLoading(false);
    }
  };

  const resolveProtocol = async (id, action) => {
    setActionLoading(id);
    const newStatus = action === 'resolve' ? 'Approved' : 'Rejected';
    const loadingToast = toast.loading(
      `Initiating ${newStatus.toUpperCase()} protocol...`
    );

    try {
      await axios.put(
        `${API_URL}/returns/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      toast.update(loadingToast, {
        render: `CONFLICT ${newStatus.toUpperCase()}`,
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });

      // লিস্ট থেকে সরিয়ে ফেলা
      setDisputes(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      toast.update(loadingToast, {
        render: 'ACTION FAILED',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredDisputes = disputes.filter(
    d =>
      d.order?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.reason?.toLowerCase().includes(searchTerm.toLowerCase())
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
              Conflict Management protocol
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Dispute <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — resolution.
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-4">
          <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">
            Active Manifests: {disputes.length}
          </p>
          <button
            onClick={fetchConflictManifest}
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
          placeholder="SEARCH PROTOCOL HASH OR IDENTITY..."
          className="w-full p-4 text-[11px] font-black uppercase tracking-widest outline-none placeholder:text-stone-200"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="hidden md:flex items-center gap-3 text-[9px] font-black text-stone-400 uppercase tracking-widest">
          <ShieldAlert size={12} className="text-red-600" /> High Priority
          Filtration
        </div>
      </div>

      {/* 3. CONFLICT LEDGER TABLE */}
      <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Protocol Hash</th>
                <th className="px-10 py-8">Citizen Manifest</th>
                <th className="px-10 py-8">Displacement Reason</th>
                <th className="px-10 py-8 text-right">Transition Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredDisputes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-32 text-center">
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
                      No Pending Conflicts in Ledger.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDisputes.map(dispute => (
                  <tr
                    key={dispute._id}
                    className="hover:bg-stone-50/30 transition-all group"
                  >
                    {/* Hash ID */}
                    <td className="px-10 py-8">
                      <div className="space-y-1">
                        <p className="text-[13px] font-mono font-black text-stone-900 tracking-tighter">
                          #
                          {dispute.order?._id?.slice(-12).toUpperCase() ||
                            'INTERNAL'}
                        </p>
                        <div className="flex items-center gap-2 text-stone-400">
                          <Clock size={10} />
                          <span className="text-[8px] font-bold uppercase tracking-widest">
                            Inbound:{' '}
                            {new Date(dispute.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Citizen Identity */}
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-white text-[10px] font-black">
                          {dispute.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[12px] font-black text-stone-900 uppercase tracking-tight">
                            {dispute.user?.name}
                          </p>
                          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                            Citizen ID: {dispute.user?._id?.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Displacement Reason */}
                    <td className="px-10 py-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={12} className="text-red-600" />
                          <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest">
                            {dispute.reason}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-stone-500 leading-relaxed line-clamp-1 italic font-serif">
                          "
                          {dispute.additionalDetails || 'No further narrative.'}
                          "
                        </p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">
                        <button
                          onClick={() =>
                            resolveProtocol(dispute._id, 'resolve')
                          }
                          disabled={actionLoading === dispute._id}
                          className="p-3 bg-white border border-stone-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm group/btn"
                          title="Execute Resolution"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          onClick={() => resolveProtocol(dispute._id, 'reject')}
                          disabled={actionLoading === dispute._id}
                          className="p-3 bg-white border border-stone-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Purge Manifest"
                        >
                          <XCircle size={16} />
                        </button>
                        <div className="h-6 w-[1px] bg-stone-100 mx-2" />
                        <button className="p-3 text-stone-300 hover:text-stone-900 transition-all">
                          <ArrowUpRight size={16} />
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

      {/* Logic Summary Footer */}
      <div className="p-10 bg-stone-900 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
          <ShieldAlert size={150} />
        </div>
        <div className="space-y-2 relative z-10">
          <h4 className="text-xl font-light tracking-tighter uppercase leading-none">
            Security{' '}
            <span className="italic font-serif text-red-600">
              verification.
            </span>
          </h4>
          <p className="text-[9px] font-bold text-stone-500 uppercase tracking-[0.3em]">
            All resolution protocols are logged in the global security archive.
          </p>
        </div>
        <div className="flex items-center gap-8 relative z-10">
          <div className="text-center">
            <p className="text-[18px] font-black text-white leading-none">
              99.8%
            </p>
            <p className="text-[8px] font-bold text-stone-500 uppercase tracking-widest mt-1">
              Resolution Accuracy
            </p>
          </div>
          <div className="h-10 w-[1px] bg-stone-800" />
          <div className="text-center">
            <p className="text-[18px] font-black text-white leading-none">
              0.4h
            </p>
            <p className="text-[8px] font-bold text-stone-500 uppercase tracking-widest mt-1">
              Latency Manifest
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Custom Internal Icon ---
const XCircle = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export default DisputeResolutionView;
