import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  Container,
  Grid,
  Paper,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import imgLogIn from "../../../assets/images/imgLogIn.png"
import "./LogIn.scss"
import CustomTextField from "../../../components/CustomTextField"
import { useNavigate } from "react-router-dom"

const LogIn = ({ onLoginSuccess}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login attempt with:", { email, password })
  }
  const handleLogin = () => {
    onLoginSuccess(); 
  }

  return (
    <Container maxWidth="lg" className="login-container">
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        <Grid item xs={12} md={6} className="image-container">
          <img
            src={imgLogIn}
            alt="Woman with glasses"
            className="login-image"
          />
        </Grid>
        <Grid item xs={12} md={6} className="form-container" sx={{ paddingLeft: 5 }}>
          <Paper elevation={0} className="form-paper">
            <p variant="h3" className="login-title">
              ĐĂNG NHẬP
            </p>
            <p variant="body1" className="login-subtitle">
              Hãy đăng nhập để được hưởng đặc quyền riêng dành cho bạn
            </p>

            <Box
              component="form"
              className="login-form"
              onSubmit={handleSubmit}
            >
              <Box className="form-field">
                <p variant="body1" className="field-label">
                  Email <span className="required">*</span>
                </p>
                <CustomTextField
                  fullWidth
                  variant="outlined"
                  placeholder="Email"
                  className="text-input"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </Box>

              <Box className="form-field">
                <p variant="body1" className="field-label">
                  Mật khẩu <span className="required">*</span>
                </p>
                <CustomTextField
                  fullWidth
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className="text-input"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box className="forgot-password-container">
                <a href="/forgot-password" className="forgot-password-link">
                  Quên mật khẩu?
                </a>
              </Box>

              <Button
                variant="contained"
                color="primary"
                className="login-button"
                type="submit"
                fullWidth
                onClick={handleLogin}
              >
                Đăng nhập
              </Button>

              <Box className="divider-container">
                <Divider className="divider" />
                <Typography variant="body2" className="divider-text">
                  hoặc
                </Typography>
                <Divider className="divider" />
              </Box>

              <Button
                variant="outlined"
                startIcon={
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
                    alt="Google logo"
                    style={{ width: 24, height: 24 }}
                  />
                }
                className="google-button"
                fullWidth
              >
                Đăng nhập bằng Google
              </Button>

              <Typography variant="body2" className="register-link-container">
                Bạn chưa có tài khoản?
                <span
                  onClick={() => navigate("/register")}
                  className="register-link"
                  style={{ cursor: "pointer", color: "#1FAB89" }}
                >
                  Đăng ký ngay
                </span>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default LogIn
