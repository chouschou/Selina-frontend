import { useEffect, useState } from "react";
import { Box, Container, Button, Grid } from "@mui/material";
import Header from "../../components/Header";
import ProductList from "../../components/ProductList";
import "./HomePage.scss";
import model2Removebg from "../../assets/images/model2-removebg.png";
import glass_nobg from "../../assets/images/glass_nobg.png";
import { getProductsByCategory } from "../../services/product/getProductsByCategory";

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductsByCategory("Kính mát");
        setProductsList(response); // Nếu API trả về mảng sản phẩm
        console.log("Products List:", response);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const newArrivalsProducts = [
    {
      ID: 2,
      Category: "Kính mát",
      Shape: "Square",
      Material: "Nhựa",
      Description: "Cool square sunglasses for adults",
      Age: "Người lớn",
      GlassColors: [
        {
          ID: 2,
          Color: "#0000FF",
          Quantity: 30,
          Price: "150000.00",
          Discount: "15.00",
          Image3DPath: "path_to_3d_image_2",
          Images: [''],
        },
      ],
    },
    {
      ID: 2,
      Category: "Kính mát",
      Shape: "Square",
      Material: "Nhựa",
      Description: "Cool square sunglasses for adults",
      Age: "Người lớn",
      GlassColors: [
        {
          ID: 2,
          Color: "#0000FF",
          Quantity: 30,
          Price: "150000.00",
          Discount: "15.00",
          Image3DPath: "path_to_3d_image_2",
          Images: [''],
        },
      ],
    },
  ];

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="home-page">
      <Header />

      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg" sx={{ padding: 0, margin: 0 }}>
          <Grid container spacing={2} alignItems="center" sx={{ padding: 0 }}>
            <Grid item xs={12} md={6} className="hero-content">
              <img
                src={model2Removebg}
                alt="Model with glasses"
                className="hero-image"
              />
            </Grid>
            <Grid item xs={12} md={6} className="hero-content right-content">
              <p variant="h3" className="brand-name">
                Selina
              </p>
              <p variant="h6" className="brand-tagline">
                Thương hiệu thời trang mắt kính
              </p>
              <img
                src={glass_nobg}
                alt="Featured glasses"
                className="featured-glasses"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Filter Section */}
      <Container maxWidth="lg">
        <Box className="filter-section">
          <Button
            className={`filter-button ${
              activeFilter === "all" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("all")}
          >
            Tất cả
          </Button>
          <Button
            className={`filter-button ${
              activeFilter === "frame" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("frame")}
          >
            <span className="filter-icon">👓</span> Kiểu gọng
          </Button>
          <Button
            className={`filter-button ${
              activeFilter === "gender" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("gender")}
          >
            <span className="filter-icon">👫</span> Giới tính
          </Button>
          <Button
            className={`filter-button ${
              activeFilter === "price" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("price")}
          >
            <span className="filter-icon">💰</span> Mức giá
          </Button>
          <Button
            className={`filter-button ${
              activeFilter === "age" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("age")}
          >
            <span className="filter-icon">👴</span> Độ tuổi
          </Button>
        </Box>
      </Container>

      {/* Best Sellers Section */}
      <Box className="products-section">
        {productsList.length > 0 ? (
          <ProductList title="BÁN CHẠY NHẤT" products={productsList} />
        ) : (
          <ProductList title="BÁN CHẠY NHẤT" products={newArrivalsProducts} />
        )}
      </Box>

      {/* New Arrivals Section */}
      <Box className="products-section">
        {productsList.length > 0 && (
          <ProductList title="SẢN PHẨM MỚI" products={productsList} />
        )}
      </Box>
    </div>
  );
};

export default HomePage;
