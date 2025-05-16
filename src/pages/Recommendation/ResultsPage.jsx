import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  ButtonGroup,
} from "@mui/material";
// import { ArrowLeft, Redo, ShoppingCart } from 'lucide-react';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useGlasses } from "./GlassesContext";
import ProductList from "../../components/ProductList";

const getFaceShapeText = (shape) => {
  const shapeMap = {
    round: "Khuôn mặt tròn",
    oval: "Khuôn mặt oval",
    heart: "Khuôn mặt trái tim",
    square: "Khuôn mặt vuông",
    oblong: "Khuôn mặt chữ nhật dài",
  };
  return shape ? shapeMap[shape] || shape : "không xác định";
};

const getFaceShapeDescription = (shape) => {
  const descriptionMap = {
    round:
      "Khuôn mặt tròn có đặc điểm là chiều dài và chiều rộng gần tương đương, với đường viền mềm mại và không có góc cạnh rõ ràng.",
    oval: "Khuôn mặt oval có chiều dài lớn hơn chiều rộng, với đường cong nhẹ nhàng và cân đối từ trán xuống cằm.",
    heart:
      "Khuôn mặt trái tim có trán rộng và cằm nhọn, tạo hình dáng như trái tim với phần rộng nhất ở vùng má.",
    square:
      "Khuôn mặt vuông có đặc điểm là góc hàm rõ rệt, trán rộng và chiều dài, chiều rộng khá cân đối.",
    oblong:
      "Khuôn mặt chữ nhật dài có chiều dài lớn hơn nhiều so với chiều rộng, với đường viền hai bên thẳng và góc hàm không quá rõ, tạo cảm giác thon dài.",
  };
  return shape
    ? descriptionMap[shape] || "Hình dáng khuôn mặt độc đáo"
    : "Không thể xác định hình dáng khuôn mặt";
};

const getRecommendedGlassShapes = (faceShape) => {
  const recommendationMap = {
    round: ["Vuông", "Chữ nhật", "Wayfarers", "Hình thang"],
    oval: ["Hầu hết các kiểu", "Vuông", "Tròn", "Aviator"],
    heart: ["Cat-eye", "Oval", "Nhẹ", "Aviator"],
    square: ["Tròn", "Oval", "Không viền", "Semi-rimless"],
    oblong: ["Vuông", "Tròn", "Hình chữ nhật", "Bầu dục"],
  };
  return faceShape
    ? recommendationMap[faceShape] || ["Vuông", "Tròn", "Oval"]
    : ["Vuông", "Tròn", "Oval"];
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const { gender, faceShape, recommendations, isLoading, error } = useGlasses();

  useEffect(() => {
    if (!gender && !faceShape && recommendations.length === 0 && !isLoading) {
      navigate("/recommendation");
    }
  }, [gender, faceShape, recommendations, isLoading, navigate]);

  const recommendedShapes = getRecommendedGlassShapes(faceShape);

  const [filter, setFilter] = useState("Tất cả");

  const filteredRecommendations = useMemo(() => {
    if (recommendations.length !== 0) {
      if (filter === "Tất cả") return recommendations;
      return recommendations.filter((item) => item.Category === filter);
    }
  }, [filter, recommendations]);

  return (
    <Box sx={{ py: 12, bgcolor: "grey.50", minHeight: "calc(100vh - 64px)" }}>
      <Container>
        <Box mb={12}>
          <Button
            startIcon={<ArrowBackIcon size={18} />}
            onClick={() => navigate("/recommendation")}
            variant="text"
            sx={{ mb: 2 }}
          >
            Quay lại
          </Button>

          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Gợi ý kính phù hợp cho bạn
          </Typography>

          {error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 6,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                }}
              >
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      Phân tích khuôn mặt
                    </Typography>
                    <Box mb={2}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography fontWeight="medium" mr={1}>
                          Giới tính:
                        </Typography>
                        <Chip
                          label={
                            gender === "male"
                              ? "Nam"
                              : gender === "female"
                              ? "Nữ"
                              : "Không xác định"
                          }
                          color="infor"
                          size="small"
                        />
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography fontWeight="medium" mr={1}>
                          Khuôn mặt:
                        </Typography>
                        <Chip
                          label={getFaceShapeText(faceShape)}
                          color="secondary"
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {getFaceShapeDescription(faceShape)}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RefreshIcon size={16} />}
                      onClick={() => navigate("/recommendation")}
                    >
                      Phân tích lại
                    </Button>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      Loại kính phù hợp
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Dựa trên hình dáng khuôn mặt của bạn, chúng tôi gợi ý
                      những kiểu kính sau đây sẽ phù hợp nhất:
                    </Typography>

                    <Grid container spacing={2} mb={2}>
                      {recommendedShapes.map((shape, index) => (
                        <Grid item xs={6} md={3} key={index}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              border: "1px solid",
                              borderColor: "grey.300",
                              borderRadius: 2,
                              textAlign: "center",
                            }}
                          >
                            <Typography fontWeight="medium">{shape}</Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>

                    <Typography variant="body2" color="text.secondary">
                      Các kiểu kính này sẽ tạo ra sự cân bằng tốt cho khuôn mặt
                      của bạn, làm nổi bật những nét đẹp tự nhiên nhất.
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Box mb={6}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Sản phẩm gợi ý cho bạn
                  </Typography>

                  <ButtonGroup variant="outlined" size="small">
                    <Button
                      variant={filter === "Tất cả" ? "contained" : "outlined"}
                      onClick={() => setFilter("Tất cả")}
                    >
                      Tất cả
                    </Button>
                    <Button
                      variant={
                        filter === "Gọng kính" ? "contained" : "outlined"
                      }
                      onClick={() => setFilter("Gọng kính")}
                    >
                      Gọng kính
                    </Button>
                    <Button
                      variant={filter === "Kính mát" ? "contained" : "outlined"}
                      onClick={() => setFilter("Kính mát")}
                    >
                      Kính mát
                    </Button>
                  </ButtonGroup>
                </Box>

                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Dựa trên phân tích khuôn mặt, chúng tôi đã lựa chọn những mẫu
                  kính phù hợp nhất với bạn.
                </Typography>

                {recommendations.length === 0 ? (
                  <Alert severity="info">
                    Hiện tại chúng tôi không có gợi ý nào phù hợp với khuôn mặt
                    của bạn. Vui lòng thử lại hoặc liên hệ với chúng tôi để được
                    tư vấn.
                  </Alert>
                ) : (
                  <Grid container spacing={3}>
                    {/* Filtered list logic can be added based on `filter` state */}
                    <ProductList products={filteredRecommendations} />
                  </Grid>
                )}
              </Box>

              {/* <Box textAlign="center" mt={6}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<ShoppingCartIcon size={18} />}
                  onClick={() => navigate("/products")}
                >
                  Xem tất cả sản phẩm
                </Button>
              </Box> */}
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ResultsPage;
