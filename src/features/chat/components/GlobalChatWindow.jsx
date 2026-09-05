import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../../context/ChatContext';
import { useAuth } from '../../../context/AuthContext';
import {
  ArrowLeft,
  Users,
  Shield,
  Globe,
  Clock,
  Minus,
  Sparkle,
} from 'lucide-react';
import MessageInput from './MessageInput';

const GlobalChatWindow = () => {
  const { globalMessages, sendGlobalMessage, setActiveChat } = useChat();
  const { user } = useAuth();
  const scrollRef = useRef(null);

  // অটো-স্ক রোল হ্যান্ডলার
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [globalMessages]);

  const handleSendMessage = message => {
    sendGlobalMessage(message);
  };

  // Safe Date Formatter
  const formatTime = timestamp => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    return isNaN(date.getTime())
      ? 'Just now'
      : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Safe ID Extractor
  const extractId = entity => {
    if (!entity) return '';
    if (typeof entity === 'string') return entity;
    return entity._id || entity.id || String(entity);
  };

  const currentUserId = extractId(user);

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden font-sans selection:bg-red-50 selection:text-red-600">
      {/* --- ১. হেডার --- */}
      <header className="px-6 py-6 border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveChat(null)}
            className="md:hidden p-2 hover:bg-stone-50 rounded-full transition-all text-stone-400"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="relative">
            <div className="w-14 h-14 bg-stone-900 flex items-center justify-center text-white shadow-2xl overflow-hidden">
              <Globe size={24} strokeWidth={1.5} className="opacity-80" />
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 bg-red-600 text-white text-[7px] font-black uppercase tracking-tighter border-2 border-white">
              Live
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-stone-900 flex items-center gap-2">
              Public Square
              <Shield size={12} className="text-red-600" />
            </h4>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400">
                global conversation{' '}
                <span className="italic font-serif lowercase tracking-normal text-red-600">
                  — archive.
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 border border-stone-100 px-5 py-2.5 bg-stone-50/50">
          <Users size={14} className="text-stone-400" strokeWidth={1.5} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-600">
            Open Access
          </span>
        </div>
      </header>

      {/* --- ২. চ্যাট বডি --- */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 bg-[#FDFCFB] no-scrollbar relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-stone-100 opacity-30 pointer-events-none" />

        <AnimatePresence initial={false}>
          {globalMessages.map((msg, index) => {
            const msgSenderId = extractId(msg.senderId || msg.sender);
            const isMe = msgSenderId === currentUserId;
            const messageKey =
              msg._id || `global_${index}_${msg.timestamp || Date.now()}`;

            return (
              <motion.div
                key={messageKey}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full relative z-10`}
              >
                <div className="flex flex-col space-y-3 max-w-[85%] md:max-w-[65%]">
                  {!isMe && (
                    <div className="flex items-center gap-3 ml-1">
                      <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.4em]">
                        {msg.senderName || 'Atelier Member'}
                      </span>
                      <div className="h-[1px] w-8 bg-stone-200" />
                    </div>
                  )}

                  <div
                    className={`p-6 border transition-all duration-500 relative ${
                      isMe
                        ? 'bg-stone-900 text-white border-stone-900 shadow-2xl shadow-stone-200'
                        : 'bg-white text-stone-800 border-stone-100'
                    }`}
                  >
                    {!isMe && (
                      <Minus
                        size={18}
                        className="text-red-600 absolute -left-3 top-6"
                      />
                    )}

                    <p className="text-[13px] md:text-sm font-medium leading-relaxed uppercase tracking-wider break-words">
                      {msg.message}
                    </p>

                    <div
                      className={`flex items-center gap-3 mt-4 text-[9px] font-black uppercase tracking-[0.2em] opacity-40 ${
                        isMe ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <Clock size={10} />
                      <span>{formatTime(msg.timestamp)}</span>
                      {isMe && <span className="text-red-500">— Outgoing</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* --- ৩. ইনপুট এরিয়া --- */}
      <div className="bg-white px-6 py-6 md:px-12 md:py-10 border-t border-stone-100">
        <MessageInput onSendMessage={handleSendMessage} />

        <div className="mt-6 flex flex-col items-center gap-3 opacity-20 group hover:opacity-40 transition-all cursor-default">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-stone-900" />
            <Sparkle size={14} className="text-stone-900" />
            <div className="h-[1px] w-12 bg-stone-900" />
          </div>
          <p className="text-[8px] font-bold text-stone-500 uppercase tracking-[0.5em] text-center">
            Encrypted Community Dialogue — established 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalChatWindow;
