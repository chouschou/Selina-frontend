import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  Typography,
} from "@mui/material";
import "./AddProductModal.scss";

const ProductDetailsForm = () => {
  const [colors, setColors] = useState(["gray"]);
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("2");
  const [ageGroup, setAgeGroup] = useState("nguoiLon");

  const addColor = () => {
    setColors([...colors, ""]);
  };

  const [description, setdescription] = useState("")
  const maxCharacters = 500

  const handleDescriptionChange = (event) => {
    const newDescription = event.target.value.slice(0, maxCharacters)
    setdescription(newDescription)
    // onReviewChange(product.id, { rating, description: newdescription, images })
  }

  return (
    <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Product Name */}
      <Box className="col-span-full" sx={{ mb: 2 }}>
        <TextField label="Tên sản phẩm" required fullWidth variant="outlined" />
      </Box>

      {/* Shape */}
      <Box>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel required>Hình dáng</InputLabel>
          <Select
            label="Hình dáng"
            value={selectedShape}
            onChange={(e) => setSelectedShape(e.target.value)}
          >
            <MenuItem value="">Chọn hình dáng</MenuItem>
            <MenuItem value="hinhChuNhat">Hình chữ nhật</MenuItem>
            <MenuItem value="tron">Tròn</MenuItem>
            <MenuItem value="oval">Oval</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Material */}
      <Box>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel required>Chất liệu</InputLabel>
          <Select
            label="Chất liệu"
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            <MenuItem value="">Chọn chất liệu</MenuItem>
            <MenuItem value="nhua">Nhựa</MenuItem>
            <MenuItem value="kim-loai">Kim loại</MenuItem>
            <MenuItem value="titanium">Titanium</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Age Group */}
      <Box>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Độ tuổi <span style={{ color: "red" }}>*</span>
        </Typography>
        <RadioGroup
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          row
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            value="nguoiLon"
            control={<Radio />}
            label="Người lớn"
          />
          <FormControlLabel value="treEm" control={<Radio />} label="Trẻ em" />
        </RadioGroup>
      </Box>

      {/* Mô tả */}
      <Box className="description-section">
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Mô tả về sản phẩm <span style={{ color: "red" }}>*</span>
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Nhập mô tả sản phẩm"
          value={description}
          onChange={handleDescriptionChange}
          variant="outlined"
          className="discription-input"
        />
        <Box className="character-count">
          <Typography variant="caption">
            {description.length}/{maxCharacters}
          </Typography>
        </Box>
      </Box>

      {/* Colors */}
      <Box className="col-span-full">
        <Typography
          required
          variant="body2"
          color="textSecondary"
          gutterBottom
          sx={{ mb: 2 }}
        >
          Màu sắc <span style={{ color: "red" }}>*</span>
        </Typography>
        <Box className="space-y-3">
          {colors.map((color, index) => (
            <Box key={index} display="flex" gap={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Màu</InputLabel>
                <Select
                  value={color}
                  onChange={(e) => {
                    const newColors = [...colors];
                    newColors[index] = e.target.value;
                    setColors(newColors);
                  }}
                  label="Màu"
                >
                  <MenuItem value="gray">Gray</MenuItem>
                  <MenuItem value="black">Black</MenuItem>
                  <MenuItem value="brown">Brown</MenuItem>
                </Select>
              </FormControl>
            </Box>
          ))}
          <Button
            onClick={addColor}
            variant="text"
            color="success"
            sx={{ mb: 2 }}
            startIcon={<AddCircleOutlineIcon />}
          >
            Thêm màu
          </Button>
        </Box>
      </Box>

      {/* Quantity */}
      <Box>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel required>Số lượng</InputLabel>
          <Select
            label="Số lượng"
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(e.target.value)}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Price and Discount */}
      <Box>
        <TextField
          label="Đơn giá"
          required
          fullWidth
          variant="outlined"
          type="number"
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: <Typography variant="body2">đ</Typography>,
          }}
        />
      </Box>

      <Box>
        <TextField
          label="Giảm giá"
          fullWidth
          variant="outlined"
          type="number"
          required
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: <Typography variant="body2">đ</Typography>,
          }}
        />
      </Box>
    </Box>
  );
};

export default ProductDetailsForm;
