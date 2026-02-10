import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // wait until auth state is known
  if (loading) {
    return <div>Checking authentication...</div>;
  }

  // not logged in → kick to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // logged in → allow access
  return <Outlet />;
};

export default ProtectedRoute;
