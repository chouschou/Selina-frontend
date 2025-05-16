import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
// import { Camera, CheckCircle } from 'lucide-react';
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useGlasses } from "./GlassesContext";

const RecommendationPage = () => {
  const navigate = useNavigate();
  const { resetSelections } = useGlasses();

  //   React.useEffect(() => {
  //     resetSelections();
  //   }, [resetSelections]);

  React.useEffect(() => {
    resetSelections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chạy 1 lần sau mount, không gây lặp render

  const handleCameraOption = () => {
    navigate("/camera-detection");
  };

  const handleQuizOption = () => {
    navigate("/quiz");
  };

  return (
    <Box
      sx={{
        py: 12,
        bgcolor: "grey.50",
        minHeight: "calc(100vh - 64px)",
        paddingTop: "100px",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Gợi ý mẫu kính phù hợp với bạn
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ maxWidth: "600px", mx: "auto" }}
          >
            Chúng tôi sẽ giúp bạn tìm ra mẫu kính hoàn hảo dựa trên hình dáng
            khuôn mặt.<br/> Hãy chọn một trong hai phương thức
            dưới đây để bắt đầu.
          </Typography>
        </Box>

        <Grid container spacing={6} sx={{ justifyContent: "center" }}>
          {/* Camera Card */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                height: "100%",
                maxWidth: "500px",
                cursor: "pointer",
                transition: "all 0.3s",
                border: "1px solid #e0e0e0",
                "&:hover": { boxShadow: 6 },
              }}
              onClick={handleCameraOption}
            >
              <Box
                sx={{
                  position: "relative",
                  pb: "60%",
                  backgroundColor: "white",
                }}
              >
                <img
                  src="https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg"
                  alt="Camera detection"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.6,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CameraAltIcon sx={{"fontSize": "64px", "color": "white"}} />
                </Box>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", mb: 2, color: "primary.dark" }}
                >
                  Nhận diện qua camera
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 3, color: "text.secondary" }}
                >
                  Hệ thống AI sẽ phân tích hình dáng khuôn mặt của bạn thông qua
                  camera và đưa ra gợi ý kính phù hợp nhất.
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {[
                    "Phân tích chính xác hình dáng khuôn mặt",
                    "Kết quả nhanh chóng trong vài giây",
                    "Công nghệ nhận diện tiên tiến",
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "flex-start" }}
                    >
                      <CheckCircleIcon
                        size={16}
                        color="#66BB6A"
                        style={{ marginRight: 8, alignContent: "center", color: "green" }}
                      />
                      <Typography variant="body2">{item}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<CameraAltIcon size={120} />}
                  sx={{ mt: 4, color: "white" }}
                >
                  Bắt đầu với camera
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Quiz Card */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                height: "100%",
                maxWidth: "500px",
                cursor: "pointer",
                transition: "all 0.3s",
                border: "1px solid #e0e0e0",
                "&:hover": { boxShadow: 6 },
              }}
              onClick={handleQuizOption}
            >
              <Box
                sx={{
                  position: "relative",
                  pb: "60%",
                  backgroundColor: "white",
                }}
              >
                <img
                  src="https://images.pexels.com/photos/5699826/pexels-photo-5699826.jpeg"
                  alt="Quiz selection"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.6,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
                  </svg>
                </Box>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", mb: 2, color: "secondary.dark" }}
                >
                  Trả lời trắc nghiệm
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 3, color: "text.secondary" }}
                >
                  Trả lời các câu hỏi đơn giản về giới tính và hình dáng khuôn
                  mặt để nhận gợi ý về mẫu kính phù hợp.
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {[
                    "Dễ dàng và nhanh chóng",
                    "Không cần sử dụng camera",
                    "Kết quả chính xác dựa trên thông tin bạn cung cấp",
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "flex-start" }}
                    >
                       <CheckCircleIcon
                        size={16}
                        color="#66BB6A"
                        style={{ marginRight: 8, alignContent: "center", color: "green" }}
                      />
                      <Typography variant="body2">{item}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  sx={{ mt: 4 }}
                >
                  Bắt đầu trả lời câu hỏi
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RecommendationPage;
