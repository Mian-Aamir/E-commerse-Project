import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Wraps a route element and only renders it if the person is logged in
// (and, optionally, has one of the allowed roles). Otherwise redirects.
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Logged in, but wrong role for this page — send them to their own dashboard
    const fallbackPath =
      role === "admin"
        ? "/dashboard/admin"
        : role === "seller"
          ? "/dashboard/seller"
          : "/dashboard/user";
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;