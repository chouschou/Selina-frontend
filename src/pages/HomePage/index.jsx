import { useState } from "react"
import { Box, Container, Button, Grid } from "@mui/material"
import Header from "../../components/Header"
import ProductList from "../../components/ProductList"
import "./HomePage.scss"
import model2Removebg from "../../assets/images/model2-removebg.png"
import glass1 from "../../assets/images/glass1.png"
import glass_nobg from "../../assets/images/glass_nobg.png"

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState("all")

  // Sample product data
  const bestSellerProducts = [
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
    {
      id: 4,
      image: glass1,
      originalPrice: 180000,
      salePrice: 150000,
      description: "Gọng kim loại, hình vuông",
      colors: ["white", "black"],
      rating: 4.7,
    },
    {
      id: 5,
      image: glass1,
      originalPrice: 200000,
      salePrice: 170000,
      description: "Gọng nhựa, hình oval",
      colors: ["white", "black", "green", "blue"],
      rating: 4.8,
    },
    {
      id: 6,
      image: glass1,
      originalPrice: 160000,
      salePrice: 130000,
      description: "Gọng kim loại, hình chữ nhật",
      colors: ["white", "black", "red"],
      rating: 4.3,
    },
  ]

  const newArrivalsProducts = [
    {
      id: 7,
      image: glass1,
      originalPrice: 170000,
      salePrice: 140000,
      description: "Gọng kim loại, hình tròn",
      colors: ["white", "black", "blue"],
      rating: 4.6,
    },
    {
      id: 8,
      image: glass1,
      originalPrice: 190000,
      salePrice: 160000,
      description: "Gọng nhựa, hình vuông",
      colors: ["white", "black", "red"],
      rating: 4.4,
    },
    {
      id: 9,
      image: glass1,
      originalPrice: 210000,
      salePrice: 180000,
      description: "Gọng kim loại, hình oval",
      colors: ["white", "black", "green"],
      rating: 4.9,
    },
  ]

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
  }

  return (
    <div className="home-page">
      <Header />

      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg" sx={{ padding: 0, margin: 0 }}>
          <Grid container spacing={2} alignItems="center" sx={{ padding: 0}}>
            <Grid item xs={12} md={6} className="hero-content">
              <img src={model2Removebg} alt="Model with glasses" className="hero-image" />
            </Grid>
            <Grid item xs={12} md={6} className="hero-content right-content">
              <p variant="h3" className="brand-name">
                Selina
              </p>
              <p variant="h6" className="brand-tagline">
                Thương hiệu thời trang mắt kính
              </p>
              <img src={glass_nobg} alt="Featured glasses" className="featured-glasses" />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Filter Section */}
      <Container maxWidth="lg">
        <Box className="filter-section">
          <Button
            className={`filter-button ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterChange("all")}
          >
            Tất cả
          </Button>
          <Button
            className={`filter-button ${activeFilter === "frame" ? "active" : ""}`}
            onClick={() => handleFilterChange("frame")}
          >
            <span className="filter-icon">👓</span> Kiểu gọng
          </Button>
          <Button
            className={`filter-button ${activeFilter === "gender" ? "active" : ""}`}
            onClick={() => handleFilterChange("gender")}
          >
            <span className="filter-icon">👫</span> Giới tính
          </Button>
          <Button
            className={`filter-button ${activeFilter === "price" ? "active" : ""}`}
            onClick={() => handleFilterChange("price")}
          >
            <span className="filter-icon">💰</span> Mức giá
          </Button>
          <Button
            className={`filter-button ${activeFilter === "age" ? "active" : ""}`}
            onClick={() => handleFilterChange("age")}
          >
            <span className="filter-icon">👴</span> Độ tuổi
          </Button>
        </Box>
      </Container>

      {/* Best Sellers Section */}
      <Box className="products-section">
        <ProductList title="BÁN CHẠY NHẤT" products={bestSellerProducts} />
      </Box>

      {/* New Arrivals Section */}
      <Box className="products-section">
        <ProductList title="SẢN PHẨM MỚI" products={newArrivalsProducts} />
      </Box>
    </div>
  )
}

export default HomePage
