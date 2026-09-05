import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Home,
  Settings,
  Minus,
  LayoutGrid,
  ShieldCheck,
  X,
  Archive,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // নোটিফিকেশন স্টেট

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // বাইরের ক্লিক হ্যান্ডল করার জন্য
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ডামি নোটিফিকেশন ডাটা
  const notifications = [
    {
      id: 1,
      title: 'New Archive Piece',
      desc: 'A new curated selection was added.',
      time: '2m ago',
      type: 'system',
    },
    {
      id: 2,
      title: 'Inventory Alert',
      desc: "Minimal stock remaining for 'The Archive'.",
      time: '1h ago',
      type: 'alert',
    },
    {
      id: 3,
      title: 'Client Inquiry',
      desc: 'New message in Concierge Chat.',
      time: '3h ago',
      type: 'message',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex font-sans selection:bg-red-50 selection:text-red-600">
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col md:ml-72 transition-all duration-500">
        <header className="h-24 bg-white border-b border-stone-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-30">
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
                Atelier{' '}
                <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
                  — control.
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-6 md:space-x-10">
            {/* সার্চ বার */}
            <div className="hidden lg:flex items-center relative group">
              <input
                type="text"
                placeholder="SEARCH ARCHIVE..."
                className="bg-transparent border-b border-stone-100 py-2 text-[10px] font-bold text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-red-600 transition-all w-48 uppercase tracking-widest"
              />
              <Search
                size={14}
                className="absolute right-0 top-2.5 text-stone-300 group-focus-within:text-red-600 transition-colors"
              />
            </div>

            {/* --- ৪. নোটিফিকেশন সেকশন (পপআপ সহ) --- */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsDropdownOpen(false);
                }}
                className={`relative transition-all duration-500 group ${isNotificationsOpen ? 'text-red-600' : 'text-stone-300 hover:text-red-600'}`}
              >
                <Bell size={20} strokeWidth={1.5} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full border-2 border-white shadow-sm"></span>
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-8 w-80 md:w-96 bg-white border border-stone-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] py-0 z-50 rounded-sm overflow-hidden"
                  >
                    {/* নোটিফিকেশন হেডার */}
                    <div className="px-8 py-6 bg-stone-50/50 border-b border-stone-100 flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.5em] flex items-center gap-3">
                        <Archive size={14} className="text-red-600" />{' '}
                        Notifications
                      </h3>
                      <button className="text-[8px] font-black text-stone-400 uppercase tracking-widest hover:text-red-600 transition-colors">
                        Clear All
                      </button>
                    </div>

                    {/* নোটিফিকেশন লিস্ট */}
                    <div className="max-h-[400px] overflow-y-auto no-scrollbar divide-y divide-stone-50">
                      {notifications.map(note => (
                        <div
                          key={note.id}
                          className="p-8 hover:bg-stone-50/50 transition-all group/item cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.4em] flex items-center gap-2">
                              — {note.type}
                            </span>
                            <span className="text-[8px] font-bold text-stone-300 uppercase tracking-widest">
                              {note.time}
                            </span>
                          </div>
                          <h4 className="text-[11px] font-black text-stone-900 uppercase tracking-widest mb-1 group-hover/item:text-red-600 transition-colors">
                            {note.title}
                          </h4>
                          <p className="text-[10px] text-stone-400 font-medium leading-relaxed uppercase tracking-wider">
                            {note.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* নোটিফিকেশন ফুটার */}
                    <div className="px-8 py-5 border-t border-stone-100 bg-[#FBFBFB] flex justify-center">
                      <button className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-900 hover:text-red-600 transition-all flex items-center gap-3 group">
                        View Narrative Log{' '}
                        <ArrowRight
                          size={12}
                          className="group-hover:translate-x-2 transition-transform"
                        />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* প্রোফাইল ড্রপডাউন */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-5 pl-8 border-l border-stone-100 group"
              >
                <div className="text-right hidden md:block space-y-0.5">
                  <p className="text-[11px] font-black text-stone-900 uppercase tracking-widest leading-none">
                    {user?.name || 'Admin'}
                  </p>
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.3em]">
                    Archive Head
                  </span>
                </div>
                <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white font-black text-xs shadow-2xl group-hover:scale-105 transition-transform">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      className="w-full h-full object-cover grayscale"
                    />
                  ) : (
                    <span className="uppercase">{user?.name?.charAt(0)}</span>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-8 w-64 bg-white border border-stone-100 shadow-2xl py-4 z-50"
                  >
                    <div className="px-6 py-4 bg-stone-50 border-b border-stone-100 mb-2">
                      <span className="text-[8px] font-black text-red-600 uppercase tracking-[0.5em] block mb-1">
                        Authenticated
                      </span>
                      <p className="text-[12px] font-black text-stone-900 uppercase tracking-tighter truncate">
                        {user?.name}
                      </p>
                    </div>
                    <DropdownLink
                      to="/profile"
                      icon={<User size={15} />}
                      label="Personal Profile"
                    />
                    <DropdownLink
                      to="/"
                      icon={<Home size={15} />}
                      label="Website Archive"
                    />
                    <div className="h-[1px] bg-stone-100 my-4 mx-6" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-6 py-4 text-[10px] text-red-600 hover:bg-red-50 font-black uppercase tracking-[0.4em] transition-all"
                    >
                      <LogOut size={16} className="mr-4" /> Archive Exit
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="p-8 md:p-16 flex-1 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const DropdownLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center px-6 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-all group"
  >
    <span className="mr-4 opacity-40 group-hover:text-red-600 transition-all">
      {icon}
    </span>
    {label}
  </Link>
);

export default AdminDashboard;
