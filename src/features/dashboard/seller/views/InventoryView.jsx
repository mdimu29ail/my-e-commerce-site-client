import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Package,
  Search,
  Trash2,
  Layers,
  RefreshCw,
  Edit3,
  Save,
  X,
  Plus,
  Minus,
  Palette,
  Ruler,
  ShieldAlert,
  ShieldCheck,
  ArrowUpRight,
  Upload,
  Image as ImageIcon,
  Database,
  Maximize,
  Weight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../context/AuthContext';
import { uploadImageToImgBB } from '../../../../utils/uploadImage';
import Loader from '../../../../components/shared/Loader';
import Modal from '../../../../components/shared/Modal';
import { motion, AnimatePresence } from 'framer-motion';

const SellerInventoryView = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadIndex, setUploadIndex] = useState(null);
  const [hexInput, setHexInput] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  // ক্যাটাগরি ডিটেকশন ইঞ্জিন
  const activeCategoryType = useMemo(() => {
    if (!selectedProduct || !selectedProduct.category) return 'GENERAL';
    const catId = selectedProduct.category;
    const selected = categories.find(c => c._id === catId);
    if (!selected) return 'GENERAL';
    const name = (selected.nameEn || '').toLowerCase();
    if (name.includes('fashion')) return 'FASHION';
    if (name.includes('home')) return 'HOME';
    if (
      name.includes('laptop') ||
      name.includes('phone') ||
      name.includes('computer')
    )
      return 'TECH';
    if (name.includes('food')) return 'FOODS';
    return 'GENERAL';
  }, [selectedProduct?.category, categories]);

  useEffect(() => {
    fetchSellerInventory();
    fetchCategories();
  }, [user]);

  const fetchSellerInventory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/products?pageSize=1000`, {
        withCredentials: true,
      });
      const myProducts = data.products.filter(
        p => (p.seller?._id || p.seller)?.toString() === user?._id?.toString()
      );
      setProducts(myProducts);
    } catch (err) {
      toast.error('Archive sync failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/categories`);
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = product => {
    const images = [...product.images, '', '', ''].slice(0, 3);
    setSelectedProduct({
      ...product,
      category: product.category?._id || product.category,
      images: images,
    });
    setIsEditModalOpen(true);
  };

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
      const newImages = [...selectedProduct.images];
      newImages[index] = res.data.data.url;
      setSelectedProduct({ ...selectedProduct, images: newImages });
      toast.success(`Visual manifest slot ${index + 1} updated`);
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploadIndex(null);
    }
  };

  // --- ফিক্সড: addColor ফাংশন যোগ করা হয়েছে ---
  const addColor = () => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hexInput)) return toast.error('Invalid Hex Protocol');
    const currentColors = selectedProduct.colors || [];
    if (currentColors.includes(hexInput))
      return toast.warn('Color already in Manifest');

    setSelectedProduct({
      ...selectedProduct,
      colors: [...currentColors, hexInput],
    });
    setHexInput('');
  };

  const toggleSize = size => {
    const currentSizes = selectedProduct.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    setSelectedProduct({ ...selectedProduct, sizes: newSizes });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const finalData = {
        ...selectedProduct,
        images: selectedProduct.images.filter(img => img !== ''),
      };
      await axios.put(`${API_URL}/products/${selectedProduct._id}`, finalData, {
        withCredentials: true,
      });
      toast.success('Inventory Protocol Updated');
      setIsEditModalOpen(false);
      fetchSellerInventory();
    } catch (err) {
      toast.error('Protocol override failed');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_URL}/products/${selectedProduct._id}`, {
        withCredentials: true,
      });
      toast.success('Piece purged from archive');
      setIsDeleteModalOpen(false);
      fetchSellerInventory();
    } catch (err) {
      toast.error('Erasure failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nameEn
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'All' || p.category?._id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-12 font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* ১. এডিটোরিয়াল হেডার */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12 mt-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Inventory Control
            </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Store <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — archives.
            </span>
          </h2>
        </div>
        <button
          onClick={fetchSellerInventory}
          className="flex items-center gap-4 border border-stone-200 px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync
          Store
        </button>
      </div>

      {/* ২. ফিল্টার গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/10">
        <div className="md:col-span-8 bg-white p-6 flex items-center gap-6">
          <Search size={18} className="text-stone-300" />
          <input
            type="text"
            placeholder="SEARCH PIECE IDENTITY..."
            className="flex-1 text-[11px] font-black uppercase tracking-widest outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:col-span-4 bg-white p-6 flex items-center gap-6 border-l border-stone-100">
          <Layers size={18} className="text-stone-300" />
          <select
            className="flex-1 text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ৩. ইনভেন্টরি টেবিল */}
      <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Archive Piece</th>
                <th className="px-10 py-8 text-center">In Stock</th>
                <th className="px-10 py-8 text-center">Value</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className="hover:bg-stone-50/30 transition-all group"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-6">
                      <img
                        src={product.images[0]}
                        className="w-16 h-20 object-cover border border-stone-100 shadow-sm"
                        alt=""
                      />
                      <div>
                        <p className="text-sm font-black text-stone-900 uppercase tracking-tighter">
                          {product.nameEn}
                        </p>
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest mt-1 block">
                          — {product.category?.nameEn}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${product.stock < 5 ? 'text-red-600' : 'text-stone-400'}`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center text-[12px] font-black text-stone-900 tracking-tighter">
                    ৳{product.price.toLocaleString()}
                  </td>
                  <td className="px-10 py-8 text-right space-x-3">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-3 border border-stone-100 hover:bg-stone-900 hover:text-white transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-3 border border-stone-100 hover:bg-red-600 hover:text-white transition-all"
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

      {/* ৪. এডিট মোডাল */}
      {selectedProduct && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`PROTOCOL OVERRIDE — ${activeCategoryType}`}
          size="xl"
        >
          <form onSubmit={handleUpdate} className="space-y-12 py-6 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-10 bg-white border border-stone-100">
              <EditorialInput
                label="Archive Value (৳)"
                type="number"
                value={selectedProduct.price}
                onChange={e =>
                  setSelectedProduct({
                    ...selectedProduct,
                    price: e.target.value,
                  })
                }
                required
              />
              <EditorialInput
                label="Inventory Units"
                type="number"
                value={selectedProduct.stock}
                onChange={e =>
                  setSelectedProduct({
                    ...selectedProduct,
                    stock: e.target.value,
                  })
                }
                required
              />
              <div className="space-y-3">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                  Curation Segment —
                </label>
                <select
                  className="w-full bg-stone-900 text-white p-4 text-[10px] font-black uppercase outline-none"
                  value={selectedProduct.category}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      category: e.target.value,
                    })
                  }
                >
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ইমেজ স্লটস */}
            <div className="p-10 border border-stone-100 space-y-10">
              <SectionLabel label="Visual Manifest Override" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map(idx => (
                  <div key={idx} className="relative group">
                    <label
                      className={`aspect-video border border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${selectedProduct.images[idx] ? 'border-stone-100 bg-stone-50' : 'border-stone-200 hover:border-red-600'}`}
                    >
                      <input
                        type="file"
                        className="hidden"
                        onChange={e => handleSlotUpload(e, idx)}
                      />
                      {selectedProduct.images[idx] ? (
                        <img
                          src={selectedProduct.images[idx]}
                          className="w-full h-full object-contain p-2"
                          alt=""
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          {uploadIndex === idx ? (
                            <RefreshCw
                              className="animate-spin text-red-600"
                              size={16}
                            />
                          ) : (
                            <Upload size={20} className="text-stone-300" />
                          )}
                          <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">
                            Slot — 0{idx + 1}
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* ডাইনামিক ক্যাটাগরি ম্যাট্রিক্স */}
            <div className="p-10 bg-stone-50/50 border border-stone-100 space-y-12">
              <SectionLabel
                label={`${activeCategoryType} SPECIFICATION PROTOCOL —`}
              />

              {activeCategoryType === 'FASHION' && (
                <div className="space-y-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        <Palette size={12} /> Color Finishes
                      </label>
                      <div className="flex gap-4 border-b border-stone-100 pb-4">
                        <input
                          value={hexInput}
                          onChange={e => setHexInput(e.target.value)}
                          placeholder="#000000"
                          className="flex-1 bg-transparent text-[11px] font-black uppercase outline-none"
                        />
                        <button
                          type="button"
                          onClick={addColor}
                          className="text-red-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.colors?.map((c, i) => (
                          <div
                            key={i}
                            className="w-8 h-10 border shadow-sm"
                            style={{ backgroundColor: c }}
                            onClick={() =>
                              setSelectedProduct({
                                ...selectedProduct,
                                colors: selectedProduct.colors.filter(
                                  (_, idx) => idx !== i
                                ),
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        <Ruler size={12} /> Size Grid
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {['S', 'M', 'L', 'XL', 'XXL', 'Free'].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleSize(s)}
                            className={`py-4 text-[10px] font-black border transition-all ${selectedProduct.sizes?.includes(s) ? 'bg-stone-900 text-white shadow-2xl' : 'bg-white text-stone-300 border-stone-100'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-stone-100">
                <EditorialInput
                  label="Composition"
                  value={selectedProduct.material}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      material: e.target.value,
                    })
                  }
                />
                <EditorialInput
                  label="Dimensions"
                  value={selectedProduct.dimensions}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      dimensions: e.target.value,
                    })
                  }
                />
                <EditorialInput
                  label="Ref ID / Model"
                  value={selectedProduct.modelNumber}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      modelNumber: e.target.value,
                    })
                  }
                />
                <EditorialInput
                  label="Net Weight"
                  value={selectedProduct.weight}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      weight: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={editLoading}
              className="w-full py-10 bg-stone-900 text-white text-[12px] font-black uppercase tracking-[0.6em] hover:bg-red-600 transition-all shadow-2xl flex items-center justify-center gap-4 group"
            >
              {editLoading ? (
                <RefreshCw className="animate-spin" />
              ) : (
                <>
                  <ShieldCheck
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                  />{' '}
                  Commit Changes to Archive
                </>
              )}
            </button>
          </form>
        </Modal>
      )}

      {/* ৫. ডিলিট মোডাল */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="DECOMMISSION PROTOCOL"
      >
        <div className="text-center py-10 space-y-8 font-sans">
          <div className="w-20 h-20 bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
            <ShieldAlert size={40} />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-black text-stone-900 uppercase tracking-tighter leading-none">
              Purge Selection?
            </h3>
            <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest leading-loose">
              Terminating{' '}
              <span className="text-red-600 italic">
                "{selectedProduct?.nameEn}"
              </span>{' '}
              from global archives.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="py-4 border border-stone-100 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 hover:bg-stone-900 hover:text-white transition-all"
            >
              Abort
            </button>
            <button
              onClick={handleDelete}
              className="py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-xl"
            >
              Confirm Purge
            </button>
          </div>
        </div>
      </Modal>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

// --- Shared Editorial Helpers ---

const SectionLabel = ({ label }) => (
  <div className="flex items-center gap-3">
    <Minus size={14} className="text-red-600" />
    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-900">
      {label}
    </span>
  </div>
);

const EditorialInput = ({
  label,
  textRight = false,
  red = false,
  ...props
}) => (
  <div className="space-y-4 group">
    <label
      className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors text-stone-400 group-focus-within:text-red-600 ${textRight ? 'text-right' : ''}`}
    >
      {label} —
    </label>
    <input
      {...props}
      className={`w-full bg-transparent border-b border-stone-100 py-3 text-[13px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-600 transition-all duration-700 ${textRight ? 'text-right' : ''} ${red ? 'text-red-600' : 'text-stone-900'}`}
    />
  </div>
);

export default SellerInventoryView;
