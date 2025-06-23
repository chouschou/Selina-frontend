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
import { getLongitudeLatitude } from "../../services/getLongitudeLatitude";
import { getAllShipFees } from "../../services/shipfee/getAllShipFees";
import { getDistance } from "../../services/getDistance";
import { VoucherModal } from "../../components/VoucherModal/VoucherModal";
import { getVoucherByAccountId } from "../../services/voucher/getVoucherByAccountId";
import { getAllVouchers } from "../../services/voucher/getAllVouchers";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { toast } from "react-toastify";
import { createOrder } from "../../services/order/createOrder";
import { vnpayPayment } from "../../services/payment/vnpayPayment";

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
  const [shippingFeeStore, setShippingFeeStore] = useState(0);
  const onCloseModalSelectAddress = () => {
    setIsOpenModalSelectAddress(false);
  };

  const [shippingFee, setShippingFee] = useState(0);
  const [orderDiscount, setOrderDiscount] = useState(0);
  const totalProductPrice = items.reduce((total, item) => {
    const basePrice = item?.glassColor?.Price || 0;
    const productDiscount = item?.glassColor?.Discount || 0;
    const discountedPrice = basePrice - (basePrice * productDiscount) / 100;
    return total + discountedPrice * item.quantity;
  }, 0);
  const totalAmount = totalProductPrice + shippingFee - orderDiscount;

  useEffect(() => {
    const fetchShippingFeeStore = async () => {
      const response = await getAllShipFees();
      setShippingFeeStore(response[0]);
    };

    fetchShippingFeeStore();
  }, []);

  useEffect(() => {
    const fetchShippingFee = async () => {
      if (isLoggedIn && selectedAddress?.DeliveryAddress?.Province) {
        const distance = await getDistanceOfTwoProvinces(); // đơn vị: km

        if (distance !== null && shippingFeeStore) {
          const baseFee = parseFloat(shippingFeeStore.BasicFee || "0"); // phí cơ bản
          const baseDistance = parseFloat(
            shippingFeeStore.BasicDistance || "0"
          ); // km miễn phí đầu
          const surcharge = parseFloat(shippingFeeStore.Surcharge || "0"); // phụ thu mỗi đơn vị
          const surchargeUnit = parseFloat(
            (shippingFeeStore.SurchargeUnit || "1").replace(/[^\d.]/g, "")
          ); // loại bỏ chữ " km", chỉ lấy số

          let fee = baseFee;

          if (distance > baseDistance) {
            const extraDistance = distance - baseDistance;
            fee += (extraDistance * surcharge) / surchargeUnit;
          }

          setShippingFee(Math.ceil(fee)); // Làm tròn cho gọn
        }
      }
    };

    fetchShippingFee();
  }, [selectedAddress, isLoggedIn, shippingFeeStore]);

  const getDistanceOfTwoProvinces = async () => {
    try {
      const dep = await getLongitudeLatitude(
        selectedAddress?.DeliveryAddress?.Province
      );
      console.log("selectedAddress:", selectedAddress, "-dep:", dep);
      const des = await getLongitudeLatitude(shippingFeeStore?.StoreLocation);
      console.log("shippingFeeStore:", shippingFeeStore, "-des:", des);

      if (!dep?.length || !des?.length) return;

      const distance = await getDistance(
        parseFloat(des[0].lon).toFixed(5),
        parseFloat(des[0].lat).toFixed(5),
        parseFloat(dep[0].lon).toFixed(5),
        parseFloat(dep[0].lat).toFixed(5)
      );

      console.log("khoảng cách:", distance);
      return distance; // đơn vị: km
    } catch (error) {
      console.log("Lỗi khi lấy khoảng cách:", error);
    }
  };

  // --xử lý voucher--
  const [openVoucherModal, setOpenVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null); //giá trị account voucher
  const [accountVouchers, setAccountVouchers] = useState([]);
  const [unusedVouchers, setUnusedVouchers] = useState([]);
  const [otherVouchers, setOtherVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenVouchers = () => setOpenVoucherModal(true);
  const handleCloseVouchers = () => setOpenVoucherModal(false);
  useEffect(() => {
    fetchAccountVouchers();
  }, [isLoggedIn, account?.ID]);

  useEffect(() => {
    if (openVoucherModal) {
      fetchOtherVouchers();
    }
  }, [accountVouchers, openVoucherModal]);

  const fetchAccountVouchers = async () => {
    if (isLoggedIn && account?.ID) {
      try {
        const response = await getVoucherByAccountId(account.ID);
        setAccountVouchers(response.data);
        const unusedVouchers = response.data.filter(
          (item) => item.Status === false
        );
        console.log("Unused Vouchers:", unusedVouchers);
        setUnusedVouchers(unusedVouchers);
      } catch (error) {
        console.error("Failed to fetch account vouchers", error);
      }
    }
  };

  const fetchOtherVouchers = async () => {
    const response = await getAllVouchers();
    console.log("All Vouchers:", response);
    setOtherVouchers(
      response.filter(
        (voucher) =>
          voucher.RemainingQuantity > 0 &&
          !accountVouchers.some(
            (accVoucher) => accVoucher?.Voucher.ID === voucher?.ID
          )
      )
    );
  };

  const handleApplyVoucher = (voucher) => {
    //voucher: account voucher
    setSelectedVoucher(voucher);
    // Cập nhật giảm giá dựa trên voucher
    if (totalProductPrice >= voucher?.Voucher.MinOrderValue) {
      const discountAmount =
        (totalProductPrice * voucher.Voucher.VoucherPercentage) / 100;
      if (discountAmount > voucher.Voucher.MaxDiscount) {
        setOrderDiscount(voucher.Voucher.MaxDiscount);
      } else {
        setOrderDiscount(discountAmount);
      }
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle order submission
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ nhận hàng.");
    } else if (paymentMethod === "online") {
      // toast.error("Chức năng thanh toán trực tuyến hiện chưa được hỗ trợ.");
      try {
        const orderData = {
          DeliveryAddressId: selectedAddress?.DeliveryAddress?.ID,
          Total: totalAmount,
          ShippingFee: shippingFee,
          VoucherDiscount: orderDiscount,
          Status: "waiting",
          TransactionCode: null,
          AccountVoucherId: selectedVoucher?.ID || null,
          OrderDetails: items.map((item) => ({
            GlassColorId: item.glassColor.ID,
            Quantity: item.quantity,
            Price: parseFloat(item.glassColor.Price),
            Discount: parseFloat(item.glassColor.Discount),
          })),
        };

        console.log("Order Data:", orderData);
        const orderRes = await createOrder(orderData);
        console.log("Order Response:", orderRes);
        const vnpayResponse = await vnpayPayment(orderRes);
        // const vnpayResponse = await vnpayPayment(orderData);

        window.location.href = vnpayResponse.data.url; // Redirect to VNPay payment page
        setIsLoading(false);
      } catch (error) {
        console.error("Error creating order for VNPay:", error);
        toast.error(
          "Đặt hàng thành công! Lỗi thanh toán VNPay. Vui lòng thanh toán lại sau."
        );
        //đi đến trang thành công  và cho thanh toán lại sau
      }
    } else if (paymentMethod === "cod") {
      try {
        const orderData = {
          DeliveryAddressId: selectedAddress?.DeliveryAddress?.ID,
          Total: totalAmount,
          ShippingFee: shippingFee,
          VoucherDiscount: orderDiscount,
          Status: "waiting",
          TransactionCode: null,
          AccountVoucherId: selectedVoucher?.ID || null,
          OrderDetails: items.map((item) => ({
            GlassColorId: item.glassColor.ID,
            Quantity: item.quantity,
            Price: parseFloat(item.glassColor.Price),
            Discount: parseFloat(item.glassColor.Discount),
          })),
        };

        console.log("Order Data:", orderData);
        await createOrder(orderData);
        toast.success(
          "Đặt hàng thành công! Vui lòng kiểm tra email để xác nhận."
        );
        setIsLoading(false);
        //đi đến trang thành công hoặc hiển thị thông báo thành công
      } catch (error) {
        console.error("Error submitting order:", error);
        toast.error("Đặt hàng thất bại. Vui lòng thử lại sau.");
      }
    }

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
  }, [isLoggedIn, account?.ID]);
  return (
    <div className="order-page">
      <Header />

      <Container className="order-container">
        <form onSubmit={handleSubmitOrder}>
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

                <Box className="order-details" sx={{ marginTop: "20px" }}>
                  <Box className="detail-row">
                    <Typography
                      variant="body1"
                      sx={{ color: "#931c1c", fontWeight: 500 }}
                    >
                      Áp mã giảm giá
                    </Typography>

                    {selectedVoucher ? (
                      totalProductPrice >=
                      selectedVoucher?.Voucher.MinOrderValue ? (
                        <Typography
                          // className="price"
                          sx={{
                            color: "#931c1c",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          - {formatCurrencyVND(orderDiscount)}{" "}
                          <ChevronRightIcon
                            fontSize="small"
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                color: "#198067",
                              },
                            }}
                            onClick={handleOpenVouchers}
                          />
                        </Typography>
                      ) : (
                        <Typography sx={{ color: "#931c1c",  display: "flex",
                            alignItems: "center", }}>
                          Không đủ điều kiện áp dụng voucher
                          <ChevronRightIcon
                            fontSize="small"
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                color: "#198067",
                              },
                            }}
                            onClick={handleOpenVouchers}
                          />
                        </Typography>
                      )
                    ) : (
                      <Button className="price" onClick={handleOpenVouchers}>
                        Chọn voucher
                      </Button>
                    )}
                  </Box>

                  <Divider className="detail-divider" />

                  <Box className="detail-row">
                    <Typography variant="body1">Tổng tiền hàng</Typography>
                    <Typography variant="body1" className="price">
                      {formatCurrencyVND(totalProductPrice)}
                    </Typography>
                  </Box>

                  <Box className="detail-row">
                    <Typography variant="body1">Chi phí vận chuyển</Typography>
                    <Typography variant="body1" className="price">
                      {formatCurrencyVND(shippingFee)}
                    </Typography>
                  </Box>

                  <Box className="detail-row">
                    <Typography variant="body1">Voucher giảm giá</Typography>
                    <Typography variant="body1" className="discount">
                      - {formatCurrencyVND(orderDiscount)}
                    </Typography>
                  </Box>

                  <Divider className="detail-divider" />

                  <Box className="detail-row total-row">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#2eb889" }}
                    >
                      Tổng số tiền cần thanh toán
                    </Typography>
                    <Typography variant="h6" className="total-price">
                      {formatCurrencyVND(totalAmount)}
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
                  onClick={handleSubmitOrder}
                  disabled={isLoading}
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

      <VoucherModal
        open={openVoucherModal}
        onClose={handleCloseVouchers}
        onSelect={handleApplyVoucher}
        fetchAccountVouchers={fetchAccountVouchers}
        fetchOtherVouchers={fetchOtherVouchers}
        accountVouchers={unusedVouchers}
        availableVouchers={otherVouchers}
      />
    </div>
  );
};

export default Order;
