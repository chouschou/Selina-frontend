import { Box, Typography, Checkbox, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./CartItem.scss";
import {
  formatCurrencyVND,
  generateProductName,
  translateShapeToVietnamese,
} from "../../services/formatToShow";

const CartItem = ({ item, onSelect, onOpenDetail, onUpdateQuantity, onRemove }) => {
  const handleIncreaseQuantity = () => {
    onUpdateQuantity(item?.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (item?.quantity > 1) {
      onUpdateQuantity(item?.quantity - 1);
    }
  };

  return (
    <Box className="cart-item">
      <Box className="product-info">
        {item.glassColor.Quantity >= 1 ? (
          <Checkbox
            checked={item?.selected}
            onChange={onSelect}
            className="select-checkbox"
          />
        ) : (
          <div
            className="select-checkbox-disabled"
            style={{ width: 29, height: 20, marginRight: 10 }}
          />
        )}
        <img
          src={item?.glassColor?.Image}
          alt={item?.glassColor?.Glass?.Category}
          className="product-image"
        />
        <Typography variant="body1" className="product-name" onClick={onOpenDetail}  style={{ cursor: "pointer" }}>
          {generateProductName(
            item?.glassColor?.Glass?.Category,
            0,
            item?.glassColor?.Glass?.ID
          )}
          {item.glassColor.Quantity < 10 && (
            <p className="remain-quantity">
              Còn {item.glassColor.Quantity} sản phẩm
            </p>
          )}
        </Typography>
      </Box>

      <Box className="category-info">
        <Typography variant="body2">
          {item?.glassColor?.Glass?.Category}{" "}
          {item?.glassColor?.Glass?.Material.toLowerCase()}{" "}
          {translateShapeToVietnamese(
            item?.glassColor?.Glass?.Shape
          ).toLowerCase()}
        </Typography>
      </Box>
      <Box className="color-info">
        {/* <Typography variant="body2">
          {getColorNameFromHex(item.glassColor.Color)}
        </Typography> */}
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: item.glassColor.Color,
            border: "1px solid #ccc",
            margin: "auto",
          }}
        />
      </Box>

      <Box className="price-info">
        {Number(item?.glassColor?.Discount) !== 0 && (
          <Typography variant="body2" className="original-price">
            {formatCurrencyVND(item?.glassColor?.Price)}
          </Typography>
        )}
        <Typography variant="body1" className="current-price">
          {formatCurrencyVND(
            item?.glassColor?.Price -
              (item?.glassColor?.Price * item?.glassColor?.Discount) / 100
          )}
        </Typography>
      </Box>

      {item.glassColor.Quantity >= 1 ? (
        <Box className="quantity-controls">
          <IconButton
            size="small"
            onClick={handleDecreaseQuantity}
            disabled={item?.quantity <= 1}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography className="quantity-value">{item?.quantity}</Typography>
          <IconButton
            size="small"
            onClick={handleIncreaseQuantity}
            disabled={item?.quantity >= item.glassColor.Quantity}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Typography className="no-quantity-value">
          Sản phẩm đã hết, vui lòng chọn sản phẩm khác
        </Typography>
      )}

      <Box className="action-buttons">
        <IconButton onClick={onRemove} className="delete-button">
          <DeleteOutlineIcon color="error" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CartItem;
