import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  RotateCcw,
  Clock,
  ShieldCheck,
  Package,
  MapPin,
  Minus,
  Hash,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Activity,
  DollarSign,
  MessageSquare,
  Camera,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const UserReturnDetails = () => {
  const { id } = useParams();
  const [returnDetails, setReturnDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchReturnProtocol = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/returns/${id}`, {
          withCredentials: true,
        });
        setReturnDetails(data);
      } catch (error) {
        console.error('Archive Sync Error');
      } finally {
        setLoading(false);
      }
    };
    fetchReturnProtocol();
  }, [id]);

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  if (!returnDetails)
    return (
      <div className="p-20 text-center uppercase font-black text-stone-300 tracking-widest">
        Protocol Not Found.
      </div>
    );

  // রিটার্ন ধাপসমূহ
  const steps = [
    { id: 'Pending', label: 'Request Ingested', icon: <Clock size={16} /> },
    {
      id: 'Approved',
      label: 'Protocol Approved',
      icon: <ShieldCheck size={16} />,
    },
    {
      id: 'Picked Up',
      label: 'Reverse Logistics',
      icon: <Package size={16} />,
    },
    {
      id: 'Refunded',
      label: 'Financial Reversal',
      icon: <DollarSign size={16} />,
    },
  ];

  const currentIndex = steps.findIndex(s => s.id === returnDetails.status);

  return (
    <div className="space-y-12 font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* ১. এডিটোরিয়াল হেডার */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12 mt-10">
        <div className="space-y-6">
          <Link
            to="/user/orders"
            className="flex items-center gap-2 text-stone-400 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Back to Ledger
            </span>
          </Link>
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Reverse Logistics Protocol
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Return <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — manifest.
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">
            Protocol ID
          </p>
          <h3 className="text-xl font-black text-stone-900 font-mono tracking-tighter">
            #{returnDetails._id.slice(-12).toUpperCase()}
          </h3>
        </div>
      </div>

      {/* ২. রিটার্ন প্রোগ্রেস (Brutalist Timeline) */}
      <div className="bg-white border border-stone-100 p-10 md:p-16 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Activity size={150} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 md:gap-4">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="flex flex-1 items-start md:items-center gap-4 relative"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center border transition-all duration-700 ${
                  idx <= currentIndex
                    ? 'bg-stone-900 border-stone-900 text-white'
                    : 'bg-white border-stone-100 text-stone-200'
                } ${idx < currentIndex ? 'bg-red-600 border-red-600' : ''}`}
              >
                {idx < currentIndex ? <CheckCircle2 size={18} /> : step.icon}
              </div>
              <div className="space-y-1">
                <p
                  className={`text-[9px] font-black uppercase tracking-widest ${idx <= currentIndex ? 'text-stone-900' : 'text-stone-300'}`}
                >
                  {step.label}
                </p>
                <p className="text-[8px] font-bold text-stone-400 uppercase tracking-tighter">
                  Phase 0{idx + 1}
                </p>
              </div>
              {/* Connect Line */}
              {idx !== steps.length - 1 && (
                <div className="hidden md:block absolute left-10 top-5 w-[calc(100%-40px)] h-[1px] bg-stone-100" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* ৩. নারেটিভ সেকশন (Reason & Details) */}
        <div className="lg:col-span-7 space-y-12">
          <div className="bg-white border border-stone-100 p-10 space-y-8 relative overflow-hidden group">
            <SectionLabel label="Return Narrative —" />
            <div className="space-y-4">
              <h4 className="text-2xl font-black text-stone-900 uppercase tracking-tighter leading-tight">
                {returnDetails.reason}
              </h4>
              <p className="text-[11px] font-medium text-stone-500 leading-loose uppercase tracking-widest">
                "
                {returnDetails.additionalDetails ||
                  'No further displacement narrative provided.'}
                "
              </p>
            </div>

            {/* Evidence Influx */}
            <div className="pt-8 border-t border-stone-50">
              <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.3em] mb-6">
                Evidence Archive —
              </p>
              <div className="flex gap-4">
                {returnDetails.images?.length > 0 ? (
                  returnDetails.images.map((img, i) => (
                    <div
                      key={i}
                      className="w-24 h-24 bg-stone-50 border border-stone-100 overflow-hidden group/img"
                    >
                      <img
                        src={img}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                        alt="Evidence"
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 text-stone-300 italic">
                    <Camera size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      No visual ingestion.
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-1000 group-hover:w-full" />
          </div>
        </div>

        {/* ৪. ফাইনান্সিয়াল ম্যাট্রিক্স ও লজিস্টিকস */}
        <div className="lg:col-span-5 space-y-8">
          {/* Financial Reversal Card */}
          <div className="bg-stone-900 p-10 text-white space-y-8 relative overflow-hidden group">
            <DollarSign
              className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000"
              size={120}
            />
            <SectionLabel label="Financial Magnitude —" white />
            <div className="space-y-2 relative z-10">
              <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">
                Estimated Reversal
              </p>
              <h3 className="text-5xl font-black tracking-tighter leading-none">
                ৳{returnDetails.order?.totalPrice?.toLocaleString()}
              </h3>
              <div className="flex items-center gap-3 pt-4">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] bg-red-600 px-2 py-1">
                  Full Credit
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] border border-stone-700 px-2 py-1">
                  Wallet Refund
                </span>
              </div>
            </div>
          </div>

          {/* Support Protocol */}
          <div className="bg-white border border-stone-100 p-10 space-y-6 group">
            <SectionLabel label="Assistance Protocol —" />
            <p className="text-[10px] font-medium text-stone-400 uppercase leading-relaxed tracking-widest">
              Need to discuss this manifest? Initialize direct communication
              with our curators.
            </p>
            <Link
              to="/user/chat"
              className="flex items-center justify-between group/btn"
            >
              <span className="text-[11px] font-black text-stone-900 uppercase tracking-[0.2em] border-b border-stone-100 pb-1 group-hover/btn:border-red-600 transition-colors">
                Archive Chat Protocol
              </span>
              <MessageSquare
                size={16}
                className="text-stone-300 group-hover/btn:text-red-600 transition-colors"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components (Signature Styles) ---

const SectionLabel = ({ label, white = false }) => (
  <div className="flex items-center gap-3">
    <Minus size={14} className="text-red-600" />
    <span
      className={`text-[10px] font-black uppercase tracking-[0.4em] ${white ? 'text-stone-400' : 'text-stone-900'}`}
    >
      {label}
    </span>
  </div>
);

export default UserReturnDetails;
