

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.jsx';
import './index.css'; // গ্লোবাল সিএসএস (Tailwind বা সাধারণ CSS)
import './i18n'; // মাল্টি-ল্যাঙ্গুয়েজ কনফিগারেশন ইমপোর্ট

// ফিউচারে এখানে আমরা Context Providers যুক্ত করব
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { ChatProvider } from './context/ChatContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* এখানে আপনার সব Context Provider থাকবে */}
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ChatProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </ChatProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
