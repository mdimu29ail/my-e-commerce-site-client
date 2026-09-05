import React from 'react';

const Loader = ({ fullScreen }) => {
  return (
    <div
      className={`${fullScreen ? 'h-screen w-full fixed inset-0 bg-white/80' : 'h-40'} flex items-center justify-center z-[999]`}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );
};

export default Loader;
