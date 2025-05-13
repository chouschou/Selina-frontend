import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import {
  Inventory as InventoryIcon,
  LocalOffer as LocalOfferIcon,
  LocalShipping as LocalShippingIcon,
  BarChart as BarChartIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import "./Sidebar.scss";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const menu = [
  {
    id: "products",
    text: "Sản phẩm",
    icon: InventoryIcon,
  },
  {
    id: "vouchers",
    text: "Voucher giảm giá",
    icon: LocalOfferIcon,
  },
  {
    id: "shipping",
    text: "Phí vận chuyển",
    icon: LocalShippingIcon,
  },
  {
    id: "statistics",
    text: "Thống kê",
    icon: BarChartIcon,
  },
];

function Sidebar({ activeMenuItem, setActiveMenuItem }) {
  const navigate = useNavigate();
  const { logoutContext } = useContext(AuthContext);
  const handleLogout = () => {
    logoutContext(); // clear context + localStorage
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };
  return (
    <Box className="sidebar">
      <Box>
        <Box className="sidebar-user">
          <Box className="logo-container">
            <p className="logo">Selina</p>
          </Box>
          <Avatar
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
            alt="Admin"
            className="sidebar-avatar"
            sx={{ width: 56, height: 56 }}
          />
          <Typography variant="h6" className="sidebar-username">
            Admin
          </Typography>
          <Typography variant="body2" className="sidebar-role">
            Quản lý cửa hàng hiệu quả và tiết kiệm
          </Typography>
        </Box>

        <List className="sidebar-menu">
          {menu.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                className={activeMenuItem === item.id ? "active" : ""}
                onClick={() => setActiveMenuItem(item.id)}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box className="logout-container">
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} className="logout-button">
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );
}

export default Sidebar;
