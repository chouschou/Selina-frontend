import { useEffect, useState } from "react";
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
import { getAllVouchers } from "../../services/voucher/getAllVouchers";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal/ConfirmDeleteModal";
import { toast } from "react-toastify";
import { deleteVoucher } from "../../services/voucher/deleteVoucher";
import UpdateVoucherModal from "../../components/UpdateVoucherModal";

function VoucherCard({ voucher, fetchAllVouchers }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editable, setEditable] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (voucher) => {
    setAnchorEl(null);
    setSelectedVoucher(voucher);
  };
  const handleOpenDetailVoucher = () => {
    setEditable(false);
    setIsUpdateModalOpen(true);
    setAnchorEl(null);
    setSelectedVoucher(voucher);
  };
  const handleOpenUpdateModal = () => {
    setEditable(true);
    setIsUpdateModalOpen(true);
    setAnchorEl(null);
    setSelectedVoucher(voucher);
  };
  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setAnchorEl(null);
    setSelectedVoucher(voucher);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteVoucher = async () => {
    try {
      await deleteVoucher(voucher.ID);
      toast.success("Xóa voucher thành công.");
      setSelectedVoucher(null);
      fetchAllVouchers();
    } catch (error) {
      toast.error(error.message || "Xóa voucher thất bại");
    } finally {
      handleCloseDeleteModal();
    }
  };

  return (
    <>
      <Card className="voucher-card">
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
            <Typography className="expiry">
              Hạn sử dụng: {voucher.EndDate}
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
          <MenuItem onClick={() => handleOpenDetailVoucher()}>
            Chi tiết
          </MenuItem>
          <MenuItem onClick={() => handleOpenUpdateModal()}>Chỉnh sửa</MenuItem>
          <MenuItem onClick={() => handleOpenDeleteModal()}>Xóa</MenuItem>
        </Menu>
      </Card>
      <UpdateVoucherModal
        voucher={selectedVoucher}
        open={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onSuccess={fetchAllVouchers}
        editable={editable}
      />
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleDeleteVoucher}
        description="Bạn có chắc muốn xóa voucher này không?"
      ></ConfirmDeleteModal>
    </>
  );
}

function VoucherManage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vouchers, setVouchers] = useState([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const parseDate = (str) => {
    const [day, month, year] = str.split("/");
    return new Date(`${year}-${month}-${day}T23:59:59`);
  };

  const fetchAllVouchers = async () => {
    const response = await getAllVouchers();
    const now = new Date();

    const validVouchers = response.filter((voucher) => {
      const endDate = parseDate(voucher.EndDate);
      return endDate >= now;
    });

    setVouchers(validVouchers);
  };

  useEffect(() => {
    fetchAllVouchers();
  }, []);

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
        {vouchers.map((voucher) => (
          <Grid item xs={12} sm={6} md={4} key={voucher.ID}>
            <VoucherCard
              voucher={voucher}
              fetchAllVouchers={fetchAllVouchers}
            />
          </Grid>
        ))}
      </Grid>

      <AddVoucherModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchAllVouchers}
      />
    </Box>
  );
}

export default VoucherManage;
