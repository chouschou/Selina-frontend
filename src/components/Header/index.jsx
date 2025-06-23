import {
  AppBar,
  Toolbar,
  Button,
  Popover,
  IconButton,
  Badge,
  Box,
  Container,
  Stack,
  Avatar,
  Typography,
  Divider,
  Drawer,
  ListItemText,
  ListItemButton,
  ListItem,
  List,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MessageIcon from "@mui/icons-material/Message";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.scss";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import MessageNotificationModal from "../../pages/MessageSystem/MessageNotificationModal";
import socket from "../../utils/socket";
import { getUserInfoByID } from "../../services/user/getUserInfoByID";
import { CartProvider } from "../../contexts/CartContext/CartProvider";
import { CartContext } from "../../contexts/CartContext/CartContext";
import { CartIconRefContext } from "../../contexts/CartContext/CartIconRefContext";
import { getAccountInfoByID } from "../../services/user/getInfoByAccountId";
import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const navigate = useNavigate();
  // const cartCount = 1;
  // const unreadMessages = 3; // giả lập số lượng tin nhắn chưa đọc

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  // const currentType = params.get("type") || "optical";

  const pathname = location.pathname;
  const typeParam = params.get("type");

  // Xác định tab hiện tại
  const currentTab =
    pathname === "/policy"
      ? "policy"
      : pathname === "/QandA"
      ? "QandA"
      : typeParam || "optical";

  const handleMenuClick = (type) => {
    if (type === "policy" || type === "QandA") {
      navigate(`/${type}`);
    } else {
      navigate(`/?type=${type || "optical"}`);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { role, isLoggedIn, account } = useContext(AuthContext);
  const [openModalMessage, setOpenModalMessage] = useState(false);

  const [user, setUser] = useState(null);

  const [storeAccount, setStoreAccount] = useState({});
  const [unreadInfor, setUnreadInfor] = useState(null);
  const [conversations, setConversations] = useState([]);

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const getStoreAccount = async () => {
    const response = await getUserInfoByID(account?.ID, "store");
    console.log("+++store account:", response);
    setStoreAccount(response);
  };

  useEffect(() => {
    const getInfoAccount = async () => {
      const response = await getAccountInfoByID(account.ID);
      setUser(response);
    };

    if (isLoggedIn) {
      getInfoAccount();
    }
  }, [account?.ID]);

  useEffect(() => {
    if (account?.ID && account?.Role.Name === "employee") {
      getStoreAccount();
    }
  }, [account?.ID]);

  useEffect(() => {
    if (isLoggedIn && account?.Role.Name === "employee") {
      socket.emit("count_unread_messages", {
        idUser: storeAccount?.ID,
        accountId: account.ID,
        role: "store",
      });
      socket.on("unread_messages_count", (unread_messages) => {
        console.log("unread_messages_count", unread_messages);
        setUnreadInfor(unread_messages);

        // status = unread_messages.perConversation.find(
        //   (item) => item.ConversationId === conversationId
        // ).unreadCount;
      });

      return () => {
        status;
        socket.off("unread_messages_count");
      };
    }
  }, [isLoggedIn, storeAccount?.ID, account?.ID, conversations]);

  useEffect(() => {
    console.log("-----store account:", storeAccount);
    if (storeAccount?.ID) {
      socket.emit("get_store_conversations", { storeId: storeAccount.ID });

      const handleConversations = (conversations) => {
        setConversations(conversations);
        console.log("--Conversations:", conversations);
      };

      socket.on("store_conversations", handleConversations);

      // Lắng nghe khi có tin nhắn mới hoặc cập nhật
      socket.on("message_changed", () => {
        socket.emit("get_store_conversations", { storeId: storeAccount.ID });
      });

      return () => {
        socket.off("store_conversations", handleConversations);
        socket.off("message_changed");
      };
    }
  }, [storeAccount]);

  console.log("unreadInfor changed in header:-----------", unreadInfor);
  const handleCartClick = () => navigate("/cart");
  const handleAccountClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleOpenModalMessage = () => setOpenModalMessage(true);
  const closeModalMessage = () => setOpenModalMessage(false);
  const handleMyAccountClick = () => {
    handleClose();
    navigate("/profile");
  };

  const handleMyOrdersClick = () => {
    handleClose();
    navigate("/my-orders");
  };

  const handleChangePasswordClick = () => {
    handleClose();
    setShowChangePasswordModal(true);
    // navigate("/change-password")
  };
  const { logoutContext } = useContext(AuthContext);
  const handleLogout = () => {
    handleClose();
    logoutContext(); // clear context + localStorage
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  // ----xử lý cart---
  const { cartIconRef } = useContext(CartIconRefContext);
  const { totalItems } = useContext(CartContext);

  // -----mobileview---------
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{ backgroundColor: "white" }}
      className="header"
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters className="toolbar">
          {/* Logo */}
          <Box className="logo-container">
            <p
              variant="h5"
              component="a"
              onClick={() => navigate("/")}
              className="logo"
            >
              Selina
              {/* <span className="logo-icon">👓</span> */}
            </p>
          </Box>

          {/* STAFF VIEW */}
          {isLoggedIn && role === "employee" ? (
            <Box
              sx={{ marginLeft: "auto" }}
              className="staff-icons-container"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <IconButton
                aria-label="messages"
                onClick={handleOpenModalMessage}
              >
                <Badge
                  badgeContent={unreadInfor?.totalUnreadCount}
                  color="error"
                >
                  <MessageIcon />
                </Badge>
              </IconButton>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  aria-label="account"
                  className="account-icon"
                  onClick={handleAccountClick}
                >
                  <Avatar
                    src={"/images/avatar2.png"}
                    alt="avatar"
                    className="user-avatar"
                  />
                </IconButton>

                {/* Popover */}
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  className="user-popover"
                >
                  <Box className="user-profile-modal">
                    <Box className="user-profile-header">
                      <Avatar
                        src={"/images/avatar2.png"}
                        alt="avatar"
                        className="user-avatar"
                      />
                      <Box className="user-info">
                        <Typography variant="h6" className="user-name">
                          Selina Store
                        </Typography>
                        <Typography variant="body2" className="user-email">
                          store@gmail.com
                        </Typography>
                      </Box>
                    </Box>
                    <Divider />
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleLogout}
                      sx={{ color: "white", borderRadius: "20px" }}
                    >
                      Đăng xuất
                    </Button>
                  </Box>
                </Popover>
                <Typography variant="body1" fontWeight="medium">
                  Selina store
                </Typography>
              </Stack>

              {openModalMessage && (
                <MessageNotificationModal
                  onClose={closeModalMessage}
                  unreadInfor={unreadInfor}
                  conversations={conversations}
                />
              )}
            </Box>
          ) : (
            // CUSTOMER VIEW
            <>
              {/* ẩn khi nhỏ hơn md */}
              <Box
                className="nav-menu"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Button
                  className={`nav-item ${
                    currentTab === "optical" ? "active" : ""
                  }`}
                  onClick={() => handleMenuClick("optical")}
                  sx={{ display: { xs: "none", md: "flex" } }}
                >
                  Gọng kính
                </Button>
                <Button
                  className={`nav-item ${
                    currentTab === "sunglasses" ? "active" : ""
                  }`}
                  onClick={() => handleMenuClick("sunglasses")}
                  sx={{ display: { xs: "none", md: "flex" } }}
                >
                  Kính mát
                </Button>
                <Button
                  className={`nav-item ${
                    currentTab === "policy" ? "active" : ""
                  }`}
                  onClick={() => handleMenuClick("policy")}
                  sx={{ display: { xs: "none", md: "flex" } }}
                >
                  Chính sách
                </Button>
                <Button
                  className={`nav-item ${
                    currentTab === "QandA" ? "active" : ""
                  }`}
                  onClick={() => handleMenuClick("QandA")}
                  sx={{ display: { xs: "none", md: "flex" } }}
                >
                  Hỏi đáp
                </Button>
              </Box>

              {/* Mobile view */}
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{
                  display: { xs: "block", md: "none" }, // chỉ hiện khi màn hình nhỏ hơn md
                }}
                className="mobile-menu-button"
              >
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                  onClick={() => setDrawerOpen(false)}
                >
                  <List>
                    {[
                      { label: "Gọng kính", value: "optical" },
                      { label: "Kính mát", value: "sunglasses" },
                      { label: "Chính sách", value: "policy" },
                      { label: "Hỏi đáp", value: "QandA" },
                    ].map((item) => (
                      <ListItem key={item.value} disablePadding>
                        <ListItemButton
                          onClick={() => handleMenuClick(item.value)}
                        >
                          <ListItemText primary={item.label} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>

              {isLoggedIn ? (
                <Box className="icons-container">
                  <IconButton
                    ref={cartIconRef}
                    aria-label="cart"
                    onClick={handleCartClick}
                  >
                    <Badge badgeContent={totalItems} color="success">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                  <IconButton onClick={handleAccountClick}>
                    <Avatar
                      src={user?.Customer.Avatar || "images/avatar_no.png"}
                      alt="avatar"
                      sx={{
                        width: 40,
                        height: 40,
                        border: "1px solid #1b5e20",
                      }}
                    >
                      <AccountCircleIcon fontSize="large" />
                    </Avatar>
                  </IconButton>

                  {/* Popover */}
                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    className="user-popover"
                  >
                    <Box className="user-profile-modal">
                      <Box className="user-profile-header">
                        <Avatar
                          src={user?.Customer?.Avatar || "images/avatar_no.png"}
                          alt="avatar"
                          className="user-avatar"
                        />
                        <Box className="user-info">
                          <Typography variant="h6" className="user-name">
                            {user?.Customer?.Name}
                          </Typography>
                          <Typography variant="body2" className="user-email">
                            {account?.Username}
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="user-menu">
                        <Button fullWidth onClick={handleMyAccountClick}>
                          Tài khoản của tôi
                        </Button>
                        <Button fullWidth onClick={handleMyOrdersClick}>
                          Đơn mua hàng
                        </Button>
                        <Button fullWidth onClick={handleChangePasswordClick}>
                          Đổi mật khẩu
                        </Button>
                      </Box>
                      <Divider />
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleLogout}
                        sx={{ color: "white", borderRadius: "20px" }}
                      >
                        Đăng xuất
                      </Button>
                    </Box>
                  </Popover>
                </Box>
              ) : (
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      borderColor: "#007C7C",
                      color: "#007C7C",
                      backgroundColor: "#E1EAED",
                      "&:hover": {
                        backgroundColor: "#ECEBE9",
                        borderColor: "#016957",
                      },
                      width: "100px",
                    }}
                    onClick={() => navigate("/register")}
                  >
                    Đăng ký
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      borderColor: "#007C7C",
                      color: "#007C7C",
                      backgroundColor: "#E1EAED",
                      "&:hover": {
                        backgroundColor: "#ECEBE9",
                        borderColor: "#016957",
                      },
                      width: "100px",
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Đăng nhập
                  </Button>
                </Stack>
              )}
            </>
          )}
        </Toolbar>
      </Container>
      <ChangePasswordModal
        open={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </AppBar>
  );
};

export default Header;
