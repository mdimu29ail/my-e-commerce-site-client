import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  Plus,
  ChevronRight,
  Package,
  Clock,
  Minus,
  Hash,
  ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../components/shared/Loader';
import ReturnForm from './ReturnForm';

const ReturnPage = () => {
  const { t } = useTranslation();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchMyReturns = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const { data } = await axios.get(`${API_URL}/returns/myreturns`, {
          withCredentials: true,
        });
        // নিশ্চিত করা হচ্ছে যে ডাটা একটি অ্যারে
        setReturns(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Archive Sync Error:', error);
        setReturns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReturns();
  }, []);

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-red-50 selection:text-red-600 pb-40 px-4 md:px-0">
      {/* ১. এডিটোরিয়াল হেডার */}
      <div className="max-w-[1500px] mx-auto pt-20 pb-16 border-b border-stone-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-red-600">
              <div className="h-[1px] w-12 bg-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                Reverse Logistics Protocol
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-light text-stone-900 tracking-tighter leading-none uppercase">
              Returns <br />
              <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
                — archive.
              </span>
            </h1>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl flex items-center gap-4 ${
              showForm
                ? 'bg-stone-100 text-stone-400 hover:bg-stone-900 hover:text-white'
                : 'bg-stone-900 text-white hover:bg-red-600'
            }`}
          >
            {showForm ? (
              <>
                {' '}
                <Minus size={16} /> {t('common.cancel')}{' '}
              </>
            ) : (
              <>
                {' '}
                <Plus size={16} /> {t('returns.new_request')}{' '}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto mt-20">
        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-stone-50 p-6 md:p-10 border border-stone-100">
                <ReturnForm />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* ২. ইন্টেলিজেন্স স্ট্যাটাস বার */}
              {returns.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-100 border border-stone-100 mb-20 shadow-xl shadow-stone-200/20">
                  <div className="bg-white p-8">
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">
                      Total Requests
                    </p>
                    <p className="text-2xl font-black text-stone-900 uppercase tracking-tighter">
                      {returns.length}
                    </p>
                  </div>
                  <div className="bg-white p-8">
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">
                      Pending Approval
                    </p>
                    <p className="text-2xl font-black text-red-600 uppercase tracking-tighter">
                      {returns.filter(r => r.status === 'Pending').length}
                    </p>
                  </div>
                </div>
              )}

              {/* ৩. রিটার্ন লেজার লিস্ট */}
              {returns.length === 0 ? (
                <div className="py-40 text-center border border-dashed border-stone-100">
                  <div className="mb-8 opacity-20 flex justify-center">
                    <RotateCcw size={60} />
                  </div>
                  <p className="text-[11px] font-black text-stone-300 uppercase tracking-[0.5em] mb-10">
                    Reverse Archive Currently Empty.
                  </p>
                  <Link
                    to="/profile/orders"
                    className="text-[10px] font-black text-red-600 uppercase tracking-widest border-b border-red-100 pb-1 hover:text-stone-900 hover:border-stone-900 transition-all"
                  >
                    Initialize Protocol via Orders
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {returns.map((ret, idx) => {
                    // 🚨 গুরুত্বপূর্ণ সেফটি ফিক্স (স্লাইস এরর বন্ধ করার জন্য)
                    const orderIdRaw = ret.order?._id || ret.order;
                    const orderReference = orderIdRaw
                      ? orderIdRaw.toString().slice(-8).toUpperCase()
                      : 'N/A';

                    return (
                      <motion.div
                        key={ret._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-white border border-stone-100 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-2xl transition-all duration-700 relative overflow-hidden"
                      >
                        <div className="flex items-center gap-6 md:gap-8 w-full">
                          <div className="w-16 h-20 bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-200 group-hover:text-red-600 transition-colors shrink-0">
                            <Package size={30} strokeWidth={1} />
                          </div>

                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                                Protocol #{orderReference}
                              </span>
                              <div className="h-3 w-[1px] bg-stone-200" />
                              <div className="flex items-center gap-1.5 text-stone-400 text-[9px] font-bold uppercase tracking-tighter">
                                <Clock size={10} />{' '}
                                {new Date(ret.createdAt).toLocaleDateString(
                                  'en-GB'
                                )}
                              </div>
                            </div>
                            <h4 className="text-lg md:text-xl font-black text-stone-900 uppercase tracking-tighter leading-none group-hover:text-red-600 transition-colors">
                              {ret.reason}
                            </h4>
                            <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest italic font-serif lowercase">
                              Archive sync status: {ret.status}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between border-t md:border-t-0 border-stone-50 pt-6 md:pt-0">
                          <StatusBadge status={ret.status} />

                          <Link
                            to={`/user/returns/${ret._id}`}
                            className="w-12 h-12 flex items-center justify-center border border-stone-100 text-stone-300 hover:text-stone-900 hover:border-stone-900 transition-all shadow-sm"
                          >
                            <ArrowUpRight size={20} />
                          </Link>
                        </div>

                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'border-orange-200 text-orange-600 bg-orange-50/50',
    Approved: 'border-emerald-200 text-emerald-600 bg-emerald-50/50',
    Refunded: 'border-stone-900 text-stone-900 bg-stone-50',
    Rejected: 'border-red-200 text-red-600 bg-red-50/50',
    default: 'border-stone-100 text-stone-300',
  };

  return (
    <span
      className={`px-5 py-2 border text-[9px] font-black uppercase tracking-[0.2em] ${styles[status] || styles.default}`}
    >
      {status}
    </span>
  );
};

export default ReturnPage;
