"use client";

import { useContext, useEffect, useState } from "react";
import { Container, Typography, Box, Tabs, Tab } from "@mui/material";
import Header from "../../components/Header";
import OrderItem from "../../components/OrderItem";
import "./MyOrders.scss";
import { getOrdersByAccountId } from "../../services/order/getOrdersByAccountId";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import {
  generateProductCategoryName,
  generateProductName,
} from "../../services/formatToShow";

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { isLoggedIn, account } = useContext(AuthContext);

  const mapOrderData = (rawOrder) => {
    return {
      id: rawOrder.ID,
      total: parseFloat(rawOrder.Total),
      shipping: parseFloat(rawOrder.ShippingFee),
      discount: parseFloat(rawOrder.VoucherDiscount),
      status: rawOrder.Status,
      date:
        rawOrder.OrderStatuses?.[0]?.CreateAt ||
        rawOrder.OrderStatuses?.at(-1)?.CreateAt,
      paymentStatus: rawOrder.OrderStatuses?.find((s) => s.Status === "paid")
        ? "Đã thanh toán"
        : "Chưa thanh toán",
      deliveryInfo: {
        name: rawOrder.AccountDelivery?.DeliveryAddress?.Name,
        phone: rawOrder.AccountDelivery?.DeliveryAddress?.PhoneNumber,
        address: `${rawOrder.AccountDelivery?.DeliveryAddress?.Address}, ${rawOrder.AccountDelivery?.DeliveryAddress?.Province}`,
      },
      statusHistory: rawOrder.OrderStatuses.map((s) => ({
        status: s.Status,
        time: s.CreateAt,
        refund: s.Refund,
      })),
      items: rawOrder.OrderDetails.map((detail) => ({
        id: detail.ID,
        idColor: detail.GlassColor.ID,
        quantity: detail.Quantity,
        price: parseFloat(detail.Price),
        discount: parseFloat(detail.Discount),
        rating: detail.Rating,
        product: {
          idGlass: detail.GlassColor.Glass.ID,
          variantProduct: generateProductCategoryName(
            detail.GlassColor.Glass.Category,
            detail.GlassColor.Glass.Material,
            detail.GlassColor.Glass.Shape
          ),
          name: generateProductName(
            detail.GlassColor.Glass.Category,
            0,
            detail.GlassColor.Glass.ID
          ),
          color: detail.GlassColor.Color,
          image: detail.GlassColor.ModelVirtualTryOn,
          material: detail.GlassColor.Glass.Material,
          age: detail.GlassColor.Glass.Age,
        },
      })),
      canReview: rawOrder.Status === "completed", // tuỳ điều kiện khác nữa nếu có
    };
  };

  const [orders, setOrders] = useState([]);
  const fetchAllOrders = async () => {
    const response = await getOrdersByAccountId(account.ID);
    const mappedOrders = response.map(mapOrderData);
    setOrders(mappedOrders);
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchAllOrders();
    }
  }, [account?.ID]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    const statusMap = [
      "waiting",
      "confirmed",
      "shipping",
      "completed",
      "returned",
      "canceled",
    ];
    return orders.filter((order) => order.status === statusMap[activeTab]);
  };

  const filteredOrders = getFilteredOrders();

  console.log("My orders - orders:", orders);
  console.log("My orders - filtered orders", filteredOrders);

  const onSuccess = async() => {
    fetchAllOrders()
  }

  return (
    <div className="my-orders-page">
      <Header />

      <Container maxWidth="lg" className="orders-container">
        <Typography variant="h4" className="page-title">
          Đơn hàng của tôi
        </Typography>

        <Box className="orders-tabs">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab label="Chờ xác nhận" />
            <Tab label="Đã xác nhận" />
            <Tab label="Đang vận chuyển" />
            <Tab label="Hoàn thành" />
            <Tab label="Đã trả hàng"></Tab>
            <Tab label="Đã hủy" />
          </Tabs>
        </Box>

        <Box className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderItem key={order.id} order={order} onSuccess={onSuccess} />
            ))
          ) : (
            <Box className="no-orders">
              <Typography variant="body1">Không có đơn hàng nào</Typography>
            </Box>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default MyOrders;
