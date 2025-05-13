import { Route } from "react-router-dom";
import RegisterForm from "../pages/Auth/Register";
import LogIn from "../pages/Auth/LogIn";
import HomePage from "../pages/Homepage";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Order from "../pages/Order";
import MyOrders from "../pages/MyOrders";
import UserProfile from "../components/UserProfile";

const CustomerRoutes = () => [
  <Route key="login" path="/login" element={<LogIn />} />,
  <Route key="register" path="/register" element={<RegisterForm />} />,
  <Route key="home" path="/" element={<HomePage />} />,
  <Route key="detail" path="/detail" element={<ProductDetail />} />,
  <Route key="cart" path="/cart" element={<Cart />} />,
  <Route key="order" path="/order" element={<Order />} />,
  <Route key="myorders" path="/my-orders" element={<MyOrders />} />,
  <Route key="profile" path="/profile" element={<UserProfile />} />,
];

export default CustomerRoutes;
