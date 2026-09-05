// export default RoleRoute;
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/shared/Loader';

const RoleRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullScreen />;

  // ১. লগইন না থাকলে লগইন পেজে পাঠান
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ২. রোল পারমিশন না থাকলে হোম পেজে পাঠান
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // ৩. সব ঠিক থাকলে ড্যাশবোর্ডে ঢুকতে দিন
  return <Outlet />;
};

export default RoleRoute;
