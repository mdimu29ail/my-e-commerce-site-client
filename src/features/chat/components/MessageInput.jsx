import React, { useState, useRef, useEffect } from 'react';
import { useChat as useChatData } from '../../../context/ChatContext';
import { Smile, Plus, ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const MessageInput = ({ onSendMessage }) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // activeProduct-ও চ্যাট কনটেক্সট থেকে নেওয়া হয়েছে
  const { sendMessage, activeChat, activeProduct, sendTypingStatus, extractId } =
    useChatData();

  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Safely extract string IDs
  const activeChatId = extractId ? extractId(activeChat) : (activeChat?._id || '');
  const activeProductId = extractId ? extractId(activeProduct) : (activeProduct?._id || null);

  // ইনপুট বক্সের হাইট রিসেট হেলপার
  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
    }
  };

  const handleSend = e => {
    if (e) e.preventDefault();
    const messageText = text.trim();
    if (!messageText) return;

    if (onSendMessage) {
      onSendMessage(messageText);
    } else if (activeChatId) {
      // 🔴 FIX: pure string ID ব্যবহার করে পাঠানো হচ্ছে
      sendMessage(activeChatId, messageText, activeProductId || null);

      if (isTypingRef.current) {
        sendTypingStatus(activeChatId, false);
        isTypingRef.current = false;
      }
    }

    // স্টেট ও হাইট রিসেট
    setText('');
    resetTextareaHeight();
  };

  const handleKeyDown = e => {
    if (!activeChatId) return;

    // Enter চাপলে মেসেজ সেন্ড হবে (Shift + Enter দিলে নতুন লাইন হবে)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      return;
    }

    // টাইপিং স্টেটাস পাঠানো
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTypingStatus(activeChatId, true);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        sendTypingStatus(activeChatId, false);
        isTypingRef.current = false;
      }
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="bg-white font-sans selection:bg-red-50 selection:text-red-600">
      <form onSubmit={handleSend} className="relative flex items-end gap-4">
        {/* ১. আর্টস্যানাল এটাচমেন্ট বাটন */}
        <button
          type="button"
          className="mb-3 w-10 h-10 flex items-center justify-center text-stone-300 hover:text-red-600 hover:bg-stone-50 transition-all duration-500 rounded-full border border-transparent hover:border-stone-100"
          title="Archive File"
        >
          <Plus size={20} strokeWidth={1.5} />
        </button>

        {/* ২. মেইন ইনপুট এরিয়া */}
        <div className="flex-1 relative group">
          <div className="absolute -top-6 left-0 flex items-center gap-2 opacity-0 group-focus-within:opacity-100 transition-all duration-500">
            <div className="h-[1px] w-4 bg-red-600" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-red-600">
              Drafting Dialogue
            </span>
          </div>

          <textarea
            ref={textareaRef}
            rows="1"
            className="w-full bg-transparent border-b border-stone-100 py-4 text-[13px] font-medium text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-red-600 transition-all duration-700 uppercase tracking-widest resize-none no-scrollbar"
            placeholder={t('chat.type_placeholder') || 'ENTER YOUR MESSAGE —'}
            value={text}
            onChange={e => {
              setText(e.target.value);
              e.target.style.height = 'inherit';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={handleKeyDown}
            style={{ maxHeight: '150px' }}
          />
        </div>

        {/* ৩. অ্যাকশন বাটনস গ্রূপ */}
        <div className="flex items-center gap-2 mb-2.5">
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center text-stone-300 hover:text-stone-900 transition-colors"
          >
            <Smile size={18} strokeWidth={1.5} />
          </button>

          {/* ৪. সেন্ড বাটন */}
          <AnimatePresence mode="wait">
            {text.trim() && (
              <motion.button
                key="send-btn"
                initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 20 }}
                type="submit"
                className="w-11 h-11 bg-stone-900 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-2xl shadow-stone-200 transition-all duration-500"
              >
                <ArrowUp size={20} strokeWidth={2.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
