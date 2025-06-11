import { useContext, useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Header from "../../components/Header";
import CartItemList from "../../components/CartItemList";
import "./Cart.scss";
import { CartContext } from "../../contexts/CartContext/CartContext";
import { formatCurrencyVND } from "../../services/formatToShow";
import { updateQuantityCart } from "../../services/cart/updateQuantityCart";
import { toast } from "react-toastify";
import { deleteCart } from "../../services/cart/deleteCart";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { carts, refreshCart } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (carts && carts.length > 0) {
      const updatedCartItems = carts
        .slice() // sao chép mảng để không thay đổi `carts` gốc
        .sort((a, b) => b.id - a.id) // sắp xếp giảm dần theo ID
        .map((item) => ({
          ...item,
          selected: false,
        }));
      setCartItems(updatedCartItems);
    }
  }, [carts]);

  const handleSelectItem = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };
  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    const data = {
      quantity: newQuantity,
    };
    try {
      await updateQuantityCart(id, data);
      // toast.success("Cập nhật số lượng trong giỏ hàng thành công!");
      // refreshCart();
      // animateFlyToCart();
    } catch (error) {
      toast.error("Lỗi cập nhật giỏ hàng!", error.message || error);
    }
  };

  const handleRemoveItem = async(id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));

    try {
      await deleteCart(id);
      toast.success("Xóa sản phẩm trong giỏ hàng thành công!");
      // refreshCart();
      // animateFlyToCart();
    } catch (error) {
      toast.error("Lỗi xóa sản phẩm giỏ hàng!", error.message || error);
    }
  };

  // Calculate totals
  const selectedItems = cartItems.filter(
    (item) => item.selected && item.glassColor.Quantity >= 1
  );

  const totalQuantity = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = selectedItems.reduce((sum, item) => {
    const priceAfterDiscount =
      item.glassColor.Price -
      (item.glassColor.Price * item.glassColor.Discount) / 100;
    return sum + priceAfterDiscount * item.quantity;
  }, 0);

  const totalOriginalPrice = selectedItems.reduce(
    (sum, item) => sum + item.glassColor.Price * item.quantity,
    0
  );

  const savings = totalOriginalPrice - totalPrice;

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setCartItems(
      cartItems.map((item) =>
        item.glassColor.Quantity >= 1 ? { ...item, selected: isChecked } : item
      )
    );
  };

  const allSelected =
    cartItems.filter((item) => item.glassColor.Quantity >= 1).length > 0 &&
    cartItems
      .filter((item) => item.glassColor.Quantity >= 1)
      .every((item) => item.selected);

  const availableItemCount = cartItems.filter(
    (item) => item.glassColor.Quantity >= 1
  ).length;

  const handleOpenDetail = (glassColorId) => {
    console.log("Opening detail for glassColorId:", glassColorId);
    navigate(`/detail/${glassColorId}`);
  }

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
              onOpenDetail={handleOpenDetail}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
            {/* Trống - cart-summary ra ngoài container */}
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

      {/* Cart Summary nằm ngoài để fixed và vẫn thẳng hàng */}
      {cartItems.length > 0 && (
        <Box className="cart-summary fixed-summary">
          <Container maxWidth="lg" className="cart-summary-container">
            <Box className="select-all">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="select-checkbox"
                  />
                }
                label={
                  <Typography variant="body1" className="select-label">
                    Chọn tất cả ({availableItemCount} sản phẩm còn hàng)
                  </Typography>
                }
              />
            </Box>

            <Box className="summary-details">
              <Box className="price-details">
                <Typography variant="h7" className="total-label">
                  Tổng cộng (số lượng: {totalQuantity})
                </Typography>
                <Typography variant="h6" className="total-price">
                  {formatCurrencyVND(totalPrice)}
                </Typography>
                {savings > 0 && (
                  <Typography variant="body2" className="savings">
                    Tiết kiệm {formatCurrencyVND(savings)}
                  </Typography>
                )}
              </Box>

              <Button
                variant="contained"
                className="checkout-button"
                disabled={selectedItems.length === 0}
              >
                Mua hàng
              </Button>
            </Box>
          </Container>
        </Box>
      )}
    </div>
  );
};

export default Cart;
