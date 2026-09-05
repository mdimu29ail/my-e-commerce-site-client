import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Loader2,
  Minus,
  ShieldCheck,
  ArrowLeft,
  KeySquare,
  Hash,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const { t } = useTranslation();
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // --- স্টেটস ---
  const [step, setStep] = useState('form'); // 'form' or 'verify'
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const { name, email, phone, password, confirmPassword, role } = formData;

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ধাপ ১: সরাসরি রেজিস্ট্রেশন (OTP বাদ দেওয়া হয়েছে)
  const handleRegisterSubmit = async e => {
    e.preventDefault();

    // ১. পাসওয়ার্ড ম্যাচ চেক
    if (password !== confirmPassword)
      return toast.error('Narrative Error: Passwords do not match.');

    setLoading(true);
    try {
      // সরাসরি ইউজারের ডাটা ব্যাকএন্ডে পাঠানো হচ্ছে
      // নোট: আপনার ব্যাকএন্ডে যদি ওটিপি বাধ্যতামূলক থাকে, তবে ৫০০ এরর আসতে পারে।
      // সেক্ষেত্রে ব্যাকএন্ড থেকে ওটিপি চেক করার অংশটুকু রিমুভ/কমেন্ট করতে হবে।
      const result = await register({ name, email, phone, password, role });

      if (result.success) {
        toast.success('Archive Identity Established Successfully');
        navigate('/');
      } else {
        toast.error(result.message || 'Authentication Protocol Failed');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      toast.error('Manifest submission failed (500 Error). Check Backend.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ওটিপি ভেরিফিকেশন ফাংশনটি নিচে কমেন্ট করা হলো
   * আপনার রিকোয়েস্ট অনুযায়ী এটি এখন ব্যবহৃত হচ্ছে না
   */
  /*
  const handleVerifyOTP = async e => {
    e.preventDefault();
    if (otp.length < 6) return toast.error('Incomplete verification fragment.');
    setLoading(true);
    const result = await register({ name, email, phone, password, role, otp });
    setLoading(false);
    // ... logic
  };
  */

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20 font-sans selection:bg-red-50 selection:text-red-600">
      <div className="max-w-xl w-full bg-white border border-stone-100 p-10 md:p-16 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-stone-100" />

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div
              key="form-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4 text-red-600 mb-2">
                  <div className="h-[1px] w-8 bg-red-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.6em]">
                    New Manifest
                  </span>
                  <div className="h-[1px] w-8 bg-red-600" />
                </div>
                <h1 className="text-5xl md:text-7xl font-light text-stone-900 tracking-tighter leading-none uppercase">
                  Enroll <br />
                  <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
                    — archive.
                  </span>
                </h1>
              </div>

              <form className="space-y-10" onSubmit={handleRegisterSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    className={`py-4 border text-[10px] font-black uppercase tracking-[0.3em] transition-all ${role === 'user' ? 'bg-stone-900 text-white shadow-2xl' : 'text-stone-300 border-stone-50 hover:border-stone-900'}`}
                  >
                    Archive Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'seller' })}
                    className={`py-4 border text-[10px] font-black uppercase tracking-[0.3em] transition-all ${role === 'seller' ? 'bg-stone-900 text-white shadow-2xl' : 'text-stone-300 border-stone-50 hover:border-stone-900'}`}
                  >
                    Curator / Seller
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                  <HumanistInput
                    label="Legal Name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="JOHN DOE"
                    icon={<User size={14} />}
                  />
                  <HumanistInput
                    label="Email manifest"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="CLIENT@ATELIER.COM"
                    icon={<Mail size={14} />}
                  />
                  <div className="md:col-span-2">
                    <HumanistInput
                      label="Contact Line"
                      name="phone"
                      value={phone}
                      onChange={handleChange}
                      placeholder="+880 1XXX-XXXXXX"
                      icon={<Phone size={14} />}
                    />
                  </div>
                  <HumanistInput
                    label="Access Cipher"
                    name="password"
                    type="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={<Lock size={14} />}
                  />
                  <HumanistInput
                    label="Confirm Cipher"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={<Lock size={14} />}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 text-white py-6 rounded-full font-black text-[11px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-red-600 transition-all shadow-2xl active:scale-95 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Submit Manifest{' '}
                      <Send
                        size={16}
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* OTP UI Section Commented Out */}
          {/*
          {step === 'verify' && (
             <motion.div ... > ... </motion.div>
          )}
          */}
        </AnimatePresence>

        <div className="text-center mt-16 pt-8 border-t border-stone-50">
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em]">
            Already a member? —{' '}
            <Link
              to="/login"
              className="text-red-600 font-black hover:underline transition-all"
            >
              Atelier Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// লিনিয়ার হিউম্যানিস্ট ইনপুট কম্পোনেন্ট
const HumanistInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
}) => (
  <div className="space-y-4 group">
    <div className="flex items-center gap-3">
      <span className="text-stone-300 group-focus-within:text-red-600 transition-colors">
        {icon}
      </span>
      <label className="text-[9px] font-black text-stone-400 uppercase tracking-[0.4em] group-focus-within:text-red-600 transition-colors">
        {label} —
      </label>
    </div>
    <input
      name={name}
      type={type}
      required
      value={value}
      onChange={onChange}
      className="w-full bg-transparent border-b border-stone-100 py-3 text-[13px] font-bold text-stone-900 placeholder:text-stone-200 focus:outline-none focus:border-red-600 transition-all duration-700 uppercase tracking-widest"
      placeholder={placeholder}
    />
  </div>
);

export default Register;
