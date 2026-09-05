import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  User,
  Lock,
  Bell,
  Shield,
  Camera,
  Minus,
  ArrowRight,
  Save,
  Trash2,
  Globe,
  Phone,
  Mail,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

const UserSettings = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
  });

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      // আপনার এপিআই কল এখানে হবে
      // await axios.put('/api/users/profile', formData);
      toast.success('Archive Identity Updated');
    } catch (err) {
      toast.error('Protocol update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 font-sans selection:bg-red-50 selection:text-red-600">
      {/* ১. এডিটোরিয়াল হেডার */}
      <header className="mb-20 space-y-6">
        <div className="flex items-center gap-4 text-red-600">
          <div className="h-[1px] w-12 bg-red-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.6em]">
            Management Protocol
          </span>
        </div>
        <h1 className="text-5xl md:text-8xl font-light text-stone-900 tracking-tighter leading-none uppercase">
          Client <br />
          <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
            — settings.
          </span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* ২. লেফট নেভিগেশন (Linear Sidebar) */}
        <aside className="lg:col-span-3 space-y-2 border-l border-stone-100 pl-8">
          <TabButton
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            label="Archive Identity"
            id="01"
          />
          <TabButton
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
            label="Security Cipher"
            id="02"
          />
          <TabButton
            active={activeTab === 'preferences'}
            onClick={() => setActiveTab('preferences')}
            label="Atelier Prefs"
            id="03"
          />
        </aside>

        {/* ৩. মেইন সেটিং ফরম (Humanist Form Layout) */}
        <main className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-16"
              >
                {/* প্রোফাইল পিকচার সেকশন */}
                <section className="flex flex-col md:flex-row gap-12 items-center border-b border-stone-100 pb-12">
                  <div className="relative group">
                    <div className="w-32 h-32 bg-stone-900 flex items-center justify-center text-white text-3xl font-serif italic shadow-2xl overflow-hidden">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          className="w-full h-full object-cover grayscale"
                          alt="avatar"
                        />
                      ) : (
                        user?.name?.charAt(0)
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-red-600 text-white shadow-xl hover:bg-stone-900 transition-colors">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-xl font-black text-stone-900 uppercase tracking-tighter">
                      Avatar Narrative
                    </h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                      Update your visual presence within the atelier.
                    </p>
                    <button className="text-[9px] font-black text-red-600 uppercase tracking-[0.3em] mt-4 border-b border-red-100 pb-1">
                      Upload New Fragment
                    </button>
                  </div>
                </section>

                {/* ফর্ম ফিল্ডস */}
                <form
                  onSubmit={handleUpdate}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12"
                >
                  <HumanistInput
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    icon={<User size={14} />}
                  />
                  <HumanistInput
                    label="Email manifest"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    icon={<Mail size={14} />}
                    disabled
                  />
                  <HumanistInput
                    label="Contact Line"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    icon={<Phone size={14} />}
                  />
                  <div className="md:col-span-2 pt-10">
                    <button
                      type="submit"
                      className="bg-stone-900 text-white px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.5em] flex items-center gap-4 hover:bg-red-600 transition-all shadow-2xl group"
                    >
                      Update Identity{' '}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-2 transition-transform"
                      />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-12"
              >
                <div className="flex items-center gap-4 text-stone-900 border-b border-stone-100 pb-6">
                  <Lock size={20} strokeWidth={1.5} />
                  <h3 className="text-xl font-black uppercase tracking-tighter">
                    Access Encryption
                  </h3>
                </div>
                <div className="max-w-xl space-y-10">
                  <HumanistInput
                    label="Current Cipher"
                    name="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleInputChange}
                  />
                  <HumanistInput
                    label="New Narrative Cipher"
                    name="newPassword"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleInputChange}
                  />
                  <button className="bg-stone-900 text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-600 transition-all">
                    Reset Access Protocol
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ৪. ডেঞ্জার জোন - ডট ছাড়া লিনিয়ার লুক */}
      <section className="mt-40 pt-20 border-t border-stone-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 opacity-40 hover:opacity-100 transition-opacity">
          <div className="space-y-2">
            <h4 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.4em]">
              Decommission Account
            </h4>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest leading-loose">
              Once an archive is purged, it cannot be restored. Proceed with
              signature care.
            </p>
          </div>
          <button className="flex items-center gap-3 text-stone-300 hover:text-red-600 transition-all font-black text-[10px] uppercase tracking-[0.4em]">
            <Trash2 size={16} /> Terminate Archive
          </button>
        </div>
      </section>
    </div>
  );
};

// --- হেল্পার কম্পোনেন্টস ---

const TabButton = ({ active, onClick, label, id }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between py-6 border-b border-stone-50 group transition-all"
  >
    <div className="flex items-center gap-6">
      <span className="text-[10px] font-serif italic text-stone-200 group-hover:text-red-600 transition-colors">
        / {id}
      </span>
      <span
        className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all ${active ? 'text-stone-900 translate-x-2' : 'text-stone-400 group-hover:text-stone-600'}`}
      >
        {label}
      </span>
    </div>
    <div
      className={`h-[1px] w-0 bg-red-600 transition-all duration-700 ${active ? 'w-8' : ''}`}
    />
  </button>
);

const HumanistInput = ({ label, icon, ...props }) => (
  <div className="space-y-4 group">
    <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] flex items-center gap-3 group-focus-within:text-red-600 transition-colors">
      {icon} {label} —
    </label>
    <input
      {...props}
      className="w-full bg-transparent border-b border-stone-100 py-3 text-[13px] font-bold text-stone-900 placeholder:text-stone-200 focus:outline-none focus:border-red-600 transition-all duration-700 uppercase tracking-widest disabled:opacity-30"
    />
  </div>
);

export default UserSettings;
