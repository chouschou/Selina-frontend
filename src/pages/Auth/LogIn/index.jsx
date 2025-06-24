import { useContext, useState } from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./LogIn.scss";
import CustomTextField from "../../../components/CustomTextField";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/auth/login";
import { toast } from "react-toastify";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import { forgotPassword } from "../../../services/auth/forgotPassword";
import { GoogleLogin } from "@react-oauth/google";
import { loginGoogle } from "../../../services/auth/loginGoogle";
import { getAccountInfoByID } from "../../../services/user/getInfoByAccountId";

const LogIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const { loginContext } = useContext(AuthContext);
  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;

    try {
      const response = await loginGoogle(credential);
      const { accessToken, refreshToken, account } = response;

      toast.success("Đăng nhập thành công!");
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const accountInfo = await getAccountInfoByID(account.ID);

      const role = accountInfo.Role.Name;
      loginContext(role, accountInfo);

      if (role === "employee") navigate("/order-manage");
      else if (role === "owner") navigate("/owner");
      else {
        const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại!");
      console.log("Lỗi đăng nhập bằng gg:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);

      // localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);

      const role = response.user.Role.Name;
      const user = response.user;

      console.log("user log in -", user);
      loginContext(role, user); // dùng context để cập nhật React
      toast.success("Đăng nhập thành công!");

      // Điều hướng theo vai trò
      if (role === "employee") {
        navigate("/order-manage");
      } else if (role === "owner") {
        navigate("/owner");
      } else {
        const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      }
    } catch (err) {
      if (err === "Incorrect password") {
        toast.error("Mật khẩu không chính xác");
      } else if (err === "Username does not exist") {
        toast.error("Tài khoản chưa được kích hoạt");
      } else if (err[0] === "Username must be an email") {
        toast.error("Vui lòng nhập đúng định dạng email");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Vui lòng nhập email trước khi đặt lại mật khẩu.");
      return;
    }

    try {
      await forgotPassword(email);
      toast.success("Đã gửi đường dẫn đặt lại mật khẩu đến email.");
    } catch (error) {
      toast.error(error || "Lỗi khi gửi email đặt lại mật khẩu.");
    }
  };

  // // Lưu role
  // localStorage.setItem("role", "staff");
  // // Lấy role
  // const role = localStorage.getItem("role");
  // // Xóa role (khi logout)
  // localStorage.removeItem("role");

  return (
    <Container maxWidth="lg" className="login-container">
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        <Grid item xs={12} md={6} className="image-container">
          <img
            src={"images/imgLogIn.png"}
            alt="Woman with glasses"
            className="login-image"
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          className="form-container"
          sx={{ paddingLeft: 5 }}
        >
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
                  // value={password}
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
                <span
                  onClick={handleForgotPassword}
                  className="forgot-password-link"
                  style={{
                    cursor: "pointer",
                    color: "#1FAB89",
                    textDecoration: "underline",
                  }}
                >
                  Quên mật khẩu?
                </span>
              </Box>

              <Button
                variant="contained"
                color="primary"
                className="login-button"
                type="submit"
                fullWidth
                // onClick={handleLogin}
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

              <Box sx={{ width: "100%" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log("Google Login Failed")}
                  size="large"
                />
              </Box>

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
  );
};

export default LogIn;
