'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  ShoppingCart,
  Menu,
  X,
  LogOut,
  ChevronDown,
  UserCircle,
  Search,
  Heart,
  Phone,
  Mail,
  LayoutDashboard,
  ShieldCheck,
  Minus,
} from 'lucide-react';
import CartDrawer from '../../features/cart/CartDrawer';

const Navbar = () => {
  const { i18n } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems, totalPrice } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [navConfig, setNavConfig] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchNavConfig = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/settings/header`);
        const fetchedData = Array.isArray(data) ? data[0] : data;
        if (fetchedData) setNavConfig(fetchedData);
      } catch (err) {
        console.error('Navbar config fetch failed');
      }
    };
    fetchNavConfig();
  }, [API_URL]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const isActive = path => location.pathname === path;

  const labels = navConfig?.labels || {
    shop: { text: 'Shop', badge: '', color: '' },
    categories: { text: 'Categories', badge: 'SALE', color: '#14b8a6' },
    flash: { text: 'Flash Sale', badge: 'HOT', color: '#e11d48' },
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white font-sans transition-all duration-500">
        {/* --- ১. টপ বার --- */}
        <div
          className={`hidden md:block bg-[#111] text-white transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-10 opacity-100'}`}
        >
          <div className="container mx-auto px-6 lg:px-10 h-full flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em]">
            <div className="flex items-center space-x-6">
              <span className="flex items-center hover:text-red-500 cursor-pointer transition-colors">
                <Mail size={12} className="mr-2" /> omershop@gmail.com
              </span>
              <div className="h-3 w-[1px] bg-white/20" />
              <span className="flex items-center hover:text-red-500 cursor-pointer transition-colors">
                <Phone size={12} className="mr-2" /> +880 123-456-789
              </span>
            </div>
            <div className="flex-1 text-center italic font-serif lowercase tracking-widest">
              — seasonal sale up to 25% off.
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() =>
                  i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en')
                }
                className="hover:text-red-500 transition-colors uppercase font-black"
              >
                {i18n.language === 'en' ? 'Eng' : 'বাংলা'}
              </button>
              <span>|</span>
              <span className="cursor-pointer hover:text-red-500 transition-colors font-black">
                BD Taka
              </span>
            </div>
          </div>
        </div>

        {/* --- ২. মেইন নেভিগেশন --- */}
        <nav
          className={`border-b border-gray-100 relative bg-white transition-all duration-500 ${isScrolled ? 'h-16' : 'h-24'}`}
        >
          <div className="container mx-auto px-4 lg:px-10 h-full flex justify-between items-center">
            <Link
              to="/"
              className="text-3xl font-black tracking-tighter z-20 uppercase"
            >
              OmerShop<span className="text-red-600">360</span>
            </Link>

            <div
              className={`hidden lg:flex items-center space-x-10 h-full transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <Link
                to="/"
                className={`text-[12px] font-black uppercase tracking-[0.3em] transition-all relative py-2 ${isActive('/') ? 'text-red-600' : 'text-gray-800 hover:text-red-600'}`}
              >
                Home{' '}
                {isActive('/') && (
                  <motion.div
                    layoutId="nav-line"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600"
                  />
                )}
              </Link>

              {/* --- SHOP MENU (Fixed structure with 2 text columns + Dynamic Banners) --- */}
              <div
                className="h-full flex items-center"
                onMouseEnter={() => setActiveMenu('shop')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to="/shop"
                  className={`text-[12px] font-black uppercase tracking-[0.3em] flex items-center transition-all py-2 relative ${location.pathname.startsWith('/shop') ? 'text-red-600' : 'text-gray-800 hover:text-red-600'}`}
                >
                  {labels.shop.text}
                  {labels.shop.badge && (
                    <span
                      className="ml-2 text-[8px] text-white px-1.5 py-0.5 rounded-sm font-black"
                      style={{ backgroundColor: labels.shop.color }}
                    >
                      {labels.shop.badge}
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className={`ml-1 transition-transform ${activeMenu === 'shop' ? 'rotate-180' : ''}`}
                  />
                  {location.pathname.startsWith('/shop') && (
                    <motion.div
                      layoutId="nav-line"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600"
                    />
                  )}
                </Link>
                <AnimatePresence>
                  {activeMenu === 'shop' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 w-full bg-white shadow-2xl border-t p-12 z-50"
                    >
                      <div className="container mx-auto grid grid-cols-5 gap-12">
                        {/* কলাম ১ */}
                        <div>
                          <h4 className="font-black text-gray-900 mb-8 text-[11px] uppercase border-b pb-4 tracking-[0.4em] flex items-center gap-2">
                            <Minus size={14} /> Product Types
                          </h4>
                          <ul className="space-y-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              Simple Design
                            </li>
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              Variable Options
                            </li>
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              Archive Sales
                            </li>
                          </ul>
                        </div>
                        {/* কলাম ২ (ফিরিয়ে আনা হয়েছে) */}
                        <div>
                          <h4 className="font-black text-gray-900 mb-8 text-[11px] uppercase border-b pb-4 tracking-[0.4em] flex items-center gap-2">
                            <Minus size={14} /> Shop Pages
                          </h4>
                          <ul className="space-y-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              Left Sidebar
                            </li>
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              Full Width
                            </li>
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              Atelier View
                            </li>
                          </ul>
                        </div>
                        {/* কলাম ৩ - স্পেসার */}
                        <div></div>
                        {/* কলাম ৪ ও ৫ - ডাইনামিক ব্যানার */}
                        <div className="col-span-2 flex space-x-6">
                          {navConfig?.shopMenu?.banners?.map(b => (
                            <div
                              key={b.id}
                              className="relative w-1/2 h-72 overflow-hidden bg-gray-50 group/img border border-stone-100 shadow-sm"
                            >
                              <img
                                src={b.img}
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000"
                                alt={b.label}
                              />
                              <div className="absolute inset-0 bg-black/10 p-6 flex flex-col justify-end text-white">
                                <p className="font-black uppercase text-[10px] tracking-[0.4em]">
                                  {b.label}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* --- CATEGORIES MENU (Fixed structure with 2 text columns + Dynamic Banners) --- */}
              <div
                className="h-full flex items-center"
                onMouseEnter={() => setActiveMenu('categories')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to="/categories"
                  className={`text-[12px] font-black uppercase tracking-[0.3em] flex items-center transition-all relative py-2 ${location.pathname.startsWith('/categories') ? 'text-red-600' : 'text-gray-800 hover:text-red-600'}`}
                >
                  {labels.categories.text}
                  {labels.categories.badge && (
                    <span
                      className="ml-2 text-[8px] text-white px-1.5 py-0.5 rounded-sm font-black"
                      style={{ backgroundColor: labels.categories.color }}
                    >
                      {labels.categories.badge}
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className={`ml-1 transition-transform ${activeMenu === 'categories' ? 'rotate-180' : ''}`}
                  />
                  {location.pathname.startsWith('/categories') && (
                    <motion.div
                      layoutId="nav-line"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600"
                    />
                  )}
                </Link>
                <AnimatePresence>
                  {activeMenu === 'categories' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 w-full bg-white shadow-2xl border-t p-12 z-50"
                    >
                      <div className="container mx-auto grid grid-cols-5 gap-12">
                        {/* কলাম ১ */}
                        <div className="space-y-8">
                          <h4 className="font-black text-gray-900 text-[11px] uppercase border-b border-stone-100 pb-4 tracking-[0.4em] flex items-center gap-3">
                            <Minus size={14} className="text-red-600" />{' '}
                            Collection
                          </h4>
                          <ul className="space-y-5">
                            <li className="text-[10px] font-bold text-gray-400 hover:text-red-600 cursor-pointer uppercase tracking-[0.2em] transition-all">
                              Mens Fashion
                            </li>
                            <li className="text-[10px] font-bold text-gray-400 hover:text-red-600 cursor-pointer uppercase tracking-[0.2em] transition-all">
                              Womens Gear
                            </li>
                          </ul>
                        </div>
                        {/* কলাম ২ (Trending - ফিরিয়ে আনা হয়েছে) */}
                        <div className="space-y-8">
                          <h4 className="font-black text-gray-900 text-[11px] uppercase border-b border-stone-100 pb-4 tracking-[0.4em] flex items-center gap-3">
                            <Minus size={14} className="text-red-600" />{' '}
                            Trending
                          </h4>
                          <ul className="space-y-5">
                            <li className="text-[10px] font-bold text-gray-400 hover:text-red-600 cursor-pointer uppercase tracking-[0.2em] transition-all">
                              Best Sellers
                            </li>
                            <li className="text-[10px] font-bold text-gray-400 hover:text-red-600 cursor-pointer uppercase tracking-[0.2em] transition-all">
                              Flash Deals
                            </li>
                          </ul>
                        </div>
                        {/* কলাম ৩ - স্পেসার */}
                        <div />
                        {/* কলাম ৪ ও ৫ - ডাইনামিক ব্যানার */}
                        {navConfig?.catMenu?.banners?.map(b => (
                          <div
                            key={b.id}
                            className="relative h-72 overflow-hidden bg-gray-50 group/img border border-stone-100"
                          >
                            <img
                              src={b.img}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110"
                              alt={b.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                              <p className="text-white text-[10px] font-black uppercase tracking-[0.4em] mb-1">
                                Curation
                              </p>
                              <h3 className="text-white text-lg font-light uppercase tracking-tighter leading-tight">
                                {b.title} <br />{' '}
                                <span className="italic font-serif text-red-400 lowercase">
                                  — {b.sub}.
                                </span>
                              </h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* --- FLASH SALE MENU (Dynamic Circle Icons) --- */}
              <div
                className="h-full flex items-center"
                onMouseEnter={() => setActiveMenu('flash')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to="/flash-sale"
                  className={`text-[12px] font-black uppercase tracking-[0.3em] flex items-center transition-all py-2 relative ${isActive('/flash-sale') ? 'text-red-600' : 'text-gray-800 hover:text-red-600'}`}
                >
                  {labels.flash.text}
                  {labels.flash.badge && (
                    <span
                      className="ml-2 text-[8px] text-white px-1.5 py-0.5 rounded-sm font-black"
                      style={{ backgroundColor: labels.flash.color }}
                    >
                      {labels.flash.badge}
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className={`ml-1 transition-transform ${activeMenu === 'flash' ? 'rotate-180' : ''}`}
                  />
                  {isActive('/flash-sale') && (
                    <motion.div
                      layoutId="nav-line"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600"
                    />
                  )}
                </Link>
                <AnimatePresence>
                  {activeMenu === 'flash' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 w-full bg-white shadow-2xl border-t p-12 flex z-50"
                    >
                      <div className="container mx-auto flex gap-12">
                        <div className="w-7/12 grid grid-cols-4 gap-y-10 gap-x-8 pr-12 border-r border-gray-100">
                          {navConfig?.flashMenu?.nodes?.map(node => (
                            <div
                              key={node.id}
                              className="text-center group/cat cursor-pointer"
                            >
                              <div className="w-20 h-20 mx-auto rounded-full bg-gray-50 border group-hover/cat:border-red-600 p-0.5 transition-all duration-500 overflow-hidden shadow-sm">
                                <img
                                  src={node.img}
                                  className="w-full h-full object-cover rounded-full"
                                  alt={node.title}
                                />
                              </div>
                              <span className="text-[10px] font-black text-gray-400 group-hover/cat:text-red-600 uppercase tracking-widest mt-4 block">
                                {node.title}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="w-5/12 pl-12 space-y-6">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-900 border-b pb-4">
                            — Top Rated Collections
                          </h3>
                          {navConfig?.flashMenu?.topRated?.map(item => (
                            <div
                              key={item.id}
                              className="flex items-center gap-6 group/prod cursor-pointer"
                            >
                              <img
                                src={item.img}
                                className="w-16 h-20 object-cover bg-gray-50 border border-stone-100 shadow-sm"
                                alt={item.name}
                              />
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-800 line-clamp-1">
                                  {item.name}
                                </p>
                                <p className="text-red-600 font-black text-xs mt-2">
                                  ${item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* --- ৩. রাইট সেকশন আইকনস (Unchanged Profile logic) --- */}
            <div className="flex items-center space-x-6 z-20">
              {/* Search, Wishlist, Profile & Cart logic (Same as original) */}
              <div className="relative flex items-center justify-end">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 400, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="absolute right-full mr-6 h-12 bg-gray-50 rounded-full flex items-center px-6 border border-gray-100 z-40"
                    >
                      <Search size={16} className="text-gray-400 mr-4" />
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="SEARCH THE ATELIER..."
                        className="bg-transparent border-none focus:ring-0 w-full text-[10px] font-black tracking-[0.3em] uppercase"
                      />
                      <X
                        size={18}
                        className="text-gray-400 cursor-pointer hover:text-red-600"
                        onClick={() => setIsSearchOpen(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="hover:text-red-600 transition-colors"
                >
                  {isSearchOpen ? <X size={22} /> : <Search size={22} />}
                </button>
              </div>

              <Link
                to="/wishlist"
                className={`relative transition-colors ${isActive('/wishlist') ? 'text-red-600' : 'text-gray-800 hover:text-red-600'}`}
              >
                <Heart
                  size={22}
                  fill={isActive('/wishlist') ? 'currentColor' : 'none'}
                />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div
                  className="relative group"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button className="group flex items-center space-x-2">
                    <img
                      src={user?.photoURL}
                      alt=""
                      className="w-8 h-8 rounded-full border border-stone-200"
                    />
                    <ChevronDown
                      size={12}
                      className={`opacity-30 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 w-64 bg-white border border-stone-100 shadow-2xl py-4 mt-2 rounded-sm z-[60]"
                      >
                        <div className="px-6 py-4 bg-stone-50 border-b mb-2">
                          <span className="text-[8px] font-black text-red-600 uppercase tracking-[0.5em]">
                            Account — {user?.role}
                          </span>
                          <p className="text-[13px] font-black text-stone-900 truncate uppercase">
                            {user?.name}
                          </p>
                        </div>
                        <div className="space-y-1 px-2">
                          <DropdownLink
                            to="/profile"
                            icon={<UserCircle size={15} />}
                            label="My Profile"
                          />
                          {user?.role === 'admin' && (
                            <DropdownLink
                              to="/admin"
                              icon={<LayoutDashboard size={15} />}
                              label="Admin Control"
                              color="text-red-600"
                            />
                          )}
                        </div>
                        <div className="px-2 mt-3 pt-3 border-t">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-[10px] text-red-500 hover:bg-red-50 font-black uppercase tracking-[0.4em]"
                          >
                            <LogOut size={15} className="mr-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="group flex items-center space-x-2 text-gray-800 hover:text-red-600"
                >
                  <UserCircle size={22} />
                  <span className="hidden xl:block text-[10px] font-black uppercase tracking-widest">
                    Sign In
                  </span>
                </Link>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center group"
              >
                <ShoppingCart
                  size={22}
                  className="group-hover:text-red-600 transition-colors"
                />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
                <span className="ml-4 text-[13px] font-black hidden lg:block text-gray-900 group-hover:text-red-600 uppercase">
                  ${totalPrice?.toFixed(2) || '0.00'}
                </span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div
        className={`transition-all duration-500 ${isScrolled ? 'h-16' : 'h-32'}`}
      ></div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

const DropdownLink = ({ to, icon, label, color = 'text-stone-600' }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 transition-all ${color}`}
  >
    <span className="mr-4 opacity-50">{icon}</span> {label}
  </Link>
);

export default Navbar;
