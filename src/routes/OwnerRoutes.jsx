import { Route } from "react-router-dom";
import MainContent from "../pages/MainContent";
import ProtectedRoute from "./ProtectedRoute";
import Sidebar from "../components/SideBar";
import HeaderOwner from "../components/HeaderOwner"; // ✅ BỔ SUNG DÒNG NÀY
import { Box } from "@mui/material";

const OwnerRoutes = ({ activeMenuItem, setActiveMenuItem }) => (
  <Route
    path="/owner"
    element={
      <ProtectedRoute allowedRoles={["owner"]}>
        <Box className="app-container">
          <Sidebar
            activeMenuItem={activeMenuItem}
            setActiveMenuItem={setActiveMenuItem}
          />
          <Box className="main-section">
            <HeaderOwner />
            <MainContent activeMenuItem={activeMenuItem} />
          </Box>
        </Box>
      </ProtectedRoute>
    }
  />
);

export default OwnerRoutes;
