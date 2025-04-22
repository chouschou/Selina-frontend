import { Box, Typography, Checkbox, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import "./CartItem.scss"

const CartItem = ({ item, onSelect, onUpdateQuantity, onRemove }) => {
  const { image, name, category, originalPrice, price, quantity, selected } = item

  const handleIncreaseQuantity = () => {
    onUpdateQuantity(quantity + 1)
  }

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      onUpdateQuantity(quantity - 1)
    }
  }

  return (
    <Box className="cart-item">
      <Box className="product-info">
        <Checkbox checked={selected} onChange={onSelect} className="select-checkbox" />
        <img src={image || "/placeholder.svg"} alt={name} className="product-image" />
        <Typography variant="body1" className="product-name">
          {name}
        </Typography>
      </Box>

      <Box className="category-info">
        <Typography variant="body2">{category}</Typography>
      </Box>

      <Box className="price-info">
        {originalPrice !== price && (
          <Typography variant="body2" className="original-price">
            {originalPrice.toLocaleString()} đ
          </Typography>
        )}
        <Typography variant="body1" className="current-price">
          {price.toLocaleString()} đ
        </Typography>
      </Box>

      <Box className="quantity-controls">
        <IconButton size="small" onClick={handleDecreaseQuantity} disabled={quantity <= 1}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography className="quantity-value">{quantity}</Typography>
        <IconButton size="small" onClick={handleIncreaseQuantity}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box className="action-buttons">
        <IconButton onClick={onRemove} className="delete-button">
          <DeleteOutlineIcon color="error" />
        </IconButton>
      </Box>
    </Box>
  )
}

export default CartItem
