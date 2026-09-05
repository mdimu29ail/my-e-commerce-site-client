import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Shield,
  Search,
  Trash2,
  RefreshCw,
  Minus,
  User,
  Mail,
  Hash,
  ShieldCheck,
  ShieldAlert,
  MoreHorizontal,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';

const AdminRoleManagementView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/users`, {
        withCredentials: true,
      });
      setUsers(data);
    } catch (error) {
      toast.error('Authority Archive Sync Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const loadingToast = toast.loading('Updating Authorization...');
    try {
      await axios.put(
        `${API_URL}/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      toast.update(loadingToast, {
        render: `Authorization elevated to ${newRole.toUpperCase()}`,
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      fetchUsers();
    } catch (error) {
      toast.update(loadingToast, {
        render: error.response?.data?.message || 'Protocol Failed',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  // --- Intelligence Stats ---
  const stats = useMemo(() => {
    const admins = users.filter(u => u.role === 'admin').length;
    const sellers = users.filter(u => u.role === 'seller').length;
    return { admins, sellers, total: users.length };
  }, [users]);

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Access Protocol Management
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Archive <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — authority.
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchUsers}
            className="p-4 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. STATS GRID (Linear Clostich Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard id="01" label="Total Identities" value={stats.total} />
        <StatCard id="02" label="Administrators" value={stats.admins} />
        <StatCard id="03" label="Merchant Licenses" value={stats.sellers} />
      </div>

      {/* 3. SEARCH MATRIX */}
      <div className="bg-white border border-stone-100 flex items-center px-8 py-2 shadow-2xl shadow-stone-200/20">
        <Search size={18} className="text-stone-300" />
        <input
          type="text"
          placeholder="SEARCH IDENTITY BY NAME OR EMAIL..."
          className="w-full p-4 text-[11px] font-black uppercase tracking-widest outline-none placeholder:text-stone-200"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="hidden md:flex items-center gap-3 text-[9px] font-black text-stone-400 uppercase tracking-widest">
          <Shield size={12} className="text-red-600" /> Secure Encryption Active
        </div>
      </div>

      {/* 4. AUTHORITY LEDGER TABLE */}
      <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Member Identity</th>
                <th className="px-10 py-8">Current Authorization</th>
                <th className="px-10 py-8">Protocol Override</th>
                <th className="px-10 py-8 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredUsers.map((user, idx) => (
                <tr
                  key={user._id}
                  className="hover:bg-stone-50/30 transition-all group"
                >
                  {/* Identity Column */}
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white font-black text-xs relative overflow-hidden">
                        <div className="w-full h-full relative flex items-center justify-center">
                          {(user.avatar || user.photoURL) && (
                            <img
                              src={user.avatar || user.photoURL}
                              className="w-full h-full object-cover absolute inset-0"
                              alt=""
                              onError={(e) => (e.target.style.display = 'none')}
                            />
                          )}
                          <span className="uppercase">{user.name.charAt(0)}</span>
                        </div>
                        <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[12px] font-black text-stone-900 uppercase tracking-tighter leading-tight">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-2 text-stone-400">
                          <Mail size={10} />
                          <span className="text-[10px] font-medium tracking-tight lowercase">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge Column */}
                  <td className="px-10 py-8">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* Override Dropdown Column */}
                  <td className="px-10 py-8">
                    <div className="relative max-w-[200px]">
                      <select
                        value={user.role}
                        onChange={e =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="w-full bg-stone-50 border-none px-4 py-2 text-[10px] font-black uppercase tracking-widest text-stone-600 outline-none cursor-pointer appearance-none hover:bg-stone-100 transition-colors"
                      >
                        <option value="user">Citizen / User</option>
                        <option value="seller">Merchant License</option>
                        <option value="moderator">Registry Moderator</option>
                        <option value="admin">System Architect</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-300">
                        <Minus size={12} className="rotate-90" />
                      </div>
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="px-10 py-8 text-right">
                    <button className="p-3 bg-white border border-stone-100 text-stone-300 hover:text-red-600 hover:border-red-600 transition-all shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components (Theme Consistent) ---

const StatCard = ({ label, value, id }) => (
  <div className="bg-white p-10 space-y-4 relative overflow-hidden group">
    <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors">
      — {id}
    </span>
    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] relative z-10">
      {label}
    </p>
    <h3 className="text-3xl font-black text-stone-900 tracking-tighter uppercase relative z-10">
      {value}
    </h3>
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
  </div>
);

const RoleBadge = ({ role }) => {
  const styles = {
    admin: 'border-stone-900 text-stone-900 bg-stone-900/5',
    moderator: 'border-red-600 text-red-600 bg-red-600/5',
    seller: 'border-stone-400 text-stone-500',
    user: 'border-stone-200 text-stone-300',
  };
  return (
    <span
      className={`px-4 py-1.5 border text-[9px] font-black uppercase tracking-[0.2em] inline-block ${styles[role] || styles.user}`}
    >
      {role === 'admin' ? 'Architect' : role === 'seller' ? 'Merchant' : role}
    </span>
  );
};

export default AdminRoleManagementView;
