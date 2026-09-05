import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [globalMessages, setGlobalMessages] = useState([]);
  const [activeChat, _setActiveChat] = useState(() => {
    try {
      const cached = localStorage.getItem('activeChat');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [activeProduct, setActiveProduct] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // 🔴 1. UNIVERSAL SAFE ID EXTRACTOR
  const extractId = useCallback(entity => {
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
  }, []);

  // activeChatRef to safely access activeChat in listeners without re-binding
  const activeChatRef = useRef(activeChat);

  const setActiveChat = useCallback(chat => {
    activeChatRef.current = chat;
    _setActiveChat(chat);
    if (chat) {
      try {
        localStorage.setItem('activeChat', JSON.stringify(chat));
      } catch (e) {
        console.error('Failed to cache activeChat in localStorage:', e);
      }
    } else {
      localStorage.removeItem('activeChat');
    }
  }, []);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const currentUserId = extractId(user);
  const currentUserIdRef = useRef(currentUserId);
  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await axios.get(`${API_URL}/messages/conversations`, {
        withCredentials: true,
      });
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, [API_URL, isAuthenticated]);

  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const endpoint =
        user?.role === 'admin' || user?.role === 'moderator'
          ? `${API_URL}/users`
          : `${API_URL}/users/chat-users`;

      const { data } = await axios.get(endpoint, {
        withCredentials: true,
      });
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [API_URL, isAuthenticated, user?.role]);

  const fetchMessages = useCallback(
    async otherUserId => {
      const cleanId = extractId(otherUserId);
      if (!cleanId) return;
      try {
        const { data } = await axios.get(`${API_URL}/messages/${cleanId}`, {
          withCredentials: true,
        });
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    [API_URL, extractId]
  );

  const markMessagesAsRead = useCallback(
    async senderId => {
      const cleanId = extractId(senderId);
      if (!cleanId) return;
      try {
        await axios.put(
          `${API_URL}/messages/read/${cleanId}`,
          {},
          { withCredentials: true }
        );
        fetchConversations();
        setMessages(prev =>
          prev.map(m =>
            extractId(m.sender) === cleanId ? { ...m, isRead: true } : m
          )
        );
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    },
    [API_URL, fetchConversations, extractId]
  );

  const createConversation = async receiverId => {
    try {
      const { data } = await axios.post(
        `${API_URL}/messages/conversations`,
        { receiverId: extractId(receiverId) },
        { withCredentials: true }
      );
      fetchConversations();
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  };

  // Keep callback refs so socket listeners never need to re-bind when state/callbacks change
  const fetchConversationsRef = useRef(fetchConversations);
  useEffect(() => {
    fetchConversationsRef.current = fetchConversations;
  }, [fetchConversations]);

  const markMessagesAsReadRef = useRef(markMessagesAsRead);
  useEffect(() => {
    markMessagesAsReadRef.current = markMessagesAsRead;
  }, [markMessagesAsRead]);

  const socketRef = useRef(null);

  // Sync activeChat message loading
  useEffect(() => {
    const activeId = extractId(activeChat);
    if (activeId) {
      fetchMessages(activeId);
      markMessagesAsRead(activeId);
    } else {
      setMessages([]);
    }
  }, [activeChat, fetchMessages, markMessagesAsRead, extractId]);

  // 🔴 2. SOCKET CONNECTION & EVENT LISTENERS
  // Only connect/reconnect on authentication/user changes to prevent reconnection loops & memory leaks
  useEffect(() => {
    if (!isAuthenticated || !currentUserId) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    const token = document.cookie
      .split(';')
      .find(row => row.trim().startsWith('jwt='))
      ?.split('=')[1];

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      auth: { token: token ? decodeURIComponent(token) : undefined },
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('getOnlineUsers', usersList => {
      setOnlineUsers(Array.isArray(usersList) ? usersList.map(String) : []);
    });

    newSocket.on('userStatusUpdate', ({ userId, status }) => {
      const cleanUserId = String(userId);
      setOnlineUsers(prev =>
        status === 'online'
          ? [...new Set([...prev, cleanUserId])]
          : prev.filter(id => id !== cleanUserId)
      );
    });

    // 🔴 REALTIME RECEIVE MESSAGE: match using extractId against activeChatRef.current
    newSocket.on('receiveMessage', newMessage => {
      if (!newMessage) return;
      const currentActive = activeChatRef.current;
      const activeId = extractId(currentActive);
      const senderId = extractId(newMessage.sender);
      const receiverId = extractId(newMessage.receiver);

      // Only add to active messages if it corresponds to the current open chat
      if (activeId && (senderId === activeId || receiverId === activeId)) {
        setMessages(prev => {
          const exists = prev.some(
            m => extractId(m._id) === extractId(newMessage._id)
          );
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }

      // Automatically mark as read if User B is currently viewing User A's chat
      if (activeId && senderId === activeId) {
        markMessagesAsReadRef.current?.(senderId);
      }

      // Always update conversations list/sidebar in real-time
      fetchConversationsRef.current?.();
    });

    // 🔴 REALTIME SENT MESSAGE CONFIRMATION FOR SENDER
    newSocket.on('messageSent', sentMessage => {
      if (!sentMessage) return;
      const currentActive = activeChatRef.current;
      const activeId = extractId(currentActive);
      const receiverId = extractId(sentMessage.receiver);
      const senderId = extractId(sentMessage.sender);

      if (activeId && (receiverId === activeId || senderId === activeId)) {
        setMessages(prev => {
          let replaced = false;
          const updated = prev.map(m => {
            if (
              !replaced &&
              m.isOptimistic &&
              extractId(m.receiver) === receiverId &&
              m.message === sentMessage.message
            ) {
              replaced = true;
              return sentMessage;
            }
            return m;
          });

          if (replaced) return updated;

          const exists = updated.some(
            m => extractId(m._id) === extractId(sentMessage._id)
          );
          if (exists) return updated;
          return [...updated, sentMessage];
        });
      }
      fetchConversationsRef.current?.();
    });

    newSocket.on('messagesRead', ({ readerId }) => {
      const cleanReaderId = extractId(readerId);
      setMessages(prev =>
        prev.map(m =>
          extractId(m.receiver) === cleanReaderId
            ? { ...m, isRead: true }
            : m
        )
      );
    });

    newSocket.on('receiveGlobalMessage', msg => {
      setGlobalMessages(prev => [...prev, msg]);
    });

    newSocket.on('displayTyping', data => {
      const currentActive = activeChatRef.current;
      if (
        currentActive &&
        extractId(data?.senderId) === extractId(currentActive)
      ) {
        setIsTyping(true);
      }
    });

    newSocket.on('hideTyping', data => {
      const currentActive = activeChatRef.current;
      if (
        !data?.senderId ||
        (currentActive && extractId(data.senderId) === extractId(currentActive))
      ) {
        setIsTyping(false);
      }
    });

    return () => {
      newSocket.off('getOnlineUsers');
      newSocket.off('userStatusUpdate');
      newSocket.off('receiveMessage');
      newSocket.off('messageSent');
      newSocket.off('messagesRead');
      newSocket.off('receiveGlobalMessage');
      newSocket.off('displayTyping');
      newSocket.off('hideTyping');
      newSocket.close();
      socketRef.current = null;
      setSocket(null);
    };
  }, [isAuthenticated, currentUserId, SOCKET_URL, extractId]);

  // 🔴 3. STABLE MESSAGE SENDING FUNCTIONS
  const sendMessage = useCallback(
    (receiverId, message, productId = null) => {
      const targetReceiverId = extractId(receiverId);
      const messageText = message?.toString().trim();
      if (!targetReceiverId || !messageText) return;

      const myId = currentUserIdRef.current;

      const tempMessage = {
        _id: 'temp_' + Date.now(),
        sender: myId,
        receiver: targetReceiverId,
        message: messageText,
        product: productId,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      setMessages(prev => [...prev, tempMessage]);

      const currentSocket = socketRef.current;
      if (currentSocket && currentSocket.connected) {
        currentSocket.emit('sendMessage', {
          receiverId: targetReceiverId,
          message: messageText,
          productId,
        });
      }
    },
    [extractId]
  );

  const sendGlobalMessage = useCallback(message => {
    const currentSocket = socketRef.current;
    if (currentSocket && currentSocket.connected && message) {
      currentSocket.emit('sendGlobalMessage', { message });
    }
  }, []);

  const sendTypingStatus = useCallback(
    (receiverId, status) => {
      const targetReceiverId = extractId(receiverId);
      const currentSocket = socketRef.current;
      if (currentSocket && currentSocket.connected && targetReceiverId) {
        currentSocket.emit(status ? 'typing' : 'stopTyping', {
          receiverId: targetReceiverId,
        });
      }
    },
    [extractId]
  );

  const value = {
    socket,
    conversations,
    users,
    messages,
    globalMessages,
    activeChat,
    setActiveChat,
    activeProduct,
    setActiveProduct,
    isTyping,
    onlineUsers,
    fetchConversations,
    fetchUsers,
    fetchMessages,
    markMessagesAsRead,
    sendMessage,
    sendGlobalMessage,
    sendTypingStatus,
    createConversation,
    extractId,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
