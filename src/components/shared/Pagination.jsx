import React from 'react';
import { ArrowLeft, ArrowRight, Minus } from 'lucide-react';

/**
 * @param {number} currentPage - বর্তমান পেজ নম্বর
 * @param {number} totalPages - মোট কতগুলো পেজ আছে
 * @param {function} onPageChange - পেজ পরিবর্তন করার ফাংশন
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // পেজ নম্বরগুলো জেনারেট করার লজিক
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'dash', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          'dash',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          'dash',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          'dash',
          totalPages
        );
      }
    }
    return pages;
  };

  // নাম্বার ফরম্যাটিং (১ এর জায়গায় ০১ দেখানোর জন্য)
  const formatPage = num => (num < 10 ? `0${num}` : num);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-8 font-sans selection:bg-red-50 selection:text-red-600">
      {/* ১. প্রিভিয়াস বাটন */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 hover:text-stone-900 transition-colors disabled:opacity-20 disabled:pointer-events-none"
        aria-label="Previous Archive"
      >
        <ArrowLeft
          size={16}
          strokeWidth={1.5}
          className="group-hover:-translate-x-2 transition-transform duration-500"
        />
        <span>Previous</span>
      </button>

      {/* ২. পেজ নম্বরগুলো (Editorial Indexing) */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === 'dash' ? (
              <span className="px-2 text-stone-300">
                <Minus size={16} strokeWidth={1} />
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`relative h-12 w-12 flex items-center justify-center text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${
                  currentPage === page
                    ? 'bg-stone-900 text-white shadow-2xl'
                    : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {formatPage(page)}

                {/* একটিভ পেজের নিচে লাল ড্যাশ */}
                {currentPage === page && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-red-600" />
                )}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ৩. নেক্সট বাটন */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 hover:text-stone-900 transition-colors disabled:opacity-20 disabled:pointer-events-none"
        aria-label="Next Archive"
      >
        <span>Next</span>
        <ArrowRight
          size={16}
          strokeWidth={1.5}
          className="group-hover:translate-x-2 transition-transform duration-500"
        />
      </button>
    </div>
  );
};

export default Pagination;
