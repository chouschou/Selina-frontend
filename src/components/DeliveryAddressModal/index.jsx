import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import AddAddressModal from "./AddAddressModal";
import UpdateAddressModal from "./UpdateAddressModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { deleteAccountDelivery } from "../../services/accountDelivery/deleteAccountDelivery";
import { toast } from "react-toastify";
import "./DeliveryAddressModal.scss";

const DeliveryAddressModal = ({
  isOpen,
  onClose,
  selectedAddress,
  setSelectedAddress,
  deliveryAddresses,
  fetchAllDeliveryAddress,
  onSuccessDelete,
}) => {
  const [selectedID, setSelectedID] = useState(null);
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
      onSuccessDelete();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Xóa địa chỉ thất bại. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    setSelectedID(selectedAddress?.ID);
  }, [selectedAddress]);

  const handleConfirm = () => {
    const selected = deliveryAddresses.find((item) => item.ID === selectedID);
    setSelectedAddress(selected);
    onClose();
    // fetchAllDeliveryAddress();
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
    onClose();
  };

  console.log("Delivery Addresses:", deliveryAddresses);
  console.log("Selected ID:", selectedID);
  console.log("Selected Address:", selectedAddress);

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            Chọn địa chỉ giao hàng
            <IconButton onClick={onClose} color="inherit">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <RadioGroup
            value={selectedID}
            onChange={(e) => setSelectedID(Number(e.target.value))}
          >
            {deliveryAddresses.map((item) => (
              <Box
                key={item.ID}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  padding: 2,
                  mb: 2,
                }}
              >
                <Box
                  key={item.ID}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Left Side: Radio + Info */}
                  <Box sx={{ flexGrow: 1 }}>
                    <FormControlLabel
                      value={item.ID}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {item.DeliveryAddress.Name} -{" "}
                            {item.DeliveryAddress.PhoneNumber}
                          </Typography>
                          <Typography variant="body2" sx={{ marginTop: "3px" }}>
                            {item.DeliveryAddress.Address}
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>

                  {!item.isUsedInOrder && (
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      mt={1}
                      gap={1}
                    >
                      <Button
                        size="small"
                        onClick={() => handleEditAddress(item)}
                      >
                        Cập nhật
                      </Button>
                      <Typography
                        variant="body2"
                        sx={{ alignSelf: "center", px: 1 }}
                      >
                        |
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteAddress(item)}
                      >
                        Xóa
                      </Button>
                    </Box>
                  )}
                </Box>
                {/* "Mặc định" */}
                {item.IsDefault && (
                  <Button
                    variant="outlined"
                    size="small"
                    disabled
                    sx={{
                      color: "#fff",
                      backgroundColor: "#af350f",
                      borderColor: "#af350f",
                      marginLeft: "30px",
                      marginTop: "10px",
                      "&.Mui-disabled": {
                        color: "#fff",
                        backgroundColor: "#af350f",
                        borderColor: "#af350f",
                        opacity: 1,
                      },
                    }}
                  >
                    Mặc định
                  </Button>
                )}
              </Box>
            ))}
          </RadioGroup>

          {/* Action Buttons: Edit + Delete */}
        </DialogContent>

        <Typography
          variant="caption"
          color="error"
          sx={{ marginTop: "5px", marginLeft: "24px" }}
        >
          Lưu ý: Những địa chỉ đã được sử dụng trong đơn hàng bạn không thể
          chỉnh sửa hoặc xóa.
        </Typography>

        <DialogActions>
          <Button variant="outlined" onClick={handleAddNewAddress}>
            <AddIcon sx={{ marginRight: "5px" }}></AddIcon>Thêm địa chỉ mới
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{ color: "#fff" }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
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
    </>
  );
};

export default DeliveryAddressModal;
