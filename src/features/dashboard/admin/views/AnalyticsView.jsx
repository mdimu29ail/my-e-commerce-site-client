import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
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
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  Minus,
  Sparkle,
  Archive,
  Activity,
  Globe,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

// থিম কালার প্যালেট (OmerShop360 Signature)
const THEME_COLORS = ['#0f172a', '#e11d48', '#a8a29e', '#f5f5f4'];

const AdminAnalyticsView = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // ১. মঙ্গোডিবি থেকে রিয়েল ডাটা ফেচ করা
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const [orderRes, prodRes] = await Promise.all([
          axios.get(`${API_URL}/orders`, { withCredentials: true }),
          axios.get(`${API_URL}/products`, { withCredentials: true }),
        ]);
        setOrders(
          Array.isArray(orderRes.data)
            ? orderRes.data
            : orderRes.data.orders || []
        );
        setProducts(
          Array.isArray(prodRes.data)
            ? prodRes.data
            : prodRes.data.products || []
        );
      } catch (error) {
        console.error('Archive Intelligence Sync Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRealTimeData();
  }, [API_URL]);

  // ২. ডাটা প্রসেসিং ইঞ্জিন (Raw Data -> Curation Format)
  const analytics = useMemo(() => {
    if (!orders.length) return null;

    const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;

    // সেলস গ্রাফ ডাটা (তারিখ অনুযায়ী)
    const salesMap = {};
    orders
      .slice()
      .reverse()
      .forEach(o => {
        const date = new Date(o.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        });
        salesMap[date] = (salesMap[date] || 0) + o.totalPrice;
      });
    const salesChart = Object.keys(salesMap)
      .map(date => ({ name: date, value: salesMap[date] }))
      .slice(-8);

    // ক্যাটাগরি শেয়ারিং ডাটা
    const catMap = {};
    orders.forEach(o => {
      o.orderItems?.forEach(item => {
        const cat = item.category || 'Standard';
        catMap[cat] = (catMap[cat] || 0) + item.price * item.qty;
      });
    });
    const categoryChart = Object.keys(catMap).map(name => ({
      name: name.toUpperCase(),
      value: catMap[name],
    }));

    const targetPercent = Math.min(
      Math.round((totalSales / 500000) * 100),
      100
    );

    return {
      totalSales,
      totalOrders,
      totalProducts,
      salesChart,
      categoryChart,
      targetPercent,
    };
  }, [orders, products]);

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  if (!analytics)
    return (
      <div className="p-20 text-center uppercase tracking-[0.5em] text-stone-300">
        Archive Currently Empty.
      </div>
    );

  return (
    <div className="space-y-12 font-sans selection:bg-red-50 selection:text-red-600">
      {/* ১. থিম-মেইনটেইনড এডিটোরিয়াল হেডার */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Real-time Intelligence
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Archive <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — analytics.
            </span>
          </h2>
        </div>
        <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">
          Inventory Sync Status: Active
        </p>
      </div>

      {/* ২. টপ কার্ড গ্রিড (Linear Clostich Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard
          id="01"
          title="Revenue"
          value={`৳${analytics.totalSales.toLocaleString()}`}
          icon={<TrendingUp size={18} />}
          isUp
        />
        <StatCard
          id="02"
          title="Orders"
          value={analytics.totalOrders}
          icon={<ShoppingCart size={18} />}
          isUp
        />
        <StatCard
          id="03"
          title="Products"
          value={analytics.totalProducts}
          icon={<Package size={18} />}
          isUp
        />
        <StatCard
          id="04"
          title="Performance"
          value={`${analytics.targetPercent}%`}
          icon={<Activity size={18} />}
          isUp
        />
      </div>

      {/* ৩. চার্ট গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Revenue Analytics (Left Panel) */}
        <div className="lg:col-span-6 bg-white p-10 border border-stone-100 relative overflow-hidden">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-900">
              Revenue Stream —
            </h3>
            <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest italic">
              Updated Just Now
            </span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.salesChart}>
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="#f5f5f4"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fontWeight: 900,
                    fill: '#a8a29e',
                    letterSpacing: '2px',
                  }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #f5f5f4',
                    borderRadius: '0px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#e11d48"
                  strokeWidth={3}
                  fillOpacity={0.05}
                  fill="#e11d48"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Target (Semi-Circle Middle) */}
        <div className="lg:col-span-3 bg-white p-10 border border-stone-100 flex flex-col items-center">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-900 w-full mb-8">
            — Target
          </h3>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { v: analytics.targetPercent },
                    { v: 100 - analytics.targetPercent },
                  ]}
                  innerRadius={70}
                  outerRadius={90}
                  startAngle={180}
                  endAngle={0}
                  dataKey="v"
                  stroke="none"
                >
                  <Cell fill="#e11d48" />
                  <Cell fill="#f5f5f4" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
              <p className="text-5xl font-black text-stone-900 tracking-tighter">
                {analytics.targetPercent}%
              </p>
              <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest mt-2">
                Achieved
              </p>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-stone-50">
            <div className="text-center">
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">
                Goal
              </p>
              <p className="font-black text-stone-900">৳500k</p>
            </div>
            <div className="text-center border-l border-stone-50">
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">
                Status
              </p>
              <p className="font-black text-stone-900">On Track</p>
            </div>
          </div>
        </div>

        {/* Categories (Donut Right) */}
        <div className="lg:col-span-3 bg-white p-10 border border-stone-100">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-900 mb-8">
            — Categories
          </h3>
          <div className="h-44 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.categoryChart}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {analytics.categoryChart.map((e, i) => (
                    <Cell
                      key={i}
                      fill={THEME_COLORS[i % THEME_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
            {analytics.categoryChart.slice(0, 3).map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center group cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-[1px] bg-red-600" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">
                    {item.name}
                  </span>
                </div>
                <span className="text-[10px] font-black text-stone-900">
                  ৳{item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ৪. বটম গ্রিড (Client Narrative & Funnel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        <div className="lg:col-span-4 bg-white p-10 border border-stone-100">
          <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-900 mb-10">
            — Global Reach
          </h4>
          <div className="space-y-8">
            {['United States', 'United Kingdom', 'Bangladesh', 'Russia'].map(
              (city, idx) => (
                <div key={idx} className="space-y-3 group cursor-default">
                  <div className="flex justify-between text-[10px] font-black uppercase text-stone-400 group-hover:text-stone-900 transition-colors">
                    <span>{city}</span>
                    <span>{45 - idx * 10}%</span>
                  </div>
                  <div className="h-[1px] w-full bg-stone-100 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${45 - idx * 10}%` }}
                      transition={{ duration: 1.5 }}
                      className="absolute h-full bg-red-600"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="lg:col-span-8 bg-white p-10 border border-stone-100 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-900">
              — Conversion Archive
            </h3>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-stone-300">
              <Globe size={12} /> Live traffic mapping
            </div>
          </div>
          <div className="grid grid-cols-5 gap-6 items-end h-48">
            <FunnelStep
              label="Views"
              value="25.0k"
              height="100%"
              color="bg-stone-900"
            />
            <FunnelStep
              label="Cart"
              value="12.4k"
              height="75%"
              color="bg-stone-800"
            />
            <FunnelStep
              label="Checkout"
              value="8.1k"
              height="55%"
              color="bg-red-600"
            />
            <FunnelStep
              label="Paid"
              value={analytics.totalOrders}
              height="40%"
              color="bg-stone-400"
            />
            <FunnelStep
              label="Drop"
              value="3.1k"
              height="25%"
              color="bg-stone-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- সাব-কম্পোনেন্টস (থিম মেইনটেইনড) ---

const StatCard = ({ title, value, icon, isUp, id }) => (
  <div className="bg-white p-10 flex flex-col items-start transition-all duration-700 hover:bg-stone-50/50 group relative overflow-hidden">
    <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors">
      — {id}
    </span>
    <div className="mb-10 text-stone-900 group-hover:text-red-600 transition-colors">
      {icon}
    </div>
    <div className="space-y-3 relative z-10">
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

const FunnelStep = ({ label, value, height, color }) => (
  <div className="flex flex-col items-center gap-5 h-full justify-end group">
    <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
      <p className="text-[10px] font-black text-stone-900 uppercase tracking-tighter">
        {value}
      </p>
    </div>
    <div
      style={{ height: height }}
      className={`w-full ${color} transition-all duration-700 relative overflow-hidden group-hover:brightness-90`}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest text-center leading-tight">
      — {label}
    </p>
  </div>
);

export default AdminAnalyticsView;
