// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import {
//   Package,
//   Search,
//   Trash2,
//   Layers,
//   RefreshCw,
//   Edit3,
//   Save,
//   X,
//   Mail,
//   Sparkles,
//   Minus,
//   Palette,
//   Ruler,
//   Calendar,
//   Refrigerator,
//   Zap,
//   Weight,
//   Maximize,
//   Database,
//   ShieldAlert,
//   Plus,
//   Smartphone,
//   Cpu,
// } from 'lucide-react';
// import { toast } from 'react-toastify';
// import Loader from '../../../../components/shared/Loader';
// import Modal from '../../../../components/shared/Modal';

// const AdminInventoryView = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('All');
//   const [categories, setCategories] = useState([]);

//   // Modal States
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [editLoading, setEditLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [hexInput, setHexInput] = useState('');

//   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

//   // ক্যাটাগরি ডিটেকশন ইঞ্জিন (এডিট মোডালের জন্য)
//   const activeCategoryType = useMemo(() => {
//     if (!selectedProduct || !selectedProduct.category) return 'GENERAL';
//     const catId = selectedProduct.category;
//     const selected = categories.find(c => c._id === catId);
//     if (!selected) return 'GENERAL';
//     const name = (selected.nameEn || '').toLowerCase();
//     if (name.includes('fashion') || name.includes('clothing')) return 'FASHION';
//     if (name.includes('food') || name.includes('grocery')) return 'FOODS';
//     if (name.includes('electronics') || name.includes('tech')) return 'TECH';
//     if (name.includes('mobile')) return 'MOBILE';
//     if (name.includes('home')) return 'HOME';
//     return 'GENERAL';
//   }, [selectedProduct?.category, categories]);

//   useEffect(() => {
//     fetchGlobalInventory();
//     fetchCategories();
//   }, []);

//   const fetchGlobalInventory = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(
//         `${API_URL}/products?pageSize=1000&showAll=true`,
//         { withCredentials: true }
//       );
//       setProducts(data.products);
//     } catch (err) {
//       toast.error('Archive sync failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const { data } = await axios.get(`${API_URL}/categories`);
//       setCategories(Array.isArray(data) ? data : data.categories || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const openEditModal = product => {
//     setSelectedProduct({
//       ...product,
//       category: product.category?._id || product.category,
//     });
//     setIsEditModalOpen(true);
//   };

//   const handleUpdate = async e => {
//     e.preventDefault();
//     setEditLoading(true);
//     try {
//       await axios.put(
//         `${API_URL}/products/${selectedProduct._id}`,
//         selectedProduct,
//         { withCredentials: true }
//       );
//       toast.success('Inventory Record Updated');
//       setIsEditModalOpen(false);
//       fetchGlobalInventory();
//     } catch (err) {
//       toast.error('Update protocol failed');
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await axios.delete(`${API_URL}/products/${selectedProduct._id}`, {
//         withCredentials: true,
//       });
//       toast.success('Piece erased from Archive');
//       setIsDeleteModalOpen(false);
//       fetchGlobalInventory();
//     } catch (err) {
//       toast.error('Erasure failed');
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   // --- Dynamic Option Helpers ---
//   const toggleSize = size => {
//     const currentSizes = selectedProduct.sizes || [];
//     const newSizes = currentSizes.includes(size)
//       ? currentSizes.filter(s => s !== size)
//       : [...currentSizes, size];
//     setSelectedProduct({ ...selectedProduct, sizes: newSizes });
//   };

//   const addColor = () => {
//     const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
//     if (!hexRegex.test(hexInput)) return toast.error('Invalid Hex');
//     const currentColors = selectedProduct.colors || [];
//     setSelectedProduct({
//       ...selectedProduct,
//       colors: [...currentColors, hexInput],
//     });
//     setHexInput('');
//   };

//   const filteredProducts = products.filter(p => {
//     const matchesSearch =
//       p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));
//     const matchesCategory =
//       filterCategory === 'All' || p.category?._id === filterCategory;
//     return matchesSearch && matchesCategory;
//   });

//   if (loading)
//     return (
//       <div className="h-[80vh] flex items-center justify-center">
//         <Loader />
//       </div>
//     );

//   return (
//     <div className="space-y-12 font-sans selection:bg-red-50 selection:text-red-600 pb-32">
//       {/* 1. EDITORIAL HEADER */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12">
//         <div className="space-y-6">
//           <div className="flex items-center gap-4 text-red-600">
//             <div className="h-[1px] w-12 bg-red-600" />
//             <span className="text-[10px] font-black uppercase tracking-[0.5em]">
//               Real-time Stock Control
//             </span>
//           </div>
//           <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
//             Inventory <br />
//             <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
//               — engine.
//             </span>
//           </h2>
//         </div>
//         <button
//           onClick={fetchGlobalInventory}
//           className="flex items-center gap-3 px-6 py-3 border border-stone-200 text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all"
//         >
//           <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync
//           Archive
//         </button>
//       </div>

//       {/* 2. SEARCH & FILTER MATRIX */}
//       <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/10">
//         <div className="md:col-span-8 bg-white p-6 flex items-center gap-6">
//           <Search size={18} className="text-stone-300" />
//           <input
//             type="text"
//             placeholder="SEARCH PIECE OR ARTISAN..."
//             className="flex-1 text-[11px] font-black uppercase tracking-widest outline-none"
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="md:col-span-4 bg-white p-6 flex items-center gap-6 border-l border-stone-100">
//           <Layers size={18} className="text-stone-300" />
//           <select
//             className="flex-1 text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer"
//             value={filterCategory}
//             onChange={e => setFilterCategory(e.target.value)}
//           >
//             <option value="All">All Archives</option>
//             {categories.map(cat => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.nameEn}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* 3. PRODUCT LEDGER TABLE */}
//       <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/20">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
//                 <th className="px-10 py-8">Product Narrative</th>
//                 <th className="px-10 py-8">Commercials</th>
//                 <th className="px-10 py-8 text-center">Protocol</th>
//                 <th className="px-10 py-8 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-stone-50">
//               {filteredProducts.map(product => (
//                 <tr
//                   key={product._id}
//                   className="hover:bg-stone-50/30 transition-all group"
//                 >
//                   <td className="px-10 py-8">
//                     <div className="flex items-center space-x-6">
//                       <img
//                         src={product.images[0]}
//                         className="w-16 h-20 object-cover border border-stone-100 shadow-sm"
//                         alt=""
//                       />
//                       <div className="space-y-1">
//                         <p className="text-sm font-black text-stone-900 uppercase tracking-tighter">
//                           {product.nameEn}
//                         </p>
//                         <div className="flex items-center gap-3">
//                           <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">
//                             {product.category?.nameEn}
//                           </span>
//                           <span className="text-[9px] font-bold text-stone-300 uppercase">
//                             Ref: {product._id.slice(-6)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-10 py-8">
//                     <div className="space-y-1">
//                       <p className="text-lg font-black text-stone-900 tracking-tighter">
//                         ৳{product.price.toLocaleString()}
//                       </p>
//                       <p
//                         className={`text-[10px] font-black uppercase tracking-widest ${product.stock < 5 ? 'text-red-600' : 'text-emerald-600'}`}
//                       >
//                         {product.stock} Units In Archive
//                       </p>
//                     </div>
//                   </td>
//                   <td className="px-10 py-8 text-center">
//                     <span
//                       className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border ${product.status === 'published' ? 'border-stone-900 text-stone-900' : 'border-stone-200 text-stone-300'}`}
//                     >
//                       {product.status || 'Live'}
//                     </span>
//                   </td>
//                   <td className="px-10 py-8 text-right">
//                     <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all">
//                       <button
//                         onClick={() => openEditModal(product)}
//                         className="p-3 bg-white border border-stone-100 text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all shadow-sm"
//                       >
//                         <Edit3 size={16} />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setSelectedProduct(product);
//                           setIsDeleteModalOpen(true);
//                         }}
//                         className="p-3 bg-white border border-stone-100 text-stone-400 hover:text-red-600 hover:border-red-600 transition-all shadow-sm"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* 4. ULTIMATE UPDATE MODAL */}
//       {selectedProduct && (
//         <Modal
//           isOpen={isEditModalOpen}
//           onClose={() => setIsEditModalOpen(false)}
//           title="Ingestion Management — Update Archive"
//           size="xl"
//         >
//           <form onSubmit={handleUpdate} className="space-y-12 py-6">
//             {/* A. Core Commercials */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-stone-100">
//               <InputGroup
//                 label="Archive Title (EN)"
//                 value={selectedProduct.nameEn}
//                 onChange={e =>
//                   setSelectedProduct({
//                     ...selectedProduct,
//                     nameEn: e.target.value,
//                   })
//                 }
//                 required
//               />
//               <InputGroup
//                 label="আর্কাইভ শিরোনাম (BN)"
//                 value={selectedProduct.nameBn}
//                 onChange={e =>
//                   setSelectedProduct({
//                     ...selectedProduct,
//                     nameBn: e.target.value,
//                   })
//                 }
//                 required
//               />
//               <div className="space-y-3">
//                 <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
//                   Global Category
//                 </label>
//                 <select
//                   className="w-full bg-stone-50 p-4 text-[11px] font-black uppercase outline-none"
//                   value={selectedProduct.category}
//                   onChange={e =>
//                     setSelectedProduct({
//                       ...selectedProduct,
//                       category: e.target.value,
//                     })
//                   }
//                 >
//                   {categories.map(c => (
//                     <option key={c._id} value={c._id}>
//                       {c.nameEn}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <InputGroup
//                 label="Regular Price (৳)"
//                 type="number"
//                 value={selectedProduct.price}
//                 onChange={e =>
//                   setSelectedProduct({
//                     ...selectedProduct,
//                     price: e.target.value,
//                   })
//                 }
//                 required
//               />
//               <InputGroup
//                 label="Discount Price (৳)"
//                 type="number"
//                 value={selectedProduct.discountPrice}
//                 onChange={e =>
//                   setSelectedProduct({
//                     ...selectedProduct,
//                     discountPrice: e.target.value,
//                   })
//                 }
//                 red
//               />
//               <InputGroup
//                 label="Stock Units"
//                 type="number"
//                 value={selectedProduct.stock}
//                 onChange={e =>
//                   setSelectedProduct({
//                     ...selectedProduct,
//                     stock: e.target.value,
//                   })
//                 }
//                 required
//               />
//             </div>

//             {/* B. CATEGORY DYNAMIC MATRIX */}
//             <div className="p-10 bg-stone-50/50 border border-stone-100 space-y-10">
//               <SectionLabel
//                 label={`${activeCategoryType} SPECIFICATION OVERRIDE —`}
//               />

//               {activeCategoryType === 'FASHION' && (
//                 <div className="space-y-10">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//                     {/* Color Update */}
//                     <div className="space-y-4">
//                       <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
//                         <Palette size={12} /> Color Palette
//                       </label>
//                       <div className="flex gap-2">
//                         <input
//                           type="text"
//                           placeholder="#HEX"
//                           className="flex-1 bg-white border border-stone-200 p-3 text-[11px] font-black uppercase"
//                           value={hexInput}
//                           onChange={e => setHexInput(e.target.value)}
//                         />
//                         <button
//                           type="button"
//                           onClick={addColor}
//                           className="bg-stone-900 text-white px-4"
//                         >
//                           <Plus size={14} />
//                         </button>
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedProduct.colors?.map((c, i) => (
//                           <div
//                             key={i}
//                             className="w-8 h-8 border border-white shadow-sm cursor-pointer"
//                             style={{ backgroundColor: c }}
//                             onClick={() =>
//                               setSelectedProduct({
//                                 ...selectedProduct,
//                                 colors: selectedProduct.colors.filter(
//                                   (_, idx) => idx !== i
//                                 ),
//                               })
//                             }
//                           />
//                         ))}
//                       </div>
//                     </div>
//                     {/* Size Update */}
//                     <div className="space-y-4">
//                       <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
//                         <Ruler size={12} /> Size Grid
//                       </label>
//                       <div className="flex flex-wrap gap-2">
//                         {['S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free'].map(s => (
//                           <button
//                             key={s}
//                             type="button"
//                             onClick={() => toggleSize(s)}
//                             className={`px-3 py-2 text-[10px] font-black border transition-all ${selectedProduct.sizes?.includes(s) ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-300 border-stone-100'}`}
//                           >
//                             {s}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//                     <InputGroup
//                       label="Fabric GSM"
//                       value={selectedProduct.fabricGsm}
//                       onChange={e =>
//                         setSelectedProduct({
//                           ...selectedProduct,
//                           fabricGsm: e.target.value,
//                         })
//                       }
//                     />
//                     <InputGroup
//                       label="Pattern"
//                       value={selectedProduct.pattern}
//                       onChange={e =>
//                         setSelectedProduct({
//                           ...selectedProduct,
//                           pattern: e.target.value,
//                         })
//                       }
//                     />
//                     <InputGroup
//                       label="Fit"
//                       value={selectedProduct.fitType}
//                       onChange={e =>
//                         setSelectedProduct({
//                           ...selectedProduct,
//                           fitType: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>
//               )}

//               {activeCategoryType === 'FOODS' && (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <InputGroup
//                     label="Ingredients"
//                     value={selectedProduct.ingredients}
//                     onChange={e =>
//                       setSelectedProduct({
//                         ...selectedProduct,
//                         ingredients: e.target.value,
//                       })
//                     }
//                   />
//                   <InputGroup
//                     label="Expiry Date"
//                     type="date"
//                     value={selectedProduct.expiryDate}
//                     onChange={e =>
//                       setSelectedProduct({
//                         ...selectedProduct,
//                         expiryDate: e.target.value,
//                       })
//                     }
//                   />
//                   <div className="flex items-center justify-between p-4 bg-white border border-stone-100 mt-5">
//                     <span className="text-[10px] font-black uppercase text-stone-900">
//                       Organic
//                     </span>
//                     <input
//                       type="checkbox"
//                       checked={selectedProduct.isOrganic}
//                       onChange={e =>
//                         setSelectedProduct({
//                           ...selectedProduct,
//                           isOrganic: e.target.checked,
//                         })
//                       }
//                       className="accent-red-600"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Add more logic for Computing/Mobile if needed, or keep it General */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-stone-100">
//                 <InputGroup
//                   label="Material"
//                   value={selectedProduct.material}
//                   onChange={e =>
//                     setSelectedProduct({
//                       ...selectedProduct,
//                       material: e.target.value,
//                     })
//                   }
//                 />
//                 <InputGroup
//                   label="Dimensions"
//                   value={selectedProduct.dimensions}
//                   onChange={e =>
//                     setSelectedProduct({
//                       ...selectedProduct,
//                       dimensions: e.target.value,
//                     })
//                   }
//                 />
//                 <InputGroup
//                   label="Weight"
//                   value={selectedProduct.weight}
//                   onChange={e =>
//                     setSelectedProduct({
//                       ...selectedProduct,
//                       weight: e.target.value,
//                     })
//                   }
//                 />
//                 <InputGroup
//                   label="Model"
//                   value={selectedProduct.modelNumber}
//                   onChange={e =>
//                     setSelectedProduct({
//                       ...selectedProduct,
//                       modelNumber: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>

//             {/* C. SEO & STATUS MATRIX */}
//             <div className="bg-stone-900 p-10 text-white space-y-10">
//               <SectionLabel label="Search Engine Matrix (SEO) —" white />
//               <div className="grid gap-6">
//                 <input
//                   type="text"
//                   placeholder="META TITLE"
//                   className="w-full bg-stone-800 border-none p-4 text-[10px] font-black uppercase tracking-widest text-stone-100"
//                   value={selectedProduct.metaTitle}
//                   onChange={e =>
//                     setSelectedProduct({
//                       ...selectedProduct,
//                       metaTitle: e.target.value,
//                     })
//                   }
//                 />
//                 <textarea
//                   placeholder="META DESCRIPTION"
//                   rows="2"
//                   className="w-full bg-stone-800 border-none p-4 text-[10px] font-bold text-stone-400"
//                   value={selectedProduct.metaDescription}
//                   onChange={e =>
//                     setSelectedProduct({
//                       ...selectedProduct,
//                       metaDescription: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="flex items-center justify-between pt-6 border-t border-stone-800">
//                 <div className="flex items-center gap-4">
//                   <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
//                     Featured Piece
//                   </span>
//                   <input
//                     type="checkbox"
//                     checked={selectedProduct.isFeatured}
//                     onChange={e =>
//                       setSelectedProduct({
//                         ...selectedProduct,
//                         isFeatured: e.target.checked,
//                       })
//                     }
//                     className="accent-red-600"
//                   />
//                 </div>
//                 <select
//                   className="bg-transparent text-[10px] font-black uppercase tracking-widest text-red-600 outline-none"
//                   value={selectedProduct.status}
//                   onChange={e =>
//                     setSelectedProduct({
//                       ...selectedProduct,
//                       status: e.target.value,
//                     })
//                   }
//                 >
//                   <option value="published">LIVE</option>
//                   <option value="draft">DRAFT</option>
//                 </select>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={editLoading}
//               className="w-full py-8 bg-stone-900 text-white text-[12px] font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all shadow-2xl flex items-center justify-center gap-4"
//             >
//               {editLoading ? (
//                 <RefreshCw className="animate-spin" />
//               ) : (
//                 <>
//                   <Save size={16} /> COMMIT CHANGES TO ARCHIVE
//                 </>
//               )}
//             </button>
//           </form>
//         </Modal>
//       )}

//       {/* DELETE MODAL (Preserved) */}
//       <Modal
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         title="Confirm Piece Erasure"
//       >
//         <div className="text-center py-10 space-y-8">
//           <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
//             <ShieldAlert size={40} />
//           </div>
//           <p className="text-sm font-black text-stone-900 uppercase tracking-tighter">
//             Are you absolutely sure?
//           </p>
//           <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-loose">
//             Deleting "{selectedProduct?.nameEn}" will permanently remove it from
//             the Global Inventory Archive.
//           </p>
//           <div className="grid grid-cols-2 gap-4 mt-10">
//             <button
//               onClick={() => setIsDeleteModalOpen(false)}
//               className="py-4 border border-stone-200 text-stone-400 font-black text-[10px] uppercase tracking-widest"
//             >
//               Abort
//             </button>
//             <button
//               onClick={handleDelete}
//               disabled={deleteLoading}
//               className="py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl"
//             >
//               {deleteLoading ? 'Erasing...' : 'Confirm Erasure'}
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// // --- Signature Sub-Components ---
// const SectionLabel = ({ label, bn = false, white = false }) => (
//   <div className={`flex items-center gap-3 mb-8 ${bn ? 'justify-end' : ''}`}>
//     {!bn && <Minus size={14} className="text-red-600" />}
//     <span
//       className={`text-[10px] font-black uppercase tracking-[0.4em] ${white ? 'text-stone-100' : 'text-stone-900'}`}
//     >
//       {label}
//     </span>
//     {bn && <Minus size={14} className="text-red-600" />}
//   </div>
// );

// const InputGroup = ({
//   label,
//   name,
//   value,
//   onChange,
//   placeholder,
//   type = 'text',
//   required = false,
//   red = false,
// }) => (
//   <div className="space-y-3">
//     <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">
//       {label}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       required={required}
//       className={`w-full bg-transparent border-b border-stone-200 pb-2 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-stone-900 transition-colors ${red ? 'text-red-600 border-red-100' : 'text-stone-900'}`}
//     />
//   </div>
// );

// export default AdminInventoryView;
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
  Mail,
  Sparkles,
  Minus,
  Palette,
  Ruler,
  Calendar,
  Refrigerator,
  Zap,
  Weight,
  Maximize,
  Database,
  ShieldAlert,
  Plus,
  Smartphone,
  Cpu,
  Headphones,
  Home,
  Layout,
  Hash,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../../../../components/shared/Loader';
import Modal from '../../../../components/shared/Modal';

const AdminInventoryView = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadIndex, setUploadIndex] = useState(null); // ট্র্যাকিং স্লট আপলোড
  const [hexInput, setHexInput] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const activeCategoryType = useMemo(() => {
    if (!selectedProduct || !selectedProduct.category) return 'GENERAL';
    const catId = selectedProduct.category;
    const selected = categories.find(c => c._id === catId);
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
  }, [selectedProduct?.category, categories]);

  useEffect(() => {
    fetchGlobalInventory();
    fetchCategories();
  }, []);

  const fetchGlobalInventory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}/products?pageSize=1000&showAll=true`,
        { withCredentials: true }
      );
      setProducts(data.products);
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

  // এডিট মোডাল খোলার সময় ৩টি ইমেজ স্লট নিশ্চিত করা
  const openEditModal = product => {
    const images = [...product.images, '', '', ''].slice(0, 3); // নিশ্চিত করা ৩টি স্লট আছে
    setSelectedProduct({
      ...product,
      category: product.category?._id || product.category,
      images: images,
    });
    setIsEditModalOpen(true);
  };

  // --- ৩টি স্লটের জন্য ইমেজ আপলোড প্রোটোকল ---
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
      toast.success(`Slot 0${index + 1} Manifest Committed`);
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploadIndex(null);
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setEditLoading(true);
    try {
      // ফাঁকা ইমেজ স্লট বাদ দিয়ে পাঠানো
      const finalData = {
        ...selectedProduct,
        images: selectedProduct.images.filter(img => img !== ''),
      };
      await axios.put(`${API_URL}/products/${selectedProduct._id}`, finalData, {
        withCredentials: true,
      });
      toast.success('Inventory Protocol Updated');
      setIsEditModalOpen(false);
      fetchGlobalInventory();
    } catch (err) {
      toast.error('Update failed');
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
      toast.success('Piece erased from Archive');
      setIsDeleteModalOpen(false);
      fetchGlobalInventory();
    } catch (err) {
      toast.error('Erasure failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleSize = size => {
    const currentSizes = selectedProduct.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    setSelectedProduct({ ...selectedProduct, sizes: newSizes });
  };

  const addColor = () => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hexInput)) return toast.error('Invalid Hex');
    const currentColors = selectedProduct.colors || [];
    setSelectedProduct({
      ...selectedProduct,
      colors: [...currentColors, hexInput],
    });
    setHexInput('');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));
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
      {/* 1. EDITORIAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Real-time Stock Control
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Inventory <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — engine.
            </span>
          </h2>
        </div>
        <button
          onClick={fetchGlobalInventory}
          className="flex items-center gap-3 px-8 py-4 border border-stone-200 text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync
          Archive
        </button>
      </div>

      {/* 2. SEARCH & FILTER MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/10">
        <div className="md:col-span-8 bg-white p-6 flex items-center gap-6">
          <Search size={18} className="text-stone-300" />
          <input
            type="text"
            placeholder="SEARCH PIECE OR ARTISAN..."
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
            <option value="All">All Archives</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. TABLE */}
      <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Product Narrative</th>
                <th className="px-10 py-8">Commercials</th>
                <th className="px-10 py-8 text-center">Protocol</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredProducts.map(product => (
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
                      <div className="space-y-1">
                        <p className="text-sm font-black text-stone-900 uppercase tracking-tighter">
                          {product.nameEn}
                        </p>
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">
                          {product.category?.nameEn}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-lg font-black text-stone-900 tracking-tighter">
                      ৳{product.price.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-black uppercase text-stone-400">
                      Stock: {product.stock}
                    </p>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border border-stone-900">
                      {product.status || 'Live'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right space-x-3">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-3 bg-white border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-3 bg-white border border-stone-100 text-stone-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ULTIMATE UPDATE MODAL */}
      {selectedProduct && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Manifest Override — ${activeCategoryType}`}
          size="xl"
        >
          <form onSubmit={handleUpdate} className="space-y-12 py-6">
            {/* A. COMMERCIALS (TOP) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-white border border-stone-100">
              <InputGroup
                label="Retail Price (৳)"
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
              <InputGroup
                label="Archive Stock"
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
                  Archive Category
                </label>
                <select
                  className="w-full bg-stone-900 text-white p-4 text-[11px] font-black uppercase outline-none"
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

            {/* B. VISUAL MANIFEST (3 SLOTS) */}
            <div className="p-10 bg-white border border-stone-100 space-y-8">
              <SectionLabel label="Visual Manifest Override (3 Slots)" />
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
                            <RefreshCw className="animate-spin text-red-600" />
                          ) : (
                            <Upload size={20} className="text-stone-300" />
                          )}
                          <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">
                            {idx === 0
                              ? '01 / Primary'
                              : idx === 1
                                ? '02 / Detail'
                                : '03 / Perspective'}
                          </span>
                        </div>
                      )}
                    </label>
                    {selectedProduct.images[idx] && (
                      <button
                        type="button"
                        onClick={() => {
                          let n = [...selectedProduct.images];
                          n[idx] = '';
                          setSelectedProduct({ ...selectedProduct, images: n });
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* C. NARRATIVE SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-100 border border-stone-100">
              <div className="bg-white p-8 space-y-6">
                <SectionLabel label="Narrative Output (EN)" />
                <InputGroup
                  label="Product Title"
                  value={selectedProduct.nameEn}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      nameEn: e.target.value,
                    })
                  }
                  required
                />
                <textarea
                  className="w-full bg-stone-50 p-4 text-[11px] font-medium tracking-wider text-stone-600 border-none outline-none resize-none"
                  rows="4"
                  value={selectedProduct.descriptionEn}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      descriptionEn: e.target.value,
                    })
                  }
                />
              </div>
              <div className="bg-white p-8 space-y-6 text-right">
                <SectionLabel label="আর্কাইভ বিবরণ (BN)" bn />
                <InputGroup
                  label="পণ্যের নাম"
                  value={selectedProduct.nameBn}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      nameBn: e.target.value,
                    })
                  }
                  required
                />
                <textarea
                  className="w-full bg-stone-50 p-4 text-[11px] font-medium tracking-wider text-stone-600 border-none outline-none resize-none text-right"
                  rows="4"
                  value={selectedProduct.descriptionBn}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      descriptionBn: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* D. DYNAMIC CATEGORY MATRIX (Fashion, Food, Tech, etc.) */}
            <div className="p-10 bg-stone-50/50 border border-stone-100 space-y-12">
              <SectionLabel
                label={`${activeCategoryType} SPECIFICATION OVERRIDE —`}
              />

              {activeCategoryType === 'FASHION' && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        <Palette size={12} /> Update Swatches
                      </label>
                      <div className="flex gap-2">
                        <input
                          value={hexInput}
                          onChange={e => setHexInput(e.target.value)}
                          placeholder="#HEX"
                          className="flex-1 bg-white border border-stone-200 p-3 text-[11px] font-black outline-none focus:border-red-600"
                        />
                        <button
                          type="button"
                          onClick={addColor}
                          className="bg-stone-900 text-white px-4"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.colors?.map((c, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 border border-white shadow-sm cursor-pointer"
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
                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        <Ruler size={12} /> Size Grid
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free'].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleSize(s)}
                            className={`px-3 py-2 text-[10px] font-black border transition-all ${selectedProduct.sizes?.includes(s) ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-300 border-stone-100'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-stone-100 pt-8">
                    <InputGroup
                      label="Fabric & GSM"
                      value={selectedProduct.fabricGsm}
                      onChange={e =>
                        setSelectedProduct({
                          ...selectedProduct,
                          fabricGsm: e.target.value,
                        })
                      }
                    />
                    <InputGroup
                      label="Fit Type"
                      value={selectedProduct.fitType}
                      onChange={e =>
                        setSelectedProduct({
                          ...selectedProduct,
                          fitType: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Add similar blocks for AUDIO, COMPUTING, FOODS, etc. as per previous versions */}
              {(activeCategoryType === 'TECH' ||
                activeCategoryType === 'COMPUTING' ||
                activeCategoryType === 'MOBILE') && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <InputGroup
                    label="Core Processor"
                    value={selectedProduct.processor}
                    onChange={e =>
                      setSelectedProduct({
                        ...selectedProduct,
                        processor: e.target.value,
                      })
                    }
                  />
                  <InputGroup
                    label="Memory (RAM)"
                    value={selectedProduct.ram}
                    onChange={e =>
                      setSelectedProduct({
                        ...selectedProduct,
                        ram: e.target.value,
                      })
                    }
                  />
                  <InputGroup
                    label="Internal Storage"
                    value={selectedProduct.storage}
                    onChange={e =>
                      setSelectedProduct({
                        ...selectedProduct,
                        storage: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {activeCategoryType === 'FOODS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputGroup
                    label="Ingredients Archive"
                    value={selectedProduct.ingredients}
                    onChange={e =>
                      setSelectedProduct({
                        ...selectedProduct,
                        ingredients: e.target.value,
                      })
                    }
                  />
                  <InputGroup
                    label="Expiry Timeline"
                    type="date"
                    value={selectedProduct.expiryDate}
                    onChange={e =>
                      setSelectedProduct({
                        ...selectedProduct,
                        expiryDate: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {/* SHARED BASELINE (Weight, Dim, Material, Model) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-stone-100">
                <InputGroup
                  label="Material"
                  value={selectedProduct.material}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      material: e.target.value,
                    })
                  }
                />
                <InputGroup
                  label="Dimensions"
                  value={selectedProduct.dimensions}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      dimensions: e.target.value,
                    })
                  }
                />
                <InputGroup
                  label="Mass / Weight"
                  value={selectedProduct.weight}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      weight: e.target.value,
                    })
                  }
                />
                <InputGroup
                  label="Model Number"
                  value={selectedProduct.modelNumber}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      modelNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* E. SEO & STATUS */}
            <div className="bg-stone-900 p-10 text-white space-y-10">
              <SectionLabel label="Search Engine Protocol (SEO) —" white />
              <div className="grid gap-6">
                <input
                  type="text"
                  placeholder="META TITLE"
                  className="w-full bg-stone-800 border-none p-4 text-[10px] font-black uppercase tracking-widest text-stone-100 outline-none"
                  value={selectedProduct.metaTitle}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      metaTitle: e.target.value,
                    })
                  }
                />
                <textarea
                  placeholder="META DESCRIPTION"
                  rows="2"
                  className="w-full bg-stone-800 border-none p-4 text-[10px] font-bold text-stone-400 outline-none"
                  value={selectedProduct.metaDescription}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      metaDescription: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-stone-800">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                    Featured Piece
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedProduct.isFeatured}
                    onChange={e =>
                      setSelectedProduct({
                        ...selectedProduct,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="accent-red-600"
                  />
                </div>
                <select
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest text-red-600 outline-none"
                  value={selectedProduct.status}
                  onChange={e =>
                    setSelectedProduct({
                      ...selectedProduct,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="published">LIVE</option>
                  <option value="draft">DRAFT</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={editLoading}
              className="w-full py-10 bg-stone-900 text-white text-[12px] font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all shadow-2xl flex items-center justify-center gap-4"
            >
              {editLoading ? (
                <RefreshCw className="animate-spin" />
              ) : (
                <>
                  <Save size={16} /> COMMIT PROTOCOL OVERRIDE
                </>
              )}
            </button>
          </form>
        </Modal>
      )}

      {/* DELETE MODAL (Preserved) */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Erasure"
      >
        <div className="text-center py-10 space-y-8">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <ShieldAlert size={40} />
          </div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-6">
            Purging piece from Global Ledger Archive.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-10">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="py-4 border border-stone-200 text-stone-400 font-black text-[10px] uppercase tracking-widest"
            >
              Abort
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl"
            >
              Confirm Erasure
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// --- Sub-Components ---
const SectionLabel = ({ label, bn = false, white = false }) => (
  <div className={`flex items-center gap-3 mb-8 ${bn ? 'justify-end' : ''}`}>
    {!bn && <Minus size={14} className="text-red-600" />}
    <span
      className={`text-[10px] font-black uppercase tracking-[0.4em] ${white ? 'text-stone-100' : 'text-stone-900'}`}
    >
      {label}
    </span>
    {bn && <Minus size={14} className="text-red-600" />}
  </div>
);

const InputGroup = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}) => (
  <div className="space-y-3">
    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-transparent border-b border-stone-200 pb-2 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-stone-900 transition-colors text-stone-900"
    />
  </div>
);

export default AdminInventoryView;
