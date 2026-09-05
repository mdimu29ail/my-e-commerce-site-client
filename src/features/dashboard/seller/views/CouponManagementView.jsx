import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Ticket,
  Plus,
  Trash2,
  Calendar,
  Tag,
  RefreshCw,
  Minus,
  ArrowUpRight,
  ShieldCheck,
  X,
  Clock,
  Hash,
  Activity,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '../../../../components/shared/Modal';
import Loader from '../../../../components/shared/Loader';
import { motion } from 'framer-motion';

const SellerCouponManagementView = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiryDate: '',
    usageLimit: 100, // ইনগ্রেস লিমিট ডিফল্ট ১০০
  });

  const [hexInput, setHexInput] = useState('');
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
      const finalData = Array.isArray(data) ? data : data.coupons || [];
      setCoupons(finalData);
    } catch (err) {
      toast.error('ARCHIVE SYNC FAILED');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async e => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        discount: Number(formData.discount),
        usageLimit: Number(formData.usageLimit), // সংখ্যায় রূপান্তর
      };
      await axios.post(`${API_URL}/coupons`, payload, {
        withCredentials: true,
      });
      toast.success('PRIVILEGE PROTOCOL ESTABLISHED');
      setIsModalOpen(false);
      setFormData({ code: '', discount: '', expiryDate: '', usageLimit: 100 });
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'MANIFEST INGESTION FAILED');
    } finally {
      setFormLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!selectedCoupon) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_URL}/coupons/${selectedCoupon._id}`, {
        withCredentials: true,
      });
      toast.success('CODE FRAGMENT ERASED');
      setIsDeleteModalOpen(false);
      fetchCoupons();
    } catch (err) {
      toast.error('ERASURE FAILED');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-16 font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* 1. EDITORIAL HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-stone-100 pb-12 mt-12 px-4 md:px-0">
        <div className="space-y-6 text-left">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Promotion Intelligence
            </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Promo <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — archives.
            </span>
          </h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-4 bg-stone-900 text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-600 transition-all duration-500 shadow-2xl"
        >
          <Plus size={16} strokeWidth={2.5} /> Ingest Code
        </button>
      </div>

      {/* 2. PROMO LEDGER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-100 border border-stone-100 shadow-2xl">
        {coupons.map((coupon, index) => (
          <motion.div
            key={coupon._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group relative bg-white p-10 flex flex-col justify-between min-h-[350px] transition-all duration-700 hover:bg-stone-50/50 overflow-hidden"
          >
            <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors">
              — {index < 9 ? `0${index + 1}` : index + 1}
            </span>

            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-3">
                <Hash size={14} className="text-red-600" />
                <div className="px-4 py-1.5 border border-stone-900 text-[11px] font-black uppercase tracking-[0.3em]">
                  {coupon.code}
                </div>
              </div>
              <h3 className="text-6xl font-black text-stone-900 tracking-tighter uppercase">
                {coupon.discount}
                <span className="text-2xl font-serif italic text-red-600">
                  %
                </span>
              </h3>

              {/* Ingress Limit Display */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                    Ingress Magnitude
                  </p>
                  <p className="text-[11px] font-black text-stone-900 uppercase">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </p>
                </div>
                <div className="w-full h-[1px] bg-stone-100 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%`,
                    }}
                    className="absolute h-full bg-red-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-stone-50 flex justify-between items-center mt-auto">
              <div className="space-y-1">
                <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest">
                  Protocol Expiry
                </p>
                <p className="text-[10px] font-black text-stone-900 uppercase">
                  {new Date(coupon.expiryDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCoupon(coupon);
                  setIsDeleteModalOpen(true);
                }}
                className="p-3 text-stone-300 hover:text-red-600 transition-all"
              >
                <Trash2 size={16} strokeWidth={1.5} />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
          </motion.div>
        ))}
      </div>

      {/* 3. INGESTION MODAL (With Ingress Limit Input) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ingest New Privilege Protocol"
      >
        <form onSubmit={handleCreate} className="space-y-10 p-6 md:p-10">
          <div className="space-y-8">
            <HumanistInput
              label="Protocol Identity (Code)"
              placeholder="E.G. ATELIER360"
              value={formData.code}
              onChange={e =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              required
            />

            <div className="grid grid-cols-2 gap-10">
              <HumanistInput
                label="Discount Magnitude (%)"
                type="number"
                value={formData.discount}
                onChange={e =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                required
              />

              {/* ইনগ্রেস লিমিট ইনপুট */}
              <HumanistInput
                label="Ingress Limit (Usage)"
                type="number"
                value={formData.usageLimit}
                onChange={e =>
                  setFormData({ ...formData, usageLimit: e.target.value })
                }
                required
              />
            </div>

            <HumanistInput
              label="Termination Date"
              type="date"
              value={formData.expiryDate}
              onChange={e =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            disabled={formLoading}
            className="w-full bg-stone-900 text-white py-8 text-[11px] font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all shadow-2xl flex items-center justify-center gap-4 group"
          >
            {formLoading ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              <>
                <ShieldCheck
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />{' '}
                Commit to Archive
              </>
            )}
          </button>
        </form>
      </Modal>

      {/* 4. DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Erasure"
      >
        <div className="text-center py-10 space-y-8 px-6">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <ShieldAlert size={40} />
          </div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-loose">
            Erasing protocol{' '}
            <span className="text-red-600 font-black">
              [{selectedCoupon?.code}]
            </span>{' '}
            will permanently invalidate this fragment.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-10">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="py-4 border border-stone-200 text-stone-400 font-black text-[10px] uppercase tracking-widest"
            >
              Abort
            </button>
            <button
              onClick={executeDelete}
              disabled={deleteLoading}
              className="py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl"
            >
              {deleteLoading ? 'Erasing...' : 'Confirm Erasure'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const HumanistInput = ({ label, ...props }) => (
  <div className="space-y-3 group/input">
    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block transition-colors group-focus-within/input:text-red-600">
      {label} —
    </label>
    <input
      {...props}
      className="w-full bg-transparent border-b border-stone-100 py-3 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-stone-900 transition-all duration-500"
    />
  </div>
);

export default SellerCouponManagementView;
