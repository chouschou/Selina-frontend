import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import Webcam from "react-webcam";
// import { Camera, RefreshCw, XCircle } from 'lucide-react';
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useGlasses } from "./GlassesContext";
import { getProductsByShapes } from "../../services/product/getByShapes.js";
import { predictFaceAndGender } from "../../services/predictFaceAndGender.js";

// Mock face detection
// const detectFaceShape = async () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const shapes = [
//         "round",
//         "oval",
//         "heart",
//         "square",
//         "triangle",
//         "diamond",
//       ];
//       const genders = ["male", "female"];
//       resolve({
//         gender: genders[Math.floor(Math.random() * genders.length)],
//         faceShape: shapes[Math.floor(Math.random() * shapes.length)],
//       });
//     }, 2000);
//   });
// };

const CameraDetection = () => {
  const webcamRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState(null);
  const [shapeFace, setShapeFace] = useState(null);
  const navigate = useNavigate();

  const recommendationFemaleMap = {
    round: ["Square", "Rectangle", "Wayfarers", "Trapezoid"],
    oval: ["Most styles", "Square", "Round", "Aviator"],
    heart: ["Cat-eye", "Oval", "Lightweight", "Aviator"],
    square: ["Round", "Oval", "Rimless", "Semi-rimless"],
    oblong: ["Square", "Round", "Rectangle", "Oval"],
  };
  const recommendationMaleMap = {
    round: ["Square", "Rectangle", "Wayfarers", "Trapezoid"],
    ovale: ["Most styles", "Square", "Round", "Aviator"],
    square: ["Round", "Oval", "Rimless", "Semi-rimless"],
    rectangular: ["Square", "Round", "Rectangle", "Oval"],
  };
  const {
    gender,
    setGender,
    setFaceShape,
    isLoading,
    setIsLoading,
    setError: setContextError,
    setRecommendations,
  } = useGlasses();

  const handleCameraError = useCallback(() => {
    setError(
      "Không thể truy cập camera. Vui lòng cấp quyền truy cập hoặc thử lại."
    );
  }, []);

  const handleCameraReady = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  //   const captureImage = useCallback(() => {
  //     if (webcamRef.current) {
  //       setIsCapturing(true);
  //       const imageSrc = webcamRef.current.getScreenshot();
  //       if (imageSrc) {
  //         setCapturedImage(imageSrc);
  //       } else {
  //         setError("Không thể chụp ảnh. Vui lòng thử lại.");
  //       }
  //       setIsCapturing(false);
  //     }
  //   }, []);

  //   const captureImage = useCallback(() => {
  //     if (webcamRef.current) {
  //       setIsCapturing(true);
  //       const imageSrc = webcamRef.current.getScreenshot();
  //       if (imageSrc) {
  //         setCapturedImage(imageSrc);

  //         // Tạo một thẻ <a> để tải ảnh về
  //         const link = document.createElement("a");
  //         link.href = imageSrc;
  //         link.download = `captured-image-${Date.now()}.png`;
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //       } else {
  //         setError("Không thể chụp ảnh. Vui lòng thử lại.");
  //       }
  //       setIsCapturing(false);
  //     }
  //   }, []);

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const sendImageToNest = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    // const response = await fetch("http://localhost:3000/ai/predict", {
    //   method: "POST",
    //   body: formData,
    // });
    const response = await predictFaceAndGender(formData);

    // const result = await response.json();
    const result = await response;
    console.log("Kết quả từ AI:", result);
    setShapeFace(result.prediction.toLowerCase());
    setFaceShape(result.prediction.toLowerCase());
    setGender(result.gender);
    console.log("shapeFace:", result.prediction.toLowerCase());
  };

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      setIsCapturing(true);
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);

        // // Tải ảnh về
        // const link = document.createElement("a");
        // link.href = imageSrc;
        // link.download = `captured-image-${Date.now()}.png`;
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);

        // Gửi đến server
        const file = dataURLtoFile(imageSrc, `image-${Date.now()}.png`);
        sendImageToNest(file);
      } else {
        setError("Không thể chụp ảnh. Vui lòng thử lại.");
      }
      setIsCapturing(false);
    }
  }, []);

  //chụp lại
  const retakeImage = () => {
    setCapturedImage(null);
    setError(null);
  };

  const processImage = useCallback(async () => {
    if (!capturedImage) return;

    setIsLoading(true);
    setError(null);
    setContextError(null);

    try {
      //   const { faceShape } = await detectFaceShape(capturedImage);
      //   setGender(gender);
      //   setGender("Nữ");
      //   setFaceShape(faceShape);

      //   const filteredGlasses = mockGlassesData.filter(
      //     (glass) =>
      //       glass.recommendedFor.includes(gender) &&
      //       glass.recommendedFor.includes("Nữ") &&
      //       glass.recommendedFaceShapes.includes(faceShape)
      //   );

      //   setRecommendations(filteredGlasses);
      //   navigate("/results");

        console.log("vô nè");
      if (shapeFace) {
        console.log("shapeFace", shapeFace);
        const recommendedShapes = gender==='female' ? recommendationFemaleMap[shapeFace]: recommendationMaleMap[shapeFace];
        console.log("recommendedShapes", recommendedShapes);
        if (recommendedShapes) {
          const filteredGlasses = await getProductsByShapes(recommendedShapes);
          console.log("filteredGlasses", filteredGlasses);

          setRecommendations(filteredGlasses);
          navigate("/results");
        }
      }
      else{
        console.log("shapeFace", shapeFace);
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi xử lý hình ảnh. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [
    capturedImage,
    setGender,
    setFaceShape,
    // navigate,
    setIsLoading,
    setContextError,
    setRecommendations,
    shapeFace
  ]);

  useEffect(() => {
    if (capturedImage && !isCapturing) {
      processImage();
      console.log("có vô:--")
    }
  }, [capturedImage, isCapturing, processImage]);

  const webcamConstraints = {
    width: 720,
    height: 720,
    facingMode: "user",
  };

  return (
    <Box
      sx={{
        py: 6,
        bgcolor: "grey.100",
        minHeight: "calc(100vh - 64px)",
        paddingTop: "100px",
        position: "relative", // để định vị nút "Quay lại"
      }}
    >
      <Container maxWidth="md">
        {/* Nút quay lại cố định lệch trái */}
        <Box sx={{ position: "absolute", top: 100, left: 24 }}>
          <Button
            startIcon={<ArrowBackIcon size={20} />}
            onClick={() => navigate("/recommendation")}
            variant="text"
            color="inherit"
          >
            Quay lại
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Nhận diện khuôn mặt
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Vui lòng đảm bảo khuôn mặt của bạn nằm trong khung hình và được
            chiếu sáng tốt để có kết quả chính xác nhất.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Box chính vẫn giữ nguyên căn giữa */}
        <Box
          sx={{
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 1,
            border: "1px solid",
            borderColor: "grey.200",
            maxWidth: 400,
            mx: "auto",
          }}
        >
          <Box sx={{ position: "relative" }}>
            {!capturedImage ? (
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 2,
                  bgcolor: !isCameraReady ? "grey.100" : "transparent",
                  minHeight: !isCameraReady ? 400 : "auto",
                  display: !isCameraReady ? "flex" : "block",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!isCameraReady && !error && <CircularProgress size={40} />}

                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={webcamConstraints}
                  onUserMedia={handleCameraReady}
                  onUserMediaError={handleCameraError}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    opacity: isCameraReady ? 1 : 0,
                    transform: "scaleX(-1)", // Lật ảnh
                  }}
                />

                {isCameraReady && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      border: "4px dashed",
                      borderColor: "secondary.main",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "75%",
                        height: "75%",
                        border: "4px solid white",
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 2,
                }}
              >
                <img
                  src={capturedImage}
                  alt="Captured"
                  style={{ width: "100%", borderRadius: 8 }}
                />
                {isLoading && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      bgcolor: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ textAlign: "center", color: "white" }}>
                      <CircularProgress color="secondary" sx={{ mb: 2 }} />
                      <Typography variant="body1">
                        Đang phân tích khuôn mặt...
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}
          >
            {!capturedImage ? (
              <Button
                variant="contained"
                color="secondary"
                disabled={!isCameraReady || isCapturing}
                onClick={captureImage}
                startIcon={<PhotoCameraIcon size={20} />}
                size="large"
              >
                {isCapturing ? "Đang chụp..." : "Chụp ảnh"}
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={retakeImage}
                  startIcon={<RefreshIcon size={20} />}
                  disabled={isLoading}
                >
                  Chụp lại
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={processImage}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Phân tích hình ảnh"}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CameraDetection;
