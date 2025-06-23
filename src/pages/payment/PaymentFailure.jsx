import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Fade,
  Zoom,
} from "@mui/material";
import { Result } from "antd";
import {
  XCircle,
  Home,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import "./PaymentResult.scss";
import { formatCurrencyVND, formatOrderID } from "../../services/formatToShow";
import { vnpayPayment } from "../../services/payment/vnpayPayment";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const success = searchParams.get("success") === "true";
  const orderId = searchParams.get("orderId") || "VNP" + Date.now();
  const amount = searchParams.get("amount") || "0";
  const errorCode = searchParams.get("errorCode") || "00";

  useEffect(() => {
    // Staggered animation entrance
    const timer1 = setTimeout(() => setShowContent(true), 300);
    const timer2 = setTimeout(() => setShowButtons(true), 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetryPayment = async () => {
    const vnpayResponse = await vnpayPayment({ ID: orderId, Total: amount/100 });
    window.location.href = vnpayResponse.data.url;
  };

  const getErrorMessage = (code) => {
    const errorMessages = {
      24: "Giao dịch bị hủy bởi người dùng",
      51: "Tài khoản không đủ số dư",
      65: "Tài khoản đã vượt quá hạn mức giao dịch trong ngày",
      75: "Ngân hàng đang bảo trì",
      79: "Người dùng nhập sai mật khẩu quá số lần quy định",
      99: "Lỗi không xác định",
    };
    return errorMessages[code] || "Giao dịch không thành công";
  };

  if (success) {
    return null; // This component only handles failure case
  }
  const getCurrentFormattedDate = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // tháng bắt đầu từ 0
    const year = now.getFullYear();

    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  };
  return (
    <div className="payment-result-container failure-container">
      <div className="background-decoration">
        <div className="floating-circle circle-1 failure-circle"></div>
        <div className="floating-circle circle-2 failure-circle"></div>
        <div className="floating-circle circle-3 failure-circle"></div>
      </div>

      <Fade in={showContent} timeout={600}>
        <Card className="payment-result-card failure-card">
          <CardContent className="payment-card-content">
            <Zoom in={showContent} timeout={800}>
              <div className="failure-icon-container">
                <XCircle className="failure-icon" size={80} />
                <div className="failure-pulse"></div>
              </div>
            </Zoom>

            <Typography variant="h4" className="result-title failure-title">
              Thanh toán thất bại
            </Typography>

            <Typography
              variant="body1"
              className="result-subtitle"
              sx={{ marginBottom: "10px" }}
            >
              {getErrorMessage(errorCode)}
            </Typography>

            <Box className="payment-details" sx={{ marginBottom: "10px" }}>
              <div className="detail-row">
                <span className="detail-label">Mã đơn hàng:</span>
                <span className="detail-value">
                  {formatOrderID(orderId, getCurrentFormattedDate())}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số tiền:</span>
                <span className="detail-value amount-value">
                  {formatCurrencyVND(amount / 100)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phương thức thanh toán:</span>
                <span className="detail-value">VNPay</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Trạng thái:</span>
                <span className="detail-value status-failure">Thất bại</span>
              </div>
            </Box>

            <Box className="error-notice">
              <AlertTriangle size={20} />
              <Typography variant="body2">
                Đừng lo lắng!<br></br> Bạn có thể thử lại hoặc thanh toán khi
                nhận hàng.
              </Typography>
            </Box>

            <Fade in={showButtons} timeout={600}>
              <Box display="flex" gap={2} className="action-buttons">
                {/* Về trang chủ nằm bên trái */}
                <Box flex={1}>
                  <Button
                    variant="outlined"
                    className="secondary-button"
                     sx={{minWidth: "200px"}}
                    startIcon={<Home size={20} />}
                    onClick={handleGoHome}
                  >
                    Về trang chủ
                  </Button>
                </Box>

                {/* Đơn hàng của tôi nằm bên phải */}
                <Box flex={1}>
                  <Button
                    variant="contained"
                    className="primary-button retry-button"
                    sx={{minWidth: "200px"}}
                    startIcon={<RotateCcw size={20} />}
                    onClick={handleRetryPayment}
                  >
                    Thử lại
                  </Button>
                </Box>
              </Box>
            </Fade>
          </CardContent>
        </Card>
      </Fade>
    </div>
  );
};

export default PaymentFailure;
