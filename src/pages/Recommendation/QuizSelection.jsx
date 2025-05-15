import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useGlasses } from "./GlassesContext";
import { getProductsByShapes } from "../../services/product/getByShapes";
import { toast } from "react-toastify";

const steps = ["Giới tính", "Hình dáng khuôn mặt"];

const QuizSelection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedFaceShape, setSelectedFaceShape] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { setGender, setFaceShape, setRecommendations } = useGlasses();

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const recommendationMap = {
    round: ["Square", "Rectangle", "Wayfarers", "Trapezoid"],
    oval: ["Most styles", "Square", "Round", "Aviator"],
    heart: ["Cat-eye", "Oval", "Lightweight", "Aviator"],
    square: ["Round", "Oval", "Rimless", "Semi-rimless"],
    oblong: ["Square", "Round", "Rectangle", "Oval"],
  };
  // const recommendationMap = {
  //   round: ['Vuông', 'Chữ nhật', 'Wayfarers', 'Hình thang'],
  //   oval: ['Hầu hết các kiểu', 'Vuông', 'Tròn', 'Aviator'],
  //   heart: ['Cat-eye', 'Oval', 'Nhẹ', 'Aviator'],
  //   square: ['Tròn', 'Oval', 'Không viền', 'Semi-rimless'],
  //   oblong: ['Vuông', 'Tròn', 'Hình chữ nhật', 'Bầu dục'],
  // };

  const handleSubmit = async () => {
    if (selectedGender && selectedFaceShape) {
      setIsSubmitting(true);
      setGender(selectedGender);
      setFaceShape(selectedFaceShape);

      await new Promise((res) => setTimeout(res, 1000));

      // const filteredGlasses = mockGlassesData.filter((glass) => {
      //   const isGenderMatch = glass.recommendedFor.includes(selectedGender);
      //   const isShapeMatch =
      //     glass.recommendedFaceShapes.includes(selectedFaceShape);
      //   return isGenderMatch && isShapeMatch;
      // });

      try {
        const recommendedShapes = recommendationMap[selectedFaceShape];

        const filteredGlasses = await getProductsByShapes(recommendedShapes);

        setRecommendations(filteredGlasses);
        navigate("/results");
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kính:", error);
        toast.error("Có lỗi xảy ra khi lấy danh sách kính. Vui lòng thử lại sau.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const faceShapesMale = [
    {
      value: "round",
      label: "Hình tròn",
      image:
        "https://i.pinimg.com/736x/3b/95/5e/3b955e525b50e4841c3c9b23b80047a1.jpg",
    },
    {
      value: "ovale",
      label: "Hình oval",
      image:
        "https://cdn.images.express.co.uk/img/dynamic/79/590x/secondary/Sean-Fletcher-children-Sean-Fletcher-2643125.jpg?r=1598853853408",
    },
    {
      value: "rectangle",
      label: "Hình chữ nhật",
      image:
        "https://i.pinimg.com/736x/67/be/55/67be55f51c186fb19e74253366150f93.jpg",
    },
    {
      value: "square",
      label: "Hình vuông",
      image:
        "https://i.pinimg.com/736x/87/f3/20/87f320ca6155773732434910e68e2a6c.jpg",
    },
  ];
  const faceShapesFemale = [
    {
      value: "round",
      label: "Hình tròn",
      image:
        "https://i.pinimg.com/736x/73/ab/69/73ab69cd117234ede2654664b6fe5ee4.jpg",
    },
    {
      value: "oval",
      label: "Hình oval",
      image:
        "https://i.pinimg.com/736x/30/ac/73/30ac73419936175a193c656e700cc359.jpg",
    },
    {
      value: "heart",
      label: "Hình trái tim",
      image:
        "https://i.pinimg.com/736x/17/f3/58/17f3589cb7ae83f4a5cc0144875437e5.jpg",
    },
    {
      value: "square",
      label: "Hình vuông",
      image:
        "https://i.pinimg.com/736x/6e/48/7d/6e487d58bf9424a903091c7df9daea83.jpg",
    },
    {
      value: "oblong",
      label: "Hình chữ nhật dài",
      image:
        "https://i.pinimg.com/736x/49/98/96/499896c7f29e33c5ba55800bfad5a641.jpg",
    },
  ];
  const faceShapes =
    selectedGender === "male" ? faceShapesMale : faceShapesFemale;

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography
              variant="h4"
              sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}
            >
              Giới tính của bạn là?
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <FormControl>
                <RadioGroup
                  row
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                >
                  {["male", "female"].map((gender) => (
                    <Box
                      key={gender}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mx: 2,
                      }}
                    >
                      <Paper
                        elevation={0}
                        onClick={() => setSelectedGender(gender)}
                        sx={{
                          p: 2,
                          mb: 2,
                          border: "2px solid",
                          borderColor:
                            selectedGender === gender
                              ? "primary.main"
                              : "grey.300",
                          borderRadius: 2,
                          cursor: "pointer",
                          transition: "0.3s",
                          boxShadow:
                            selectedGender === gender
                              ? 3
                              : "0 0 0 0 transparent",
                          outline:
                            selectedGender === gender
                              ? "2px solid rgba(25, 118, 210, 0.2)"
                              : "none",
                        }}
                      >
                        <Box
                          component="img"
                          src={
                            gender === "male"
                              ? "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg"
                              : "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg"
                          }
                          alt={gender}
                          sx={{
                            width: 192,
                            height: 192,
                            objectFit: "cover",
                            borderRadius: "0.5rem",
                          }}
                        />
                      </Paper>

                      <FormControlLabel
                        value={gender}
                        control={<Radio color="primary" />}
                        label={gender === "male" ? "Nam" : "Nữ"}
                      />
                    </Box>
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Chọn hình dáng khuôn mặt
            </Typography>

            <FormControl fullWidth>
              <RadioGroup
                value={selectedFaceShape}
                onChange={(e) => setSelectedFaceShape(e.target.value)}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(3, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {faceShapes.map((shape) => (
                    <Box
                      key={shape.value}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Paper
                        elevation={0}
                        onClick={() => setSelectedFaceShape(shape.value)}
                        sx={{
                          p: 2,
                          border: "2px solid",
                          borderColor:
                            selectedFaceShape === shape.value
                              ? "primary.main"
                              : "grey.300",
                          borderRadius: 2,
                          cursor: "pointer",
                          transition: "0.3s",
                          outline:
                            selectedFaceShape === shape.value
                              ? "2px solid rgba(25, 118, 210, 0.2)"
                              : "none",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            aspectRatio: "1",
                            overflow: "hidden",
                            borderRadius: 2,
                            backgroundColor: "grey.100",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                          }}
                        >
                          <Box
                            component="img"
                            src={shape.image}
                            alt={shape.label}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>

                        <FormControlLabel
                          value={shape.value}
                          control={<Radio color="primary" />}
                          label={shape.label}
                          sx={{ mt: 1 }}
                        />
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        py: 12,
        backgroundColor: "grey.50",
        minHeight: "calc(100vh - 64px)",
        paddingTop: "120px",
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "grey.200",
            borderRadius: 3,
          }}
        >
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              onClick={
                activeStep === 0
                  ? () => navigate("/recommendation")
                  : handleBack
              }
              startIcon={<ChevronLeftIcon />}
            >
              {activeStep === 0 ? "Quay lại" : "Trước đó"}
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                fontColor="white"
                onClick={handleSubmit}
                disabled={!selectedFaceShape || isSubmitting}
                endIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
              >
                {isSubmitting ? "Đang xử lý..." : "Hoàn tất"}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                fontColor="white"
                onClick={handleNext}
                disabled={!selectedGender}
                endIcon={<ChevronRightIcon />}
              >
                Tiếp theo
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default QuizSelection;
