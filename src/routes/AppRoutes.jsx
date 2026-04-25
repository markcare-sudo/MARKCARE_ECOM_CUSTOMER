import { Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import ErrorBoundary from "../components/ErrorBoundory";
import DashboardLayout from "@/components/layout/CustomerLayout";
import AccountLayout from "@/components/layout/AccountLayout"; // Import the layout we built
import LoginPage from "@/features/auth/pages/LoginPage";
import VerifyOtpPage from "@/features/auth/pages/VerifyOtpPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import HomePage from "@/features/dashboard/pages/HomePage";
import VerifyUserPage from "@/features/auth/pages/VerifyUser";
import ProductsPage from "@/features/products/pages/ProductsPage";
import SearchPage from "@/features/dashboard/pages/SearchPage";
import ProductServiceDetailsPage from "@/features/products/pages/ProductDetailsPage";
import WishlistPage from "@/features/products/pages/WishlistPage";
import CheckoutPage from "@/features/products/pages/CheckoutPage";
import AddressPage from "@/features/address/pages/AddressPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";

// Lazy-loaded pages
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes location={location} key={location.pathname}>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/verify-email" element={<VerifyUserPage />} />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            {/* General Pages */}
            <Route path="/" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
            <Route path="/search" element={<ErrorBoundary><SearchPage /></ErrorBoundary>} />
            <Route path="/product/:slug" element={<ErrorBoundary><ProductServiceDetailsPage /></ErrorBoundary>} />
            <Route path="/checkout" element={<ErrorBoundary><CheckoutPage /></ErrorBoundary>} />

            {/* ================= ACCOUNT NESTED ROUTES ================= */}
            {/* These routes will render INSIDE the AccountLayout (with sidebar) */}
            <Route element={<AccountLayout />}>
              <Route path="/account/profile" element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
              <Route path="/account/addresses" element={<ErrorBoundary><AddressPage /></ErrorBoundary>} />
              <Route path="/account/wishlist" element={<ErrorBoundary><WishlistPage /></ErrorBoundary>} />
              <Route path="/account/orders" element={<ErrorBoundary><OrdersPage /></ErrorBoundary>} />
            </Route>

            {/* Catalog Routes */}
            <Route path="/catalog" element={<Outlet />}>
              <Route path="products" element={<ErrorBoundary><ProductsPage /></ErrorBoundary>} />
            </Route>

          </Route>
        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<ErrorBoundary><NotFound /></ErrorBoundary>} />

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;