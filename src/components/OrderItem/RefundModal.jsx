import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateStatusRefund } from "../../services/order/updateStatusRefund";
import { updateStatus } from "../../services/order/updateStatus";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";

const RefundModal = ({ isOpen, order, onClose, onSuccess, paid }) => {
  const [refundInfo, setRefundInfo] = useState({
    reason: "",
    bank: "",
    accountHolder: "",
    accountNumber: "",
  });
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState({});
  const [bankList, setBanksList] = useState([]);
  const { isLoggedIn, account } = useContext(AuthContext);

  const resetForm = () => {
    setRefundInfo({
      reason: "",
      bank: "",
      accountHolder: "",
      accountNumber: "",
    });
    setConfirmed(false);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!refundInfo.reason?.trim())
      newErrors.reason = "Vui lòng nhập lý do hủy đơn";

    if (paid) {
      if (!refundInfo.bank) newErrors.bank = "Vui lòng chọn ngân hàng";
      if (!refundInfo.accountHolder?.trim())
        newErrors.accountHolder = "Vui lòng nhập tên chủ tài khoản";
      if (!refundInfo.accountNumber?.trim()) {
        newErrors.accountNumber = "Vui lòng nhập số tài khoản";
      } else if (!/^\d{6,20}$/.test(refundInfo.accountNumber)) {
        newErrors.accountNumber = "Số tài khoản không hợp lệ";
      }
      if (!confirmed)
        newErrors.confirmed = "Bạn phải xác nhận thông tin là đúng sự thật";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    async function fetchBanks() {
      try {
        const response = await fetch("https://api.vietqr.io/v2/banks");
        const data = await response.json();
        const banks = data.data
          .filter((bank) => bank.shortName)
          .map((bank) => ({
            code: bank.code,
            name: bank.shortName,
          }))
          .sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp theo tên
        setBanksList(banks);
      } catch (error) {
        console.error("Lỗi khi tải danh sách ngân hàng:", error);
        toast.error("Không thể tải danh sách ngân hàng.");
      }
    }

    if (paid) fetchBanks();
  }, [paid]);

  const handleChange = (field, value) => {
    setRefundInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      console.log("Yêu cầu hủy đơn hàng:", refundInfo);
      if (isLoggedIn && order) {
        await updateStatus(order.id, {
          Status: "canceled",
        });

        if (order.paymentStatus === "Đã thanh toán") {
          await updateStatusRefund(order.id, {
            IDAccountCancelReturn: account.ID,
            Reason: refundInfo?.reason,
            Bank: refundInfo?.bank,
            AccountHolder: refundInfo?.accountHolder,
            AccountNumber: refundInfo?.accountNumber,
          });
        } else {
          await updateStatusRefund(order.id, {
            IDAccountCancelReturn: account.ID,
            Reason: refundInfo?.reason,
          });
        }
      }
      onSuccess();
      toast.success("Gửi yêu cầu hủy đơn hàng thành công!");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi hủy đơn:", error);
      toast.error("Không thể gửi yêu cầu. Vui lòng thử lại.");
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
    >
      <DialogTitle>
        Yêu cầu hủy đơn hàng
        <IconButton
          onClick={() => {
            resetForm();
            onClose();
          }}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          required
          multiline
          rows={3}
          label="Lý do hủy đơn"
          value={refundInfo.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          error={!!errors.reason}
          helperText={errors.reason}
          sx={{ mb: 2 }}
        />

        {paid && (
          <>
            <FormControl
              fullWidth
              required
              error={!!errors.bank}
              sx={{ mb: 2 }}
            >
              <InputLabel>Ngân hàng</InputLabel>
              <Select
                value={refundInfo.bank}
                label="Ngân hàng"
                onChange={(e) => handleChange("bank", e.target.value)}
              >
                {bankList.map((bank) => (
                  <MenuItem key={bank.code} value={bank.name}>
                    {bank.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.bank && (
                <Typography variant="caption" color="error">
                  {errors.bank}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              required
              label="Tên chủ tài khoản"
              value={refundInfo.accountHolder}
              onChange={(e) => handleChange("accountHolder", e.target.value)}
              error={!!errors.accountHolder}
              helperText={errors.accountHolder}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              required
              label="Số tài khoản"
              value={refundInfo.accountNumber}
              onChange={(e) => handleChange("accountNumber", e.target.value)}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              error={!!errors.accountNumber}
              helperText={errors.accountNumber}
              sx={{ mb: 2 }}
            />

            <Box display="flex" alignItems="center">
              <Checkbox
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <Typography>
                Tôi cam kết thông tin cung cấp là đúng sự thật
              </Typography>
            </Box>
            {errors.confirmed && (
              <Typography variant="caption" color="error">
                {errors.confirmed}
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ color: "white" }}
        >
          Gửi
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default RefundModal;
