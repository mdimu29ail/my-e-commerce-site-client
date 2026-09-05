import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import {
  LayoutGrid,
  MessageSquareText,
  AlertTriangle,
  FileText,
  LogOut,
  X,
  Home,
  ArrowUpRight,
  UserX,
  Flag,
  MessageSquare,
  ShoppingBag,
  Minus,
  Command,
  ShieldCheck,
  ShieldAlert,
  Package,
  Plus,
  Mail,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ModeratorSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const menuGroups = [
    {
      group: 'PRODUCT & INVENTORY',
      items: [
        {
          name: 'ADD PRODUCT',
          path: '/moderator/add-product',
          icon: <Plus size={16} />,
        },
        {
          name: 'INVENTORY MANIFEST',
          path: '/moderator/inventory',
          icon: <Package size={16} />,
        },
      ],
    },
    {
      group: 'TASK MANIFEST',
      items: [
        {
          name: 'ORDER CONFIRMATION',
          path: '/moderator/orders',
          icon: <ShoppingBag size={16} />,
        },
        {
          name: 'COMMENT REVIEWS',
          path: '/moderator/comments',
          icon: <MessageSquareText size={16} />,
        },
        {
          name: 'SENTIMENT LEDGER',
          path: '/moderator/reviews',
          icon: <MessageSquare size={16} />,
        },
        {
          name: 'DISPUTE RESOLUTION',
          path: '/moderator/disputes',
          icon: <AlertTriangle size={16} />,
        },
        {
          name: 'PROTOCOL REPORTS',
          path: '/moderator/reports',
          icon: <FileText size={16} />,
        },

        {
          name: 'IDENTITY SUSPENSION',
          path: '/moderator/suspension',
          icon: <UserX size={16} />,
        },
        {
          name: 'FLAGGED ARTIFACTS',
          path: '/moderator/flagged',
          icon: <Flag size={16} />,
        },
        {
          name: 'CORRESPONDENCE',
          path: '/moderator/correspondence',
          icon: <Mail size={16} />,
        },
        {
          name: 'SECURITY PROTOCOLS',
          path: '/moderator/security',
          icon: <ShieldAlert size={16} />,
        },
        {
          name: 'ARCHIVE CHAT',
          path: '/moderator/chat',
          icon: <MessageSquare size={16} />,
        },
      ],
    },
  ];

  // Signature Brutalist Styles
  const activeLink =
    'flex items-center space-x-4 bg-stone-900 text-white p-4 relative group transition-all duration-500 shadow-2xl';
  const normalLink =
    'flex items-center space-x-4 text-stone-400 p-4 hover:bg-stone-50 hover:text-stone-900 transition-all duration-300 group border-b border-stone-50/50';

  return (
    <>
      {/* Mobile Overlay */}
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
        {/* 1. BRANDING / HEADER */}
        <div className="p-8 pb-12 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <Link to="/" className="space-y-1">
              <div className="flex items-center gap-2 text-red-600">
                <Minus size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                  Moderator Archive
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
              className="md:hidden text-stone-400 hover:text-stone-900 transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 2. NAVIGATION LEDGER */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-6">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-10">
              <div className="px-8 mb-6">
                <p className="text-[8px] font-black text-stone-300 uppercase tracking-[0.5em]">
                  {group.group}
                </p>
              </div>

              <div className="space-y-0">
                {group.items.map(item => (
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

                        {/* Active Indicator Line */}
                        {isActive && (
                          <motion.div
                            layoutId="mod_active_bar"
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
            </div>
          ))}
        </nav>
      </aside>

      {/* Custom Scrollbar CSS (Signature) */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

export default ModeratorSidebar;
