import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Box, flex } from "@mui/system";
import { useEffect, useState } from "react";
import { addAccountDelivery } from "../../services/accountDelivery/addAccountDelivery";
import { getProvinces } from "../../services/getProvinces";
import { toast } from "react-toastify";

const AddAddressModal = ({ isOpen, onClose, onSuccess }) => {
  const [isDefault, setIsDefault] = useState(false);
  const [provincesList, setProvincesList] = useState([]);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    province: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const resetForm = () => {
    setNewAddress({ name: "", phone: "", province: "", address: "" });
    setIsDefault(false);
    setErrors({});
  };
  const validate = () => {
    const newErrors = {};

    if (!newAddress.name?.trim()) newErrors.name = "Vui lòng nhập họ và tên";
    if (!newAddress.phone?.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0\d{9})$/.test(newAddress.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!newAddress.province) newErrors.province = "Vui lòng chọn khu vực";
    if (!newAddress.address?.trim())
      newErrors.address = "Vui lòng nhập địa chỉ cụ thể";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    async function fetchApi() {
      const provices = await getProvinces(1);
      if (provices) {
        const cleanedProvinces = provices
          .map((province) => {
            const cleanedName = province.name.replace(
              /^(Thành phố|Tỉnh)\s+/i,
              ""
            );
            return {
              ...province,
              name:
                cleanedName === "Hồ Chí Minh"
                  ? `TP ${cleanedName}`
                  : cleanedName,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));
        setProvincesList(cleanedProvinces);
      }
    }
    fetchApi();
  }, []);
  const handleAddressChange = (field, value) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAddress = async () => {
    if (!validate()) return;

    const address = {
      Name: newAddress.name,
      PhoneNumber: newAddress.phone,
      Province: newAddress.province,
      Address: newAddress.address,
      IsDefault: isDefault,
    };
    try {
      console.log("Adding address:", address);
      await addAccountDelivery(address);
      onSuccess();
      toast.success("Thêm địa chỉ thành công!", { autoClose: 1000 });
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Không thể thêm địa chỉ. Vui lòng thử lại sau.");
    }
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      maxWidth="sm"
      fullWidth
      className="address-modal"
    >
      <DialogTitle className="modal-title">
        Thêm địa chỉ giao hàng mới
        <IconButton
          className="close-button"
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="modal-content" sx={{ paddingBottom: 0 }}>
        <Box className="address-form">
          <Box display={flex} spacing={10} sx={{ paddingBottom: 3 }}>
            <Box sx={{ paddingBottom: 3 }}>
              <TextField
                fullWidth
                required
                label="Họ và tên"
                variant="outlined"
                // size="small"
                sx={{ width: "100%" }}
                value={newAddress.name}
                onChange={(e) => handleAddressChange("name", e.target.value)}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                required
                label="Số điện thoại"
                variant="outlined"
                sx={{ width: "100%" }}
                value={newAddress.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  // Chỉ giữ số và giới hạn 10 ký tự
                  if (/^\d{0,10}$/.test(value)) {
                    handleAddressChange("phone", value);
                  }
                }}
                error={Boolean(errors.phone)}
                helperText={errors.phone}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 10,
                }}
              />
            </Box>
          </Box>
          <Box item xs={12} sx={{ paddingBottom: 3 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel required>Tỉnh/ Thành phố</InputLabel>
              <Select
                value={newAddress.province}
                onChange={(e) =>
                  handleAddressChange("province", e.target.value)
                }
                label="Tỉnh/ Thành phố"
                error={Boolean(errors.province)}
              >
                {provincesList.map((province, index) => (
                  <MenuItem key={index} value={province.name}>
                    {province.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.province && (
                <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                  {errors.province}
                </Typography>
              )}
            </FormControl>
          </Box>
          <Box item xs={12} sx={{ paddingBottom: 3 }}>
            <TextField
              fullWidth
              required
              label="Địa chỉ cụ thể"
              placeholder="Số nhà/tên đường/khu phố, phường/xã, quận/huyện, tỉnh/thành phố"
              variant="outlined"
              size="small"
              multiline
              rows={3}
              value={newAddress.address}
              onChange={(e) => handleAddressChange("address", e.target.value)}
              error={Boolean(errors.address)}
              helperText={errors.address}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
            <Typography sx={{}}>Đặt làm địa chỉ mặc định</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className="modal-actions" sx={{ margin: 0 }}>
        <Button
          variant="contained"
          onClick={handleAddAddress}
          sx={{ color: "#fff" }}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AddAddressModal;
