import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Search,
  Minus,
  Plus,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import ChatWindow from './components/ChatWindow';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const {
    conversations,
    users,
    fetchConversations,
    fetchUsers,
    activeChat,
    setActiveChat,
    fetchMessages,
    markMessagesAsRead,
    onlineUsers,
    extractId,
  } = useChat();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  const urlUserId = searchParams.get('userId');

  // ১. ইনিশিয়াল ডাটা লোড
  useEffect(() => {
    fetchConversations();
    fetchUsers();
  }, [fetchConversations, fetchUsers]);

  // ২. URL সার্চ প্যারাম ও activeChat সিনক্রোনাইজেশন (রিফ্রেশেও স্টেট ধরে রাখার জন্য)
  useEffect(() => {
    if (urlUserId) {
      if (extractId(activeChat) !== urlUserId) {
        // কনভারসেশন বা ইউজার লিস্ট থেকে পার্টনার অবজেক্ট খোঁজা
        const convMatch = conversations.find(
          c => extractId(c.userDetails) === urlUserId
        );
        if (convMatch) {
          setActiveChat(convMatch.userDetails);
          return;
        }

        const userMatch = users.find(u => extractId(u) === urlUserId);
        if (userMatch) {
          setActiveChat(userMatch);
          return;
        }

        // যদি লোকালস্টোরেজে আগেই থাকে
        if (extractId(activeChat) === urlUserId) {
          return;
        }

        // ডাটাবেস লোড হওয়ার পূর্ব পর্যন্ত স্টাব সেট করা
        setActiveChat({ _id: urlUserId, name: 'Chat' });
      }
    } else if (activeChat) {
      // যদি লোকালস্টোরেজ থেকে activeChat রিস্টোর হয় কিন্তু URL এ প্যারাম না থাকে
      const activeId = extractId(activeChat);
      if (activeId) {
        setSearchParams({ userId: activeId }, { replace: true });
      }
    }
  }, [urlUserId, conversations, users, activeChat, setActiveChat, setSearchParams, extractId]);

  const handleSelectChat = partner => {
    const partnerId = extractId(partner);
    if (!partnerId) return;

    setActiveChat(partner);
    setSearchParams({ userId: partnerId });
    fetchMessages(partnerId);

    const conv = conversations.find(
      c => extractId(c.userDetails) === partnerId
    );
    if (conv?.unreadCount > 0) {
      markMessagesAsRead(partnerId);
    }
  };

  const handleCloseChat = () => {
    setActiveChat(null);
    setSearchParams({});
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUserId = extractId(user);
  const filteredUsers = users.filter(
    u =>
      extractId(u) !== currentUserId &&
      u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-10 py-10 h-[calc(100vh-140px)] font-sans selection:bg-red-50 selection:text-red-600">
      <div className="bg-white border border-stone-100 h-full flex overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
        {/* --- ১. সাইডবার: কনভার্সেশন আর্কাইভ --- */}
        <aside
          className={`w-full md:w-[400px] border-r border-stone-100 flex flex-col bg-[#FBFBFB] ${activeChat ? 'hidden md:flex' : 'flex'}`}
        >
          {/* হেডার সেকশন */}
          <div className="p-8 border-b border-stone-100 space-y-8 bg-white">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-red-600">
                <Minus size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                  The Archive Chat
                </span>
              </div>
              <h2 className="text-3xl font-light uppercase tracking-tighter text-stone-900">
                Inbox{' '}
                <span className="italic font-serif text-red-600 font-normal lowercase tracking-normal">
                  — messages.
                </span>
              </h2>
            </div>

            {/* লিনিয়ার সার্চ বার */}
            <div className="relative group">
              <Search
                className="absolute right-0 top-3 text-stone-300 group-focus-within:text-red-600 transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder={
                  t('chat.search_placeholder') || 'SEARCH CONTACTS...'
                }
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-b border-stone-200 py-3 text-[10px] font-bold tracking-[0.2em] focus:outline-none focus:border-red-600 transition-all uppercase placeholder:text-stone-300"
              />
            </div>
          </div>

          {/* চ্যাট লিস্ট */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
            {filteredConversations.length === 0 && !searchTerm && (
              <div className="py-10 text-center space-y-4 opacity-20">
                <MessageSquare size={32} className="mx-auto" strokeWidth={1} />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  No active dialogues
                </p>
              </div>
            )}

            {filteredConversations.map(conv => {
              const partnerId = extractId(conv.userDetails);
              const isActive = extractId(activeChat) === partnerId;
              const isOnline = onlineUsers?.some(id => extractId(id) === partnerId);

              return (
                <div
                  key={conv._id}
                  onClick={() => handleSelectChat(conv.userDetails)}
                  className={`relative p-6 flex items-center gap-5 cursor-pointer transition-all duration-500 group border border-transparent ${
                    isActive
                      ? 'bg-white border-stone-100 shadow-xl z-10'
                      : 'hover:bg-white hover:border-stone-50'
                  }`}
                >
                  {/* একটিভ মার্কার লাইন */}
                  {isActive && (
                    <motion.div
                      layoutId="active-chat"
                      className="absolute left-0 top-0 h-full w-[3px] bg-red-600"
                    />
                  )}

                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 bg-stone-900 flex items-center justify-center text-white font-black text-sm uppercase transition-transform group-hover:scale-105">
                      {conv.userDetails.image ? (
                        <img
                          src={conv.userDetails.image}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        conv.userDetails.name.charAt(0)
                      )}
                    </div>
                    {isOnline && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4
                        className={`text-[12px] font-black uppercase tracking-widest truncate ${isActive ? 'text-red-600' : 'text-stone-900'}`}
                      >
                        {conv.userDetails.name}
                      </h4>
                      {conv.unreadCount > 0 && (
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                      )}
                    </div>
                    <p
                      className={`text-[11px] truncate uppercase tracking-tighter ${isActive ? 'text-stone-500' : 'text-stone-400'}`}
                    >
                      {conv.lastMessage || 'No messages yet —'}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* কুইক কানেক্ট (অ্যাডমিন, মডারেটর, সেলার) */}
            {!searchTerm && filteredUsers.length > 0 && (
              <div className="mt-8 pt-8 border-t border-stone-100 px-4">
                <p className="text-[9px] font-black uppercase text-stone-300 tracking-[0.4em] mb-6 flex items-center gap-2">
                  <Plus size={10} /> Quick Connect
                </p>
                {filteredUsers.map(u => (
                  <div
                    key={u._id}
                    onClick={() => handleSelectChat(u)}
                    className="p-4 mb-4 flex items-center gap-4 cursor-pointer border border-stone-100 hover:border-red-600 bg-white transition-all group"
                  >
                    <div className="w-10 h-10 bg-stone-900 text-white flex items-center justify-center font-black text-xs uppercase">
                      {u.image ? (
                        <img src={u.image} className="w-full h-full object-cover" alt="" />
                      ) : (
                        u.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-stone-900 uppercase tracking-widest group-hover:text-red-600 transition-colors">
                        {u.name}
                      </h4>
                      <span className="text-[8px] text-red-600 font-bold uppercase tracking-widest">
                        — {u.role === 'seller' ? (u.shopName || 'Seller') : u.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* নিউ কানেকশন সাজেশন (সার্চ রেজাল্ট) */}
            {searchTerm && filteredUsers.length > 0 && (
              <div className="mt-8 pt-8 border-t border-stone-100 px-4">
                <p className="text-[9px] font-black uppercase text-stone-300 tracking-[0.4em] mb-6 flex items-center gap-2">
                  <Plus size={10} /> Search Results
                </p>
                {filteredUsers.map(u => (
                  <div
                    key={u._id}
                    onClick={() => handleSelectChat(u)}
                    className="p-4 mb-4 flex items-center gap-4 cursor-pointer border border-stone-100 hover:border-red-600 bg-white transition-all"
                  >
                    <div className="w-10 h-10 bg-stone-100 flex items-center justify-center text-stone-400 font-black text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-stone-900 uppercase tracking-widest">
                        {u.name}
                      </h4>
                      <span className="text-[8px] text-red-600 font-bold uppercase tracking-widest">
                        — {u.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* --- ২. মেইন: চ্যাট উইন্ডো এলাকা --- */}
        <main
          className={`flex-1 flex flex-col bg-white relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}
        >
          {activeChat ? (
            <>
              {/* মোবাইল ব্যাক বাটন */}
              <button
                onClick={handleCloseChat}
                className="md:hidden absolute top-6 left-6 z-50 p-2 bg-stone-900 text-white rounded-full"
              >
                <ArrowLeft size={18} />
              </button>
              <ChatWindow />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="relative mb-10">
                <div className="w-32 h-32 border border-stone-100 rounded-full flex items-center justify-center">
                  <MessageSquare
                    size={40}
                    className="text-stone-100"
                    strokeWidth={1}
                  />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-[-20px] border border-dashed border-stone-100 rounded-full"
                />
              </div>
              <h3 className="text-xl font-light uppercase tracking-[0.5em] text-stone-300">
                Dialogue{' '}
                <span className="italic font-serif lowercase text-red-600">
                  — required.
                </span>
              </h3>
              <p className="mt-4 text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] max-w-xs">
                Select a contact from your archive to begin a secure transaction
                or query.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
