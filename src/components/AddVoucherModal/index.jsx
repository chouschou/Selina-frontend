import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Optional: Tiếng Việt

import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import "./AddVoucherModal.scss";
import { useState } from "react";
import { addVoucher } from "../../services/voucher/addVoucher";
import { toast } from "react-toastify";

function AddVoucherModal({ open, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [voucherPercentage, setVoucherPercentage] = useState("");
  const [remainingQuantity, setRemainingQuantity] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxDiscountValue, setMaxDiscountValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateError, setDateError] = useState("");

  const resetForm = () => {
    setName("");
    setDescription("");
    setVoucherPercentage("");
    setRemainingQuantity("");
    setMinOrderValue("");
    setMaxDiscountValue("");
    setStartDate(null);
    setEndDate(null);
    setDateError("");
  };
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    let hasError = false;

    if (!name.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      hasError = true;
    } else if (!voucherPercentage) {
      toast.error("Vui lòng nhập giá trị khuyến mãi");
      hasError = true;
    } else if (!remainingQuantity) {
      toast.error("Vui lòng nhập số lượng");
      hasError = true;
    } else if (!startDate) {
      toast.error("Vui lòng chọn ngày có hiệu lực");
      hasError = true;
    } else if (!endDate) {
      toast.error("Vui lòng chọn ngày hết hạn");
      hasError = true;
    } else if (!minOrderValue) {
      toast.error("Vui lòng nhập giá trị đơn hàng tối thiểu");
      hasError = true;
    } else if (!maxDiscountValue) {
      toast.error("Vui lòng nhập giảm giá tối đa");
      hasError = true;
    } else if (startDate && endDate && dayjs(startDate).isAfter(endDate)) {
      setDateError("Ngày có hiệu lực phải trước ngày hết hạn");
      hasError = true;
    } else {
      setDateError("");
    }

    if (hasError) return;

    const data = {
      Name: name,
      Description: description,
      StartDate: dayjs(startDate).format("YYYY-MM-DD"),
      EndDate: dayjs(endDate).format("YYYY-MM-DD"),
      VoucherPercentage: Number(voucherPercentage),
      MaxDiscountValue: Number(maxDiscountValue),
      MinOrderValue: Number(minOrderValue),
      RemainingQuantity: Number(remainingQuantity),
    };

    try {
      await addVoucher(data);
      onSuccess?.(); // callback khi thêm thành công
      onClose();
      toast.success("Thêm voucher thành công");
    } catch (err) {
      toast.error("Thêm voucher thất bại", err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      className="add-voucher-modal"
    >
      <DialogTitle className="modal-title">
        Thêm mã khuyến mãi
        <IconButton onClick={handleClose} className="close-button">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box className="modal-content">
          <TextField
            required
            label="Tiêu đề"
            fullWidth
            className="form-field"
            placeholder="Nhập tiêu đề"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Mô tả"
            fullWidth
            className="form-field"
            multiline
            inputProps={{ maxLength: 500 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả chi tiết về chương trình khuyến mãi (tuỳ chọn)"
            helperText={
              <span style={{ display: "flex", justifyContent: "flex-end" }}>
                {description.length}/500
              </span>
            }
          />

          <Box className="row-fields">
            <TextField
              required
              label="Giá trị khuyến mãi"
              className="form-field"
              type="number"
              value={voucherPercentage}
              onChange={(e) => setVoucherPercentage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault(); // Chặn dấu "-" và "e" (scientific notation)
                }
              }}
              inputProps={{ min: 0, step: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />

            <TextField
              required
              label="Số lượng"
              className="form-field"
              type="number"
              value={remainingQuantity}
              onChange={(e) => setRemainingQuantity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault(); // Chặn dấu "-" và "e" (scientific notation)
                }
              }}
              inputProps={{ min: 0, step: 1 }}
            />
          </Box>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <Box className="row-fields">
              <DatePicker
                label="Ngày có hiệu lực"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    className: "form-field",
                    required: true,
                    InputProps: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            </Box>

            <Box className="row-fields">
              <DatePicker
                label="Ngày hết hạn"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    className: "form-field",
                    required: true,
                    InputProps: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                    error: !!dateError,
                    helperText: dateError,
                  },
                }}
              />
            </Box>
          </LocalizationProvider>

          <Box className="row-fields">
            <TextField
              required
              label="Giá trị đơn hàng tối thiểu"
              fullWidth
              className="form-field"
              type="number"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault(); // Chặn dấu "-" và "e" (scientific notation)
                }
              }}
              inputProps={{ min: 0, step: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">đ</InputAdornment>,
              }}
            />

            <TextField
              required
              label="Giảm giá tối đa"
              fullWidth
              className="form-field"
              type="number"
              value={maxDiscountValue}
              onChange={(e) => setMaxDiscountValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault(); // Chặn dấu "-" và "e" (scientific notation)
                }
              }}
              inputProps={{ min: 0, step: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">đ</InputAdornment>,
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="modal-actions">
        <Button onClick={onClose} className="cancel-btn">
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="save-btn"
          onClick={handleSave}
        >
          Xong
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddVoucherModal;
