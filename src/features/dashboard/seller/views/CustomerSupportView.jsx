import React, { useMemo } from 'react';
import { useChat } from '../../../../context/ChatContext';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  User,
  ArrowUpRight,
  Clock,
  Minus,
  Hash,
  ShieldCheck,
  Zap,
  Activity,
  Search,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const SellerCustomerSupportView = () => {
  const { conversations, loading } = useChat();
  const navigate = useNavigate();

  // --- Intelligence Stats ---
  const stats = useMemo(() => {
    const total = conversations.length;
    const active = conversations.filter(c => !c.isClosed).length; // যদি আপনার ক্লোজড লজিক থাকে
    return { total, active };
  }, [conversations]);

  if (loading)
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
              Client Intelligence Sync
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Client <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — correspondence.
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-4">
          <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">
            Protocol Status: Live Stream
          </p>
          <button
            onClick={() => window.location.reload()}
            className="p-4 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ২. পারফরম্যান্স ম্যাট্রিক্স (Linear Clostich Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard
          id="01"
          label="Active Inquiries"
          value={stats.total}
          icon={<MessageSquare size={18} />}
        />
        <StatCard
          id="02"
          label="Avg. Response Latency"
          value="0.4h"
          icon={<Activity size={18} />}
        />
      </div>

      {/* ৩. চ্যাট লেজার টেবিল (Brutalist List) */}
      <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Citizen Identity</th>
                <th className="px-10 py-8">Narrative Snippet</th>
                <th className="px-10 py-8 text-right">Temporal Ref / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {conversations.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-40 text-center">
                    <div className="mb-6 opacity-20 flex justify-center">
                      <MessageSquare size={60} strokeWidth={1} />
                    </div>
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
                      No Correspondence Detected in Archive.
                    </p>
                  </td>
                </tr>
              ) : (
                conversations.map(chat => (
                  <tr
                    key={chat._id}
                    onClick={() => navigate('/chat')}
                    className="hover:bg-stone-50/30 transition-all group cursor-pointer"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white text-xs font-black relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
                          {chat.userDetails?.name?.charAt(0) || 'C'}
                          <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[12px] font-black text-stone-900 uppercase tracking-tighter leading-none group-hover:text-red-600 transition-colors">
                            {chat.userDetails?.name}
                          </p>
                          <p className="text-[8px] font-bold text-stone-300 uppercase tracking-widest">
                            Citizen Protocol Verified
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-10 py-8">
                      <p className="text-[11px] font-medium text-stone-500 line-clamp-1 uppercase tracking-tight max-w-md">
                        {chat.lastMessage || 'Awaiting manifest details...'}
                      </p>
                    </td>

                    <td className="px-10 py-8 text-right">
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2 text-stone-300 text-[9px] font-black uppercase tracking-widest">
                          <Clock size={12} />
                          {new Date(chat.lastTimestamp).toLocaleTimeString(
                            'en-GB',
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <ArrowUpRight size={16} className="text-red-600" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ৪. কিউরেটর টিপ (The Dark Manifest) */}
      <div className="bg-stone-900 p-12 text-white relative overflow-hidden group">
        <Zap
          className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000"
          size={200}
        />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-4 text-red-600">
              <Minus size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                Curator Guideline
              </span>
            </div>
            <h3 className="text-2xl md:text-4xl font-light tracking-tighter uppercase leading-tight">
              Optimize your{' '}
              <span className="italic font-serif text-red-600 lowercase">
                conversion matrix.
              </span>
            </h3>
            <p className="text-stone-500 text-[10px] font-medium uppercase tracking-[0.2em] leading-loose">
              Responding to citizens within a 30-minute window increases
              historical conversion magnitude by 40%. Maintain low latency for
              archive integrity.
            </p>
          </div>

          <button
            onClick={() => navigate('/chat')}
            className="px-12 py-5 bg-white text-stone-900 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all shadow-2xl shrink-0"
          >
            Open Full Matrix
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components (Signature Style) ---

const StatCard = ({ label, value, id, icon }) => (
  <div className="bg-white p-10 flex flex-col items-start transition-all duration-700 hover:bg-stone-50 group relative overflow-hidden">
    <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors">
      — {id}
    </span>
    <div className="mb-10 text-stone-900 group-hover:text-red-600 transition-colors">
      {icon}
    </div>
    <div className="space-y-1 relative z-10">
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]">
        {label}
      </p>
      <h3 className="text-3xl font-black text-stone-900 tracking-tighter uppercase">
        {value}
      </h3>
    </div>
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
  </div>
);

export default SellerCustomerSupportView;
