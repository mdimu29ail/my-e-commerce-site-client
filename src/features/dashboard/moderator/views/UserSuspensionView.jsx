import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserX,
  UserCheck,
  Search,
  RefreshCw,
  Minus,
  Mail,
  Hash,
  ShieldAlert,
  Activity,
  ShieldCheck,
  User,
  Filter,
  AlertTriangle,
  Power,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const UserSuspensionView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchCitizenRegistry();
  }, []);

  const fetchCitizenRegistry = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/users`, {
        withCredentials: true,
      });
      // লজিক: শুধুমাত্র সাধারণ ইউজারদের (role: 'user') ফিল্টার করা
      const citizensOnly = data.filter(u => u.role === 'user');
      setUsers(citizensOnly);
    } catch (err) {
      toast.error('IDENTITY ARCHIVE SYNC FAILED');
    } finally {
      setLoading(false);
    }
  };

  const toggleAccessProtocol = async (userId, currentStatus) => {
    setActionLoading(userId);
    const newStatus = !currentStatus; // true means Blocked, false means Active
    const loadingToast = toast.loading(
      newStatus ? 'Terminating access...' : 'Restoring access...'
    );

    try {
      // আপনার ব্যাকএন্ড রাুট অনুযায়ী এটি আপডেট করা হয়েছে
      await axios.put(
        `${API_URL}/users/${userId}/role`,
        { isBlocked: newStatus },
        { withCredentials: true }
      );

      toast.update(loadingToast, {
        render: newStatus ? 'IDENTITY SUSPENDED' : 'IDENTITY RESTORED',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });

      // লোকাল স্টেট আপডেট
      setUsers(prev =>
        prev.map(u => (u._id === userId ? { ...u, isBlocked: newStatus } : u))
      );
    } catch (err) {
      toast.update(loadingToast, {
        render: 'SECURITY OVERRIDE FAILED',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12 mt-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Identity Filtration Protocol
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Citizen <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — suspension.
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-4">
          <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">
            Registry Count: {users.length}
          </p>
          <button
            onClick={fetchCitizenRegistry}
            className="p-4 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. SEARCH MATRIX */}
      <div className="bg-white border border-stone-100 flex items-center px-8 py-2 shadow-2xl shadow-stone-200/20">
        <Search size={18} className="text-stone-300" />
        <input
          type="text"
          placeholder="SEARCH IDENTITY BY NAME OR EMAIL..."
          className="w-full p-4 text-[11px] font-black uppercase tracking-widest outline-none placeholder:text-stone-200"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 3. CITIZEN LEDGER TABLE */}
      <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Citizen Identity</th>
                <th className="px-10 py-8">Identity Meta</th>
                <th className="px-10 py-8 text-center">Integrity Status</th>
                <th className="px-10 py-8 text-right">Access Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-32 text-center">
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
                      No Citizen Matches in Registry.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr
                    key={u._id}
                    className="hover:bg-stone-50/30 transition-all group"
                  >
                    {/* Identity Column */}
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white text-xs font-black relative overflow-hidden border border-stone-800">
                          {u.avatar || u.image ? (
                            <img
                              src={u.avatar || u.image}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          ) : (
                            u.name?.charAt(0)
                          )}
                          <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[12px] font-black text-stone-900 uppercase tracking-tight">
                            {u.name}
                          </p>
                          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest italic font-serif">
                            Member since: {new Date(u.createdAt).getFullYear()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Meta Column */}
                    <td className="px-10 py-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-stone-500">
                          <Mail size={12} />
                          <span className="text-[10px] font-medium lowercase tracking-tight">
                            {u.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-stone-300">
                          <Hash size={10} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">
                            ID: {u._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Integrity Status */}
                    <td className="px-10 py-8 text-center">
                      <span
                        className={`px-4 py-1.5 border text-[8px] font-black uppercase tracking-widest ${u.isBlocked ? 'border-red-200 text-red-600 bg-red-50/50' : 'border-emerald-100 text-emerald-600 bg-emerald-50/50'}`}
                      >
                        {u.isBlocked ? 'Suspended' : 'Operational'}
                      </span>
                    </td>

                    {/* Action Column */}
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">
                        <button
                          onClick={() =>
                            toggleAccessProtocol(u._id, u.isBlocked)
                          }
                          disabled={actionLoading === u._id}
                          className={`p-3 border transition-all shadow-sm flex items-center gap-2 ${u.isBlocked ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-stone-100 text-red-600 hover:bg-red-600 hover:text-white'}`}
                        >
                          {actionLoading === u._id ? (
                            <RefreshCw className="animate-spin" size={16} />
                          ) : u.isBlocked ? (
                            <UserCheck size={16} />
                          ) : (
                            <Power size={16} />
                          )}
                          <span className="text-[8px] font-black uppercase tracking-widest">
                            {u.isBlocked ? 'Restore' : 'Suspend'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Info Footer */}
      <div className="p-10 bg-stone-900 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <ShieldAlert size={150} />
        </div>
        <div className="space-y-2 relative z-10">
          <h4 className="text-xl font-light tracking-tighter uppercase leading-none">
            Access{' '}
            <span className="italic font-serif text-red-600">integrity.</span>
          </h4>
          <p className="text-[9px] font-bold text-stone-500 uppercase tracking-[0.3em]">
            Suspension protocol immediately restricts all ingress and commerce
            capability.
          </p>
        </div>
        <div className="flex items-center gap-4 relative z-10 border border-stone-800 px-6 py-3">
          <ShieldCheck size={14} className="text-red-600" />
          <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">
            Moderator Supervision Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserSuspensionView;
