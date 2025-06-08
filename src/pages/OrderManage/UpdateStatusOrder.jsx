import {
  Button,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import "./OrderManage.scss";

const UpdateStatusOrder = ({
  open,
  onClose,
  selectedOrder,
  newStatus,
  setNewStatus,
  handleUpdateStatus,
}) => {
  const getAvailableStatusOptions = (status) => {
    switch (status) {
      case "waiting":
        return [
          { value: "confirmed", label: "Nhận đơn" },
          { value: "canceled", label: "Không nhận đơn" },
        ];
      case "confirmed":
        return [{ value: "shipping", label: "Đang giao hàng" }];
      case "canceled":
        return [{ value: "refunded", label: "Đã hoàn tiền" }];
      case "returned":
        return [{ value: "refunded", label: "Đã hoàn tiền" }];
      default:
        return [];
    }
  };

  const statusOptions = getAvailableStatusOptions(selectedOrder?.status || "");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Chọn trạng thái mới cho đơn hàng {selectedOrder?.orderId}
        </DialogContentText>
        <FormControl fullWidth margin="dense">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={newStatus || ""} // sử dụng state riêng thay vì selectedOrder?.newStatus
            onChange={(e) => setNewStatus(e.target.value)}
            label="Trạng thái"
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleUpdateStatus}
          variant="contained"
          color="primary"
          sx={{ color: "white" }}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStatusOrder;
