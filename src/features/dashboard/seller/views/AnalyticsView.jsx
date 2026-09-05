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
} from 'recharts';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  Archive,
  Sparkle,
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import Loader from '../../../../components/shared/Loader';
import { motion } from 'framer-motion';

const SellerAnalyticsView = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  // --- ডাটা স্টেটস ---
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // ১. মঙ্গোডিবি থেকে রিয়েল ডাটা ফেচ করা
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [orderRes, prodRes] = await Promise.all([
          axios.get(`${API_URL}/orders`, { withCredentials: true }),
          axios.get(`${API_URL}/products/seller/${user?._id || user?.id}`, {
            withCredentials: true,
          }), // সেলারের নির্দিষ্ট প্রোডাক্ট
        ]);

        // আপনার এপিআই রেসপন্স অনুযায়ী ডাটা সেট করা
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
        console.error('Atelier Intelligence Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user, API_URL]);

  // ২. ডাটা প্রসেসিং লজিক (Raw Data -> Luxury Analytics)
  const analytics = useMemo(() => {
    if (!orders.length && !products.length) return null;

    // টোটাল আর্নিং এবং অর্ডার ক্যালকুলেশন
    const totalEarnings = orders.reduce(
      (sum, o) => sum + (o.isPaid ? o.totalPrice : 0),
      0
    );
    const totalOrders = orders.length;
    const inventoryCount = products.length;

    // সেলস চার্ট ডাটা (গত ৭ দিন)
    const salesMap = {};
    orders
      .slice()
      .reverse()
      .forEach(o => {
        const day = new Date(o.createdAt)
          .toLocaleDateString('en-US', { weekday: 'short' })
          .toUpperCase();
        salesMap[day] = (salesMap[day] || 0) + o.totalPrice;
      });
    const salesChart = Object.keys(salesMap).map(name => ({
      name,
      sales: salesMap[name],
    }));

    // টপ সেলিং প্রোডাক্টস (অর্ডার আইটেম থেকে)
    const productSales = {};
    orders.forEach(o => {
      o.orderItems?.forEach(item => {
        productSales[item.nameEn] = (productSales[item.nameEn] || 0) + item.qty;
      });
    });
    const topSelling = Object.keys(productSales)
      .map(name => ({ name, sales: productSales[name] }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4);

    return {
      totalEarnings,
      totalOrders,
      inventoryCount,
      salesChart,
      topSelling,
    };
  }, [orders, products]);

  if (loading)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-12 font-sans selection:bg-red-50 selection:text-red-600">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">
              Curation Intelligence
            </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Atelier <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — performance.
            </span>
          </h2>
        </div>
      </div>

      {/* স্ট্যাট গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-100 border border-stone-100 shadow-2xl">
        <StatCard
          id="01"
          title="Net Earnings"
          value={`৳${(analytics?.totalEarnings / 1000).toFixed(1)}L`}
          trend="+15%"
          icon={<Sparkle size={20} />}
        />
        <StatCard
          id="02"
          title="Archive Orders"
          value={analytics?.totalOrders || 0}
          trend="+8%"
          icon={<ShoppingBag size={20} />}
        />
        <StatCard
          id="03"
          title="Appraisal"
          value="4.9/5"
          trend="+0.1%"
          icon={<Star size={20} />}
        />
        <StatCard
          id="04"
          title="Inventory"
          value={analytics?.inventoryCount || 0}
          trend="Live"
          icon={<Package size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* সেলস চার্ট */}
        <div className="lg:col-span-8 bg-white p-10 border border-stone-100">
          <div className="flex items-center gap-4 mb-12">
            <TrendingUp size={18} className="text-red-600" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-900">
              Weekly Narrative —
            </h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.salesChart}>
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
                  dy={15}
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
                  dataKey="sales"
                  stroke="#e11d48"
                  strokeWidth={2}
                  fillOpacity={0.05}
                  fill="#e11d48"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* রিসেন্ট লগ */}
        <div className="lg:col-span-4 bg-stone-900 p-10 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-400 mb-10 flex items-center gap-3">
              <Clock size={14} className="text-red-600" /> Latest Log
            </h3>
            <div className="space-y-10">
              {orders.slice(0, 3).map((order, i) => (
                <div key={i} className="space-y-3 group cursor-default">
                  <p className="text-[11px] font-bold text-stone-100 uppercase tracking-widest leading-relaxed">
                    Archive Order #{order._id.slice(-6).toUpperCase()} final
                    settlement.
                  </p>
                  <p className="text-[9px] text-stone-500 font-black uppercase tracking-widest">
                    — {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-12 w-full py-5 border border-stone-800 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-stone-900 transition-all duration-500">
            Order Manifesto
          </button>
        </div>
      </div>

      {/* টপ সেলিং টেবিল */}
      <div className="bg-white border border-stone-100 overflow-hidden">
        <div className="p-10 border-b border-stone-50 flex justify-between items-center bg-stone-50/30">
          <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-900">
            Curated Movement
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] font-black uppercase text-stone-300 tracking-[0.4em]">
                <th className="px-10 py-6 font-black">Archive Identity</th>
                <th className="px-10 py-6 font-black text-right">
                  Volume Sold
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {analytics?.topSelling.map((prod, i) => (
                <tr
                  key={i}
                  className="hover:bg-stone-50/50 transition-all group"
                >
                  <td className="px-10 py-6 text-[11px] font-black text-stone-900 uppercase tracking-widest">
                    {prod.name}
                  </td>
                  <td className="px-10 py-6 text-right text-[10px] font-black text-red-600 uppercase tracking-tighter">
                    {prod.sales} Units
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, id, icon: Icon }) => (
  <div className="bg-white p-10 flex flex-col items-start transition-all duration-700 hover:bg-stone-50/50 group relative">
    <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors">
      — {id}
    </span>
    <div className="mb-10 text-stone-900 group-hover:text-red-600 transition-colors">
      {Icon}
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

export default SellerAnalyticsView;
