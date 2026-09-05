import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  Search,
  Trash2,
  Edit3,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Award,
  Save,
  Coins,
  Star,
  Minus,
  Mail,
  Phone,
  Hash,
  ArrowUpRight,
  ShieldAlert,
  User,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../../components/shared/Loader';
import Modal from '../../../../components/shared/Modal';

const AdminUserView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    role: '',
    loyaltyPoints: 0,
  });

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
    } catch (err) {
      toast.error('Identity sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = u => {
    setSelectedUser(u);
    setEditData({
      name: u.name,
      phone: u.phone || '',
      role: u.role,
      loyaltyPoints: u.loyaltyPoints || 0,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        ...editData,
        loyaltyPoints: Number(editData.loyaltyPoints),
      };
      await axios.put(`${API_URL}/users/${selectedUser._id}/role`, payload, {
        withCredentials: true,
      });
      toast.success('Registry protocol updated.');
      setIsEditOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}/users/${selectedUser._id}`, {
        withCredentials: true,
      });
      toast.success('Identity erased from registry.');
      setIsDeleteOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error('Erasure protocol failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(
    u =>
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === 'All' || u.role === roleFilter)
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
              Global Ingress Control
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Identity <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — registry.
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

      {/* 2. STATS MATRIX (Ledger Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20">
        <StatCard id="01" label="Total Members" value={users.length} />
        <StatCard
          id="02"
          label="Loyalty Pool"
          value={users.reduce((acc, u) => acc + (u.loyaltyPoints || 0), 0)}
        />
        <StatCard
          id="03"
          label="Authority Check"
          value={users.filter(u => u.role === 'admin').length}
        />
      </div>

      {/* 3. SEARCH & FILTER MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-stone-100 border border-stone-100">
        <div className="md:col-span-8 bg-white p-6 flex items-center gap-6">
          <Search size={18} className="text-stone-300" />
          <input
            type="text"
            placeholder="SEARCH IDENTITY OR EMAIL..."
            className="flex-1 text-[11px] font-black uppercase tracking-widest outline-none placeholder:text-stone-200"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:col-span-4 bg-white p-6 flex items-center gap-6 border-l border-stone-100">
          <select
            className="flex-1 text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="All">All Protocols</option>
            <option value="admin">Administrators</option>
            <option value="seller">Merchants</option>
            <option value="user">Customers</option>
          </select>
        </div>
      </div>

      {/* 4. IDENTITY TABLE (The Ledger) */}
      <div className="bg-white border border-stone-100 overflow-hidden shadow-2xl shadow-stone-200/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Member Identity</th>
                <th className="px-10 py-8 text-center">Authority</th>
                <th className="px-10 py-8 text-center">Loyalty Ingress</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredUsers.map(u => (
                <tr
                  key={u._id}
                  className="hover:bg-stone-50/30 transition-all group"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white font-black text-xs relative overflow-hidden">
                        <div className="w-full h-full relative flex items-center justify-center">
                          {(u.avatar || u.image) && (
                            <img
                              src={u.avatar || u.image}
                              className="w-full h-full object-cover absolute inset-0"
                              alt=""
                              onError={(e) => (e.target.style.display = 'none')}
                            />
                          )}
                          <span className="uppercase">{u.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[12px] font-black text-stone-900 uppercase tracking-tighter leading-tight">
                          {u.name}
                        </h4>
                        <div className="flex items-center gap-2 text-stone-400">
                          <Mail size={10} />
                          <span className="text-[10px] font-medium tracking-tight lowercase">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={getRoleStyle(u.role)}>{u.role}</span>
                  </td>
                  <td className="px-10 py-8 text-center font-black text-stone-900">
                    <div className="inline-flex items-center gap-2 border border-stone-100 px-4 py-1.5">
                      <Award size={12} className="text-red-600" />
                      <span className="text-[11px] font-black tracking-widest">
                        {u.loyaltyPoints || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-3 bg-white border border-stone-100 text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all shadow-sm"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setIsDeleteOpen(true);
                        }}
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

      {/* 5. EDIT MODAL (Update Authority) */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Update Authority Protocol"
        size="md"
      >
        <form onSubmit={handleUpdate} className="space-y-10 py-6">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                Full Name —
              </label>
              <input
                type="text"
                className="w-full bg-stone-50 border-b border-stone-200 p-4 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-red-600"
                value={editData.name}
                onChange={e =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </div>

            <div className="bg-stone-900 p-10 text-white space-y-6 relative overflow-hidden">
              <Coins
                className="absolute top-0 right-0 opacity-5 -mr-4 -mt-4"
                size={100}
              />
              <p className="text-[9px] font-black text-red-600 uppercase tracking-[0.4em] text-center">
                Reward Protocol (Loyalty)
              </p>
              <input
                type="number"
                className="w-full bg-transparent border-none text-center text-5xl font-black tracking-tighter focus:ring-0"
                value={editData.loyaltyPoints}
                onChange={e =>
                  setEditData({ ...editData, loyaltyPoints: e.target.value })
                }
              />
              <p className="text-[8px] text-stone-500 font-bold uppercase tracking-widest text-center">
                Adjust manually for special achievements.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                  Authority Role —
                </label>
                <select
                  className="w-full bg-transparent border-b border-stone-200 pb-3 text-[11px] font-black uppercase outline-none cursor-pointer"
                  value={editData.role}
                  onChange={e =>
                    setEditData({ ...editData, role: e.target.value })
                  }
                >
                  <option value="user">USER / CUSTOMER</option>
                  <option value="seller">MERCHANT / SELLER</option>
                  <option value="moderator">SYSTEM MODERATOR</option>
                  <option value="admin">ATELIER ADMIN</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                  Communication —
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-stone-200 pb-3 text-[11px] font-black uppercase outline-none"
                  value={editData.phone}
                  onChange={e =>
                    setEditData({ ...editData, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={actionLoading}
            className="w-full py-8 bg-stone-900 text-white text-[12px] font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all shadow-2xl flex items-center justify-center gap-4"
          >
            {actionLoading ? (
              <RefreshCw className="animate-spin" />
            ) : (
              <>
                <Save size={16} /> Commit Protocol Updates
              </>
            )}
          </button>
        </form>
      </Modal>

      {/* 6. DELETE MODAL (Identity Erasure) */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Danger Zone"
      >
        <div className="text-center py-10 space-y-8">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <ShieldAlert size={40} />
          </div>
          <p className="text-sm font-black text-stone-900 uppercase tracking-tighter">
            Are you absolutely sure?
          </p>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-loose px-6">
            Erasing identity "{selectedUser?.name}" will permanently remove all
            associated loyalty records and access rights.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-10">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="py-4 border border-stone-200 text-stone-400 font-black text-[10px] uppercase tracking-widest"
            >
              Abort
            </button>
            <button
              onClick={handleDeleteUser}
              disabled={actionLoading}
              className="py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl"
            >
              {actionLoading ? 'Erasing...' : 'Confirm Erasure'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// --- Signature Styles ---
const getRoleStyle = role => {
  const styles = {
    admin: 'border-stone-900 text-stone-900 bg-stone-50',
    seller: 'border-red-600 text-red-600 bg-red-50/20',
    user: 'border-stone-100 text-stone-300',
  };
  return `px-4 py-1.5 border text-[9px] font-black uppercase tracking-widest ${styles[role] || styles.user}`;
};

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

export default AdminUserView;
