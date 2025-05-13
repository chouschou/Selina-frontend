import { Navigate } from "react-router-dom";

const getUserRole = () => {
  return localStorage.getItem("role") || null;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = getUserRole();

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
