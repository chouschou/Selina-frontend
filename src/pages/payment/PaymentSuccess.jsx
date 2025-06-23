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
import { CheckCircle, Home, Receipt, ArrowRight } from "lucide-react";
import "./PaymentResult.scss";
import { formatCurrencyVND, formatOrderID } from "../../services/formatToShow";
import { flex } from "@mui/system";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const success = searchParams.get("success") === "true";
  const orderId = searchParams.get("orderId") || "VNP" + Date.now();
  const amount = searchParams.get("amount") || "0";

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

  const handleViewMyOrder = () => {
    navigate("/my-orders");
  };

  if (!success) {
    return null; // This component only handles success case
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
    <div className="payment-result-container success-container">
      <div className="background-decoration">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>

      <Fade in={showContent} timeout={600}>
        <Card className="payment-result-card success-card">
          <CardContent className="payment-card-content">
            <Zoom in={showContent} timeout={800}>
              <div className="success-icon-container">
                <CheckCircle className="success-icon" size={80} />
                <div className="success-ripple"></div>
              </div>
            </Zoom>

            <Typography variant="h4" className="result-title success-title">
              Thanh toán thành công!
            </Typography>

            <Typography variant="body1" className="result-subtitle" sx={{marginBottom: "32px"}}>
              Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!
            </Typography>

            <Box className="payment-details" sx={{marginBottom: "24px"}}>
              <div className="detail-row">
                <span className="detail-label">Mã đơn hàng:</span>
                <span className="detail-value">
                  {" "}
                  {formatOrderID(orderId, getCurrentFormattedDate())}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số tiền:</span>
                <span className="detail-value amount-value">
                  {formatCurrencyVND(amount/100)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phương thức thanh toán:</span>
                <span className="detail-value">VNPay</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Trạng thái:</span>
                <span className="detail-value status-success">Thành công</span>
              </div>
            </Box>

            <Fade in={showButtons} timeout={600}>
              <Box display="flex" gap={2} className="action-buttons">
                {/* Về trang chủ nằm bên trái */}
                <Box flex={1}>
                  <Button
                    fullWidth
                    variant="outlined"
                    className="secondary-button"
                    startIcon={<Home size={20} />}
                    onClick={handleGoHome}
                  >
                    Về trang chủ
                  </Button>
                </Box>

                {/* Đơn hàng của tôi nằm bên phải */}
                <Box flex={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    className="primary-button"
                    startIcon={<Receipt size={20} />}
                    // endIcon={<ArrowRight size={16} />}
                    onClick={handleViewMyOrder}
                  >
                    Đơn hàng của tôi
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

export default PaymentSuccess;
