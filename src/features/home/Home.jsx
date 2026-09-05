import React from 'react';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import FeaturedProducts from './components/FeaturedProducts';
import PromotionBanner from './components/PromotionBanner';
import WhyChooseUs from './components/WhyChooseUs';
import Newsletter from './components/Newsletter';
import PopularProducts from './components/PopularProducts';
import Footer from './components/Footer';
import ReviewsSection from './components/ReviewsSection';
import BrandBannerSection from './components/BrandBannerSection';
import ThreeDHeroCanvas from './components/ThreeDHeroCanvas';

const Home = () => {
  return (
    <div className="space-y-10 container mx-auto px-3 sm:px-3 lg:px-3">
      {/* ১. হিরো সেকশন (বড় ব্যানার) */}
      <HeroSection />

      {/* ২. ক্যাটাগরি সেকশন (আইকনসহ গোল কার্ড) */}
      <div className="container mx-auto px-3 sm:px-3 lg:px-3">
        <CategorySection />
      </div>

      {/* ৩. ফিচারড প্রোডাক্টস (স্লাইডার বা গ্রিড) */}
      <div className="container mx-auto px-3 sm:px-3 lg:px-3">
        <FeaturedProducts />
      </div>

      {/* ৪. প্রমোশন ব্যানার (ডিসকাউন্ট অফার) */}
      <PromotionBanner />

      {/* ৫. জনপ্রিয় প্রোডাক্টস */}
      <div className="container mx-auto px-3 sm:px-3 lg:px-3">
        <PopularProducts />
      </div>
      <BrandBannerSection />

      {/* ৬. কেন আমাদের পছন্দ করবেন (Why Choose Us) */}
      <WhyChooseUs />
      <ReviewsSection />
      {/* ৭. নিউজলেটার (ইমেইল সাবস্ক্রিপশন) */}
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;
