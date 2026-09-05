import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  Globe,
  ShieldLock,
  Truck,
  CreditCard,
  Save,
  Bot,
  Store,
  RefreshCw,
  BadgePercent,
  AlertTriangle,
  UserPlus,
  Clock,
  Mail,
  Phone,
  ExternalLink,
  HardDrive,
  Minus,
  Hash,
  Activity,
  Lock,
} from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Loader from '../../../../components/shared/Loader';

const AdminSettingsView = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(true);

  // OmerShop360 Core Settings Protocol
  const [settings, setSettings] = useState({
    storeName: 'OmerShop360 Atelier',
    supportEmail: 'intelligence@omershop360.com',
    supportPhone: '+880 1700 000 000',
    maintenanceMode: false,
    defaultLanguage: 'en',
    vatPercentage: 5,
    shippingInsideDhaka: 80,
    shippingOutsideDhaka: 150,
    freeShippingThreshold: 5000,
    lowStockThreshold: 10,
    autoCancelOrdersHours: 24,
    allowSellerRegistration: true,
    bkashEnabled: true,
    nagadEnabled: true,
    aiRecommendationEnabled: true,
    facebookLink: 'https://facebook.com/omershop360',
    instagramLink: 'https://instagram.com/omershop360',
  });

  useEffect(() => {
    // Simulate Initial Core Sync
    setTimeout(() => setSyncing(false), 1200);
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('CORE CONFIGURATION SYNCHRONIZED', {
        icon: <ShieldLock className="text-red-600" />,
      });
    } catch (error) {
      toast.error('SYNC PROTOCOL FAILED');
    } finally {
      setLoading(false);
    }
  };

  if (syncing)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-16 font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* 1. EDITORIAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              System Configuration
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Global <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — settings.
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-4">
          <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">
            Engine Status: Operational
          </p>
          <button
            onClick={handleSave}
            disabled={loading}
            className="group relative flex items-center gap-4 bg-stone-900 text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all duration-500 shadow-2xl overflow-hidden"
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={14} />
            ) : (
              <Save
                size={14}
                className="group-hover:scale-110 transition-transform"
              />
            )}
            <span>{loading ? 'SYNCHRONIZING...' : 'COMMIT CHANGES'}</span>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-white/20 group-hover:w-full transition-all duration-1000" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 2. CORE BUSINESS MATRIX (Left) */}
        <div className="lg:col-span-7 space-y-12">
          <div className="bg-white border border-stone-100 p-10 space-y-10 relative overflow-hidden group">
            <SectionLabel label="Core Identity —" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <InputGroup
                label="Atelier Nomenclature"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
              />
              <InputGroup
                label="Fiscal Tax (VAT %)"
                name="vatPercentage"
                value={settings.vatPercentage}
                type="number"
                icon={BadgePercent}
              />
              <div className="md:col-span-2">
                <InputGroup
                  label="Intelligence Support Email"
                  name="supportEmail"
                  value={settings.supportEmail}
                  onChange={handleChange}
                  icon={Mail}
                />
              </div>
            </div>

            {/* Maintenance Toggle - Brutalist Style */}
            <div
              className={`mt-12 p-8 border transition-all duration-700 ${settings.maintenanceMode ? 'border-red-600 bg-red-50/10' : 'border-stone-100 bg-stone-50/30'}`}
            >
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest ${settings.maintenanceMode ? 'text-red-600' : 'text-stone-900'}`}
                  >
                    Emergency Maintenance
                  </p>
                  <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                    Blocks all global customer ingress
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-stone-200 peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-6 peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-none after:h-4 after:w-4 after:transition-all transition-colors duration-500"></div>
                </label>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
          </div>

          {/* 3. LOGISTICS ARCHIVE */}
          <div className="bg-white border border-stone-100 p-10 space-y-10 group relative">
            <SectionLabel label="Logistics Protocol —" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <InputGroup
                label="Dhaka Ingress (৳)"
                name="shippingInsideDhaka"
                value={settings.shippingInsideDhaka}
                type="number"
              />
              <InputGroup
                label="Global Dispatch (৳)"
                name="shippingOutsideDhaka"
                value={settings.shippingOutsideDhaka}
                type="number"
              />
              <InputGroup
                label="Low Stock Ingress"
                name="lowStockThreshold"
                value={settings.lowStockThreshold}
                type="number"
                icon={Activity}
              />
              <InputGroup
                label="Auto-Termination (Hrs)"
                name="autoCancelOrdersHours"
                value={settings.autoCancelOrdersHours}
                type="number"
                icon={Clock}
              />
            </div>
            <div className="mt-10 pt-10 border-t border-stone-50 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">
                Allow Merchant Ingress
              </span>
              <input
                type="checkbox"
                name="allowSellerRegistration"
                checked={settings.allowSellerRegistration}
                onChange={handleChange}
                className="w-4 h-4 accent-red-600"
              />
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
          </div>
        </div>

        {/* 4. INTEGRATIONS & GATEWAYS (Right) */}
        <div className="lg:col-span-5 space-y-12">
          {/* Payment Matrix */}
          <div className="bg-stone-900 p-10 text-white space-y-10 shadow-2xl relative overflow-hidden group">
            <CreditCard
              className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000"
              size={120}
            />
            <SectionLabel label="Capital Matrix —" white />
            <div className="space-y-6 relative z-10">
              {[
                { id: 'bkashEnabled', label: 'bKash Protocol', code: 'BK-360' },
                { id: 'nagadEnabled', label: 'Nagad Protocol', code: 'NG-360' },
                {
                  id: 'aiRecommendationEnabled',
                  label: 'Neural AI Engine',
                  code: 'AI-CORE',
                },
              ].map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between group/item"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${settings[item.id] ? 'bg-red-600 animate-pulse' : 'bg-stone-700'}`}
                    />
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest">
                        {item.label}
                      </p>
                      <p className="text-[8px] font-mono text-stone-500 uppercase">
                        {item.code}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name={item.id}
                      checked={settings[item.id]}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-stone-800 border border-stone-700 peer-focus:outline-none rounded-none peer peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-400 after:rounded-none after:h-4 after:w-4 after:transition-all transition-all duration-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Social Ingress */}
          <div className="bg-white border border-stone-100 p-10 space-y-8 group relative">
            <SectionLabel label="Social Influx —" />
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <FaFacebook className="text-stone-300" size={18} />
                <input
                  type="text"
                  name="facebookLink"
                  value={settings.facebookLink}
                  onChange={handleChange}
                  className="flex-1 bg-transparent border-b border-stone-100 pb-2 text-[10px] font-mono text-stone-600 focus:border-red-600 outline-none"
                />
              </div>
              <div className="flex items-center gap-6">
                <FaInstagram className="text-stone-300" size={18} />
                <input
                  type="text"
                  name="instagramLink"
                  value={settings.instagramLink}
                  onChange={handleChange}
                  className="flex-1 bg-transparent border-b border-stone-100 pb-2 text-[10px] font-mono text-stone-600 focus:border-red-600 outline-none"
                />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
          </div>

          {/* Security Vault */}
          <div className="p-10 bg-stone-50 border border-stone-100 space-y-6 group">
            <div className="flex items-center gap-3">
              <Lock size={14} className="text-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-900">
                Security Vault
              </span>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white border border-stone-100 flex items-center justify-between group-hover:border-stone-900 transition-colors">
                <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest italic">
                  SSLCommerz Key
                </span>
                <span className="text-[10px] font-mono text-stone-900 tracking-widest">
                  ••••••••••••
                </span>
              </div>
              <div className="p-4 bg-white border border-stone-100 flex items-center justify-between group-hover:border-stone-900 transition-colors">
                <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest italic">
                  Firebase Secret
                </span>
                <span className="text-[10px] font-mono text-stone-900 tracking-widest">
                  ••••••••••••
                </span>
              </div>
            </div>
            <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest leading-loose">
              Sensitive keys are strictly pulled from{' '}
              <span className="text-red-600">.env</span> archives and cannot be
              modified via UI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components (Signature Protocol) ---

const SectionLabel = ({ label, white = false }) => (
  <div className="flex items-center gap-3">
    <Minus size={14} className="text-red-600" />
    <span
      className={`text-[10px] font-black uppercase tracking-[0.4em] ${white ? 'text-stone-300' : 'text-stone-900'}`}
    >
      {label}
    </span>
  </div>
);

const InputGroup = ({
  label,
  value,
  onChange,
  name,
  type = 'text',
  icon: Icon,
}) => (
  <div className="space-y-3 relative group/input">
    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          size={14}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within/input:text-red-600 transition-colors"
        />
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full bg-transparent border-b border-stone-200 pb-3 text-[12px] font-black uppercase tracking-widest text-stone-900 focus:outline-none focus:border-red-600 transition-all ${Icon ? 'pl-8' : ''}`}
      />
    </div>
  </div>
);

export default AdminSettingsView;
