import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronRight,
  Minus,
  LayoutGrid,
  List,
} from 'lucide-react';
import ProductListing from './components/ProductListing';
import Pagination from '../../components/shared/Pagination';
import Loader from '../../components/shared/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
  const { t, i18n } = useTranslation();
  const { search } = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const queryParams = new URLSearchParams(search);
  const [keyword, setKeyword] = useState(queryParams.get('keyword') || '');
  const [category, setCategory] = useState(queryParams.get('category') || '');
  const [priceRange, setPriceRange] = useState(
    queryParams.get('maxPrice') || 100000
  );
  const [sort, setSort] = useState(queryParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(Number(queryParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/categories`);
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [API_URL]);

  useEffect(() => {
    const params = new URLSearchParams(search);
    setCategory(params.get('category') || '');
    setKeyword(params.get('keyword') || '');
    setPriceRange(Number(params.get('maxPrice')) || 100000);
    setSort(params.get('sort') || '-createdAt');
    setPage(Number(params.get('page')) || 1);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (category) params.append('category', category);
      params.append('maxPrice', priceRange);
      params.append('sort', sort);
      params.append('page', page);
      navigate({ search: params.toString() }, { replace: true });

      const { data } = await axios.get(
        `${API_URL}/products?keyword=${keyword}&category=${category}&maxPrice=${priceRange}&sort=${sort}&pageNumber=${page}`
      );
      setProducts(data.products);
      setTotalPages(data.pages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, priceRange, sort, page, API_URL, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-red-50 selection:text-red-600">
      {/* --- ১. এডিটোরিয়াল হেডার (Humanist Style) --- */}
      <div className="bg-[#F9F9F9] border-b border-gray-100 py-16 md:py-24">
        <div className="container mx-auto  px-6 md:px-10">
          <div className="flex flex-col items-start space-y-6">
            <nav className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
              <span
                className="hover:text-red-600 cursor-pointer transition-colors"
                onClick={() => navigate('/')}
              >
                Home
              </span>
              <ChevronRight size={10} />
              <span className="text-red-600">Shop Archive</span>
            </nav>
            <h1 className="text-5xl md:text-8xl font-light text-gray-900 tracking-tighter leading-none uppercase">
              The{' '}
              <span className="italic font-serif text-red-600 font-normal lowercase tracking-normal">
                Archive.
              </span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-[0.3em] max-w-sm">
              Explore our curated selection of seasonal essentials and timeless
              designs.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto  px-6 md:px-10 py-12">
        {/* মোবাইল ফিল্টার টগল */}
        <button
          onClick={() => setShowMobileFilter(true)}
          className="lg:hidden w-full mb-8 flex items-center justify-between border-2 border-gray-900 p-5 text-[11px] font-black uppercase tracking-[0.3em]"
        >
          Filter / Search <SlidersHorizontal size={16} />
        </button>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* --- ২. সাইডবার ফিল্টার (Linear Minimalist Style) --- */}
          <aside
            className={`
            fixed inset-0 bg-white p-8 lg:relative lg:inset-auto lg:p-0 lg:w-72 lg:block
            ${showMobileFilter ? 'block' : 'hidden'}
          `}
          >
            <div className="flex items-center justify-between lg:hidden mb-12">
              <h3 className="text-xl font-black uppercase tracking-tighter">
                Filters
              </h3>
              <X size={24} onClick={() => setShowMobileFilter(false)} />
            </div>

            <div className="space-y-12 sticky top-32">
              {/* সার্চ ব্লক */}
              <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                  <Minus size={14} className="text-red-600" /> Search
                </h4>
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold focus:outline-none focus:border-red-600 transition-all uppercase tracking-widest placeholder:text-gray-300"
                    placeholder="Keywords..."
                    value={keyword}
                    onChange={e => {
                      setKeyword(e.target.value);
                      setPage(1);
                    }}
                  />
                  <Search
                    size={16}
                    className="absolute right-0 top-3 text-gray-300 group-focus-within:text-red-600 transition-colors"
                  />
                </div>
              </div>

              {/* ক্যাটাগরি ব্লক */}
              <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                  <Minus size={14} className="text-red-600" /> Collection
                </h4>
                <div className="flex flex-col items-start gap-4">
                  <button
                    onClick={() => {
                      setCategory('');
                      setPage(1);
                    }}
                    className={`text-[11px] font-black uppercase tracking-widest transition-all ${category === '' ? 'text-red-600' : 'text-gray-400 hover:text-gray-900'}`}
                  >
                    — All Pieces
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setCategory(cat._id);
                        setPage(1);
                      }}
                      className={`text-[11px] font-black uppercase tracking-widest transition-all ${category === cat._id ? 'text-red-600' : 'text-gray-400 hover:text-gray-900'}`}
                    >
                      — {i18n.language === 'en' ? cat.nameEn : cat.nameBn}
                    </button>
                  ))}
                </div>
              </div>

              {/* প্রাইজ রেঞ্জ ব্লক */}
              <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                  <Minus size={14} className="text-red-600" /> Budget
                </h4>
                <div className="px-2">
                  <input
                    type="range"
                    min="500"
                    max="200000"
                    step="500"
                    className="w-full h-[1px] bg-gray-200 appearance-none cursor-pointer accent-red-600"
                    value={priceRange}
                    onChange={e => {
                      setPriceRange(e.target.value);
                      setPage(1);
                    }}
                  />
                  <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span>min ৳500</span>
                    <span className="text-red-600 font-black">
                      max ৳{priceRange}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* --- ৩. মেইন কন্টেন্ট এলাকা --- */}
          <main className="flex-1">
            {/* টপ ফিল্টার বার (Clean) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                {products.length} Items Found In Archive
              </p>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-4 text-gray-300">
                  <LayoutGrid
                    size={16}
                    className="cursor-pointer text-gray-900"
                  />
                  <List
                    size={16}
                    className="cursor-pointer hover:text-gray-900 transition-colors"
                  />
                </div>
                <div className="h-4 w-[1px] bg-gray-200" />
                <select
                  className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-gray-900 focus:ring-0 cursor-pointer"
                  value={sort}
                  onChange={e => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="-createdAt">Newest Arrivals</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* প্রোডাক্ট লিস্ট */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {products.length > 0 ? (
                  <ProductListing products={products} />
                ) : (
                  <div className="text-center py-32 space-y-4">
                    <h3 className="text-2xl font-light uppercase tracking-tighter">
                      No Pieces Found.
                    </h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                      Try adjusting your filters.
                    </p>
                  </div>
                )}

                {/* প্যাজিনেশন (Clostich Style) */}
                <div className="mt-24 pt-12 border-t border-gray-100">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={p => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
