import { useEffect, useState } from "react";
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
  TextField,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ArrowForward,
  Password,
} from "@mui/icons-material";
import "./RegisterForm.scss";
import imgRegister from "../../../assets/images/imgRegister.png";
import CustomTextField from "../../../components/CustomTextField";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer";
import { toast } from "react-toastify";
import { sendOTP } from "../../../services/auth/sendOTP";
import { verifyOTP } from "../../../services/auth/verifyOTP";
import { register } from "../../../services/auth/register";
import RegisterInfoModal from "../../../components/RegisterInfoModal/RegisterInfoModal";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // step 1: register, step 2: otp
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [isOpenRegisterModal, setOpenRegisterModal] = useState(false);
  const [accountRegister, setAccountregister] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Countdown
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [step, timer]);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleContinue = async () => {
    // Giả lập bước đăng ký thành công và chuyển sang nhập OTP
    const { email, password, confirmPassword } = form;
    if (!email || !password || !confirmPassword) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    } else if (password !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận không khớp");
      return;
    } else {
      setStep(2);
      setTimer(60);
      await sendOTP(email);
    }
  };

  const handleResendOtp = async () => {
    setTimer(60);
    const { email } = form;
    await sendOTP(email);
  };

  const handleConfirmOtp = async () => {
    // Xác thực OTP
    console.log("OTP:", otp);
    const { email, password } = form;
    try {
      const response = await verifyOTP(email, otp);
      if (response.success) {
        const response = await register(email, password);
        setAccountregister(response.account);
        toast.success("Đăng ký thành công!");
        setOpenRegisterModal(true);
      } else {
        toast.error("Mã OTP không đúng hoặc đã hết hạn!");
      }
    } catch (error) {
      toast.error("Lỗi đăng ký tài khoản!");
      console.log("handleConfirmOtp", error);
    }
  };

  return (
    <>
      <Container maxWidth="lg" className="register-container">
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={12} md={6} className="image-container">
            <img
              src={imgRegister}
              alt="Woman wearing glasses"
              className="register-image"
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
              <p className="register-title">ĐĂNG KÝ</p>
              <p className="register-subtitle">
                {step === 1
                  ? "Hãy đăng ký để được hưởng đặc quyền riêng dành cho bạn"
                  : "Vui lòng nhập mã xác thực được gửi đến email của bạn"}
              </p>

              <Box component="form" className="register-form">
                {step === 1 ? (
                  <>
                    <Box className="form-field">
                      <p className="field-label">
                        Email <span className="required">*</span>
                      </p>
                      <CustomTextField
                        value={form.email}
                        name="email"
                        fullWidth
                        variant="outlined"
                        placeholder="Email"
                        onChange={handleChange}
                      />
                    </Box>

                    <Box className="form-field">
                      <p className="field-label">
                        Mật khẩu <span className="required">*</span>
                      </p>
                      <CustomTextField
                        fullWidth
                        value={form.password}
                        name="password"
                        onChange={handleChange}
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? (
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

                    <Box className="form-field">
                      <p className="field-label">
                        Xác nhận mật khẩu <span className="required">*</span>
                      </p>
                      <CustomTextField
                        fullWidth
                        value={form.confirmPassword}
                        onChange={handleChange}
                        name="confirmPassword"
                        variant="outlined"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
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
                      onClick={handleContinue}
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

                    <Typography
                      variant="body2"
                      className="login-link-container"
                    >
                      Bạn đã có tài khoản?
                      <span
                        onClick={() => navigate("/login")}
                        className="login-link"
                        style={{ cursor: "pointer", color: "#1FAB89" }}
                      >
                        Đăng nhập ngay
                      </span>
                    </Typography>
                  </>
                ) : (
                  <>
                    <Box className="form-field" sx={{ mt: 3 }}>
                      <TextField
                        fullWidth
                        label="Nhập mã OTP"
                        variant="outlined"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                      Mã hết hạn sau: <strong>{timer}s</strong>
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Button variant="outlined" onClick={() => setStep(1)}>
                        Quay lại
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleConfirmOtp}
                        sx={{ color: "white" }}
                        disabled={otp === ""}
                      >
                        Xác nhận
                      </Button>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <Button onClick={handleResendOtp} disabled={timer > 0}>
                        Gửi lại OTP
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer></Footer>
      <RegisterInfoModal
        isOpen={isOpenRegisterModal}
        onClose={() => setOpenRegisterModal(false)}
        account={accountRegister}
      ></RegisterInfoModal>
    </>
  );
};

export default RegisterForm;
