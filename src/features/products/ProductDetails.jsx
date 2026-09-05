import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  MessageCircle,
  ShieldCheck,
  Star,
  Box,
  Minus,
  Heart,
  Ruler,
  Maximize2,
  ArrowUpRight,
  Leaf,
  Zap,
  Globe,
  Cpu,
  HardDrive,
  Smartphone,
  Watch,
  Headphones,
  Refrigerator,
  Calendar,
  Weight,
  Truck,
  RotateCcw,
  Fingerprint,
  Activity,
  Layers,
  Database,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useWishlist } from '../../context/WishlistContext';
import Loader from '../../components/shared/Loader';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { setActiveChat } = useChat();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // --- Dynamic Selections ---
  const [selections, setSelections] = useState({
    size: null,
    color: null,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // --- Category UI Logic Engine (Matches Admin View) ---
  const uiStrategy = useMemo(() => {
    if (!product?.category?.nameEn) return 'GENERAL';
    const name = product.category.nameEn.toLowerCase();
    if (name.includes('fashion')) return 'FASHION';
    if (name.includes('home')) return 'HOME';
    if (name.includes('watch') || name.includes('wearable')) return 'WEARABLES';
    if (name.includes('audio') || name.includes('headphone')) return 'AUDIO';
    if (name.includes('laptop') || name.includes('computer'))
      return 'COMPUTING';
    if (name.includes('phone') || name.includes('mobile')) return 'MOBILE';
    if (name.includes('food')) return 'FOODS';
    return 'GENERAL';
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error('Archive sync failed.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, API_URL]);

  if (loading) return <Loader fullScreen />;
  if (!product)
    return (
      <div className="h-screen flex items-center justify-center font-black text-stone-300 uppercase tracking-widest italic">
        Product Missing.
      </div>
    );

  const isWish = isWishlisted(product._id);
  const name = i18n.language === 'en' ? product.nameEn : product.nameBn;
  const description =
    i18n.language === 'en' ? product.descriptionEn : product.descriptionBn;

  const handleAddToCart = () => {
    if (uiStrategy === 'FASHION') {
      if (product.sizes?.length > 0 && !selections.size)
        return toast.error('Select Size Proportion');
      if (product.colors?.length > 0 && !selections.color)
        return toast.error('Select Finish / Color');
    }
    addToCart({ ...product, selections }, quantity);
    toast.success('Piece added to collection');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white min-h-screen font-sans selection:bg-red-50 selection:text-red-600 pb-32"
    >
      {/* 1. BREADCRUMBS */}
      <nav className="max-w-[1500px] mx-auto px-6 md:px-12 py-10 flex items-center space-x-6 text-[9px] font-black uppercase tracking-[0.5em] text-stone-400 border-b border-stone-50">
        <Link to="/" className="hover:text-red-600 transition-colors">
          Atelier
        </Link>
        <Minus size={10} />
        <Link to="/shop" className="hover:text-red-600 transition-colors">
          Archives
        </Link>
        <Minus size={10} />
        <span className="text-stone-900 truncate">{name}</span>
      </nav>

      <div className="max-w-[1500px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mt-12">
        {/* 2. LEFT: TRIPLE IMAGE MANIFEST */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative aspect-[3/4] bg-[#FBFBFB] border border-stone-100 group overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={product.images[activeImage]}
                alt="Main View"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full object-contain p-12 mix-blend-multiply transition-transform duration-1000 group-hover:scale-110"
              />
            </AnimatePresence>
            <div className="absolute top-6 left-6 px-3 py-1 bg-stone-900 text-white text-[8px] font-black uppercase tracking-widest z-10">
              {activeImage === 0
                ? '01 / Primary'
                : activeImage === 1
                  ? '02 / Detail'
                  : '03 / Perspective'}
            </div>
            <button
              onClick={() =>
                isWish
                  ? removeFromWishlist(product._id)
                  : addToWishlist(product._id)
              }
              className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-full shadow-xl z-10"
            >
              <Heart
                size={18}
                className={
                  isWish ? 'text-red-600 fill-red-600' : 'text-stone-300'
                }
              />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {product.images.slice(0, 3).map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative aspect-square bg-[#FBFBFB] border transition-all ${activeImage === index ? 'border-red-600 p-1' : 'border-stone-100 opacity-60'}`}
              >
                <img
                  src={img}
                  className="w-full h-full object-cover"
                  alt="thumb"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 3. RIGHT: DYNAMIC DATA LEDGER */}
        <div className="lg:col-span-6 space-y-12">
          {/* Header Block */}
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-red-600">
                — {product.category?.nameEn}
              </span>
              <div className="h-[1px] w-16 bg-stone-100" />
              <div className="flex items-center text-amber-500 gap-1.5">
                <Star size={12} fill="currentColor" />
                <span className="text-[10px] font-black text-stone-900 tracking-widest">
                  {product.rating} — Reviews ({product.numReviews})
                </span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-light text-stone-900 tracking-tighter leading-none uppercase">
              {name.split(' ')[0]} <br />
              <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
                — {name.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <div className="flex items-baseline gap-8">
              <span className="text-5xl font-black text-stone-900 tracking-tighter">
                ৳{(product.discountPrice || product.price).toLocaleString()}
              </span>
              {product.discountPrice > 0 && (
                <span className="text-2xl text-stone-300 line-through font-bold">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* DYNAMIC ATTRIBUTE SELECTORS */}
          <div className="space-y-12 py-10 border-y border-stone-100">
            {/* FASHION: HEX COLORS & SIZES */}
            {uiStrategy === 'FASHION' && (
              <div className="space-y-10">
                {product.colors?.length > 0 && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-5 block">
                      Select Finish —
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {product.colors.map(hex => (
                        <button
                          key={hex}
                          onClick={() =>
                            setSelections({ ...selections, color: hex })
                          }
                          className={`w-10 h-10 rounded-full border-2 transition-all ${selections.color === hex ? 'border-red-600 scale-110 shadow-xl' : 'border-stone-100 hover:border-stone-300'}`}
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {product.sizes?.length > 0 && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-5 block">
                      Proportion —
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map(s => (
                        <button
                          key={s}
                          onClick={() =>
                            setSelections({ ...selections, size: s })
                          }
                          className={`px-8 py-3 border text-[11px] font-black uppercase tracking-widest transition-all ${selections.size === s ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-stone-200 text-stone-400 hover:border-stone-900'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TECH & COMPUTING: ICON GRID */}
            {(uiStrategy === 'TECH' ||
              uiStrategy === 'COMPUTING' ||
              uiStrategy === 'MOBILE') && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100">
                <SpecBadge
                  label="Processor"
                  value={product.processor}
                  icon={Cpu}
                />
                <SpecBadge label="Memory" value={product.ram} icon={Zap} />
                <SpecBadge
                  label="Storage"
                  value={product.storage}
                  icon={HardDrive}
                />
                <SpecBadge
                  label="Display"
                  value={product.displayPanel}
                  icon={Smartphone}
                />
                <SpecBadge
                  label="Battery"
                  value={product.batteryLife}
                  icon={Activity}
                />
                <SpecBadge
                  label="Durability"
                  value={product.ipRating}
                  icon={ShieldCheck}
                />
              </div>
            )}

            {/* FOODS: PURITY & QUANTITY */}
            {uiStrategy === 'FOODS' && (
              <div className="bg-stone-50 p-10 border border-stone-100 grid grid-cols-2 gap-10">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                    Integrity Protocol
                  </p>
                  <p className="text-sm font-black text-stone-900 uppercase flex items-center gap-3">
                    <ShieldCheck className="text-red-600" size={16} />{' '}
                    {product.purity || 'Verified Archive'}
                  </p>
                </div>
                <div className="space-y-2 border-l border-stone-200 pl-10">
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                    Net Magnitude
                  </p>
                  <p className="text-sm font-black text-stone-900 uppercase">
                    {product.netQuantity || 'Units Specified'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PRIMARY ACTIONS */}
          <div className="space-y-10">
            <div className="flex items-center space-x-12">
              <div className="flex items-center border border-stone-100">
                <button
                  onClick={() => setQuantity(q => (q > 1 ? q - 1 : 1))}
                  className="w-16 h-16 flex items-center justify-center text-stone-900 hover:bg-stone-50 transition-colors"
                >
                  —
                </button>
                <span className="w-16 text-center font-black text-lg text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-16 h-16 flex items-center justify-center text-stone-900 hover:bg-stone-50 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400">
                  Inventory Registry
                </p>
                <p
                  className={`text-[11px] font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-stone-900' : 'text-red-600'}`}
                >
                  {product.stock > 0
                    ? `${product.stock} pieces verified`
                    : 'Archive Depleted'}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-stone-900 text-white py-8 text-[11px] font-black uppercase tracking-[0.6em] flex items-center justify-center gap-4 hover:bg-red-600 transition-all shadow-2xl disabled:bg-stone-100"
              >
                <ShoppingCart size={18} /> Ingest into Collection
              </button>
              <button
                onClick={() =>
                  isAuthenticated ? navigate('/chat') : navigate('/login')
                }
                className="w-24 bg-stone-50 border border-stone-100 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all shadow-sm"
              >
                <MessageCircle size={22} />
              </button>
            </div>
          </div>

          {/* DYNAMIC SPECS LEDGER (Data from Admin Form) */}
          <div className="pt-10 border-t border-stone-100">
            <SectionLabel label="Technical Manifest —" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-100 border border-stone-100">
              {/* Fashion Specifics */}
              {uiStrategy === 'FASHION' && (
                <>
                  <SpecItem label="Fabric & GSM" value={product.fabricGsm} />
                  <SpecItem label="Pattern Manifest" value={product.pattern} />
                  <SpecItem label="Silhouette / Fit" value={product.fitType} />
                  <SpecItem label="Care Protocol" value={product.careGuide} />
                </>
              )}
              {/* Home Specifics */}
              {uiStrategy === 'HOME' && (
                <>
                  <SpecItem
                    label="Aesthetic Finish"
                    value={product.finishAesthetic}
                  />
                  <SpecItem
                    label="Space Placement"
                    value={product.spacePlacement}
                  />
                  <SpecItem label="Maintenance" value={product.maintenance} />
                </>
              )}
              {/* Common Archival Specs */}
              <SpecItem label="Artisanal Material" value={product.material} />
              <SpecItem label="Global Origin" value={product.origin} />
              <SpecItem label="Warranty Status" value={product.warranty} />
              <SpecItem label="Net Weight" value={product.weight} />
              <SpecItem label="Dimensions" value={product.dimensions} />
              <SpecItem label="Ref ID" value={product.modelNumber} />
            </div>
          </div>

          {/* Atelier Branding */}
          <div
            className="p-10 bg-stone-50 flex items-center justify-between border-l-4 border-red-600 group cursor-pointer"
            onClick={() => navigate(`/shop?seller=${product.seller?._id}`)}
          >
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-stone-900 flex items-center justify-center text-white font-black text-xl shadow-2xl">
                {product.seller?.shopName?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.5em] mb-2">
                  Curated By
                </p>
                <h4 className="text-[14px] font-black uppercase tracking-widest text-stone-900 flex items-center">
                  {product.seller?.shopName || 'Atelier'}{' '}
                  <ShieldCheck size={16} className="ml-3 text-red-600" />
                </h4>
              </div>
            </div>
            <ArrowUpRight
              size={24}
              className="text-stone-300 group-hover:text-red-600 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 4. THE NARRATIVE STORY */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 mt-40 border-t border-stone-100 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-900 sticky top-40">
              — The Narrative.
            </h3>
          </div>
          <div className="lg:col-span-8">
            <p className="text-3xl md:text-5xl font-light text-stone-900 leading-[1.3] uppercase tracking-tighter">
              <span className="font-serif italic text-red-600 lowercase mr-4">
                “
              </span>
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* 5. PROTOCOL CARDS */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 mt-40 grid grid-cols-1 md:grid-cols-4 gap-px bg-stone-100 border border-stone-100 shadow-2xl">
        <ProtocolCard
          icon={ShieldCheck}
          title="Verified Authenticity"
          desc="Archive verification protocol active."
        />
        <ProtocolCard
          icon={Truck}
          title="Logistics Manifest"
          desc="Global express dispatch initiated."
        />
        <ProtocolCard
          icon={RotateCcw}
          title="Return Protocol"
          desc="7-Day archival return cycle."
        />
        <ProtocolCard
          icon={Fingerprint}
          title="Artisanal Signature"
          desc="Unique quality signature verified."
        />
      </div>
    </motion.div>
  );
};

// --- SUB-COMPONENTS (Editorial Ledger Styles) ---

const SpecItem = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="bg-white p-8 group hover:bg-stone-50 transition-colors">
      <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-[11px] font-black text-stone-900 uppercase tracking-tight">
        {value}
      </p>
    </div>
  );
};

const SpecBadge = ({ label, value, icon: Icon }) => {
  if (!value) return null;
  return (
    <div className="bg-white p-6 flex flex-col items-center justify-center text-center gap-3 border border-transparent hover:border-red-100 transition-all">
      <Icon size={16} className="text-red-600" />
      <div className="space-y-1">
        <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-[10px] font-black text-stone-900 uppercase">
          {value}
        </p>
      </div>
    </div>
  );
};

const ProtocolCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white p-12 space-y-6 hover:bg-stone-50 transition-all group">
    <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white group-hover:bg-red-600 transition-colors duration-700">
      <Icon size={18} />
    </div>
    <div className="space-y-3">
      <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-900">
        {title}
      </h4>
      <p className="text-[9px] font-bold text-stone-400 uppercase leading-loose tracking-[0.2em]">
        {desc}
      </p>
    </div>
  </div>
);

const SectionLabel = ({ label }) => (
  <div className="flex items-center gap-3 mb-6">
    <Minus size={14} className="text-red-600" />
    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-900">
      {label}
    </span>
  </div>
);

export default ProductDetails;
