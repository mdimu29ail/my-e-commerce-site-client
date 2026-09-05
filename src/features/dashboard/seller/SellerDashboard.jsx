import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import SellerSidebar from './components/SellerSidebar';
import {
  Menu,
  Bell,
  AlertTriangle,
  ChevronDown,
  User,
  Home,
  LogOut,
  Settings,
  Search,
  Minus,
  LayoutGrid,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const SellerDashboard = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // মেনুর বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করার লজিক
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // সিকিউরিটি চেক
  if (user?.role !== 'seller' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white flex font-sans selection:bg-red-50 selection:text-red-600">
      {/* ১. এডিটোরিয়াল সাইডবার */}
      <SellerSidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col md:ml-72 transition-all duration-500">
        {/* ২. এডিটোরিয়াল টপ হেডার (Atelier Navbar) */}
        <header className="h-24 bg-white border-b border-stone-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-30 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)]">
          {/* লেফট সেকশন: কন্ট্রোল সেন্টার টাইটেল */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-stone-400 md:hidden hover:text-red-600 transition-colors"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
            <div className="hidden sm:flex items-center gap-4">
              <div className="h-8 w-[1px] bg-stone-100" />
              <h1 className="text-sm font-black text-stone-900 uppercase tracking-[0.4em] flex items-center gap-3">
                Seller{' '}
                <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
                  — portal.
                </span>
              </h1>
            </div>
          </div>

          {/* রাইট সেকশন: মেটা এলিমেন্টস */}
          <div className="flex items-center space-x-6 md:space-x-10">
            {/* লিনিয়ার সার্চ (Luxury Style) */}
            <div className="hidden lg:flex items-center relative group">
              <input
                type="text"
                placeholder="SEARCH INVENTORY..."
                className="bg-transparent border-b border-stone-100 py-2 text-[10px] font-bold text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-red-600 transition-all duration-700 w-48 uppercase tracking-widest"
              />
              <Search
                size={14}
                className="absolute right-0 top-2.5 text-stone-300 group-focus-within:text-red-600 transition-colors"
              />
            </div>

            {/* নোটিফিকেশন আইকন */}
            <button className="relative text-stone-300 hover:text-red-600 transition-all group">
              <Bell size={20} strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full border-2 border-white shadow-sm"></span>
            </button>

            {/* ৩. প্রোফাইল ড্রপডাউন (Identity Section) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-5 pl-8 border-l border-stone-100 group"
              >
                <div className="text-right hidden md:block space-y-0.5">
                  <p className="text-[11px] font-black text-stone-900 uppercase tracking-widest leading-none">
                    {user?.name}
                  </p>
                  <span className="text-[9px] font-bold text-red-600 uppercase tracking-[0.3em] inline-block">
                    {user?.shopName || 'Atelier Curator'}
                  </span>
                </div>

                {/* শার্প স্কয়ার অভাতার */}
                <div className="relative">
                  <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white font-black text-xs shadow-2xl transition-transform group-hover:scale-105">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover grayscale"
                      />
                    ) : (
                      <span className="uppercase tracking-tighter">
                        {user?.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white bg-green-500 shadow-sm" />
                </div>
              </button>

              {/* ড্রপডাউন কার্ড (Humanist Menu) */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-6 w-64 bg-white border border-stone-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] py-4 z-50 rounded-sm overflow-hidden ring-1 ring-black/5"
                  >
                    <div className="px-6 py-4 bg-stone-50/50 border-b border-stone-100 mb-2">
                      <span className="text-[8px] font-black text-stone-400 uppercase tracking-[0.5em] block mb-1">
                        Authenticated Curator
                      </span>
                      <p className="text-[12px] font-black text-stone-900 uppercase tracking-tighter truncate">
                        {user?.name}
                      </p>
                    </div>

                    <div className="space-y-1 px-2">
                      <DropdownLink
                        to="/profile"
                        icon={<User size={15} />}
                        label="Curator Profile"
                      />
                      <DropdownLink
                        to="/"
                        icon={<Home size={15} />}
                        label="Live Atelier"
                      />
                      <DropdownLink
                        to="/seller/settings"
                        icon={<Settings size={15} />}
                        label="Shop Configuration"
                      />
                    </div>

                    <div className="h-[1px] bg-stone-100 my-4 mx-6" />

                    <div className="px-2 pb-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-4 text-[10px] text-red-600 hover:bg-red-50 font-black uppercase tracking-[0.4em] transition-all group/logout"
                      >
                        <LogOut
                          size={16}
                          className="mr-4 group-hover/logout:-translate-x-1 transition-transform"
                        />
                        Exit Portal
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ৩. সেলার অ্যাপ্রুভাল চেক (Editorial Alert Style) */}
        {!user?.isApproved && (
          <div className="m-6 md:m-12 p-8 md:p-12 bg-stone-50 border-l-4 border-red-600 flex items-start gap-8 relative overflow-hidden group">
            <div className="relative z-10 flex items-start gap-8">
              <AlertTriangle
                className="text-red-600 shrink-0"
                size={32}
                strokeWidth={1.5}
              />
              <div className="space-y-3">
                <h4 className="font-black text-stone-900 uppercase tracking-tighter text-xl">
                  Identity Pending Approval
                </h4>
                <p className="text-[11px] text-stone-500 uppercase tracking-widest leading-loose max-w-2xl">
                  Your curation status is currently being appraised by the
                  archive head. Full archival and sales capabilities will unlock
                  upon final authentication. Standard processing time — 24 to 48
                  hours.
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <ShieldCheck size={120} />
            </div>
          </div>
        )}

        {/* মেইন ভিউ লোডিং এরিয়া */}
        <main className="p-8 md:p-12 lg:p-16 flex-1 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// হেল্পার ড্রপডাউন লিঙ্ক কম্পোনেন্ট
const DropdownLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-all group"
  >
    <span className="mr-4 opacity-40 group-hover:text-red-600 group-hover:opacity-100 transition-all">
      {icon}
    </span>
    {label}
  </Link>
);

export default SellerDashboard;
