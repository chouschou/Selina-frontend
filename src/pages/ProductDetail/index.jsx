import { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  IconButton,
  Divider,
  Rating,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Header from "../../components/Header";
import ProductList from "../../components/ProductList";
import ReviewList from "../../components/ReviewList";
import "./ProductDetail.scss";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../services/product/getProductById";
import {
  formatCurrencyVND,
  generateProductName,
  translateShapeToVietnamese,
} from "../../services/formatToShow";
import { getRatingByColorId } from "../../services/rating/getRatingByColorId";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import GLBViewer from "./GLBViewer";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { addCart } from "../../services/cart/addCart";
import { toast } from "react-toastify";
import { CartContext } from "../../contexts/CartContext/CartContext";
import { updateQuantityCart } from "../../services/cart/updateQuantityCart";
import { CartIconRefContext } from "../../contexts/CartContext/CartIconRefContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [show3D, setShow3D] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  // const { cartIconRef } = useContext(CartIconRefContext);
  const imageRef = useRef(null);

  // const animateFlyToCart = () => {
  //   const img = imageRef.current;
  //   const cartIcon = cartIconRef.current;
  //   if (!img || !cartIcon) return;

  //   const imgRect = img.getBoundingClientRect();
  //   const cartRect = cartIcon.getBoundingClientRect();

  //   const flyingImg = img.cloneNode(true);
  //   flyingImg.style.position = "fixed";
  //   flyingImg.style.left = `${imgRect.left}px`;
  //   flyingImg.style.top = `${imgRect.top}px`;
  //   flyingImg.style.width = `${imgRect.width}px`;
  //   flyingImg.style.height = `${imgRect.height}px`;
  //   flyingImg.style.transition = "all 1.2s ease-in-out";
  //   flyingImg.style.zIndex = 1000;
  //   flyingImg.style.borderRadius = "8px";
  //   flyingImg.style.pointerEvents = "none"; // không bị hover
  //   flyingImg.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; // làm rõ hình
  //   document.body.appendChild(flyingImg);

  //   // Kích hoạt animation
  //   requestAnimationFrame(() => {
  //     flyingImg.style.left = `${cartRect.left}px`;
  //     flyingImg.style.top = `${cartRect.top}px`;
  //     flyingImg.style.width = "24px"; // không thu nhỏ về 0
  //     flyingImg.style.height = "24px";
  //     flyingImg.style.opacity = "0.9"; // vẫn rõ
  //   });

  //   flyingImg.addEventListener("transitionend", () => {
  //     flyingImg.remove();
  //   });
  // };

  const handleOpenImage3D = () => setShow3D(true);
  const handleSelectImage = (index) => {
    setSelectedImage(index);
    setShow3D(false); // Quay lại ảnh nếu đang xem 3D
  };

  const ageOptions = ["Nam", "Nữ", "Trẻ em"];

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const toggleReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  const fetchRatingByColorId = async () => {
    const response = await getRatingByColorId(selectedColor);
    console.log("response:", response);
    setReviews(response);
  };

  useEffect(() => {
    const fetchDetailProduct = async () => {
      const response = await getProductById(id);
      setProduct(response);

      // Mặc định chọn màu đầu tiên nếu có
      if (response?.GlassColors?.length > 0) {
        setSelectedColor(response.GlassColors[0].ID);
      }
    };

    fetchDetailProduct();
  }, []);

  useEffect(() => {
    if (selectedColor !== null) {
      setQuantity(1);
      fetchRatingByColorId();
    }
  }, [selectedColor]);

  const selectedColorDetail = product?.GlassColors?.find(
    (color) => color.ID === selectedColor
  );
  // Product images
  const productImages = selectedColorDetail?.Images || [];

  console.log("Detail product: ", product);
  console.log("reviews product: ", reviews);

  const scrollThumbnail = (direction) => {
    const container = document.getElementById("thumbnail-scroll");
    const scrollAmount = 100;
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const { carts, refreshCart } = useContext(CartContext);
  const navigate = useNavigate();
  const handleBuyNow = () => {
    // const itemIds = [1, 2, 3];
    // const queryString = new URLSearchParams({
    //   items: itemIds.join(","),
    // }).toString();
    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    } else {
      navigate("/order", {
        state: {
          items: [
            {
              glassColor: {
                ID: selectedColor,
                Glass: {
                  ID: product?.ID,
                  Category: product?.Category,
                  Shape: product?.Shape,
                  Material: product?.Material,
                  Description: product?.Description,
                  Age: product?.Age,
                },
                Color: selectedColorDetail?.Color,
                Quantity: 30,
                Price: selectedColorDetail?.Price,
                Discount: selectedColorDetail?.Discount,
                ModelVirtualTryOn: selectedColorDetail?.ModelVirtualTryOn,
                Image3DPath: selectedColorDetail?.Image3DPath,
                Status: selectedColorDetail?.Status,
                Image: selectedColorDetail?.Images || "images/no_image.png",
              },
              quantity: quantity,
            },
          ],
        },
      });
    }
  };
  const handleAddCart = async () => {
    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }

    const existingCartItem = carts.find(
      (cart) => cart.glassColor?.ID === selectedColor
    );

    if (existingCartItem) {
      // Đã có trong giỏ → cập nhật số lượng
      const data = {
        quantity: existingCartItem.quantity + quantity,
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
        glassColorId: selectedColor,
        quantity: quantity,
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

  return (
    <div className="product-detail-page">
      <Header />

      <Container maxWidth="lg" className="product-container">
        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6} className="product-images">
            <Box
              className="main-image-container"
              sx={{
                position: "relative",
                width: 520,
                height: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {show3D && selectedColorDetail?.Image3DPath ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <GLBViewer url={selectedColorDetail.Image3DPath} />
                </Box>
              ) : (
                <img
                  src={productImages[selectedImage] ?? "images/no_image.png"}
                  alt="Gọng kính tròn"
                  className="main-image"
                  style={{
                    maxWidth: 520,
                    height: 300,
                    objectFit: "contain",
                  }}
                />
              )}

              {selectedColorDetail?.Image3DPath && (
                <Button
                  variant="outlined"
                  className="try-button"
                  startIcon={<ThreeDRotationIcon />}
                  sx={{
                    position: "absolute",
                    bottom: 60,
                    right: 16,
                    borderRadius: "50%",
                  }}
                  onClick={handleOpenImage3D}
                >
                  360
                </Button>
              )}
              <Button
                variant="contained"
                className="try-button"
                startIcon={<CameraAltIcon />}
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  color: "white",
                }}
              >
                Thử kính
              </Button>
            </Box>

            <Box sx={{ position: "relative", maxWidth: 520, mt: 2 }}>
              {/* Button trái */}
              <IconButton
                onClick={() => scrollThumbnail("left")}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  zIndex: 1,
                  transform: "translateY(-50%)",
                }}
              >
                <ChevronLeft />
              </IconButton>

              {/* Vùng scroll ảnh */}
              <Box
                className="thumbnail-container"
                id="thumbnail-scroll"
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  scrollBehavior: "smooth",
                  gap: 1,
                  px: 4,
                  /* Ẩn scrollbar trên Chrome, Safari */
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  /* Ẩn scrollbar trên Firefox */
                  scrollbarWidth: "none",
                  /* Ẩn scrollbar trên Edge/IE (nếu cần) */
                  msOverflowStyle: "none",
                }}
              >
                {productImages.map((image, index) => (
                  <Box
                    key={index}
                    className={`thumbnail ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => handleSelectImage(index)}
                    sx={{
                      flex: "0 0 auto",

                      border:
                        selectedImage === index
                          ? "2px solid #1976d2"
                          : "1px solid #ccc",
                      borderRadius: 1,
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Button phải */}
              <IconButton
                onClick={() => scrollThumbnail("right")}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  zIndex: 1,
                  transform: "translateY(-50%)",
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6} className="product-info">
            <Typography variant="h4" className="product-title">
              {product?.Category && product?.ID
                ? generateProductName(product.Category, 0, product.ID)
                : "Sản phẩm"}
            </Typography>

            <Box className="color-options">
              {product?.GlassColors?.map((color) => (
                <Box
                  key={color.ID}
                  className={`color-circle ${
                    selectedColor === color.ID ? "active" : ""
                  }`}
                  sx={{ backgroundColor: color.Color }}
                  onClick={() => setSelectedColor(color.ID)}
                />
              ))}
            </Box>

            <Box className="price-container">
              <Typography variant="body2" className="original-price">
                {formatCurrencyVND(selectedColorDetail?.Price)}
              </Typography>
              <Typography variant="h4" className="sale-price">
                {formatCurrencyVND(
                  selectedColorDetail?.Price -
                    (selectedColorDetail?.Price *
                      selectedColorDetail?.Discount) /
                      100
                )}
              </Typography>
            </Box>

            <Box className="product-details">
              <Typography variant="body1" className="stock-info">
                <span className="fw-500">Kho:</span>{" "}
                <span
                  style={{
                    color:
                      selectedColorDetail?.Quantity === 0 ? "red" : "inherit",
                  }}
                >
                  {selectedColorDetail?.Quantity} kính
                </span>
              </Typography>

              <Typography variant="body1" className="material-info">
                <span className="fw-500">Phân loại: </span>
                {product?.Category} {product?.Material?.toLowerCase()}{" "}
                {product?.Shape
                  ? translateShapeToVietnamese(product?.Shape).toLowerCase()
                  : ""}
              </Typography>
              <Box
                className="material-info"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography
                  variant="body1"
                  className="fw-500"
                  sx={{ marginRight: "8px", fontWeight: 500 }}
                >
                  Dành cho:
                </Typography>
                <FormGroup row sx={{ flexDirection: "row" }}>
                  {ageOptions.map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={
                            product?.Age
                              ? product.Age.split(",")
                                  .map((a) => a.trim())
                                  .includes(option)
                              : false
                          }
                          sx={{
                            color: "#96eeb3",
                            "&.Mui-checked": {
                              color: "#96eeb3",
                            },
                          }}
                        />
                      }
                      label={option}
                      sx={{ marginRight: "10px" }}
                    />
                  ))}
                </FormGroup>
              </Box>

              <Typography variant="body1" className="material-info">
                <span className="fw-500"> Mô tả:</span> {product?.Description}
              </Typography>

              <Box className="quantity-selector">
                <Typography variant="body1" className="quantity-label">
                  <span className="fw-500">Số lượng: </span>
                </Typography>

                {selectedColorDetail?.Quantity === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{ color: "red", fontWeight: 500, mt: "4px" }}
                  >
                    Sản phẩm đã hết, vui lòng chọn sản phẩm khác
                  </Typography>
                ) : (
                  <Box className="quantity-controls">
                    <IconButton
                      size="small"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="quantity-button"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography className="quantity-value">
                      {quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={increaseQuantity}
                      className="quantity-button"
                      disabled={quantity >= selectedColorDetail?.Quantity}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>

            <Box className="action-buttons">
              <Button
                variant="outlined"
                className="cart-button"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddCart}
                ref={imageRef}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                variant="contained"
                className="buy-button"
                onClick={handleBuyNow}
              >
                Đặt hàng ngay
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Box>
          <Box className="ratings-summary">
            <Box className="rating-stars">
              <Typography variant="body2" className="rating-count">
                Đánh giá ({reviews?.count})
              </Typography>
              {reviews?.average ? (
                <Rating
                  value={Number(reviews?.average)}
                  precision={0.5}
                  readOnly
                />
              ) : (
                <Rating value={0} precision={0.5} readOnly />
              )}
            </Box>
            <Button
              variant="text"
              className="view-all-button"
              onClick={toggleReviews}
            >
              {showAllReviews ? "Thu gọn" : "Xem tất cả"}
            </Button>
          </Box>

          {showAllReviews && (
            <Box className="reviews-container-wrapper">
              <ReviewList reviews={reviews.ratings} />
            </Box>
          )}
        </Box>

        <Divider className="section-divider" />

        {/* Similar Products Section */}
        <Box className="similar-products-section">
          <Typography variant="h5" className="section-title">
            SẢN PHẨM TƯƠNG TỰ
          </Typography>
          {/* <ProductList products={similarProducts} /> */}
        </Box>
      </Container>
    </div>
  );
};

export default ProductDetail;
