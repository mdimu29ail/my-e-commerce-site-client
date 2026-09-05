import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../../context/ChatContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Check,
  CheckCheck,
  ExternalLink,
  X,
  Minus,
  Maximize2,
} from 'lucide-react';
import MessageInput from './MessageInput';

// 🔴 Helper: Pure ID Extraction to safely compare Object vs String IDs
const extractId = entity => {
  if (!entity) return '';
  if (typeof entity === 'string') return entity;
  if (typeof entity === 'object') {
    if (entity._id) {
      return typeof entity._id === 'object'
        ? extractId(entity._id)
        : String(entity._id);
    }
    if (entity.id) {
      return typeof entity.id === 'object'
        ? extractId(entity.id)
        : String(entity.id);
    }
    if (entity.userDetails) {
      return extractId(entity.userDetails);
    }
    if (
      typeof entity.toString === 'function' &&
      entity.toString !== Object.prototype.toString
    ) {
      return entity.toString();
    }
  }
  return String(entity);
};

const ChatWindow = () => {
  // 🔴 1. Direct State Sync: Read directly from useChat() context
  const {
    activeChat,
    messages,
    setActiveChat,
    isTyping,
    onlineUsers,
    activeProduct,
    setActiveProduct,
  } = useChat();

  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔴 2. Auto Scroll to Bottom Ref
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages?.length, isTyping]);

  // 🔴 3. Pure ID Extraction checks
  const isOnline = onlineUsers?.some(
    id => extractId(id) === extractId(activeChat)
  );

  const showProductPreview =
    Boolean(activeProduct) &&
    extractId(activeProduct.sellerId) === extractId(activeChat);

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden font-sans selection:bg-red-50 selection:text-red-600">
      {/* --- ১. এডিটোরিয়াল হেডার --- */}
      <header className="px-6 py-6 border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveChat(null)}
            className="md:hidden p-2 hover:bg-stone-50 rounded-full transition-all text-stone-400"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="relative">
            <div className="w-14 h-14 bg-stone-900 flex items-center justify-center text-white font-black text-sm uppercase shadow-2xl">
              {activeChat?.image ? (
                <img
                  src={activeChat.image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                activeChat?.name?.charAt(0)
              )}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white ${
                isOnline ? 'bg-red-600' : 'bg-stone-300'
              }`}
            />
          </div>

          <div>
            <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-stone-900 flex items-center gap-2">
              {activeChat?.name}
              {activeChat?.role === 'admin' && (
                <ShieldCheck size={14} className="text-red-600" />
              )}
            </h4>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400">
                {isTyping ? (
                  <span className="text-red-600 italic lowercase tracking-normal">
                    writing message —
                  </span>
                ) : (
                  <span
                    className={isOnline ? 'text-red-600' : 'text-stone-300'}
                  >
                    {isOnline
                      ? 'Active in Atelier'
                      : `Offline — ${activeChat?.role || 'User'}`}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
        <button className="p-3 text-stone-300 hover:text-stone-900 transition-colors">
          <Maximize2 size={18} strokeWidth={1.5} />
        </button>
      </header>

      {/* --- ২. চ্যাট বডি --- */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 bg-[#FDFCFB] no-scrollbar">
        {showProductPreview && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-white border-l-4 border-red-600 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative group"
          >
            <button
              onClick={() => setActiveProduct(null)}
              className="absolute -top-3 -right-3 p-2 bg-stone-900 text-white rounded-full z-30"
            >
              <X size={14} />
            </button>
            <div className="flex items-center gap-6">
              <div className="w-20 h-24 bg-stone-50 overflow-hidden border border-stone-100 flex-shrink-0">
                <img
                  src={activeProduct.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-red-600 uppercase tracking-[0.4em]">
                  Inquiry Reference
                </p>
                <h5 className="font-black text-stone-900 text-sm uppercase tracking-widest">
                  {activeProduct.name}
                </h5>
                <p className="text-stone-400 font-bold text-xs uppercase tracking-tighter italic">
                  Value: ৳{activeProduct.price}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                navigate(
                  `/product/${extractId(activeProduct?._id || activeProduct)}`
                )
              }
              className="px-8 py-3 bg-stone-900 text-white text-[9px] font-black uppercase tracking-[0.3em] flex items-center hover:bg-red-600 transition-all"
            >
              Open Archive <ExternalLink size={14} className="ml-3" />
            </button>
          </motion.div>
        )}

        {/* মেসেজ লিস্ট */}
        <div className="space-y-10 flex flex-col">
          {messages &&
            messages.map((msg, index) => {
              const isMe = extractId(msg.sender) === extractId(user);
              const messageKey = extractId(msg._id) || `msg-${index}`;

              return (
                <motion.div
                  key={messageKey}
                  initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex flex-col space-y-3 max-w-[85%] md:max-w-[65%]">
                    <div
                      className={`p-6 border relative ${
                        isMe
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xl'
                          : 'bg-white text-stone-800 border-stone-100'
                      }`}
                    >
                      {!isMe && (
                        <Minus
                          size={20}
                          className="text-red-600 absolute -left-3 top-6"
                        />
                      )}
                      <p className="text-[13px] md:text-sm font-medium leading-relaxed uppercase tracking-wider">
                        {msg.message}
                      </p>
                      <div
                        className={`flex items-center gap-3 mt-4 text-[9px] font-black uppercase tracking-[0.2em] opacity-40 ${
                          isMe ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <span>
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                        <div className="w-4 h-[1px] bg-current" />
                        {isMe &&
                          (msg.isRead ? (
                            <CheckCheck size={14} className="text-red-500" />
                          ) : (
                            <Check size={14} />
                          ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-2 px-6 py-3 bg-white border border-stone-100 text-[10px] font-black uppercase tracking-[0.3em] text-red-600 italic">
              Atelier is writing{' '}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                —
              </motion.span>
            </div>
          </motion.div>
        )}

        {/* 🔴 Auto Scroll target */}
        <div ref={messagesEndRef} className="pb-2" />
      </div>

      <div className="bg-white px-6 py-6 md:px-12 md:py-10 border-t border-stone-100">
        <MessageInput />
        <p className="mt-4 text-[8px] font-bold text-stone-300 uppercase tracking-[0.4em] text-center">
          Secure Encrypted Communication — OmerShop360 Atelier
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
