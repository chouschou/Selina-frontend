import React, { useState } from "react"
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Divider,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import SaveIcon from "@mui/icons-material/Save"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import CheckIcon from "@mui/icons-material/Check"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import TaskAltIcon from "@mui/icons-material/TaskAlt"
import OrderStatusTimeline from "./OrderStatusTimeline"
import "./OrderManage.scss"

// Sample order data
const mockOrders = [
  {
    id: "1",
    orderId: "ORD001",
    customerName: "Kiều Minh Anh",
    orderDate: "12:00, 13/03/2025",
    total: 220000,
    status: "waiting",
    isPaid: true,
  },
  {
    id: "2",
    orderId: "ORD002",
    customerName: "Trần Văn Bình",
    orderDate: "15:30, 13/03/2025",
    total: 350000,
    status: "confirmed",
    isPaid: true,
  },
  {
    id: "3",
    orderId: "ORD003",
    customerName: "Nguyễn Thị Cúc",
    orderDate: "09:45, 14/03/2025",
    total: 180000,
    status: "shipping",
    isPaid: true,
  },
  {
    id: "4",
    orderId: "ORD004",
    customerName: "Lê Duy Dũng",
    orderDate: "16:20, 14/03/2025",
    total: 420000,
    status: "completed",
    isPaid: true,
  },
  {
    id: "5",
    orderId: "ORD005",
    customerName: "Phạm Thị Hoa",
    orderDate: "11:10, 15/03/2025",
    total: 190000,
    status: "cancelled",
    isPaid: false,
  },
  {
    id: "6",
    orderId: "ORD006",
    customerName: "Phạm Thị Minh",
    orderDate: "11:10, 12/03/2025",
    total: 290000,
    status: "cancelled",
    isPaid: false,
  },
]

// Sample order items for detail view
const mockOrderItems = [
  {
    id: "1",
    product: "Gọng kính cận R5603",
    price: 120000,
    quantity: 1,
    total: 120000,
  },
  {
    id: "2",
    product: "Tròng kính cận",
    price: 100000,
    quantity: 1,
    total: 100000,
  },
]

// Order status data for formatting
const statusData = {
  waiting: {
    label: "Chờ xác nhận",
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
  cancelled: {
    label: "Đã hủy",
    color: "error",
    icon: <HighlightOffIcon fontSize="small" />,
  },
}

const OrderManage = () => {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  //   const [dateFilter, setDateFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  const [page, setPage] = useState(0)
  const rowsPerPage = 10
  const [sortAsc, setSortAsc] = useState(true)

  // Action menu
  const [anchorEl, setAnchorEl] = useState(null)
  const [menuOrderId, setMenuOrderId] = useState(null)
  const isMenuOpen = Boolean(anchorEl)

  // Handle menu open
  const handleMenuOpen = (event, orderId) => {
    setAnchorEl(event.currentTarget)
    setMenuOrderId(orderId)
  }

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuOrderId(null)
  }

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatusFilter =
      statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatusFilter
  })

  // View order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setIsDetailDialogOpen(true)
    handleMenuClose()
  }

  // Open status change dialog
  const handleChangeStatus = () => {
    const order = orders.find((o) => o.id === menuOrderId)
    if (order) {
      setSelectedOrder(order)
      setNewStatus(order.status)
      setIsStatusDialogOpen(true)
    }
    handleMenuClose()
  }

  // Update order status
  const handleUpdateStatus = () => {
    if (selectedOrder && newStatus) {
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: newStatus }
            : order
        )
      )
      setIsStatusDialogOpen(false)
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ"
  }

  // Get chip color for status
  const getStatusChip = (status) => {
    const statusInfo = statusData[status]
    return (
      <Chip
        icon={statusInfo.icon}
        label={statusInfo.label}
        color={statusInfo.color}
        size="small"
        variant="outlined"
      />
    )
  }

  const sortedOrders = filteredOrders.sort((a, b) => {
    const timeA = new Date(
      a.orderDate.split(", ")[1].split("/").reverse().join("/") +
        " " +
        a.orderDate.split(", ")[0]
    )
    const timeB = new Date(
      b.orderDate.split(", ")[1].split("/").reverse().join("/") +
        " " +
        b.orderDate.split(", ")[0]
    )
    return sortAsc ? timeA - timeB : timeB - timeA
  })

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

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
              <MenuItem value="waiting">Chờ xác nhận</MenuItem>
              <MenuItem value="confirmed">Đã xác nhận</MenuItem>
              <MenuItem value="shipping">Đang giao hàng</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper} className="orders-table-container">
        <Table aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>
                Thời gian đặt{" "}
                <IconButton size="small" onClick={() => setSortAsc(!sortAsc)}>
                  <FilterListIcon fontSize="small" />
                </IconButton>
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
                  <TableCell>{order.orderId}</TableCell>
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
                        label="Chưa thanh toán"
                        color="default"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell>{getStatusChip(order.status)}</TableCell>
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

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            const order = orders.find((o) => o.id === menuOrderId)
            if (order) handleViewDetails(order)
          }}
        >
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleChangeStatus}>Cập nhật trạng thái</MenuItem>
      </Menu>

      {/* Order Detail Dialog */}
      <Dialog
        open={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết đơn hàng {selectedOrder?.orderId}</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Box className="order-detail-status-section">
                <OrderStatusTimeline status={selectedOrder.status} />
              </Box>

              <Box className="order-detail-info-section">
                <Typography variant="subtitle1" fontWeight={600}>
                  Thông tin đơn hàng
                </Typography>
                <Stack direction="row" spacing={2} mt={1}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Mã đơn hàng
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedOrder.orderId}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Ngày đặt
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedOrder.orderDate}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Trạng thái
                    </Typography>
                    <Box mt={0.5}>{getStatusChip(selectedOrder.status)}</Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Thanh toán
                    </Typography>
                    <Box mt={0.5}>
                      {selectedOrder.isPaid ? (
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
                          label="Chưa thanh toán"
                          color="default"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box className="customer-info-section">
                <Typography variant="subtitle1" fontWeight={600}>
                  Thông tin khách hàng
                </Typography>
                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    Họ tên
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedOrder.customerName}
                  </Typography>
                </Box>
                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    Địa chỉ giao hàng
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    123 Đường ABC, Phường XYZ, Quận 1, TP.HCM
                  </Typography>
                </Box>
                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    Số điện thoại
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    0912345678
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box className="order-items-section">
                <Typography variant="subtitle1" fontWeight={600}>
                  Sản phẩm
                </Typography>
                <TableContainer sx={{ mt: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell align="right">Đơn giá</TableCell>
                        <TableCell align="right">Số lượng</TableCell>
                        <TableCell align="right">Thành tiền</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockOrderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <Typography variant="subtitle2">
                            Tổng cộng:
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" fontWeight={600}>
                            {formatCurrency(selectedOrder.total)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDetailDialogOpen(false)}>Đóng</Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={() => {
              setIsDetailDialogOpen(false)
              setIsStatusDialogOpen(true)
            }}
          >
            Cập nhật trạng thái
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
      >
        <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Chọn trạng thái mới cho đơn hàng {selectedOrder?.orderId}
          </DialogContentText>
          <FormControl fullWidth margin="dense">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Trạng thái"
            >
              <MenuItem value="waiting">Chờ xác nhận</MenuItem>
              <MenuItem value="confirmed">Đã xác nhận</MenuItem>
              <MenuItem value="shipping">Đang giao hàng</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsStatusDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color="primary"
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default OrderManage
