import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Truck,
  Search,
  Edit3,
  RefreshCw,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  MapPin,
  Minus,
  Hash,
  Activity,
  ArrowUpRight,
  Globe,
  ShieldCheck,
  Navigation,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';
import Modal from '../../../../components/shared/Modal';

const AdminTrackingView = () => {
  const [trackings, setTrackings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedTracking, setSelectedTracking] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [updateData, setUpdateData] = useState({
    status: '',
    location: '',
    descriptionEn: '',
    descriptionBn: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchTrackings();
  }, []);

  const fetchTrackings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/tracking`, {
        withCredentials: true,
      });
      setTrackings(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Logistics Archive Sync Failed');
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = trk => {
    setSelectedTracking(trk);
    setUpdateData({
      status: trk.currentStatus || 'Order Placed',
      location: '',
      descriptionEn: '',
      descriptionBn: '',
    });
    setIsUpdateModalOpen(true);
  };

  const handleStatusUpdate = async e => {
    e.preventDefault();
    if (!selectedTracking?.order?._id)
      return toast.error('Order Reference Missing');

    setUpdateLoading(true);
    const loadingToast = toast.loading('Updating Manifest...');
    try {
      await axios.post(
        `${API_URL}/tracking/${selectedTracking.order._id}`,
        updateData,
        { withCredentials: true }
      );
      toast.update(loadingToast, {
        render: 'Protocol Updated',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      setIsUpdateModalOpen(false);
      fetchTrackings();
    } catch (err) {
      toast.update(loadingToast, {
        render: 'Update Failed',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  // --- Intelligence Stats ---
  const stats = useMemo(() => {
    const transit = trackings.filter(
      t => t.currentStatus === 'In Transit'
    ).length;
    const out = trackings.filter(
      t => t.currentStatus === 'Out for Delivery'
    ).length;
    return { transit, out, total: trackings.length };
  }, [trackings]);

  const filteredTrackings = trackings.filter(
    t =>
      (t.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'All' || t.currentStatus === statusFilter)
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Logistics Intelligence
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Shipping <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — manifest.
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchTrackings}
            className="p-4 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. STATS MATRIX (Ledger Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard id="01" label="Active Manifests" value={stats.total} />
        <StatCard id="02" label="Global Transit" value={stats.transit} />
        <StatCard id="03" label="Final Leg (Out)" value={stats.out} />
      </div>

      {/* 3. SEARCH & FILTER MATRIX */}
      <div className="flex flex-col lg:flex-row gap-px bg-stone-100 border border-stone-100">
        <div className="flex-1 bg-white p-6 flex items-center gap-6">
          <Search size={18} className="text-stone-300" />
          <input
            type="text"
            placeholder="SEARCH TRACKING ID OR IDENTITY..."
            className="w-full text-[11px] font-black uppercase tracking-widest outline-none placeholder:text-stone-200"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white p-2 gap-2 overflow-x-auto no-scrollbar">
          {[
            'All',
            'Processing',
            'In Transit',
            'Out for Delivery',
            'Delivered',
          ].map(status => (
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

      {/* 4. LOGISTICS LEDGER TABLE */}
      <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Tracking Manifest</th>
                <th className="px-10 py-8">Recipient Identity</th>
                <th className="px-10 py-8 text-center">Status</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredTrackings.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-20 text-center text-[10px] font-black uppercase text-stone-300 tracking-[0.5em]"
                  >
                    No cargo records found.
                  </td>
                </tr>
              ) : (
                filteredTrackings.map(trk => (
                  <tr
                    key={trk._id}
                    className="hover:bg-stone-50/30 transition-all group"
                  >
                    <td className="px-10 py-8">
                      <div className="space-y-1">
                        <p className="text-[13px] font-mono font-black text-stone-900 tracking-tighter">
                          {trk.trackingId}
                        </p>
                        <p className="text-[9px] font-bold text-red-600 uppercase tracking-widest">
                          ORDER REF: #{trk.order?._id?.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-1">
                        <p className="text-[12px] font-black text-stone-900 uppercase tracking-tighter leading-tight">
                          {trk.user?.name || 'Unknown Citizen'}
                        </p>
                        <div className="flex items-center gap-2 text-stone-400">
                          <Hash size={10} />
                          <span className="text-[10px] font-medium tracking-tight">
                            {trk.user?.phone || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <StatusBadge status={trk.currentStatus} />
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <button
                          onClick={() => openUpdateModal(trk)}
                          className="p-3 bg-white border border-stone-100 text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all shadow-sm"
                        >
                          <Edit3 size={16} />
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

      {/* 5. UPDATE MODAL (Protocol Center) */}
      {selectedTracking && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title="Logistics Protocol — Update Manifest"
          size="lg"
        >
          <form onSubmit={handleStatusUpdate} className="space-y-12 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Status Select */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={12} /> Target Status —
                </label>
                <select
                  className="w-full bg-stone-50 border-b border-stone-200 p-4 text-[11px] font-black uppercase tracking-widest focus:border-red-600 outline-none cursor-pointer"
                  value={updateData.status}
                  onChange={e =>
                    setUpdateData({ ...updateData, status: e.target.value })
                  }
                  required
                >
                  <option value="Processing">01. Processing</option>
                  <option value="Picked Up">02. Picked Up</option>
                  <option value="In Transit">03. In Transit</option>
                  <option value="Out for Delivery">04. Out for Delivery</option>
                  <option value="Delivered">05. Delivered</option>
                  <option value="Returned">06. Returned</option>
                </select>
              </div>

              {/* Location Input */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                  <Navigation size={12} /> Hub / Location —
                </label>
                <input
                  type="text"
                  placeholder="E.G. DHAKA CENTRAL HUB"
                  className="w-full bg-transparent border-b border-stone-200 p-4 text-[11px] font-black uppercase tracking-widest focus:border-red-600 outline-none"
                  value={updateData.location}
                  onChange={e =>
                    setUpdateData({ ...updateData, location: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Narrative Fragments (Bilingual Messages) */}
            <div className="bg-stone-900 p-10 text-white space-y-10">
              <SectionLabel
                label="Narrative Fragment (Status Message) —"
                white
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">
                    English Input
                  </p>
                  <textarea
                    placeholder="PACKAGE IS ON ITS WAY..."
                    className="w-full bg-stone-800 border-none p-5 text-[11px] font-medium tracking-wider text-stone-100 focus:ring-1 focus:ring-red-600 resize-none"
                    rows="3"
                    value={updateData.descriptionEn}
                    onChange={e =>
                      setUpdateData({
                        ...updateData,
                        descriptionEn: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest text-right">
                    বাংলা ইনপুট
                  </p>
                  <textarea
                    placeholder="পার্সেলটি পথে আছে..."
                    className="w-full bg-stone-800 border-none p-5 text-[11px] font-medium tracking-wider text-stone-100 text-right focus:ring-1 focus:ring-red-600 resize-none"
                    rows="3"
                    value={updateData.descriptionBn}
                    onChange={e =>
                      setUpdateData({
                        ...updateData,
                        descriptionBn: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateLoading}
              className="w-full py-8 bg-stone-900 text-white text-[12px] font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all shadow-2xl flex items-center justify-center gap-4"
            >
              {updateLoading ? (
                <RefreshCw className="animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={16} /> COMMIT MANIFEST UPDATE
                </>
              )}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

// --- Sub-Components (Theme Consistent) ---

const StatCard = ({ label, value, id }) => (
  <div className="bg-white p-10 space-y-4 relative overflow-hidden group">
    <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors">
      — {id}
    </span>
    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] relative z-10">
      {label}
    </p>
    <h3 className="text-3xl font-black text-stone-900 tracking-tighter uppercase relative z-10">
      {value}
    </h3>
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Delivered: 'border-emerald-100 text-emerald-600 bg-emerald-50/50',
    'Out for Delivery': 'border-orange-100 text-orange-600 bg-orange-50/50',
    'In Transit': 'border-purple-100 text-purple-600 bg-purple-50/50',
    Processing: 'border-amber-100 text-amber-600 bg-amber-50/50 animate-pulse',
    Returned: 'border-red-100 text-red-600 bg-red-50/50',
    default: 'border-stone-100 text-stone-300',
  };
  return (
    <span
      className={`px-4 py-1.5 border text-[9px] font-black uppercase tracking-[0.2em] inline-block ${styles[status] || styles.default}`}
    >
      {status || 'Unknown'}
    </span>
  );
};

const SectionLabel = ({ label, white = false }) => (
  <div className="flex items-center gap-3">
    <Minus size={14} className="text-red-600" />
    <span
      className={`text-[10px] font-black uppercase tracking-[0.4em] ${white ? 'text-stone-100' : 'text-stone-900'}`}
    >
      {label}
    </span>
  </div>
);

export default AdminTrackingView;
