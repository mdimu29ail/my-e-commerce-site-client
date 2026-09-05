import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowUpRight,
  Minus,
  RefreshCw,
  Hash,
  Archive,
  AlertCircle,
  ShoppingBag,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useCart } from '../../../../context/CartContext';
import { useWishlist } from '../../../../context/WishlistContext';
import Loader from '../../../../components/shared/Loader';

const UserWishlistView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchWishlistData();
  }, []);

  const fetchWishlistData = async () => {
    setLoading(true);
    try {
      // আপনার উইশলিস্ট এপিআই রুট অনুযায়ী এটি কাজ করবে
      const { data } = await axios.get(`${API_URL}/wishlist`, {
        withCredentials: true,
      });
      setWishlist(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error('Wishlist sync error');
      // Safety dummy for empty state testing
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async productId => {
    try {
      await axios.delete(`${API_URL}/wishlist/${productId}`, {
        withCredentials: true,
      });
      setWishlist(prev => prev.filter(item => item._id !== productId));
      removeFromWishlist(productId); // কন্টেক্সট আপডেট
      toast.success('PIECE REMOVED FROM ARCHIVE');
    } catch (error) {
      toast.error('PROTOCOL FAILED');
    }
  };

  const handleMoveToCart = product => {
    addToCart(product, 1);
    handleRemove(product._id);
    toast.success('PIECE INGESTED INTO COLLECTION');
  };

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-12 font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* ১. এডিটোরিয়াল হেডার */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12 mt-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Curated Personal Archive
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Curated <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — wishlist.
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">
            Manifest Count
          </p>
          <h3 className="text-xl font-black text-stone-900 tracking-tighter">
            {wishlist.length} Pieces
          </h3>
        </div>
      </div>

      {/* ২. স্ট্যাট কার্ডস (Linear Clostich Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard
          id="01"
          label="Archived Items"
          value={wishlist.length}
          icon={<Heart size={18} />}
        />
        <StatCard
          id="02"
          label="Market Value"
          value={`৳${wishlist.reduce((sum, item) => sum + item.price, 0).toLocaleString()}`}
          icon={<ShoppingBag size={18} />}
        />
        <StatCard
          id="03"
          label="Archive Status"
          value="Operational"
          icon={<ShieldCheck size={18} />}
        />
      </div>

      {/* ৩. উইশলিস্ট ম্যানিফেস্ট গ্রিড */}
      {wishlist.length === 0 ? (
        <div className="py-40 text-center border border-dashed border-stone-100">
          <AlertCircle size={40} className="mx-auto text-stone-100 mb-6" />
          <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
            Your Curation is Empty.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-8 text-[10px] font-black text-red-600 uppercase tracking-widest border-b border-red-100 pb-1 hover:text-stone-900 hover:border-stone-900 transition-all"
          >
            Begin Archiving
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <AnimatePresence>
            {wishlist.map((item, idx) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-white border border-stone-100 flex flex-col md:flex-row overflow-hidden hover:shadow-2xl transition-all duration-700 relative"
              >
                {/* Visual Swatch */}
                <div className="relative w-full md:w-48 h-64 md:h-auto bg-stone-50 overflow-hidden shrink-0">
                  <img
                    src={
                      item.images?.[0] || 'https://via.placeholder.com/400x500'
                    }
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt=""
                  />
                  <div className="absolute top-4 left-4 bg-stone-900 text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest">
                    Ref: {item._id.slice(-6).toUpperCase()}
                  </div>
                </div>

                {/* Technical Details */}
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">
                          {item.category?.nameEn || 'Piece'}
                        </span>
                        <h4 className="text-xl font-black text-stone-900 uppercase tracking-tighter leading-tight group-hover:text-red-600 transition-colors">
                          {item.nameEn}
                        </h4>
                      </div>
                      <p className="text-xl font-black text-stone-900 tracking-tighter">
                        ৳{item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border ${item.stock > 0 ? 'border-emerald-100 text-emerald-600' : 'border-red-100 text-red-600'}`}
                      >
                        {item.stock > 0 ? 'In Archive' : 'Depleted'}
                      </div>
                      <div className="h-[1px] w-8 bg-stone-100" />
                      <span className="text-[9px] font-bold text-stone-300 uppercase italic font-serif">
                        Provenance Verified
                      </span>
                    </div>
                  </div>

                  {/* Protocol Actions */}
                  <div className="flex gap-4 pt-4 border-t border-stone-50">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={item.stock <= 0}
                      className="flex-[2] bg-stone-900 text-white py-4 text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl disabled:opacity-20"
                    >
                      <ShoppingCart size={14} /> Ingest into Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="flex-1 border border-stone-100 text-stone-400 py-4 text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:text-red-600 hover:border-red-600 transition-all"
                    >
                      <Trash2 size={14} /> Erase
                    </button>
                    <Link
                      to={`/product/${item._id}`}
                      className="p-4 border border-stone-100 text-stone-300 hover:text-stone-900 transition-all"
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>

                {/* Bottom Hairline Decor */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-1000 group-hover:w-full" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

// --- Sub-Components ---
const StatCard = ({ label, value, id, icon }) => (
  <div className="bg-white p-10 space-y-4 relative overflow-hidden group">
    <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors">
      — {id}
    </span>
    <div className="mb-8 text-stone-900 group-hover:text-red-600 transition-colors">
      {icon}
    </div>
    <div className="space-y-1 relative z-10">
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]">
        {label}
      </p>
      <h3 className="text-2xl font-black text-stone-900 tracking-tighter uppercase">
        {value}
      </h3>
    </div>
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
  </div>
);

export default UserWishlistView;
