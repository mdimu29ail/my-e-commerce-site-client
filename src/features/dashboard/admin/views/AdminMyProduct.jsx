import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Package,
  Search,
  Trash2,
  Plus,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Minus,
  Archive,
  ArrowUpRight,
  Hash,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../../context/AuthContext';
import Loader from '../../../../components/shared/Loader';

const AdminMyProduct = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (user?._id) fetchMyProducts();
  }, [user]);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}/products?pageSize=1000&seller=${user._id}`,
        {
          withCredentials: true,
        }
      );

      const myItems = data.products.filter(p => {
        const sellerId = p.seller?._id || p.seller;
        return sellerId?.toString() === user?._id?.toString();
      });

      setProducts(myItems);
    } catch (err) {
      toast.error('Archive Sync Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently erase "${name}" from your collection?`)) {
      try {
        await axios.delete(`${API_URL}/products/${id}`, {
          withCredentials: true,
        });
        toast.success('Piece removed from Archive');
        fetchMyProducts();
      } catch (err) {
        toast.error('Deletion Protocol Failed');
      }
    }
  };

  const filteredProducts = products.filter(
    p =>
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.nameBn && p.nameBn.includes(searchTerm))
  );

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
              Personal Inventory Ledger
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            My <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — archive.
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchMyProducts}
            className="p-4 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/admin/add-product"
            className="bg-stone-900 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 hover:bg-red-600 transition-all shadow-2xl"
          >
            <Plus size={16} /> Ingest Piece
          </Link>
        </div>
      </div>

      {/* 2. SEARCH & META BAR */}
      <div className="bg-white border border-stone-100 flex items-center px-8 py-2 shadow-2xl shadow-stone-200/20">
        <Search size={18} className="text-stone-300" />
        <input
          type="text"
          placeholder="SEARCH YOUR LEDGER..."
          className="w-full p-4 text-[11px] font-black uppercase tracking-widest outline-none placeholder:text-stone-200"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="hidden md:flex items-center gap-3 text-[9px] font-black text-stone-400 uppercase tracking-widest">
          <Archive size={12} className="text-red-600" /> Total {products.length}{' '}
          Pieces
        </div>
      </div>

      {/* 3. ARCHIVE TABLE (The Ledger) */}
      <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Product Narrative</th>
                <th className="px-10 py-8">Category & Reference</th>
                <th className="px-10 py-8 text-center">Pricing</th>
                <th className="px-10 py-8 text-center">Stock</th>
                <th className="px-10 py-8 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredProducts.map((product, idx) => (
                <tr
                  key={product._id}
                  className="hover:bg-stone-50/30 transition-all group"
                >
                  {/* Narrative Column */}
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-6">
                      <div className="relative w-16 h-20 bg-stone-100 overflow-hidden border border-stone-100">
                        <img
                          src={
                            product.images[0] ||
                            'https://via.placeholder.com/100'
                          }
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt=""
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[12px] font-black text-stone-900 uppercase tracking-tighter leading-tight">
                          {product.nameEn}
                        </p>
                        <p className="text-[10px] font-medium text-stone-400 italic font-serif">
                          {product.nameBn}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Reference Column */}
                  <td className="px-10 py-8">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.2em]">
                        {product.category?.nameEn || 'UNCLASSIFIED'}
                      </span>
                      <div className="flex items-center gap-2 text-[8px] font-bold text-stone-300 uppercase tracking-widest">
                        <Hash size={10} /> {product._id.slice(-8).toUpperCase()}
                      </div>
                    </div>
                  </td>

                  {/* Pricing Column */}
                  <td className="px-10 py-8 text-center">
                    <p className="text-lg font-black text-stone-900 tracking-tighter">
                      ৳{product.price.toLocaleString()}
                    </p>
                    {product.discountPrice > 0 && (
                      <p className="text-[9px] font-bold text-stone-300 line-through">
                        ৳{product.discountPrice.toLocaleString()}
                      </p>
                    )}
                  </td>

                  {/* Stock Column */}
                  <td className="px-10 py-8 text-center">
                    <span
                      className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border ${product.stock > 0 ? 'border-emerald-100 text-emerald-600' : 'border-red-100 text-red-600'}`}
                    >
                      {product.stock > 0
                        ? `${product.stock} Units`
                        : 'Depleted'}
                    </span>
                  </td>

                  {/* Protocol (Actions) Column */}
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Link
                        to={`/product/${product._id}`}
                        className="p-3 bg-white border border-stone-100 text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all shadow-sm"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(product._id, product.nameEn)
                        }
                        className="p-3 bg-white border border-stone-100 text-stone-400 hover:text-red-600 hover:border-red-600 transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. EMPTY STATE */}
      {filteredProducts.length === 0 && (
        <div className="py-40 text-center border border-dashed border-stone-100">
          <AlertCircle size={40} className="mx-auto text-stone-100 mb-6" />
          <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
            No Data Found in Ledger.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminMyProduct;
