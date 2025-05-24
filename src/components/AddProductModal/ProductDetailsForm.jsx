import React, { useState, useImperativeHandle, forwardRef } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModelUploader from "./ModalUploader";
import ImageUploader from "./ImageUploader";
import "./AddProductModal.scss";

const ProductDetailsForm = forwardRef((props, ref) => {
  const colorOptions = [
    { name: "Xám", hex: "#808080" },
    { name: "Đen", hex: "#000000" },
    { name: "Nâu", hex: "#A52A2A" },
    { name: "Vàng", hex: "#FFFF00" },
    { name: "Hồng", hex: "#FFC0CB" },
    { name: "Xanh dương", hex: "#0000FF" },
    { name: "Xanh lá", hex: "#008000" },
    { name: "Tím", hex: "#800080" },
    { name: "Đỏ", hex: "#FF0000" },
    { name: "Trắng", hex: "#FFFFFF" },
    { name: "Cam", hex: "#FFA500" },
    { name: "Bạc", hex: "#C0C0C0" },
  ];

  const [variations, setVariations] = useState([
    {
      color: "#FFFF00",
      price: "",
      discount: "",
      quantity: "",
      image: ["images/glass1.png", "images/glass2.png"],
      model3D: "/3Dimages/glass.glb",
    },
  ]);

  const handleVariationChange = (index, field, value) => {
    const newVariations = [...variations];
    newVariations[index][field] = value;
    setVariations(newVariations);
  };

  const handleFileChange = (index, field, file) => {
    const newVariations = [...variations];
    newVariations[index][field] = file;
    setVariations(newVariations);
  };

  const addVariation = () => {
    // Nếu đã chọn đủ số màu khác nhau, không thêm được nữa
    if (variations.length >= colorOptions.length) {
      alert("Bạn đã thêm tất cả các màu có sẵn!");
      return;
    }
    setVariations([
      ...variations,
      {
        color: "",
        price: "",
        discount: "",
        quantity: "",
        image: null,
        model3D: null,
      },
    ]);
  };
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [ageGroup, setAgeGroup] = useState("nguoiLon");
  const [description, setdescription] = useState("");
  const maxCharacters = 500;

  const handleDescriptionChange = (event) => {
    const newDescription = event.target.value.slice(0, maxCharacters);
    setdescription(newDescription);
    // onReviewChange(product.id, { rating, description: newdescription, images })
  };

  const [expanded, setExpanded] = useState(0); // chỉ giữ 1 cái mở

  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  useImperativeHandle(ref, () => ({
    hasDuplicateColors: () => {
      const colors = variations.map((v) => v.color);
      return new Set(colors).size !== colors.length;
    },
    getVariations: () => variations, // optional: nếu cần lấy dữ liệu
  }));

  return (
    <Box>
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

        {/* hiển thị ra ngoài */}
        {/* <Typography style={{ whiteSpace: "pre-line" }}>
          {description}
        </Typography> */} 

        <Box className="character-count">
          <Typography variant="caption">
            {description.length}/{maxCharacters}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body1" gutterBottom>
        Thông tin từng sản phẩm
      </Typography>

      {variations.map((variation, index) => (
        <Accordion
          expanded={expanded === index}
          onChange={handleChangeAccordion(index)}
          key={index}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center">
              <Typography>Màu {index + 1}: </Typography>
              {variation.color ? (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: variation.color,
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    mx: 1,
                  }}
                />
              ) : (
                <Typography sx={{ ml: 1 }}>Chưa chọn</Typography>
              )}
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            {/* Color */}
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Màu</InputLabel>
              <Select
                label="Màu"
                value={variation.color}
                onChange={(e) =>
                  handleVariationChange(index, "color", e.target.value)
                }
                renderValue={(selected) => {
                  const selectedColor = colorOptions.find(
                    (c) => c.hex === selected
                  );
                  return (
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: selected,
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">
                        {selectedColor ? selectedColor.name : selected}
                      </Typography>
                    </Box>
                  );
                }}
              >
                {/* {colorOptions.map((color) => (
                  <MenuItem key={color.hex} value={color.hex}>
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: color.hex,
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          mr: 1,
                        }}
                      />
                      {color.name}
                    </Box>
                  </MenuItem>
                ))} */}
                {colorOptions.map((color) => {
                  const isSelected = variations.some(
                    (v, i) => v.color === color.hex && i !== index
                  );
                  return (
                    <MenuItem
                      key={color.hex}
                      value={color.hex}
                      disabled={isSelected}
                    >
                      <Box display="flex" alignItems="center">
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: color.hex,
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            mr: 1,
                          }}
                        />
                        {color.name}
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            {/* Price */}
            <TextField
              fullWidth
              label="Đơn giá"
              variant="outlined"
              type="number"
              value={variation.price}
              onChange={(e) =>
                handleVariationChange(index, "price", e.target.value)
              }
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: <Typography variant="body2">đ</Typography>,
              }}
            />

            {/* Discount */}
            <TextField
              fullWidth
              label="Giảm giá"
              variant="outlined"
              type="number"
              value={variation.discount}
              onChange={(e) =>
                handleVariationChange(index, "discount", e.target.value)
              }
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: <Typography variant="body2">đ</Typography>,
              }}
            />

            {/* Quantity */}
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Số lượng</InputLabel>
              <Select
                label="Số lượng"
                value={variation.quantity}
                onChange={(e) =>
                  handleVariationChange(index, "quantity", e.target.value)
                }
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Image upload */}
            <ImageUploader
              images={variation.image || []}
              onChange={(newImages) =>
                handleFileChange(index, "image", newImages)
              }
            />

            {/* 3D model upload */}
            <ModelUploader
              value={variation.model3D}
              onChange={(file) => handleFileChange(index, "model3D", file)}
            />
          </AccordionDetails>
        </Accordion>
      ))}

      <Button
        onClick={addVariation}
        variant="outlined"
        startIcon={<AddCircleOutlineIcon />}
        color="success"
      >
        Thêm màu
      </Button>
    </Box>
  );
});

export default ProductDetailsForm;
