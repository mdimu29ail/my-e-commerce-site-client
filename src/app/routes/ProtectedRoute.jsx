import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/shared/Loader';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // ১. ডাটাবেস থেকে ইউজারের তথ্য আসা পর্যন্ত লোডার দেখাবে
  if (loading) {
    return <Loader fullScreen />;
  }

  // ২. ইউজার যদি লগইন না থাকে, তাকে লগইন পেজে পাঠিয়ে দিবে
  // state={{ from: location }} ব্যবহার করা হয়েছে যাতে লগইন করার পর
  // ইউজার ঠিক সেই পেজেই ফিরে আসতে পারে যেখানে সে যাওয়ার চেষ্টা করছিল।
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
