import { AppBar, Toolbar, Button, IconButton, Badge, Box, Container, Stack } from "@mui/material"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { useNavigate } from "react-router-dom"
import "./Header.scss"

const Header = ({ isLoggedIn }) => {
  const navigate = useNavigate()
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
              <IconButton aria-label="cart">
                <Badge badgeContent={1} color="success">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <IconButton aria-label="account" className="account-icon">
                <AccountCircleIcon fontSize="large" />
              </IconButton>
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
