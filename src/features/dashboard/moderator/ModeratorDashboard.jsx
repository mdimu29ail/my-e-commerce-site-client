import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import ModeratorSidebar from './components/ModeratorSidebar';
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Home,
  Minus,
  Hash,
  ShieldCheck,
  Activity,
  Search,
  Command,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const ModeratorDashboard = () => {
  const { t } = useTranslation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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

  return (
    <div className="min-h-screen bg-white flex font-sans selection:bg-red-50 selection:text-red-600">
      {/* ১. মডারেটর সাইডবার */}
      <ModeratorSidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col md:ml-72 transition-all duration-500">
        {/* ২. এডিটোরিয়াল হেডার (Moderator Protocol) */}
        <header className="h-24 bg-white/90 backdrop-blur-xl border-b border-stone-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-30">
          {/* Left: Section Identity */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-3 md:hidden border border-stone-100 text-stone-900 hover:bg-stone-900 hover:text-white transition-all"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:block space-y-1">
              <div className="flex items-center gap-3 text-red-600">
                <Command size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                  System Moderator Protocol
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-light text-stone-900 tracking-tighter leading-none uppercase">
                Moderator{' '}
                <span className="italic font-serif text-red-600 lowercase tracking-normal">
                  — center.
                </span>
              </h1>
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Search Trigger (Signature Look) */}
            <button className="hidden lg:flex items-center gap-3 text-stone-300 hover:text-stone-900 transition-colors">
              <span className="text-[9px] font-black uppercase tracking-widest">
                Global Search
              </span>
              <Search size={16} strokeWidth={2.5} />
            </button>

            {/* Profile Matrix */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-4 pl-6 border-l border-stone-100 cursor-pointer group"
              >
                <div className="text-right hidden md:block space-y-1">
                  <p className="text-[10px] font-black text-stone-900 uppercase tracking-tighter leading-none">
                    {user?.name || 'Moderator'}
                  </p>
                  <span className="text-[8px] font-bold text-red-600 uppercase tracking-widest block">
                    Access: {user?.role || 'Staff'}
                  </span>
                </div>

                <div className="w-10 h-10 bg-stone-900 border border-stone-800 flex items-center justify-center text-white font-black text-xs relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
                  <img
                    src={user?.photoURL}
                    alt={user?.name || 'Moderator'}
                    className="w-10 h-10 rounded-full"
                  />
                </div>

                <ChevronDown
                  size={14}
                  className={`text-stone-300 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180 text-red-600' : ''}`}
                />
              </button>

              {/* Dropdown Menu (Brutalist Style) */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-60 bg-white border border-stone-100 shadow-2xl py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-stone-50 mb-2">
                      <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest">
                        Identity Manifest
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center justify-between px-5 py-3 text-[10px] font-black uppercase tracking-widest text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all group"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span>My Profile</span>
                      <User
                        size={14}
                        className="text-stone-200 group-hover:text-red-600 transition-colors"
                      />
                    </Link>

                    <Link
                      to="/"
                      className="flex items-center justify-between px-5 py-3 text-[10px] font-black uppercase tracking-widest text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all group"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span>Website Ingress</span>
                      <Home
                        size={14}
                        className="text-stone-200 group-hover:text-red-600 transition-colors"
                      />
                    </Link>

                    <div className="border-t border-stone-100 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 hover:bg-red-50 transition-all text-left group"
                    >
                      <span>Terminate Session</span>
                      <LogOut
                        size={14}
                        className="group-hover:-translate-x-1 transition-transform"
                      />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ৩. মেইন প্রোটোকল কন্টেন্ট */}
        <main className="p-6 md:p-12 lg:p-16 flex-1 bg-stone-50/30">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Footer Detail */}
        <footer className="px-12 py-8 border-t border-stone-100 flex justify-between items-center bg-white">
          <p className="text-[8px] font-bold text-stone-300 uppercase tracking-[0.4em]">
            OmerShop360 — Moderator Authority Center
          </p>
          <div className="flex items-center gap-4">
            <ShieldCheck size={12} className="text-stone-200" />
            <span className="text-[8px] font-black text-stone-200 uppercase tracking-widest">
              Protocol Verified Access
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
