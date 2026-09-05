import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ShoppingBag,
  Award,
  Truck,
  Activity,
  ArrowRight,
  Minus,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const THEME_COLORS = ['#0f172a', '#e11d48', '#a8a29e', '#f5f5f4'];

const UserAnalyticsView = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchRealAnalytics = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/users/analytics`, {
          withCredentials: true,
        });
        setData(data);
      } catch (error) {
        console.error('Analytics Sync Error');
      } finally {
        setLoading(false);
      }
    };
    fetchRealAnalytics();
  }, [API_URL]);

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  if (!data)
    return (
      <div className="p-20 text-center uppercase font-black text-stone-300 tracking-widest">
        No Protocol Data Found.
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
              Identity Sync Protocol
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Archive <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — {user?.name.split(' ')[0]}.
            </span>
          </h2>
        </div>
        <Link
          to="/shop"
          className="group bg-stone-900 text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-600 transition-all shadow-2xl"
        >
          Initiate Ingress <ArrowRight size={14} className="inline ml-2" />
        </Link>
      </div>

      {/* ২. কুইক মেট্রিক্স (Real Data) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard
          id="01"
          title="Order Ledger"
          value={`${data.stats.totalOrders} Units`}
          icon={<ShoppingBag size={18} />}
        />
        <StatCard
          id="02"
          title="Loyalty Ingress"
          value={`${data.stats.loyaltyPoints} PTS`}
          icon={<Award size={18} />}
        />
        <StatCard
          id="03"
          title="Pending Dispatch"
          value={`${data.stats.pendingItems} Items`}
          icon={<Truck size={18} />}
        />
        <StatCard
          id="04"
          title="Capital Outflow"
          value={`৳${data.stats.totalSpent.toLocaleString()}`}
          icon={<Activity size={18} />}
        />
      </div>

      {/* ৩. চার্ট ম্যাট্রিক্স */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 bg-white p-10 border border-stone-100">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-900 mb-12">
            Spending Manifest —
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.spendingData}>
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="#f5f5f4"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#a8a29e' }}
                  dy={15}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '0px',
                    border: '1px solid #f5f5f4',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke="#e11d48"
                  strokeWidth={2}
                  fillOpacity={0.05}
                  fill="#e11d48"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-10 border border-stone-100 flex flex-col justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-900 mb-8">
            Status Matrix —
          </h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {data.statusData.map((e, i) => (
                    <Cell
                      key={i}
                      fill={THEME_COLORS[i % THEME_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">
                Archive
              </p>
              <p className="text-2xl font-black text-stone-900 tracking-tighter uppercase">
                Sync
              </p>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {data.statusData.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center group/item cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-[1px] bg-red-600" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 group-hover/item:text-stone-900 transition-colors">
                    {item.name}
                  </span>
                </div>
                <span className="text-[10px] font-black text-stone-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ৫. মাইলস্টোন */}
      <div className="bg-stone-900 p-12 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Award size={200} />
        </div>
        <div className="relative z-10 space-y-6 max-w-2xl">
          <SectionLabel label="Reward Manifest" white />
          <h3 className="text-3xl md:text-5xl font-light tracking-tighter uppercase leading-tight">
            Targeting{' '}
            <span className="italic font-serif text-red-600 lowercase">
              gold elevation.
            </span>
          </h3>
          <div className="w-full h-[1px] bg-stone-800 relative mt-8">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '75%' }}
              transition={{ duration: 1.5 }}
              className="absolute h-full bg-red-600"
            />
          </div>
          <p className="text-stone-500 text-[9px] font-black uppercase tracking-[0.2em] pt-4">
            Status: Syncing with loyalty database...
          </p>
        </div>
      </div>
    </div>
  );
};

// স্ট্যাট কার্ড এবং সেকশন লেবেল আগের মতোই থাকবে...
const StatCard = ({ title, value, id, icon }) => (
  <div className="bg-white p-10 flex flex-col items-start transition-all duration-700 hover:bg-stone-50/50 group relative overflow-hidden">
    <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50">
      — {id}
    </span>
    <div className="mb-10 text-stone-900 group-hover:text-red-600 transition-colors">
      {icon}
    </div>
    <div className="space-y-2 relative z-10">
      <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.4em]">
        {title}
      </h3>
      <p className="text-3xl font-black text-stone-900 tracking-tighter uppercase leading-none">
        {value}
      </p>
    </div>
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
  </div>
);

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

export default UserAnalyticsView;
