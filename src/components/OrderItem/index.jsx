"use client"

import { useState } from "react"
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
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CloseIcon from "@mui/icons-material/Close"
import OrderProductItem from "../OrderProductItem"
import ProductReviewItem from "../ProductReviewItem"
import "./OrderItem.scss"
import { formatCurrencyVND, statusData } from "../../services/formatToShow"
import { formatDateTimeVN } from "../../services/formatDatetimeVN"

const OrderItem = ({ order }) => {
  const [expanded, setExpanded] = useState(false)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  // const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [reviews, setReviews] = useState({})

  const handleExpandToggle = () => {
    setExpanded(!expanded)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "waiting":
        return "#ff9800"
      case "confirmed":
        return "#2196f3"
      case "shipping":
        return "#9c27b0"
      case "completed":
        return "#4caf50"
      case "canceled":
        return "#f44336"
      default:
        return "#757575"
    }
  }

  const handleCancelOrder = () => {
    // Handle order cancellation
    console.log("Cancelling order:", order.id)
  }

  const handleOpenReviewDialog = () => {
    // setCurrentProductIndex(0)
    setReviewDialogOpen(true)
  }

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false)
  }

  const handleReviewChange = (productId, reviewData) => {
    setReviews({
      ...reviews,
      [productId]: reviewData,
    })
  }

  const handleSubmitReviews = () => {
    // Handle review submission for all products
    console.log("Submitting reviews:", reviews)
    handleCloseReviewDialog()
  }

  return (
    <Box className="order-item">
      <Box className="order-header">
        <Box className="order-info">
          <Box className="status-indicator" sx={{ color: getStatusColor(order.status) }}>
            <CheckCircleIcon fontSize="small" />
            <Typography variant="body2" className="order-date">
              {formatDateTimeVN(order.date)}
            </Typography>
          </Box>
          <Typography variant="body2" className="payment-status">
            {order.paymentStatus}
          </Typography>
        </Box>

        <Accordion expanded={expanded} onChange={handleExpandToggle} className="delivery-info-accordion">
          <AccordionSummary expandIcon={<ExpandMoreIcon />} className="accordion-summary">
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
        <Box className="order-timeline">
          {order.statusHistory.map((statusItem, index) => (
            <Box key={index} className={`timeline-item ${index === 0 ? "active" : ""}`}>
              <Box className="timeline-marker">
                <Box className="marker-dot" />
                {index < order.statusHistory.length - 1 && <Box className="marker-line" />}
              </Box>
              <Box className="timeline-content">
                <Typography variant="body2" className="timeline-status">
                  {/* {statusItem.status} */}
                    {statusData[statusItem.status]?.label || "Không xác định"}
                </Typography>
                <Typography variant="caption" className="timeline-time">
                  {formatDateTimeVN(statusItem.time)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
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
          {(order.status === "waiting" || order.status === "confirmed") && (
            <Button fullWidth variant="contained" color="error" className="cancel-button" onClick={handleCancelOrder}>
              Hủy đơn
            </Button>
          )}

          {order.status === "completed" && order.canReview && (
            <Button variant="contained" color="primary" className="review-button" onClick={handleOpenReviewDialog}>
              Đánh giá
            </Button>
          )}
        </Box>
      </Box>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={handleCloseReviewDialog}
        maxWidth="md"
        fullWidth
        className="review-dialog"
      >
        <DialogTitle className="review-dialog-title">
          ĐÁNH GIÁ SẢN PHẨM
          <IconButton onClick={handleCloseReviewDialog} className="close-button">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className="review-dialog-content">
          {order.items.map((item  ) => (
            <ProductReviewItem key={item.id} product={item} onReviewChange={handleReviewChange} />
          ))}
        </DialogContent>
        <DialogActions className="review-dialog-actions">
          <Button onClick={handleCloseReviewDialog} variant="outlined" className="cancel-button">
            Hủy
          </Button>
          <Button onClick={handleSubmitReviews} variant="contained" color="primary" className="save-button">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default OrderItem
