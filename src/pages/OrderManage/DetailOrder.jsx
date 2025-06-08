import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import OrderStatusTimeline from "./OrderStatusTimeline";
import "./OrderManage.scss";
import {
  formatCurrency,
  formatOrderID,
  generateProductName,
  getColorNameFromHex,
  translateShapeToVietnamese,
} from "../../services/formatToShow";
import { useEffect, useState } from "react";
import { getDetailOrder } from "../../services/order/getDetailOrder";
import { formatDateTimeVN } from "../../services/formatDatetimeVN";
const DetailOrder = ({
  open,
  onClose,
  selectedOrder,
  onRequestStatusUpdate,
  getStatusChip,
}) => {
  const [detailOrder, setDetailOrder] = useState(null);
  const refunded = detailOrder?.OrderStatuses.find((o) => o.Refund !== null)
    ?.Refund.RefundAt
    ? true
    : false;
    console.log("refunded", refunded)
  useEffect(() => {
    const fetchDetailOrder = async () => {
      const response = await getDetailOrder(selectedOrder.id);
      setDetailOrder(response);
    };

    if (selectedOrder) {
      fetchDetailOrder();
    }
  }, [selectedOrder]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết đơn hàng {selectedOrder?.orderId}</DialogTitle>
      <DialogContent dividers>
        {selectedOrder && (
          <>
            <Box className="order-detail-status-section">
              <OrderStatusTimeline
                status={selectedOrder.status}
                orderStatus={detailOrder?.OrderStatuses}
              />
            </Box>

            <Box className="order-detail-info-section">
              <Typography
                variant="subtitle1"
                className="subtitle"
                fontWeight={600}
              >
                Thông tin đơn hàng
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                mt={1}
                className="stack-info-order-section"
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Mã đơn hàng
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{ marginTop: "4px", fontSize: "0.95rem" }}
                  >
                    {formatOrderID(selectedOrder.id, selectedOrder.orderDate)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Ngày đặt
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{ marginTop: "4px", fontSize: "0.95rem" }}
                  >
                    {selectedOrder.orderDate}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Trạng thái
                  </Typography>
                  <Box mt={0.5}>
                    {selectedOrder.status === "returned" &&
                    detailOrder?.OrderStatuses ? (
                      <Chip
                        icon={<HighlightOffIcon fontSize="small" />}
                        label={`Đã trả hàng lúc ${formatDateTimeVN(
                          detailOrder.OrderStatuses.find(
                            (s) => s.Status === "returned"
                          )?.CreateAt || new Date()
                        )}`}
                        color="error" // dùng màu đỏ
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      getStatusChip(selectedOrder.status)
                    )}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Thanh toán
                  </Typography>
                  <Box mt={0.5}>
                    {selectedOrder.isPaid ? (
                      <Chip
                        icon={<CheckCircleIcon fontSize="small" />}
                        label={`Đã thanh toán lúc ${formatDateTimeVN(
                          detailOrder?.OrderStatuses?.find(
                            (s) => s.Status === "paid"
                          )?.CreateAt
                        )}`}
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
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box className="customer-info-section">
              <Typography
                variant="subtitle1"
                className="subtitle"
                fontWeight={600}
              >
                Thông tin khách hàng
              </Typography>
              <Box mt={1}>
                <Typography variant="body2" color="text.secondary">
                  Họ tên khách hàng
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{ marginTop: "4px", fontSize: "0.95rem" }}
                >
                  {selectedOrder.customerName}
                </Typography>
              </Box>
              <Box mt={1}>
                <Typography variant="body2" color="text.secondary">
                  Địa chỉ giao hàng
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{ marginTop: "4px", fontSize: "0.95rem" }}
                >
                  {detailOrder?.AccountDelivery.DeliveryAddress.Address}
                </Typography>
              </Box>
              <Box mt={1}>
                <Typography variant="body2" color="text.secondary">
                  Số điện thoại
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{ marginTop: "4px", fontSize: "0.95rem" }}
                >
                  {detailOrder?.AccountDelivery.DeliveryAddress.PhoneNumber}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box className="order-items-section">
              <Typography
                variant="subtitle1"
                className="subtitle"
                fontWeight={600}
              >
                Sản phẩm
              </Typography>
              <TableContainer sx={{ mt: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell align="right">Màu</TableCell>
                      <TableCell align="right">Hình dáng</TableCell>
                      <TableCell align="right">Chất liệu</TableCell>
                      <TableCell align="right">Đơn giá</TableCell>
                      <TableCell align="right">Giảm giá</TableCell>
                      <TableCell align="right">Số lượng</TableCell>
                      <TableCell align="right">Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detailOrder?.OrderDetails.map((item) => {
                      const glass = item.GlassColor.Glass;
                      const price = parseFloat(item.Price);
                      const discount = parseFloat(item.Discount);
                      const finalPrice = price - (discount * price) / 100;
                      const total = finalPrice * item.Quantity;

                      return (
                        <TableRow key={item.ID}>
                          <TableCell>
                            {generateProductName(glass.Category, 0, glass.ID)}
                          </TableCell>
                          <TableCell align="right">
                            {getColorNameFromHex(item.GlassColor.Color)}
                          </TableCell>
                          <TableCell align="right">
                            {translateShapeToVietnamese(glass.Shape)}
                          </TableCell>
                          <TableCell align="right">{glass.Material}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(price)}
                          </TableCell>
                          <TableCell align="right">{discount}%</TableCell>
                          <TableCell align="right">{item.Quantity}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(total)}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {/* Phí vận chuyển */}
                    <TableRow sx={{ "& td": { borderBottom: "none" } }}>
                      <TableCell colSpan={7} align="right">
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 400 }}
                        >
                          Phí vận chuyển:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" fontWeight={400}>
                          {formatCurrency(parseFloat(detailOrder?.ShippingFee))}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* Giảm giá */}
                    <TableRow sx={{ "& td": { borderBottom: "none" } }}>
                      <TableCell colSpan={7} align="right">
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 400 }}
                        >
                          Voucher giảm giá:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="subtitle2"
                          fontWeight={400}
                          color="red"
                        >
                          -{" "}
                          {formatCurrency(
                            parseFloat(detailOrder?.VoucherDiscount)
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* Tổng cộng */}
                    <TableRow sx={{ "& td": { borderBottom: "none" } }}>
                      <TableCell colSpan={7} align="right">
                        <Typography variant="subtitle2">Tổng cộng:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          color="#3CB371"
                        >
                          {formatCurrency(parseFloat(detailOrder?.Total))}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {["canceled", "returned"].includes(selectedOrder.status) && (
              <>
                <Box className="customer-info-section">
                  <Typography
                    variant="subtitle1"
                    className="subtitle-reason"
                    fontWeight={600}
                    color="red"
                  >
                    Lí do hủy
                  </Typography>
                  <Box mt={1}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    ></Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{ marginTop: "4px", fontSize: "0.95rem" }}
                    >
                      {detailOrder?.OrderStatuses.find((o) => o.Refund)?.Refund
                        ?.Reason || "—"}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
            {["canceled", "returned"].includes(selectedOrder.status) &&
              selectedOrder.isPaid && (
                <>
                  <Box className="customer-info-section">
                    <Typography
                      variant="subtitle1"
                      className="subtitle"
                      fontWeight={600}
                    >
                      Thông tin hoàn tiền
                    </Typography>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={4}
                      mt={1}
                      flexWrap="wrap"
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Ngân hàng
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{ mt: "4px", fontSize: "0.95rem" }}
                        >
                          {selectedOrder.customerName}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Tên tài khoản
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{ mt: "4px", fontSize: "0.95rem" }}
                        >
                          {detailOrder?.AccountDelivery.DeliveryAddress.Address}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Số tài khoản
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{ mt: "4px", fontSize: "0.95rem" }}
                        >
                          {
                            detailOrder?.AccountDelivery.DeliveryAddress
                              .PhoneNumber
                          }
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            {refunded && (
              <>
                <Box className="customer-info-section">
                  <Box mt={1}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    ></Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{ marginTop: "4px", fontSize: "0.95rem", display: "inline", background: '#FFF68F' }}
                    >
                      Xác nhận đã hoàn tiền lúc{" "}
                      {formatDateTimeVN(
                        detailOrder?.OrderStatuses.find((o) => o.Refund)?.Refund
                          ?.RefundAt
                      ) || ""}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>

        {selectedOrder &&
          selectedOrder.status !== "completed" &&
          selectedOrder.status !== "shipping" &&
          ((["canceled", "returned"].includes(selectedOrder.status) &&
            selectedOrder.isPaid) ||
            !["canceled", "returned"].includes(selectedOrder.status)) &&
          !refunded && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={onRequestStatusUpdate}
            >
              {["canceled", "returned"].includes(selectedOrder.status) &&
              selectedOrder.isPaid
                ? "Xác nhận đã hoàn tiền"
                : "Cập nhật trạng thái"}
            </Button>
          )}
      </DialogActions>
    </Dialog>
  );
};

export default DetailOrder;
