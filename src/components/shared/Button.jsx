import React from 'react';
import { RefreshCw } from 'lucide-react'; // প্রিমিয়াম লোডার আইকন

const Button = ({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  ...props
}) => {
  // সব বাটনের সাধারণ স্টাইল (Humanist Typography & Padding)
  const baseStyle =
    'group relative inline-flex items-center justify-center px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-700 disabled:opacity-50 disabled:pointer-events-none active:scale-95';

  // ভেরিয়েন্ট অনুযায়ী কালার এবং বর্ডার (Luxury Palette)
  const variants = {
    primary:
      'bg-stone-900 text-white hover:bg-red-600 shadow-2xl shadow-stone-200/50',
    secondary:
      'bg-red-600 text-white hover:bg-stone-900 shadow-2xl shadow-red-200/50',
    outline:
      'border border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-900 bg-transparent',
    danger:
      'bg-white border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200',
    ghost: 'bg-transparent text-stone-400 hover:text-stone-900', // শুধু টেক্সটের জন্য
  };

  return (
    <button
      disabled={isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* লোডিং অবস্থায় আইকন ঘুরবে, আর নরমাল অবস্থায় বাটনের টেক্সট দেখাবে */}
      {isLoading ? (
        <RefreshCw size={16} className="animate-spin" strokeWidth={2} />
      ) : (
        <span className="flex items-center justify-center gap-3">
          {children}
        </span>
      )}
    </button>
  );
};

export default Button;
