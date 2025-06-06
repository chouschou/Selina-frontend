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
import "dayjs/locale/vi";

import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import "./UpdateVoucherModal.scss";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateVoucher } from "../../services/voucher/updateVoucher";

function UpdateVoucherModal({ voucher, open, onClose, onSuccess, editable }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    voucherPercentage: "",
    remainingQuantity: "",
    startDate: null,
    endDate: null,
    minOrderValue: "",
    maxDiscountValue: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
  if (voucher && open) {
    setFormData({
      name: voucher.Name || "",
      description: voucher.Description || "",
      voucherPercentage: voucher.VoucherPercentage || "",
      remainingQuantity: voucher.RemainingQuantity || "",
      startDate: voucher.StartDate ? dayjs(voucher.StartDate, "DD/MM/YYYY") : null,
      endDate: voucher.EndDate ? dayjs(voucher.EndDate, "DD/MM/YYYY") : null,
      minOrderValue: voucher.MinOrderValue || "",
      maxDiscountValue: voucher.MaxDiscountValue || "",
    });
  }
}, [voucher, open]);


  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setFormErrors({ ...formErrors, [field]: "" });
  };

  const handleDateChange = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: "" });
  };

  const validateForm = () => {
    const errors = {};
    const {
      name,
      voucherPercentage,
      remainingQuantity,
      startDate,
      endDate,
      minOrderValue,
      maxDiscountValue,
    } = formData;

    if (!name.trim()) errors.name = "Vui lòng nhập tiêu đề";
    if (!voucherPercentage)
      errors.voucherPercentage = "Vui lòng nhập giá trị khuyến mãi";
    if (!remainingQuantity) errors.remainingQuantity = "Vui lòng nhập số lượng";
    if (!startDate) errors.startDate = "Vui lòng chọn ngày có hiệu lực";
    if (!endDate) errors.endDate = "Vui lòng chọn ngày hết hạn";
    if (startDate && endDate && dayjs(startDate).isAfter(endDate)) {
      errors.endDate = "Ngày hết hạn phải sau ngày bắt đầu";
    }
    if (!minOrderValue)
      errors.minOrderValue = "Vui lòng nhập giá trị đơn hàng tối thiểu";
    if (!maxDiscountValue)
      errors.maxDiscountValue = "Vui lòng nhập giảm giá tối đa";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const data = {
      ...voucher,
      Name: formData.name,
      Description: formData.description,
      StartDate: dayjs(formData.startDate).format("YYYY-MM-DD"),
      EndDate: dayjs(formData.endDate).format("YYYY-MM-DD"),
      VoucherPercentage: Number(formData.voucherPercentage),
      MaxDiscountValue: Number(formData.maxDiscountValue),
      MinOrderValue: Number(formData.minOrderValue),
      RemainingQuantity: Number(formData.remainingQuantity),
    };

    try {
      await updateVoucher(voucher.ID, data);
      onSuccess?.();
      onClose();
      toast.success("Cập nhật voucher thành công");
    } catch (error) {
      toast.error(`Lỗi: ${error?.message || "Cập nhật voucher thất bại"}`);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="add-voucher-modal"
    >
      <DialogTitle className="modal-title">
        {editable ? "Cập nhật mã khuyến mãi" : "Chi tiết mã khuyến mãi"}
        <IconButton onClick={onClose} className="close-button">
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
            value={formData.name}
            onChange={handleChange("name")}
            error={!!formErrors.name}
            helperText={formErrors.name}
            disabled={!editable}
          />

          <TextField
            label="Mô tả"
            fullWidth
            className="form-field"
            multiline
            inputProps={{ maxLength: 500 }}
            value={formData.description}
            onChange={handleChange("description")}
            placeholder="Nhập mô tả chi tiết về chương trình khuyến mãi (tuỳ chọn)"
            helperText={
              formErrors.description || (
                <span style={{ display: "flex", justifyContent: "flex-end" }}>
                  {formData.description.length}/500
                </span>
              )
            }
            disabled={!editable}
          />

          <Box className="row-fields">
            <TextField
              required
              label="Giá trị khuyến mãi"
              className="form-field"
              type="number"
              value={Number(formData.voucherPercentage)}
              onChange={handleChange("voucherPercentage")}
              error={!!formErrors.voucherPercentage}
              helperText={formErrors.voucherPercentage}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault();
              }}
              inputProps={{ min: 0, step: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              disabled={!editable}
            />

            <TextField
              required
              label="Số lượng"
              className="form-field"
              type="number"
              value={formData.remainingQuantity}
              onChange={handleChange("remainingQuantity")}
              error={!!formErrors.remainingQuantity}
              helperText={formErrors.remainingQuantity}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault();
              }}
              inputProps={{ min: 0, step: 1 }}
              disabled={!editable}
            />
          </Box>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <Box className="row-fields">
              <DatePicker
                label="Ngày có hiệu lực"
                value={formData.startDate}
                onChange={handleDateChange("startDate")}
                disabled={!editable}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    className: "form-field",
                    required: true,
                    error: !!formErrors.startDate,
                    helperText: formErrors.startDate,
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
                value={formData.endDate}
                onChange={handleDateChange("endDate")}
                disabled={!editable}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    className: "form-field",
                    required: true,
                    error: !!formErrors.endDate,
                    helperText: formErrors.endDate,
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
          </LocalizationProvider>

          <Box className="row-fields">
            <TextField
              required
              label="Giá trị đơn hàng tối thiểu"
              fullWidth
              className="form-field"
              type="number"
              value={Number(formData.minOrderValue)}
              onChange={handleChange("minOrderValue")}
              error={!!formErrors.minOrderValue}
              helperText={formErrors.minOrderValue}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault();
              }}
              inputProps={{ min: 0, step: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">đ</InputAdornment>,
              }}
              disabled={!editable}
            />

            <TextField
              required
              label="Giảm giá tối đa"
              fullWidth
              className="form-field"
              type="number"
              value={Number(formData.maxDiscountValue)}
              onChange={handleChange("maxDiscountValue")}
              error={!!formErrors.maxDiscountValue}
              helperText={formErrors.maxDiscountValue}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault();
              }}
              inputProps={{ min: 0, step: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">đ</InputAdornment>,
              }}
              disabled={!editable}
            />
          </Box>
        </Box>
      </DialogContent>

      {editable && (
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
            Lưu
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default UpdateVoucherModal;
