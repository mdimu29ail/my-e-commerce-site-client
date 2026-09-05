import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BrandPromoSection = () => {
  const scrollRef = useRef(null);

  // ব্র্যান্ড লিস্ট (স্লাইডার চেক করার জন্য একটু বেশি নাম দেওয়া হয়েছে)
  const brands = [
    'CELINE',
    'PRADA',
    'VERSACE',
    'KENZO',
    'miu miu',
    'FENDI',
    'GUCCI',
    'DIOR',
    'CHANEL',
  ];

  // স্লাইডার স্ক্রল ফাংশন
  const scroll = direction => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 250;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="bg-white py-16 font-sans overflow-hidden">
      <div className="container mx-auto  px-6">
        {/* ১. ব্র্যান্ড স্লাইডার (Arrows সহ) */}
        <div className="relative flex items-center mb-16 group/slider">
          {/* বাম অ্যারো */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-2 z-10 p-2 bg-white/80 rounded-full shadow-md hover:bg-black hover:text-white transition-all opacity-0 group-hover/slider:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>

          {/* ব্র্যান্ড নামগুলো */}
          <div
            ref={scrollRef}
            className="flex items-center space-x-12 md:space-x-20 overflow-x-hidden no-scrollbar whitespace-nowrap px-10"
          >
            {brands.map((brand, i) => (
              <span
                key={i}
                className={`text-xl md:text-2xl font-bold tracking-[0.2em] text-gray-900 cursor-default select-none ${i === 4 ? 'lowercase italic font-serif' : 'uppercase'}`}
              >
                {brand}
              </span>
            ))}
          </div>

          {/* ডান অ্যারো */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-2 z-10 p-2 bg-white/80 rounded-full shadow-md hover:bg-black hover:text-white transition-all opacity-0 group-hover/slider:opacity-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* ২. মেইন ব্যানার সেকশন */}
        <div className="relative bg-[#F3F2EE] flex flex-col md:flex-row items-stretch rounded-sm overflow-hidden group">
          {/* বাম পাশে টেক্সট কন্টেন্ট */}
          <div className="w-full md:w-5/12 p-10 md:p-16 flex flex-col justify-center z-20">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-red-600 text-xs font-black uppercase tracking-[0.3em] mb-4"
            >
              100% Original Products
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-light text-gray-900 leading-tight mb-6"
            >
              The All New <br />
              <span className="font-bold uppercase tracking-tighter">
                Fashion
              </span>{' '}
              <br />
              <span className="italic font-serif">Collection Items</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mb-8"
            >
              <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">
                Starting From
              </p>
              <p className="text-red-600 font-black text-3xl tracking-tighter mt-1">
                $59.00
              </p>
            </motion.div>

            <Link
              to="/shop"
              className="w-max bg-gray-900 text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all duration-500 shadow-xl flex items-center gap-3 group/btn"
            >
              Shop Now
              <ArrowRight
                size={14}
                className="group-hover/btn:translate-x-2 transition-transform"
              />
            </Link>
          </div>

          {/* ডান পাশে ইমেজ - Hover Scale Effect সহ */}
          <div className="w-full md:w-7/12 relative overflow-hidden">
            <motion.img
              src="https://i.ibb.co.com/bgDxHRBm/Cms-Banner-1.jpg" // এখানে আপনার দেওয়া ইমেজের লিঙ্ক কাজ করবে
              alt="Fashion Items"
              className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            />
            {/* সফট গ্রেডিয়েন্ট ওভারলে যাতে টেক্সট ক্লিয়ার থাকে */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F3F2EE] via-transparent to-transparent hidden md:block"></div>
          </div>
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

export default BrandPromoSection;
