import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShieldAlert,
  UserX,
  UserCheck,
  Mail,
  Search,
  Minus,
  Hash,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../../../../components/shared/Loader';

const ModeratorSecurityView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/users`, {
        withCredentials: true,
      });
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const toggleSuspension = async (userId, status) => {
    try {
      await axios.put(
        `${API_URL}/users/${userId}/role`,
        { isBlocked: status },
        { withCredentials: true }
      );
      toast.warning(status ? 'IDENTITY SUSPENDED' : 'IDENTITY RESTORED');
      setUsers(prev =>
        prev.map(u => (u._id === userId ? { ...u, isBlocked: status } : u))
      );
    } catch (err) {
      toast.error('SECURITY PROTOCOL FAILED');
    }
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-12 font-sans pb-32">
      <div className="border-b border-stone-100 pb-12 mt-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <Minus size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Security Matrix
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter uppercase leading-none">
            Access <br />
            <span className="italic font-serif text-red-600 lowercase">
              — filtration.
            </span>
          </h2>
        </div>
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300"
            size={16}
          />
          <input
            type="text"
            placeholder="INGEST IDENTITY EMAIL..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-100 text-[11px] font-black uppercase tracking-widest outline-none focus:border-red-600 shadow-xl"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[9px] font-black uppercase text-stone-400 tracking-[0.3em] border-b border-stone-100">
                <th className="px-10 py-8">Citizen Identity</th>
                <th className="px-10 py-8 text-center">Access Integrity</th>
                <th className="px-10 py-8 text-right">Manifest Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map(user => (
                <tr
                  key={user._id}
                  className="hover:bg-stone-50/30 transition-all"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-10 h-10 bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-900 font-black text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[12px] font-black text-stone-900 uppercase tracking-tighter">
                          {user.name}
                        </p>
                        <p className="text-[10px] font-bold text-stone-400 lowercase italic">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span
                      className={`px-4 py-1.5 border text-[8px] font-black uppercase tracking-widest ${user.isBlocked ? 'border-red-200 text-red-600 bg-red-50' : 'border-emerald-200 text-emerald-600 bg-emerald-50'}`}
                    >
                      {user.isBlocked ? 'Suspended' : 'Verified'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button
                      onClick={() =>
                        toggleSuspension(user._id, !user.isBlocked)
                      }
                      className={`p-3 border transition-all ${user.isBlocked ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-red-600 border-stone-100 hover:border-red-600'}`}
                    >
                      {user.isBlocked ? (
                        <UserCheck size={16} />
                      ) : (
                        <UserX size={16} />
                      )}
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

export default ModeratorSecurityView;
