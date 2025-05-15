import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import "./ProductItem.scss";
import { useEffect, useState } from "react";
import { getProductColorsById } from "../../services/product/getProductColorsById";
import { toast } from "react-toastify";
import hexToColorName from "../../services/hexToColorName";

const ProductItem = ({ product, onClick }) => {
  // const { image, originalPrice, salePrice, description, colors, rating } = product
  const { colors, setColors } = useState(['#000000']);
  console.log("--product--", product);
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const colors = await getProductColorsById(product.ID).colors;
        // const { data, colors } = await getProductColorsById(product.ID);
        // setColorDetails(data);
        setColors(colors);
      } catch (err) {
        toast.error(err);
      }
    };

    fetchColors();
  }, [product.ID]);
  console.log("colors", colors);
  return (
    <Card className="product-item" onClick={onClick}>
      <Box className="product-image-container">
        <CardMedia
          component="img"
          image={product.GlassColors[0]?.Images?.[0] || "images/glass.png"}
          alt={product.Description}
          className="product-image"
        />
        <IconButton className="cart-button">
          <ShoppingCartIcon />
        </IconButton>
      </Box>

      <CardContent className="product-content">
        <Box className="price-container">
          <Typography variant="body2" className="original-price">
            {(+product.GlassColors[0].Price).toLocaleString()} đ
          </Typography>
          <Typography variant="h6" className="sale-price">
            {(
              (+product.GlassColors[0].Price *
                (100 - +product.GlassColors[0].Discount)) /
              100
            ).toLocaleString()}{" "}
            đ
          </Typography>

          <Box className="rating">
            <StarIcon className="star-icon" />
            {/* <Typography variant="body2">{rating}/5</Typography> */}
            <Typography variant="body2">_/5</Typography>
          </Box>
        </Box>

        <Typography
          variant="body1"
          className="product-description"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {/* {product.Description} */}
          {product.Category} {product.Material}
        </Typography>

        <Box className="product-actions">
          <Box className="color-options">
            {colors?.map((hex, index) => {
              const name = hexToColorName(hex);
              return (
                <Box
                  key={index}
                  className={`color-circle ${name}`}
                  sx={{ backgroundColor: hex }}
                />
              );
            })}
          </Box>

          <Button
            variant="contained"
            className="try-button"
            startIcon={<CameraAltIcon />}
          >
            Thử kính
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductItem;
