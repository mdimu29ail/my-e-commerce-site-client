import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import {
  LayoutGrid,
  Package,
  ListTree,
  Users2,
  UserCheck2,
  TicketPercent,
  LifeBuoy,
  BarChart3,
  Settings2,
  Cpu,
  Megaphone,
  ShieldCheck,
  LogOut,
  X,
  ShoppingBag,
  ArrowUpRight,
  MessageSquare,
  MessageSquareText,
  Minus,
  Layers,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuGroups = [
    {
      group: 'Intelligence',
      items: [
        {
          name: t('admin.analytics'),
          path: '/admin/analytics',
          icon: <BarChart3 size={18} strokeWidth={1.5} />,
        },
        {
          name: t('admin.ai_agent'),
          path: '/admin/ai-agent',
          icon: <Cpu size={18} strokeWidth={1.5} />,
        },
        {
          name: 'Concierge Chat',
          path: '/admin/chat',
          icon: <MessageSquare size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      group: 'Collection Archive',
      items: [
        {
          name: 'Add Archive Piece',
          path: '/admin/add-product',
          icon: <PlusThin size={18} />,
        },

        {
          name: 'Header Orchestration',
          path: '/admin/header',
          icon: <LayoutGrid size={18} strokeWidth={1.5} />,
        },
        {
          name: 'Archive Pieces',
          path: '/admin/my-products',
          icon: <Layers size={18} strokeWidth={1.5} />,
        },
        {
          name: 'Inventory Logistics',
          path: '/admin/inventory',
          icon: <Package size={18} strokeWidth={1.5} />,
        },
        {
          name: 'Category Archive',
          path: '/admin/categories',
          icon: <ListTree size={18} strokeWidth={1.5} />,
        },
        {
          name: 'Client Orders',
          path: '/admin/orders',
          icon: <ShoppingBag size={18} strokeWidth={1.5} />,
        },
        {
          name: 'Public Appraisals',
          path: '/admin/reviews',
          icon: <MessageSquareText size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      group: 'Clientele',
      items: [
        {
          name: 'Entry Approvals',
          path: '/admin/approvals',
          icon: <UserCheck2 size={18} strokeWidth={1.5} />,
        },
        {
          name: 'Global Users',
          path: '/admin/users',
          icon: <Users2 size={18} strokeWidth={1.5} />,
        },
        {
          name: 'Permissions',
          path: '/admin/roles',
          icon: <ShieldCheck size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      group: 'Curated Marketing',
      items: [
        {
          name: 'Privilege Coupons',
          path: '/admin/coupons',
          icon: <TicketPercent size={18} strokeWidth={1.5} />,
        },
        {
          name: 'Archive Reports',
          path: '/admin/reports',
          icon: <BarChart3 size={18} strokeWidth={1.5} />,
        },
        {
          name: 'Campaign Narrative',
          path: '/admin/marketing',
          icon: <Megaphone size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      group: 'Atelier Support',
      items: [
        {
          name: 'Support Narrative',
          path: '/admin/tickets',
          icon: <LifeBuoy size={18} strokeWidth={1.5} />,
        },
        {
          name: 'Core Settings',
          path: '/admin/settings',
          icon: <Settings2 size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  // মডার্ন হিউম্যানিস্ট লিঙ্ক স্টাইল
  const activeLink =
    'flex items-center space-x-4 bg-stone-900 text-white p-3.5 rounded-sm transition-all duration-500 shadow-2xl relative z-10';
  const normalLink =
    'flex items-center space-x-4 text-stone-400 p-3.5 rounded-sm hover:text-stone-900 transition-all duration-300 group';

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
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-stone-100 transform transition-all duration-700 ease-out flex flex-col font-sans
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      >
        {/* লোগো সেকশন - Editorial Style */}
        <div className="p-10 flex items-center justify-between border-b border-stone-50">
          <Link to="/" className="flex flex-col items-start gap-1 group">
            <div className="flex items-center gap-2">
              <div className="h-[2px] w-6 bg-red-600" />
              <h1 className="text-xl font-black text-stone-900 tracking-tighter uppercase leading-none">
                Omer<span className="text-red-600">Archive</span>
              </h1>
            </div>
            <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.4em] transition-colors group-hover:text-red-600">
              Atelier Admin — v2.4
            </p>
          </Link>
          <button
            className="md:hidden p-2 text-stone-300"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* নেভিগেশন - Humanist Scroll Area */}
        <nav className="flex-1 overflow-y-auto px-6 py-10 space-y-10 no-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-3 mb-6 px-3">
                <Minus size={14} className="text-red-600" />
                <h3 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.4em]">
                  {group.group}
                </h3>
              </div>
              <div className="space-y-1">
                {group.items.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    <span className="transition-transform group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-widest leading-none mt-0.5">
                      {item.name}
                    </span>

                    {/* একটিভ ইন্ডিকেটর - এডিটোরিয়াল লাইন */}
                    <ArrowUpRight
                      size={14}
                      className="ml-auto opacity-0 group-hover:opacity-100 group-hover:text-red-600 transition-all"
                    />
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* সাইন আউট সেকশন - Linear Design */}
        {/* <div className="p-8 border-t border-stone-50 bg-[#FBFBFB]">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-4 bg-white border border-stone-100 py-4 text-[10px] font-black uppercase tracking-[0.4em] text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-500 shadow-xl shadow-stone-200/50 group"
          >
            <LogOut
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Archive Logout
          </button>
        </div> */}
      </aside>

      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

// কাস্টম থিন আইকন
const PlusThin = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default AdminSidebar;
