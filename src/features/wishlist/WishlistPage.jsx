import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
    toast.success('কার্টে যোগ করা হয়েছে');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-black uppercase tracking-widest mb-6">আপনার উইশলিস্ট খালি</h2>
        <Link to="/shop" className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold uppercase text-sm hover:bg-red-600 transition-all">
          কেনাকাটা চালিয়ে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-black uppercase tracking-widest mb-10 text-center">উইশলিস্ট</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {wishlistItems.map((product) => (
          <div key={product._id} className="border p-4 rounded-2xl flex flex-col">
            <img src={product.images[0]} alt={product.nameEn} className="w-full h-64 object-cover rounded-xl mb-4" />
            <h3 className="font-bold text-lg mb-2">{product.nameEn}</h3>
            <p className="text-red-600 font-black mb-4">৳{product.discountPrice || product.price}</p>
            <div className="mt-auto flex gap-2">
              <button 
                onClick={() => handleAddToCart(product)}
                className="flex-1 bg-gray-900 text-white py-2 rounded-full text-xs font-bold uppercase hover:bg-red-600 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={14} /> কার্টে নিন
              </button>
              <button 
                onClick={() => removeFromWishlist(product._id)}
                className="p-2 border border-gray-200 rounded-full text-gray-400 hover:text-red-600 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
