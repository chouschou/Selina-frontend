import React, { useRef } from "react";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { Button, IconButton, Grid, Box, Typography } from "@mui/material";
import { toast } from "react-toastify";

const ImageUploader = ({
  images = [],
  onChange,
  error,
  helperText,
  maxImages = 6,
}) => {
  // const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter((file) =>
      ["image/png", "image/jpeg", "image/jpg"].includes(file.type)
    );

    const invalidFiles = files.filter(
      (file) => !["image/png", "image/jpeg", "image/jpg"].includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error("Chỉ cho phép chọn file ảnh.");
    }

    const newImageObjects = validImages.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updated = [...images, ...newImageObjects].slice(0, maxImages);
    onChange?.(updated);
  };

  const removeImage = (index) => {
    const updated = [...images];
    const image = updated[index];

    // Chỉ revoke nếu là object có preview
    if (typeof image === "object" && image.preview) {
      URL.revokeObjectURL(image.preview);
    }

    updated.splice(index, 1);
    onChange?.(updated);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Thêm hình ảnh <span style={{ color: "red" }}>*</span>
      </Typography>

      <Grid
        container
        spacing={2}
        style={{
          // border: error ? "1px solid red" : "none",
          // borderRadius: "8px",
          padding: "4px",
        }}
      >
        {images.map((image, index) => (
          <Grid item xs={6} sm={4} md={2} key={index} className="relative">
            <Box position="relative">
              <img
                src={typeof image === "string" ? image : image.preview}
                alt={`Product ${index + 1}`}
                style={{
                  width: "230px",
                  height: "130px",
                  objectFit: "fit",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />

              <IconButton
                onClick={() => removeImage(index)}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "red",
                  color: "white",
                  padding: "4px",
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        ))}

        {images.length < maxImages && (
          <Grid item xs={6} sm={4} md={2}>
            <Button
              onClick={openFileDialog}
              variant="outlined"
              color="primary"
              fullWidth
              style={{
                borderStyle: "dashed",
                textAlign: "center",
                padding: "46px 70px",
                borderRadius: "8px",
              }}
            >
              <AddIcon fontSize="large" />
              <Typography
                variant="caption"
                color="textSecondary"
                style={{ marginTop: "8px" }}
                required
              >
                Thêm ảnh
              </Typography>
            </Button>
          </Grid>
        )}
      </Grid>

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 1 }}>
          {helperText}
        </Typography>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        multiple
        // className="hidden"
        style={{ display: "none" }}
      />

      {images.length === 0 && (
        <Box mt={2} display="flex" alignItems="center" color="textSecondary">
          <ImageIcon fontSize="small" style={{ marginRight: "4px" }} />
          <Typography variant="body2">
            Tối đa 6 ảnh, định dạng .jpg, .png
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default ImageUploader;
