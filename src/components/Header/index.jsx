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
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MessageIcon from "@mui/icons-material/Message";
import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { useContext, useEffect, useState } from "react";
import avatar2 from "../../assets/images/avatar2.png";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import MessageNotificationModal from "../../pages/MessageSystem/MessageNotificationModal";
import socket from "../../utils/Socket";
import { getUserInfoByID } from "../../services/user/getUserInfoByID";

const Header = () => {
  const navigate = useNavigate();
  const cartCount = 1;
  // const unreadMessages = 3; // giả lập số lượng tin nhắn chưa đọc

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { role, isLoggedIn, account } = useContext(AuthContext);
  const [openModalMessage, setOpenModalMessage] = useState(false);

  const user = {
    name: "Nguyễn Lý Na",
    email: "lynanguyen@gmail.com",
    avatar: "/avatar.jpg",
  };

  const [storeAccount, setStoreAccount] = useState({});
  const [unreadInfor, setUnreadInfor] = useState(null);
  const [conversations, setConversations] = useState([]);

  const getStoreAccount = async () => {
    const response = await getUserInfoByID(account?.ID, "store");
    console.log("+++store account:", response);
    setStoreAccount(response);
  };

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
    // navigate("/change-password")
  };
  const { logoutContext } = useContext(AuthContext);
  const handleLogout = () => {
    handleClose();
    logoutContext(); // clear context + localStorage
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

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
              Selina <span className="logo-icon">👓</span>
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
                  <AccountCircleIcon fontSize="large" />
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
                        src={avatar2}
                        alt="avatar"
                        className="user-avatar"
                      />
                      <Box className="user-info">
                        <Typography variant="h6" className="user-name">
                          {user.name}
                        </Typography>
                        <Typography variant="body2" className="user-email">
                          {user.email}
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
                    >
                      Đăng xuất
                    </Button>
                  </Box>
                </Popover>
                <Typography variant="body1" fontWeight="medium">
                  Nhân viên 1
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
              <Box className="nav-menu">
                <Button className="nav-item active">Gọng kính</Button>
                <Button className="nav-item">Kính râm</Button>
                <Button className="nav-item">Chính sách</Button>
                <Button className="nav-item">Hỏi đáp</Button>
              </Box>

              {isLoggedIn ? (
                <Box className="icons-container">
                  <IconButton aria-label="cart" onClick={handleCartClick}>
                    <Badge badgeContent={cartCount} color="success">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    aria-label="account"
                    className="account-icon"
                    onClick={handleAccountClick}
                  >
                    <AccountCircleIcon fontSize="large" />
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
                          src={avatar2}
                          alt="avatar"
                          className="user-avatar"
                        />
                        <Box className="user-info">
                          <Typography variant="h6" className="user-name">
                            {user.name}
                          </Typography>
                          <Typography variant="body2" className="user-email">
                            {user.email}
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
    </AppBar>
  );
};

export default Header;
