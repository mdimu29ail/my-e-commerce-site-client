import React, { createContext, useContext, useState, useEffect } from 'react';
import { useChat } from './ChatContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { socket } = useChat();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (data) => {
        setNotifications((prev) => [data, ...prev]);
        // Optional: Add browser notification logic here
      });

      return () => {
        socket.off('notification');
      };
    }
  }, [socket]);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
