import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// নিরাপত্তা মিডলওয়্যার ইমপোর্ট (Loaded synchronously as it is small and decides routing)
import RoleRoute from './RoleRoute';
import AdminMarketingView from '../../features/dashboard/admin/views/MarketingCampaignsView';
import UserReturnDetails from '../../features/dashboard/user/views/UserReturnDetails';
import ReturnPage from '../../features/returns/ReturnPage';
import UserWishlistView from '../../features/dashboard/user/views/UserWishlistView';
import UserSupport from '../../features/dashboard/user/views/UserSupport';
import UserSettings from '../../features/dashboard/user/views/UserSettings';
import ForgotPassword from '../../features/auth/ForgotPassword';
import ResetPassword from '../../features/auth/ResetPassword';
import SellerAddProductView from '../../features/dashboard/seller/views/SellerAddProductView';

import HeaderOrchestrationView from '../../features/dashboard/admin/views/HeaderOrchestrationView';

// Lazy loaded components
const Home = lazy(() => import('../../features/home/Home'));
const Login = lazy(() => import('../../features/auth/Login'));
const Register = lazy(() => import('../../features/auth/Register'));
const Shop = lazy(() => import('../../features/products/Shop'));
const ProductDetails = lazy(
  () => import('../../features/products/ProductDetails')
);
const AdminDashboard = lazy(
  () => import('../../features/dashboard/admin/AdminDashboard')
);
const SellerDashboard = lazy(
  () => import('../../features/dashboard/seller/SellerDashboard')
);
const CartPage = lazy(() => import('../../features/cart/CartPage'));
const Checkout = lazy(() => import('../../features/checkout/Checkout'));
const NotFound = lazy(() => import('../../components/shared/NotFound'));

// Seller views
const SellerInventoryView = lazy(
  () => import('../../features/dashboard/seller/views/InventoryView')
);
const SellerAnalyticsView = lazy(
  () => import('../../features/dashboard/seller/views/AnalyticsView')
);
const SellerSettingsView = lazy(
  () => import('../../features/dashboard/seller/views/SettingsView')
);
const SellerCouponManagementView = lazy(
  () => import('../../features/dashboard/seller/views/CouponManagementView')
);
const SellerOrderManagementView = lazy(
  () => import('../../features/dashboard/seller/views/OrderManagementView')
);
const SellerCustomerSupportView = lazy(
  () => import('../../features/dashboard/seller/views/CustomerSupportView')
);

// Admin views
const AdminAnalyticsView = lazy(
  () => import('../../features/dashboard/admin/views/AnalyticsView')
);
const AdminAIAgentView = lazy(
  () => import('../../features/dashboard/admin/views/AIAgentView')
);
const AdminUserApprovalView = lazy(
  () => import('../../features/dashboard/admin/views/UserApprovalView')
);
const AdminRoleManagementView = lazy(
  () => import('../../features/dashboard/admin/views/RoleManagementView')
);
const AdminSettingsView = lazy(
  () => import('../../features/dashboard/admin/views/SettingsView')
);
const AdminInventoryView = lazy(
  () => import('../../features/dashboard/admin/views/InventoryView')
);
const AdminCategoryManagementView = lazy(
  () => import('../../features/dashboard/admin/views/CategoryManagementView')
);
const AdminAddProductsView = lazy(
  () => import('../../features/dashboard/admin/views/AdminAddProductsView')
);
const AdminMyProduct = lazy(
  () => import('../../features/dashboard/admin/views/AdminMyProduct')
);
const AdminOrderManagementView = lazy(
  () => import('../../features/dashboard/admin/views/OrderManagementView')
);
const AdminReportsView = lazy(
  () => import('../../features/dashboard/admin/views/ReportsView')
);
const AdminUserView = lazy(
  () => import('../../features/dashboard/admin/views/UsersView')
);
const AdminCouponManagementView = lazy(
  () => import('../../features/dashboard/admin/views/CouponManagementView')
);
const AdminSupportTicketsView = lazy(
  () => import('../../features/dashboard/admin/views/SupportTicketsView')
);
const AdminReviewsView = lazy(
  () => import('../../features/dashboard/admin/views/ReviewsView')
);

// Checkout & order success & tracking
const OrderSuccess = lazy(
  () => import('../../features/checkout/components/OrderSuccess')
);
const TrackingPage = lazy(() => import('../../features/tracking/TrackingPage'));

// User views
const UserDashboard = lazy(
  () => import('../../features/dashboard/user/UserDashboard')
);
const UserMyOrders = lazy(
  () => import('../../features/dashboard/user/views/UserMyOrders')
);
const UserTrackMyOrder = lazy(
  () => import('../../features/dashboard/user/views/UserTrackMyOrder')
);
const UserLoyalty = lazy(
  () => import('../../features/dashboard/user/views/UserLoyalty')
);
const UserAnalyticsView = lazy(
  () => import('../../features/dashboard/user/views/UserAnalyticsView')
);

const ChatPage = lazy(() => import('../../features/chat/ChatPage'));
const GlobalProfileSettings = lazy(
  () => import('../../features/dashboard/shared/GlobalProfileSettings')
);

// Moderator views
const ModeratorDashboard = lazy(
  () => import('../../features/dashboard/moderator/ModeratorDashboard')
);
const ModeratorReviewsView = lazy(
  () => import('../../features/dashboard/moderator/views/ReviewsView')
);
const ModeratorOrderConfirmationView = lazy(
  () => import('../../features/dashboard/moderator/views/OrderConfirmationView')
);
const ModeratorReportsView = lazy(
  () => import('../../features/dashboard/moderator/views/ModeratorReportsView')
);
const UserSuspensionView = lazy(
  () => import('../../features/dashboard/moderator/views/UserSuspensionView')
);
const FlaggedItemsView = lazy(
  () => import('../../features/dashboard/moderator/views/FlaggedItemsView')
);
const CommentReviewView = lazy(
  () => import('../../features/dashboard/moderator/views/CommentReviewView')
);
const DisputeResolutionView = lazy(
  () => import('../../features/dashboard/moderator/views/DisputeResolutionView')
);
const ModeratorAddProductsView = lazy(
  () =>
    import('../../features/dashboard/moderator/views/ModeratorAddProductsView')
);
const ModeratorInventoryView = lazy(
  () =>
    import('../../features/dashboard/moderator/views/ModeratorInventoryView')
);
const ModeratorCorrespondenceView = lazy(
  () =>
    import('../../features/dashboard/moderator/views/ModeratorCorrespondenceView')
);
const ModeratorSecurityView = lazy(
  () => import('../../features/dashboard/moderator/views/ModeratorSecurityView')
);

// Other pages
const FlashSalePage = lazy(() => import('../../pages/FlashSale/FlashSalePage'));
const CategoryPage = lazy(() => import('../../pages/Categories/CategoryPage'));
const WishlistPage = lazy(() => import('../../features/wishlist/WishlistPage'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* ==========================================
          ১. পাবলিক রাউটস (সবাই দেখতে পারবে)
      ========================================== */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/categories/:id" element={<CategoryPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/flash-sale" element={<FlashSalePage />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/tracking" element={<TrackingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/cart" element={<CartPage />} />

      {/* ==========================================
          ২. কাস্টমার রাউটস (শুধুমাত্র লগইন করা ইউজার)
      ========================================== */}
      <Route
        element={
          <RoleRoute allowedRoles={['user', 'seller', 'moderator', 'admin']} />
        }
      >
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<GlobalProfileSettings />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
        {/* কাস্টমার ড্যাশবোর্ড */}
        <Route path="/user" element={<UserDashboard />}>
          <Route index element={<Navigate to="analytics" replace />} />
          <Route path="analytics" element={<UserAnalyticsView />} />
          <Route path="orders" element={<UserMyOrders />} />
          <Route path="tracking" element={<UserTrackMyOrder />} />
          <Route path="loyalty" element={<UserLoyalty />} />
          <Route path="wishlist" element={<UserWishlistView />} />
          <Route path="support" element={<UserSupport />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="/user/returns" element={<ReturnPage />} />
          <Route path="/user/returns/:id" element={<UserReturnDetails />} />
        </Route>
      </Route>

      {/* ==========================================
          ৩. সেলার রাউটস (সেলার এবং অ্যাডমিন পারবে)
      ========================================== */}
      <Route element={<RoleRoute allowedRoles={['seller', 'admin']} />}>
        <Route path="/seller" element={<SellerDashboard />}>
          <Route index element={<Navigate to="analytics" replace />} />
          <Route path="inventory" element={<SellerInventoryView />} />
          <Route path="analytics" element={<SellerAnalyticsView />} />
          <Route path="orders" element={<SellerOrderManagementView />} />
          <Route path="coupons" element={<SellerCouponManagementView />} />
          <Route path="support" element={<SellerCustomerSupportView />} />
          <Route path="add-product" element={<SellerAddProductView />} />
          <Route path="settings" element={<SellerSettingsView />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Route>

      <Route element={<RoleRoute allowedRoles={['moderator', 'admin']} />}>
        <Route path="/moderator" element={<ModeratorDashboard />}>
          <Route index element={<Navigate to="reports" replace />} />
          <Route path="reports" element={<ModeratorReportsView />} />
          <Route path="add-product" element={<ModeratorAddProductsView />} />
          <Route path="inventory" element={<ModeratorInventoryView />} />
          <Route
            path="correspondence"
            element={<ModeratorCorrespondenceView />}
          />
          <Route path="security" element={<ModeratorSecurityView />} />
          <Route path="suspension" element={<UserSuspensionView />} />
          <Route path="flagged" element={<FlaggedItemsView />} />
          <Route path="comments" element={<CommentReviewView />} />
          <Route path="disputes" element={<DisputeResolutionView />} />
          <Route path="orders" element={<ModeratorOrderConfirmationView />} />
          <Route path="reviews" element={<ModeratorReviewsView />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Route>
      {/* ==========================================
          ৪. অ্যাডমিন রাউটস (শুধুমাত্র অ্যাডমিন)
      ========================================== */}
      <Route element={<RoleRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Navigate to="analytics" replace />} />
          <Route path="analytics" element={<AdminAnalyticsView />} />
          <Route path="ai-agent" element={<AdminAIAgentView />} />
          <Route path="add-product" element={<AdminAddProductsView />} />
          <Route path="my-products" element={<AdminMyProduct />} />
          <Route path="inventory" element={<AdminInventoryView />} />
          <Route path="categories" element={<AdminCategoryManagementView />} />
          <Route path="orders" element={<AdminOrderManagementView />} />
          <Route path="reviews" element={<AdminReviewsView />} />
          <Route path="approvals" element={<AdminUserApprovalView />} />
          <Route path="users" element={<AdminUserView />} />
          <Route path="roles" element={<AdminRoleManagementView />} />
          <Route path="coupons" element={<AdminCouponManagementView />} />
          <Route path="marketing" element={<AdminMarketingView />} />
          <Route path="tickets" element={<AdminSupportTicketsView />} />
          <Route path="settings" element={<AdminSettingsView />} />
          <Route path="reports" element={<AdminReportsView />} />
          <Route path="chat" element={<ChatPage />} />

          <Route path="header" element={<HeaderOrchestrationView />} />
        </Route>
      </Route>

      {/* ৪-০-৪ পেজ */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
