import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ProductCard from '../../products/components/ProductCard';
import Loader from '../../../components/shared/Loader';
import { TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PopularProducts = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. API_URL টিকে এখানে ডিফাইন করুন যাতে এটি নিচের সব জায়গায় এক্সেস করা যায়
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/products?pageSize=4&sort=-soldCount`
        );
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching popular products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, [API_URL]); // এখন আর এরর আসবে না

  // অ্যানিমেশন কনফিগ
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: [0.25, 1, 0.5, 1] },
    },
  };

  if (loading) return <Loader />;

  return (
    <section className="py-24 px-4 sm:px-8 bg-white overflow-hidden select-none font-sans">
      <div className="container mx-auto  ">
        {/* --- হেডার সেকশন --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 border-b border-gray-100 pb-12">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="h-[1px] w-10 bg-red-600"></div>
              <span className="text-red-600 font-black uppercase tracking-[0.5em] text-[9px]">
                {t('home.most_wanted') || 'Most Wanted'}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-[0.85]"
            >
              Popular <br />
              <span className="italic font-serif lowercase tracking-normal text-red-600 font-light">
                essentials.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] max-w-xs leading-loose"
            >
              {t('home.popular_subtitle') ||
                'A selection of our most-coveted pieces, defined by timeless design.'}
            </motion.p>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/shop?sort=-soldCount"
              className="group inline-flex items-center space-x-4 bg-gray-900 text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 hover:bg-red-600 shadow-2xl shadow-gray-200"
            >
              <span>{t('home.explore_all') || 'View Lookbook'}</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-2 transition-transform"
              />
            </Link>
          </motion.div>
        </div>

        {/* --- প্রোডাক্ট গ্রিড --- */}

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
              className="relative group w-full h-full"
            >
              {/* মেইন কার্ড কন্টেইনার - No Shadow */}
              <div
                className="h-full w-full bg-white rounded-[2.5rem] border border-indigo-50 transition-all duration-500
              "
              >
                <ProductCard
                  product={product}
                  // handleAddToCart={handleAddToCart}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* --- বটম ডেকোরেশন --- */}
        <div className="mt-40 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center space-x-4 opacity-20">
            <div className="h-[1px] w-20 bg-gray-900"></div>
            <Sparkles size={20} className="text-gray-900" />
            <div className="h-[1px] w-20 bg-gray-900"></div>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-300">
            Artisanal Curation 2024
          </p>
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
