import { Box } from "@mui/material";
import Sidebar from "../components/SideBar";
import HeaderOwner from "../components/HeaderOwner";
import MainContent from "../pages/MainContent";

const OwnerLayout = ({ activeMenuItem, setActiveMenuItem }) => {
  return (
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
  );
};

export default OwnerLayout;
