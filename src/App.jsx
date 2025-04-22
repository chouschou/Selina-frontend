import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import RegisterForm from "./pages/Auth/Register";
import LogIn from "./pages/Auth/LogIn";
import "./App.css";
import { useState } from "react";
import HomePage from "./pages/Homepage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import MyOrders from "./pages/MyOrders";
import ChatButton from "./components/ChatButton";
import UserProfile from "./components/UserProfile";
import OrderManage from "./pages/OrderManage";
// import Message from "./pages/MessageSystem"
import ConversationModal from "./pages/MessageSystem/ConversationModal";
import MessageItem from "./pages/MessageSystem/MessageItem";
import MessageNotificationModal from "./pages/MessageSystem/MessageNotificationModal";
import MessageList from "./pages/MessageSystem/MessageList";
import { Button } from "@mui/material";
import AIButton from "./components/AIButton";

const theme = createTheme({
  palette: {
    primary: { main: "#1FAB89" },
    secondary: { main: "#FF3366" },
    success: { main: "#1FAB89" },
  },
  typography: { fontFamily: "Roboto, Arial, sans-serif" },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app">
          <Header isLoggedIn={isLoggedIn} />
          <main>
            <Routes>
              <Route
                path="/login"
                element={<LogIn onLoginSuccess={() => setIsLoggedIn(true)} />}
              />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/detail" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<Order />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/profile" element={<UserProfile />} />

              <Route path="/order-manage" element={<OrderManage />} />
              <Route path="/message" element={<MessageNotificationModal />} />
            </Routes>
            <ChatButton />
            <AIButton/>
            {/* <Button
              variant="contained"
              color="secondary"
              size="small"
              sx={{ position: "fixed", bottom: 90, right: 16 }}
            >
              Gợi ý từ AI 🤖
            </Button> */}

            {/* <MessageNotificationModal/> */}
          </main>
          {/* <ChatButton /> */}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
