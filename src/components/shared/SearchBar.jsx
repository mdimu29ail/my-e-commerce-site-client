import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = e => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?search=${keyword}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full bg-gray-100 border-none rounded-full py-2 pl-4 pr-10 focus:ring-2 focus:ring-blue-500"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />
      <button
        type="submit"
        className="absolute right-3 top-2 text-gray-500 hover:text-blue-600"
      >
        <Search size={20} />
      </button>
    </form>
  );
};

export default SearchBar;
