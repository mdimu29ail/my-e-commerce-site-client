import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Upload,
  X,
  RefreshCw,
  Minus,
  Palette,
  Ruler,
  Zap,
  Weight,
  Maximize,
  Database,
  Sparkles,
  Plus,
  ShieldCheck,
  Layers,
  Package,
  CreditCard,
  Eye,
  Send,
  Cpu,
  HardDrive,
  Smartphone,
  Headphones,
  Watch,
  Home,
  Refrigerator,
  Calendar,
  Hash,
  Globe,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const SellerAddProductView = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadIndex, setUploadIndex] = useState(null);
  const [showAiGuide, setShowAiGuide] = useState(false);
  const [hexInput, setHexInput] = useState('');

  const [formData, setFormData] = useState({
    nameEn: '',
    nameBn: '',
    descriptionEn: '',
    descriptionBn: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    brand: '',
    images: ['', '', ''],
    // Archive Specifics
    colors: [],
    sizes: [],
    fabricGsm: '',
    pattern: '',
    fitType: '',
    collarType: '',
    sleeveLength: '',
    occasion: '',
    careGuide: '',
    material: '',
    dimensions: '',
    weight: '',
    assemblyInfo: '',
    spacePlacement: '',
    finishAesthetic: '',
    weightCapacity: '',
    displaySize: '',
    displayPanel: '',
    brightness: '',
    sensors: '',
    batteryLife: '',
    ipRating: '',
    strapType: '',
    driverSize: '',
    soundProfile: '',
    ancDepth: '',
    playtime: '',
    latency: '',
    ergonomics: '',
    processor: '',
    gpu: '',
    ram: '',
    storage: '',
    resolution: '',
    refreshRate: '',
    batteryWh: '',
    ports: '',
    buildMaterial: '',
    cameraSpecs: '',
    chipset: '',
    osUi: '',
    chargingWattage: '',
    virtualRam: '',
    ingredients: '',
    origin: '',
    netQuantity: '',
    purity: '',
    expiryDate: '',
    storageType: 'Room Temp',
    tastePairing: '',
    metaTitle: '',
    metaDescription: '',
    status: 'published',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const activeCategoryType = useMemo(() => {
    const selected = categories.find(c => c._id === formData.category);
    if (!selected) return 'GENERAL';
    const name = (selected.nameEn || '').toLowerCase();
    if (name.includes('fashion')) return 'FASHION';
    if (name.includes('home')) return 'HOME';
    if (name.includes('watch') || name.includes('wearable')) return 'WEARABLES';
    if (name.includes('audio') || name.includes('headphone')) return 'AUDIO';
    if (name.includes('laptop') || name.includes('computer'))
      return 'COMPUTING';
    if (name.includes('phone') || name.includes('mobile')) return 'MOBILE';
    if (name.includes('food')) return 'FOODS';
    return 'GENERAL';
  }, [formData.category, categories]);

  const aiCheatSheet = {
    FASHION: `Fashion Curator Protocol: Use words like 'Silhouette', 'Artisanal'. Narrative for "${formData.nameEn}".`,
    COMPUTING: `Tech Manifest: Focus on 'Architecture', 'Performance'. Narrative for "${formData.nameEn}".`,
    GENERAL: `Editorial Listing: Write a high-converting story for "${formData.nameEn}".`,
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/categories`);
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (err) {
        toast.error('Archive sync failed.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [API_URL]);

  const handleSlotUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file || !IMGBB_KEY) return;
    setUploadIndex(index);
    const body = new FormData();
    body.append('image', file);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        body
      );
      const newImages = [...formData.images];
      newImages[index] = res.data.data.url;
      setFormData({ ...formData, images: newImages });
      toast.success(`Slot 0${index + 1} Committed`);
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploadIndex(null);
    }
  };

  const addColor = () => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hexInput)) return toast.error('Invalid Hex');
    setFormData(prev => ({ ...prev, colors: [...prev.colors, hexInput] }));
    setHexInput('');
  };

  const toggleSize = s => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(s)
        ? prev.sizes.filter(x => x !== s)
        : [...prev.sizes, s],
    }));
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.images[0])
      return toast.error('Primary Visual Manifest Required');
    setFormLoading(true);
    try {
      const finalImages = formData.images.filter(img => img !== '');
      await axios.post(
        `${API_URL}/products`,
        { ...formData, images: finalImages },
        { withCredentials: true }
      );
      toast.success('Piece Ingested to Archive');
      navigate('/seller/inventory');
    } catch (err) {
      toast.error('Ingestion failed');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto space-y-24 pb-40 font-sans selection:bg-red-50 selection:text-red-600 px-6 md:px-12">
      {/* 1. EDITORIAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-16 mt-20">
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-16 bg-red-600" />
            <span className="text-[11px] font-black uppercase tracking-[0.6em]">
              Artifact Ingestion
            </span>
          </div>
          <h2 className="text-5xl md:text-8xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            New <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — {activeCategoryType}.
            </span>
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShowAiGuide(true)}
          className="group flex items-center gap-4 bg-stone-900 text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-600 transition-all duration-700 shadow-2xl"
        >
          <Sparkles size={14} /> Assistance Protocol
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-20"
      >
        {/* LEFT PANEL: NARRATIVE & DYNAMIC SPECS */}
        <div className="lg:col-span-8 space-y-24">
          <section className="space-y-12">
            <SectionLabel label="01. Descriptive Narrative" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-100 border border-stone-100 shadow-2xl">
              <div className="bg-white p-12 space-y-10">
                <InputGroup
                  label="English Nomenclature"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  required
                  placeholder="INGEST TITLE..."
                />
                <TextareaGroup
                  label="English Story"
                  name="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={handleChange}
                  required
                  placeholder="WRITE THE ARCHIVAL NARRATIVE..."
                />
              </div>
              <div className="bg-white p-12 space-y-10 text-right">
                <InputGroup
                  label="আর্কাইভ নাম (BN)"
                  name="nameBn"
                  value={formData.nameBn}
                  onChange={handleChange}
                  required
                  placeholder="নাম লিখুন..."
                  bn
                />
                <TextareaGroup
                  label="বিস্তারিত কাহিনী (BN)"
                  name="descriptionBn"
                  value={formData.descriptionBn}
                  onChange={handleChange}
                  required
                  placeholder="বিস্তারিত বর্ণনা..."
                  bn
                />
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <SectionLabel
              label={`02. ${activeCategoryType} Specification Protocol`}
            />
            <div className="bg-white border border-stone-100 p-12 md:p-16">
              {activeCategoryType === 'FASHION' && (
                <div className="space-y-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <div className="space-y-8">
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.4em]">
                        Color Archive —
                      </p>
                      <div className="flex gap-4 border-b border-stone-100 pb-3">
                        <input
                          value={hexInput}
                          onChange={e => setHexInput(e.target.value)}
                          placeholder="#HEX"
                          className="flex-1 bg-transparent text-[13px] font-mono font-black uppercase outline-none"
                        />
                        <button
                          type="button"
                          onClick={addColor}
                          className="text-red-600"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {formData.colors.map((c, i) => (
                          <div
                            key={i}
                            className="w-10 h-14 border border-stone-200 relative group"
                            style={{ backgroundColor: c }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  colors: formData.colors.filter(
                                    (_, idx) => idx !== i
                                  ),
                                })
                              }
                              className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-8">
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.4em]">
                        Size Grid —
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {['S', 'M', 'L', 'XL', 'XXL', 'Free'].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleSize(s)}
                            className={`py-4 text-[10px] font-black border transition-all duration-500 ${formData.sizes.includes(s) ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-300 border-stone-100'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10 pt-16 border-t border-stone-50">
                    <InputGroup
                      label="Fabric & GSM"
                      name="fabricGsm"
                      value={formData.fabricGsm}
                      onChange={handleChange}
                    />
                    <InputGroup
                      label="Fit Type"
                      name="fitType"
                      value={formData.fitType}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {(activeCategoryType === 'COMPUTING' ||
                activeCategoryType === 'TECH' ||
                activeCategoryType === 'MOBILE') && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                  <InputGroup
                    label="Processor"
                    name="processor"
                    value={formData.processor}
                    onChange={handleChange}
                    icon={Cpu}
                  />
                  <InputGroup
                    label="RAM"
                    name="ram"
                    value={formData.ram}
                    onChange={handleChange}
                    icon={Database}
                  />
                  <InputGroup
                    label="Storage"
                    name="storage"
                    value={formData.storage}
                    onChange={handleChange}
                    icon={HardDrive}
                  />
                </div>
              )}

              {activeCategoryType === 'AUDIO' && (
                <div className="grid grid-cols-2 gap-12">
                  <InputGroup
                    label="Driver"
                    name="driverSize"
                    value={formData.driverSize}
                    onChange={handleChange}
                    icon={Headphones}
                  />
                  <InputGroup
                    label="ANC Depth"
                    name="ancDepth"
                    value={formData.ancDepth}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-stone-100">
                <InputGroup
                  label="Material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  icon={Weight}
                />
                <InputGroup
                  label="Dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  icon={Maximize}
                />
                <InputGroup
                  label="Ref ID"
                  name="modelNumber"
                  value={formData.modelNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="bg-stone-900 p-12 md:p-16 text-white space-y-10">
            <SectionLabel label="03. Search Engine Matrix" white />
            <InputGroup
              label="Meta Title"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              white
            />
            <TextareaGroup
              label="Meta Description"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              white
            />
          </section>
        </div>

        {/* RIGHT PANEL: COMMERCIALS TOP & VISUALS BOTTOM */}
        <div className="lg:col-span-4 space-y-16">
          <div className="bg-white border border-stone-100 p-10 space-y-12 shadow-2xl relative overflow-hidden group">
            <SectionLabel label="Commercials" />
            <div className="space-y-10">
              <InputGroup
                label="Retail Value (৳)"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Discount Value (৳)"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                red
              />
              <InputGroup
                label="Stock Units"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
              <div className="space-y-4">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-[0.4em]">
                  Archive Category —
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-stone-900 text-white p-5 text-[11px] font-black uppercase outline-none cursor-pointer transition-colors"
                  required
                >
                  <option value="">SELECT SEGMENT</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
          </div>

          <div className="bg-stone-50 border border-stone-100 p-10 space-y-10">
            <SectionLabel label="Visual Manifest" />
            <div className="space-y-6">
              {[0, 1, 2].map(idx => (
                <div key={idx} className="relative group">
                  <label
                    className={`aspect-video border border-dashed flex flex-col items-center justify-center transition-all duration-700 cursor-pointer overflow-hidden ${formData.images[idx] ? 'border-stone-200 bg-white' : 'border-stone-300 hover:border-red-600'}`}
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={e => handleSlotUpload(e, idx)}
                    />
                    {formData.images[idx] ? (
                      <img
                        src={formData.images[idx]}
                        className="w-full h-full object-contain p-4 transition-transform duration-1000 group-hover:scale-110"
                        alt=""
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-stone-400">
                        {uploadIndex === idx ? (
                          <RefreshCw
                            className="animate-spin text-red-600"
                            size={18}
                          />
                        ) : (
                          <Upload size={20} />
                        )}
                        <span className="text-[8px] font-black uppercase tracking-[0.5em]">
                          Slot Manifest — 0{idx + 1}
                        </span>
                      </div>
                    )}
                  </label>
                  {formData.images[idx] && (
                    <button
                      type="button"
                      onClick={() => {
                        let n = [...formData.images];
                        n[idx] = '';
                        setFormData({ ...formData, images: n });
                      }}
                      className="absolute top-4 right-4 p-2 bg-stone-900 text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full py-10 bg-stone-900 text-white text-[12px] font-black uppercase tracking-[0.8em] hover:bg-red-600 transition-all shadow-2xl flex items-center justify-center gap-6"
          >
            {formLoading ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              <>
                {' '}
                <Send size={18} /> Commit to Archive{' '}
              </>
            )}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showAiGuide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAiGuide(false)}
              className="fixed inset-0 bg-stone-900/90 backdrop-blur-xl z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white z-[101] shadow-2xl p-16 md:p-24 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-20">
                <div className="flex items-center gap-4 text-red-600">
                  <Sparkles size={24} />
                  <span className="text-[12px] font-black uppercase tracking-[0.5em]">
                    Manifesto Protocol
                  </span>
                </div>
                <button onClick={() => setShowAiGuide(false)}>
                  <X size={32} />
                </button>
              </div>
              <div className="space-y-16">
                <div className="p-12 bg-stone-50 border-l-4 border-red-600 text-stone-700 text-[14px] font-medium leading-[2.2] italic uppercase">
                  "{aiCheatSheet[activeCategoryType] || aiCheatSheet.GENERAL}"
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      aiCheatSheet[activeCategoryType]
                    );
                    toast.success('Protocol Copied');
                  }}
                  className="w-full bg-stone-900 text-white py-8 text-[11px] font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all"
                >
                  Copy Protocol
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const SectionLabel = ({ label, white = false }) => (
  <div className="flex items-center gap-5">
    <Minus size={24} className="text-red-600" />
    <h3
      className={`text-[16px] font-black uppercase tracking-[0.6em] leading-none ${white ? 'text-white' : 'text-stone-900'}`}
    >
      {label}
    </h3>
  </div>
);

const InputGroup = ({
  label,
  white = false,
  red = false,
  bn = false,
  icon: Icon,
  ...props
}) => (
  <div className="space-y-4 group">
    <label
      className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors ${white ? 'text-stone-500' : 'text-stone-400'} group-focus-within:text-red-600`}
    >
      {label} —
    </label>
    <div className="relative flex items-center">
      {Icon && <Icon size={14} className="absolute left-0 text-stone-300" />}
      <input
        {...props}
        className={`w-full bg-transparent border-b py-3 text-[13px] font-bold uppercase tracking-widest focus:outline-none transition-all duration-700
          ${white ? 'border-stone-800 text-white focus:border-red-600' : 'border-stone-100 text-stone-900 focus:border-red-600'}
          ${Icon ? 'pl-8' : ''} ${bn ? 'text-right' : ''} ${red ? 'text-red-600' : ''}`}
      />
    </div>
  </div>
);

const TextareaGroup = ({ label, white = false, bn = false, ...props }) => (
  <div className="space-y-4 group">
    <label
      className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors ${white ? 'text-stone-500' : 'text-stone-400'} group-focus-within:text-red-600`}
    >
      {label} —
    </label>
    <textarea
      {...props}
      className={`w-full bg-transparent border-b py-3 text-[12px] font-medium uppercase leading-relaxed tracking-widest focus:outline-none transition-all duration-700 resize-none no-scrollbar
       ${white ? 'border-stone-800 text-white focus:border-red-600' : 'border-stone-100 text-stone-600 focus:border-red-600'}
       ${bn ? 'text-right' : ''}`}
    />
  </div>
);

export default SellerAddProductView;
