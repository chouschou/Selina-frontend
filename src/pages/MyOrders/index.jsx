"use client";

import { useContext, useEffect, useState } from "react";
import { Container, Typography, Box, Tabs, Tab } from "@mui/material";
import Header from "../../components/Header";
import OrderItem from "../../components/OrderItem";
import "./MyOrders.scss";
import { getOrdersByAccountId } from "../../services/order/getOrdersByAccountId";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { generateProductCategoryName, generateProductName } from "../../services/formatToShow";

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { isLoggedIn, account } = useContext(AuthContext);

  // Sample orders data with different statuses
  // const orders = [
  //   {
  //     id: 1,
  //     date: "12:00, 12/03/2024",
  //     status: "awaiting",
  //     paymentStatus: "Đã thanh toán",
  //     statusHistory: [{ time: "12:00, 12/03/2024", status: "Đã thanh toán" }],
  //     deliveryInfo: {
  //       name: "Nguyễn Thân Lý",
  //       phone: "0842569888",
  //       address: "123 Nguyễn Lương Bằng, Đà Nẵng",
  //     },
  //     items: [
  //       {
  //         id: 101,
  //         image: "/glasses1.jpg",
  //         name: "Gọng kính tròn, kim loại",
  //         variant: "Màu đen",
  //         quantity: 2,
  //         originalPrice: 280000,
  //         price: 240000,
  //       },
  //     ],
  //     shipping: 40000,
  //     discount: 0,
  //     total: 280000,
  //   },
  //   {
  //     id: 2,
  //     date: "15:00, 12/03/2024",
  //     status: "confirmed",
  //     paymentStatus: "Đã thanh toán",
  //     statusHistory: [
  //       { time: "15:00, 12/03/2024", status: "Cửa hàng đã xác nhận" },
  //       { time: "12:00, 12/03/2024", status: "Đã thanh toán" },
  //     ],
  //     deliveryInfo: {
  //       name: "Nguyễn Thân Lý",
  //       phone: "0842569888",
  //       address: "123 Nguyễn Lương Bằng, Đà Nẵng",
  //     },
  //     items: [
  //       {
  //         id: 201,
  //         image: "/glasses2.jpg",
  //         name: "Gọng kính tròn, kim loại",
  //         variant: "Màu đen",
  //         quantity: 2,
  //         originalPrice: 280000,
  //         price: 240000,
  //       },
  //       {
  //         id: 202,
  //         image: "/glasses3.jpg",
  //         name: "Gọng kính tròn, kim loại",
  //         variant: "Màu đen",
  //         quantity: 2,
  //         originalPrice: 280000,
  //         price: 240000,
  //       },
  //     ],
  //     shipping: 40000,
  //     discount: 0,
  //     total: 520000,
  //   },
  //   {
  //     id: 3,
  //     date: "19:00, 12/03/2024",
  //     status: "shipping",
  //     paymentStatus: "Đã thanh toán",
  //     statusHistory: [
  //       { time: "19:00, 12/03/2024", status: "Cửa hàng đã giao cho đơn vị vận chuyển" },
  //       { time: "15:00, 12/03/2024", status: "Cửa hàng đã xác nhận" },
  //       { time: "12:00, 12/03/2024", status: "Đã thanh toán" },
  //     ],
  //     deliveryInfo: {
  //       name: "Nguyễn Thân Lý",
  //       phone: "0842569888",
  //       address: "123 Nguyễn Lương Bằng, Đà Nẵng",
  //     },
  //     items: [
  //       {
  //         id: 301,
  //         image: "/glasses1.jpg",
  //         name: "Gọng kính tròn, kim loại",
  //         variant: "Màu đen",
  //         quantity: 2,
  //         originalPrice: 280000,
  //         price: 240000,
  //       },
  //     ],
  //     shipping: 40000,
  //     discount: 0,
  //     total: 280000,
  //   },
  //   {
  //     id: 4,
  //     date: "11:00, 12/03/2024",
  //     status: "completed",
  //     paymentStatus: "Đã thanh toán",
  //     statusHistory: [
  //       { time: "11:00, 12/03/2024", status: "Đã nhận được hàng" },
  //       { time: "19:00, 12/03/2024", status: "Cửa hàng đã giao cho đơn vị vận chuyển" },
  //       { time: "15:00, 12/03/2024", status: "Cửa hàng đã xác nhận" },
  //       { time: "12:00, 12/03/2024", status: "Đã thanh toán" },
  //     ],
  //     deliveryInfo: {
  //       name: "Nguyễn Thân Lý",
  //       phone: "0842569888",
  //       address: "123 Nguyễn Lương Bằng, Đà Nẵng",
  //     },
  //     items: [
  //       {
  //         id: 401,
  //         image: "images/glass.png",
  //         name: "Gọng kính tròn, kim loại",
  //         variant: "Màu đen",
  //         quantity: 2,
  //         originalPrice: 280000,
  //         price: 240000,
  //       },
  //       {
  //         id: 402,
  //         image: "images/glass1.png",
  //         name: "Gọng kính tròn, kim loại",
  //         variant: "Màu đen",
  //         quantity: 2,
  //         originalPrice: 280000,
  //         price: 240000,
  //       },
  //     ],
  //     shipping: 40000,
  //     discount: 0,
  //     total: 280000,
  //     canReview: true,
  //   },
  //   {
  //     id: 5,
  //     date: "19:00, 12/03/2024",
  //     status: "cancelled",
  //     paymentStatus: "Đã thanh toán",
  //     statusHistory: [
  //       { time: "19:00, 12/03/2024", status: "Đã hủy bởi bạn" },
  //       { time: "15:00, 12/03/2024", status: "Đã thanh toán" },
  //     ],
  //     deliveryInfo: {
  //       name: "Nguyễn Thân Lý",
  //       phone: "0842569888",
  //       address: "123 Nguyễn Lương Bằng, Đà Nẵng",
  //     },
  //     items: [
  //       {
  //         id: 501,
  //         image: "/glasses1.jpg",
  //         name: "Gọng kính tròn, kim loại",
  //         variant: "Màu đen",
  //         quantity: 2,
  //         originalPrice: 280000,
  //         price: 240000,
  //       },
  //     ],
  //     shipping: 40000,
  //     discount: 0,
  //     total: 280000,
  //   },
  // ]

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
      })),
      items: rawOrder.OrderDetails.map((detail) => ({
        id: detail.ID,
        quantity: detail.Quantity,
        price: parseFloat(detail.Price),
        discount: parseFloat(detail.Discount),
        product: {
          id: detail.GlassColor.Glass.ID,
          variantProduct: generateProductCategoryName(detail.GlassColor.Glass.Category, detail.GlassColor.Glass.Material, detail.GlassColor.Glass.Shape),
          name: generateProductName(detail.GlassColor.Glass.Category, 0, detail.GlassColor.Glass.ID),
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
  useEffect(() => {
    const fetchAllOrders = async () => {
      const response = await getOrdersByAccountId(account.ID);
      const mappedOrders = response.map(mapOrderData);
      setOrders(mappedOrders);
    };

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
      "canceled",
    ];
    return orders.filter((order) => order.status === statusMap[activeTab]);
  };

  const filteredOrders = getFilteredOrders();

  console.log("My orders - orders:", orders);
  console.log("My orders - filtered orders", filteredOrders);

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
            <Tab label="Đã hủy" />
          </Tabs>
        </Box>

        <Box className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderItem key={order.id} order={order} />
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
