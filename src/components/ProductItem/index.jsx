import { Card, CardMedia, CardContent, Typography, Button, Box, IconButton } from "@mui/material"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import StarIcon from "@mui/icons-material/Star"
import "./ProductItem.scss"

const ProductItem = ({ product }) => {
  const { image, originalPrice, salePrice, description, colors, rating } = product

  return (
    <Card className="product-item">
      <Box className="product-image-container">
        <CardMedia component="img" image={image} alt={description} className="product-image" />
        <IconButton className="cart-button">
          <ShoppingCartIcon />
        </IconButton>
      </Box>

      <CardContent className="product-content">
        <Box className="price-container">
          <Typography variant="body2" className="original-price">
            {originalPrice.toLocaleString()} đ
          </Typography>
          <Typography variant="h6" className="sale-price">
            {salePrice.toLocaleString()} đ
          </Typography>
          <Box className="rating">
            <StarIcon className="star-icon" />
            <Typography variant="body2">{rating}/5</Typography>
          </Box>
        </Box>

        <Typography variant="body1" className="product-description">
          {description}
        </Typography>

        <Box className="product-actions">
          <Box className="color-options">
            {colors.map((color, index) => (
              <Box key={index} className={`color-circle ${color}`} sx={{ backgroundColor: color }} />
            ))}
          </Box>

          <Button
            variant="contained"
            className="try-button"
            startIcon={<span className="material-icons">visibility</span>}
          >
            Thử kính
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductItem
