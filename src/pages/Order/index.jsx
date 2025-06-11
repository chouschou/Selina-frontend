import { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { getDeliveryAddressByAccount } from "../../services/accountDelivery/getDeliveryAddressByAccountId";
import DeliveryAddressModal from "../../components/DeliveryAddressModal";
import { checkDeliveryUsed } from "../../services/accountDelivery/checkDeliveryUsedInOrder";
import {
  formatCurrencyVND,
  generateProductName,
  translateShapeToVietnamese,
} from "../../services/formatToShow";
import { useLocation } from "react-router-dom";

const Order = () => {
  const location = useLocation();
  const items = location.state?.items ?? [];
  console.log("Items:", items);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showShippingPolicy, setShowShippingPolicy] = useState(true);
  const { isLoggedIn, account } = useContext(AuthContext);
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [isOpenModalSelectAddress, setIsOpenModalSelectAddress] =
    useState(false);
  const onCloseModalSelectAddress = () => {
    setIsOpenModalSelectAddress(false);
  };

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

    // Redirect to confirmation page or show success message
  };

  const fetchAllDeliveryAddress = async () => {
    const response = await getDeliveryAddressByAccount(account.ID);

    // Gọi checkUsed cho từng địa chỉ
    const dataWithUsed = await Promise.all(
      response.map(async (item) => {
        try {
          const usedRes = await checkDeliveryUsed(item.ID);
          return { ...item, isUsedInOrder: usedRes === true };
        } catch (error) {
          console.error(`Failed to check if address ${item.ID} is used`, error);
          return { ...item, isUsedInOrder: false }; // fallback nếu lỗi
        }
      })
    );

    setDeliveryAddresses(dataWithUsed);
    setSelectedAddress(dataWithUsed.find((ad) => ad.IsDefault === true) || "");
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllDeliveryAddress();
    }
  }, [isLoggedIn, account.ID]);
  return (
    <div className="order-page">
      <Header />

      <Container className="order-container">
        <form onSubmit={handleSubmit}>
          <Grid container className="order-grid-container">
            {/* Customer Information */}
            <Grid item xs={12} md={6}>
              <Box className="customer-info-section">
                <Typography
                  variant="h6"
                  className="section-title address-title"
                >
                  ĐỊA CHỈ NHẬN HÀNG
                </Typography>

                <Box className="address-container">
                  <Box>
                    <Box className="address-info">
                      <LocationOnIcon className="location-icon" />
                      <Typography variant="body1">
                        {selectedAddress?.DeliveryAddress?.Address}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        marginTop: "10px",
                        marginLeft: "30px",
                        // color: "#9a3e19",
                        fontWeight: 500,
                      }}
                    >
                      Người nhận: {selectedAddress?.DeliveryAddress?.Name} -{" "}
                      {selectedAddress?.DeliveryAddress?.PhoneNumber}
                    </Typography>
                  </Box>
                  <Box className="address-actions">
                    {selectedAddress?.IsDefault && (
                      <Button
                        size="small"
                        // className="default-button"
                        disabled
                        sx={{
                          color: "#fff",
                          backgroundColor: "#d46c3c",
                          borderColor: "#d46c3c",
                          "&.Mui-disabled": {
                            color: "#fff",
                            backgroundColor: "#d46c3c",
                            borderColor: "#d46c3c",
                            opacity: 1,
                          },
                        }}
                      >
                        Mặc định
                      </Button>
                    )}

                    <Button
                      variant="text"
                      size="small"
                      className="change-button"
                      onClick={() => setIsOpenModalSelectAddress(true)}
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

                <Box className="cart-item-list">
                  <Box className="cart-header">
                    <Typography className="product-header">Sản phẩm</Typography>
                    <Typography className="category-header">
                      Phân loại
                    </Typography>
                    <Typography className="color-header">Màu</Typography>
                    <Typography className="price-header">Đơn giá</Typography>
                    <Typography className="quantity-header">
                      Số lượng
                    </Typography>
                  </Box>
                  <Box className="cart-items">
                    {items.map((item) => (
                      <Box className="cart-item">
                        <Box className="product-info">
                          <img
                            src={item?.glassColor?.Image}
                            alt={item?.glassColor?.Glass?.Category}
                            className="product-image"
                          />
                          <Typography variant="body1" className="product-name">
                            {generateProductName(
                              item?.glassColor?.Glass?.Category,
                              0,
                              item?.glassColor?.Glass?.ID
                            )}
                            {item.glassColor.Quantity < 10 && (
                              <p className="remain-quantity">
                                Còn {item.glassColor.Quantity} sản phẩm
                              </p>
                            )}
                          </Typography>
                        </Box>

                        <Box className="category-info">
                          <Typography variant="body2">
                            {item?.glassColor?.Glass?.Category}{" "}
                            {item?.glassColor?.Glass?.Material.toLowerCase()}{" "}
                            {translateShapeToVietnamese(
                              item?.glassColor?.Glass?.Shape
                            ).toLowerCase()}
                          </Typography>
                        </Box>
                        <Box className="color-info">
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: item.glassColor.Color,
                              border: "1px solid #ccc",
                              margin: "auto",
                            }}
                          />
                        </Box>

                        <Box className="price-info">
                          {Number(item?.glassColor?.Discount) !== 0 && (
                            <Typography
                              variant="body2"
                              className="original-price"
                            >
                              {formatCurrencyVND(item?.glassColor?.Price)}
                            </Typography>
                          )}
                          <Typography variant="body1" className="current-price">
                            {formatCurrencyVND(
                              item?.glassColor?.Price -
                                (item?.glassColor?.Price *
                                  item?.glassColor?.Discount) /
                                  100
                            )}
                          </Typography>
                        </Box>

                        <Box className="quantity-controls">
                          <Typography className="quantity-value">
                            {item?.quantity}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Box className="order-details">
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

      <DeliveryAddressModal
        isOpen={isOpenModalSelectAddress}
        onClose={onCloseModalSelectAddress}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        deliveryAddresses={deliveryAddresses}
        fetchAllDeliveryAddress={fetchAllDeliveryAddress}
        onSuccessDelete={() => {
          setIsOpenModalSelectAddress(true);
        }}
      ></DeliveryAddressModal>
    </div>
  );
};

export default Order;
