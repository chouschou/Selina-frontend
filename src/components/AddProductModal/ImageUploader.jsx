import React, { useRef } from "react";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { Button, IconButton, Grid, Box, Typography } from "@mui/material";

const ImageUploader = ({ images = [], onChange }) => {
  // const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      const updated = [...images, ...newImages].slice(0, 5);
      onChange?.(updated);
    }
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

      <Grid container spacing={2}>
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

        {images.length < 5 && (
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
            Tối đa 5 ảnh, định dạng .jpg, .png
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default ImageUploader;
