import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({ message, btnText, btnLink }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <PackageOpen size={64} className="text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700">{message}</h3>
      {btnLink && (
        <Link
          to={btnLink}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
        >
          {btnText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
