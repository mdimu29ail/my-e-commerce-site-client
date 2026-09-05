import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Fetch wishlist from server on user change
  useEffect(() => {
    if (user) {
      const fetchWishlist = async () => {
        try {
          const { data } = await API.get('/wishlist');
          setWishlistItems(data);
        } catch (error) {
          console.error('Failed to fetch wishlist', error.response || error);
        }
      };
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const addToWishlist = async (productId) => {
    if (!user) {
      toast.error('দয়া করে লগইন করুন');
      return;
    }
    try {
      const { data } = await API.post('/wishlist', { productId });
      setWishlistItems(data); 
      toast.success('উইশলিস্টে যোগ করা হয়েছে');
    } catch (error) {
      console.error('Failed to add to wishlist', error.response || error);
      toast.error('উইশলিস্টে যোগ করতে সমস্যা হয়েছে');
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      const { data } = await API.delete(`/wishlist/${productId}`);
      setWishlistItems(data);
      toast.success('উইশলিস্ট থেকে সরানো হয়েছে');
    } catch (error) {
      console.error('Failed to remove from wishlist', error.response || error);
      toast.error('উইশলিস্ট থেকে সরাতে সমস্যা হয়েছে');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isWishlisted: (productId) => Array.isArray(wishlistItems) && wishlistItems.some(item => item._id.toString() === productId.toString()),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
