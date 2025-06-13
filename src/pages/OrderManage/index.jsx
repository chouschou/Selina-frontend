import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Popover,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import "./OrderManage.scss";
import { formatCurrency, formatOrderID } from "../../services/formatToShow";
import UpdateStatusOrder from "./UpdateStatusOrder";
import DetailOrder from "./DetailOrder";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { getAllOrders } from "../../services/order/getAllOrders";
import { updateStatusRefund } from "../../services/order/updateStatusRefund";
import { toast } from "react-toastify";
import { updateStatus } from "../../services/order/updateStatus";

// Order status data for formatting
const statusData = {
  waiting: {
    label: "Chưa xác nhận",
    color: "warning",
    icon: <AccessTimeIcon fontSize="small" />,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "info",
    icon: <CheckIcon fontSize="small" />,
  },
  shipping: {
    label: "Đang giao hàng",
    color: "primary",
    icon: <LocalShippingIcon fontSize="small" />,
  },
  completed: {
    label: "Hoàn thành",
    color: "success",
    icon: <TaskAltIcon fontSize="small" />,
  },
  canceled: {
    label: "Đã hủy",
    color: "error",
    icon: <HighlightOffIcon fontSize="small" />,
  },
  returned: {
    label: "Đã trả hàng",
    color: "error",
    icon: <HighlightOffIcon fontSize="small" />,
  },
  refunded: {
    label: "Đã hoàn tiền",
    color: "info",
    icon: <HighlightOffIcon fontSize="small" />,
  },
  unrefunded: {
    label: "Chưa hoàn tiền",
    color: "warn",
    icon: <HighlightOffIcon fontSize="small" />,
  },
};

const OrderManage = () => {
  // const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const [anchorElTimeFilter, setAnchorElTimeFilter] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [displayedMonthText, setDisplayedMonthText] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const sortAsc = false;
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOrderId, setMenuOrderId] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const [allOrders, setAllOrders] = useState([]);

  const handleTimeFilterClick = (event) => {
    setAnchorElTimeFilter(event.currentTarget);
  };

  const handleTimeFilterClose = () => {
    setAnchorElTimeFilter(null);
  };

  const handleTextMonthInput = (e) => {
    const value = e.target.value;
    setDisplayedMonthText(value);
    const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    if (regex.test(value)) {
      const [mm, yyyy] = value.split("/");
      const parsed = dayjs(`${yyyy}-${mm}-01`);
      setSelectedMonth(parsed);
      setTimeFilter(`${yyyy}-${mm}`);
    } else if (value === "") {
      setSelectedMonth(null);
      setTimeFilter("all");
    }
  };

  const handleMenuOpen = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setMenuOrderId(orderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOrderId(null);
  };

  const currentOrder = allOrders.find((o) => o.id === menuOrderId);

  const isUpdatable =
    currentOrder &&
    currentOrder.status !== "completed" &&
    currentOrder.status !== "shipping" &&
    (!["canceled", "returned"].includes(currentOrder.status) ||
      currentOrder.isPaid);

  const checkRefundable = (order) =>
    order && ["canceled", "returned"].includes(order.status) && order.isPaid;

  const isRefundable =
    checkRefundable(currentOrder) || checkRefundable(selectedOrder);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
    handleMenuClose();
  };

  const handleChangeStatus = async () => {
    if (isRefundable) {
      // const idOrderStatus = order
      try {
        await updateStatusRefund(currentOrder?.id ?? selectedOrder?.id, {
          RefundAt: new Date().toISOString(),
        });
        toast.success("Xác nhận đã hoàn tiền thành công!");
        fetchAllOrders();
      } catch (error) {
        toast.error("Lỗi xác nhận đã hoàn tiền!", error);
      }
    } else {
      setIsDetailDialogOpen(false);
      setSelectedOrder(currentOrder);
      // setNewStatus(currentOrder.status);
      setIsStatusDialogOpen(true);
    }

    handleMenuClose();
  };

  const handleUpdateStatus = async () => {
    if (selectedOrder && newStatus) {
      setIsStatusDialogOpen(false);
      try {
        await updateStatus(selectedOrder.id, {
          Status: newStatus,
          TransactionCode: null,
        });
        fetchAllOrders();

        toast.success("Cập nhật trạng thái thành công!");
      } catch (error) {
        toast.error("Lỗi cập nhật trạng thái", error);
      }

      setNewStatus("");
    }
  };

  const getStatusChip = (status) => {
    const statusInfo = statusData[status];
    return (
      <Chip
        icon={statusInfo.icon}
        label={statusInfo.label}
        color={statusInfo.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatOrderID(order.id, order.orderDate)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatusFilter =
      statusFilter === "all" ||
      order.status === statusFilter ||
      (statusFilter === "refunded" &&
        checkRefundable(order) &&
        order.isRefunded === true) ||
      (statusFilter === "unrefunded" &&
        checkRefundable(order) &&
        order.isRefunded === false);

    // Lấy phần ngày từ "12:00, 13/09/2025"
    const dateParts = order.orderDate.split(", ");
    const dateStr = dateParts.length === 2 ? dateParts[1] : ""; // "13/09/2025"
    const [day, month, year] = dateStr.split("/");
    const orderMonthYear = `${year}-${month.padStart(2, "0")}`;

    const matchesTimeFilter =
      timeFilter === "all" || orderMonthYear === timeFilter;

    return matchesSearch && matchesStatusFilter && matchesTimeFilter;
  });

  const sortedOrders = filteredOrders.sort((a, b) => {
    const timeA = new Date(
      a.orderDate.split(", ")[1].split("/").reverse().join("/") +
        " " +
        a.orderDate.split(", ")[0]
    );
    const timeB = new Date(
      b.orderDate.split(", ")[1].split("/").reverse().join("/") +
        " " +
        b.orderDate.split(", ")[0]
    );
    return sortAsc ? timeA - timeB : timeB - timeA;
  });

  const paginatedOrders = sortedOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const fetchAllOrders = async () => {
    const response = await getAllOrders();
    setAllOrders(response);
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  console.log("orders---:", allOrders);

  return (
    <Container maxWidth="lg" className="order-manage-container">
      <Box className="page-header">
        <Typography variant="h4" className="page-title">
          Quản lý đơn hàng
        </Typography>
      </Box>

      <Paper elevation={2} className="filters-container">
        <Box className="search-filter">
          <TextField
            placeholder="Tìm theo tên khách hàng, mã đơn hàng..."
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box className="status-filter">
          <FormControl size="small" variant="outlined" fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Trạng thái"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="waiting">Chưa xác nhận</MenuItem>
              <MenuItem value="confirmed">Đã xác nhận</MenuItem>
              <MenuItem value="shipping">Đang giao hàng</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="canceled">Đã hủy</MenuItem>
              <MenuItem value="returned">Đã trả hàng</MenuItem>
              <MenuItem value="refunded">Đã hoàn tiền</MenuItem>
              <MenuItem value="unrefunded">Chưa hoàn tiền</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper} className="orders-table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>
                Thời gian đặt
                <IconButton size="small" onClick={handleTimeFilterClick}>
                  <FilterListIcon fontSize="small" />
                </IconButton>
                <Popover
                  open={Boolean(anchorElTimeFilter)}
                  anchorEl={anchorElTimeFilter}
                  onClose={handleTimeFilterClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                >
                  <Box p={2} display="flex" flexDirection="column" gap={2}>
                    <TextField
                      label="Tháng đặt (MM/YYYY)"
                      value={displayedMonthText}
                      onChange={handleTextMonthInput}
                      size="small"
                      placeholder="MM/YYYY"
                    />

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedMonth(null);
                        setTimeFilter("all");
                        setDisplayedMonthText("");
                        handleTimeFilterClose();
                      }}
                    >
                      Bỏ lọc thời gian
                    </Button>
                  </Box>
                </Popover>
              </TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Thanh toán</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              paginatedOrders.map((order, index) => (
                <TableRow key={order.orderId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {formatOrderID(order.id, order.orderDate)}
                  </TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    {order.isPaid ? (
                      <Chip
                        icon={<CheckCircleIcon fontSize="small" />}
                        label="Đã thanh toán"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        icon={<HighlightOffIcon fontSize="small" />}
                        label="Thanh toán khi nhận hàng"
                        color="default"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(order.status)}{" "}
                    {checkRefundable(order) &&
                      getStatusChip(
                        order.isRefunded ? "refunded" : "unrefunded"
                      )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, order.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không tìm thấy đơn hàng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          sx={{ mr: 1 }}
        >
          Trang trước
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            setPage((prev) =>
              prev + 1 < Math.ceil(sortedOrders.length / rowsPerPage)
                ? prev + 1
                : prev
            )
          }
          disabled={(page + 1) * rowsPerPage >= sortedOrders.length}
        >
          Trang sau
        </Button>
      </Box>

      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            // const order = allOrders.find((o) => o.id === menuOrderId);
            if (currentOrder) handleViewDetails(currentOrder);
          }}
        >
          Xem chi tiết
        </MenuItem>
        {isUpdatable && !currentOrder.isRefunded && (
          <MenuItem onClick={handleChangeStatus}>
            {isRefundable ? "Xác nhận đã hoàn tiền" : "Cập nhật trạng thái"}
          </MenuItem>
        )}
      </Menu>

      <DetailOrder
        open={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        selectedOrder={selectedOrder}
        // onRequestStatusUpdate={() => {
        //   setIsDetailDialogOpen(false);
        //   setNewStatus(selectedOrder?.status || "");
        //   setIsStatusDialogOpen(true);
        // }}
        onRequestStatusUpdate={handleChangeStatus}
        getStatusChip={getStatusChip}
      />

      <UpdateStatusOrder
        open={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        selectedOrder={selectedOrder}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        handleUpdateStatus={handleUpdateStatus}
      />
    </Container>
  );
};

export default OrderManage;
