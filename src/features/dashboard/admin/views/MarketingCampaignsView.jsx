import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Megaphone,
  Target,
  Plus,
  RefreshCw,
  Minus,
  Mail,
  MessageSquare,
  ArrowUpRight,
  Zap,
  Activity,
  Users,
  Sparkles,
  Hash,
  X,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Loader from '../../../../components/shared/Loader';
import Modal from '../../../../components/shared/Modal';

const AdminMarketingView = () => {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    reach: '0k',
    conversion: '0%',
    roi: '0x',
    ingress: '0',
  });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'Email',
    status: 'Draft',
    reach: '',
    conversion: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // 1. DATA SYNC PROTOCOL
  const fetchMarketingArchives = async () => {
    setLoading(true);
    try {
      const [statsRes, campaignRes] = await Promise.all([
        axios.get(`${API_URL}/marketing/stats`, { withCredentials: true }),
        axios.get(`${API_URL}/marketing/campaigns`, { withCredentials: true }),
      ]);
      setStats(statsRes.data);
      setCampaigns(campaignRes.data);
    } catch (error) {
      console.error('Archive Sync Error:', error);
      toast.error('PROTOCOL SYNC FAILED');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingArchives();
  }, []);

  // 2. INGESTION PROTOCOL (Submit)
  const handleIngestSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axios.post(`${API_URL}/marketing/campaigns`, newCampaign, {
        withCredentials: true,
      });
      toast.success('CAMPAIGN INGESTED');
      setIsModalOpen(false);
      setNewCampaign({
        name: '',
        type: 'Email',
        status: 'Draft',
        reach: '',
        conversion: '',
      });
      fetchMarketingArchives();
    } catch (error) {
      toast.error('INGESTION FAILED');
    } finally {
      setFormLoading(false);
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
              Growth Intelligence Archive
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Market <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — campaigns.
            </span>
          </h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-stone-900 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 hover:bg-red-600 transition-all shadow-2xl"
        >
          <Plus size={16} /> Ingest Protocol
        </button>
      </div>

      {/* 2. PERFORMANCE MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard
          id="01"
          label="Reach Magnitude"
          value={stats.reach}
          icon={<Target size={18} />}
        />
        <StatCard
          id="02"
          label="Avg. Conversion"
          value={stats.conversion}
          icon={<Zap size={18} />}
        />
        <StatCard
          id="03"
          label="Influence ROI"
          value={stats.roi}
          icon={<Activity size={18} />}
        />
        <StatCard
          id="04"
          label="Member Ingress"
          value={stats.ingress}
          icon={<Users size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Campaign Ledger (Real Data) */}
        <div className="lg:col-span-8 space-y-8">
          <SectionLabel label="Historical Ledger —" />
          <div className="bg-white border border-stone-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                    <th className="px-8 py-6">Protocol Identity</th>
                    <th className="px-8 py-6">Reach</th>
                    <th className="px-8 py-6 text-center">Status</th>
                    <th className="px-8 py-6 text-right">Manifest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {campaigns.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-20 text-center text-[10px] font-black uppercase text-stone-300 tracking-[0.5em]"
                      >
                        No Records Found
                      </td>
                    </tr>
                  ) : (
                    campaigns.map(camp => (
                      <tr
                        key={camp._id}
                        className="hover:bg-stone-50/30 transition-all group"
                      >
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <p className="text-[12px] font-black text-stone-900 uppercase tracking-tighter">
                              {camp.name}
                            </p>
                            <div className="flex items-center gap-2 text-stone-400">
                              <Hash size={10} className="text-red-600" />
                              <span className="text-[9px] font-bold uppercase tracking-widest">
                                {camp.type} Protocol
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-[13px] font-black text-stone-900">
                            {camp.reach > 1000
                              ? `${(camp.reach / 1000).toFixed(1)}k`
                              : camp.reach}
                          </p>
                          <p className="text-[9px] font-bold text-stone-300 uppercase">
                            Conv: {camp.conversion}%
                          </p>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span
                            className={`px-4 py-1.5 border text-[8px] font-black uppercase tracking-widest ${camp.status === 'Active' ? 'border-emerald-100 text-emerald-600 bg-emerald-50/50' : 'border-stone-100 text-stone-300'}`}
                          >
                            {camp.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-3 bg-white border border-stone-100 text-stone-300 hover:text-stone-900 transition-all">
                            <ArrowUpRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Sidebar (Stays as Signature Feature) */}
        <div className="lg:col-span-4 space-y-8">
          <SectionLabel label="Neural Matrix —" />
          <div className="bg-stone-900 p-10 text-white space-y-10 relative overflow-hidden group">
            <Sparkles
              className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000"
              size={120}
            />
            <div className="space-y-4">
              <h4 className="text-2xl font-light tracking-tighter uppercase leading-tight">
                Suggested <br />{' '}
                <span className="italic font-serif text-red-600 lowercase">
                  protocols.
                </span>
              </h4>
              <p className="text-[10px] font-medium text-stone-500 leading-loose uppercase tracking-[0.2em]">
                Current analytics suggest a high retention potential in
                'Artisanal' segments.
              </p>
            </div>
            <button className="w-full py-4 border border-stone-800 text-[9px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-stone-900 transition-all">
              Request Neural Copy
            </button>
          </div>
        </div>
      </div>

      {/* --- INGESTION MODAL --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Protocol Ingestion"
      >
        <form onSubmit={handleIngestSubmit} className="space-y-10 py-6">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">
                Campaign Identity —
              </label>
              <input
                type="text"
                className="w-full bg-stone-50 border-b border-stone-200 p-4 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-red-600"
                placeholder="E.G. AUTUMN INGRESS"
                value={newCampaign.name}
                onChange={e =>
                  setNewCampaign({
                    ...newCampaign,
                    name: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">
                  Target Method —
                </label>
                <select
                  className="w-full bg-transparent border-b border-stone-200 pb-2 text-[11px] font-black uppercase outline-none"
                  value={newCampaign.type}
                  onChange={e =>
                    setNewCampaign({ ...newCampaign, type: e.target.value })
                  }
                >
                  <option>Email</option>
                  <option>SMS</option>
                  <option>Push</option>
                  <option>Social</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">
                  Status —
                </label>
                <select
                  className="w-full bg-transparent border-b border-stone-200 pb-2 text-[11px] font-black uppercase outline-none text-red-600"
                  value={newCampaign.status}
                  onChange={e =>
                    setNewCampaign({ ...newCampaign, status: e.target.value })
                  }
                >
                  <option>Draft</option>
                  <option>Scheduled</option>
                  <option>Active</option>
                </select>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={formLoading}
            className="w-full py-8 bg-stone-900 text-white text-[12px] font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all flex items-center justify-center gap-4 shadow-2xl"
          >
            {formLoading ? (
              <RefreshCw className="animate-spin" />
            ) : (
              <>
                <Send size={16} /> Commit to Archive
              </>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};

// Sub-components
const StatCard = ({ label, value, id, icon }) => (
  <div className="bg-white p-10 flex flex-col items-start transition-all duration-700 hover:bg-stone-50 group relative overflow-hidden">
    <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50">
      — {id}
    </span>
    <div className="mb-10 text-stone-900 group-hover:text-red-600 transition-colors">
      {icon}
    </div>
    <div className="space-y-2 relative z-10">
      <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.4em]">
        {label}
      </h3>
      <p className="text-3xl font-black text-stone-900 tracking-tighter uppercase leading-none">
        {value}
      </p>
    </div>
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
  </div>
);

const SectionLabel = ({ label }) => (
  <div className="flex items-center gap-3">
    <Minus size={14} className="text-red-600" />
    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-900">
      {label}
    </span>
  </div>
);

export default AdminMarketingView;
