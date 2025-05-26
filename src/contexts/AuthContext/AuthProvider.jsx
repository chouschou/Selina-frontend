import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [account, setAccount] = useState(() => {
    const storedAccount = localStorage.getItem("account");
    return storedAccount ? JSON.parse(storedAccount) : null;
  });

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
    if (account) {
      localStorage.setItem("account", JSON.stringify(account));
    } else {
      localStorage.removeItem("account");
    }
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [role, isLoggedIn, account]);

  const loginContext = (userRole, accountInfor) => {
    setRole(userRole);
    setIsLoggedIn(true);
    setAccount(accountInfor);
  };

  const logoutContext = () => {
    setRole(null);
    setIsLoggedIn(false);
    setAccount(null);
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("account");
  };

  return (
    <AuthContext.Provider
      value={{ role, isLoggedIn, account, loginContext, logoutContext }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
