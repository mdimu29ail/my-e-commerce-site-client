import React, { Suspense } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/AppRoutes';
import Navbar from '../components/layout/Navbar';
import Loader from '../components/shared/Loader';

function AppContent() {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/seller') ||
    location.pathname.startsWith('/moderator') ||
    location.pathname.startsWith('/user');

  return (
    <div className="container  mx-auto flex flex-col min-h-screen">
      {!isDashboardRoute && <Navbar />}
      <main className="flex-grow ">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[70vh]">
              <Loader />
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </main>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
