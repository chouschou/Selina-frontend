import { useContext, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import OrderProductItem from "../OrderProductItem";
import ProductReviewItem from "../ProductReviewItem";
import "./OrderItem.scss";
import { formatCurrencyVND, statusData } from "../../services/formatToShow";
import { formatDateTimeVN } from "../../services/formatDatetimeVN";
import RefundModal from "./RefundModal";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import ReturnModal from "./ReturnModal";
import { toast } from "react-toastify";
import { updateStatus } from "../../services/order/updateStatus";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { getProductColorsByColorId } from "../../services/product/getProductColorsByColorId";
import AddRatingModal from "./AddRatingModal";
import UpdateRatingModal from "./UpdateRatingModal";
const OrderItem = ({ order, onSuccess }) => {
  const [expanded, setExpanded] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [updateReviewDialogOpen, setUpdateReviewDialogOpen] = useState(false);
  // const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [isOpenRefundModal, setOpenRefundModal] = useState(false);
  const [isOpenReturnModal, setOpenReturnModal] = useState(false);
  const [isEditable, setEditable] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "waiting":
        return "#ff9800";
      case "confirmed":
        return "#2196f3";
      case "shipping":
        return "#9c27b0";
      case "completed":
        return "#4caf50";
      case "canceled":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  const handleCancelOrder = async () => {
    // Handle order cancellation
    console.log("Cancelling order:", order.id);
    setOpenRefundModal(true);
  };

  const handleReturnOrder = async () => {
    console.log("Returning order:", order.id);
    setOpenReturnModal(true);
  };
  const handleReceivedOrder = async () => {
    try {
      if (isLoggedIn && order) {
        await updateStatus(order.id, {
          Status: "completed",
        });
      }
      onSuccess();
      toast.success("Đơn hàng hoàn thành!");
    } catch (error) {
      console.error("Lỗi khi hoàn thành đơn:", error);
      toast.error("Không thể gửi yêu cầu. Vui lòng thử lại.");
    }
  };
  const handleBuyAgain = async () => {
    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }

    try {
      const items = await Promise.all(
        order.items.map(async (item) => {
          const response = await getProductColorsByColorId(item.idColor);
          return {
            glassColor: {
              ID: response.ID,
              Glass: {
                ID: response?.Glass?.ID,
                Category: response?.Glass?.Category,
                Shape: response?.Glass?.Shape,
                Material: response?.Glass?.Material,
                Description: response?.Glass?.Description,
                Age: response?.Glass?.Age,
              },
              Color: response?.Color,
              Quantity: response?.Quantity,
              Price: response?.Price,
              Discount: response?.Discount,
              ModelVirtualTryOn: response?.ModelVirtualTryOn,
              Image3DPath: response?.Image3DPath,
              Status: response?.Status,
              Image: response?.Images || "images/no_image.png",
            },
            quantity: item.quantity || 1, // Giữ nguyên số lượng cũ nếu có
          };
        })
      );

      navigate("/order", {
        state: { items },
      });
    } catch (error) {
      console.error("Lỗi khi mua lại:", error);
      toast.error("Không thể mua lại sản phẩm. Vui lòng thử lại.");
    }
  };

  const handleOpenReviewDialog = () => {
    setReviewDialogOpen(true);
  };
  const handleOpenDetailReview = () => {
    setEditable(false);
    setUpdateReviewDialogOpen(true);
  };
  const handleOpenUpdateReviewDialog = () => {
    setEditable(true);
    setUpdateReviewDialogOpen(true);
  };

  return (
    <Box className="order-item">
      <Box className="order-header">
        <Box className="order-info">
          <Box
            className="status-indicator"
            sx={{ color: getStatusColor(order.status) }}
          >
            <CheckCircleIcon fontSize="small" />
            <Typography variant="body2" className="order-date">
              {formatDateTimeVN(order.date)}
            </Typography>
          </Box>
          <Typography variant="body2" className="payment-status">
            {order.paymentStatus}
          </Typography>
        </Box>

        <Accordion
          expanded={expanded}
          onChange={handleExpandToggle}
          className="delivery-info-accordion"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className="accordion-summary"
          >
            <Typography variant="body1" className="delivery-info-title">
              Thông tin nhận hàng
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="accordion-details">
            <Typography variant="body2" className="recipient-name">
              {order.deliveryInfo.name}
            </Typography>
            <Typography variant="body2" className="recipient-phone">
              {order.deliveryInfo.phone}
            </Typography>
            <Typography variant="body2" className="recipient-address">
              {order.deliveryInfo.address}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Order Status Timeline */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <Accordion
          defaultExpanded
          sx={{
            boxShadow: "none", // Xoá shadow
            border: "none",
            "&::before": {
              display: "none", // Xoá đường kẻ xám trên đầu (nếu có)
            },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ margin: 0 }}>
            {/* Hiển thị timeline-item đầu tiên (mới nhất) */}
            <Box
              className={`timeline-item active`}
              sx={{ padding: "0 16px", margin: 0 }}
            >
              <Box className="timeline-marker">
                <Box className="marker-dot" />
                <Box className="marker-line" />
              </Box>
              <Box className="timeline-content" sx={{ margin: 0 }}>
                <Typography variant="body2" className="timeline-status">
                  {statusData[order.statusHistory[0].status]?.label ||
                    "Không xác định"}
                </Typography>
                <Typography variant="caption" className="timeline-time">
                  {formatDateTimeVN(order.statusHistory[0].time)}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ margin: 0 }}>
            <Box className="order-timeline" sx={{ margin: 0 }}>
              {order.statusHistory.slice(1).map((statusItem, index) => (
                <Box key={index} className="timeline-item">
                  <Box className="timeline-marker">
                    <Box className="marker-dot" />
                    <Box className="marker-line" />
                  </Box>
                  <Box className="timeline-content">
                    <Typography variant="body2" className="timeline-status">
                      {statusData[statusItem.status]?.label || "Không xác định"}
                    </Typography>
                    <Typography variant="caption" className="timeline-time">
                      {formatDateTimeVN(statusItem.time)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      <Divider className="order-divider" />

      <Box className="order-products">
        {order.items.map((item) => (
          <OrderProductItem key={item.id} productInfo={item} />
        ))}
      </Box>

      <Box className="order-summary">
        <Box className="order-totals">
          <Box className="total-row">
            <Typography variant="body2" className="total-label">
              Tổng tiền hàng:
            </Typography>
            <Typography variant="body2" className="total-value">
              {formatCurrencyVND(order.total - order.shipping + order.discount)}
            </Typography>
          </Box>
          <Box className="total-row">
            <Typography variant="body2" className="total-label">
              Phí vận chuyển:
            </Typography>
            <Typography variant="body2" className="total-value">
              {formatCurrencyVND(order.shipping)}
            </Typography>
          </Box>
          <Box className="total-row">
            <Typography variant="body2" className="total-label">
              Voucher giảm giá:
            </Typography>
            <Typography variant="body2" className="total-value discount">
              -{formatCurrencyVND(order.discount)}
            </Typography>
          </Box>
          <Divider className="totals-divider" />
          <Box className="total-row grand-total">
            <Typography variant="subtitle1" className="total-label">
              Thành tiền:
            </Typography>
            <Typography variant="h6" className="grand-total-value">
              {formatCurrencyVND(order.total)}
            </Typography>
          </Box>
        </Box>

        <Box className="order-actions">
          {order.status === "waiting" && (
            <>
              {" "}
              <Typography variant="subtitle1" sx={{ color: "tomato" }}>
                Bạn không thể hủy nếu đơn hàng đã được xác nhận.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="error"
                className="cancel-button"
                onClick={handleCancelOrder}
              >
                Hủy đơn
              </Button>
            </>
          )}

          {order.status === "shipping" && (
            <>
              <div></div>{" "}
              <Box display="flex">
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  // className="cancel-button"
                  onClick={handleReturnOrder}
                  sx={{ marginRight: "10px", borderRadius: "30px" }}
                >
                  Trả lại hàng
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  // className="cancel-button"
                  sx={{ minWidth: "200px", borderRadius: "30px" }}
                  onClick={handleReceivedOrder}
                >
                  Đã nhận được hàng
                </Button>
              </Box>
            </>
          )}

          {order.status === "completed" &&
            order.canReview &&
            (() => {
              const completedTime = dayjs(
                order.statusHistory.find((o) => o.status === "completed")?.time
              );
              const deadline = completedTime.add(7, "day");
              const now = dayjs();

              if (now.isAfter(deadline)) {
                return (
                  <>
                    <Typography variant="subtitle1" sx={{ color: "gray" }}>
                      Đã hết thời gian đánh giá
                    </Typography>
                    <Box display="flex">
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        // className="cancel-button"
                        onClick={handleBuyAgain}
                        sx={{
                          marginRight: "10px",
                          borderRadius: "30px",
                          minWidth: "150px",
                        }}
                      >
                        Mua lại
                      </Button>
                      {order.items.find((o) => o.rating !== null) && (
                        <Button
                          fullWidth
                          variant="contained"
                          color="warning"
                          // className="cancel-button"
                          onClick={handleOpenDetailReview}
                          sx={{ marginRight: "10px", borderRadius: "30px" }}
                        >
                          Xem đánh giá
                        </Button>
                      )}
                    </Box>
                  </>
                );
              }

              return (
                <>
                  <Typography variant="subtitle1" sx={{ color: "tomato" }}>
                    Vui lòng đánh giá trước:{" "}
                    {deadline.format("HH:mm, DD/MM/YYYY")}
                  </Typography>
                  <Box display="flex">
                    <Button
                      variant="contained"
                      color="primary"
                      className="review-button"
                      sx={{ color: "white" }}
                      onClick={
                        order.items.find((o) => o.rating === null)
                          ? handleOpenReviewDialog
                          : handleOpenUpdateReviewDialog
                      }
                    >
                      {order.items.find((o) => o.rating === null)
                        ? "Đánh giá"
                        : "Cập nhật đánh giá"}
                    </Button>
                  </Box>
                </>
              );
            })()}

          {["canceled", "returned"].includes(order.status) && (
            <>
              <Box className="customer-info-section">
                <Typography
                  variant="subtitle1"
                  className="subtitle-reason"
                  fontWeight={600}
                  color="red"
                >
                  {order.status === "returned" ? "Lí do trả hàng" : "Lí do hủy"}
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
                    {order.statusHistory.find((o) => o?.refund)?.refund
                      ?.Reason || "Cửa hàng không nhận đơn."}
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {["canceled", "returned"].includes(order.status) &&
            order.paymentStatus === "Đã thanh toán" && (
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
                        {order.statusHistory.find((o) => o?.refund)?.refund
                          ?.Bank || "-"}
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
                        {order.statusHistory.find((o) => o?.refund)?.refund
                          ?.AccountHolder || "-"}
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
                        {order.statusHistory.find((o) => o?.refund)?.refund
                          ?.AccountNumber || "-"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          {order.statusHistory.find((o) => o?.refund)?.refund?.RefundAt && (
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
                    sx={{
                      marginTop: "4px",
                      fontSize: "0.95rem",
                      display: "inline",
                      background: "#FFF68F",
                    }}
                  >
                    Xác nhận đã hoàn tiền lúc{" "}
                    {formatDateTimeVN(
                      order.statusHistory.find((o) => o?.refund)?.refund
                        ?.RefundAt
                    ) || ""}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Review Dialog */}
      <AddRatingModal
        isOpen={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        onSuccess={onSuccess}
        order={order}
      ></AddRatingModal>
      <UpdateRatingModal
        isOpen={updateReviewDialogOpen}
        onClose={() => setUpdateReviewDialogOpen(false)}
        onSuccess={onSuccess}
        order={order}
        editable={isEditable}
      ></UpdateRatingModal>

      <RefundModal
        isOpen={isOpenRefundModal}
        order={order}
        onClose={() => setOpenRefundModal(false)}
        onSuccess={onSuccess}
        paid={order.paymentStatus === "Đã thanh toán" ? true : false}
      ></RefundModal>

      <ReturnModal
        isOpen={isOpenReturnModal}
        order={order}
        onClose={() => setOpenReturnModal(false)}
        onSuccess={onSuccess}
        paid={order.paymentStatus === "Đã thanh toán" ? true : false}
      ></ReturnModal>
    </Box>
  );
};

export default OrderItem;
