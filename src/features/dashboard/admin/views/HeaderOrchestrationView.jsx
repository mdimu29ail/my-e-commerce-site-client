'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  RefreshCw,
  Minus,
  Camera,
  ChevronLeft,
  ChevronRight,
  Zap,
  Activity,
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../../../../components/shared/Loader';

// --- ডিফল্ট কনফিগারেশন ---
const initialFallbackConfig = {
  key: 'header_manifest', // এটি ডাটাবেসে ইউনিক আইডি হিসেবে কাজ করবে
  labels: {
    shop: { text: 'Shop', badge: '', color: '#e11d48' },
    categories: { text: 'Categories', badge: 'SALE', color: '#14b8a6' },
    flash: { text: 'Flash Sale', badge: 'HOT', color: '#e11d48' },
  },
  shopMenu: {
    banners: [
      {
        id: 1,
        label: 'New Season',
        img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
      },
      {
        id: 2,
        label: 'Limited Edition',
        img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
      },
    ],
  },
  catMenu: {
    banners: [
      {
        id: 1,
        title: 'Trending',
        sub: 'items',
        img: 'https://images.unsplash.com/photo-1445205170230-053b83e26371?w=400',
      },
      {
        id: 2,
        title: 'Flash',
        sub: 'archive',
        img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400',
      },
    ],
  },
  flashMenu: {
    nodes: [
      {
        id: 1,
        title: 'T-shirts',
        img: 'https://api.dicebear.com/7.x/initials/svg?seed=TS',
      },
      {
        id: 2,
        title: 'Shoes',
        img: 'https://api.dicebear.com/7.x/initials/svg?seed=SH',
      },
      {
        id: 3,
        title: 'Goggles',
        img: 'https://api.dicebear.com/7.x/initials/svg?seed=GO',
      },
      {
        id: 4,
        title: 'Bags',
        img: 'https://api.dicebear.com/7.x/initials/svg?seed=BA',
      },
      {
        id: 5,
        title: 'Watch',
        img: 'https://api.dicebear.com/7.x/initials/svg?seed=WA',
      },
      {
        id: 6,
        title: 'Shorts',
        img: 'https://api.dicebear.com/7.x/initials/svg?seed=ST',
      },
      {
        id: 7,
        title: 'Jackets',
        img: 'https://api.dicebear.com/7.x/initials/svg?seed=JA',
      },
      {
        id: 8,
        title: 'Purse',
        img: 'https://api.dicebear.com/7.x/initials/svg?seed=PU',
      },
    ],
    topRated: [
      {
        id: 101,
        name: 'Editorial Shirt',
        price: '43.00',
        img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150',
      },
      {
        id: 102,
        name: 'Luxury Cotton Top',
        price: '34.00',
        img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150',
      },
      {
        id: 103,
        name: 'Archive Denim',
        price: '55.00',
        img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=150',
      },
    ],
  },
};

const HeaderOrchestrationView = () => {
  const [activeTab, setActiveTab] = useState('labels');
  const [config, setConfig] = useState(initialFallbackConfig);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(null);
  const scrollRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  // --- ডাটাবেস থেকে ডাটা ফেচ করার লজিক (রিলোড দিলে এটি কাজ করবে) ---
  useEffect(() => {
    const fetchHeaderConfig = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/settings/header`);

        // MongoDB অনেক সময় অ্যারে রিটার্ন করে, সেটি চেক করা হচ্ছে
        const fetchedData = Array.isArray(data) ? data[0] : data;

        if (fetchedData && fetchedData.labels) {
          setConfig(prev => ({
            ...prev,
            ...fetchedData,
            labels: { ...prev.labels, ...fetchedData.labels },
            shopMenu: { ...prev.shopMenu, ...fetchedData.shopMenu },
            catMenu: { ...prev.catMenu, ...fetchedData.catMenu },
            flashMenu: { ...prev.flashMenu, ...fetchedData.flashMenu },
          }));
        }
      } catch (err) {
        console.error('Fetch failed, using defaults');
      } finally {
        setLoading(false);
      }
    };
    fetchHeaderConfig();
  }, [API_URL]);

  // --- ডাটাবেসে ডাটা সেভ করার লজিক ---
  const handleCommit = async () => {
    setIsSaving(true);
    try {
      // অপ্রয়োজনীয় মেটাডাটা বাদ দিয়ে সেভ করা
      const { _id, __v, createdAt, updatedAt, ...cleanData } = config;

      await axios.put(`${API_URL}/settings/header`, cleanData, {
        withCredentials: true,
      });
      toast.success('DATABASE SYNCHRONIZED');
    } catch (err) {
      console.error('Save Error:', err);
      toast.error('SYNC FAILED');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (e, path, id) => {
    const file = e.target.files[0];
    if (!file || !IMGBB_KEY) return toast.error('API Key Missing');
    setIsUploading(id);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        formData
      );
      const url = res.data.data.url;
      const newConfig = { ...config };
      if (path === 'shop')
        newConfig.shopMenu.banners = newConfig.shopMenu.banners.map(b =>
          b.id === id ? { ...b, img: url } : b
        );
      if (path === 'cat')
        newConfig.catMenu.banners = newConfig.catMenu.banners.map(b =>
          b.id === id ? { ...b, img: url } : b
        );
      if (path === 'node')
        newConfig.flashMenu.nodes = newConfig.flashMenu.nodes.map(n =>
          n.id === id ? { ...n, img: url } : n
        );
      if (path === 'top')
        newConfig.flashMenu.topRated = newConfig.flashMenu.topRated.map(t =>
          t.id === id ? { ...t, img: url } : t
        );
      setConfig(newConfig);
      toast.success('ASSET UPDATED');
    } catch (err) {
      toast.error('UPLOAD FAILED');
    } finally {
      setIsUploading(null);
    }
  };

  const scroll = dir => {
    if (scrollRef.current) {
      const amt = dir === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amt, behavior: 'smooth' });
    }
  };

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto p-6 md:p-12 space-y-16 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              System Orchestration
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter uppercase">
            Header <br />{' '}
            <span className="italic font-serif text-red-600 lowercase font-normal">
              — orchestration.
            </span>
          </h2>
        </div>
        <button
          onClick={handleCommit}
          disabled={isSaving}
          className="bg-stone-900 text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-600 transition-all flex items-center gap-4"
        >
          {isSaving ? (
            <RefreshCw className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}{' '}
          Commit Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* LEFT MANAGEMENT */}
        <div className="lg:col-span-7 space-y-10">
          <div className="flex bg-stone-50 p-1 border border-stone-100">
            {['labels', 'shop', 'categories', 'flash'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-red-600 shadow-sm' : 'text-stone-400 hover:text-stone-900'}`}
              >
                {tab} protocol
              </button>
            ))}
          </div>

          <div className="bg-white border border-stone-100 p-10 shadow-sm min-h-[600px]">
            <AnimatePresence mode="wait">
              {activeTab === 'labels' && (
                <motion.div
                  key="labels"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <SectionTitle label="Global Nomenclature" />
                  {Object.entries(config?.labels || {}).map(([key, val]) => (
                    <div
                      key={key}
                      className="grid grid-cols-3 gap-8 pb-8 border-b border-stone-50 last:border-0"
                    >
                      <InputGroup
                        label={`${key} Label`}
                        value={val.text}
                        onChange={v =>
                          setConfig({
                            ...config,
                            labels: {
                              ...config.labels,
                              [key]: { ...val, text: v },
                            },
                          })
                        }
                      />
                      <InputGroup
                        label="Badge"
                        value={val.badge}
                        onChange={v =>
                          setConfig({
                            ...config,
                            labels: {
                              ...config.labels,
                              [key]: { ...val, badge: v },
                            },
                          })
                        }
                      />
                      <div className="space-y-3">
                        <label className="text-[8px] font-black uppercase text-stone-400">
                          Color
                        </label>
                        <input
                          type="color"
                          className="w-full h-10 bg-transparent cursor-pointer"
                          value={val.color}
                          onChange={e =>
                            setConfig({
                              ...config,
                              labels: {
                                ...config.labels,
                                [key]: { ...val, color: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'shop' && (
                <motion.div
                  key="shop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <SectionTitle label="Shop Visual Manifest" />
                  {config?.shopMenu?.banners?.map((b, i) => (
                    <div
                      key={b.id}
                      className="p-6 bg-stone-50 border border-stone-100 space-y-6"
                    >
                      <span className="text-[10px] font-black text-red-600 uppercase">
                        Banner Slot 0{i + 1}
                      </span>
                      <InputGroup
                        label="Overlay Label"
                        value={b.label}
                        onChange={v => {
                          const newB = config.shopMenu.banners.map(item =>
                            item.id === b.id ? { ...item, label: v } : item
                          );
                          setConfig({ ...config, shopMenu: { banners: newB } });
                        }}
                      />
                      <ImageUploader
                        img={b.img}
                        loading={isUploading === b.id}
                        onUpload={e => handleUpload(e, 'shop', b.id)}
                      />
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'categories' && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <SectionTitle label="Category Curation Matrix" />
                  {config?.catMenu?.banners?.map(b => (
                    <div
                      key={b.id}
                      className="p-8 bg-stone-50 border border-stone-100 space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        <InputGroup
                          label="Headline"
                          value={b.title}
                          onChange={v => {
                            const newB = config.catMenu.banners.map(item =>
                              item.id === b.id ? { ...item, title: v } : item
                            );
                            setConfig({
                              ...config,
                              catMenu: { banners: newB },
                            });
                          }}
                        />
                        <InputGroup
                          label="Subtitle"
                          value={b.sub}
                          onChange={v => {
                            const newB = config.catMenu.banners.map(item =>
                              item.id === b.id ? { ...item, sub: v } : item
                            );
                            setConfig({
                              ...config,
                              catMenu: { banners: newB },
                            });
                          }}
                        />
                      </div>
                      <ImageUploader
                        img={b.img}
                        loading={isUploading === b.id}
                        onUpload={e => handleUpload(e, 'cat', b.id)}
                      />
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'flash' && (
                <motion.div
                  key="flash"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-16"
                >
                  <div>
                    <SectionTitle label="Circular Identity Nodes" />
                    <div className="relative group/scroll mt-8">
                      <button
                        onClick={() => scroll('left')}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border p-2 shadow-md opacity-0 group-hover/scroll:opacity-100 transition-opacity"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <div
                        ref={scrollRef}
                        className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-4"
                      >
                        {config?.flashMenu?.nodes?.map(node => (
                          <div
                            key={node.id}
                            className="flex flex-col items-center gap-4 shrink-0"
                          >
                            <ImageUploader
                              img={node.img}
                              aspect="w-20 h-20 rounded-full"
                              loading={isUploading === node.id}
                              onUpload={e => handleUpload(e, 'node', node.id)}
                            />
                            <input
                              value={node.title}
                              onChange={e => {
                                const newN = config.flashMenu.nodes.map(n =>
                                  n.id === node.id
                                    ? { ...n, title: e.target.value }
                                    : n
                                );
                                setConfig({
                                  ...config,
                                  flashMenu: {
                                    ...config.flashMenu,
                                    nodes: newN,
                                  },
                                });
                              }}
                              className="text-center text-[10px] font-black uppercase bg-transparent border-none outline-none focus:text-red-600 w-20"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => scroll('right')}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border p-2 shadow-md opacity-0 group-hover/scroll:opacity-100 transition-opacity"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-stone-100">
                    <SectionTitle label="Top Rated Collections" />
                    <div className="grid grid-cols-1 gap-6 mt-8">
                      {config?.flashMenu?.topRated?.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center gap-8 bg-stone-50 p-6 border group"
                        >
                          <ImageUploader
                            img={item.img}
                            aspect="w-16 h-20 shrink-0"
                            loading={isUploading === item.id}
                            onUpload={e => handleUpload(e, 'top', item.id)}
                          />
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <InputGroup
                              label="Product Name"
                              value={item.name}
                              onChange={v => {
                                const newT = config.flashMenu.topRated.map(t =>
                                  t.id === item.id ? { ...t, name: v } : t
                                );
                                setConfig({
                                  ...config,
                                  flashMenu: {
                                    ...config.flashMenu,
                                    topRated: newT,
                                  },
                                });
                              }}
                            />
                            <InputGroup
                              label="Price"
                              value={item.price}
                              onChange={v => {
                                const newT = config.flashMenu.topRated.map(t =>
                                  t.id === item.id ? { ...t, price: v } : t
                                );
                                setConfig({
                                  ...config,
                                  flashMenu: {
                                    ...config.flashMenu,
                                    topRated: newT,
                                  },
                                });
                              }}
                            />
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

        {/* RIGHT PREVIEW */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-8">
            <SectionTitle label="Real-time Archival Preview" />
            <div className="bg-white border border-stone-100 shadow-2xl p-0 overflow-hidden flex flex-col h-[650px]">
              {/* Nav */}
              <div className="flex justify-center items-center gap-8 border-b py-6 bg-white z-10">
                {Object.entries(config?.labels || {}).map(([key, val]) => (
                  <div key={key} className="flex flex-col items-center">
                    <span
                      className={`text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ${activeTab === key ? 'text-red-600' : 'text-stone-900'}`}
                    >
                      {val.text}
                      {val.badge && (
                        <span
                          className="text-[6px] text-white px-1.5 py-0.5 rounded-sm font-black"
                          style={{ backgroundColor: val.color }}
                        >
                          {val.badge}
                        </span>
                      )}
                    </span>
                    {activeTab === key && (
                      <div className="w-full h-[1px] bg-red-600 mt-2" />
                    )}
                  </div>
                ))}
              </div>

              {/* Dynamic Body */}
              <div className="flex-1 overflow-y-auto p-8 bg-stone-50 space-y-12">
                {activeTab === 'shop' && (
                  <div className="grid grid-cols-2 gap-4">
                    {config?.shopMenu?.banners?.map(b => (
                      <div
                        key={b.id}
                        className="relative h-60 overflow-hidden border"
                      >
                        <img
                          src={b.img}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                        <div className="absolute inset-0 bg-black/20 p-4 flex flex-col justify-end">
                          <p className="text-white text-[9px] font-black uppercase tracking-[0.3em]">
                            {b.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'categories' && (
                  <div className="grid grid-cols-2 gap-4">
                    {config?.catMenu?.banners?.map(b => (
                      <div
                        key={b.id}
                        className="relative h-60 overflow-hidden border"
                      >
                        <img
                          src={b.img}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                          <p className="text-white text-[12px] font-light uppercase tracking-tighter leading-tight">
                            {b.title} <br />{' '}
                            <span className="italic font-serif text-red-400 lowercase">
                              — {b.sub}.
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'flash' && (
                  <div className="space-y-10">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar">
                      {config?.flashMenu?.nodes?.map(n => (
                        <div
                          key={n.id}
                          className="flex flex-col items-center gap-2 shrink-0"
                        >
                          <img
                            src={n.img}
                            className="w-14 h-14 rounded-full border-2 border-red-600 p-0.5 object-cover bg-white"
                            alt=""
                          />
                          <span className="text-[7px] font-black uppercase tracking-widest">
                            {n.title}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {config?.flashMenu?.topRated?.map(t => (
                        <div
                          key={t.id}
                          className="flex gap-4 items-center bg-white p-3 border"
                        >
                          <img
                            src={t.img}
                            className="w-10 h-12 object-cover"
                            alt=""
                          />
                          <div>
                            <p className="text-[8px] font-bold uppercase">
                              {t.name}
                            </p>
                            <p className="text-red-600 text-[10px] font-black">
                              ${t.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'labels' && (
                  <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <Activity
                      size={40}
                      className="text-red-600 animate-pulse"
                    />
                    <p className="text-[9px] font-black uppercase tracking-[0.5em]">
                      System Live
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helpers ---
const SectionTitle = ({ label }) => (
  <div className="flex items-center gap-3">
    <Minus size={18} className="text-red-600" />
    <span className="text-[13px] font-black uppercase tracking-[0.4em] text-stone-900">
      {label}
    </span>
  </div>
);

const InputGroup = ({ label, value, onChange }) => (
  <div className="space-y-3">
    <label className="text-[8px] font-black uppercase text-stone-400 tracking-widest">
      {label} —
    </label>
    <input
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-transparent border-b border-stone-100 py-2 text-[12px] font-bold uppercase focus:outline-none focus:border-stone-900 transition-all"
    />
  </div>
);

const ImageUploader = ({ img, aspect = 'aspect-video', onUpload, loading }) => (
  <label
    className={`relative ${aspect} bg-white border border-stone-200 overflow-hidden cursor-pointer group block`}
  >
    <input
      type="file"
      className="hidden"
      onChange={onUpload}
      accept="image/*"
    />
    <img
      src={img || ''}
      className={`w-full h-full object-cover transition-all duration-700 ${loading ? 'opacity-20 blur-sm' : 'group-hover:scale-105'}`}
      alt="asset"
    />
    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 text-center p-2">
      <Camera size={20} />
      <span className="text-[7px] font-black uppercase tracking-widest">
        Update Visual
      </span>
    </div>
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-white/50">
        <RefreshCw className="animate-spin text-stone-900" size={24} />
      </div>
    )}
  </label>
);

export default HeaderOrchestrationView;
