import { Box, Typography } from "@mui/material"
import "./OrderProductItem.scss"

const OrderProductItem = ({ product }) => {
  const { image, name, variant, quantity, originalPrice, price } = product

  return (
    <Box className="order-product-item">
      <Box className="product-image-container">
        <img src={image || "/placeholder.svg"} alt={name} className="product-image" />
      </Box>

      <Box className="product-details">
        <Typography variant="body1" className="product-name">
          {name}
        </Typography>
        <Typography variant="body2" className="product-variant">
          Phân loại: {variant}
        </Typography>
        <Typography variant="body2" className="product-quantity">
          x {quantity}
        </Typography>
      </Box>

      <Box className="product-price">
        {originalPrice !== price && (
          <Typography variant="body2" className="original-price">
            {originalPrice.toLocaleString()} đ
          </Typography>
        )}
        <Typography variant="body1" className="current-price">
          {price.toLocaleString()} đ
        </Typography>
      </Box>
    </Box>
  )
}

export default OrderProductItem
