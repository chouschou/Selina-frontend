import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Card,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Add as AddIcon, MoreVert as MoreVertIcon } from "@mui/icons-material";
import AddVoucherModal from "../../components/AddVoucherModal";
import "./VoucherManage.scss";

const sampleVouchers = [
  {
    id: 1,
    discount: 50,
    used: 2,
    total: 5,
    startDate: "0h00, 10/09/2024",
    endDate: "23h59, 10/09/2024",
  },
  // More sample vouchers...
];

function VoucherCard({ voucher }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card className="voucher-card">
      <Box className="voucher-content">
        <Typography className="discount">-{voucher.discount}%</Typography>
        <Box className="voucher-details">
          <Typography className="usage">
            Đã sử dụng: {voucher.used}/{voucher.total}
          </Typography>
          <Typography className="validity">
            Có hiệu lực từ: {voucher.startDate}
          </Typography>
          <Typography className="expiry">
            Hạn sử dụng: {voucher.endDate}
          </Typography>
        </Box>
      </Box>
      <IconButton className="more-button" onClick={handleMenuOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Chỉnh sửa</MenuItem>
        <MenuItem onClick={handleMenuClose}>Xóa</MenuItem>
      </Menu>
    </Card>
  );
}

function VoucherManage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box className="voucher-content-container">
      <div className="header">
        <div>
          <h1>Quản lý voucher</h1>
          <p>Quản lý và tạo các voucher khuyến mãi mới.</p>
        </div>
        <button className="add-product-btn" onClick={handleOpenModal}>
          Thêm voucher
        </button>
      </div>
      {/* <Box className="header-actions">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          className="add-voucher-btn"
        >
          Thêm voucher
        </Button>
      </Box> */}

      <Grid container spacing={3} className="voucher-grid">
        {sampleVouchers.map((voucher) => (
          <Grid item xs={12} sm={6} md={4} key={voucher.id}>
            <VoucherCard voucher={voucher} />
          </Grid>
        ))}
      </Grid>

      <AddVoucherModal open={isModalOpen} onClose={handleCloseModal} />
    </Box>
  );
}

export default VoucherManage;
