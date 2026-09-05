import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  TicketPercent,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  AlertTriangle,
  Tag,
  Clock,
  Minus,
  Hash,
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../../../components/shared/Modal';
import Loader from '../../../../components/shared/Loader';

const AdminCouponManagementView = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiryDate: '',
    usageLimit: 100,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/coupons`, {
        withCredentials: true,
      });
      setCoupons(data);
    } catch (err) {
      toast.error('Promotion Archive Sync Failed');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const active = coupons.filter(c => c.isActive).length;
    const totalUsage = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);
    return { active, totalUsage, total: coupons.length };
  }, [coupons]);

  const openFormModal = (coupon = null) => {
    if (coupon) {
      setEditMode(true);
      setSelectedCoupon(coupon);
      setFormData({
        code: coupon.code,
        discount: coupon.discount,
        expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
        usageLimit: coupon.usageLimit,
      });
    } else {
      setEditMode(false);
      setFormData({ code: '', discount: '', expiryDate: '', usageLimit: 100 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        discount: Number(formData.discount),
        usageLimit: Number(formData.usageLimit),
      };
      if (editMode) {
        await axios.put(`${API_URL}/coupons/${selectedCoupon._id}`, payload, {
          withCredentials: true,
        });
        toast.success('Matrix Updated');
      } else {
        await axios.post(`${API_URL}/coupons`, payload, {
          withCredentials: true,
        });
        toast.success('New Code Ingested');
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Protocol Failed');
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/coupons/${selectedCoupon._id}`, {
        withCredentials: true,
      });
      toast.success('Code Erased from Archive');
      setIsDeleteModalOpen(false);
      fetchCoupons();
    } catch (err) {
      toast.error('Erasure Failed');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(
        `${API_URL}/coupons/${id}`,
        { isActive: !currentStatus },
        { withCredentials: true }
      );
      toast.info('Protocol Status Changed');
      fetchCoupons();
    } catch (err) {
      toast.error('Status Update Failed');
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
              Promotion Intelligence
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Promo <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — archives.
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchCoupons}
            className="p-4 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => openFormModal()}
            className="bg-stone-900 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 hover:bg-red-600 transition-all shadow-2xl"
          >
            <Plus size={16} /> Ingest Code
          </button>
        </div>
      </div>

      {/* 2. STATS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard id="01" label="Active Codes" value={stats.active} />
        <StatCard id="02" label="Global Usage" value={stats.totalUsage} />
        <StatCard id="03" label="Total Ingress" value={stats.total} />
      </div>

      {/* 3. PROMO LEDGER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-8">
        {coupons.map((coupon, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={coupon._id}
            className="group bg-white border border-stone-100 p-10 space-y-10 hover:shadow-2xl transition-all duration-700 relative overflow-hidden"
          >
            {/* Header: Code & Toggle */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash size={12} className="text-red-600" />
                  <span className="text-[11px] font-black text-stone-900 uppercase tracking-widest">
                    {coupon.code}
                  </span>
                </div>
                <p className="text-[9px] font-bold text-stone-300 uppercase">
                  Created: {new Date(coupon.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => toggleStatus(coupon._id, coupon.isActive)}
                className={`p-2 border transition-all ${coupon.isActive ? 'border-emerald-100 text-emerald-600 bg-emerald-50/30' : 'border-red-100 text-red-600 bg-red-50/30'}`}
              >
                {coupon.isActive ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )}
              </button>
            </div>

            {/* Discount Value */}
            <div className="space-y-2">
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em]">
                Value Magnitude —
              </p>
              <h3 className="text-6xl font-black text-stone-900 tracking-tighter">
                {coupon.discount}
                <span className="text-2xl font-serif italic text-red-600">
                  %
                </span>
              </h3>
            </div>

            {/* Meta Data Matrix */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-stone-50">
              <div className="space-y-1">
                <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest">
                  Expiration
                </p>
                <p className="text-[10px] font-black text-stone-900 uppercase">
                  {new Date(coupon.expiryDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest">
                  Efficiency
                </p>
                <p className="text-[10px] font-black text-stone-900 uppercase">
                  {coupon.usedCount} / {coupon.usageLimit}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <button
                onClick={() => openFormModal(coupon)}
                className="flex-1 py-3 border border-stone-100 text-stone-400 hover:text-stone-900 hover:border-stone-900 text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Modify
              </button>
              <button
                onClick={() => {
                  setSelectedCoupon(coupon);
                  setIsDeleteModalOpen(true);
                }}
                className="p-3 border border-stone-100 text-stone-400 hover:text-red-600 hover:border-red-600 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Bottom Hairline Decor */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
          </motion.div>
        ))}
      </div>

      {/* 4. INGESTION MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editMode ? 'Modify Matrix' : 'Ingest New Protocol'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-10 py-6">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">
                Unique Promo Code —
              </label>
              <input
                type="text"
                className="w-full bg-stone-50 border-b border-stone-200 p-4 text-[13px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-red-600 transition-colors"
                placeholder="E.G. ARCHIVE360"
                value={formData.code}
                onChange={e =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <InputGroup
                label="Discount Magnitude (%)"
                type="number"
                value={formData.discount}
                onChange={e =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                required
              />
              <InputGroup
                label="Ingress Limit"
                type="number"
                value={formData.usageLimit}
                onChange={e =>
                  setFormData({ ...formData, usageLimit: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">
                Termination Date —
              </label>
              <input
                type="date"
                className="w-full bg-transparent border-b border-stone-200 pb-3 text-[11px] font-black uppercase outline-none cursor-pointer focus:border-stone-900"
                value={formData.expiryDate}
                onChange={e =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={formLoading}
            className="w-full py-8 bg-stone-900 text-white text-[12px] font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all shadow-2xl flex items-center justify-center gap-4"
          >
            {formLoading ? (
              <RefreshCw className="animate-spin" />
            ) : (
              'Commit Code to Archive'
            )}
          </button>
        </form>
      </Modal>

      {/* 5. DELETE MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Erasure"
      >
        <div className="text-center py-10 space-y-8">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <AlertTriangle size={40} />
          </div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-loose">
            Erasing code "{selectedCoupon?.code}" will immediately terminate its
            market availability.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-10">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="py-4 border border-stone-200 text-stone-400 font-black text-[10px] uppercase tracking-widest"
            >
              Abort
            </button>
            <button
              onClick={confirmDelete}
              className="py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl"
            >
              Confirm Erasure
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// --- Signature Sub-Components ---
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

const InputGroup = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}) => (
  <div className="space-y-3">
    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-transparent border-b border-stone-200 pb-2 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-stone-900 transition-colors"
    />
  </div>
);

export default AdminCouponManagementView;
