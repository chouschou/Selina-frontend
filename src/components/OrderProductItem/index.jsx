import { Box, Typography } from "@mui/material";
import "./OrderProductItem.scss";
import { formatCurrencyVND } from "../../services/formatToShow";

const OrderProductItem = ({ productInfo }) => {
  const { image, product, quantity, discount, price } = productInfo;
  const originalPrice = price;
  const newPrice = (price * (100 - discount)) / 100;

  return (
    <Box className="order-product-item">
      <Box className="product-image-container">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="product-image"
        />
      </Box>

      <Box className="product-details">
        <Typography variant="body1" className="product-name">
          {product?.name}
        </Typography>
        <Typography variant="body2" className="product-variant">
          Phân loại: {product?.variantProduct}
        </Typography>
        <Typography variant="body2" className="product-quantity">
          x {quantity}
        </Typography>
      </Box>

      <Box className="product-price">
        {originalPrice !== newPrice && (
          <Typography variant="body2" className="original-price">
            {formatCurrencyVND(originalPrice)}
          </Typography>
        )}
        <Typography variant="body1" className="current-price">
          {formatCurrencyVND(newPrice)}
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderProductItem;
