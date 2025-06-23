import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Box, useMediaQuery, useTheme } from "@mui/system";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "./RegisterInfoModal.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserInfo } from "../../services/user/createUserInfo";
import { DatePicker } from "@mui/x-date-pickers";

const RegisterInfoModal = ({ isOpen, onClose, account }) => {
  console.log("account register:", account);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    profileImage: "",
  });
  const resetForm = () => {
    setProfileData({
      name: "",
      email: "",
      phone: "",
      gender: "",
      birthDate: "",
      profileImage: "",
    });
  };
  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImageFile(file); // lưu file để gửi lên server

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          profileImage: e.target.result, // base64 để preview
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("name", profileData.name);
      formData.append("phoneNumber", profileData.phone);
      formData.append("gender", profileData.gender);
      if (profileData.birthDate) {
        formData.append(
          "dateOfBirth",
          dayjs(profileData.birthDate).format("YYYY-MM-DD") // đảm bảo đúng format ISO
        );
      }
      formData.append("avatar", selectedImageFile);

      await createUserInfo(account?.ID, formData);
      toast.success("Thêm thông tin thành công");
      onClose();
      resetForm();
      navigate("/login");
    } catch (error) {
      toast.error("Lỗi: " + error);
    }
  };
  const handleCancelProfile = () => {
    onClose();
    resetForm();
    navigate("/login");
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      maxWidth="lg"
      fullWidth
      className="user-info-modal"
    >
      <DialogTitle
        className="modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Text content */}
        <Box sx={{ flexGrow: 1 }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Thông tin cá nhân</p>
          <p
            style={{
              fontSize: "0.875rem",
              fontStyle: "italic",
              color: "#888",
              marginTop: 4,
              marginBottom: 0,
            }}
          >
            Bạn đã đăng ký thành công. Hãy điền thông tin để hoàn tất đăng ký
            hoặc thay đổi sau.
          </p>
        </Box>

        {/* Close button */}
        <IconButton
          className="close-button"
          onClick={() => {
            onClose();
            resetForm();
          }}
          sx={{ alignSelf: "flex-start" }} // đẩy lên trên cùng
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="modal-content" sx={{ paddingBottom: 0 }}>
        <Grid container justifyContent={"center"} spacing={isMdUp ? 10 : 5}>
          <Grid item xs={12} md={6} className="profile-image-section">
            <Box className="profile-image-container">
              <img
                src={profileData?.profileImage || "/images/avatar_no.png"}
                alt="Profile"
                className="profile-image"
              />
            </Box>
            <input
              accept="image/*"
              id="profile-image-upload"
              type="file"
              onChange={handleProfileImageChange}
              style={{ display: "none" }}
            />
            <label htmlFor="profile-image-upload">
              <Button component="span" className="choose-image-button">
                Chọn ảnh
              </Button>
            </label>
          </Grid>

          <Grid item xs={12} md={6} className="profile-form-section">
            {/* <Grid container spacing={3}> */}

            <Box sx={{ display: "flex" }} className="form-field">
              <p variant="body1" className="form-label">
                Tên
              </p>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={profileData.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
              />
            </Box>

            <Box sx={{ display: "flex" }} className="form-field">
              <p variant="body1" className="form-label">
                Email
              </p>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                disabled
                value={account?.Username}
                onChange={(e) => handleProfileChange("email", e.target.value)}
              />
            </Box>

            <Box sx={{ display: "flex" }} className="form-field">
              <p variant="body1" className="form-label">
                Số điện thoại
              </p>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={profileData.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  // Chỉ giữ số và giới hạn 10 ký tự
                  if (/^\d{0,10}$/.test(value)) {
                    handleProfileChange("phone", e.target.value);
                  }
                }}
              />
            </Box>

            <Box sx={{ display: "flex" }} className="form-field">
              <p variant="body1" className="form-label">
                Giới tính
              </p>
              <RadioGroup
                row
                value={profileData.gender}
                onChange={(e) => handleProfileChange("gender", e.target.value)}
              >
                <FormControlLabel
                  value="Nam"
                  sx={{ marginRight: 8 }}
                  control={<Radio />}
                  label="Nam"
                />
                <FormControlLabel
                  value="Nữ"
                  sx={{ marginRight: 8 }}
                  control={<Radio />}
                  label="Nữ"
                />
                <FormControlLabel
                  value="Khác"
                  control={<Radio />}
                  label="Khác"
                />
              </RadioGroup>
            </Box>

            <Box sx={{ display: "flex" }} className="form-field">
              <p variant="body1" className="form-label">
                Ngày sinh
              </p>
              {/* <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={profileData.birthDate}
                  onChange={(e) =>
                    handleProfileChange("birthDate", e.target.value)
                  }
                /> */}
              <DatePicker
                fullWidth
                size="small"
                sx={{ padding: "0px" }}
                name="birthDate"
                // label="Ngày sinh"
                value={dayjs(profileData.birthDate)} // nếu birthDate là "1999-10-09"
                onChange={(newValue) =>
                  handleProfileChange("birthDate", newValue)
                }
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    className: "form-field",
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className="modal-actions" sx={{ margin: 0 }}>
        <Grid item xs={12} className="form-actions">
          <Button
            variant="outlined"
            className="cancel-button"
            onClick={handleCancelProfile}
            sx={{ minWidth: "150px", marginRight: "20px" }}
          >
            Bỏ qua
          </Button>
          <Button
            variant="contained"
            className="save-button"
            onClick={handleSaveProfile}
            sx={{ color: "white", minWidth: "150px" }}
          >
            Lưu
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};
export default RegisterInfoModal;
