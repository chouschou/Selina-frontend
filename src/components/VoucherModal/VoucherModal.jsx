import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
  Card,
  IconButton,
} from "@mui/material";
import { useContext, useState } from "react";
import "./VoucherModal.scss";
import { Add as AddIcon, MoreVert as MoreVertIcon } from "@mui/icons-material";
import { Grid } from "@mui/system";
import { formatCurrencyVND } from "../../services/formatToShow";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { addAccountVoucher } from "../../services/voucher/addAccountVoucher";
import { toast } from "react-toastify";

export const VoucherModal = ({
  open,
  onClose,
  onSelect,
  accountVouchers,
  availableVouchers,
  fetchOtherVouchers,
  fetchAccountVouchers,
}) => {
  console.log("Voucher accountVouchers:", accountVouchers);
  console.log("Voucher other:", availableVouchers);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const [expandedVoucherId, setExpandedVoucherId] = useState(null);
  const { isLoggedIn, account } = useContext(AuthContext);

  const handleSelect = () => {
    const selected = accountVouchers.find((v) => v.ID === selectedVoucherId); //id voucher account
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  const handleToggleDetails = (id) => {
    setExpandedVoucherId((prev) => (prev === id ? null : id));
  };

  const handleClaimVoucher = async (idVoucher) => {
    if (isLoggedIn && account && idVoucher) {
      try {
        await addAccountVoucher({
          Account_ID: account.ID,
          Voucher_ID: idVoucher,
        });
        toast.success("Bạn đã nhận voucher thành công!");
        fetchOtherVouchers();
        fetchAccountVouchers();
      } catch (error) {
        console.error("Error claiming voucher:", error);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      className="voucher-modal"
    >
      <DialogTitle>Chọn voucher</DialogTitle>
      <DialogContent dividers>
        <Typography
          fontWeight={600}
          sx={{
            padding: " 2px 10px",
            backgroundColor: "#adfdfc",
            border: "1px solid #adfdfc",
            display: "inline-block",
            borderRadius: "20px",
          }}
        >
          Voucher của bạn
        </Typography>
        <RadioGroup
          value={selectedVoucherId}
          onChange={(e) => setSelectedVoucherId(Number(e.target.value))}
        >
          <Grid
            container
            spacing={3}
            className="voucher-grid voucher-grid-account"
          >
            {accountVouchers.map((voucher) => {
              const isExpanded = expandedVoucherId === voucher.Voucher.ID;
              return (
                <Grid item xs={12} sm={6} md={4} key={voucher.Voucher.ID}>
                  <Box >
                    {/* Nội dung voucher */}
                    <Box flex={1} display="flex" alignItems="center">
                      {/* Nút radio ở bên trái, căn giữa theo chiều dọc */}
                      <Radio
                        value={voucher.ID}
                        sx={{ alignSelf: "center", ml: 1, marginTop: "15px" }}
                      />
                      <Card className="voucher-card" sx={{ p: 2 }}>
                        <Box className="voucher-content">
                          <Typography className="discount">
                            -{Number(voucher.Voucher.VoucherPercentage)}%
                          </Typography>
                          <Box className="voucher-details">
                            <Typography className="usage">
                              Còn: {voucher.Voucher.RemainingQuantity} voucher
                            </Typography>
                            <Typography className="validity">
                              Có hiệu lực từ: {voucher.Voucher.StartDate}
                            </Typography>
                            <Typography
                              className="expiry"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              Hạn sử dụng: {voucher.Voucher.EndDate}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          size="small"
                          onClick={() =>
                            handleToggleDetails(voucher.Voucher.ID)
                          }
                          sx={{
                            ml: 1,
                            marginTop: "8px",
                            textAlign: "right",
                            textTransform: "none",
                          }}
                        >
                          {isExpanded ? "Thu gọn" : "Chi tiết"}
                        </Button>
                      </Card>

                     
                    </Box>
                     <Collapse in={isExpanded}>
                        <Box
                          sx={{
                            mt: 1,
                            p: 1,
                            border: "1px solid #ddd",
                            borderRadius: 1,
                          }}
                          className="voucher-details"
                        >
                          <Typography sx={{ fontWeight: 600 }}>
                            {voucher.Voucher.Name}
                          </Typography>
                          <Typography>
                            <b>Thời gian sử dụng mã:</b>{" "}
                            {voucher.Voucher.StartDate} -{" "}
                            {voucher.Voucher.EndDate}
                          </Typography>
                          <Typography sx={{ textAlign: "justify" }}>
                            <b>Ưu đãi:</b> Lượt sử dụng có hạn. Giảm{" "}
                            {voucher.Voucher.VoucherPercentage}%, đơn tối thiểu{" "}
                            {formatCurrencyVND(voucher.Voucher.MinOrderValue)},
                            giảm tối đa{" "}
                            {formatCurrencyVND(
                              voucher.Voucher.MaxDiscountValue
                            )}
                          </Typography>
                          {voucher.Voucher.Description && (
                            <Typography>
                              <b>Mô tả:</b> {voucher.Voucher.Description}
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </RadioGroup>

        <Typography
          fontWeight={600}
          mt={3}
          sx={{
            padding: " 2px 10px",
            backgroundColor: "#adfdfc",
            border: "1px solid #adfdfc",
            display: "inline-block",
            borderRadius: "20px",
            // marginBottom: "10px",
          }}
        >
          Nhận thêm voucher
        </Typography>
        <Grid container spacing={3} className="voucher-grid">
          {availableVouchers.map((voucher) => {
            const isExpanded = expandedVoucherId === voucher.ID;

            return (
              <Grid item xs={12} sm={6} md={4} key={voucher.ID}>
                <Card className="voucher-card" sx={{ p: 2 }}>
                  <Box className="voucher-content">
                    <Typography className="discount">
                      -{Number(voucher.VoucherPercentage)}%
                    </Typography>
                    <Box className="voucher-details">
                      <Typography className="usage">
                        Còn: {voucher.RemainingQuantity} voucher
                      </Typography>
                      <Typography className="validity">
                        Có hiệu lực từ: {voucher.StartDate}
                      </Typography>
                      <Typography
                        className="expiry"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        Hạn sử dụng: {voucher.EndDate}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    size="small"
                    onClick={() => handleToggleDetails(voucher.ID)}
                    sx={{
                      ml: 1,
                      marginTop: "8px",
                      textAlign: "right",
                      textTransform: "none",
                    }}
                  >
                    {isExpanded ? "Thu gọn" : "Chi tiết"}
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: "20px",
                      padding: "3px",
                      fontSize: "12px",
                      backgroundColor: "#ff767c",
                      color: "#fff",
                      mt: 1,
                    }}
                    onClick={() => handleClaimVoucher(voucher.ID)}
                  >
                    Lấy mã
                  </Button>
                </Card>

                <Collapse in={isExpanded}>
                  <Box
                    sx={{
                      mt: 1,
                      p: 1,
                      border: "1px solid #ddd",
                      borderRadius: 1,
                    }}
                    className="voucher-details"
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      {voucher.Name}
                    </Typography>
                    <Typography>
                      <b>Thời gian sử dụng mã:</b> {voucher.StartDate} -{" "}
                      {voucher.EndDate}
                    </Typography>
                    <Typography sx={{ textAlign: "justify" }}>
                      <b>Ưu đãi:</b> Lượt sử dụng có hạn. Giảm{" "}
                      {voucher.VoucherPercentage}%, đơn tối thiểu{" "}
                      {formatCurrencyVND(voucher.MinOrderValue)}, giảm tối đa{" "}
                      {formatCurrencyVND(voucher.MaxDiscountValue)}
                    </Typography>
                    {voucher.Description && (
                      <Typography>
                        <b>Mô tả:</b> {voucher.Description}
                      </Typography>
                    )}
                  </Box>
                </Collapse>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button
          onClick={handleSelect}
          disabled={!selectedVoucherId}
          variant="contained"
          sx={{ color: "#fff" }}
        >
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};
