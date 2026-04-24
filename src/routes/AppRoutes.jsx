import { Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import ErrorBoundary from "../components/ErrorBoundory";
import DashboardLayout from "@/components/layout/CustomerLayout";
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


            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <HomePage />
                </ErrorBoundary>
              }
            />


            <Route
              path="/profile"
              element={
                <ErrorBoundary>
                  <ProfilePage />
                </ErrorBoundary>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ErrorBoundary>
                  <WishlistPage />
                </ErrorBoundary>
              }
            />

            <Route
              path="/catalog"
              element={
                <Outlet />
              }
            >

              <Route
                path="products"
                element={
                  <ErrorBoundary>
                    <ProductsPage />
                  </ErrorBoundary>
                }
              />





            </Route>
            <Route
              path="/search"
              element={
                <ErrorBoundary>
                  <SearchPage />
                </ErrorBoundary>
              }
            />

            <Route
              path="/product/:slug"
              element={
                <ErrorBoundary>
                  <ProductServiceDetailsPage />
                </ErrorBoundary>
              }
            />
          </Route>
        </Route>



        {/* ================= 404 ================= */}
        <Route
          path="*"
          element={
            <ErrorBoundary>
              <NotFound />
            </ErrorBoundary>
          }
        />

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
