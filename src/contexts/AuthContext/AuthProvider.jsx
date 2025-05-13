import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [role, isLoggedIn]);

  const loginContext = (userRole) => {
    setRole(userRole);
    setIsLoggedIn(true);
  };

  const logoutContext = () => {
    setRole(null);
    setIsLoggedIn(false);
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <AuthContext.Provider value={{ role, isLoggedIn, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
