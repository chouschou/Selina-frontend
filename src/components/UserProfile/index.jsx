import { useContext, useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../../components/Header";
import "./UserProfile.scss";
import { getAccountInfoByID } from "../../services/user/getInfoByAccountId";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { formatDateVN } from "../../services/formatToShow";

const UserProfile = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone:"",
        gender: "",
        birthDate: "",
        profileImage: "",
      });
  const { isLoggedIn, account } = useContext(AuthContext);
  useEffect(() => {
    const getInfoAccount = async () => {
      const response = await getAccountInfoByID(account.ID);
      setProfileData({
        name: response.Customer.Name,
        email: response.Customer.Email,
        phone: response.Customer.PhoneNumber,
        gender: response.Customer.Gender,
        birthDate: formatDateVN(response.Customer.DateOfBirth),
        profileImage: response.Customer.Avatar || 'images/avatar_no.png',
      });
    };

    if (isLoggedIn) {
      getInfoAccount();
    }
  }, [account?.ID]);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Nguyễn Văn Nam",
      address: "123 Ngô Quyền, Đà Nẵng",
      phone: "0842056698",
      isDefault: true,
    },
    {
      id: 2,
      name: "Nguyễn Thị Lan",
      address: "123 Ngô Quyền, Đà Nẵng",
      phone: "0842077698",
      isDefault: false,
    },
  ]);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    province: "",
    address: "",
  });

  const handleProfileChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value,
    });
  };

  const handleProfileImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({
          ...profileData,
          profileImage: e.target.result,
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSaveProfile = () => {
    // Save profile data to backend
    console.log("Saving profile:", profileData);
    // Show success message
    alert("Hồ sơ đã được cập nhật thành công!");
  };

  const handleCancelProfile = () => {
    // Reset form or navigate back
    console.log("Cancel profile edit");
  };

  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
    setNewAddress({
      name: "",
      phone: "",
      province: "",
      address: "",
    });
  };

  const handleAddressChange = (field, value) => {
    setNewAddress({
      ...newAddress,
      [field]: value,
    });
  };

  const handleAddAddress = () => {
    const newAddressEntry = {
      id: addresses.length + 1,
      name: newAddress.name,
      address: `${newAddress.address}, ${newAddress.province}`,
      phone: newAddress.phone,
      isDefault: addresses.length === 0, // Make default if it's the first address
    };

    setAddresses([...addresses, newAddressEntry]);
    handleCloseAddressModal();
  };

  //   const handleSetDefaultAddress = (id) => {
  //     setAddresses(
  //       addresses.map((address) => ({
  //         ...address,
  //         isDefault: address.id === id,
  //       })),
  //     )
  //   }

  const handleEditAddress = (id) => {
    // Implement edit functionality
    console.log("Edit address:", id);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((address) => address.id !== id));
  };

  return (
    <div className="user-profile-page">
      <Header />

      <Container maxWidth="lg" className="profile-container">
        {/* Profile Section */}
        <Paper className="profile-section">
          <Typography variant="h5" className="section-title">
            Hồ sơ của tôi
          </Typography>

          <Grid container spacing={isMdUp ? 20 : 5}>
            <Grid item xs={12} md={6} className="profile-image-section">
              <Box className="profile-image-container">
                <img
                  src={
                    profileData?.profileImage ||
                    "/placeholder.svg?height=200&width=200"
                  }
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
                  value={profileData.email}
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
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                />
              </Box>

              <Box sx={{ display: "flex" }} className="form-field">
                <p variant="body1" className="form-label">
                  Giới tính
                </p>
                <RadioGroup
                  row
                  value={profileData.gender}
                  onChange={(e) =>
                    handleProfileChange("gender", e.target.value)
                  }
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
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={profileData.birthDate}
                  onChange={(e) =>
                    handleProfileChange("birthDate", e.target.value)
                  }
                />
              </Box>

              <Grid item xs={12} className="form-actions">
                <Button
                  variant="outlined"
                  className="cancel-button"
                  onClick={handleCancelProfile}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  className="save-button"
                  onClick={handleSaveProfile}
                >
                  Lưu
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {/* </Grid> */}
        </Paper>

        {/* Addresses Section */}
        <Paper className="addresses-section">
          <Typography variant="h5" className="section-title">
            Địa chỉ của tôi
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên người nhận</TableCell>
                  <TableCell>Địa chỉ nhận hàng</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Sửa</TableCell>
                  <TableCell>Xóa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addresses.map((address) => (
                  <TableRow key={address.id}>
                    <TableCell>
                      {address.name}
                      {address.isDefault && (
                        <span className="default-badge">Mặc định</span>
                      )}
                    </TableCell>
                    <TableCell>{address.address}</TableCell>
                    <TableCell>{address.phone}</TableCell>
                    <TableCell>
                      <IconButton
                        className="edit-button"
                        onClick={() => handleEditAddress(address.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        className="delete-button"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box className="add-address-container">
            <Button
              variant="contained"
              className="add-address-button"
              onClick={handleOpenAddressModal}
            >
              Thêm địa chỉ
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Add Address Modal */}
      <Dialog
        open={isAddressModalOpen}
        onClose={handleCloseAddressModal}
        maxWidth="sm"
        fullWidth
        className="address-modal"
      >
        <DialogTitle className="modal-title">
          Địa chỉ mới
          <IconButton
            className="close-button"
            onClick={handleCloseAddressModal}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="modal-content">
          <Box className="address-form">
            <Grid container spacing={10} sx={{ paddingBottom: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  variant="outlined"
                  size="small"
                  sx={{ width: "100%" }}
                  value={newAddress.name}
                  onChange={(e) => handleAddressChange("name", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  variant="outlined"
                  size="small"
                  sx={{ width: "100%" }}
                  value={newAddress.phone}
                  onChange={(e) => handleAddressChange("phone", e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ paddingBottom: 3 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã</InputLabel>
                <Select
                  value={newAddress.province}
                  onChange={(e) =>
                    handleAddressChange("province", e.target.value)
                  }
                  label="Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã"
                >
                  <MenuItem value="Đà Nẵng">Đà Nẵng</MenuItem>
                  <MenuItem value="Hà Nội">Hà Nội</MenuItem>
                  <MenuItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ cụ thể"
                variant="outlined"
                size="small"
                multiline
                rows={3}
                value={newAddress.address}
                onChange={(e) => handleAddressChange("address", e.target.value)}
              />
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions className="modal-actions">
          <Button
            variant="contained"
            className="save-address-button"
            onClick={handleAddAddress}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserProfile;
