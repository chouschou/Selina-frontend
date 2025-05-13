import { Route } from "react-router-dom";
import OrderManage from "../pages/OrderManage";
import MessageNotificationModal from "../pages/MessageSystem/MessageNotificationModal";
import ProtectedRoute from "./ProtectedRoute";

const StaffRoutes = () => (
  <>
    <Route
      path="/order-manage"
      element={
        <ProtectedRoute allowedRoles={["employee"]}>
          <OrderManage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/message"
      element={
        <ProtectedRoute allowedRoles={["employee"]}>
          <MessageNotificationModal />
        </ProtectedRoute>
      }
    />
  </>
);

export default StaffRoutes;
