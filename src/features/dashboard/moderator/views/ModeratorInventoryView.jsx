import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Package,
  RefreshCw,
  Minus,
  Edit3,
  Save,
  Search,
  Plus,
  X,
  Palette,
  Ruler,
  ShieldCheck,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../../../../components/shared/Loader';
import Modal from '../../../../components/shared/Modal';
import { motion, AnimatePresence } from 'framer-motion';

const ModeratorInventoryView = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // এডিট স্টেটস
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [hexInput, setHexInput] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // ক্যাটাগরি ডিটেকশন ইঞ্জিন (এডিট মোডালের জন্য)
  const activeCategoryType = useMemo(() => {
    if (!selectedProduct || !selectedProduct.category) return 'GENERAL';
    const catId = selectedProduct.category;
    const selected = categories.find(c => c._id === catId);
    if (!selected) return 'GENERAL';
    const name = (selected.nameEn || '').toLowerCase();
    if (name.includes('fashion')) return 'FASHION';
    if (name.includes('laptop') || name.includes('phone')) return 'TECH';
    if (name.includes('home')) return 'HOME';
    return 'GENERAL';
  }, [selectedProduct?.category, categories]);

  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}/products?pageSize=1000&showAll=true`,
        { withCredentials: true }
      );
      setProducts(data.products);
    } catch (err) {
      toast.error('LEDGER SYNC FAILED');
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
    setSelectedProduct({
      ...product,
      category: product.category?._id || product.category,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await axios.put(
        `${API_URL}/products/${selectedProduct._id}`,
        selectedProduct,
        { withCredentials: true }
      );
      toast.success('MANIFEST UPDATED SUCCESSFULLY');
      setIsEditModalOpen(false);
      fetchInventory();
    } catch (err) {
      toast.error('PROTOCOL OVERRIDE FAILED');
    } finally {
      setEditLoading(false);
    }
  };

  // কুইক আপডেট (Price/Stock এর জন্য টেবিলে সরাসরি)
  const quickUpdate = async (id, field, value) => {
    try {
      await axios.put(
        `${API_URL}/products/${id}`,
        { [field]: value },
        { withCredentials: true }
      );
      toast.success(`${field.toUpperCase()} SYNCED`);
    } catch (err) {
      toast.error('SYNC FAILED');
    }
  };

  const filtered = products.filter(p =>
    p.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-12 font-sans selection:bg-red-50 selection:text-red-600 pb-32">
      {/* ১. এডিটোরিয়াল হেডার */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12 mt-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Stock Ledger
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Inventory <br />
            <span className="italic font-serif text-red-600 lowercase">
              — control.
            </span>
          </h2>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search
            className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-red-600 transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="SEARCH PIECE..."
            className="w-full pl-8 py-3 bg-transparent border-b border-stone-100 text-[11px] font-black uppercase tracking-widest outline-none focus:border-red-600 transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ২. ইনভেন্টরি টেবিল */}
      <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Product Manifest</th>
                <th className="px-10 py-8">Value (৳)</th>
                <th className="px-10 py-8 text-center">Archive Stock</th>
                <th className="px-10 py-8 text-right">Commit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map((product, idx) => (
                <tr
                  key={product._id}
                  className="hover:bg-stone-50/30 transition-all group duration-500"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="relative w-14 h-18 bg-stone-50 overflow-hidden border border-stone-100 flex-shrink-0">
                        <img
                          src={product.images[0]}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          alt=""
                        />
                        <span className="absolute top-1 left-1 text-[8px] font-black text-stone-300">
                          0{idx + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-[12px] font-black text-stone-900 uppercase tracking-tighter">
                          {product.nameEn}
                        </p>
                        <p className="text-[9px] font-bold text-red-600 uppercase tracking-widest mt-1">
                          Ref: {product._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <input
                      type="number"
                      defaultValue={product.price}
                      onBlur={e =>
                        quickUpdate(product._id, 'price', e.target.value)
                      }
                      className="bg-transparent border-b border-transparent hover:border-stone-200 p-2 text-sm font-black text-stone-900 w-24 outline-none focus:border-red-600 transition-all"
                    />
                  </td>
                  <td className="px-10 py-8 text-center">
                    <input
                      type="number"
                      defaultValue={product.stock}
                      onBlur={e =>
                        quickUpdate(product._id, 'stock', e.target.value)
                      }
                      className={`p-2 text-center text-sm font-black w-20 outline-none border-b border-transparent hover:border-stone-200 transition-all ${product.stock < 10 ? 'text-red-600' : 'text-stone-900'}`}
                    />
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-3 border border-stone-100 hover:bg-stone-900 hover:text-white transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => toast.info('ARCHIVE PERSISTED')}
                        className="p-3 border border-stone-100 hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ৩. এডিট মোডাল (Luxury Strategy) --- */}
      {selectedProduct && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="MANIFEST OVERRIDE — EDITOR"
          size="xl"
        >
          <form onSubmit={handleUpdate} className="space-y-12 py-6 font-sans">
            {/* কমার্শিয়াল প্রোটোকল */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-10 bg-white border border-stone-100">
              <EditorialInput
                label="Value (৳)"
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
                label="Stock Ingress"
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
              <div className="space-y-3 group">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest group-focus-within:text-red-600">
                  Category Manifest —
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

            {/* নেরেটিভ (EN/BN) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-100 border border-stone-100">
              <div className="bg-white p-10 space-y-8">
                <SectionLabel label="Narrative Fragment (EN)" />
                <EditorialInput
                  label="Article Title"
                  value={selectedProduct.nameEn}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      nameEn: e.target.value,
                    })
                  }
                />
                <EditorialTextarea
                  label="Archive Description"
                  value={selectedProduct.descriptionEn}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      descriptionEn: e.target.value,
                    })
                  }
                />
              </div>
              <div className="bg-white p-10 space-y-8 border-l border-stone-50 text-right">
                <SectionLabel label="আর্কাইভ বিবরণ (BN)" bn />
                <EditorialInput
                  label="পণ্যের নাম"
                  value={selectedProduct.nameBn}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      nameBn: e.target.value,
                    })
                  }
                  textRight
                />
                <EditorialTextarea
                  label="বিস্তারিত তথ্য"
                  value={selectedProduct.descriptionBn}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      descriptionBn: e.target.value,
                    })
                  }
                  textRight
                />
              </div>
            </div>

            {/* ডাইনামিক ক্যাটাগরি ম্যাট্রিক্স */}
            <div className="p-10 bg-stone-50/50 border border-stone-100 space-y-12">
              <SectionLabel
                label={`${activeCategoryType} SPECIFICATION PROTOCOL —`}
              />

              {activeCategoryType === 'FASHION' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <EditorialInput
                    label="Fabric Composition"
                    value={selectedProduct.fabricGsm}
                    onChange={e =>
                      setSelectedProduct({
                        ...selectedProduct,
                        fabricGsm: e.target.value,
                      })
                    }
                  />
                  <EditorialInput
                    label="Silhouette Fit"
                    value={selectedProduct.fitType}
                    onChange={e =>
                      setSelectedProduct({
                        ...selectedProduct,
                        fitType: e.target.value,
                      })
                    }
                  />
                  <EditorialInput
                    label="Aesthetic Pattern"
                    value={selectedProduct.pattern}
                    onChange={e =>
                      setSelectedProduct({
                        ...selectedProduct,
                        pattern: e.target.value,
                      })
                    }
                  />
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
                  label="Reference SKU"
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
    </div>
  );
};

// --- Humanist UI Reusable Components ---

const SectionLabel = ({ label, bn = false }) => (
  <div className={`flex items-center gap-3 ${bn ? 'justify-end' : ''}`}>
    {!bn && <Minus size={14} className="text-red-600" />}
    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-900">
      {label}
    </span>
    {bn && <Minus size={14} className="text-red-600" />}
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
      className={`w-full bg-transparent border-b border-stone-100 py-3 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-red-600 transition-all duration-700 ${textRight ? 'text-right' : ''} ${red ? 'text-red-600' : 'text-stone-900'}`}
    />
  </div>
);

const EditorialTextarea = ({ label, textRight = false, ...props }) => (
  <div className="space-y-4 group">
    <label
      className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors text-stone-400 group-focus-within:text-red-600 ${textRight ? 'text-right' : ''}`}
    >
      {label} —
    </label>
    <textarea
      {...props}
      className={`w-full bg-transparent border-b border-stone-100 py-3 text-[12px] font-medium uppercase leading-relaxed tracking-widest focus:outline-none focus:border-red-600 transition-all duration-700 resize-none no-scrollbar ${textRight ? 'text-right' : ''}`}
    />
  </div>
);

export default ModeratorInventoryView;
