import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  FileText,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  RefreshCw,
  Minus,
  Sparkles,
  Archive,
  Globe,
  Activity,
  Hash,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

// সিগনেচার কালার প্যালেট
const THEME_COLORS = ['#0f172a', '#e11d48', '#a8a29e', '#f5f5f4', '#44403c'];

const AdminReportsView = () => {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('Monthly');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // ডামি ডাটা (Editorial Format)
  const monthlySalesData = [
    { month: 'JAN', revenue: 45000 },
    { month: 'FEB', revenue: 52000 },
    { month: 'MAR', revenue: 48000 },
    { month: 'APR', revenue: 61000 },
    { month: 'MAY', revenue: 55000 },
    { month: 'JUN', revenue: 67000 },
  ];

  const paymentMethodData = [
    { name: 'BKASH', value: 400 },
    { name: 'NAGAD', value: 300 },
    { name: 'CARD', value: 200 },
    { month: 'COD', value: 100 },
  ];

  useEffect(() => {
    // এখানে আপনার এপিআই লজিক বসবে
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleDownloadReport = () => {
    toast.info('Generating Intelligence Manifest...', {
      icon: <FileText size={16} className="text-red-600" />,
    });
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
              Fiscal Intelligence Archive
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Business <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — intelligence.
            </span>
          </h2>
        </div>
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-4 px-8 py-4 bg-stone-900 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-600 transition-all shadow-2xl"
        >
          <Download size={14} /> Export Manifest
        </button>
      </div>

      {/* 2. STATS GRID (Linear Clostich Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard
          id="01"
          title="Revenue Archive"
          value="৳3,28,450"
          trend="+12.5%"
          isUp
          icon={<DollarSign size={18} />}
        />
        <StatCard
          id="02"
          title="Order Magnitude"
          value="৳2,450"
          trend="+3.2%"
          isUp
          icon={<ShoppingBag size={18} />}
        />
        <StatCard
          id="03"
          title="Gross Profit"
          value="৳85,200"
          trend="-1.4%"
          isUp={false}
          icon={<TrendingUp size={18} />}
        />
        <StatCard
          id="04"
          title="Refund Protocol"
          value="৳4,120"
          trend="+0.5%"
          isUp={false}
          icon={<RefreshCw size={18} />}
        />
      </div>

      {/* 3. CHART MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Revenue Performance (Left Panel) */}
        <div className="lg:col-span-8 bg-white p-10 border border-stone-100 relative overflow-hidden">
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-1">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-900">
                Revenue Stream —
              </h3>
              <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest italic">
                Performance over historical cycle
              </p>
            </div>
            <div className="flex bg-stone-50 p-1">
              {['Weekly', 'Monthly', 'Yearly'].map(type => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-5 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${reportType === type ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-400 hover:text-stone-900'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesData}>
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="#f5f5f4"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fontWeight: 900,
                    fill: '#a8a29e',
                    letterSpacing: '2px',
                  }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#a8a29e' }}
                />
                <Tooltip
                  cursor={{ fill: '#fafaf9' }}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '0px',
                    padding: '15px',
                  }}
                  itemStyle={{
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                  }}
                  labelStyle={{ display: 'none' }}
                />
                <Bar dataKey="revenue" fill="#e11d48" radius={0} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Mix (Right Panel) */}
        <div className="lg:col-span-4 bg-white p-10 border border-stone-100 flex flex-col justify-between">
          <div className="space-y-1 mb-12">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-900">
              Payment Matrix —
            </h3>
            <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest italic">
              Capital Ingress method
            </p>
          </div>

          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={THEME_COLORS[index % THEME_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #f5f5f4',
                    borderRadius: '0px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">
                Total
              </p>
              <p className="text-2xl font-black text-stone-900 tracking-tighter uppercase">
                Mix
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {paymentMethodData.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center group cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2"
                    style={{
                      backgroundColor: THEME_COLORS[i % THEME_COLORS.length],
                    }}
                  />
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">
                    {item.name}
                  </span>
                </div>
                <span className="text-[10px] font-black text-stone-900">
                  {item.value} Units
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. CATEGORY NARRATIVE SECTION */}
      <div className="bg-stone-900 p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Globe size={200} />
        </div>

        <div className="relative z-10 space-y-12">
          <div className="space-y-4">
            <SectionLabel label="Segment Narrative" white />
            <h3 className="text-3xl font-light tracking-tighter uppercase">
              Top Product{' '}
              <span className="italic font-serif text-red-600">
                Categories.
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {[
              { label: 'Smartphones', value: 75, amount: '৳1,45,000' },
              { label: 'Laptops', value: 60, amount: '৳98,000' },
              { label: 'Audio Archive', value: 40, amount: '৳45,200' },
              { label: 'Atelier Fashion', value: 25, amount: '৳32,100' },
            ].map((item, i) => (
              <div key={i} className="space-y-4 group cursor-default">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                  <span className="text-xl font-black tracking-tighter">
                    {item.amount}
                  </span>
                </div>
                <div className="h-[1px] w-full bg-stone-800 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.value}%` }}
                    transition={{ duration: 1.5, ease: 'circOut' }}
                    className="absolute h-full bg-red-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- সাব-কম্পোনেন্টস (থিম মেইনটেইনড) ---

const StatCard = ({ title, value, trend, isUp, id, icon }) => (
  <div className="bg-white p-10 flex flex-col items-start transition-all duration-700 hover:bg-stone-50/50 group relative overflow-hidden">
    <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors">
      — {id}
    </span>
    <div className="mb-10 text-stone-900 group-hover:text-red-600 transition-colors">
      {icon}
    </div>
    <div className="space-y-3 relative z-10">
      <div className="flex items-center gap-3">
        <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.4em]">
          {title}
        </h3>
        <span
          className={`text-[9px] font-black px-2 py-0.5 ${isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
        >
          {trend}
        </span>
      </div>
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

export default AdminReportsView;
