import { useState } from "react";
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
import { Visibility, VisibilityOff, ArrowForward } from "@mui/icons-material";
import "./RegisterForm.scss";
import imgRegister from "../../../assets/images/imgRegister.png";
import CustomTextField from "../../../components/CustomTextField";

const RegisterForm = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="lg" className="register-container">
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        <Grid item xs={12} md={6} className="image-container">
          <img
            src={imgRegister}
            alt="Woman wearing glasses"
            className="register-image"
          />
        </Grid>
        <Grid item xs={12} md={6} className="form-container" sx={{ paddingLeft: 5 }}>
          <Paper elevation={0} className="form-paper">
            <p className="register-title">ĐĂNG KÝ</p>
            <p className="register-subtitle">
              Hãy đăng ký để được hưởng đặc quyền riêng dành cho bạn
            </p>

            <Box component="form" className="register-form">
              <Box className="form-field">
                <p variant="body1" className="field-label">
                  Email <span className="required">*</span>
                </p>
                {/* <TextField fullWidth variant="outlined" placeholder="Email" className="text-input" /> */}
                <CustomTextField
                  fullWidth
                  variant="outlined"
                  placeholder="Email"
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

              <Box className="form-field">
                <p variant="body1" className="field-label">
                  Xác nhận mật khẩu <span className="required">*</span>
                </p>
                <CustomTextField
                  fullWidth
                  variant="outlined"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu"
                  className="text-input"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Button
                variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: "#13835B",
                }}
                className="continue-button"
                endIcon={<ArrowForward />}
              >
                Tiếp tục
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
              >
                Đăng ký bằng Google
              </Button>

              <Typography variant="body2" className="login-link-container">
                Bạn đã có tài khoản?
                <span
                  onClick={onSwitchToLogin}
                  className="login-link"
                  style={{ cursor: "pointer", color: "#1FAB89" }}
                >
                  Đăng nhập ngay
                </span>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterForm;
