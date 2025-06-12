import { Route } from "react-router-dom";
import RegisterForm from "../pages/Auth/Register";
import LogIn from "../pages/Auth/LogIn";
import HomePage from "../pages/HomePage/index";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Order from "../pages/Order";
import MyOrders from "../pages/MyOrders";
import UserProfile from "../components/UserProfile";
import RecommendationPage from "../pages/Recommendation/RecommendationPage";
import QuizSelection from "../pages/Recommendation/QuizSelection";
import ResultsPage from "../pages/Recommendation/ResultsPage";
import CameraDetection from "../pages/Recommendation/CameraDetection";
import VirtualTryOn from "../components/VirtualTryOn/VirtualTryOn";

// const CustomerRoutes = () => [
//   <Route key="login" path="/login" element={<LogIn />} />,
//   <Route key="register" path="/register" element={<RegisterForm />} />,
//   <Route key="home" path="/" element={<HomePage />} />,
//   <Route key="detail" path="/detail" element={<ProductDetail />} />,
//   <Route key="cart" path="/cart" element={<Cart />} />,
//   <Route key="order" path="/order" element={<Order />} />,
//   <Route key="myorders" path="/my-orders" element={<MyOrders />} />,
//   <Route key="profile" path="/profile" element={<UserProfile />} />,
//   <Route key="recommendation" path="/recommendation" element={<RecommendationPage />} />,
//   <Route key="quiz" path="/quiz" element={<QuizSelection />} />,
//   <Route key="camera-detection" path="/camera-detection" element={<CameraDetection />} />,
//   <Route key="results" path="/results" element={<ResultsPage />} />,
// ];

const CustomerRoutes = () => (
  <>
    <Route path="/login" element={<LogIn />} />
    <Route path="/register" element={<RegisterForm />} />
    <Route path="/" element={<HomePage />} />
    <Route path="/detail/:id" element={<ProductDetail />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/order" element={<Order />} />
    <Route path="/my-orders" element={<MyOrders />} />
    <Route path="/profile" element={<UserProfile />} />
    <Route path="/recommendation" element={<RecommendationPage />} />
    <Route path="/quiz" element={<QuizSelection />} />
    <Route path="/camera-detection" element={<CameraDetection />} />
    <Route path="/results" element={<ResultsPage />} />
    <Route path="/virtual-try-on" element={<VirtualTryOn />} />
    {/* <Route path="/glass-try-on" element={<GlassTryOn/>} />
    <Route path="/glass-AR" element={<GlassesAR/>} /> */}
  </>
);

export default CustomerRoutes;
