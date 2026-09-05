import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  AlertTriangle,
  X,
  Package,
  Minus,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../../../components/shared/Modal';
import Loader from '../../../../components/shared/Loader';

const AdminCategoryManagementView = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form States
  const [nameEn, setNameEn] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [image, setImage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/categories`);
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      toast.error('Archive sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!IMGBB_KEY) return toast.error('Upload key missing.');

    setUploadLoading(true);
    const body = new FormData();
    body.append('image', file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        body
      );
      setImage(res.data.data.url);
      toast.success('Visual Ingested.');
    } catch (err) {
      toast.error('Upload failed.');
    } finally {
      setUploadLoading(false);
    }
  };

  const openFormModal = (cat = null) => {
    if (cat) {
      setIsEditMode(true);
      setSelectedCategory(cat);
      setNameEn(cat.nameEn);
      setNameBn(cat.nameBn);
      setImage(cat.image || '');
    } else {
      setIsEditMode(false);
      setSelectedCategory(null);
      setNameEn('');
      setNameBn('');
      setImage('');
    }
    setIsModalOpen(true);
  };

  const openDeletePopup = cat => {
    setSelectedCategory(cat);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!image) return toast.warn('Please ingest an icon.');

    setFormLoading(true);
    try {
      const payload = { nameEn, nameBn, image };
      if (isEditMode) {
        await axios.put(
          `${API_URL}/categories/${selectedCategory._id}`,
          payload,
          { withCredentials: true }
        );
        toast.success('Matrix Updated.');
      } else {
        await axios.post(`${API_URL}/categories`, payload, {
          withCredentials: true,
        });
        toast.success('New Segment Ingested.');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Protocol failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      await axios.delete(`${API_URL}/categories/${selectedCategory._id}`, {
        withCredentials: true,
      });
      toast.success('Segment erased.');
      setIsDeleteModalOpen(false);
      fetchCategories();
    } catch (err) {
      // ব্যাকএন্ড থেকে এরর মেসেজ দেখালে সুবিধা হবে (যেমন: ক্যাটাগরিতে প্রোডাক্ট থাকলে ডিলিট হবে না)
      toast.error(err.response?.data?.message || 'Erasure failed.');
    }
  };

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-8 md:space-y-12 font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* 1. EDITORIAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-100 pb-8 md:pb-12 px-4 md:px-0">
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Taxonomy Control
            </span>
          </div>
          <h2 className="text-3xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Archive <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — segments.
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchCategories}
            className="p-3 md:p-4 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => openFormModal()}
            className="bg-stone-900 text-white px-6 md:px-8 py-3 md:py-4 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 hover:bg-red-600 transition-all shadow-2xl"
          >
            <Plus size={16} />{' '}
            <span className="hidden md:block">Ingest Segment</span>{' '}
            <span className="md:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* 2. CATEGORY LEDGER TABLE */}
      <div className="bg-white border-y md:border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px] md:min-w-full">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-6 md:px-10 py-6 md:py-8">Icon</th>
                <th className="px-6 md:px-10 py-6 md:py-8">Identity (EN)</th>
                <th className="px-6 md:px-10 py-6 md:py-8 text-right">
                  আর্কাইভ নাম
                </th>
                <th className="px-6 md:px-10 py-6 md:py-8 text-center">
                  Items
                </th>
                <th className="px-6 md:px-10 py-6 md:py-8 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {categories.map(cat => (
                <tr
                  key={cat._id}
                  className="hover:bg-stone-50/30 transition-all group"
                >
                  <td className="px-6 md:px-10 py-4 md:py-8">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-stone-100 border border-stone-100 overflow-hidden flex items-center justify-center">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <ImageIcon size={20} className="text-stone-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-4 md:py-8">
                    <span className="text-[12px] font-black text-stone-900 uppercase tracking-tighter">
                      {cat.nameEn}
                    </span>
                  </td>
                  <td className="px-6 md:px-10 py-4 md:py-8 text-right font-serif italic text-stone-600 text-sm">
                    {cat.nameBn}
                  </td>
                  <td className="px-6 md:px-10 py-4 md:py-8 text-center">
                    <div className="inline-flex items-center gap-2 text-stone-400 text-[10px] font-black uppercase tracking-widest border border-stone-100 px-3 py-1">
                      <Package size={10} className="text-red-600" />{' '}
                      {cat.productCount || 0}
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-4 md:py-8 text-right">
                    {/* ফিক্সড: মোবাইলে আইকন সব সময় দেখা যাবে, ডেক্সটপে হোভারে আসবে */}
                    <div className="flex items-center justify-end space-x-2 md:space-x-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => openFormModal(cat)}
                        className="p-2 md:p-3 bg-white border border-stone-100 text-stone-400 hover:text-stone-900 transition-all shadow-sm"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => openDeletePopup(cat)}
                        className="p-2 md:p-3 bg-white border border-stone-100 text-stone-400 hover:text-red-600 transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. INGESTION MODAL (Add/Edit) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Modify Matrix' : 'Ingest New Segment'}
      >
        <form onSubmit={handleSubmit} className="space-y-10 py-6">
          <div className="flex flex-col items-center gap-6">
            <label className="relative w-24 h-24 bg-stone-50 border border-dashed border-stone-200 cursor-pointer flex items-center justify-center overflow-hidden group">
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
              />
              {image ? (
                <img
                  src={image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-stone-300">
                  {uploadLoading ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <Upload size={20} />
                  )}
                  <span className="text-[8px] font-black uppercase tracking-widest">
                    Icon
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Plus size={16} className="text-white" />
              </div>
            </label>
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em]">
              Click to Ingest Visual
            </p>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                Narrative (EN)
              </label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-stone-200 pb-3 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-red-600"
                value={nameEn}
                onChange={e => setNameEn(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest text-right block">
                নাম (BN)
              </label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-stone-200 pb-3 text-[11px] font-black text-right focus:outline-none focus:border-red-600"
                value={nameBn}
                onChange={e => setNameBn(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={formLoading || uploadLoading}
            className="w-full py-6 bg-stone-900 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-red-600 transition-all shadow-xl"
          >
            {formLoading ? 'COMMITING...' : 'Confirm Protocol'}
          </button>
        </form>
      </Modal>

      {/* 4. DELETE CONFIRMATION */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Erasure"
      >
        <div className="text-center py-10 space-y-8">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <AlertTriangle size={40} />
          </div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-loose">
            Erasing segment "{selectedCategory?.nameEn}" will affect its
            dependencies.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-10">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="py-4 border border-stone-200 text-stone-400 font-black text-[10px] uppercase tracking-widest"
            >
              Abort
            </button>
            <button
              onClick={confirmDelete}
              className="py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl"
            >
              Yes, Erase
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCategoryManagementView;
