import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Star, Heart, Eye, ArrowUpRight } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { i18n, t } = useTranslation();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  if (!product) return null;
  const isInWishlist = isWishlisted(product._id);
  const sellerId = product?.seller?._id || product?.seller;

  const isOwner =
    user?._id && sellerId && sellerId?.toString() === user?._id?.toString();

  const productName =
    i18n.language === 'en' ? product?.nameEn : product?.nameBn;

  const hasDiscount =
    product?.discountPrice > 0 && product?.discountPrice < product?.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  const handleAddToCart = e => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${productName} added to cart`, {
      position: 'bottom-right',
      autoClose: 1500,
    });
  };

  const handleToggleWishlist = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.info('Login to save items');

    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
      toast.success('Saved to Wishlist');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white flex flex-col h-full overflow-hidden"
    >
      {/* ১. ইমেজ সেকশন - Ultra Minimalist Overlay */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[#F9F9F9]">
        {/* মেইন প্রোডাক্ট ইমেজ */}
        <Link to={`/product/${product._id}`} className="block h-full w-full">
          <img
            src={product.images[0]}
            alt={productName}
            className="w-full h-full object-cover rounded-tl-[2.5rem] rounded-tr-[2.5rem]  transition-transform duration-1000 hover:scale-110"
          />
        </Link>

        {/* ডিসকাউন্ট ব্যাজ - স্লিম এবং আধুনিক */}
        {hasDiscount && (
          <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10">
            {discountPercentage}% Off
          </div>
        )}

        {/* উইশলিস্ট - টপ রাইট (গ্লাস-মর্ফিজম ইফেক্ট) */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md border border-white/20 transition-all duration-300 hover:bg-white"
        >
          <Heart
            size={18}
            className={
              isInWishlist ? 'text-red-600 fill-red-600' : 'text-gray-900'
            }
            strokeWidth={1.5}
          />
        </button>

        {/* কুইক অ্যাকশন বার - নিচ থেকে স্লাইড হবে */}
        {!isOwner && (
          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10 flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gray-900 text-white py-3 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={14} /> {t('Quick Add')}
            </button>
            <Link
              to={`/product/${product._id}`}
              className="w-12 bg-white text-gray-900 flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <Eye size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* ২. প্রোডাক্ট ইনফো - ক্লিয়ার টাইপোগ্রাফি */}
      <div className="p-5 flex flex-col flex-grow ">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em]">
            {product.category?.nameEn || 'Essentials'}
          </span>
          <div className="flex items-center gap-1">
            <Star size={10} className="text-amber-400 fill-amber-400" />
            <span className="text-[10px] font-bold text-gray-400">
              {product.rating || '4.9'}
            </span>
          </div>
        </div>

        <Link to={`/product/${product._id}`} className="block group/title">
          <h3 className="text-gray-900 font-bold text-sm leading-snug uppercase tracking-tight line-clamp-1 mb-3 transition-colors group-hover/title:text-red-600">
            {productName}
          </h3>
        </Link>

        {/* প্রাইস - বোল্ড এবং শার্প */}
        <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-4">
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-red-600 font-black text-lg tracking-tighter">
                  ৳{product.discountPrice}
                </span>
                <span className="text-gray-300 line-through text-[11px] font-medium">
                  ৳{product.price}
                </span>
              </div>
            ) : (
              <span className="text-gray-900 font-black text-lg tracking-tighter">
                ৳{product.price}
              </span>
            )}
          </div>

          <Link
            to={`/product/${product._id}`}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-all"
          >
            Details <ArrowUpRight size={14} />
          </Link>
        </div>

        {isOwner && (
          <div className="mt-3 bg-gray-50 py-1 px-3 w-max">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">
              Inventory Managed
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
