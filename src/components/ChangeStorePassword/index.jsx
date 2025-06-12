import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import "./ChangeStorePassword.scss";
import { toast } from "react-toastify";
import { changeEmployeePassword } from "../../services/auth/changeEmployeePassword";

export default function ChangeStorePassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const reset = () => {
    setFormData({ newPassword: "", confirmPassword: "" });
    setErrors({ newPassword: "", confirmPassword: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { newPassword: "", confirmPassword: "" };
    let hasError = false;

    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
      hasError = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
      hasError = true;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const data = {
      username: "store@gmail.com", // TODO: truyền động username phù hợp
      newPassword: formData.newPassword,
    };

    try {
      await changeEmployeePassword(data);
      toast.success("Thay đổi mật khẩu thành công");
      reset();
    } catch (error) {
      toast.error("Lỗi thay đổi mật khẩu!", error);
    }
  };

  return (
    <Box className="store-content-container">
      <div className="header">
        <div>
          <h1>Quản lý tài khoản cửa hàng</h1>
          <p>Thay đổi mật khẩu tài khoản cửa hàng.</p>
        </div>
      </div>
      <div className="form">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 400,
            backgroundColor: "white",
            p: 3,
            borderRadius: 2,
            boxShadow: 2,
            mt: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Đổi mật khẩu tài khoản cửa hàng
          </Typography>

          <TextField
            label="Mật khẩu mới"
            type="password"
            name="newPassword"
            fullWidth
            margin="normal"
            value={formData.newPassword}
            onChange={handleChange}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
          />

          <TextField
            label="Xác nhận mật khẩu mới"
            type="password"
            name="confirmPassword"
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, color: "white" }}
            fullWidth
          >
            Cập nhật mật khẩu
          </Button>
        </Box>
      </div>
    </Box>
  );
}
