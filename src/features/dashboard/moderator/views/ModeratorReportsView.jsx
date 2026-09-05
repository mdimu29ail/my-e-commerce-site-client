import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  AlertCircle,
  Clock,
  UserX,
  Minus,
  RefreshCw,
  BarChart3,
  Activity,
  ShieldAlert,
  ArrowUpRight,
  Search,
  Hash,
  Globe,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const ModeratorReportsView = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState({
    disputes: 5,
    reviews: 12,
    suspended: 3,
    activeModerators: 2,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // ডাটাবেস থেকে রিয়েল ডাটা আনার প্রোটোকল (সিমুলেশন)
    const syncArchive = async () => {
      try {
        // এখানে আপনার আসল এপিআই কল হবে
        // const { data } = await axios.get(`${API_URL}/moderator/stats`);
        setTimeout(() => setLoading(false), 1200);
      } catch (error) {
        console.error('Archive Sync Error');
      }
    };
    syncArchive();
  }, []);

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-12 font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* ১. এডিটোরিয়াল হেডার (Manifest Identity) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12 mt-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              System Audit Manifest
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Operational <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — reports.
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">
            Last Sync: Just Now
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-3 px-6 py-3 border border-stone-200 text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all"
          >
            <RefreshCw size={14} /> Re-initialize Archive
          </button>
        </div>
      </div>

      {/* ২. পারফরম্যান্স ম্যাট্রিক্স (Linear Clostich Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard
          id="01"
          label="Unresolved Conflicts"
          value={reports.disputes}
          icon={<AlertCircle size={18} />}
          red
        />
        <StatCard
          id="02"
          label="Sentiment Awaiting Ingestion"
          value={reports.reviews}
          icon={<Clock size={18} />}
        />
        <StatCard
          id="03"
          label="Terminated Identities"
          value={reports.suspended}
          icon={<UserX size={18} />}
        />
        <StatCard
          id="04"
          label="Resolution Latency"
          value="0.4h"
          icon={<Activity size={18} />}
        />
      </div>

      {/* ৩. বিস্তারিত অডিট গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
        {/* Recent Security Logs (Left) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center justify-between border-b border-stone-50 pb-6">
            <div className="flex items-center gap-3">
              <Minus size={14} className="text-red-600" />
              <h3 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.5em]">
                Identity Access Log —
              </h3>
            </div>
            <button className="text-[9px] font-black text-stone-400 uppercase tracking-widest hover:text-red-600 transition-colors">
              Export CSV
            </button>
          </div>

          <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/10">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                  <th className="px-8 py-6">Identity Ref</th>
                  <th className="px-8 py-6">Protocol Action</th>
                  <th className="px-8 py-6 text-right">Magnitude</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {[
                  {
                    id: 'USR-902',
                    action: 'Sentiment Purged',
                    time: '10 mins ago',
                    status: 'Security',
                  },
                  {
                    id: 'USR-441',
                    action: 'Conflict Resolved',
                    time: '2 hrs ago',
                    status: 'Logistics',
                  },
                  {
                    id: 'USR-112',
                    action: 'Access Re-instated',
                    time: '5 hrs ago',
                    status: 'Identity',
                  },
                ].map((log, i) => (
                  <tr
                    key={i}
                    className="hover:bg-stone-50/30 transition-all group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Hash size={12} className="text-red-600" />
                        <span className="text-[11px] font-black text-stone-900 tracking-widest uppercase">
                          {log.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-stone-900 uppercase tracking-tighter">
                          {log.action}
                        </p>
                        <p className="text-[9px] font-bold text-stone-300 uppercase italic">
                          {log.time}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="px-3 py-1 border border-stone-100 text-[8px] font-black uppercase tracking-widest text-stone-400 group-hover:border-stone-900 group-hover:text-stone-900 transition-all">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health Narrative (Right) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-stone-900 p-10 text-white relative overflow-hidden group">
            <ShieldAlert
              className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000"
              size={120}
            />
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4 text-red-600">
                <Minus size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                  Health Narrative
                </span>
              </div>
              <h4 className="text-2xl font-light tracking-tighter uppercase leading-tight">
                Registry <br />{' '}
                <span className="italic font-serif text-red-600 lowercase">
                  integrity check.
                </span>
              </h4>
              <div className="space-y-4 pt-6 border-t border-stone-800">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">
                    Security Influx
                  </span>
                  <span className="text-[14px] font-black">99.4%</span>
                </div>
                <div className="h-[1px] w-full bg-stone-800 relative">
                  <div className="absolute h-full w-[94%] bg-red-600 shadow-[0_0_10px_rgba(225,29,72,0.5)]" />
                </div>
              </div>
              <p className="text-[10px] font-medium text-stone-500 leading-loose uppercase tracking-[0.2em]">
                All system identity vectors are operating within standard
                archival parameters.
              </p>
            </div>
          </div>

          {/* Quick Action Matrix */}
          <div className="bg-white border border-stone-100 p-10 space-y-8">
            <div className="flex items-center gap-4 border-b border-stone-50 pb-4">
              <FileText size={16} className="text-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-900">
                Direct Protocol
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center justify-between p-5 bg-stone-50 hover:bg-stone-900 hover:text-white transition-all group">
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Generate Identity Audit
                </span>
                <ArrowUpRight
                  size={14}
                  className="text-stone-300 group-hover:text-red-600"
                />
              </button>
              <button className="flex items-center justify-between p-5 bg-stone-50 hover:bg-stone-900 hover:text-white transition-all group">
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Global Sentiment Report
                </span>
                <ArrowUpRight
                  size={14}
                  className="text-stone-300 group-hover:text-red-600"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ৪. অডিট ফুটার */}
      <div className="p-12 border border-dashed border-stone-100 text-center space-y-4">
        <ShieldAlert size={32} className="mx-auto text-stone-100" />
        <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.6em]">
          End of Operational Manifest v3.6.0
        </p>
      </div>
    </div>
  );
};

// --- Sub-Components (Signature Protocol) ---

const StatCard = ({ label, value, id, icon, red = false }) => (
  <div className="bg-white p-10 flex flex-col items-start transition-all duration-700 hover:bg-stone-50 group relative overflow-hidden">
    <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors">
      — {id}
    </span>
    <div
      className={`mb-10 group-hover:scale-110 transition-transform ${red ? 'text-red-600' : 'text-stone-900'}`}
    >
      {icon}
    </div>
    <div className="space-y-1 relative z-10">
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]">
        {label}
      </p>
      <h3
        className={`text-3xl font-black ${red ? 'text-red-600' : 'text-stone-900'} tracking-tighter uppercase`}
      >
        {value}
      </h3>
    </div>
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
  </div>
);

export default ModeratorReportsView;
