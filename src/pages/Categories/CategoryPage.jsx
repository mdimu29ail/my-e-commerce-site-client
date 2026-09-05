import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minus,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
  RotateCcw,
  ArrowLeft,
  Maximize2,
  ArrowUpRight,
} from 'lucide-react';
import ProductCard from '../../features/products/components/ProductCard';
import Loader from '../../components/shared/Loader';
import Pagination from '../../components/shared/Pagination';

const CategoryPage = () => {
  const { id } = useParams(); // নির্দিষ্ট ক্যাটাগরি আইডি (যদি থাকে)
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // সব ক্যাটাগরি লিস্ট রাখার জন্য
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);

  const queryParams = new URLSearchParams(search);
  const [priceRange, setPriceRange] = useState(
    Number(queryParams.get('maxPrice')) || 20000
  );
  const [selectedColor, setSelectedColor] = useState(
    queryParams.get('color') || ''
  );
  const [selectedSize, setSelectedSize] = useState(
    queryParams.get('size') || ''
  );
  const [sort, setSort] = useState(queryParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(Number(queryParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // ১. সব ক্যাটাগরি ফেচ করা এবং বর্তমান ক্যাটাগরি নির্ধারণ করা
  useEffect(() => {
    const fetchCatData = async () => {
      setCatLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/categories`);
        const categoriesList = Array.isArray(data)
          ? data
          : data.categories || data.data || [];
        setCategories(categoriesList);

        if (!id) {
          // যদি কোনো নির্দিষ্ট আইডি না থাকে, তবে এটি "All Collections" পেজ
          setCategory({
            nameEn: 'All Collections',
            nameBn: 'সকল কালেকশন',
            _id: 'all',
          });
        } else {
          const currentCategory = categoriesList.find(
            c =>
              String(c._id) === String(id) ||
              (c.slug &&
                String(c.slug).toLowerCase() === String(id).toLowerCase())
          );
          setCategory(
            currentCategory || {
              nameEn: 'Archive Collection',
              nameBn: 'আর্কাইভ কালেকশন',
              _id: id,
            }
          );
        }
      } catch (err) {
        console.error('Category Fetch Error:', err);
      } finally {
        setCatLoading(false);
      }
    };

    fetchCatData();
  }, [id, API_URL]);

  // ২. প্রোডাক্ট ফেচ করার মেইন ফাংশন
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      // যদি id থাকে এবং সেটি 'all' না হয়, তবে ক্যাটাগরি ফিল্টার পাঠাবে
      if (id && id !== 'all') {
        params.append('category', id);
      }

      params.append('maxPrice', priceRange);
      if (selectedColor)
        params.append('color', encodeURIComponent(selectedColor));
      if (selectedSize) params.append('size', selectedSize);
      params.append('sort', sort);
      params.append('pageNumber', page);

      navigate({ search: params.toString() }, { replace: true });

      const { data } = await axios.get(
        `${API_URL}/products?${params.toString()}`
      );
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [
    id,
    priceRange,
    selectedColor,
    selectedSize,
    sort,
    page,
    API_URL,
    navigate,
  ]);

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [fetchProducts, category]);

  if (catLoading) return <Loader fullScreen />;

  const displayName =
    i18n.language === 'en' ? category?.nameEn : category?.nameBn;
  const titleParts = displayName?.split(' ') || ['Archive'];

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* এডিটোরিয়াল হেডার */}
      <div className="bg-[#FBFBFB] border-b border-stone-100 py-16 md:py-24">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center space-y-6">
          <nav className="flex items-center justify-center space-x-4 text-[9px] font-black uppercase tracking-[0.4em] text-stone-400">
            <Link to="/" className="hover:text-red-600 transition-colors">
              Atelier
            </Link>
            <Minus size={10} className="text-stone-200" />
            <Link to="/shop" className="hover:text-red-600 transition-colors">
              Archive
            </Link>
            <Minus size={10} className="text-stone-200" />
            <span className="text-stone-900">{displayName}</span>
          </nav>

          <h1 className="text-5xl md:text-8xl font-light text-stone-900 tracking-tighter uppercase leading-[0.9]">
            {titleParts[0]} <br />
            {titleParts.length > 1 && (
              <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
                — {titleParts.slice(1).join(' ')}.
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* --- যদি কোনো নির্দিষ্ট ID না থাকে, তবে সব ক্যাটাগরিগুলোর একটি প্রিমিয়াম গ্রিড দেখাবে --- */}
      {!id && categories.length > 0 && (
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 pt-20">
          <div className="flex items-center gap-4 mb-10">
            <Minus size={16} className="text-red-600" />
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-stone-900">
              Explore All Archives
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat._id}
                to={`/categories/${cat._id}`}
                className="group relative aspect-[4/5] bg-stone-50 overflow-hidden border border-stone-100 block"
              >
                <img
                  src={
                    cat.image ||
                    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400'
                  }
                  alt={cat.nameEn}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-red-400">
                    0{idx + 1} — Archive
                  </span>
                  <h4 className="text-xs font-black uppercase tracking-widest mt-1">
                    {i18n.language === 'en' ? cat.nameEn : cat.nameBn}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
          <div className="h-[1px] w-full bg-stone-100 mt-20" />
        </div>
      )}

      {/* প্রোডাক্ট সেকশন */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* সাইডবার ফিল্টার */}
          <aside className="w-full lg:w-[300px] space-y-16">
            <div className="border border-stone-100 p-8 bg-[#FBFBFB] shadow-sm">
              <h4 className="text-[10px] font-black uppercase border-b border-stone-100 pb-4 mb-6 tracking-[0.4em]">
                Directory
              </h4>
              <div className="space-y-4">
                {['Latest Arrivals', 'Permanent Archive', 'Seasonal'].map(
                  nav => (
                    <div
                      key={nav}
                      className="flex justify-between items-center text-[10px] font-bold text-stone-400 hover:text-red-600 cursor-pointer group uppercase tracking-widest"
                    >
                      <span>{nav}</span>
                      <Plus
                        size={14}
                        className="opacity-20 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-stone-900 uppercase tracking-tighter border-b border-stone-100 pb-4 mb-10">
                Filter Archive
              </h3>

              <div className="mb-12 space-y-6">
                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                  <Minus size={14} className="text-red-600" /> Budget Limit
                </h4>
                <div className="px-2">
                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="500"
                    className="w-full h-[1px] bg-stone-200 appearance-none cursor-pointer accent-red-600"
                    value={priceRange}
                    onChange={e => {
                      setPriceRange(Number(e.target.value));
                      setPage(1);
                    }}
                  />
                  <div className="flex justify-between mt-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                    <span>min ৳100</span>
                    <span className="text-stone-900">
                      max ৳{priceRange.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-12 space-y-6">
                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                  <Minus size={14} className="text-red-600" /> Color Finish
                </h4>
                <div className="grid grid-cols-5 gap-3">
                  {['#000000', '#FFFFFF', '#FF0000', '#1e293b', '#7c2d12'].map(
                    color => (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(
                            color === selectedColor ? '' : color
                          );
                          setPage(1);
                        }}
                        style={{ backgroundColor: color }}
                        className={`w-8 h-8 rounded-full border transition-all ${selectedColor === color ? 'border-red-600 scale-110 shadow-lg ring-2 ring-red-50' : 'border-stone-200 hover:scale-105'}`}
                      />
                    )
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedColor('');
                  setSelectedSize('');
                  setPriceRange(20000);
                  setPage(1);
                }}
                className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-stone-300 hover:text-red-600 transition-all border-b border-transparent hover:border-red-600 pb-1"
              >
                <RotateCcw size={14} /> Reset Selection
              </button>
            </div>
          </aside>

          {/* মেইন কন্টেন্ট */}
          <main className="flex-1">
            <div className="bg-white border-b border-stone-100 pb-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-stone-200">
                  <button onClick={() => setViewMode('grid')}>
                    <LayoutGrid
                      size={16}
                      className={
                        viewMode === 'grid'
                          ? 'text-stone-900'
                          : 'hover:text-stone-500'
                      }
                    />
                  </button>
                  <button onClick={() => setViewMode('list')}>
                    <List
                      size={16}
                      className={
                        viewMode === 'list'
                          ? 'text-stone-900'
                          : 'hover:text-stone-500'
                      }
                    />
                  </button>
                </div>
                <div className="h-4 w-[1px] bg-stone-200" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
                  {loading ? 'Curating...' : `${products.length} Pieces Found`}
                </span>
              </div>

              <select
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-stone-900 focus:ring-0 cursor-pointer"
                value={sort}
                onChange={e => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="-createdAt">Recently Added</option>
                <option value="price">Value: Low to High</option>
                <option value="-price">Value: High to Low</option>
                <option value="-soldCount">Best Sellers</option>
              </select>
            </div>

            {loading ? (
              <div className="py-32 flex justify-center">
                <Loader />
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {products.length > 0 ? (
                  <div
                    className={`grid gap-x-8 gap-y-16 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1'}`}
                  >
                    {products.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductCard
                          product={product}
                          isListView={viewMode === 'list'}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-32 text-center space-y-6 flex flex-col items-center">
                    <Maximize2
                      size={32}
                      strokeWidth={1}
                      className="text-stone-200"
                    />
                    <p className="text-stone-400 font-light uppercase tracking-[0.4em] text-lg italic">
                      No matches in current archive.
                    </p>
                    <button
                      onClick={() => {
                        setPriceRange(20000);
                      }}
                      className="text-[9px] font-black uppercase tracking-widest text-red-600 border-b border-red-600 pb-1"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-24 pt-12 border-t border-stone-100">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={p => {
                        setPage(p);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
