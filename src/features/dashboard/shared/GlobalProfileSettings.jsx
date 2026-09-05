import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  RefreshCw,
  CheckCircle2,
  Store,
  Minus,
  Hash,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Activity,
  Fingerprint,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { uploadImageToImgBB } from '../../../utils/uploadImage';
import Loader from '../../../components/shared/Loader';
import { motion } from 'framer-motion';

const GlobalProfileSettings = () => {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    shopName: '',
    division: '',
    district: '',
    upazila: '',
    detailAddress: '',
    image: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        shopName: user.shopName || '',
        division: user.address?.division || '',
        district: user.address?.district || '',
        upazila: user.address?.upazila || '',
        detailAddress: user.address?.detailAddress || '',
        image: user.photoURL || user.image || '',
      });
    }
  }, [user]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024)
      return toast.warn('Image size must be < 2MB');

    setImgLoading(true);
    try {
      const url = await uploadImageToImgBB(file);
      if (url) {
        setFormData(prev => ({ ...prev, image: url }));
        toast.success('Visual Manifest Synced');
      }
    } catch (err) {
      toast.error('Visual sync failed');
    } finally {
      setImgLoading(false);
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const updatePayload = {
        name: formData.name,
        phone: formData.phone,
        shopName: formData.shopName,
        image: formData.image,
        address: {
          division: formData.division,
          district: formData.district,
          upazila: formData.upazila,
          detailAddress: formData.detailAddress,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/users/profile`,
        updatePayload,
        { withCredentials: true }
      );
      setUser({ ...data, photoURL: data.photoURL || data.image });
      toast.success('IDENTITY PROTOCOL SYNCHRONIZED');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sync failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loader fullScreen />;

  return (
    <form
      onSubmit={handleUpdate}
      className="max-w-[1450px] mx-auto space-y-16 pb-32 font-sans selection:bg-red-50 selection:text-red-600 px-6"
    >
      {/* 1. EDITORIAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12 mt-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Global Personal Identity
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Profile <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — manifest.
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-4">
          <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">
            Protocol Status: Verified
          </p>
          <button
            type="submit"
            disabled={loading || imgLoading}
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
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 2. IDENTITY MATRIX (Left Panel) */}
        <div className="lg:col-span-7 space-y-12">
          <div className="bg-white border border-stone-100 p-10 space-y-10 relative overflow-hidden group">
            <SectionLabel label="Core Identity —" />

            {/* Visual Manifest (Profile Picture) */}
            <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
              <div className="relative group/avatar">
                <div className="w-40 h-40 bg-stone-900 overflow-hidden border border-stone-200 flex items-center justify-center text-white transition-all duration-700">
                  {formData.image || user?.photoURL ? (
                    <img
                      src={formData.image || user.photoURL}
                      alt="Manifest"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/avatar:scale-110"
                    />
                  ) : (
                    <span className="text-4xl font-light italic font-serif">
                      {user?.name?.charAt(0)}
                    </span>
                  )}
                </div>
                <label className="absolute -bottom-4 -right-4 bg-red-600 text-white p-4 cursor-pointer hover:bg-stone-900 shadow-2xl transition-all z-10">
                  {imgLoading ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <Camera size={18} />
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </label>
              </div>

              <div className="space-y-4 flex-1 text-center md:text-left">
                <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">
                  {user.name}
                </h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <span className="text-[9px] font-black uppercase tracking-widest border border-stone-900 px-3 py-1">
                    {user.role} Member
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-tight">
                    <Mail size={12} /> {user.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <InputGroup
                label="Full Identity Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Communication Protocol (Phone)"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                icon={Phone}
              />

              {user.role === 'seller' && (
                <div className="md:col-span-2">
                  <InputGroup
                    label="Atelier / Shop Nomenclature"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    icon={Store}
                    red
                  />
                </div>
              )}
            </div>

            {/* Bottom Hairline Decor */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
          </div>
        </div>

        {/* 3. LOGISTICS MANIFEST (Right Panel) */}
        <div className="lg:col-span-5 space-y-12">
          <div className="bg-stone-900 p-10 text-white space-y-10 shadow-2xl relative overflow-hidden group">
            <MapPin
              className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000"
              size={120}
            />
            <SectionLabel label="Logistics Ingress —" white />

            <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-2 gap-8">
                <InputGroup
                  label="Division"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  white
                />
                <InputGroup
                  label="District"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  white
                />
              </div>
              <InputGroup
                label="Upazila / Sub-District"
                name="upazila"
                value={formData.upazila}
                onChange={handleChange}
                white
              />

              <div className="space-y-3">
                <label className="text-[9px] font-black text-stone-500 uppercase tracking-widest block">
                  Detailed Manifest Address
                </label>
                <textarea
                  name="detailAddress"
                  value={formData.detailAddress}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-stone-800 border-none p-5 text-[11px] font-medium tracking-wider text-stone-100 focus:ring-1 focus:ring-red-600 resize-none"
                  placeholder="Enter full physical coordinates..."
                />
              </div>
            </div>
          </div>

          {/* Verification Protocol Badge */}
          <div className="p-10 bg-white border border-stone-100 space-y-6 group relative">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-stone-50 flex items-center justify-center text-red-600 border border-stone-100">
                <Fingerprint size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black text-stone-900 uppercase tracking-widest">
                  Biometric verification
                </p>
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                  ID: {user._id?.slice(-12).toUpperCase()}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
          </div>
        </div>
      </div>
    </form>
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
  white = false,
  red = false,
  required = false,
}) => (
  <div className="space-y-3 relative group/input">
    <label
      className={`text-[9px] font-black uppercase tracking-widest block ${white ? 'text-stone-500' : 'text-stone-400'}`}
    >
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          size={14}
          className={`absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within/input:text-red-600 transition-colors`}
        />
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full bg-transparent border-b pb-3 text-[12px] font-black uppercase tracking-widest focus:outline-none transition-all ${Icon ? 'pl-8' : ''}
          ${white ? 'border-stone-700 text-white focus:border-red-600' : 'border-stone-200 text-stone-900 focus:border-red-600'}
          ${red ? 'text-red-600' : ''}`}
      />
    </div>
  </div>
);

export default GlobalProfileSettings;

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../../context/AuthContext';
// import { useTranslation } from 'react-i18next';
// import axios from 'axios';
// import {
//   User,
//   Mail,
//   Phone,
//   Camera,
//   Save,
//   RefreshCw,
//   Store,
//   Minus,
//   Fingerprint,
//   MapPin,
// } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { uploadImageToImgBB } from '../../../utils/uploadImage';
// import Loader from '../../../components/shared/Loader';
// import { motion } from 'framer-motion';

// const GlobalProfileSettings = () => {
//   const { user, setUser } = useAuth(); // setUser নিশ্চিত করুন context-এ আছে
//   const [loading, setLoading] = useState(false);
//   const [imgLoading, setImgLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     shopName: '',
//     division: '',
//     district: '',
//     upazila: '',
//     detailAddress: '',
//     image: '',
//   });

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || '',
//         phone: user.phone || '',
//         shopName: user.shopName || '',
//         division: user.address?.division || '',
//         district: user.address?.district || '',
//         upazila: user.address?.upazila || '',
//         detailAddress: user.address?.detailAddress || '',
//         image: user.photoURL || user.image || '',
//       });
//     }
//   }, [user]);

//   const handleUpdate = async e => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const API_URL =
//         import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
//       const updatePayload = {
//         name: formData.name,
//         phone: formData.phone,
//         shopName: formData.shopName,
//         image: formData.image,
//         address: {
//           division: formData.division,
//           district: formData.district,
//           upazila: formData.upazila,
//           detailAddress: formData.detailAddress,
//         },
//       };

//       const { data } = await axios.put(
//         `${API_URL}/users/profile`,
//         updatePayload,
//         { withCredentials: true }
//       );

//       // গুরুত্বপূর্ণ: রিলোড ছাড়া ডাটা দেখানোর জন্য setUser আপডেট
//       setUser({ ...user, ...data, photoURL: data.photoURL || data.image });
//       toast.success('IDENTITY PROTOCOL SYNCHRONIZED');
//     } catch (error) {
//       toast.error('Sync failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageUpload = async e => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setImgLoading(true);
//     try {
//       const url = await uploadImageToImgBB(file);
//       if (url) {
//         setFormData(prev => ({ ...prev, image: url }));
//         toast.success('Visual Manifest Ready');
//       }
//     } catch (err) {
//       toast.error('Upload failed');
//     } finally {
//       setImgLoading(false);
//     }
//   };

//   if (!user) return <Loader fullScreen />;

//   return (
//     <form
//       onSubmit={handleUpdate}
//       className="max-w-[1450px] mx-auto space-y-16 pb-32 font-sans px-6"
//     >
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12 mt-12">
//         <div className="space-y-6">
//           <div className="flex items-center gap-4 text-red-600">
//             <div className="h-[1px] w-12 bg-red-600" />
//             <span className="text-[10px] font-black uppercase tracking-[0.5em]">
//               Global Personal Identity
//             </span>
//           </div>
//           <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
//             Profile <br />{' '}
//             <span className="italic font-serif text-red-600 lowercase tracking-normal">
//               — manifest.
//             </span>
//           </h2>
//         </div>
//         <button
//           type="submit"
//           disabled={loading || imgLoading}
//           className="bg-stone-900 text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all shadow-2xl"
//         >
//           {loading ? (
//             <RefreshCw className="animate-spin" size={14} />
//           ) : (
//             'COMMIT CHANGES'
//           )}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
//         {/* Identity Matrix */}
//         <div className="lg:col-span-7 space-y-12">
//           <div className="bg-white border border-stone-50 p-10 space-y-10 relative overflow-hidden group">
//             <div className="flex flex-col md:flex-row items-center gap-10">
//               <div className="relative">
//                 <div className="w-40 h-40 bg-stone-900 flex items-center justify-center text-white overflow-hidden">
//                   {formData.image ? (
//                     <img
//                       src={formData.image}
//                       className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
//                       alt=""
//                     />
//                   ) : (
//                     <span className="text-4xl italic font-serif">
//                       {user.name.charAt(0)}
//                     </span>
//                   )}
//                 </div>
//                 <label className="absolute -bottom-4 -right-4 bg-red-600 text-white p-4 cursor-pointer hover:bg-stone-900 transition-all shadow-2xl">
//                   {imgLoading ? (
//                     <RefreshCw className="animate-spin" size={18} />
//                   ) : (
//                     <Camera size={18} />
//                   )}
//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={handleImageUpload}
//                     accept="image/*"
//                   />
//                 </label>
//               </div>
//               <div className="space-y-4">
//                 <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">
//                   {user.name}
//                 </h3>
//                 <span className="inline-block text-[9px] font-black uppercase tracking-widest border border-stone-900 px-3 py-1">
//                   {user.role} Archive
//                 </span>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//               <InputGroup
//                 label="Full Identity Name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//               <InputGroup
//                 label="Contact Protocol"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//               />
//               {user.role === 'seller' && (
//                 <div className="md:col-span-2">
//                   <InputGroup
//                     label="Atelier Nomenclature"
//                     name="shopName"
//                     value={formData.shopName}
//                     onChange={handleChange}
//                     red
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Logistics Manifest */}
//         <div className="lg:col-span-5">
//           <div className="bg-stone-900 p-10 text-white space-y-8 shadow-2xl relative overflow-hidden group">
//             <MapPin
//               className="absolute top-0 right-0 p-8 opacity-5"
//               size={120}
//             />
//             <div className="flex items-center gap-3 mb-6">
//               <Minus size={14} className="text-red-600" />
//               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">
//                 Logistics Ingress
//               </span>
//             </div>
//             <div className="space-y-8 relative z-10">
//               <div className="grid grid-cols-2 gap-8">
//                 <InputGroup
//                   label="Division"
//                   name="division"
//                   value={formData.division}
//                   onChange={handleChange}
//                   white
//                 />
//                 <InputGroup
//                   label="District"
//                   name="district"
//                   value={formData.district}
//                   onChange={handleChange}
//                   white
//                 />
//               </div>
//               <InputGroup
//                 label="Upazila"
//                 name="upazila"
//                 value={formData.upazila}
//                 onChange={handleChange}
//                 white
//               />
//               <textarea
//                 name="detailAddress"
//                 value={formData.detailAddress}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full bg-stone-800 border-none p-5 text-[11px] font-medium tracking-wider text-stone-100 focus:ring-1 focus:ring-red-600 resize-none uppercase"
//                 placeholder="Detailed coordinates..."
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// const InputGroup = ({
//   label,
//   value,
//   onChange,
//   name,
//   white = false,
//   red = false,
// }) => (
//   <div className="space-y-3 group/input">
//     <label
//       className={`text-[9px] font-black uppercase tracking-widest block ${white ? 'text-stone-500' : 'text-stone-400'}`}
//     >
//       {label} —
//     </label>
//     <input
//       name={name}
//       value={value}
//       onChange={onChange}
//       className={`w-full bg-transparent border-b pb-3 text-[12px] font-black uppercase tracking-widest focus:outline-none transition-all ${white ? 'border-stone-700 text-white focus:border-red-600' : 'border-stone-200 text-stone-900 focus:border-red-600'} ${red ? 'text-red-600' : ''}`}
//     />
//   </div>
// );

// export default GlobalProfileSettings;
