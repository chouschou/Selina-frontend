import { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Header from "../../components/Header";
import "./Order.scss";

const Order = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  //   const [address, setAddress] = useState("123 Điện Biên Phủ, TP. Đà Nẵng")
  const address = "123 Điện Biên Phủ, TP. Đà Nẵng";
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showShippingPolicy, setShowShippingPolicy] = useState(true);

  // Sample order data (would normally come from cart or product detail)
  const orderItem = {
    id: 1,
    image: "/glasses-main.jpg",
    name: "Gọng kính tròn, kim loại",
    category: "Màu đen",
    price: 120000,
    quantity: 3,
  };

  const shippingFee = 30000;
  const discount = 0;
  const totalAmount =
    orderItem.price * orderItem.quantity + shippingFee - discount;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle order submission
    console.log("Order submitted", {
      name,
      phone,
      address,
      paymentMethod,
      orderItem,
    });
    // Redirect to confirmation page or show success message
  };

  return (
    <div className="order-page">
      <Header />

      <Container className="order-container">
        <form onSubmit={handleSubmit}>
          <Grid container className="order-grid-container">
            {/* Customer Information */}
            <Grid item xs={12} md={6}>
              <Box className="customer-info-section">
                <Typography variant="h6" className="section-title">
                  THÔNG TIN KHÁCH HÀNG
                </Typography>

                <Box className="form-field">
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    variant="outlined"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    InputLabelProps={{
                      className: "required-label",
                    }}
                  />
                </Box>

                <Box className="form-field">
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    variant="outlined"
                    required
                    value={phone}
                    inputProps={{ maxLength: 10 }}
                    error={phone && !/^0\d{9}$/.test(phone)}
                    helperText={
                      phone && !/^0\d{9}$/.test(phone)
                        ? "Số điện thoại không hợp lệ"
                        : ""
                    }
                    onChange={(e) => setPhone(e.target.value)}
                    InputLabelProps={{
                      className: "required-label",
                    }}
                  />
                </Box>

                <Typography
                  variant="h6"
                  className="section-title address-title"
                >
                  ĐỊA CHỈ NHẬN HÀNG
                </Typography>

                <Box className="address-container">
                  <Box className="address-info">
                    <LocationOnIcon className="location-icon" />
                    <Typography variant="body1">{address}</Typography>
                  </Box>
                  <Box className="address-actions">
                    <Button
                      variant="outlined"
                      size="small"
                      className="default-button"
                    >
                      Mặc định
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      className="change-button"
                    >
                      Thay đổi
                    </Button>
                  </Box>
                </Box>

                <Paper className="shipping-policy">
                  <Box
                    className="policy-header"
                    onClick={() => setShowShippingPolicy(!showShippingPolicy)}
                  >
                    <Typography variant="subtitle1" className="policy-title">
                      Chính sách vận chuyển và đổi trả
                    </Typography>
                    <IconButton size="small">
                      <KeyboardArrowDownIcon
                        className={`arrow-icon ${
                          showShippingPolicy ? "expanded" : ""
                        }`}
                      />
                    </IconButton>
                  </Box>

                  {showShippingPolicy && (
                    <Box className="policy-content">
                      <Typography variant="body2" paragraph>
                        Thời gian giao hàng dao động từ 2-4 ngày đối với đơn
                        gọng kính, 3-5 ngày đối với đơn có cận.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        1. Bảo hành 1 đổi 1 trong 180 ngày sau khi mua hàng nếu
                        lớp vàng đầu của trọng kính gặp vấn đề về kỹ thuật như
                        xỉ vàng, mất vàng mà không phải do nhiệt hay tác động
                        vật lý như trầy xước, nứt, vỡ.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        2. Selina bảo hành cho cả lỗi người dùng nếu không may
                        làm gãy hoặc mất kính. Trợ giá 50% giá niêm yết khi
                        khách hàng sử dụng lại sản phẩm cũ. Trong trường hợp sản
                        phẩm cũ hết hàng có thể thay thế sản sản phẩm có giá trị
                        bằng hoặc thấp hơn. Áp dụng 1 lần duy nhất trên tổng hóa
                        đơn trong 60 ngày kể từ khi mua hàng.
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={6}>
              <Paper className="order-summary">
                <Typography variant="h6" className="summary-title">
                  ĐƠN HÀNG
                </Typography>

                <Box className="order-item">
                  <Box className="item-image-container">
                    <img
                      src={orderItem.image || "/placeholder.svg"}
                      alt={orderItem.name}
                      className="item-image"
                    />
                  </Box>
                  <Box className="item-details">
                    <Typography variant="subtitle1" className="item-name">
                      {orderItem.name}
                    </Typography>
                    <Typography variant="body2" className="item-category">
                      Phân loại: {orderItem.category}
                    </Typography>
                  </Box>
                </Box>

                <Box className="order-details">
                  <Box className="detail-row">
                    <Typography variant="body1">Đơn giá</Typography>
                    <Typography variant="body1" className="price">
                      {orderItem.price.toLocaleString()} đ
                    </Typography>
                  </Box>

                  <Box className="detail-row">
                    <Typography variant="body1">Số lượng</Typography>
                    <Typography variant="body1">
                      {orderItem.quantity}
                    </Typography>
                  </Box>

                  <Divider className="detail-divider" />

                  <Box className="detail-row">
                    <Typography variant="body1">Chi phí vận chuyển</Typography>
                    <Typography variant="body1" className="price">
                      {shippingFee.toLocaleString()} đ
                    </Typography>
                  </Box>

                  <Box className="detail-row">
                    <Typography variant="body1">Voucher giảm giá</Typography>
                    <Typography variant="body1" className="discount">
                      - {discount.toLocaleString()} đ
                    </Typography>
                  </Box>

                  <Divider className="detail-divider" />

                  <Box className="detail-row total-row">
                    <Typography variant="subtitle1">Tổng số tiền</Typography>
                    <Typography variant="h6" className="total-price">
                      {totalAmount.toLocaleString()} đ
                      {/* {orderItem.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })} */}
                    </Typography>
                  </Box>
                </Box>

                <Box className="payment-methods">
                  <Typography variant="subtitle1" className="payment-title">
                    Phương thức thanh toán
                  </Typography>

                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="payment-options"
                  >
                    <FormControlLabel
                      value="cod"
                      control={<Radio color="primary" />}
                      label="Thanh toán khi nhận hàng"
                      className="payment-option"
                    />
                    <FormControlLabel
                      value="online"
                      control={<Radio color="primary" />}
                      label="Thanh toán trực tuyến"
                      className="payment-option"
                    />
                  </RadioGroup>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  className="place-order-button"
                >
                  Đặt hàng
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Container>
    </div>
  );
};

export default Order;
