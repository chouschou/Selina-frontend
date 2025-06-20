import { Box, Typography } from "@mui/material"
import CartItem from "../CartItem"
import "./CartItemList.scss"

const CartItemList = ({ items, onSelectItem, onOpenDetail, onUpdateQuantity, onRemoveItem }) => {
  console.log("Cart item list: ", items)
  return (
    <Box className="cart-item-list">
      <Box className="cart-header">
        <Typography className="product-header">Sản phẩm</Typography>
        <Typography className="category-header">Phân loại</Typography>
         <Typography className="color-header">Màu</Typography>
        <Typography className="price-header">Đơn giá</Typography>
        <Typography className="quantity-header">Số lượng</Typography>
        <Typography className="action-header">Xóa</Typography>
      </Box>

      <Box className="cart-items">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onSelect={() => onSelectItem(item.id)}
            onUpdateQuantity={(quantity) => onUpdateQuantity(item.id, quantity)}
            onRemove={() => onRemoveItem(item.id)}
            onOpenDetail={() => onOpenDetail(item.glassColor.Glass_ID)}
          />
        ))}
      </Box>
    </Box>
  )
}

export default CartItemList
