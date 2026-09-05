import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  
  // ইউজার অনুযায়ী লোকাল স্টোরেজ কী জেনারেট করা
  const getCartKey = () => (user ? `cart_${user._id}` : 'cart_guest');

  // ১. ইউজার বা লোকাল স্টোরেজ থেকে আগের কার্ট ডাটা লোড করা
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(getCartKey());
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ২. ইউজার চেঞ্জ হলে কার্ট ডাটা রি-লোড করা
  useEffect(() => {
    const savedCart = localStorage.getItem(getCartKey());
    setCartItems(savedCart ? JSON.parse(savedCart) : []);
  }, [user]);

  // ৩. যখনই কার্টে পরিবর্তন আসবে, সঠিক ইউজার কী-তে সেভ করা
  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
  }, [cartItems, user]);

  // ৪. কার্টে পণ্য যোগ করা
  const addToCart = (product, quantity = 1) => {
    // সেলার নিজের পণ্য কিনতে পারবে না চেক
    const productSellerId = product.seller?._id || product.seller;
    if (user && productSellerId && productSellerId.toString() === user._id.toString()) {
      toast.error('আপনি আপনার নিজের পণ্য কিনতে পারবেন না');
      return;
    }

    setCartItems(prevItems => {
      const isItemInCart = prevItems.find(item => item._id === product._id);

      if (isItemInCart) {
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, qty: quantity }];
    });
  };

  // ৫. কার্ট থেকে পণ্য কমানো বা রিমুভ করা
  const removeFromCart = id => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id));
  };

  // ৬. পণ্যের সংখ্যা সরাসরি আপডেট করা
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item => (item._id === id ? { ...item, qty: newQty } : item))
    );
  };

  // ৭. সম্পূর্ণ কার্ট খালি করা
  const clearCart = () => {
    setCartItems([]);
  };

  // ৮. কার্টের হিসাব-নিকাশ
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.discountPrice || item.price) * item.qty,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice: subtotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// কাস্টম হুক
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
