import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Lucide Icons
import {
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Minus,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
// Social Icons
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.8 },
    },
  };

  return (
    <footer className="bg-white text-stone-900 pt-24 pb-12 border-t border-stone-100 overflow-hidden relative font-sans selection:bg-red-50 selection:text-red-600">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10"
      >
        {/* ১. ব্র্যান্ড পরিচিতি */}
        <div className="space-y-10">
          <Link to="/" className="inline-block group">
            <div className="text-3xl font-black tracking-tighter">
              OmerShop<span className="text-red-600">360</span>
            </div>
            <div className="h-[1px] w-0 bg-red-600 group-hover:w-full transition-all duration-500 mt-1" />
          </Link>

          <p className="text-[13px] leading-loose font-medium text-stone-400 uppercase tracking-widest italic font-serif">
            — Artisanal quality and timeless design. Redefining modern luxury in
            every thread.
          </p>

          <div className="flex items-center space-x-5">
            <SocialIcon href="#" icon={<FaFacebookF size={14} />} />
            <SocialIcon href="#" icon={<FaInstagram size={14} />} />
            <SocialIcon href="#" icon={<FaTwitter size={14} />} />
            <SocialIcon href="#" icon={<FaYoutube size={14} />} />
          </div>
        </div>

        {/* ২. কালেকশন লিঙ্কস */}
        <div>
          <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-900 mb-10 flex items-center gap-3">
            <Minus size={16} className="text-red-600" />
            Collections
          </h4>
          <ul className="space-y-5">
            <FooterLink to="/shop" label="New Arrivals" />
            <FooterLink to="/shop?category=featured" label="Best Sellers" />
            <FooterLink to="/flash-sale" label="Flash Archive" />
            <FooterLink to="/categories" label="Lookbook 2024" />
          </ul>
        </div>

        {/* ৩. কাস্টমার সাপোর্ট */}
        <div>
          <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-900 mb-10 flex items-center gap-3">
            <Minus size={16} className="text-red-600" />
            Services
          </h4>
          <ul className="space-y-5">
            <FooterLink to="/tracking" label="Track Order" />
            <FooterLink to="/returns" label="Exchange Policy" />
            <FooterLink to="/faq" label="Global Help" />
            <FooterLink to="/contact" label="Contact Us" />
          </ul>
        </div>

        {/* ৪. কন্টাক্ট ও কাজের সময় */}
        <div className="space-y-10">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-900 mb-8 flex items-center gap-3">
              <Minus size={16} className="text-red-600" />
              Reach Us
            </h4>
            <ul className="space-y-4 text-[12px] font-bold uppercase tracking-widest text-stone-400">
              <li className="flex items-center gap-3 hover:text-red-600 transition-colors cursor-pointer">
                <Mail size={14} strokeWidth={1.5} /> support@bazaarbd.com
              </li>
              <li className="flex items-center gap-3 hover:text-red-600 transition-colors cursor-pointer">
                <Phone size={14} strokeWidth={1.5} /> +880 1234 567 890
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-stone-100">
            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-300 mb-4 flex items-center gap-2">
              <Clock size={12} /> Atelier Hours
            </h4>
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest leading-relaxed">
              Mon — Fri : 09:00 — 21:00 <br />
              Sat — Sun : 10:00 — 18:00
            </p>
          </div>
        </div>
      </motion.div>

      {/* ৫. পেমেন্ট পার্টনারস (bKash, Nagad, Visa, Mastercard) */}
      <div className="container mx-auto px-6 lg:px-10 mt-24 pt-10 border-t border-stone-100">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center lg:items-start gap-2">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400">
              &copy; {currentYear} BazaarBD — All Rights Reserved.
            </p>
            <div className="flex space-x-6 text-[8px] font-black uppercase tracking-[0.3em] text-stone-300">
              <Link to="/privacy" className="hover:text-red-600">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-red-600">
                Terms
              </Link>
            </div>
          </div>

          {/* পেমেন্ট আইকন গ্রিড - মডার্ন লুক */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10">
            {/* bKash */}
            <img
              src="https://raw.githubusercontent.com/Shakkhor/payment-icons/master/bKash.png"
              className="h-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer"
              alt="bKash"
            />
            {/* Nagad */}
            <img
              src="https://raw.githubusercontent.com/Shakkhor/payment-icons/master/Nagad.png"
              className="h-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer"
              alt="Nagad"
            />
            {/* Visa */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg"
              className="h-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer"
              alt="Visa"
            />
            {/* Mastercard */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              className="h-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer"
              alt="Mastercard"
            />

            {/* সেপারেটর লাইন */}
            <div className="hidden md:block h-6 w-[1px] bg-stone-200 mx-2" />

            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-stone-900 border border-stone-100 px-4 py-2 rounded-sm bg-stone-50/50">
              <ShieldCheck size={14} className="text-red-600" />
              <span>Secure SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* ব্যাকগ্রাউন্ড জলছাপ (Editorial Accent) */}
      <div className="absolute bottom-0 right-0 p-10 opacity-[0.03] pointer-events-none translate-x-20 translate-y-20">
        <ArrowUpRight size={400} strokeWidth={0.5} />
      </div>
    </footer>
  );
};

// সোশ্যাল আইকন হেল্পার
const SocialIcon = ({ href, icon }) => (
  <motion.a
    href={href}
    whileHover={{ y: -3, color: '#e11d48', borderColor: '#e11d48' }}
    className="w-10 h-10 flex items-center justify-center bg-white border border-stone-100 text-stone-400 rounded-full transition-all duration-500 shadow-sm"
  >
    {icon}
  </motion.a>
);

// ফুটার লিঙ্ক হেল্পার
const FooterLink = ({ to, label }) => (
  <li>
    <Link
      to={to}
      className="group flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-all duration-500"
    >
      <div className="w-0 h-[1px] bg-red-600 group-hover:w-4 transition-all duration-500" />
      <span className="group-hover:translate-x-1 transition-transform">
        {label}
      </span>
    </Link>
  </li>
);

export default Footer;
