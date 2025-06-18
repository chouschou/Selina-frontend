import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Drawer,
  IconButton,
  Badge,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  FilterList,
  Search,
  ViewModule,
  ViewList,
  Sort,
  Close,
  Tune,
} from "@mui/icons-material";
import "./Homepage.scss";
import ProductItem from "../../components/ProductItem";
import { COLOR_MAP, shapeDictionary } from "../../services/formatToShow";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { getProductsByCategory } from "../../services/product/getProductsByCategory";
import ProductList from "../../components/ProductList";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    shape: [],
    frameType: "all",
    gender: "all",
    priceRange: "all",
    material: "all",
    color: [],
  });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [priceSlider, setPriceSlider] = useState([0, 2000000]);
  const [expandedPanel, setExpandedPanel] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get("type") || "optical"; // default là gọng kính
//   const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductsByCategory(
          type === "optical" ? "Gọng kính" : "Kính mát"
        );
        setProducts(response); // Nếu API trả về mảng sản phẩm
        setFilteredProducts(response);
        console.log("Products List:", response);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, [type]);

  // Filter products based on current filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.Category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.Material.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.Shape.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // // Category filter
    // if (filters.category !== "all") {
    //   filtered = filtered.filter(
    //     (product) => product.Category === filters.category
    //   );
    // }

    // Shape filter
    if (filters.shape.length > 0) {
      filtered = filtered.filter((product) =>
        filters.shape.includes(product.Shape.toLowerCase())
      );
    }

    // Gender filter
    if (filters.gender !== "all") {
      filtered = filtered.filter((product) =>
        product.Age.includes(filters.gender)
      );
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      filtered = filtered.filter((product) => {
        const price =
          (product.GlassColors[0].Price *
            (100 - product.GlassColors[0].Discount)) /
          100;
        switch (filters.priceRange) {
          case "under200k":
            return price < 200000;
          case "200k-500k":
            return price >= 200000 && price <= 500000;
          case "500k-1m":
            return price >= 500000 && price <= 1000000;
          case "over1m":
            return price > 1000000;
          default:
            return true;
        }
      });
    }

    // Material filter
    if (filters.material !== "all") {
      filtered = filtered.filter(
        (product) => product.Material === filters.material
      );
    }

    // Color filter
    if (filters.color.length > 0) {
      filtered = filtered.filter((product) => {
        const colorList = product.GlassColors.map((g) => g.Color);
        const hasMatch = colorList.some((c) => filters.color.includes(c));
        return hasMatch;
      });
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const priceA =
            (a.GlassColors[0].Price * (100 - a.GlassColors[0].Discount)) / 100;
          const priceB =
            (b.GlassColors[0].Price * (100 - b.GlassColors[0].Discount)) / 100;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const priceA =
            (a.GlassColors[0].Price * (100 - a.GlassColors[0].Discount)) / 100;
          const priceB =
            (b.GlassColors[0].Price * (100 - b.GlassColors[0].Discount)) / 100;
          return priceB - priceA;
        });
        break;
      case "discount":
        filtered.sort(
          (a, b) => b.GlassColors[0].Discount - a.GlassColors[0].Discount
        );
        break;
      default:
        // newest - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, filters, sortBy, searchQuery]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const handleShapeFilterChange = (value) => {
    if (value === "all") {
      setFilters((prev) => ({ ...prev, shape: [] }));
    } else {
      setFilters((prev) => {
        const current = prev.shape;
        const newShape = current.includes(value)
          ? current.filter((s) => s !== value)
          : [...current, value];
        return { ...prev, shape: newShape };
      });
    }
  };
  const handleRemoveItemFromFilter = (key, item) => {
    setFilters((prev) => {
      const newArr = prev[key].filter((v) => v !== item);
      return { ...prev, [key]: newArr };
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => {
      if (field === "color") {
        // Toggle multi-select
        const isSelected = prev.color.includes(value);
        return {
          ...prev,
          color: isSelected
            ? prev.color.filter((v) => v !== value)
            : [...prev.color, value],
        };
      }

      // Xử lý cho các loại filter khác
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      shape: [],
      frameType: "all",
      gender: "all",
      priceRange: "all",
      material: "all",
      color: [],
    });
    setSearchQuery("");
  };

  const getActiveFilterCount = () => {
    let count = 0;

    // shape (mảng)
    if (filters.shape.length > 0) count++;

    // // color (mảng)
    if (filters.color.length > 0) count++;

    // frameType, gender, priceRange, material (string 'all' hoặc giá trị)
    ["frameType", "gender", "priceRange", "material"].forEach((key) => {
      if (filters[key] !== "all") count++;
    });

    // searchQuery
    if (searchQuery) count++;

    return count;
  };

  const FilterSection = () => (
    <Box className="filter-section">
      <Box className="filter-header">
        <Typography variant="h6" className="filter-title">
          <Tune /> Bộ lọc
        </Typography>
        {getActiveFilterCount() > 0 && (
          <Button
            size="small"
            onClick={clearAllFilters}
            className="clear-filters-btn"
          >
            Xóa tất cả ({getActiveFilterCount()})
          </Button>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* SHAPE */}
      <Accordion
        expanded={expandedPanel === "shape"}
        onChange={handleAccordionChange("shape")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Hình dáng</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {[
              { value: "all", label: "Tất cả" },
              ...Object.entries(shapeDictionary).map(([key, label]) => ({
                value: key,
                label,
              })),
            ].map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={
                      option.value === "all"
                        ? filters.shape.length === 0
                        : filters.shape.includes(option.value)
                    }
                    onChange={() => handleShapeFilterChange(option.value)}
                    sx={{
                      color: "#5cba9a",
                      "&.Mui-checked": { color: "#5cba9a" },
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* GENDER */}
      <Accordion
        expanded={expandedPanel === "gender"}
        onChange={handleAccordionChange("gender")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Giới tính</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {["Tất cả", "Nam", "Nữ", "Trẻ em"].map((value) => (
              <FormControlLabel
                key={value}
                control={
                  <Checkbox
                    checked={filters.gender === value}
                    onChange={() => handleFilterChange("gender", value)}
                    sx={{
                      color: "#5cba9a",
                      "&.Mui-checked": { color: "#5cba9a" },
                    }}
                  />
                }
                label={value === "all" ? "Tất cả" : value}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* PRICE RANGE */}
      <Accordion
        expanded={expandedPanel === "priceRange"}
        onChange={handleAccordionChange("priceRange")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Mức giá</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {[
              { value: "all", label: "Tất cả" },
              { value: "under200k", label: "Dưới 200k" },
              { value: "200k-500k", label: "200k - 500k" },
              { value: "500k-1m", label: "500k - 1tr" },
              { value: "over1m", label: "Trên 1tr" },
            ].map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={filters.priceRange === option.value}
                    onChange={() =>
                      handleFilterChange("priceRange", option.value)
                    }
                    sx={{
                      color: "#5cba9a",
                      "&.Mui-checked": { color: "#5cba9a" },
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* MATERIAL */}
      <Accordion
        expanded={expandedPanel === "material"}
        onChange={handleAccordionChange("material")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Chất liệu</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {["all", "Nhựa", "Kim loại", "Titanium"].map((value) => (
              <FormControlLabel
                key={value}
                control={
                  <Checkbox
                    checked={filters.material === value}
                    onChange={() => handleFilterChange("material", value)}
                    sx={{
                      color: "#5cba9a",
                      "&.Mui-checked": { color: "#5cba9a" },
                    }}
                  />
                }
                label={value === "all" ? "Tất cả" : value}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* COLOR */}
      <Accordion
        expanded={expandedPanel === "color"}
        onChange={handleAccordionChange("color")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Màu sắc</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {COLOR_MAP.map((color) => (
              <FormControlLabel
                key={color.hex}
                control={
                  <Checkbox
                    checked={filters.color.includes(color.hex)}
                    onChange={() => handleFilterChange("color", color.hex)}
                    sx={{
                      color:
                        color.hex !== "Khác" && color.hex !== "#FFFFFF"
                          ? color.hex
                          : "#999",
                      "&.Mui-checked": {
                        color:
                          color.hex !== "Khác" && color.hex !== "#FFFFFF"
                            ? color.hex
                            : "#999",
                      },
                    }}
                  />
                }
                label={color.name}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  return (
    <Box className="homepage">
      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Box className="hero-content">
            <Typography variant="h2" className="hero-title">
              Khám phá bộ sưu tập kính thời trang
            </Typography>
            <Typography variant="h6" className="hero-subtitle">
              Tìm kiếm phong cách hoàn hảo cho bạn với hàng nghìn mẫu kính đa dạng
            </Typography>
            <Box className="hero-search">
              <TextField
                fullWidth
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                className="search-input"
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" className="main-content">
        {/* Toolbar */}
        <Box className="toolbar">
          <Box className="toolbar-left">
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setMobileFilterOpen(true)}
              className="mobile-filter-btn"
            >
              <Badge badgeContent={getActiveFilterCount()} color="primary">
                Bộ lọc
              </Badge>
            </Button>

            <Typography variant="body1" className="results-count">
              {filteredProducts.length} sản phẩm
            </Typography>
          </Box>

          <Box className="toolbar-right">
            <FormControl
              //   fullWidth
              variant="outlined"
              size="small"
              className="sort-select"
            >
              <InputLabel>Sắp xếp</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<Sort />}
              >
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="price-low">Giá thấp đến cao</MenuItem>
                <MenuItem value="price-high">Giá cao đến thấp</MenuItem>
                <MenuItem value="discount">Giảm giá nhiều nhất</MenuItem>
              </Select>
            </FormControl>

            <Box className="view-toggle">
              <IconButton
                // onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "active" : ""}
              >
                <ViewModule />
              </IconButton>
              {/* <IconButton
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "active" : ""}
              >
                <ViewList />
              </IconButton> */}
            </Box>
          </Box>
        </Box>

        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <Box className="active-filters">
            <Typography variant="body2" className="active-filters-label">
              Bộ lọc đang áp dụng:
            </Typography>
            <Box className="filter-chips">
              {searchQuery && (
                <Chip
                  label={`Tìm kiếm: "${searchQuery}"`}
                  onDelete={() => setSearchQuery("")}
                  className="filter-chip"
                />
              )}

              {/* Chip cho từng filter */}
              {Object.entries(filters).map(([key, value]) => {
                const labels = {
                  shape: "Hình dáng",
                  gender: "Giới tính",
                  priceRange: "Mức giá",
                  material: "Chất liệu",
                  color: "Màu sắc",
                  frameType: "Loại gọng",
                };

                // Bỏ qua nếu value là 'all' hoặc mảng rỗng
                if (
                  value === "all" ||
                  (Array.isArray(value) && value.length === 0)
                ) {
                  return null;
                }

                // Nếu là mảng (shape, color), tạo nhiều chip
                if (Array.isArray(value)) {
                  return value.map((item) => (
                    <Chip
                      key={`${key}-${item}`}
                      label={`${labels[key]}: ${
                        key === "shape"
                          ? shapeDictionary[item] || item
                          : key === "color"
                          ? COLOR_MAP.find((c) => c.hex === item)?.name || item
                          : item
                      }`}
                      onDelete={() => handleRemoveItemFromFilter(key, item)}
                      className="filter-chip"
                    />
                  ));
                }

                // Với các filter khác
                return (
                  <Chip
                    key={key}
                    label={`${labels[key]}: ${value}`}
                    onDelete={() => handleFilterChange(key, "all")}
                    className="filter-chip"
                  />
                );
              })}
            </Box>
          </Box>
        )}

        {/* Main Content */}
        <Box className="content-wrapper">
          {/* Desktop Filters */}
          <Paper className="desktop-filters">
            <FilterSection />
          </Paper>

          {/* Products Grid */}
          <Box className="products-section">
            {filteredProducts.length === 0 ? (
              <Box className="no-products">
                <Typography variant="h6">
                  Không tìm thấy sản phẩm nào
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </Typography>
                <Button onClick={clearAllFilters} className="clear-filters-btn">
                  Xóa tất cả bộ lọc
                </Button>
              </Box>
            ) : (
              //   <Grid
              //     container
              //     spacing={3}
              //     className={`products-grid ${viewMode}`}
              //   >
              //     {filteredProducts.map((product) => (
              //       <Grid
              //         item
              //         xs={12}
              //         sm={viewMode === "grid" ? 6 : 12}
              //         md={viewMode === "grid" ? 4 : 12}
              //         lg={viewMode === "grid" ? 3 : 12}
              //         key={product.ID}
              //       >
              //         <ProductItem
              //           product={product}
              //           onClick={() =>
              //             console.log("Product clicked:", product.ID)
              //           }
              //         />
              //       </Grid>
              //     ))}
              //   </Grid>
              <Box className="products-section">
                {products.length > 0 && (
                  <ProductList title="" products={filteredProducts} numberProductPerPage={3}/>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="left"
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          className="mobile-filter-drawer"
        >
          <Box className="mobile-filter-content">
            <Box className="mobile-filter-header">
              <Typography variant="h6">Bộ lọc</Typography>
              <IconButton onClick={() => setMobileFilterOpen(false)}>
                <Close />
              </IconButton>
            </Box>
            <FilterSection />
            <Box className="mobile-filter-actions">
              <Button
                fullWidth
                variant="contained"
                onClick={() => setMobileFilterOpen(false)}
                className="apply-filters-btn"
              >
                Áp dụng bộ lọc
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};

export default Homepage;
