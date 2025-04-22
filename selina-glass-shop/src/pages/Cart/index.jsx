import { useState } from "react"
import { Container, Typography, Box, Button, Checkbox, FormControlLabel } from "@mui/material"
import Header from "../../components/Header"
import CartItemList from "../../components/CartItemList"
import "./Cart.scss"
import glass from "../../assets/images/glass.png"
import glass1 from "../../assets/images/glass1.png"

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      image: glass,
      name: "Gọng kính tròn, kim loại",
      category: "Màu đen",
      originalPrice: 140000,
      price: 120000,
      quantity: 2,
      selected: true,
    },
    {
      id: 2,
      image: glass,
      name: "Gọng kính tròn, kim loại",
      category: "Màu trắng",
      originalPrice: 140000,
      price: 120000,
      quantity: 1,
      selected: false,
    },
    {
      id: 3,
      image: glass1,
      name: "Gọng kính tròn, nhựa",
      category: "Màu hồng",
      originalPrice: 140000,
      price: 120000,
      quantity: 1,
      selected: false,
    },
  ])

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked
    setCartItems(cartItems.map((item) => ({ ...item, selected: isChecked })))
  }

  const handleSelectItem = (id) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)))
  }

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  // Calculate totals
  const selectedItems = cartItems.filter((item) => item.selected)
  const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalOriginalPrice = selectedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const savings = totalOriginalPrice - totalPrice

  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.selected)

  return (
    <div className="cart-page">
      <Header />

      <Container maxWidth="lg" className="cart-container">
        <Typography variant="h4" className="cart-title">
          Giỏ hàng
        </Typography>

        {cartItems.length > 0 ? (
          <>
            <CartItemList
              items={cartItems}
              onSelectItem={handleSelectItem}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />

            <Box className="cart-summary">
              <Box className="select-all">
                <FormControlLabel
                  control={<Checkbox checked={allSelected} onChange={handleSelectAll} className="select-checkbox" />}
                  label={
                    <Typography variant="body1" className="select-label">
                      Chọn tất cả ({cartItems.length} sản phẩm)
                    </Typography>
                  }
                />
              </Box>

              <Box className="summary-details">
                <Box className="price-details">
                  <Typography variant="h6" className="total-label">
                    Tổng cộng ({totalQuantity} sản phẩm)
                  </Typography>
                  <Typography variant="h5" className="total-price">
                    {totalPrice.toLocaleString()} đ
                  </Typography>
                  {savings > 0 && (
                    <Typography variant="body2" className="savings">
                      Tiết kiệm {savings.toLocaleString()} đ
                    </Typography>
                  )}
                </Box>

                <Button variant="contained" className="checkout-button" disabled={selectedItems.length === 0}>
                  Mua hàng
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <Box className="empty-cart">
            <Typography variant="h6">Giỏ hàng của bạn đang trống</Typography>
            <Button variant="contained" className="continue-shopping" href="/">
              Tiếp tục mua sắm
            </Button>
          </Box>
        )}
      </Container>
    </div>
  )
}

export default Cart
