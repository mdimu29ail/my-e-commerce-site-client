// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import {
//   Upload,
//   X,
//   RefreshCw,
//   Minus,
//   Palette,
//   Ruler,
//   Calendar,
//   Refrigerator,
//   Zap,
//   Weight,
//   Maximize,
//   Type,
//   Globe,
//   Settings2,
//   Database,
//   Search,
//   Sparkles,
//   Copy,
//   ChevronRight,
//   HelpCircle,
//   Plus,
// } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import Loader from '../../../../components/shared/Loader';

// const AdminAddProductsView = () => {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [formLoading, setFormLoading] = useState(false);
//   const [showAiGuide, setShowAiGuide] = useState(false);
//   const [hexInput, setHexInput] = useState(''); // State for color hex field

//   const [formData, setFormData] = useState({
//     nameEn: '',
//     nameBn: '',
//     descriptionEn: '',
//     descriptionBn: '',
//     price: '',
//     discountPrice: '',
//     category: '',
//     stock: '',
//     brand: '',
//     // Fashion Protocol Specific
//     colors: [],
//     sizes: [],
//     fabricGsm: '',
//     pattern: '',
//     fitType: '',
//     collarType: '',
//     sleeveLength: '',
//     occasion: '',
//     careGuide: '',
//     // Other Category Specifics
//     material: '',
//     dimensions: '',
//     weight: '',
//     assemblyInfo: '',
//     spacePlacement: '',
//     finishAesthetic: '',
//     weightCapacity: '',
//     maintenance: '',
//     displaySize: '',
//     displayPanel: '',
//     brightness: '',
//     sensors: '',
//     sportsModes: '',
//     batteryLife: '',
//     ipRating: '',
//     strapType: '',
//     driverSize: '',
//     soundProfile: '',
//     ancDepth: '',
//     playtime: '',
//     latency: '',
//     ergonomics: '',
//     processor: '',
//     gpu: '',
//     ram: '',
//     storage: '',
//     resolution: '',
//     refreshRate: '',
//     batteryWh: '',
//     ports: '',
//     buildMaterial: '',
//     cameraSpecs: '',
//     chipset: '',
//     osUi: '',
//     chargingWattage: '',
//     virtualRam: '',
//     ingredients: '',
//     origin: '',
//     netQuantity: '',
//     purity: '',
//     expiryDate: '',
//     storageType: 'Room Temp',
//     tastePairing: '',
//     // SEO & Status
//     metaTitle: '',
//     metaDescription: '',
//     status: 'published',
//     isFeatured: false,
//     images: [],
//   });

//   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
//   const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;

//   const activeCategoryType = useMemo(() => {
//     const selected = categories.find(c => c._id === formData.category);
//     if (!selected) return 'GENERAL';
//     const name = (selected.nameEn || '').toLowerCase();
//     if (
//       name.includes('fashion') ||
//       name.includes('clothing') ||
//       name.includes('apparel')
//     )
//       return 'FASHION';
//     if (
//       name.includes('home') ||
//       name.includes('living') ||
//       name.includes('furniture')
//     )
//       return 'HOME';
//     if (name.includes('smartwatch') || name.includes('wearable'))
//       return 'WEARABLES';
//     if (name.includes('audio') || name.includes('headphone')) return 'AUDIO';
//     if (name.includes('laptop') || name.includes('computer'))
//       return 'COMPUTING';
//     if (name.includes('phone') || name.includes('tablet')) return 'MOBILE';
//     if (name.includes('food') || name.includes('grocery')) return 'FOODS';
//     return 'GENERAL';
//   }, [formData.category, categories]);

//   const aiCheatSheet = {
//     FASHION: {
//       checklist: [
//         'Color & Shade',
//         'Fabric & GSM',
//         'Fit Type',
//         'Design Details',
//         'Occasion',
//         'Care Guide',
//       ],
//       prompt: `Act as a high-end Fashion Copywriter. Product: "${formData.nameEn}". Fabric: ${formData.fabricGsm}. Fit: ${formData.fitType}. Provide Title, Story, 5 Bullets, and Care Guide.`,
//     },
//     HOME: {
//       checklist: [
//         'Material Type',
//         'Dimensions',
//         'Assembly Info',
//         'Space Placement',
//         'Durability',
//         'Maintenance',
//       ],
//       prompt: `Act as a Home Decor Copywriter. Product: "${formData.nameEn}". Material: ${formData.material}. Aesthetic: ${formData.finishAesthetic}. Write an inspirational listing.`,
//     },
//     WEARABLES: {
//       checklist: [
//         'Display Panel',
//         'Health Sensors',
//         'Sports Modes',
//         'Battery mAh',
//         'IP Rating',
//         'Connectivity',
//       ],
//       prompt: `Act as a Tech Copywriter. Smartwatch: "${formData.nameEn}". Specs: ${formData.displayPanel}, ${formData.sensors}. Write a persuasive tech listing.`,
//     },
//     AUDIO: {
//       checklist: [
//         'Driver Size',
//         'ANC Depth',
//         'Playtime',
//         'Low Latency',
//         'Ergonomics',
//       ],
//       prompt: `Act as an Audio Engineer & Copywriter. Device: "${formData.nameEn}". Sound Profile: ${formData.soundProfile}. Focus on sound quality and ANC.`,
//     },
//     COMPUTING: {
//       checklist: [
//         'Processor/GPU',
//         'RAM/Storage Type',
//         'Display Refresh Rate',
//         'Ports',
//         'Build Weight',
//       ],
//       prompt: `Act as a Tech Reviewer. Laptop: "${formData.nameEn}". CPU: ${formData.processor}. GPU: ${formData.gpu}. Write for high-performance users.`,
//     },
//     MOBILE: {
//       checklist: [
//         'Camera OIS',
//         'Display Protection',
//         'Charging Wattage',
//         'Virtual RAM',
//         'OS UI Version',
//       ],
//       prompt: `Act as a Mobile Expert. Phone: "${formData.nameEn}". Camera: ${formData.cameraSpecs}. Focus on speed and camera brilliance.`,
//     },
//     FOODS: {
//       checklist: [
//         'Ingredients & Origin',
//         'Net Quantity',
//         'Purity Certs',
//         'Shelf Life',
//         'Taste & Pairing',
//       ],
//       prompt: `Act as an Organic Food Copywriter. Product: "${formData.nameEn}". Purity: ${formData.purity}. Write a trustworthy and appetizing listing.`,
//     },
//     GENERAL: {
//       checklist: ['Material', 'Weight', 'Model Number', 'Warranty'],
//       prompt: `Act as an E-commerce Expert. Write a high-converting listing for "${formData.nameEn}".`,
//     },
//   };

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await axios.get(`${API_URL}/categories`);
//         setCategories(Array.isArray(data) ? data : data.categories || []);
//       } catch (err) {
//         toast.error('Archive sync failed.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, [API_URL]);

//   // --- FASHION FUNCTIONS ---
//   const addColor = () => {
//     const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
//     if (!hexRegex.test(hexInput))
//       return toast.error('Invalid Hex Code (e.g. #FF0000)');
//     if (formData.colors.includes(hexInput))
//       return toast.warn('Color already in Archive');
//     setFormData(prev => ({ ...prev, colors: [...prev.colors, hexInput] }));
//     setHexInput('');
//   };

//   const toggleSize = size => {
//     setFormData(prev => ({
//       ...prev,
//       sizes: prev.sizes.includes(size)
//         ? prev.sizes.filter(s => s !== size)
//         : [...prev.sizes, size],
//     }));
//   };

//   const handleChange = e => {
//     const { name, value, type, checked } = e.target;
//     setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
//   };

//   const handleImageUpload = async e => {
//     const files = Array.from(e.target.files);
//     if (!IMGBB_KEY) return toast.error('Upload key missing');
//     setFormLoading(true);
//     try {
//       const uploadPromises = files.map(async file => {
//         const body = new FormData();
//         body.append('image', file);
//         const res = await axios.post(
//           `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
//           body
//         );
//         return res.data?.data?.url || null;
//       });
//       const urls = await Promise.all(uploadPromises);
//       setFormData(prev => ({
//         ...prev,
//         images: [...prev.images, ...urls.filter(u => u)],
//       }));
//       toast.success('Visual assets ingested.');
//     } catch (err) {
//       toast.error('Upload failed');
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setFormLoading(true);
//     try {
//       await axios.post(`${API_URL}/products`, formData, {
//         withCredentials: true,
//       });
//       toast.success('Launched to Archive');
//       navigate('/admin/my-products');
//     } catch (err) {
//       toast.error('Ingestion failed');
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="h-[80vh] flex items-center justify-center">
//         <Loader />
//       </div>
//     );

//   return (
//     <div className="max-w-[1450px] mx-auto space-y-16 pb-32 font-sans selection:bg-red-50 selection:text-red-600 relative">
//       {/* 1. EDITORIAL HEADER */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12">
//         <div className="space-y-6">
//           <div className="flex items-center gap-4 text-red-600">
//             <div className="h-[1px] w-12 bg-red-600" />
//             <span className="text-[10px] font-black uppercase tracking-[0.5em]">
//               Ingestion Console
//             </span>
//           </div>
//           <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
//             Product <br />
//             <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
//               — {activeCategoryType}.
//             </span>
//           </h2>
//         </div>
//       </div>

//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 lg:grid-cols-12 gap-12"
//       >
//         {/* LEFT COLUMN */}
//         <div className="lg:col-span-8 space-y-12">
//           {/* Narrative Matrix */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-100 border border-stone-100">
//             <div className="bg-white p-10 space-y-8">
//               <SectionLabel label="Narrative (EN)" />
//               <input
//                 type="text"
//                 name="nameEn"
//                 placeholder="ARTICLE TITLE"
//                 className="form-input-brutalist"
//                 value={formData.nameEn}
//                 onChange={handleChange}
//                 required
//               />
//               <textarea
//                 name="descriptionEn"
//                 placeholder="NARRATIVE STORY"
//                 rows="6"
//                 className="form-textarea-brutalist"
//                 value={formData.descriptionEn}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="bg-white p-10 space-y-8">
//               <SectionLabel label="আর্কাইভ বিবরণ (BN)" bn />
//               <input
//                 type="text"
//                 name="nameBn"
//                 placeholder="পণ্যের নাম"
//                 className="form-input-brutalist text-right"
//                 value={formData.nameBn}
//                 onChange={handleChange}
//                 required
//               />
//               <textarea
//                 name="descriptionBn"
//                 placeholder="বিস্তারিত কাহিনী"
//                 rows="6"
//                 className="form-textarea-brutalist text-right"
//                 value={formData.descriptionBn}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           {/* DYNAMIC CATEGORY PROTOCOLS */}
//           <div className="bg-white p-10 border border-stone-100 space-y-12">
//             <div className="flex justify-between items-center border-b border-stone-50 pb-6">
//               <SectionLabel
//                 label={`${activeCategoryType} Specification Matrix —`}
//               />
//               <Sparkles
//                 className="text-red-600 cursor-pointer hover:rotate-12 transition-transform"
//                 onClick={() => setShowAiGuide(true)}
//               />
//             </div>

//             {/* 1. FASHION & APPAREL FIXED */}
//             {activeCategoryType === 'FASHION' && (
//               <div className="space-y-12">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                   {/* Color Section */}
//                   <div className="space-y-6">
//                     <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
//                       <Palette size={12} /> Color Archive (Hex + Enter)
//                     </label>
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         value={hexInput}
//                         onChange={e => setHexInput(e.target.value)}
//                         placeholder="#E11D48"
//                         className="flex-1 bg-stone-50 border-b border-stone-200 p-4 text-[11px] font-black uppercase outline-none focus:border-red-600"
//                       />
//                       <button
//                         type="button"
//                         onClick={addColor}
//                         className="bg-stone-900 text-white px-6 hover:bg-red-600 transition-colors"
//                       >
//                         <Plus size={16} />
//                       </button>
//                     </div>
//                     <div className="flex flex-wrap gap-3">
//                       {formData.colors.map((c, i) => (
//                         <div key={i} className="group relative">
//                           <div
//                             className="w-10 h-10 border border-stone-200"
//                             style={{ backgroundColor: c }}
//                           />
//                           <button
//                             type="button"
//                             onClick={() =>
//                               setFormData({
//                                 ...formData,
//                                 colors: formData.colors.filter(
//                                   (_, idx) => idx !== i
//                                 ),
//                               })
//                             }
//                             className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
//                           >
//                             <X size={10} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Size Section */}
//                   <div className="space-y-6">
//                     <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
//                       <Ruler size={12} /> Size Proportion Grid
//                     </label>
//                     <div className="grid grid-cols-4 gap-2">
//                       {['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'Free'].map(
//                         size => (
//                           <button
//                             key={size}
//                             type="button"
//                             onClick={() => toggleSize(size)}
//                             className={`py-3 text-[10px] font-black border transition-all ${formData.sizes.includes(size) ? 'bg-stone-900 text-white border-stone-900 shadow-xl' : 'bg-transparent text-stone-400 border-stone-100 hover:border-stone-400'}`}
//                           >
//                             {size}
//                           </button>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Fashion Tech Specs */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-stone-50">
//                   <InputGroup
//                     label="Fabric & GSM"
//                     name="fabricGsm"
//                     value={formData.fabricGsm}
//                     onChange={handleChange}
//                     placeholder="e.g. 100% Cotton, 180 GSM"
//                   />
//                   <InputGroup
//                     label="Pattern / Print"
//                     name="pattern"
//                     value={formData.pattern}
//                     onChange={handleChange}
//                     placeholder="Solid / Graphic"
//                   />
//                   <InputGroup
//                     label="Fit Type"
//                     name="fitType"
//                     value={formData.fitType}
//                     onChange={handleChange}
//                     placeholder="Oversized / Slim"
//                   />
//                   <InputGroup
//                     label="Occasion"
//                     name="occasion"
//                     value={formData.occasion}
//                     onChange={handleChange}
//                     placeholder="Casual / Summer"
//                   />
//                   <InputGroup
//                     label="Design Details"
//                     name="collarType"
//                     value={formData.collarType}
//                     onChange={handleChange}
//                     placeholder="Mandarin Collar, Full Sleeve"
//                   />
//                   <InputGroup
//                     label="Care Guide"
//                     name="careGuide"
//                     value={formData.careGuide}
//                     onChange={handleChange}
//                     placeholder="Machine Wash Cold"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* 2. HOME & LIVING (PRESREVED) */}
//             {activeCategoryType === 'HOME' && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                 <InputGroup
//                   label="Material"
//                   name="material"
//                   value={formData.material}
//                   onChange={handleChange}
//                   placeholder="Teak Wood / Ceramic"
//                 />
//                 <InputGroup
//                   label="Space Placement"
//                   name="spacePlacement"
//                   value={formData.spacePlacement}
//                   onChange={handleChange}
//                   placeholder="Living Room / Outdoor"
//                 />
//                 <InputGroup
//                   label="Aesthetic"
//                   name="finishAesthetic"
//                   value={formData.finishAesthetic}
//                   onChange={handleChange}
//                   placeholder="Minimalist / High-Gloss"
//                 />
//                 <InputGroup
//                   label="Durability"
//                   name="weightCapacity"
//                   value={formData.weightCapacity}
//                   onChange={handleChange}
//                   placeholder="e.g. 150kg"
//                 />
//                 <InputGroup
//                   label="Assembly"
//                   name="assemblyInfo"
//                   value={formData.assemblyInfo}
//                   onChange={handleChange}
//                   placeholder="DIY / Pre-assembled"
//                 />
//                 <InputGroup
//                   label="Maintenance"
//                   name="maintenance"
//                   value={formData.maintenance}
//                   onChange={handleChange}
//                   placeholder="Avoid harsh chemicals"
//                 />
//               </div>
//             )}

//             {/* 3. WEARABLES (PRESERVED) */}
//             {activeCategoryType === 'WEARABLES' && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                 <InputGroup
//                   label="Display Specs"
//                   name="displayPanel"
//                   value={formData.displayPanel}
//                   onChange={handleChange}
//                   placeholder="AMOLED 1.96"
//                 />
//                 <InputGroup
//                   label="Health Sensors"
//                   name="sensors"
//                   value={formData.sensors}
//                   onChange={handleChange}
//                   placeholder="SpO2, Heart Rate"
//                 />
//                 <InputGroup
//                   label="Battery Life"
//                   name="batteryLife"
//                   value={formData.batteryLife}
//                   onChange={handleChange}
//                   placeholder="7 Days"
//                 />
//                 <InputGroup
//                   label="Durability"
//                   name="ipRating"
//                   value={formData.ipRating}
//                   onChange={handleChange}
//                   placeholder="IP68"
//                 />
//                 <InputGroup
//                   label="Strap Type"
//                   name="strapType"
//                   value={formData.strapType}
//                   onChange={handleChange}
//                 />
//                 <InputGroup
//                   label="Connectivity"
//                   name="ports"
//                   value={formData.ports}
//                   onChange={handleChange}
//                 />
//               </div>
//             )}

//             {/* 7. FOODS (PRESERVED) */}
//             {activeCategoryType === 'FOODS' && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                 <InputGroup
//                   label="Ingredients"
//                   name="ingredients"
//                   value={formData.ingredients}
//                   onChange={handleChange}
//                   placeholder="Honey, Saffron"
//                 />
//                 <InputGroup
//                   label="Purity"
//                   name="purity"
//                   value={formData.purity}
//                   onChange={handleChange}
//                   placeholder="100% Organic"
//                 />
//                 <InputGroup
//                   label="Shelf Life"
//                   name="expiryDate"
//                   value={formData.expiryDate}
//                   onChange={handleChange}
//                 />
//                 <InputGroup
//                   label="Net Quantity"
//                   name="netQuantity"
//                   value={formData.netQuantity}
//                   onChange={handleChange}
//                   placeholder="500g"
//                 />
//                 <InputGroup
//                   label="Origin"
//                   name="origin"
//                   value={formData.origin}
//                   onChange={handleChange}
//                 />
//                 <div className="space-y-3">
//                   <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
//                     Storage Protocol
//                   </label>
//                   <select
//                     name="storageType"
//                     value={formData.storageType}
//                     onChange={handleChange}
//                     className="w-full bg-stone-50 p-4 text-[11px] font-black uppercase outline-none"
//                   >
//                     <option>Room Temp</option>
//                     <option>Refrigerated</option>
//                   </select>
//                 </div>
//               </div>
//             )}

//             {/* Shared Logistics */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-stone-50">
//               <InputGroup
//                 label="Weight"
//                 name="weight"
//                 value={formData.weight}
//                 onChange={handleChange}
//                 icon={Weight}
//               />
//               <InputGroup
//                 label="Dimensions"
//                 name="dimensions"
//                 value={formData.dimensions}
//                 onChange={handleChange}
//                 icon={Maximize}
//               />
//               <InputGroup
//                 label="Model Number"
//                 name="modelNumber"
//                 value={formData.modelNumber}
//                 onChange={handleChange}
//                 icon={Database}
//               />
//             </div>
//           </div>

//           {/* SEO ARCHIVE SECTION */}
//           <div className="bg-stone-900 p-10 text-white space-y-8">
//             <SectionLabel label="SEO Matrix —" white />
//             <div className="grid gap-6">
//               <input
//                 type="text"
//                 name="metaTitle"
//                 placeholder="SEO TITLE"
//                 className="w-full bg-stone-800 border-none p-4 text-[10px] font-black uppercase tracking-widest text-stone-100"
//                 value={formData.metaTitle}
//                 onChange={handleChange}
//               />
//               <textarea
//                 name="metaDescription"
//                 placeholder="META FRAGMENT"
//                 rows="2"
//                 className="w-full bg-stone-800 border-none p-4 text-[10px] font-bold text-stone-400"
//                 value={formData.metaDescription}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="lg:col-span-4 space-y-12">
//           <div className="bg-white p-10 border border-stone-100 space-y-10">
//             <SectionLabel label="Commercial Protocol" />
//             <InputGroup
//               label="Price (৳)"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               required
//             />
//             <InputGroup
//               label="Discount (৳)"
//               name="discountPrice"
//               value={formData.discountPrice}
//               onChange={handleChange}
//               red
//             />
//             <InputGroup
//               label="Stock"
//               name="stock"
//               value={formData.stock}
//               onChange={handleChange}
//               required
//             />

//             <div className="space-y-3">
//               <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
//                 Select Archive
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full bg-stone-900 text-white p-5 text-[11px] font-black uppercase outline-none cursor-pointer"
//                 required
//               >
//                 <option value="">SELECT SEGMENT</option>
//                 {categories.map(c => (
//                   <option key={c._id} value={c._id}>
//                     {c.nameEn}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <InputGroup
//               label="Brand"
//               name="brand"
//               value={formData.brand}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="bg-white p-10 border border-stone-100 space-y-8">
//             <SectionLabel label="Visual Assets" />
//             <div className="grid grid-cols-2 gap-4">
//               <label className="aspect-square border border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-400 hover:border-red-600 transition-all cursor-pointer">
//                 <input
//                   type="file"
//                   multiple
//                   className="hidden"
//                   onChange={handleImageUpload}
//                 />
//                 {formLoading ? (
//                   <RefreshCw className="animate-spin" size={16} />
//                 ) : (
//                   <Upload size={20} />
//                 )}
//                 <span className="text-[8px] font-black mt-2 tracking-widest uppercase">
//                   Upload
//                 </span>
//               </label>
//               {formData.images.map((url, i) => (
//                 <div
//                   key={i}
//                   className="aspect-square relative group overflow-hidden border border-stone-50"
//                 >
//                   <img
//                     src={url}
//                     className="w-full h-full object-cover transition-transform group-hover:scale-110"
//                     alt=""
//                   />
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setFormData({
//                         ...formData,
//                         images: formData.images.filter((_, idx) => idx !== i),
//                       })
//                     }
//                     className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
//                   >
//                     <X size={14} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={formLoading}
//             className="w-full py-10 bg-stone-900 text-white text-[12px] font-black uppercase tracking-[0.6em] hover:bg-red-600 transition-all shadow-2xl"
//           >
//             {formLoading ? 'INGESTING...' : 'LAUNCH PROTOCOL'}
//           </button>
//         </div>
//       </form>

//       {/* AI SIDEBAR (Preserved) */}
//       <AnimatePresence>
//         {showAiGuide && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowAiGuide(false)}
//               className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100]"
//             />
//             <motion.div
//               initial={{ x: '100%' }}
//               animate={{ x: 0 }}
//               exit={{ x: '100%' }}
//               transition={{ type: 'spring', damping: 25 }}
//               className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl p-12 overflow-y-auto"
//             >
//               <div className="flex justify-between items-center mb-16">
//                 <div className="flex items-center gap-3 text-red-600">
//                   <Sparkles size={20} />
//                   <span className="text-[11px] font-black uppercase tracking-[0.4em]">
//                     Copy Assistant
//                   </span>
//                 </div>
//                 <button onClick={() => setShowAiGuide(false)}>
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="space-y-12">
//                 <div className="space-y-6">
//                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
//                     Current Strategy: {activeCategoryType}
//                   </p>
//                   <h3 className="text-3xl font-light text-stone-900 tracking-tighter uppercase leading-none">
//                     AI Cheat Sheet.
//                   </h3>
//                 </div>
//                 <div className="p-6 bg-stone-900 text-stone-300 text-[11px] font-mono leading-relaxed rounded-sm italic">
//                   "{aiCheatSheet[activeCategoryType]?.prompt}"
//                 </div>
//                 <button
//                   onClick={() => {
//                     navigator.clipboard.writeText(
//                       aiCheatSheet[activeCategoryType]?.prompt
//                     );
//                     toast.success('Prompt Copied');
//                   }}
//                   className="w-full bg-red-600 text-white py-4 text-[9px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all"
//                 >
//                   Copy Master Prompt
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

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
//   icon: Icon,
//   required = false,
//   red = false,
// }) => (
//   <div className="space-y-3">
//     <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
//       {Icon && <Icon size={12} />} {label}
//     </label>
//     <input
//       type="text"
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       required={required}
//       className={`w-full bg-transparent border-b border-stone-200 pb-2 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-stone-900 transition-colors ${red ? 'text-red-600 border-red-100' : 'text-stone-900'}`}
//     />
//   </div>
// );

// export default AdminAddProductsView;
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Upload,
  X,
  RefreshCw,
  Minus,
  Palette,
  Ruler,
  Calendar,
  Refrigerator,
  Zap,
  Weight,
  Maximize,
  Type,
  Globe,
  Settings2,
  Database,
  Search,
  Sparkles,
  Copy,
  ChevronRight,
  HelpCircle,
  Plus,
  Image as ImageIcon,
  Cpu,
  HardDrive,
  Smartphone,
  Headphones,
  Watch,
  Home,
  Layout,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const AdminAddProductsView = () => {
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
    // 1. Fashion
    colors: [],
    sizes: [],
    fabricGsm: '',
    pattern: '',
    fitType: '',
    collarType: '',
    sleeveLength: '',
    occasion: '',
    careGuide: '',
    // 2. Home
    material: '',
    dimensions: '',
    weight: '',
    assemblyInfo: '',
    spacePlacement: '',
    finishAesthetic: '',
    weightCapacity: '',
    maintenance: '',
    // 3. Wearables
    displaySize: '',
    displayPanel: '',
    brightness: '',
    sensors: '',
    sportsModes: '',
    batteryLife: '',
    ipRating: '',
    strapType: '',
    // 4. Audio
    driverSize: '',
    soundProfile: '',
    ancDepth: '',
    playtime: '',
    latency: '',
    ergonomics: '',
    // 5. Computing
    processor: '',
    gpu: '',
    ram: '',
    storage: '',
    resolution: '',
    refreshRate: '',
    batteryWh: '',
    ports: '',
    buildMaterial: '',
    // 6. Mobile
    cameraSpecs: '',
    chipset: '',
    osUi: '',
    chargingWattage: '',
    virtualRam: '',
    // 7. Foods
    ingredients: '',
    origin: '',
    netQuantity: '',
    purity: '',
    expiryDate: '',
    storageType: 'Room Temp',
    tastePairing: '',
    // SEO
    metaTitle: '',
    metaDescription: '',
    status: 'published',
    isFeatured: false,
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
    FASHION: {
      checklist: ['Fabric/GSM', 'Fit Type', 'Care Guide'],
      prompt: `Fashion Expert: Create a narrative for "${formData.nameEn}".`,
    },
    HOME: {
      checklist: ['Material', 'Aesthetic', 'Placement'],
      prompt: `Interior Designer: Write for "${formData.nameEn}".`,
    },
    WEARABLES: {
      checklist: ['Display Specs', 'Sensors', 'Battery'],
      prompt: `Tech Reviewer: Write for "${formData.nameEn}".`,
    },
    AUDIO: {
      checklist: ['Driver Size', 'ANC', 'Playtime'],
      prompt: `Audio Engineer: Describe "${formData.nameEn}".`,
    },
    COMPUTING: {
      checklist: ['Processor', 'RAM/SSD', 'GPU'],
      prompt: `IT Reviewer: Describe "${formData.nameEn}".`,
    },
    MOBILE: {
      checklist: ['Camera', 'Chipset', 'Flash Charge'],
      prompt: `Mobile Expert: Write for "${formData.nameEn}".`,
    },
    FOODS: {
      checklist: ['Ingredients', 'Purity', 'Expiry'],
      prompt: `Organic Copywriter: Write for "${formData.nameEn}".`,
    },
    GENERAL: {
      checklist: ['Material', 'Weight', 'Ref ID'],
      prompt: `Copywriter: Generate details for "${formData.nameEn}".`,
    },
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
      toast.success(`Visual Slot ${index + 1} Committed`);
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

  const toggleSize = size => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.images[0]) return toast.error('Primary Visual Required');
    setFormLoading(true);
    try {
      const finalImages = formData.images.filter(img => img !== '');
      await axios.post(
        `${API_URL}/products`,
        { ...formData, images: finalImages },
        { withCredentials: true }
      );
      toast.success('Launched to Archive');
      navigate('/admin/my-products');
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
    <div className="max-w-[1450px] mx-auto space-y-16 pb-32 font-sans selection:bg-red-50 selection:text-red-600 relative">
      {/* 1. EDITORIAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Ingestion Control
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Product <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — {activeCategoryType}.
            </span>
          </h2>
        </div>
        <button
          onClick={() => setShowAiGuide(true)}
          className="flex items-center gap-3 px-8 py-4 bg-stone-900 text-white text-[9px] font-black uppercase tracking-[0.4em] hover:bg-red-600 transition-all shadow-2xl"
        >
          <Sparkles size={14} /> Open AI Matrix
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
      >
        {/* LEFT COLUMN: CORE DATA & DYNAMIC SPECS */}
        <div className="lg:col-span-8 space-y-12">
          {/* Narrative Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-100 border border-stone-100">
            <div className="bg-white p-10 space-y-8">
              <SectionLabel label="Narrative Output (EN)" />
              <input
                type="text"
                name="nameEn"
                placeholder="ARTICLE TITLE"
                className="form-input-brutalist"
                value={formData.nameEn}
                onChange={handleChange}
                required
              />
              <textarea
                name="descriptionEn"
                placeholder="STORY DESCRIPTION"
                rows="6"
                className="form-textarea-brutalist"
                value={formData.descriptionEn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-white p-10 space-y-8 text-right">
              <SectionLabel label="আর্কাইভ বিবরণ (BN)" bn />
              <input
                type="text"
                name="nameBn"
                placeholder="পণ্যের নাম"
                className="form-input-brutalist text-right"
                value={formData.nameBn}
                onChange={handleChange}
                required
              />
              <textarea
                name="descriptionBn"
                placeholder="বিস্তারিত কাহিনী"
                rows="6"
                className="form-textarea-brutalist text-right"
                value={formData.descriptionBn}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* DYNAMIC CATEGORY PROTOCOLS */}
          <div className="bg-white p-10 border border-stone-100 space-y-12">
            <SectionLabel
              label={`${activeCategoryType} Specification Matrix —`}
            />

            {/* 1. FASHION */}
            {activeCategoryType === 'FASHION' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                      <Palette size={12} /> Color Swatches
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={hexInput}
                        onChange={e => setHexInput(e.target.value)}
                        placeholder="#000000"
                        className="flex-1 bg-stone-50 p-4 text-[11px] font-black uppercase outline-none focus:border-red-600"
                      />
                      <button
                        type="button"
                        onClick={addColor}
                        className="bg-stone-900 text-white px-6 hover:bg-red-600 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.colors.map((c, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 border border-stone-100 relative group"
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
                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                      <Ruler size={12} /> Size Proportion Grid
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free'].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSize(s)}
                          className={`py-3 text-[10px] font-black border transition-all ${formData.sizes.includes(s) ? 'bg-stone-900 text-white border-stone-900 shadow-xl' : 'bg-transparent text-stone-300 border-stone-100'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-stone-50 pt-10">
                  <InputGroup
                    label="Fabric & GSM"
                    name="fabricGsm"
                    value={formData.fabricGsm}
                    onChange={handleChange}
                    placeholder="e.g. 100% Cotton, 180 GSM"
                  />
                  <InputGroup
                    label="Pattern / Print"
                    name="pattern"
                    value={formData.pattern}
                    onChange={handleChange}
                  />
                  <InputGroup
                    label="Fit Type"
                    name="fitType"
                    value={formData.fitType}
                    onChange={handleChange}
                    placeholder="Oversized / Slim"
                  />
                  <InputGroup
                    label="Care Protocol"
                    name="careGuide"
                    value={formData.careGuide}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* 2. HOME */}
            {activeCategoryType === 'HOME' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputGroup
                  label="Material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Space Placement"
                  name="spacePlacement"
                  value={formData.spacePlacement}
                  onChange={handleChange}
                  placeholder="Living Room"
                />
                <InputGroup
                  label="Aesthetic"
                  name="finishAesthetic"
                  value={formData.finishAesthetic}
                  onChange={handleChange}
                  placeholder="Minimalist"
                />
                <InputGroup
                  label="Durability"
                  name="weightCapacity"
                  value={formData.weightCapacity}
                  onChange={handleChange}
                  placeholder="Capacity e.g. 150kg"
                />
              </div>
            )}

            {/* 3. WEARABLES */}
            {activeCategoryType === 'WEARABLES' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputGroup
                  label="Display Specs"
                  name="displayPanel"
                  value={formData.displayPanel}
                  onChange={handleChange}
                  placeholder="1.96 inch AMOLED"
                />
                <InputGroup
                  label="Health Sensors"
                  name="sensors"
                  value={formData.sensors}
                  onChange={handleChange}
                  placeholder="SpO2, Heart Rate"
                />
                <InputGroup
                  label="Battery Life"
                  name="batteryLife"
                  value={formData.batteryLife}
                  onChange={handleChange}
                  placeholder="7 Days"
                />
                <InputGroup
                  label="Durability"
                  name="ipRating"
                  value={formData.ipRating}
                  onChange={handleChange}
                  placeholder="IP68"
                />
              </div>
            )}

            {/* 4. AUDIO */}
            {activeCategoryType === 'AUDIO' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputGroup
                  label="Driver Tech"
                  name="driverSize"
                  value={formData.driverSize}
                  onChange={handleChange}
                  placeholder="40mm Driver"
                />
                <InputGroup
                  label="ANC Depth"
                  name="ancDepth"
                  value={formData.ancDepth}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Playtime"
                  name="playtime"
                  value={formData.playtime}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Ergonomics"
                  name="ergonomics"
                  value={formData.ergonomics}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* 5. COMPUTING */}
            {activeCategoryType === 'COMPUTING' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputGroup
                  label="CPU"
                  name="processor"
                  value={formData.processor}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Graphics (GPU)"
                  name="gpu"
                  value={formData.gpu}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Memory (RAM)"
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Storage"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* 6. MOBILE */}
            {activeCategoryType === 'MOBILE' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputGroup
                  label="Camera Manifest"
                  name="cameraSpecs"
                  value={formData.cameraSpecs}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Chipset"
                  name="chipset"
                  value={formData.chipset}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Charging"
                  name="chargingWattage"
                  value={formData.chargingWattage}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Display Type"
                  name="osUi"
                  value={formData.osUi}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* 7. FOODS */}
            {activeCategoryType === 'FOODS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputGroup
                  label="Ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Purity Protocol"
                  name="purity"
                  value={formData.purity}
                  onChange={handleChange}
                  placeholder="100% Raw"
                />
                <InputGroup
                  label="Expiry Timeline"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  type="date"
                />
                <InputGroup
                  label="Net Quantity"
                  name="netQuantity"
                  value={formData.netQuantity}
                  onChange={handleChange}
                  placeholder="500g"
                />
              </div>
            )}

            {/* SHARED BASELINE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-stone-50">
              <InputGroup
                label="Net Weight"
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
                label="Model Number"
                name="modelNumber"
                value={formData.modelNumber}
                onChange={handleChange}
                icon={Database}
              />
            </div>
          </div>

          {/* SEO ARCHIVE SECTION */}
          <div className="bg-stone-900 p-10 text-white space-y-8">
            <SectionLabel label="Search Engine Matrix (SEO) —" white />
            <input
              type="text"
              name="metaTitle"
              placeholder="SEO OPTIMIZED TITLE"
              className="w-full bg-stone-800 border-none p-4 text-[10px] font-black uppercase tracking-widest text-stone-100"
              value={formData.metaTitle}
              onChange={handleChange}
            />
            <textarea
              name="metaDescription"
              placeholder="META FRAGMENT DESCRIPTION"
              rows="2"
              className="w-full bg-stone-800 border-none p-4 text-[10px] font-bold text-stone-400"
              value={formData.metaDescription}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: COMMERCIALS TOP & VISUALS BOTTOM */}
        <div className="lg:col-span-4 space-y-12">
          {/* A. Commercial Matrix (MOVED TO TOP) */}
          <div className="bg-white p-10 border border-stone-100 space-y-10">
            <SectionLabel label="Commercial Protocol" />
            <InputGroup
              label="Retail Price (৳)"
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
              label="Archive Stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />

            <div className="space-y-3">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                Global Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-stone-900 text-white p-5 text-[11px] font-black uppercase outline-none cursor-pointer"
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
            <InputGroup
              label="Artisan / Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          {/* B. Visual Manifest (MOVED TO BOTTOM) */}
          <div className="bg-white p-10 border border-stone-100 space-y-8">
            <SectionLabel label="Visual Manifest (3 Slots)" />
            <div className="space-y-4">
              {[0, 1, 2].map(idx => (
                <div key={idx} className="relative group">
                  <label
                    className={`aspect-video border border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${formData.images[idx] ? 'border-stone-100 bg-stone-50' : 'border-stone-200 hover:border-red-600'}`}
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={e => handleSlotUpload(e, idx)}
                    />
                    {formData.images[idx] ? (
                      <img
                        src={formData.images[idx]}
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
                  {formData.images[idx] && (
                    <button
                      type="button"
                      onClick={() => {
                        let n = [...formData.images];
                        n[idx] = '';
                        setFormData({ ...formData, images: n });
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

          <button
            type="submit"
            disabled={formLoading}
            className="w-full py-10 bg-stone-900 text-white text-[12px] font-black uppercase tracking-[0.6em] hover:bg-red-600 transition-all shadow-2xl"
          >
            {formLoading ? 'INGESTING ARCHIVE...' : 'LAUNCH PROTOCOL'}
          </button>
        </div>
      </form>

      {/* AI SIDEBAR */}
      <AnimatePresence>
        {showAiGuide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAiGuide(false)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl p-12 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-3 text-red-600">
                  <Sparkles size={20} />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                    Copy Assistant
                  </span>
                </div>
                <button onClick={() => setShowAiGuide(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-12">
                <div className="p-6 bg-stone-900 text-stone-300 text-[11px] font-mono leading-relaxed rounded-sm italic">
                  "
                  {aiCheatSheet[activeCategoryType]?.prompt ||
                    aiCheatSheet.GENERAL.prompt}
                  "
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      aiCheatSheet[activeCategoryType]?.prompt
                    );
                    toast.success('Prompt Copied');
                  }}
                  className="w-full bg-red-600 text-white py-4 text-[9px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all"
                >
                  Copy Master Prompt
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon: Icon,
  required = false,
  red = false,
}) => (
  <div className="space-y-3">
    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
      {Icon && <Icon size={12} />} {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full bg-transparent border-b border-stone-200 pb-2 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-stone-900 transition-colors ${red ? 'text-red-600 border-red-100' : 'text-stone-900'}`}
    />
  </div>
);

export default AdminAddProductsView;
