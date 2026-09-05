import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  MapPin,
  Minus,
  Hash,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';

const ShippingTracker = ({ currentStatus, history, order }) => {
  const { t, i18n } = useTranslation();

  const steps = [
    {
      id: 'Order Placed',
      icon: <PackageCheck size={16} />,
      label: t('tracking.placed'),
      timestamp: order?.placedAt,
    },
    {
      id: 'Processing & Verification',
      icon: <Clock size={16} />,
      label: t('tracking.processing'),
      timestamp: order?.verifiedAt,
    },
    {
      id: 'En Route to Destination',
      icon: <Truck size={16} />,
      label: t('tracking.shipped'),
      timestamp: order?.shippedAt,
    },
    {
      id: 'Out for Delivery',
      icon: <NavigationIcon size={16} />,
      label: t('tracking.out_for_delivery'),
      timestamp: order?.outForDeliveryAt,
    },
    {
      id: 'Successfully Delivered',
      icon: <CheckCircle2 size={16} />,
      label: t('tracking.delivered'),
      timestamp: order?.deliveredAt,
    },
  ];

  const getStepIndex = status => steps.findIndex(step => step.id === status);
  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="py-12 font-sans selection:bg-red-50 selection:text-red-600">
      {/* ১. প্রগ্রেস ম্যানিফেস্ট (Brutalist Timeline) */}
      <div className="relative mb-24 px-4">
        {/* Baseline Hairline */}
        <div className="absolute left-0 top-5 w-full h-[1px] bg-stone-100 z-0"></div>

        {/* Active Progress Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0}%`,
          }}
          transition={{ duration: 1.5, ease: 'circOut' }}
          className="absolute left-0 top-5 h-[1px] bg-red-600 z-0 shadow-[0_0_10px_rgba(225,29,72,0.3)]"
        ></motion.div>

        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => {
            const isActive = index <= currentIndex;
            const isCompleted = index < currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center group">
                {/* Step Node */}
                <div
                  className={`w-10 h-10 flex items-center justify-center transition-all duration-700 border ${
                    isActive
                      ? 'bg-stone-900 border-stone-900 text-white shadow-2xl'
                      : 'bg-white border-stone-100 text-stone-300'
                  } ${isCompleted ? 'bg-red-600 border-red-600' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : step.icon}
                </div>

                {/* Step Label & Timestamp (Micro-Typography) */}
                <div className="absolute -bottom-16 flex flex-col items-center w-32">
                  <span
                    className={`text-[9px] font-black uppercase tracking-[0.3em] text-center transition-colors duration-500 ${
                      isActive ? 'text-stone-900' : 'text-stone-300'
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.timestamp && (
                    <span className="text-[8px] font-bold text-stone-400 mt-1 uppercase tracking-tighter">
                      {new Date(step.timestamp).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                  {isActive && !isCompleted && (
                    <motion.div
                      layoutId="active_dot"
                      className="w-1 h-1 bg-red-600 rounded-full mt-2 animate-pulse"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ২. ট্র্যাকিং হিস্টোরিকাল রেকর্ড (Editorial Ledger) */}
      <div className="mt-32 space-y-10 max-w-4xl">
        <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
          <Minus size={20} className="text-red-600" />
          <h3 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.5em]">
            Historical Manifest —
          </h3>
        </div>

        <div className="space-y-0">
          {history && history.length > 0 ? (
            history
              .slice()
              .reverse()
              .map((event, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-stone-50 group hover:bg-stone-50/50 transition-colors"
                >
                  {/* Time Reference */}
                  <div className="md:col-span-3 space-y-1">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} />{' '}
                      {new Date(event.updatedAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-[9px] font-bold text-stone-300 uppercase tracking-tighter">
                      {new Date(event.updatedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Narrative Displacement */}
                  <div className="md:col-span-6 space-y-2">
                    <p className="text-[13px] font-black text-stone-900 uppercase tracking-tighter leading-tight group-hover:text-red-600 transition-colors">
                      {i18n.language === 'en'
                        ? event.messageEn
                        : event.messageBn}
                    </p>
                    <div className="flex items-center gap-3 text-stone-400">
                      <div className="h-[1px] w-4 bg-stone-200" />
                      <span className="text-[10px] font-bold uppercase tracking-widest italic font-serif lowercase">
                        Archive sync: {event.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Location Matrix */}
                  <div className="md:col-span-3 flex md:justify-end items-start">
                    <div className="flex items-center gap-2 px-4 py-2 border border-stone-100 bg-white shadow-sm">
                      <MapPin size={12} className="text-red-600" />
                      <span className="text-[9px] font-black text-stone-900 uppercase tracking-widest">
                        {event.location || 'Central Hub'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
          ) : (
            <div className="py-20 text-center border border-dashed border-stone-100">
              <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
                {t('tracking.no_history')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Custom Components ---

const NavigationIcon = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="square"
    strokeLinejoin="bevel"
    className={className}
  >
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

export default ShippingTracker;
