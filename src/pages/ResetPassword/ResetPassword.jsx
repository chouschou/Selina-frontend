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
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import CustomTextField from "../../components/CustomTextField";
import { resetPassword } from "../../services/auth/resetPassword";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Password } from "@mui/icons-material";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate()
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = form;

    if (!newPassword || !confirmPassword) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, newPassword);
      toast.success("Đổi mật khẩu thành công");
      setForm({ newPassword: "", confirmPassword: "" });
      navigate("/login")
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

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
              ĐẶT LẠI MẬT KHẨU
            </p>
            <p variant="body1" className="login-subtitle">
              Hãy thay đổi mật khẩu để hoàn tất quá trình cấp lại mật khẩu
            </p>

            <Box
              component="form"
              className="login-form"
              onSubmit={handleSubmit}
            >
              <TextField
                required
                label="Mật khẩu mới"
                name="newPassword"
                type="password"
                fullWidth
                margin="normal"
                value={form.newPassword}
                onChange={handleChange}
              />
              <TextField
                required
                label="Nhập lại mật khẩu mới"
                name="confirmPassword"
                type="password"
                fullWidth
                margin="normal"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <Button
                variant="contained"
                color="primary"
                className="login-button"
                type="submit"
                fullWidth
                disabled={loading}
                // onClick={handleLogin}
              >
                Đổi mật khẩu
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResetPassword;
