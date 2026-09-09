import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Shadow on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('[data-profile-menu]')) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/shop?search=' + encodeURIComponent(searchQuery.trim()));
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    const roleMap = { admin: '/admin', seller: '/seller', moderator: '/moderator' };
    return roleMap[user.role] || '/user';
  };

  const navLinks = [
    { label: 'Shop', to: '/shop' },
    { label: 'Categories', to: '/categories' },
    { label: 'Flash Sale', to: '/flash-sale', icon: <Zap size={12} className="text-red-500" /> },
    { label: 'Tracking', to: '/tracking' },
  ];

  return (
    <header
      className={'sticky top-0 z-50 bg-white transition-shadow duration-300 ' + (isScrolled ? 'shadow-md' : 'border-b border-stone-100')}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <div className="text-2xl font-black tracking-tighter text-stone-900">
              OmerShop<span className="text-red-600">360</span>
            </div>
            <div className="h-[1.5px] w-0 bg-red-600 group-hover:w-full transition-all duration-500" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, to, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  'flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.15em] transition-colors duration-200 ' +
                  (isActive ? 'text-red-600' : 'text-stone-500 hover:text-stone-900')
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="p-2 text-stone-500 hover:text-red-600 transition-colors" aria-label="Wishlist">
              <Heart size={18} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-stone-500 hover:text-stone-900 transition-colors" aria-label="Cart">
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </Link>

            {/* Profile / Login */}
            {isAuthenticated ? (
              <div className="relative" data-profile-menu>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-1.5 p-1.5 rounded-full border border-stone-200 hover:border-stone-400 transition-colors"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-black">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <ChevronDown size={12} className={'text-stone-400 transition-transform duration-200 ' + (profileOpen ? 'rotate-180' : '')} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white border border-stone-100 rounded-lg shadow-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-stone-100">
                        <p className="text-[11px] font-black text-stone-900 uppercase tracking-widest truncate">{user?.name}</p>
                        <p className="text-[10px] text-stone-400 truncate mt-0.5">{user?.email}</p>
                      </div>
                      <Link to={getDashboardLink()} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                        <LayoutDashboard size={13} /> Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                        <User size={13} /> Profile
                      </Link>
                      <button
                        onClick={() => { setProfileOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors border-t border-stone-100"
                      >
                        <LogOut size={13} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-white bg-stone-900 hover:bg-red-600 rounded-sm transition-colors duration-200"
              >
                <User size={13} /> Login
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 text-stone-500 hover:text-stone-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-stone-100"
            >
              <form onSubmit={handleSearch} className="py-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-stone-100 bg-white overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map(({ label, to, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    'flex items-center gap-2 px-3 py-3 text-[12px] font-bold uppercase tracking-[0.15em] rounded-sm transition-colors ' +
                    (isActive ? 'bg-red-50 text-red-600' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900')
                  }
                >
                  {icon}
                  {label}
                </NavLink>
              ))}

              <div className="border-t border-stone-100 mt-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-stone-600 hover:bg-stone-50 rounded-sm transition-colors">
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-stone-600 hover:bg-stone-50 rounded-sm transition-colors">
                      <User size={14} /> Profile
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); logout(); }}
                      className="w-full flex items-center gap-2 px-3 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-stone-900 hover:bg-stone-50 rounded-sm transition-colors">
                    <User size={14} /> Login / Register
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
