import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Lock,
  Bell,
  ShieldCheck,
  RefreshCw,
  Globe,
  ExternalLink,
  CreditCard,
  Minus,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../../../../components/shared/Loader';

const SellerSettingsView = () => {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const [formData, setFormData] = useState({
    shopName: '',
    name: '',
    email: '',
    phone: '',
    description: '',
    address: '',
    district: '',
    logo: '',
    bankAccount: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        shopName: user.shopName || '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        description: user.description || '',
        address: user.address?.detailAddress || '',
        district: user.address?.district || '',
        logo: user.photoURL || user.image || '',
        bankAccount: '',
      });
    }
  }, [user]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      // রিয়েল এপিআই কল
      const { data } = await axios.put(
        `${API_URL}/users/profile`,
        {
          ...formData,
          address: {
            detailAddress: formData.address,
            district: formData.district,
          },
        },
        { withCredentials: true }
      );

      setUser(data);
      toast.success('Atelier Manifest Synchronized');
    } catch (err) {
      toast.error('Protocol update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loader fullScreen />;

  return (
    <div className="max-w-[1440px] mx-auto space-y-16 pb-32 font-sans selection:bg-red-50 selection:text-red-600 px-6">
      {/* ১. এডিটোরিয়াল হেডার */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12 mt-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Curator Configuration
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Shop <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — settings.
            </span>
          </h2>
        </div>

        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="group relative flex items-center gap-4 bg-stone-900 text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all duration-500 shadow-2xl"
        >
          {loading ? (
            <RefreshCw className="animate-spin" size={14} />
          ) : (
            <Save size={14} />
          )}
          <span>{loading ? 'SYNCING...' : 'COMMIT CHANGES'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* ২. লেফট প্যানেল (Identity & Logistics) */}
        <div className="lg:col-span-8 space-y-16">
          {/* প্রোফাইল ভিজ্যুয়াল */}
          <section className="flex flex-col md:flex-row items-center gap-12 p-10 bg-[#FBFBFB] border border-stone-50 group">
            <div className="relative">
              <div className="w-40 h-40 bg-stone-900 overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center">
                {formData.logo ? (
                  <img
                    src={formData.logo}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    alt=""
                  />
                ) : (
                  <Store size={48} className="text-stone-700" />
                )}
              </div>
              <label className="absolute -bottom-4 -right-4 bg-red-600 text-white p-4 cursor-pointer hover:bg-stone-900 shadow-2xl transition-all">
                <Camera size={18} />
                <input type="file" className="hidden" />
              </label>
            </div>
            <div className="space-y-4 flex-1 text-center md:text-left">
              <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em]">
                Archive Member
              </p>
              <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tighter leading-none">
                {formData.shopName || 'UNNAMED ATELIER'}
              </h3>
              <p className="text-[11px] font-bold text-stone-300 uppercase tracking-widest leading-none">
                Reference: #{user?._id.slice(-8).toUpperCase()}
              </p>
            </div>
          </section>

          {/* ইনপুট গ্রিড */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <HumanistInput
              label="Atelier Nomenclature"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
            />
            <HumanistInput
              label="Curator Identity"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <div className="md:col-span-2">
              <HumanistInput
                label="Shop Narrative Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <HumanistInput
              label="Official Manifest (Email)"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
            <HumanistInput
              label="Communication Line"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <div className="md:col-span-2">
              <HumanistInput
                label="Physical Archival Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ৩. রাইট প্যানেল (Financials & Security) */}
        <div className="lg:col-span-4 space-y-12">
          <div className="bg-stone-900 p-10 text-white space-y-10 shadow-2xl">
            <div className="flex items-center gap-3">
              <Minus size={14} className="text-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Payout Protocol
              </span>
            </div>
            <div className="space-y-8">
              <select
                name="bankAccount"
                className="w-full bg-stone-800 border-none p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-red-600"
              >
                <option value="bkash">bKash Settlement</option>
                <option value="nagad">Nagad Settlement</option>
                <option value="bank">Bank Wire Transfer</option>
              </select>
              <input
                type="text"
                placeholder="ACCOUNT IDENTIFIER"
                className="w-full bg-transparent border-b border-stone-700 pb-3 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-red-600 transition-all"
              />
            </div>
          </div>

          <div className="p-10 border border-stone-100 space-y-8">
            <div className="flex items-center gap-3">
              <Minus size={14} className="text-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-900">
                Security Cipher
              </span>
            </div>
            <button className="w-full py-4 border border-stone-900 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-stone-900 hover:text-white transition-all duration-500 flex items-center justify-center gap-3">
              <Lock size={14} /> Update Credentials
            </button>
          </div>

          <div className="p-10 bg-red-50/50 border border-red-100 flex flex-col items-center gap-6 text-center">
            <ShieldCheck size={32} className="text-red-600" strokeWidth={1} />
            <p className="text-[9px] font-bold text-red-700 uppercase tracking-widest leading-loose">
              Your security manifest is active. Multi-factor authentication is
              recommended for high-volume curators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Humanist UI Reusable Components ---
const HumanistInput = ({ label, ...props }) => (
  <div className="space-y-4 group">
    <label className="text-[9px] font-black text-stone-400 uppercase tracking-[0.4em] group-focus-within:text-red-600 transition-colors">
      {label} —
    </label>
    <input
      {...props}
      className="w-full bg-transparent border-b border-stone-100 py-3 text-[13px] font-bold text-stone-900 placeholder:text-stone-200 focus:outline-none focus:border-red-600 transition-all duration-700 uppercase tracking-widest disabled:opacity-30"
    />
  </div>
);

export default SellerSettingsView;
