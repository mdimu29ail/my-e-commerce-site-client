import React from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, ShieldCheck, RotateCcw, Headset, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const features = [
    {
      id: '01',
      icon: <Truck size={24} strokeWidth={1.2} />,
      title: t('features.delivery_title') || 'Express Delivery',
      desc:
        t('features.delivery_desc') ||
        'Fast nationwide shipping on all orders.',
    },
    {
      id: '02',
      icon: <ShieldCheck size={24} strokeWidth={1.2} />,
      title: t('features.payment_title') || 'Secure Payment',
      desc:
        t('features.payment_desc') || 'Encrypted transactions for your safety.',
    },
    {
      id: '03',
      icon: <RotateCcw size={24} strokeWidth={1.2} />,
      title: t('features.return_title') || 'Easy Returns',
      desc: t('features.return_desc') || '30-day seamless return policy.',
    },
    {
      id: '04',
      icon: <Headset size={24} strokeWidth={1.2} />,
      title: t('features.support_title') || '24/7 Support',
      desc:
        t('features.support_desc') || 'Dedicated assistance whenever you need.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <section className="py-24 bg-white overflow-hidden font-sans border-t border-gray-50">
      <div className="container mx-auto  px-6 md:px-10">
        {/* ১. হেডার সেকশন - লাইন ব্যাজ সহ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10 border-b border-gray-100 pb-12">
          <div className="max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4 text-red-600"
            >
              <div className="h-[1px] w-12 bg-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em]">
                {t('features.badge') || 'Core Services'}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]"
            >
              Excellence <br />
              <span className="italic font-serif text-red-600 lowercase tracking-normal font-light">
                — through quality.
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] max-w-[260px] leading-loose"
          >
            {t('features.main_subtitle') ||
              'Our commitment defines our standards in modern retail.'}
          </motion.p>
        </div>

        {/* ২. ফিচারা গ্রিড - কোনো ডট নেই, শুধু রেখা */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              className={`group relative p-10 md:p-12 flex flex-col items-start transition-all duration-700
                ${index !== 3 ? 'lg:border-r border-gray-100' : ''}
                border-b lg:border-b-0 border-gray-100 hover:bg-gray-50/50`}
            >
              {/* ব্যাকগ্রাউন্ড ড্যাশ ইনডেক্স */}
              <span className="absolute top-8 right-8 text-[11px] font-black text-gray-200 group-hover:text-red-200 transition-colors uppercase tracking-[0.4em]">
                — {feature.id}
              </span>

              {/* আইকন */}
              <div className="mb-10 text-gray-900 group-hover:text-red-600 group-hover:-translate-y-1 transition-all duration-500">
                {feature.icon}
              </div>

              {/* কন্টেন্ট এবং মাঝের ড্যাশ লাইন */}
              <div className="space-y-4">
                <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-[0.2em] group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>

                {/* মাঝের ড্যাশ (Separator) */}
                <div className="w-8 h-[1px] bg-red-600/30 group-hover:w-12 transition-all duration-500" />

                <p className="text-gray-400 text-[11px] font-medium leading-relaxed uppercase tracking-widest group-hover:text-gray-600 transition-colors">
                  {feature.desc}
                </p>
              </div>

              {/* হোভার রেখা */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
            </motion.div>
          ))}
        </motion.div>

        {/* ৩. বটম ডেকোরেশন - সব লাইন ভিত্তিক */}
        <div className="mt-32 flex flex-col items-center justify-center space-y-8 opacity-30">
          <div className="flex items-center space-x-12">
            <div className="h-[1px] w-32 bg-gray-900" />
            <Minus size={20} className="text-gray-900" />
            <div className="h-[1px] w-32 bg-gray-900" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-500">
            — Established 2024 —
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
