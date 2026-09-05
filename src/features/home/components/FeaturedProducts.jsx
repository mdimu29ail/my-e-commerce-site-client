import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Loader from '../../../components/shared/Loader';
import { ArrowRight, Flame, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import ProductCard from '../../products/components/ProductCard';

const FeaturedProducts = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const { data } = await axios.get(`${API_URL}/products?pageSize=8`);
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching featured products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleAddToCart = (e, product, name) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`${name} ${t('cart.added_msg')}`, {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  if (loading) return <Loader />;

  return (
    <section className="py-24 px-4 sm:px-8 bg-indigo-50/30 overflow-hidden">
      <div className="container mx-auto  ">
        {/* ১. হেডার সেকশন - শ্যাডো রিমুভড */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10 border-b border-gray-100 pb-12">
          <div className="max-w-2xl space-y-6">
            {/* ১. এডিটোরিয়াল ব্যাজ */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 text-red-600"
            >
              <div className="h-[1px] w-12 bg-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                {t('home.trending_now')}
              </span>
            </motion.div>

            {/* ২. মিক্সড টাইপোগ্রাফি হেডলাইন (Editorial Style) */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-[0.85]"
            >
              {t('home popular_title').split(' ')[0]} <br />
              <span className="italic font-serif text-red-600 lowercase tracking-normal font-light">
                {t('home popular_title').split(' ').slice(1).join(' ')}.
              </span>
            </motion.h2>

            {/* ৩. ক্লিন সাব-টাইটেল */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-[0.2em] max-w-sm leading-loose"
            >
              {t('home popular_subtitle')}
            </motion.p>
          </div>

          {/* ৪. মডার্ন পিল-শেপড বাটন */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0"
          >
            <Link
              to="/shop?sort=-soldCount"
              className="group relative inline-flex items-center space-x-4 bg-gray-900 text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-500 hover:bg-red-600 shadow-2xl shadow-gray-200"
            >
              <span>{t('home explore_more')}</span>
              <div className="relative overflow-hidden w-5 h-5">
                <ArrowUpRight
                  size={20}
                  className="transition-transform duration-500 group-hover:translate-x-5 group-hover:-translate-y-5"
                />
                <ArrowUpRight
                  size={20}
                  className="absolute top-5 -left-5 transition-transform duration-500 group-hover:-translate-x-0 group-hover:-translate-y-5"
                />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* ২. প্রোডাক্ট গ্রিড - স্ট্যাকড লেয়ার থাকবে কিন্তু শ্যাডো থাকবে না */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-14"
        >
          {products.map(product => (
            <motion.div
              key={product._id}
              variants={itemVariants}
              className="relative group h-full"
            >
              {/* মেইন কার্ড কন্টেইনার - No Shadow */}
              <div
                className="h-full bg-white rounded-[2.5rem]  border border-indigo-50 transition-all duration-500
              "
              >
                <ProductCard
                  product={product}
                  handleAddToCart={handleAddToCart}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ৩. নিচের ডিজাইন এলিমেন্ট */}
        <div className="mt-28 flex items-center justify-center space-x-4 opacity-20">
          <div className="h-px w-12 bg-indigo-600"></div>
          <TrendingUp size={20} className="text-indigo-600" />
          <div className="h-px w-12 bg-indigo-600"></div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
