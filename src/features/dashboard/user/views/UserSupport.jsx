import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Minus,
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
  Send,
  FileText,
  X,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Loader from '../../../../components/shared/Loader';

const UserSupport = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({ subject: '', message: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // --- ১. মঙ্গোডিবি থেকে রিয়েল FAQ ডাটা ফেচ করা ---
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/faqs`); // আপনার এপিআই এন্ডপয়েন্ট চেক করুন
        setFaqs(data);
      } catch (error) {
        console.error('FAQ Archive Sync Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, [API_URL]);

  // --- ২. ইমেইল ডিসপ্যাচ ও টোস্ট লজিক ---
  const handleEmailDispatch = e => {
    e.preventDefault();
    const targetEmail = 'mdimu29@gmail.com';

    // ইমেইল প্রোটোকল
    const mailtoLink = `mailto:${targetEmail}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.message)}`;
    window.location.href = mailtoLink;

    // সাকসেস টোস্ট
    toast.success('Dispatch Protocol Initialized', {
      position: 'bottom-right',
      autoClose: 3000,
      theme: 'dark',
    });

    setEmailData({ subject: '', message: '' });
    setShowEmailForm(false);
  };

  if (loading)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-16 font-sans selection:bg-red-50 selection:text-red-600 pb-40 px-4 md:px-10">
      {/* ৩. এডিটোরিয়াল হেডার */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12 mt-10">
        <div className="space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 text-red-600"
          >
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">
              Support Center
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Client <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — concierge.
            </span>
          </h2>
        </div>
      </div>

      {/* ৪. রিয়েল মেট্রিক্স */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-100 border border-stone-100 shadow-xl">
        <MetricBox label="Archive Integrity" value="Verified" />
        <MetricBox label="Resolution Rate" value="99%" />
        <MetricBox label="Response Speed" value="Instant" />
        <MetricBox label="Secure Tunnel" value="SSL" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-10">
        {/* ৫. সাপোর্ট চ্যানেলসমূহ */}
        <div className="lg:col-span-5 space-y-12 text-left">
          <SectionLabel label="Communication Ingress —" />
          <div className="grid grid-cols-1 gap-6">
            <SupportChannel
              icon={<MessageSquare size={20} strokeWidth={1.5} />}
              title="Atelier Chat"
              desc="Real-time curator sync"
              action="Initialize"
              onClick={() => (window.location.href = '/chat')}
            />
            <SupportChannel
              icon={<FileText size={20} strokeWidth={1.5} />}
              title="Official Manifest"
              desc="Target: mdimu29@gmail.com"
              action="Compose"
              onClick={() => setShowEmailForm(true)}
            />
            <SupportChannel
              icon={<Phone size={20} strokeWidth={1.5} />}
              title="Voice Ingress"
              desc="Primary Assistance Line"
              action="Connect"
              onClick={() => (window.location.href = 'tel:+8801700000000')}
            />
          </div>

          {/* আওয়ার্স কার্ড */}
          <div className="p-10 bg-stone-50 border-l-4 border-red-600 space-y-4">
            <div className="flex items-center gap-3 text-stone-900">
              <Clock size={16} />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                Operational Timing
              </span>
            </div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-loose">
              Mon — Fri: 09:00 — 21:00 <br />
              Sat — Sun: 10:00 — 18:00 <br />
              Timezone: GMT +6
            </p>
          </div>
        </div>

        {/* ৬. ডাইনামিক FAQ আর্কাইভ (MongoDB Data) */}
        <div className="lg:col-span-7 space-y-12 text-left">
          <SectionLabel label="Knowledge Narrative —" />
          <div className="space-y-0 border-t border-stone-100">
            {faqs.length > 0 ? (
              faqs.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="border-b border-stone-100"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full py-10 flex items-center justify-between text-left hover:bg-stone-50/50 transition-all px-6 group"
                  >
                    <div className="flex items-center gap-8">
                      <span className="text-xs font-serif italic text-red-600 opacity-40">
                        / 0{idx + 1}
                      </span>
                      <span className="text-[13px] font-black text-stone-900 uppercase tracking-widest group-hover:text-red-600 transition-colors">
                        {item.question || item.q}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-stone-300 transition-transform duration-700 ${activeFaq === idx ? 'rotate-180 text-red-600' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-20 pb-12 text-[12px] font-medium text-stone-500 leading-loose uppercase tracking-[0.2em]">
                          {item.answer || item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <p className="py-10 text-stone-300 uppercase tracking-widest text-[10px] font-black">
                Archive Synchronization Pending...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ৭. ইমেইল ফর্ম মোডাল */}
      <AnimatePresence>
        {showEmailForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmailForm(false)}
              className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-white z-[101] shadow-2xl p-12 md:p-20 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-20">
                <div className="flex items-center gap-4 text-red-600">
                  <Layers size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                    Dispatch Manifest
                  </span>
                </div>
                <button
                  onClick={() => setShowEmailForm(false)}
                  className="w-10 h-10 border border-stone-100 rounded-full flex items-center justify-center text-stone-300 hover:bg-stone-900 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleEmailDispatch}
                className="space-y-16 text-left"
              >
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em]">
                    To: mdimu29@gmail.com
                  </p>
                  <h3 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tighter uppercase leading-tight">
                    Start <br />
                    <span className="italic font-serif text-red-600 lowercase tracking-normal">
                      dialogue.
                    </span>
                  </h3>
                </div>

                <div className="space-y-12">
                  <div className="space-y-4 group">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest group-focus-within:text-red-600 transition-colors">
                      Subject Protocol —
                    </label>
                    <input
                      type="text"
                      placeholder="ENTER SUBJECT..."
                      className="w-full bg-transparent border-b border-stone-200 py-4 text-[13px] font-bold uppercase outline-none focus:border-red-600 transition-all"
                      value={emailData.subject}
                      onChange={e =>
                        setEmailData({ ...emailData, subject: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-4 group">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest group-focus-within:text-red-600 transition-colors">
                      Message Manifest —
                    </label>
                    <textarea
                      rows="6"
                      placeholder="DESCRIBE YOUR INQUIRY..."
                      className="w-full bg-stone-50 border-none p-8 text-[12px] font-medium tracking-wider text-stone-600 focus:bg-white focus:ring-1 focus:ring-red-600 transition-all resize-none uppercase"
                      value={emailData.message}
                      onChange={e =>
                        setEmailData({ ...emailData, message: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-8 bg-stone-900 text-white text-[12px] font-black uppercase tracking-[0.6em] flex items-center justify-center gap-6 hover:bg-red-600 transition-all shadow-2xl group"
                >
                  <Send
                    size={18}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />{' '}
                  Execute Dispatch
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- হেল্পার কম্পোনেন্টস ---
const MetricBox = ({ label, value }) => (
  <div className="bg-white p-10 text-center flex flex-col gap-2 group hover:bg-stone-50 transition-colors">
    <span className="text-[9px] font-black text-stone-300 uppercase tracking-[0.4em] group-hover:text-red-600 transition-colors">
      {label}
    </span>
    <span className="text-2xl font-black text-stone-900 tracking-tighter uppercase">
      {value}
    </span>
  </div>
);

const SupportChannel = ({ icon, title, desc, action, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border border-stone-100 p-10 flex items-center justify-between hover:shadow-2xl transition-all duration-700 cursor-pointer relative group overflow-hidden"
  >
    <div className="flex items-center gap-8">
      <div className="w-14 h-14 bg-stone-900 flex items-center justify-center text-white group-hover:bg-red-600 transition-all duration-500 shadow-2xl">
        {icon}
      </div>
      <div>
        <h4 className="text-[13px] font-black text-stone-900 uppercase tracking-widest">
          {title}
        </h4>
        <p className="text-[10px] font-bold text-stone-400 uppercase mt-1 tracking-tighter">
          {desc}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3 text-stone-300 group-hover:text-stone-900 transition-colors">
      <span className="text-[9px] font-black uppercase tracking-[0.4em]">
        {action}
      </span>
      <ArrowUpRight size={16} />
    </div>
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
  </div>
);

const SectionLabel = ({ label }) => (
  <div className="flex items-center gap-4 mb-8">
    <Minus size={14} className="text-red-600" />
    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-900">
      {label}
    </span>
  </div>
);

export default UserSupport;
