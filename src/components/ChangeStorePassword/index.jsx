import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function ChangeStorePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Mật khẩu mới không khớp.");
      return;
    }
    // TODO: Gửi request đổi mật khẩu tại đây
    console.log("Gửi dữ liệu đổi mật khẩu:", formData);
  };

  return (
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
        label="Mật khẩu hiện tại"
        type="password"
        name="currentPassword"
        fullWidth
        required
        margin="normal"
        onChange={handleChange}
      />

      <TextField
        label="Mật khẩu mới"
        type="password"
        name="newPassword"
        fullWidth
        required
        margin="normal"
        onChange={handleChange}
      />

      <TextField
        label="Xác nhận mật khẩu mới"
        type="password"
        name="confirmPassword"
        fullWidth
        required
        margin="normal"
        onChange={handleChange}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2, color: "white"}}
        fullWidth
      >
        Cập nhật mật khẩu
      </Button>
    </Box>
  );
}
