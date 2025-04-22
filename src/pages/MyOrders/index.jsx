"use client"

import { useState } from "react"
import { Container, Typography, Box, Tabs, Tab } from "@mui/material"
import Header from "../../components/Header"
import OrderItem from "../../components/OrderItem"
import "./MyOrders.scss"

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState(0)

  // Sample orders data with different statuses
  const orders = [
    {
      id: 1,
      date: "12:00, 12/03/2024",
      status: "awaiting",
      paymentStatus: "Đã thanh toán",
      statusHistory: [{ time: "12:00, 12/03/2024", status: "Đã thanh toán" }],
      deliveryInfo: {
        name: "Nguyễn Thân Lý",
        phone: "0842569888",
        address: "123 Nguyễn Lương Bằng, Đà Nẵng",
      },
      items: [
        {
          id: 101,
          image: "/glasses1.jpg",
          name: "Gọng kính tròn, kim loại",
          variant: "Màu đen",
          quantity: 2,
          originalPrice: 280000,
          price: 240000,
        },
      ],
      shipping: 40000,
      discount: 0,
      total: 280000,
    },
    {
      id: 2,
      date: "15:00, 12/03/2024",
      status: "confirmed",
      paymentStatus: "Đã thanh toán",
      statusHistory: [
        { time: "15:00, 12/03/2024", status: "Cửa hàng đã xác nhận" },
        { time: "12:00, 12/03/2024", status: "Đã thanh toán" },
      ],
      deliveryInfo: {
        name: "Nguyễn Thân Lý",
        phone: "0842569888",
        address: "123 Nguyễn Lương Bằng, Đà Nẵng",
      },
      items: [
        {
          id: 201,
          image: "/glasses2.jpg",
          name: "Gọng kính tròn, kim loại",
          variant: "Màu đen",
          quantity: 2,
          originalPrice: 280000,
          price: 240000,
        },
        {
          id: 202,
          image: "/glasses3.jpg",
          name: "Gọng kính tròn, kim loại",
          variant: "Màu đen",
          quantity: 2,
          originalPrice: 280000,
          price: 240000,
        },
      ],
      shipping: 40000,
      discount: 0,
      total: 520000,
    },
    {
      id: 3,
      date: "19:00, 12/03/2024",
      status: "shipping",
      paymentStatus: "Đã thanh toán",
      statusHistory: [
        { time: "19:00, 12/03/2024", status: "Cửa hàng đã giao cho đơn vị vận chuyển" },
        { time: "15:00, 12/03/2024", status: "Cửa hàng đã xác nhận" },
        { time: "12:00, 12/03/2024", status: "Đã thanh toán" },
      ],
      deliveryInfo: {
        name: "Nguyễn Thân Lý",
        phone: "0842569888",
        address: "123 Nguyễn Lương Bằng, Đà Nẵng",
      },
      items: [
        {
          id: 301,
          image: "/glasses1.jpg",
          name: "Gọng kính tròn, kim loại",
          variant: "Màu đen",
          quantity: 2,
          originalPrice: 280000,
          price: 240000,
        },
      ],
      shipping: 40000,
      discount: 0,
      total: 280000,
    },
    {
      id: 4,
      date: "11:00, 12/03/2024",
      status: "completed",
      paymentStatus: "Đã thanh toán",
      statusHistory: [
        { time: "11:00, 12/03/2024", status: "Đã nhận được hàng" },
        { time: "19:00, 12/03/2024", status: "Cửa hàng đã giao cho đơn vị vận chuyển" },
        { time: "15:00, 12/03/2024", status: "Cửa hàng đã xác nhận" },
        { time: "12:00, 12/03/2024", status: "Đã thanh toán" },
      ],
      deliveryInfo: {
        name: "Nguyễn Thân Lý",
        phone: "0842569888",
        address: "123 Nguyễn Lương Bằng, Đà Nẵng",
      },
      items: [
        {
          id: 401,
          image: "/glasses1.jpg",
          name: "Gọng kính tròn, kim loại",
          variant: "Màu đen",
          quantity: 2,
          originalPrice: 280000,
          price: 240000,
        },
        {
          id: 402,
          image: "/glasses2.jpg",
          name: "Gọng kính tròn, kim loại",
          variant: "Màu đen",
          quantity: 2,
          originalPrice: 280000,
          price: 240000,
        },
      ],
      shipping: 40000,
      discount: 0,
      total: 280000,
      canReview: true,
    },
    {
      id: 5,
      date: "19:00, 12/03/2024",
      status: "cancelled",
      paymentStatus: "Đã thanh toán",
      statusHistory: [
        { time: "19:00, 12/03/2024", status: "Đã hủy bởi bạn" },
        { time: "15:00, 12/03/2024", status: "Đã thanh toán" },
      ],
      deliveryInfo: {
        name: "Nguyễn Thân Lý",
        phone: "0842569888",
        address: "123 Nguyễn Lương Bằng, Đà Nẵng",
      },
      items: [
        {
          id: 501,
          image: "/glasses1.jpg",
          name: "Gọng kính tròn, kim loại",
          variant: "Màu đen",
          quantity: 2,
          originalPrice: 280000,
          price: 240000,
        },
      ],
      shipping: 40000,
      discount: 0,
      total: 280000,
    },
  ]

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    const statusMap = ["awaiting", "confirmed", "shipping", "completed", "cancelled"]
    return orders.filter((order) => order.status === statusMap[activeTab])
  }

  const filteredOrders = getFilteredOrders()

  return (
    <div className="my-orders-page">
      <Header />

      <Container maxWidth="lg" className="orders-container">
        <Typography variant="h4" className="page-title">
          Đơn hàng của tôi
        </Typography>

        <Box className="orders-tabs">
          <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Chờ xác nhận" />
            <Tab label="Đã xác nhận" />
            <Tab label="Đang vận chuyển" />
            <Tab label="Hoàn thành" />
            <Tab label="Đã hủy" />
          </Tabs>
        </Box>

        <Box className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => <OrderItem key={order.id} order={order} />)
          ) : (
            <Box className="no-orders">
              <Typography variant="body1">Không có đơn hàng nào</Typography>
            </Box>
          )}
        </Box>
      </Container>
    </div>
  )
}

export default MyOrders
