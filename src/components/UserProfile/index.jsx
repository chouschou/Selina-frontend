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
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../../components/Header";
import "./UserProfile.scss";
import { getAccountInfoByID } from "../../services/user/getInfoByAccountId";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { formatDateVN } from "../../services/formatToShow";
import { getDeliveryAddressByAccount } from "../../services/accountDelivery/getDeliveryAddressByAccountId";
import { checkDeliveryUsed } from "../../services/accountDelivery/checkDeliveryUsedInOrder";
import { toast } from "react-toastify";
import { deleteAccountDelivery } from "../../services/accountDelivery/deleteAccountDelivery";
import AddAddressModal from "../DeliveryAddressModal/AddAddressModal";
import UpdateAddressModal from "../DeliveryAddressModal/UpdateAddressModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { updateUserInfo } from "../../services/user/updateUserInfo";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

const UserProfile = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { isLoggedIn, account } = useContext(AuthContext);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    profileImage: "",
  });
  useEffect(() => {
    const getInfoAccount = async () => {
      const response = await getAccountInfoByID(account.ID);
      setProfileData({
        name: response?.Customer?.Name,
        email: account.Username,
        phone: response?.Customer?.PhoneNumber,
        gender: response?.Customer?.Gender,
        birthDate: formatDateVN(response?.Customer?.DateOfBirth),
        profileImage: response?.Customer?.Avatar || "images/avatar_no.png",
      });
    };

    if (isLoggedIn) {
      getInfoAccount();
    }
  }, [account?.ID]);

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

      // Nếu đang chọn file ảnh (thay vì chỉ là base64)
      if (selectedImageFile) {
        formData.append("avatar", selectedImageFile);
      } else if (profileData.profileImage === "") {
        formData.append("avatar", ""); // yêu cầu xoá avatar
      }

      await updateUserInfo(account.ID, formData);
      toast.success("Cập nhật thành công");
    } catch (error) {
      toast.error("Lỗi: " + error);
    }
  };

  const handleCancelProfile = () => {
    // Reset form or navigate back
    console.log("Cancel profile edit");
  };

  const [addresses, setAddresses] = useState(null);

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Lấy dữ liệu tương ứng trang hiện tại
  const paginatedData = addresses?.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const fetchAllDeliveryAddress = async () => {
    const response = await getDeliveryAddressByAccount(account.ID);

    // Gọi checkUsed cho từng địa chỉ
    const dataWithUsed = await Promise.all(
      response.map(async (item) => {
        try {
          const usedRes = await checkDeliveryUsed(item.ID);
          return { ...item, isUsedInOrder: usedRes === true };
        } catch (error) {
          console.error(`Failed to check if address ${item.ID} is used`, error);
          return { ...item, isUsedInOrder: false }; // fallback nếu lỗi
        }
      })
    );

    setAddresses(dataWithUsed);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllDeliveryAddress();
    }
  }, [isLoggedIn, account?.ID]);

  const [accountAddress, setAccountAddress] = useState(null);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isDeleteAddressModalOpen, setIsDeleteAddressModalOpen] =
    useState(false);
  const handleCloseAddAddressModal = () => {
    setIsAddAddressModalOpen(false);
  };
  const handleCloseUpdateAddressModal = () => {
    setIsEditAddressModalOpen(false);
  };
  const handleCloseDeleteAddressModal = () => {
    setIsDeleteAddressModalOpen(false);
  };
  const handleDeleteConfirm = async () => {
    try {
      await deleteAccountDelivery(accountAddress?.ID);
      toast.success("Xóa địa chỉ thành công!");
      fetchAllDeliveryAddress();
      setIsDeleteAddressModalOpen(false);
      // onSuccessDelete();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Xóa địa chỉ thất bại. Vui lòng thử lại sau.");
    }
  };

  const handleAddNewAddress = () => {
    setIsAddAddressModalOpen(true);
  };
  const handleSuccessAddAddress = async () => {
    await fetchAllDeliveryAddress();
  };
  const handleSuccessUpdateAddress = async () => {
    await fetchAllDeliveryAddress();
  };
  const handleEditAddress = (item) => {
    setIsEditAddressModalOpen(true);
    setAccountAddress(item);
    // onClose();
  };
  const handleDeleteAddress = (item) => {
    setIsDeleteAddressModalOpen(true);
    setAccountAddress(item);
  };

  console.log("Address row:", addresses);

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
                  disabled
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
                  label="Ngày sinh"
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" className="section-title">
              Địa chỉ của tôi
            </Typography>

            <Button
              variant="contained"
              className="add-address-button"
              onClick={handleAddNewAddress}
              sx={{ color: "white", marginBottom: "20px" }}
            >
              Thêm địa chỉ
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên người nhận</TableCell>
                  <TableCell>Tỉnh/thành phố</TableCell>
                  <TableCell>Địa chỉ nhận hàng</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Sửa</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Xóa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData?.map((address) => (
                  <TableRow key={address?.ID}>
                    <TableCell>
                      {address?.DeliveryAddress.Name}
                      {address?.IsDefault && (
                        <span className="default-badge">Mặc định</span>
                      )}
                    </TableCell>
                    <TableCell>{address?.DeliveryAddress.Province}</TableCell>
                    <TableCell>{address?.DeliveryAddress.Address}</TableCell>
                    <TableCell>
                      {address?.DeliveryAddress.PhoneNumber}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton
                        className="edit-button"
                        onClick={() => handleEditAddress(address)}
                        disabled={address?.isUsedInOrder}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton
                        className="delete-button"
                        disabled={address?.isUsedInOrder}
                        onClick={() => handleDeleteAddress(address)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography
            variant="caption"
            color="error"
            sx={{ marginTop: "5px", marginLeft: "24px" }}
          >
            Lưu ý: Những địa chỉ đã được sử dụng trong đơn hàng bạn không thể
            chỉnh sửa hoặc xóa.
          </Typography>
          <TablePagination
            component="div"
            count={addresses?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5]}
          />
        </Paper>
      </Container>

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={handleCloseAddAddressModal}
        onSuccess={handleSuccessAddAddress}
      ></AddAddressModal>
      <UpdateAddressModal
        isOpen={isEditAddressModalOpen}
        onClose={handleCloseUpdateAddressModal}
        onSuccess={handleSuccessUpdateAddress}
        initiateAddress={accountAddress}
      ></UpdateAddressModal>
      <ConfirmDeleteModal
        open={isDeleteAddressModalOpen}
        onCancel={handleCloseDeleteAddressModal}
        onConfirm={handleDeleteConfirm}
        title="Cảnh báo"
        description="Bạn có chắc muốn xóa địa chỉ này không?"
        subDescription="Sau khi xóa bạn sẽ không thể khôi phục lại!"
        getContainer={false}
        className="custom-delete-modal"
      />
    </div>
  );
};

export default UserProfile;
