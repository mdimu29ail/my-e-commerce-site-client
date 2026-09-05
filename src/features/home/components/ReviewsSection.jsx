import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Star, CheckCircle, MessageSquare, Minus, Quote } from 'lucide-react';

const ReviewsSection = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const { data } = await axios.get(
          `${API_URL}/products/reviews/approved`
        );
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchApprovedReviews();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="py-24 bg-white overflow-hidden font-sans border-t border-gray-50">
      <div className="container mx-auto  px-6 md:px-10">
        {/* ১. এডিটোরিয়াল হেডার সেকশন */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10 border-b border-gray-100 pb-12">
          <div className="max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4 text-red-600"
            >
              <div className="h-[1px] w-12 bg-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em]">
                {t('reviews.badge') || 'Community Voices'}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]"
            >
              Voices <br />
              <span className="italic font-serif text-red-600 lowercase tracking-normal font-light">
                — of our community.
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] max-w-[260px] leading-loose"
          >
            {t('reviews.main_subtitle') ||
              'Read the authentic experiences from our global family of style enthusiasts.'}
          </motion.p>
        </div>

        {/* ২. রিভিউ গ্রিড - Linear Minimalist Design */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              variants={itemVariants}
              className={`group relative p-10 md:p-12 flex flex-col items-start transition-all duration-700
                ${index % 3 !== 2 ? 'lg:border-r border-gray-100' : ''}
                border-b lg:border-b-0 border-gray-100 hover:bg-gray-50/50`}
            >
              {/* ব্যাকগ্রাউন্ড ড্যাশ ইনডেক্স */}
              <span className="absolute top-8 right-8 text-[11px] font-black text-gray-200 group-hover:text-red-200 transition-colors uppercase tracking-[0.4em]">
                — 0{index + 1}
              </span>

              {/* রিভিউ ইনফো */}
              <div className="w-full flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-black uppercase border-2 border-white shadow-xl group-hover:bg-red-600 transition-all">
                    {review.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest leading-none">
                      {review.user?.name}
                    </h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {review.isVerifiedPurchase && (
                  <span className="text-[8px] font-black text-red-600 uppercase tracking-[0.2em] border border-red-100 px-2 py-1 rounded-sm">
                    Verified
                  </span>
                )}
              </div>

              {/* রেটিং স্টারস - Minimalist */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className={
                      i < review.rating
                        ? 'text-red-600 fill-red-600'
                        : 'text-gray-100'
                    }
                  />
                ))}
              </div>

              {/* কমেন্ট */}
              <div className="relative">
                <Quote
                  size={20}
                  className="text-gray-100 absolute -top-4 -left-2 -z-10"
                />
                <p className="text-gray-500 text-[13px] md:text-sm font-medium leading-relaxed uppercase tracking-wider group-hover:text-gray-800 transition-colors">
                  "{review.comment}"
                </p>
              </div>

              {/* কার্ড ফুটার - রেখা ভিত্তিক */}
              <div className="mt-12 w-full flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-[1px] w-8 bg-gray-200 group-hover:w-12 group-hover:bg-red-600 transition-all duration-500" />
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest group-hover:text-red-600 transition-colors">
                    Shared Experience
                  </span>
                </div>
              </div>

              {/* হোভার রেখা */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
            </motion.div>
          ))}
        </motion.div>

        {/* ৩. বটম সিগনেচার */}
        <div className="mt-32 flex flex-col items-center justify-center space-y-8 opacity-30">
          <div className="flex items-center space-x-12">
            <div className="h-[1px] w-32 bg-gray-900" />
            <Minus size={20} className="text-gray-900" />
            <div className="h-[1px] w-32 bg-gray-900" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-500">
            — Curated Customer Feed —
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
