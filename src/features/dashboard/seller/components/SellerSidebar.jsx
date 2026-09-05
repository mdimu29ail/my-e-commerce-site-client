import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Ticket,
  Settings,
  Headset,
  LogOut,
  X,
  MessageSquare,
  Minus,
  ArrowUpRight,
  Layers,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SellerSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { t } = useTranslation();
  const { logout, user } = useAuth();

  // এডিটোরিয়াল নামসহ মেনু আইটেম
  const menuItems = [
    {
      name: 'Performance',
      path: '/seller/analytics',
      icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
    },
    {
      name: 'Add Product',
      path: '/seller/add-product',
      icon: <Layers size={18} strokeWidth={1.5} />,
    },
    {
      name: 'Inventory Archive',
      path: '/seller/inventory',
      icon: <Layers size={18} strokeWidth={1.5} />,
    },
    {
      name: 'Order Manifest',
      path: '/seller/orders',
      icon: <ShoppingBag size={18} strokeWidth={1.5} />,
    },
    {
      name: 'Privilege Codes',
      path: '/seller/coupons',
      icon: <Ticket size={18} strokeWidth={1.5} />,
    },
    {
      name: 'Concierge Chat',
      path: '/seller/chat',
      icon: <MessageSquare size={18} strokeWidth={1.5} />,
    },
    {
      name: 'Curator Support',
      path: '/seller/support',
      icon: <Headset size={18} strokeWidth={1.5} />,
    },
    {
      name: 'Shop Narrative',
      path: '/seller/settings',
      icon: <Settings size={18} strokeWidth={1.5} />,
    },
  ];

  const activeLink =
    'flex items-center space-x-4 bg-stone-900 text-white p-4 rounded-sm transition-all duration-500 shadow-2xl relative z-10';
  const normalLink =
    'flex items-center space-x-4 text-stone-400 p-4 rounded-sm hover:text-stone-900 transition-all duration-300 group';

  return (
    <>
      {/* মোবাইল ব্যাকড্রপ */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/60 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-stone-100 transform transition-all duration-700 ease-out flex flex-col font-sans ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* লোগো সেকশন - Editorial Identity */}
        <div className="p-10 flex items-center justify-between border-b border-stone-50">
          <Link to="/" className="flex flex-col items-start gap-1 group">
            <div className="flex items-center gap-2">
              <div className="h-[2px] w-6 bg-red-600" />
              <h1 className="text-xl font-black text-stone-900 tracking-tighter uppercase leading-none">
                Omer<span className="text-red-600">Atelier</span>
              </h1>
            </div>
            <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.4em]">
              Curator Portal — 2024
            </p>
          </Link>
          <button
            className="md:hidden p-2 text-stone-300"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* নেভিগেশন - Humanist Layout */}
        <div className="px-6 py-10 flex items-center gap-3">
          <Minus size={14} className="text-red-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-900">
            Archive Index
          </span>
        </div>

        <nav className="flex-1 px-6 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className="transition-transform group-hover:scale-110">
                {item.icon}
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest leading-none mt-0.5">
                {item.name}
              </span>

              {/* একটিভ ইন্ডিকেটর - এডিটোরিয়াল অ্যারো */}
              <ArrowUpRight
                size={14}
                className="ml-auto opacity-0 group-hover:opacity-100 group-hover:text-red-600 transition-all"
              />
            </NavLink>
          ))}
        </nav>

        {/* বটম সেকশন - Logout Manifest */}
        <div className="p-8 border-t border-stone-50 bg-[#FBFBFB]">
          <div className="mb-6 px-2 flex items-center gap-2 text-stone-300">
            <Zap size={12} className="text-red-600" />
            <span className="text-[8px] font-bold uppercase tracking-widest">
              Authenticated Session
            </span>
          </div>
        </div>
      </aside>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

export default SellerSidebar;
