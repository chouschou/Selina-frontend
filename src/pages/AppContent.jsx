import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext/AuthContext";
import { ToastContainer } from "react-toastify";
import ChatButton from "../components/ChatButton";
import AIButton from "../components/AIButton";
import AppRoutes from "../routes/index";
import Header from "../components/Header";

function AppContent() {
  const { role, isLoggedIn } = useContext(AuthContext);
  const [activeMenuItem, setActiveMenuItem] = useState("products");
  const location = useLocation();

  const isCustomerOrGuest = (isLoggedIn && role === "customer") || !isLoggedIn;
  const isHiddenRoute = ["/login", "/register", "/recommendation", "/quiz", "/camera-detection", "/results"].includes(location.pathname);
  const shouldShowChatAndAI = isCustomerOrGuest && !isHiddenRoute;

  return (
    <div className="app">
      {role !== "owner" && <Header />}
      <main>
        <AppRoutes
          activeMenuItem={activeMenuItem}
          setActiveMenuItem={setActiveMenuItem}
        />
        {shouldShowChatAndAI && (
          <>
            <ChatButton />
            <AIButton />
          </>
        )}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          style={{ width: "340px", textAlign: "left", lineHeight: "1.3" }}
        />
      </main>
    </div>
  );
}
export default AppContent;