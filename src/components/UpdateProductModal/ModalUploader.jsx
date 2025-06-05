import React, { useState, useRef, Suspense } from "react";
import {
  UploadFile as UploadFileIcon,
  Close as CloseIcon,
  Replay as ReplayIcon,
} from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { toast } from "react-toastify";
import { ErrorBoundary } from "../ErrorBoundary";

// Component tải mô hình GLB
const GltfModel = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.2} position={[0, -1, 0]} />;
};

const ModelUploader = ({ onChange, value }) => {
  const [model, setModel] = useState(null);
  const fileInputRef = useRef(null);

  // Load model nếu có sẵn từ prop
  React.useEffect(() => {
    if (value && typeof value === "string") {
      setModel({ file: null, url: value });
    } else if (value instanceof File) {
      const modelUrl = URL.createObjectURL(value);
      setModel({ file: value, url: modelUrl });
    }
  }, [value]);

  const handleModelSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.name.toLowerCase().endsWith(".glb")) {
        toast.error("Chỉ cho phép chọn file .glb");
        return;
      }

      if (model?.url && typeof model.url !== "string") {
        URL.revokeObjectURL(model.url);
      }

      // const modelUrl = URL.createObjectURL(file);
      // setModel({ file, url: modelUrl });
      setModel(file);
      if (onChange) onChange(file); // Gửi file ra ngoài nếu có onChange
    }
  };

  const removeModel = () => {
    if (model?.url && typeof model.url !== "string") {
      URL.revokeObjectURL(model.url);
    }
    setModel(null);
    onChange(null); // xóa ở ngoài luôn
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Mô hình 3D (GLB)
        {/* <span style={{ color: 'red' }}>*</span> */}
      </Typography>

      {!model ? (
        <Box
          onClick={openFileDialog}
          sx={{
            cursor: "pointer",
            border: "2px dashed",
            borderColor: "grey.300",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 3,
            "&:hover": {
              borderColor: "success.main",
              //   backgroundColor: 'primary.primary',
            },
          }}
        >
          <UploadFileIcon sx={{ fontSize: 36, color: "text.secondary" }} />
          <Typography variant="body2" color="textSecondary" textAlign="center">
            Kéo thả hoặc nhấp để tải lên mô hình 3D
            <br />
            <span style={{ fontSize: "0.75rem" }}>(Định dạng .glb)</span>
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            position: "relative",
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Box sx={{ height: 300, backgroundColor: "grey.100" }}>
            {/* <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.7} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <Suspense fallback={null}>
                <GltfModel url={model.url} />
              </Suspense>
              <OrbitControls
                enableZoom={true}
                autoRotate={true}
                autoRotateSpeed={1}
              />
            </Canvas> */}
            <ErrorBoundary modelUrl={model.url}>
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.7} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Suspense fallback={null}>
                  <GltfModel url={model.url} />
                </Suspense>
                <OrbitControls
                  enableZoom={true}
                  autoRotate={true}
                  autoRotateSpeed={1}
                />
              </Canvas>
            </ErrorBoundary>
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 1,
            }}
          >
            <IconButton
              onClick={removeModel}
              sx={{
                backgroundColor: "error.main",
                color: "white",
                "&:hover": { backgroundColor: "error.dark" },
              }}
              title="Xóa mô hình"
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              onClick={openFileDialog}
              sx={{
                backgroundColor: "success.main",
                color: "white",
                "&:hover": { backgroundColor: "success.dark" },
              }}
              title="Đổi mô hình"
            >
              <ReplayIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              padding: 1,
              backgroundColor: "white",
              borderTop: "1px solid",
              borderColor: "grey.300",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              {model.file?.name || "Mô hình 3D"}
            </Typography>
          </Box>
        </Box>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleModelSelect}
        accept=".glb"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ModelUploader;
