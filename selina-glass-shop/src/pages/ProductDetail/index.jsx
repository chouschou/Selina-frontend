import { useState } from "react"
import { Box, Container, Typography, Button, Grid, IconButton, Divider, Rating } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import Header from "../../components/Header"
import ProductList from "../../components/ProductList"
import ReviewList from "../../components/ReviewList"
import "./ProductDetail.scss"
import avatar2 from "../../assets/images/avatar2.png"
import glass from "../../assets/images/glass.png"
import glass1 from "../../assets/images/glass1.png"
import glass2 from "../../assets/images/glass2.png"
import glass3 from "../../assets/images/glass3.png"
import review1 from "../../assets/images/review1.png"
import review2 from "../../assets/images/review2.png"
import review3 from "../../assets/images/review3.png"
import review4 from "../../assets/images/review4.png"

import CameraAltIcon from "@mui/icons-material/CameraAlt"
import { useNavigate } from "react-router-dom"

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState("white")
  const [quantity, setQuantity] = useState(1)
  const [showAllReviews, setShowAllReviews] = useState(false)

  // Product images
  const productImages = [glass1, glass2, glass3, glass, review1, review2]

  // Product colors
  const colors = [
    { id: "white", name: "Trắng", code: "#FFFFFF" },
    { id: "black", name: "Đen", code: "#000000" },
    { id: "green", name: "Xanh lá", code: "#1FAB89" },
  ]

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      user: {
        name: "Nguyễn Thùy Linh",
        avatar: avatar2,
      },
      rating: 5,
      date: "12/03/2024",
      comment: "Kính đẹp ghê, nhân viên tư vấn nhiệt tình, thân thiện, lần cho shop!! sẽ giới thiệu cho bạn bè đến ạ!",
      images: [review3, review4],
    },
    {
      id: 2,
      user: {
        name: "Nguyễn Thùy Linh",
        avatar: avatar2,
      },
      rating: 5,
      date: "07/03/2024",
      comment: "Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh. Mình rất hài lòng!",
      images: [],
    },
    {
      id: 3,
      user: {
        name: "Trần Văn Nam",
        avatar: avatar2,
      },
      rating: 4,
      date: "05/03/2024",
      comment: "Kính đẹp, chất lượng tốt. Giao hàng hơi chậm nhưng vẫn ổn.",
      images: [review3],
    },
  ]

  // Similar products data
  const similarProducts = [
    {
      id: 1,
      image: glass1,
      originalPrice: 150000,
      salePrice: 120000,
      description: "Gọng kim loại, hình tròn",
      colors: ["white", "black", "green"],
      rating: 4.5,
    },
    {
      id: 2,
      image: glass1,
      originalPrice: 150000,
      salePrice: 120000,
      description: "Gọng kim loại, hình tròn",
      colors: ["white", "black", "green"],
      rating: 4.5,
    },
    {
      id: 3,
      image: glass1,
      originalPrice: 150000,
      salePrice: 120000,
      description: "Gọng kim loại, hình tròn",
      colors: ["white", "black", "green"],
      rating: 4.5,
    },
  ]

  const handleColorSelect = (colorId) => {
    setSelectedColor(colorId)
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const toggleReviews = () => {
    setShowAllReviews(!showAllReviews)
  }
  const navigate = useNavigate()
  const handleBuyNow = () => {
    navigate("/order")
  }
  return (
    <div className="product-detail-page">
      <Header />

      <Container maxWidth="lg" className="product-container">
        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6} className="product-images">
            <Box className="main-image-container">
              <img
                src={productImages[selectedImage] || "/placeholder.svg"}
                alt="Gọng kính tròn"
                className="main-image"
              />
              <Button
                variant="contained"
                className="try-button"
                startIcon={<CameraAltIcon />}
              >
                Thử kính
              </Button>
            </Box>
            <Box className="thumbnail-container">
              {productImages.map((image, index) => (
                <Box
                  key={index}
                  className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6} className="product-info">
            <Typography variant="h4" className="product-title">
              Gọng kính tròn
            </Typography>

            <Box className="color-options">
              {colors.map((color) => (
                <Box
                  key={color.id}
                  className={`color-circle ${selectedColor === color.id ? "active" : ""}`}
                  sx={{ backgroundColor: color.code }}
                  onClick={() => handleColorSelect(color.id)}
                />
              ))}
            </Box>

            <Box className="price-container">
              <Typography variant="body2" className="original-price">
                150.000 đ
              </Typography>
              <Typography variant="h4" className="sale-price">
                120.000 đ
              </Typography>
            </Box>

            <Box className="product-details">
              <Typography variant="body1" className="stock-info">
                Kho: 32 kính
              </Typography>
              <Typography variant="body1" className="material-info">
                Gọng kim loại
              </Typography>

              <Box className="quantity-selector">
                <Typography variant="body1" className="quantity-label">
                  Số lượng
                </Typography>
                <Box className="quantity-controls">
                  <IconButton
                    size="small"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="quantity-button"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography className="quantity-value">{quantity}</Typography>
                  <IconButton size="small" onClick={increaseQuantity} className="quantity-button">
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            <Box className="action-buttons">
              <Button variant="outlined" className="cart-button" startIcon={<ShoppingCartIcon />}>
                Thêm vào giỏ hàng
              </Button>
              <Button variant="contained" className="buy-button" onClick={handleBuyNow}>
                Đặt hàng ngay
              </Button>
            </Box>

            <Box className="ratings-summary">
              <Box className="rating-stars">
                <Typography variant="body2" className="rating-count">
                  Đánh giá (242)
                </Typography>
                <Rating value={4.5} precision={0.5} readOnly />
              </Box>
              <Button variant="text" className="view-all-button" onClick={toggleReviews}>
                {showAllReviews ? "Thu gọn" : "Xem tất cả"}
              </Button>
            </Box>

            {showAllReviews && (
              <Box className="reviews-container-wrapper">
                <ReviewList reviews={reviews} />
              </Box>
            )}
          </Grid>
        </Grid>

        <Divider className="section-divider" />

        {/* Similar Products Section */}
        <Box className="similar-products-section">
          <Typography variant="h5" className="section-title">
            SẢN PHẨM TƯƠNG TỰ
          </Typography>
          <ProductList products={similarProducts} />
        </Box>
      </Container>
    </div>
  )
}

export default ProductDetail
