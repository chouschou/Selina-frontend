import { Routes } from "react-router-dom";
import CustomerRoutes from "./CustomerRoutes";
import StaffRoutes from "./StaffRoutes";
import OwnerRoutes from "./OwnerRoutes";

const AppRoutes = ({activeMenuItem, setActiveMenuItem }) => (
  <Routes>
    {CustomerRoutes()}
    {StaffRoutes()}
    {OwnerRoutes({ activeMenuItem, setActiveMenuItem })}
  </Routes>
);

export default AppRoutes;
