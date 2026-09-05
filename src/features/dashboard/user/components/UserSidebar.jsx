import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import {
  ShoppingBag,
  Truck,
  User,
  Award,
  MessageCircle,
  LogOut,
  X,
  LayoutDashboard,
  Heart,
  Minus,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { logout, user } = useAuth();

  // মেনু আইটেমসমূহ (No dots, No underscores)
  const menuItems = [
    {
      name: 'PROTOCOL LEDGER',
      path: '/user/analytics',
      icon: <LayoutDashboard size={16} />,
    },
    {
      name: 'ORDER HISTORY',
      path: '/user/orders',
      icon: <ShoppingBag size={16} />,
    },
    {
      name: 'LOGISTICS TRACK',
      path: '/user/tracking',
      icon: <Truck size={16} />,
    },
    {
      name: 'LOYALTY REWARDS',
      path: '/user/loyalty',
      icon: <Award size={16} />,
    },
    { name: 'CURATED LIST', path: '/user/wishlist', icon: <Heart size={16} /> },
    { name: 'SUPPORT CONSOLE', path: '/user/support', icon: <Zap size={16} /> },
    {
      name: 'ARCHIVE CHAT',
      path: '/user/chat',
      icon: <MessageCircle size={16} />,
    },
    {
      name: 'IDENTITY SETTINGS',
      path: '/user/settings',
      icon: <User size={16} />,
    },
    {
      name: 'RETURN REQUESTS',
      path: '/user/returns',
      icon: <ShieldCheck size={16} />,
    },
  ];

  const activeLink =
    'flex items-center space-x-4 bg-stone-900 text-white p-4 relative group transition-all duration-500 shadow-2xl';
  const normalLink =
    'flex items-center space-x-4 text-stone-400 p-4 hover:bg-stone-50 hover:text-stone-900 transition-all duration-300 group border-b border-stone-50/50';

  return (
    <>
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
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-stone-100 transform transition-transform duration-700 ease-[0.19,1,0.22,1] flex flex-col ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* BRANDING */}
        <div className="p-8 pb-12 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <Link to="/" className="space-y-1">
              <div className="flex items-center gap-2 text-red-600">
                <Minus size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                  Atelier Archive
                </span>
              </div>
              <h1 className="text-2xl font-light text-stone-900 tracking-tighter uppercase">
                OmerShop
                <span className="italic font-serif text-red-600 lowercase">
                  360.
                </span>
              </h1>
            </Link>
            <button
              className="md:hidden text-stone-400"
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-6">
          <div className="px-4 mb-6">
            <p className="text-[8px] font-black text-stone-300 uppercase tracking-[0.5em] px-4 mb-4">
              User Manifest
            </p>
          </div>

          <div className="space-y-0">
            {menuItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-red-600' : ''}`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {item.name}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="sidebar_active_bar"
                        className="absolute left-0 top-0 bottom-0 w-[3px] bg-red-600"
                      />
                    )}

                    <ArrowUpRight
                      size={10}
                      className={`absolute right-4 opacity-0 group-hover:opacity-100 transition-all ${isActive ? 'text-stone-700' : 'text-stone-200'}`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* FOOTER */}
        <div className="p-8 border-t border-stone-100 space-y-6 bg-stone-50/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-8 bg-stone-900 flex items-center justify-center text-white text-[10px] font-black uppercase">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-stone-900 uppercase tracking-tight">
                {user?.name}
              </span>
              <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">
                Citizen Status
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="group w-full flex items-center justify-center space-x-3 p-4 bg-white border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-600 transition-all duration-500 relative overflow-hidden"
          >
            <LogOut size={16} className="relative z-10" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] relative z-10">
              TERMINATE SESSION
            </span>
            <div className="absolute inset-0 bg-red-50 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>

          <div className="flex items-center justify-center gap-2 text-stone-200">
            <ShieldCheck size={12} />
            <span className="text-[7px] font-black uppercase tracking-[0.4em]">
              Archival Access Secured
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
