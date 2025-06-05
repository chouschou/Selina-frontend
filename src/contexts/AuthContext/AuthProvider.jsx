import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

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

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        logoutContext();
        return;
      }

      try {
        const { exp } = JSON.parse(atob(accessToken.split(".")[1]));
        const now = Date.now();

        if (now >= exp * 1000) {
          const res = await axios.post(
            "http://localhost:3000/auth/refresh-token",
            {
              refreshToken,
            }
          );
          const newAccessToken = res.data.access_token;
          localStorage.setItem("accessToken", newAccessToken);

          const accountInfo = res.data.user; // lấy luôn user từ response
          setAccount(accountInfo);
          setIsLoggedIn(true);
          setRole(accountInfo.Role.Name || accountInfo.role);
        }
      } catch (err) {
        console.error("Token refresh failed", err);
        logoutContext();
      }
    };

    checkAndRefreshToken();
  }, []);

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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
