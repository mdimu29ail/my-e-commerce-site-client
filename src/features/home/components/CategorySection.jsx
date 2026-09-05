import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CategorySection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/categories`);
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [API_URL]);

  const scroll = direction => {
    const { current } = scrollRef;
    if (direction === 'left') {
      current.scrollBy({ left: -400, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = id => {
    navigate(`/shop?category=${id}&maxPrice=100000&sort=-createdAt&page=1`);
  };

  return (
    <section className="py-24 bg-white overflow-hidden relative group font-sans">
      <div className="container mx-auto  px-4 md:px-10">
        {/* হেডিং সেকশন (Humanist Theme) */}
        <div className="flex flex-col items-center text-center mb-20 space-y-6">
          <div className="flex items-center space-x-4 text-red-600">
            <div className="h-[1px] w-16 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">
              Premium Curation
            </span>
            <div className="h-[1px] w-16 bg-red-600" />
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Browse By <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — style archive.
            </span>
          </h2>
        </div>

        {/* স্লাইডার কন্টেইনার */}
        <div className="relative">
          {/* ন্যাভিগেশন অ্যারো */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white border border-stone-100 w-12 h-12 rounded-full flex items-center justify-center shadow-xl hover:bg-stone-900 hover:text-white transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:left-0"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>

          {/* ক্যাটাগরি সার্কেল লিস্ট */}
          <div
            ref={scrollRef}
            className="flex space-x-10 md:space-x-16 overflow-x-auto no-scrollbar scroll-smooth pb-12 pt-4 px-4"
          >
            {loading
              ? [...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 flex flex-col items-center"
                  >
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-stone-50 animate-pulse border border-stone-100" />
                    <div className="h-3 w-20 bg-stone-50 mt-6 animate-pulse rounded-full" />
                  </div>
                ))
              : categories.map(cat => (
                  <div
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat._id)}
                    className="flex-shrink-0 flex flex-col items-center cursor-pointer group/item"
                  >
                    {/* রাউন্ড ইমেজ কন্টেইনার */}
                    <div className="relative w-40 h-40 md:w-56 md:h-56">
                      {/* রোটেটিং বর্ডার অন হোভার */}
                      <div className="absolute inset-[-8px] rounded-full border border-dashed border-stone-200 group-hover/item:border-red-600 group-hover/item:rotate-[30deg] transition-all duration-1000 ease-in-out" />

                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10">
                        <img
                          src={
                            cat.image ||
                            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800'
                          }
                          alt={cat.nameEn}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover/item:scale-115"
                        />
                        {/* সফট ওভারলে */}
                        <div className="absolute inset-0 bg-stone-900/0 group-hover/item:bg-stone-900/10 transition-all duration-500" />
                      </div>
                    </div>

                    {/* ক্যাটাগরি নাম (Under the Circle) */}
                    <div className="mt-10 text-center">
                      <span className="text-[11px] font-black text-stone-900 uppercase tracking-[0.4em] block transition-colors group-hover/item:text-red-600">
                        {i18n.language === 'bn' ? cat.nameBn : cat.nameEn}
                      </span>
                      <div className="w-0 h-[1px] bg-red-600 mx-auto mt-2 group-hover/item:w-full transition-all duration-500" />
                    </div>
                  </div>
                ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white border border-stone-100 w-12 h-12 rounded-full flex items-center justify-center shadow-xl hover:bg-stone-900 hover:text-white transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:right-0"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default CategorySection;
