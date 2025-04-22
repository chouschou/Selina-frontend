import { AppBar, Toolbar, Button,Popover, IconButton, Badge, Box, Container, Stack, Avatar, Typography, Divider } from "@mui/material"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { useNavigate } from "react-router-dom"
import "./Header.scss"
import { useState } from "react"
import avatar2 from "../../assets/images/avatar2.png"

const Header = ({ isLoggedIn }) => {
  const navigate = useNavigate()
  // const [cartCount, setCartCount] = useState(1)
  const cartCount = 1 // Sample cart count (would normally come from state or context)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // Sample user data (would normally come from authentication context/state)
  const user = {
    name: "Nguyễn Lý Na",
    email: "lynanguyen@gmail.com",
    avatar: "/avatar.jpg", // Default avatar if none provided
  }
  const handleCartClick = () => {
    navigate("/cart")
  }
  const handleAccountClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMyAccountClick = () => {
    handleClose()
    // Navigate to account page
    navigate("/profile")
  }

  const handleMyOrdersClick = () => {
    handleClose()
    navigate("/my-orders")
  }

  const handleChangePasswordClick = () => {
    handleClose()
    // Navigate to change password page
    // navigate("/change-password")
  }

  const handleLogout = () => {
    handleClose()
    // Handle logout logic
    console.log("Logging out")
    // After logout, redirect to home
    navigate("/")
  }
  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ backgroundColor: "white" }} className="header">
      <Container maxWidth="lg">
        <Toolbar disableGutters className="toolbar">

          {/* Logo */}
          <Box className="logo-container">
            <p variant="h5" component="a" onClick={() => navigate("/")} className="logo">
              Selina
              <span className="logo-icon">👓</span>
            </p>
          </Box>

          {/* Navigation Menu */}
          <Box className="nav-menu">
            <Button className="nav-item active">Gọng kính</Button>
            <Button className="nav-item">Kính râm</Button>
            <Button className="nav-item">Chính sách</Button>
            <Button className="nav-item">Hỏi đáp</Button>
          </Box>

          {/* Icons hiển thị nếu đã đăng nhập */}
          {isLoggedIn ? (
            <Box className="icons-container">
              <IconButton aria-label="cart" onClick={handleCartClick}>
                <Badge badgeContent={cartCount} color="success">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <IconButton aria-label="account" className="account-icon" onClick={handleAccountClick}>
                <AccountCircleIcon fontSize="large" />
              </IconButton>
              {/* User Profile Popover */}
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              className="user-popover"
            >
              <Box className="user-profile-modal">
                <Box className="user-profile-header">
                  <Avatar src={avatar2} alt='avatar' className="user-avatar" />
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
                  <Button className="menu-item" fullWidth onClick={handleMyAccountClick}>
                    Tài khoản của tôi
                  </Button>
                  <Button className="menu-item" fullWidth onClick={handleMyOrdersClick}>
                    Đơn mua hàng
                  </Button>
                  <Button className="menu-item" fullWidth onClick={handleChangePasswordClick}>
                    Đổi mật khẩu
                  </Button>
                </Box>

                <Divider className="menu-divider" />

                <Button variant="contained" color="primary" fullWidth className="logout-button" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </Box>
            </Popover>
            </Box>
          ):(<Stack direction="row" spacing={2}>
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
          </Stack>)}
        </Toolbar>
      </Container>
    </AppBar>
  )
}


export default Header
