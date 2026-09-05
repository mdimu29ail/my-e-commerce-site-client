import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Award,
  Star,
  Gift,
  TrendingUp,
  History,
  ShieldCheck,
  Zap,
  ChevronRight,
  Coins,
  Crown,
  RefreshCw,
  Minus,
  Hash,
  Activity,
  ArrowUpRight,
  Fingerprint,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const UserLoyalty = () => {
  const { t, i18n } = useTranslation();
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchLoyaltyStatus();
  }, []);

  const fetchLoyaltyStatus = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/loyalty/status`, {
        withCredentials: true,
      });
      setLoyaltyData(data);
    } catch (err) {
      setLoyaltyData({
        points: 0,
        tier: 'Bronze',
        nextTierRequirement: 500,
        history: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const tierStyles = useMemo(
    () => ({
      Bronze: {
        color: 'text-stone-400',
        label: 'BRONZE CITIZEN',
        icon: <Hash size={18} />,
      },
      Silver: {
        color: 'text-stone-600',
        label: 'SILVER ARCHIVIST',
        icon: <ShieldCheck size={18} />,
      },
      Gold: {
        color: 'text-red-600',
        label: 'GOLD CURATOR',
        icon: <Crown size={18} />,
      },
      Platinum: {
        color: 'text-stone-900',
        label: 'PLATINUM ELITE',
        icon: <Zap size={18} />,
      },
    }),
    []
  );

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  const currentTier = tierStyles[loyaltyData?.tier] || tierStyles.Bronze;
  const progressPercent = Math.min(
    (loyaltyData?.points / loyaltyData?.nextTierRequirement) * 100,
    100
  );

  return (
    <div className="space-y-12 font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* ১. এডিটোরিয়াল হেডার */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12 mt-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Loyalty Ingress Protocol
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Rewards <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — manifest.
            </span>
          </h2>
        </div>
        <button
          onClick={fetchLoyaltyStatus}
          className="flex items-center gap-3 px-6 py-3 border border-stone-200 text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync
          Archive
        </button>
      </div>

      {/* ২. মেইন ব্যালেন্স ম্যাট্রিক্স (Hero Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        {/* Points Hero */}
        <div className="lg:col-span-8 bg-stone-900 p-10 md:p-16 text-white relative overflow-hidden group">
          <Coins
            className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000"
            size={250}
          />
          <div className="relative z-10 space-y-8">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em]">
              Current Point Magnitude
            </p>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none">
              {loyaltyData?.points}{' '}
              <span className="text-2xl md:text-3xl font-serif italic text-stone-500 lowercase">
                pts.
              </span>
            </h1>
            <div className="flex items-center gap-4 pt-4 border-t border-stone-800">
              <TrendingUp size={16} className="text-emerald-500" />
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Accumulated Saving Magnitude: ৳
                {Math.floor(loyaltyData?.points / 10).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tier Status */}
        <div className="lg:col-span-4 bg-white p-10 md:p-16 flex flex-col justify-between group">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
              Identity Tier —
            </p>
            <h3
              className={`text-3xl font-black tracking-tighter uppercase ${currentTier.color}`}
            >
              {loyaltyData?.tier}
            </h3>
          </div>
          <div className="space-y-6">
            <div
              className={`w-14 h-14 border flex items-center justify-center rounded-none ${currentTier.color} border-stone-100 shadow-sm`}
            >
              {currentTier.icon}
            </div>
            <p className="text-[9px] font-bold text-stone-400 uppercase leading-relaxed tracking-[0.2em]">
              Your current standing in the OmerShop360 global archive. Tier
              benefits active.
            </p>
          </div>
        </div>
      </div>

      {/* ৩. প্রগ্রেস ম্যানিফেস্ট (Hairline Timeline) */}
      <div className="bg-white border border-stone-100 p-10 md:p-12 space-y-8 relative overflow-hidden group">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <SectionLabel label="Elevation Progress —" />
            <p className="text-[11px] font-black text-stone-900 uppercase tracking-tighter">
              Manifest {loyaltyData?.nextTierRequirement - loyaltyData?.points}{' '}
              more units for tier elevation
            </p>
          </div>
          <span className="text-2xl font-black text-stone-900 tracking-tighter">
            {progressPercent.toFixed(0)}%
          </span>
        </div>

        <div className="w-full h-[2px] bg-stone-100 relative">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.5, ease: 'circOut' }}
            className="absolute h-full bg-red-600 shadow-[0_0_10px_rgba(225,29,72,0.3)]"
          />
        </div>
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-1000 group-hover:w-full" />
      </div>

      {/* ৪. প্রোটোকল গাইড (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-100 border border-stone-100">
        <div className="bg-white p-10 space-y-6 group hover:bg-stone-50 transition-colors">
          <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white">
            <Activity size={20} />
          </div>
          <div className="space-y-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-900">
              Archive Ingress
            </h4>
            <p className="text-[10px] font-medium text-stone-400 uppercase leading-relaxed tracking-widest">
              Generate 1 point for every ৳100 successfully ingested into the
              archive.
            </p>
          </div>
        </div>
        <div className="bg-white p-10 space-y-6 group hover:bg-stone-50 transition-colors border-l border-stone-100">
          <div className="w-12 h-12 bg-red-600 flex items-center justify-center text-white">
            <Gift size={20} />
          </div>
          <div className="space-y-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-900">
              Value Reversal
            </h4>
            <p className="text-[10px] font-medium text-stone-400 uppercase leading-relaxed tracking-widest">
              Every 10 points can be reversed into ৳1 capital discount at
              protocol exit.
            </p>
          </div>
        </div>
      </div>

      {/* ৫. এক্টিভিটি লেজার (Historical Table) */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Minus size={20} className="text-red-600" />
          <h3 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.5em]">
            Activity Ledger —
          </h3>
        </div>

        <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                  <th className="px-10 py-8">Protocol Narrative</th>
                  <th className="px-10 py-8">Temporal Reference</th>
                  <th className="px-10 py-8 text-right">Magnitude</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {loyaltyData?.history?.length > 0 ? (
                  loyaltyData.history.map((log, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-stone-50/30 transition-all group"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 border ${log.points > 0 ? 'border-emerald-100 text-emerald-600' : 'border-red-100 text-red-600'}`}
                          >
                            <Star
                              size={14}
                              fill={log.points > 0 ? 'currentColor' : 'none'}
                            />
                          </div>
                          <p className="text-[12px] font-black text-stone-900 uppercase tracking-tighter">
                            {i18n.language === 'en'
                              ? log.descriptionEn
                              : log.descriptionBn}
                          </p>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                          {new Date(log.createdAt).toLocaleDateString('en-GB')}{' '}
                          •{' '}
                          {new Date(log.createdAt).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <span
                          className={`text-lg font-black tracking-tighter ${log.points > 0 ? 'text-emerald-600' : 'text-red-600'}`}
                        >
                          {log.points > 0 ? `+${log.points}` : log.points}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-32 text-center">
                      <Fingerprint
                        size={40}
                        className="mx-auto text-stone-100 mb-6"
                      />
                      <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
                        No Temporal Records Found.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---
const SectionLabel = ({ label, white = false }) => (
  <div className="flex items-center gap-3">
    <Minus size={14} className="text-red-600" />
    <span
      className={`text-[10px] font-black uppercase tracking-[0.4em] ${white ? 'text-stone-300' : 'text-stone-900'}`}
    >
      {label}
    </span>
  </div>
);

export default UserLoyalty;
