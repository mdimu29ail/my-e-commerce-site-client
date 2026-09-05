import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import UserSidebar from './components/UserSidebar';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  Minus,
  Hash,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-white flex font-sans selection:bg-red-50 selection:text-red-600">
      {/* ১. সিগনেচার সাইডবার */}
      <UserSidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col md:ml-72 transition-all duration-500">
        {/* ২. এডিটোরিয়াল হেডার */}
        <header className="h-24 bg-white/90 backdrop-blur-xl border-b border-stone-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-30">
          {/* Left: Branding & Mobile Menu */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-3 md:hidden border border-stone-100 text-stone-900 hover:bg-stone-900 hover:text-white transition-all"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:block space-y-1">
              <div className="flex items-center gap-3 text-red-600">
                <Minus size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                  Citizen Protocol
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-light text-stone-900 tracking-tighter leading-none uppercase">
                Archive{' '}
                <span className="italic font-serif text-red-600 lowercase tracking-normal">
                  — {user?.name.split(' ')[0]}.
                </span>
              </h1>
            </div>
          </div>

          {/* Right: Intelligence Stats & Profile */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Loyalty Manifest */}
            <div className="hidden lg:flex flex-col items-end">
              <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest">
                Loyalty Ingress
              </p>
              <div className="flex items-center gap-2 text-stone-900">
                <span className="text-[11px] font-black tracking-widest">
                  {user?.loyaltyPoints || 0}
                </span>
                <Activity size={10} className="text-red-600" />
              </div>
            </div>

            {/* Notifications */}
            <button className="p-3 text-stone-400 hover:text-stone-900 transition-colors relative group">
              <Bell size={20} strokeWidth={1.5} />
              <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
            </button>

            {/* User Identity Matrix */}
            <div className="flex items-center gap-4 border-l border-stone-100 pl-6 md:pl-8">
              <div className="flex flex-col items-end hidden md:block">
                <p className="text-[10px] font-black text-stone-900 uppercase tracking-tighter leading-none">
                  {user?.name}
                </p>
                <p className="text-[8px] font-bold text-stone-300 uppercase tracking-widest mt-1">
                  Ref: {user?._id?.slice(-6).toUpperCase()}
                </p>
              </div>
              <div className="w-11 h-11 bg-stone-900 border border-stone-800 flex items-center justify-center text-white font-black text-xs relative overflow-hidden group">
                {user?.avatar || user?.image ? (
                  <img
                    src={user.avatar || user.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Identity"
                  />
                ) : (
                  user?.name.charAt(0)
                )}
                <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </header>

        {/* ৩. মেইন আর্কাইভ কন্টেন্ট */}
        <main className="p-6 md:p-12 lg:p-16 flex-1 bg-stone-50/30">
          {/* Content Wrapper with subtle animation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Footer Detail (Optional but fits theme) */}
        <footer className="px-12 py-8 border-t border-stone-100 flex justify-between items-center bg-white">
          <p className="text-[8px] font-bold text-stone-300 uppercase tracking-[0.4em]">
            OmerShop360 — Intelligence Atelier
          </p>
          <div className="flex items-center gap-4">
            <ShieldCheck size={12} className="text-stone-200" />
            <span className="text-[8px] font-black text-stone-200 uppercase tracking-widest">
              Encrypted Archive Access
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UserDashboard;
