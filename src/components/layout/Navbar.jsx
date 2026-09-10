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
  ChevronDown,
  UserCircle,
  Search,
  Heart,
  Phone,
  Mail,
  LayoutDashboard,
  LogOut,
  Minus,
  ShieldCheck,
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

  // --- ডাইনামিক হেডার ডাটা স্টেট ---
  const [headerData, setHeaderData] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // ১. মঙ্গোডিবি থেকে অ্যাডমিন প্যানেলের সেভ করা ডাটা ফেচ করা
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/settings/header`);
        const fetchedData = Array.isArray(data) ? data[0] : data;
        setHeaderData(fetchedData);
      } catch (err) {
        console.error('Header Manifest Sync Failed');
      }
    };
    fetchHeaderData();
  }, [API_URL]);

  // সার্চ ডামি ডাটা (আপনি চাইলে এটিও এপিআই থেকে আনতে পারেন)
  const products = [
    {
      id: 1,
      name: 'Mens Editorial Shirt',
      price: 43.0,
      img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=100',
    },
    {
      id: 2,
      name: 'Luxury Cotton Crop Top',
      price: 34.0,
      img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=100',
    },
    {
      id: 3,
      name: 'Artisanal Leather Purse',
      price: 89.0,
      img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=100',
    },
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white font-sans transition-all duration-500 selection:bg-red-50 selection:text-red-600">
        {/* --- ১. টপ বার --- */}
        <div
          className={`hidden md:block bg-stone-950 text-white transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-10 opacity-100'}`}
        >
          <div className="container mx-auto px-6 lg:px-10 h-full flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em]">
            <div className="flex items-center space-x-6">
              <span className="flex items-center hover:text-red-500 cursor-pointer transition-colors">
                <Mail size={12} className="mr-2" /> atelier@omershop.com
              </span>
              <div className="h-3 w-[1px] bg-white/20" />
              <span className="flex items-center hover:text-red-500 cursor-pointer transition-colors">
                <Phone size={12} className="mr-2" /> +880 123-456-789
              </span>
            </div>
            <div className="flex-1 text-center italic font-serif lowercase tracking-widest text-stone-300">
              — exclusive curation available now.
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
                USD $
              </span>
            </div>
          </div>
        </div>

        {/* --- ২. মেইন নেভিগেশন --- */}
        <nav
          className={`border-b border-stone-100 relative bg-white transition-all duration-500 ${isScrolled ? 'h-16' : 'h-24'}`}
        >
          <div className="container mx-auto px-4 lg:px-10 h-full flex justify-between items-center">
            {/* লোগো */}
            <Link
              to="/"
              className="text-3xl font-black tracking-tighter z-20 uppercase text-stone-900"
            >
              OmerShop<span className="text-red-600">360</span>
            </Link>

            {/* ডাইনামিক নেভিগেশন লিঙ্কস */}
            <div
              className={`hidden lg:flex items-center space-x-10 h-full transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <Link
                to="/"
                className={`text-[12px] font-black uppercase tracking-[0.3em] transition-all relative py-2 ${isActive('/') ? 'text-red-600' : 'text-stone-800 hover:text-red-600'}`}
              >
                Home
                {isActive('/') && (
                  <motion.div
                    layoutId="nav-line"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600"
                  />
                )}
              </Link>

              {/* 1. SHOP MEGA MENU (Dynamic) */}
              <div
                className="h-full flex items-center group"
                onMouseEnter={() => setActiveMenu('shop')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to="/shop"
                  className={`text-[12px] font-black uppercase tracking-[0.3em] flex items-center transition-all py-2 relative ${location.pathname.startsWith('/shop') ? 'text-red-600' : 'text-stone-800 hover:text-red-600'}`}
                >
                  {headerData?.labels?.shop?.text || 'Shop'}
                  {headerData?.labels?.shop?.badge && (
                    <span
                      className="ml-2 text-[8px] text-white px-1.5 py-0.5 rounded-sm font-black tracking-tighter"
                      style={{ backgroundColor: headerData.labels.shop.color }}
                    >
                      {headerData.labels.shop.badge}
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
                      className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-stone-100 p-12 flex z-50"
                    >
                      <div className="container mx-auto grid grid-cols-5 gap-12">
                        <div>
                          <h4 className="font-black text-stone-900 mb-8 text-[11px] uppercase border-b border-stone-100 pb-4 tracking-[0.4em] flex items-center gap-2">
                            <Minus size={14} className="text-red-600" /> Product
                            Types
                          </h4>
                          <ul className="space-y-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              <Link to="/shop">Simple Design</Link>
                            </li>
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              <Link to="/shop">Variable Options</Link>
                            </li>
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              <Link to="/shop">Archive Sales</Link>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-black text-stone-900 mb-8 text-[11px] uppercase border-b border-stone-100 pb-4 tracking-[0.4em] flex items-center gap-2">
                            <Minus size={14} className="text-red-600" /> Shop
                            Pages
                          </h4>
                          <ul className="space-y-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              <Link to="/shop">Left Sidebar</Link>
                            </li>
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              <Link to="/shop">Full Width</Link>
                            </li>
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              <Link to="/shop">Atelier View</Link>
                            </li>
                          </ul>
                        </div>
                        <div></div>
                        <div className="col-span-2 flex space-x-6">
                          {headerData?.shopMenu?.banners?.map(b => (
                            <Link
                              to="/shop"
                              key={b.id}
                              className="relative w-1/2 h-72 overflow-hidden bg-stone-50 group/img block border border-stone-100"
                            >
                              <img
                                src={b.img}
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000 grayscale group-hover/img:grayscale-0"
                                alt={b.label}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end text-white">
                                <p className="font-black uppercase text-[10px] tracking-[0.4em]">
                                  {b.label}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. CATEGORIES MEGA MENU (Dynamic) */}
              <div
                className="h-full flex items-center group"
                onMouseEnter={() => setActiveMenu('categories')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to="/categories"
                  className={`text-[12px] font-black uppercase tracking-[0.3em] flex items-center transition-all py-2 relative ${location.pathname.startsWith('/categories') ? 'text-red-600' : 'text-stone-800 hover:text-red-600'}`}
                >
                  {headerData?.labels?.categories?.text || 'Categories'}
                  {headerData?.labels?.categories?.badge && (
                    <span
                      className="ml-2 text-[8px] text-white px-1.5 py-0.5 rounded-sm font-black tracking-tighter"
                      style={{
                        backgroundColor: headerData.labels.categories.color,
                      }}
                    >
                      {headerData.labels.categories.badge}
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
                      className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-stone-100 p-12 z-50"
                    >
                      <div className="container mx-auto grid grid-cols-5 gap-12">
                        <div>
                          <h4 className="font-black text-stone-900 mb-8 text-[11px] uppercase border-b border-stone-100 pb-4 tracking-[0.4em] flex items-center gap-2">
                            <Minus size={14} className="text-red-600" />{' '}
                            Collection
                          </h4>
                          <ul className="space-y-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              <Link to="/categories">Mens Fashion</Link>
                            </li>
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              <Link to="/categories">Womens Gear</Link>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-black text-stone-900 mb-8 text-[11px] uppercase border-b border-stone-100 pb-4 tracking-[0.4em] flex items-center gap-2">
                            <Minus size={14} className="text-red-600" />{' '}
                            Trending
                          </h4>
                          <ul className="space-y-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              <Link to="/categories">Best Sellers</Link>
                            </li>
                            <li className="hover:text-red-600 cursor-pointer transition-colors">
                              <Link to="/flash-sale">Flash Deals</Link>
                            </li>
                          </ul>
                        </div>
                        <div></div>
                        <div className="col-span-2 flex space-x-6">
                          {headerData?.catMenu?.banners?.map(b => (
                            <Link
                              to="/categories"
                              key={b.id}
                              className="relative w-1/2 h-72 overflow-hidden bg-stone-50 group/img block border border-stone-100"
                            >
                              <img
                                src={b.img}
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000 grayscale group-hover/img:grayscale-0"
                                alt={b.title}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                                <h3 className="text-lg font-light uppercase tracking-tighter leading-tight">
                                  {b.title} <br />{' '}
                                  <span className="italic font-serif text-red-400 lowercase">
                                    — {b.sub}.
                                  </span>
                                </h3>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. FLASH SALE MEGA MENU (Dynamic Circular Nodes + Top Rated) */}
              <div
                className="h-full flex items-center group"
                onMouseEnter={() => setActiveMenu('flash')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to="/flash-sale"
                  className={`text-[12px] font-black uppercase tracking-[0.3em] flex items-center transition-all py-2 relative ${isActive('/flash-sale') ? 'text-red-600' : 'text-stone-800 hover:text-red-600'}`}
                >
                  {headerData?.labels?.flash?.text || 'Flash Sale'}
                  {headerData?.labels?.flash?.badge && (
                    <span
                      className="ml-2 text-[8px] text-white px-1.5 py-0.5 rounded-sm font-black tracking-tighter"
                      style={{ backgroundColor: headerData.labels.flash.color }}
                    >
                      {headerData.labels.flash.badge}
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
                      className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-stone-100 p-12 flex z-50 overflow-hidden"
                    >
                      <div className="container mx-auto flex gap-16">
                        {/* বাম পাশ: Circular Nodes */}
                        <div className="w-7/12 grid grid-cols-4 gap-y-12 gap-x-8 pr-16 border-r border-stone-100">
                          {headerData?.flashMenu?.nodes?.map(node => (
                            <Link
                              to="/flash-sale"
                              key={node.id}
                              className="text-center group/cat block"
                            >
                              <div className="w-20 h-20 mx-auto rounded-full bg-stone-50 border border-stone-100  group-hover/cat:border-red-600  transition-all duration-700 overflow-hidden shadow-sm">
                                <img
                                  src={node.img}
                                  className="w-full h-full rounded-full object-contain"
                                  alt=""
                                />
                              </div>
                              <span className="text-[10px] font-black text-stone-400 group-hover/cat:text-red-600 uppercase tracking-widest mt-6 block transition-colors">
                                {node.title}
                              </span>
                            </Link>
                          ))}
                        </div>

                        {/* ডান পাশ: Top Rated Editorials */}
                        <div className="w-5/12 pl-12 space-y-6">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-900 border-b border-stone-100 pb-4 flex items-center gap-2">
                            <Minus size={14} className="text-red-600" /> Top
                            Rated Archives
                          </h3>
                          {headerData?.flashMenu?.topRated?.map(prod => (
                            <Link
                              to="/shop"
                              key={prod.id}
                              className="flex items-center gap-6 group/prod block bg-stone-50 hover:bg-white border border-transparent hover:border-stone-100 transition-all p-3"
                            >
                              <div className="w-16 h-20 bg-white overflow-hidden border border-stone-100">
                                <img
                                  src={prod.img}
                                  className="w-full h-full object-cover group-hover/prod:scale-110 grayscale group-hover/prod:grayscale-0 transition-all duration-700"
                                  alt=""
                                />
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-800 line-clamp-1 group-hover/prod:text-red-600 transition-colors">
                                  {prod.name}
                                </p>
                                <p className="text-red-600 font-black text-xs mt-2 tracking-tighter">
                                  ৳{Number(prod.price).toLocaleString()}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* --- ৪. রাইট সাইড আইকনস --- */}
            <div className="flex items-center space-x-6 z-20">
              {/* সার্চ (Inline Overlay) */}
              <div className="relative flex items-center justify-end">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 400, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="absolute right-full mr-6 h-12 bg-stone-50 rounded-full flex items-center px-6 border border-stone-100 z-40"
                    >
                      <Search size={16} className="text-stone-400 mr-4" />
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="SEARCH THE ARCHIVE..."
                        className="bg-transparent border-none focus:ring-0 w-full text-[10px] font-black tracking-[0.3em] uppercase placeholder:text-stone-300 outline-none text-stone-900"
                      />
                      <X
                        size={18}
                        className="text-stone-400 cursor-pointer hover:text-red-600 transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      />

                      {/* Search Results */}
                      {searchQuery.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white shadow-2xl mt-4 rounded-xl border border-stone-100 py-4 z-50 overflow-hidden">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map(prod => (
                              <div
                                key={prod.id}
                                className="flex items-center px-6 py-4 hover:bg-stone-50 cursor-pointer transition-colors border-b last:border-0 border-stone-50"
                              >
                                <img
                                  src={prod.img}
                                  className="w-10 h-10 object-cover mr-4 border border-stone-100 grayscale"
                                  alt=""
                                />
                                <div>
                                  <p className="text-[10px] font-black text-stone-800 uppercase tracking-tighter leading-none">
                                    {prod.name}
                                  </p>
                                  <p className="text-red-600 font-black text-[9px] mt-1">
                                    ৳{prod.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="px-6 py-4 text-[9px] font-black uppercase text-stone-300 tracking-widest text-center">
                              Archive Empty
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-stone-600 hover:text-red-600 transition-colors"
                >
                  {isSearchOpen ? (
                    <X size={22} strokeWidth={1.5} />
                  ) : (
                    <Search size={22} strokeWidth={1.5} />
                  )}
                </button>
              </div>

              {/* উইশলিস্ট */}
              <Link
                to="/wishlist"
                className={`relative transition-colors ${isActive('/wishlist') ? 'text-red-600' : 'text-stone-600 hover:text-red-600'}`}
              >
                <Heart
                  size={22}
                  strokeWidth={1.5}
                  fill={isActive('/wishlist') ? 'currentColor' : 'none'}
                />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* প্রোফাইল ড্রপডাউন */}
              {isAuthenticated ? (
                <div
                  className="relative group"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="group flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="relative">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-stone-100 grayscale transition-transform group-hover:scale-105 group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-white font-serif italic text-sm rounded-full transition-transform group-hover:scale-105">
                          {user?.name?.charAt(0)}
                        </div>
                      )}
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <ChevronDown
                      size={12}
                      className={`opacity-30 transition-transform duration-500 text-stone-600 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute right-0 w-64 bg-white border border-stone-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] py-4 mt-4 rounded-sm z-[60]"
                      >
                        <div className="px-6 py-4 bg-stone-50/50 border-b border-stone-100 mb-2">
                          <span className="text-[8px] font-black text-red-600 uppercase tracking-[0.5em] block mb-1">
                            Authenticated Curator
                          </span>
                          <p className="text-[12px] font-black text-stone-900 uppercase tracking-tighter truncate">
                            {user?.name}
                          </p>
                        </div>
                        <div className="space-y-1 px-2">
                          <DropdownLink
                            to="/profile"
                            icon={<UserCircle size={15} />}
                            label="My Profile"
                          />

                          {/* রোল অনুযায়ী প্যানেল লিঙ্ক (Moderator Fix) */}
                          {user?.role === 'admin' && (
                            <DropdownLink
                              to="/admin"
                              icon={<LayoutDashboard size={15} />}
                              label="Admin Control"
                              color="text-red-600"
                            />
                          )}
                          {user?.role === 'moderator' && (
                            <DropdownLink
                              to="/moderator"
                              icon={<ShieldCheck size={15} />}
                              label="Moderator Space"
                              color="text-blue-600"
                            />
                          )}
                          {user?.role === 'seller' && (
                            <DropdownLink
                              to="/seller"
                              icon={<LayoutDashboard size={15} />}
                              label="Seller Atelier"
                              color="text-amber-600"
                            />
                          )}
                          {user?.role === 'user' && (
                            <DropdownLink
                              to="/user"
                              icon={<LayoutDashboard size={15} />}
                              label="User Dashboard"
                              color="text-stone-900"
                            />
                          )}
                        </div>
                        <div className="h-[1px] bg-stone-100 my-4 mx-6" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-6 py-4 text-[10px] text-red-500 hover:bg-red-50 font-black uppercase tracking-[0.4em] transition-all"
                        >
                          <LogOut size={16} className="mr-4" /> Archive Exit
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="group relative flex items-center space-x-2 text-stone-600 hover:text-red-600 transition-all uppercase"
                >
                  <UserCircle
                    size={22}
                    strokeWidth={1.5}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="hidden xl:block text-[10px] font-black tracking-widest">
                    Sign In
                  </span>
                </Link>
              )}

              {/* কার্ট আইকন */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center group"
              >
                <ShoppingCart
                  size={22}
                  strokeWidth={1.5}
                  className="text-stone-600 group-hover:text-red-600 transition-colors"
                />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-white shadow-sm">
                  {totalItems}
                </span>
                <span className="ml-4 text-[13px] font-black hidden lg:block tracking-tighter text-stone-900 group-hover:text-red-600 transition-colors uppercase">
                  ৳{totalPrice?.toLocaleString() || '0'}
                </span>
              </button>

              <button
                onClick={() => navigate('/')}
                className="lg:hidden text-stone-800"
              >
                <Menu size={24} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div
        className={`transition-all duration-500 ${isScrolled ? 'h-16' : 'h-32'}`}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

// --- Helper Component ---
const DropdownLink = ({ to, icon, label, color = 'text-stone-600' }) => (
  <Link
    to={to}
    className={`flex items-center px-6 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-stone-50 transition-all group ${color}`}
  >
    <span className="mr-4 opacity-40 group-hover:opacity-100 group-hover:text-red-600 transition-all">
      {icon}
    </span>{' '}
    {label}
  </Link>
);

export default Navbar;
