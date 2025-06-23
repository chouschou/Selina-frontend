import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import "./ProductItem.scss";
import { useContext, useEffect, useState } from "react";
import { getProductColorsById } from "../../services/product/getProductColorsById";
import { toast } from "react-toastify";
import hexToColorName from "../../services/hexToColorName";
import {
  formatCurrencyVND,
  generateProductName,
  translateShapeToVietnamese,
} from "../../services/formatToShow";
import { addCart } from "../../services/cart/addCart";
import { updateQuantityCart } from "../../services/cart/updateQuantityCart";
import { CartContext } from "../../contexts/CartContext/CartContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { getRatingByColorId } from "../../services/rating/getRatingByColorId";
import VirtualTryOn from "../VirtualTryOn/VirtualTryOn";

const ProductItem = ({ product, onClick }) => {
  // const { image, originalPrice, salePrice, description, colors, rating } = product
  const [colors, setColors] = useState([]);
  const ageOptions = ["Nam", "Nữ", "Trẻ em"];
  const [rating, setRating] = useState(0);
  const [isOpenTryOnModal, setOpenTryOnModal] = useState(false);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        if (!product?.ID) return;

        const colors = await getProductColorsById(product.ID);
        setColors(colors.colors);
      } catch (err) {
        toast.error(err);
      }
    };

    fetchColors();

    const fetchRating = async () => {
      try {
        if (!product?.ID) return;

        const rating = await getRatingByColorId(product?.GlassColors[0].ID);
        setRating(rating.average);
      } catch (err) {
        toast.error(err);
      }
    };
    fetchRating();
  }, [product?.ID]);

  console.log("colors====", colors);

  const { carts, refreshCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const handleAddCart = async () => {
    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }
    console.log("--product--", product);
    const existingCartItem = carts.find(
      (cart) => cart.glassColor?.ID === product?.GlassColors[0].ID
    );

    if (existingCartItem) {
      // Đã có trong giỏ → cập nhật số lượng
      const data = {
        quantity: existingCartItem.quantity + 1,
      };

      try {
        await updateQuantityCart(existingCartItem.id, data);
        toast.success("Cập nhật số lượng trong giỏ hàng thành công!");
        refreshCart();
        // animateFlyToCart();
      } catch (error) {
        toast.error("Lỗi cập nhật giỏ hàng!", error.message || error);
      }
    } else {
      // Chưa có → thêm mới
      const data = {
        glassColorId: product?.GlassColors[0].ID,
        quantity: 1,
      };

      try {
        await addCart(data);
        toast.success("Thêm vào giỏ hàng thành công!");
        // animateFlyToCart();
        refreshCart();
      } catch (error) {
        toast.error("Lỗi thêm vào giỏ hàng!", error.message || error);
      }
    }
  };

  const handleTryOn = () => {
    setOpenTryOnModal(true);
  };

  if (!product) return null;
  return (
    <>
      <Card className="product-item">
        <Box className="product-image-container">
          <CardMedia
            component="img"
            image={product?.GlassColors?.[0]?.Images?.[0] ?? ""}
            alt={
              product?.Category && product?.ID
                ? generateProductName(product.Category, 0, product.ID)
                : "Sản phẩm"
            }
            className="product-image"
          />
          <IconButton className="cart-button" onClick={handleAddCart}>
            <ShoppingCartIcon />
          </IconButton>
        </Box>

        <CardContent className="product-content">
          <Box className="price-container" onClick={onClick}>
            <Typography variant="body2" className="original-price">
              {product?.GlassColors
                ? formatCurrencyVND(product?.GlassColors[0]?.Price)
                : ""}
            </Typography>
            <Typography variant="h6" className="sale-price">
              {product?.GlassColors
                ? formatCurrencyVND(
                    (product?.GlassColors[0]?.Price *
                      (100 - +product?.GlassColors[0]?.Discount)) /
                      100
                  )
                : ""}
            </Typography>

            <Box className="rating">
              <StarIcon className="star-icon" />
              <Typography variant="body2">{rating}/5</Typography>
              {/* <Typography variant="body2">_/5</Typography> */}
            </Box>
          </Box>

          <Typography
            onClick={onClick}
            variant="body1"
            className="product-description"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {`${product?.Category} ${product?.Material.toLowerCase()} ${
              product?.Shape
                ? translateShapeToVietnamese(product.Shape).toLowerCase()
                : ""
            } `}
          </Typography>

          <FormGroup row onClick={onClick}>
            {ageOptions
              .filter((option) =>
                product?.Age?.split(",")
                  .map((a) => a.trim())
                  .includes(option)
              )
              .map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked
                      sx={{
                        color: "#96eeb3",
                        "&.Mui-checked": {
                          color: "#96eeb3",
                        },
                      }}
                    />
                  }
                  label={option}
                  sx={{ marginRight: "10px", marginBottom: "10px" }}
                />
              ))}
          </FormGroup>

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
              onClick={handleTryOn}
            >
              Thử kính
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={isOpenTryOnModal}
        onClose={() => setOpenTryOnModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {" "}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              THỬ KÍNH ẢO - KÍNH 2D
            </h2>
            <IconButton
              onClick={() => setOpenTryOnModal(false)}
              color="inherit"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Typography className="note-text">
          Lưu ý: Bạn không nên đeo kính trong quá trình thử để đem đến trải
          nghiệm tốt nhất.
        </Typography>
        <VirtualTryOn
          urlImage={product?.GlassColors[0]?.ModelVirtualTryOn}
        ></VirtualTryOn>
        {/* <DialogActions>
          <Button onClick={() => setOpenTryOnModal(false)}>Đóng</Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default ProductItem;
