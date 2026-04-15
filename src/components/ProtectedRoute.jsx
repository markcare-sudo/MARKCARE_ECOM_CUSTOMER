import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAccessToken } from "@/utils/sessionStorage";
import useAuth from "@/features/auth/useAuth";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const token = getAccessToken();

  // ⏳ Show loader while auth is being checked
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // ✅ Authorized
  return <Outlet />;
};

export default ProtectedRoute;