import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
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
  FormHelperText,
  FormLabel,
  IconButton,
  FormGroup,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModelUploader from "./ModalUploader";
import ImageUploader from "./ImageUploader";
import "./UpdateProductModal.scss";
import { toast } from "react-toastify";
import { Grid } from "@mui/system";
import { translateShapeToVietnamese } from "../../services/formatToShow";
import { getUsedColors } from "../../services/product/getUsedColors";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductDetailsForm = forwardRef((props, ref) => {
  const { initialData } = props;
  console.log("initialData:", initialData);
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
    { name: "Khác", hex: "Khác" },
  ];

  const shapeOptions = [
    "square",
    "rectangular",
    "oval",
    "round",
    "butterfly",
    "cat-eye",
    "hexagonal",
    "octagonal",
    "wayfarer",
    "aviator",
    "other",
  ];
  const materialOptions = ["Nhựa", "Kim loại", "Titanium"];
  const ageOptions = ["Nam", "Nữ", "Trẻ em"];
  const [selectedType, setSelectedType] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [ageGroup, setAgeGroup] = useState([]);
  const [description, setDescription] = useState("");
  const maxCharacters = 500;
  const [errors, setErrors] = useState({});
  const [usedColors, setUsedColors] = useState([]);
  const [editable, setEditable] = useState(true);

  const [variations, setVariations] = useState([
    {
      color: "",
      price: "",
      discount: "",
      quantity: "",
      image: [],
      modelVirtualTryOn: "",
      modelVirtualTryOnPreview: "",
      model3D: "",
      status: "active",
    },
  ]);

  const getDisplayNumber = (value) =>
    value === "" || value === null || value === undefined ? "" : Number(value);

  useEffect(() => {
    if (initialData) {
      setSelectedType(initialData.Category || "");
      setSelectedShape(initialData.Shape?.toLowerCase() || "");
      setSelectedMaterial(initialData.Material || "");
      setAgeGroup(
        initialData.Age
          ? initialData.Age.split(",").map((item) => item.trim())
          : []
      );

      setDescription(initialData.Description);
    }
    if (initialData?.GlassColors) {
      const mappedVariations = initialData?.GlassColors.map((item) => ({
        color: item.Color || "",
        price: item.Price || "",
        discount: item.Discount || "",
        quantity: item.Quantity || "",
        image: item.Images || [],
        modelVirtualTryOn: item.ModelVirtualTryOn || "",
        modelVirtualTryOnPreview: item.ModelVirtualTryOn || "",
        model3D: item.Image3DPath || "",
        status: item.Status || "active",
        id: item.ID,
      }));

      setVariations(mappedVariations);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchUsedColors = async () => {
      try {
        const response = await getUsedColors(initialData?.ID);
        setUsedColors(response);
      } catch (error) {
        console.error("Lỗi khi lấy màu đã sử dụng:", error);
      }
    };

    if (initialData?.ID) {
      fetchUsedColors();
    }
  }, [initialData?.ID]);
  useEffect(() => {
    const editableValue = usedColors.length === 0;
    setEditable(editableValue);
    console.log("setEditable to:", editableValue, "usedColors:", usedColors);
  }, [usedColors]);

  const handleVariationChange = (index, field, value) => {
    const newVariations = [...variations];
    newVariations[index][field] = value;
    setVariations(newVariations);

    // Clear error nếu có
    const errorKey = `${field}-${index}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const { [errorKey]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleFileChange = (index, field, file) => {
    const newVariations = [...variations];
    newVariations[index][field] = file;
    setVariations(newVariations);

    // Clear error nếu có
    const errorKey = `${field}-${index}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const { [errorKey]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const addVariation = () => {
    // Nếu đã chọn đủ số màu khác nhau, không thêm được nữa
    if (variations.length >= colorOptions.length) {
      toast.error("Bạn đã thêm tất cả các màu có sẵn!");
      return;
    }
    setVariations([
      ...variations,
      {
        color: "",
        price: "",
        discount: "",
        quantity: "",
        image: [],
        modelVirtualTryOn: "",
        modelVirtualTryOnPreview: "",
        model3D: null,
        status: "active",
      },
    ]);
  };

  const validateForm = () => {
    const newErrors = {};
    let firstInvalidField = null;

    variations.forEach((v, index) => {
      if (!v.color) {
        newErrors[`color-${index}`] = "Trường này bắt buộc";
        if (!firstInvalidField) firstInvalidField = `color-${index}`;
      }
      if (!v.price) {
        newErrors[`price-${index}`] = "Trường này bắt buộc";
        if (!firstInvalidField) firstInvalidField = `price-${index}`;
      }
      if (!v.discount) {
        newErrors[`discount-${index}`] = "Trường này bắt buộc";
        if (!firstInvalidField) firstInvalidField = `discount-${index}`;
      }
      if (!v.quantity) {
        newErrors[`quantity-${index}`] = "Trường này bắt buộc";
        if (!firstInvalidField) firstInvalidField = `quantity-${index}`;
      }
      if (!v.modelVirtualTryOn) {
        newErrors[`modelVirtualTryOn-${index}`] = "Trường này bắt buộc";
        if (!firstInvalidField)
          firstInvalidField = `modelVirtualTryOn-${index}`;
      }
      if (!v.image || v.image.length === 0) {
        newErrors[`image-${index}`] = "Phải có ít nhất 1 ảnh";
        if (!firstInvalidField) firstInvalidField = `image-${index}`;
      }
    });

    if (!selectedType) {
      newErrors["selectedType"] = "Vui lòng chọn phân loại";
      firstInvalidField = "selectedType";
    }

    if (!selectedShape) {
      newErrors["selectedShape"] = "Vui lòng chọn hình dáng";
      firstInvalidField = "selectedShape";
    }

    if (!selectedMaterial) {
      newErrors["selectedMaterial"] = "Vui lòng chọn chất liệu";
      if (!firstInvalidField) firstInvalidField = "selectedMaterial";
    }

    if (ageGroup.length === 0) {
      newErrors["ageGroup"] = "Vui lòng chọn độ tuổi";
      firstInvalidField = "ageGroup";
    }

    if (!description) {
      newErrors["description"] = "Vui lòng nhập mô tả sản phẩm";
      if (!firstInvalidField) firstInvalidField = "description";
    }

    setErrors(newErrors);

    // Auto focus nếu có lỗi
    if (firstInvalidField) {
      const element = document.querySelector(`[name="${firstInvalidField}"]`);
      if (element) element.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleDescriptionChange = (event) => {
    const newDescription = event.target.value.slice(0, maxCharacters);
    setDescription(newDescription);
    // onReviewChange(product.id, { rating, description: newdescription, images })

    // Clear error nếu có
    const errorKey = "description";
    if (errors[errorKey]) {
      setErrors((prev) => {
        const { [errorKey]: _, ...rest } = prev;
        return rest;
      });
    }
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
    getVariations: () => variations,

    validateForm,
  }));

  useEffect(() => {
    if (props.onDataChange) {
      props.onDataChange({
        variations,
        selectedType,
        selectedShape,
        selectedMaterial,
        ageGroup,
        description,
      });
    }
  }, [
    variations,
    selectedType,
    selectedShape,
    selectedMaterial,
    ageGroup,
    description,
  ]);

  const handleTryOnModelChange = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ cho phép chọn file ảnh.");
      return;
    }

    const preview = URL.createObjectURL(file);
    const newVariations = [...variations];
    newVariations[index].modelVirtualTryOn = file;
    newVariations[index].modelVirtualTryOnPreview = preview;
    setVariations(newVariations);

    // Clear error nếu có
    const errorKey = `modelVirtualTryOn-${index}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const { [errorKey]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleDeleteVariation = (indexToRemove) => {
    setVariations((prev) => prev.filter((_, i) => i !== indexToRemove));

    // Nếu accordion bị xoá là accordion đang mở -> reset expanded
    if (expanded === indexToRemove) {
      setExpanded(null);
    } else if (expanded > indexToRemove) {
      setExpanded((prev) => prev - 1);
    }
  };

  return (
    <Box>
      <Box display="flex" gap={2} mb={2}>
        <Box flex={1}>
          <FormControl
            component="fieldset"
            fullWidth
            margin="normal"
            sx={{ marginTop: 0 }}
            error={!!errors[`selectedType`]}
            disabled={!editable}
          >
            <FormLabel component="legend" style={{ color: "#bc5700" }}>
              Phân loại <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <RadioGroup
              name={`selectedType`}
              value={selectedType}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedType(value);

                // Clear lỗi nếu có
                const errorKey = "selectedType";
                if (errors[errorKey]) {
                  setErrors((prev) => {
                    const { [errorKey]: _, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              row
            >
              <FormControlLabel
                value="Gọng kính"
                control={<Radio />}
                label="Gọng kính"
                sx={{ marginRight: "40px" }}
              />
              <FormControlLabel
                value="Kính mát"
                control={<Radio />}
                label="Kính mát"
              />
            </RadioGroup>
            <FormHelperText>{errors.selectedType}</FormHelperText>
          </FormControl>
        </Box>
        <Box flex={1}>
          <FormControl component="fieldset" error={!!errors.ageGroup}>
            <Typography
              variant="body2"
              color="textSecondary"
              gutterBottom
              style={{ color: "#bc5700" }}
            >
              Giới tính <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormGroup row>
              {ageOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={ageGroup.includes(option)}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...ageGroup, option]
                          : ageGroup.filter((item) => item !== option);
                        setAgeGroup(newValue);

                        // Clear lỗi nếu có
                        const errorKey = "ageGroup";
                        if (errors[errorKey]) {
                          setErrors((prev) => {
                            const { [errorKey]: _, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                    />
                  }
                  label={option}
                  sx={{ marginRight: "40px" }}
                />
              ))}
            </FormGroup>
            <FormHelperText sx={{ mb: 2 }}>{errors.ageGroup}</FormHelperText>
          </FormControl>
        </Box>
      </Box>
      <Box display="flex" gap={2} mb={2}>
        <Box flex={1}>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            error={!!errors[`selectedShape`]}
          >
            <InputLabel required style={{ color: "#bc5700" }}>
              Hình dáng
            </InputLabel>
            <Select
              label="Hình dáng"
              name={`selectedShape`}
              value={selectedShape}
              disabled={!editable}
              onChange={(e) => {
                setSelectedShape(e.target.value);
                const errorKey = "selectedShape";
                if (errors[errorKey]) {
                  setErrors((prev) => {
                    const { [errorKey]: _, ...rest } = prev;
                    return rest;
                  });
                }
              }}
            >
              <MenuItem value="">Chọn hình dáng</MenuItem>
              {shapeOptions.map((value) => (
                <MenuItem key={value} value={value}>
                  {translateShapeToVietnamese(value)}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.selectedShape}</FormHelperText>
          </FormControl>
        </Box>

        <Box flex={1}>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            error={!!errors[`selectedMaterial`]}
          >
            <InputLabel required style={{ color: "#bc5700" }}>
              Chất liệu
            </InputLabel>
            <Select
              label="Chất liệu"
              name={`selectedMaterial`}
              value={selectedMaterial}
              disabled={!editable}
              onChange={(e) => {
                setSelectedMaterial(e.target.value);
                // Clear lỗi nếu có
                const errorKey = "selectedMaterial";
                if (errors[errorKey]) {
                  setErrors((prev) => {
                    const { [errorKey]: _, ...rest } = prev;
                    return rest;
                  });
                }
              }}
            >
              <MenuItem value="">Chọn chất liệu</MenuItem>
              {materialOptions.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.selectedMaterial}</FormHelperText>
          </FormControl>
        </Box>
      </Box>

      <Box className="description-section">
        <Typography
          variant="body2"
          color="textSecondary"
          gutterBottom
          style={{ color: "#bc5700" }}
        >
          Mô tả về sản phẩm <span style={{ color: "red" }}>*</span>
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Nhập mô tả sản phẩm"
          name={`description`}
          error={!!errors[`description`]}
          helperText={errors[`description`] || ""}
          value={description}
          onChange={handleDescriptionChange}
          variant="outlined"
          className="discription-input"
        />

        <Box className="character-count">
          <Typography variant="caption">
            {description?.length}/{maxCharacters}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body1" gutterBottom style={{ color: "#b9bc00" }}>
        Thông tin từng sản phẩm
      </Typography>

      {variations.map((variation, index) => (
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>
            <Accordion
              expanded={expanded === index}
              onChange={handleChangeAccordion(index)}
              key={index}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{ backgroundColor: "#FFFFF0" }}
                >
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
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                  error={!!errors[`color-${index}`]}
                >
                  <InputLabel required>Màu</InputLabel>
                  <Select
                    label="Màu"
                    name={`color-${index}`}
                    value={variation.color}
                    onChange={(e) =>
                      handleVariationChange(index, "color", e.target.value)
                    }
                    disabled={usedColors.includes(variation.color)}
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
                            {selectedColor ? selectedColor.name : selected}{" "}
                            {usedColors.includes(variation.color) && (
                              <Typography
                                component="span"
                                variant="body2"
                                color="error"
                              >
                                (đã có đơn đặt)
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      );
                    }}
                  >
                    {colorOptions.map((color) => {
                      const isSelected =
                        variations.some(
                          (v, i) => v.color === color.hex && i !== index
                        ) || usedColors.includes(color.hex);

                      const isUsedInOrder = usedColors.includes(color.hex);

                      return (
                        <MenuItem
                          key={color.hex}
                          value={color.hex}
                          disabled={isSelected || isUsedInOrder}
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
                            <Typography variant="body2">
                              {color.name}{" "}
                              {isUsedInOrder && (
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="error"
                                >
                                  (đã có đơn đặt)
                                </Typography>
                              )}
                            </Typography>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>{errors[`color-${index}`]}</FormHelperText>
                </FormControl>
                <Box display="flex" gap={2} mb={2}>
                  <Box flex={1}>
                    <TextField
                      fullWidth
                      required
                      label="Đơn giá"
                      variant="outlined"
                      type="number"
                      onKeyDown={(e) => {
                        const invalidChars = ["e", "E", "+", "-", "."];
                        if (invalidChars.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      name={`price-${index}`}
                      error={!!errors[`price-${index}`]}
                      helperText={errors[`price-${index}`] || ""}
                      value={getDisplayNumber(variation.price)}
                      onChange={(e) =>
                        handleVariationChange(index, "price", e.target.value)
                      }
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2">đ</Typography>
                        ),
                      }}
                    />
                  </Box>

                  <Box flex={1}>
                    <TextField
                      fullWidth
                      required
                      label="Giảm giá"
                      variant="outlined"
                      type="number"
                      onKeyDown={(e) => {
                        const invalidChars = ["e", "E", "+", "-", "."];
                        if (invalidChars.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      name={`discount-${index}`}
                      error={!!errors[`discount-${index}`]}
                      helperText={errors[`discount-${index}`] || ""}
                      value={getDisplayNumber(variation.discount)}
                      onChange={(e) =>
                        handleVariationChange(index, "discount", e.target.value)
                      }
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2">đ</Typography>
                        ),
                      }}
                    />
                  </Box>
                </Box>
                <Box display="flex" gap={2} mb={2}>
                  <Box flex={1}>
                    <TextField
                      fullWidth
                      required
                      label="Số lượng"
                      variant="outlined"
                      type="number"
                      name={`quantity-${index}`}
                      error={!!errors[`quantity-${index}`]}
                      helperText={errors[`quantity-${index}`] || ""}
                      value={variation.quantity}
                      onChange={(e) =>
                        handleVariationChange(index, "quantity", e.target.value)
                      }
                      inputProps={{ min: 0 }}
                      onKeyDown={(e) => {
                        const invalidChars = ["e", "E", "+", "-", "."];
                        if (invalidChars.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Box>

                  <Box flex={1}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Trạng thái <span style={{ color: "red" }}>*</span>
                    </Typography>

                    <RadioGroup
                      value={variation.status}
                      onChange={(e) =>
                        handleVariationChange(index, "status", e.target.value)
                      }
                      sx={{ mb: 2 }}
                    >
                      <Box display="flex" gap={2}>
                        <FormControlLabel
                          value="active"
                          control={<Radio />}
                          label="Đang bán"
                        />
                        <FormControlLabel
                          value="inactive"
                          control={<Radio />}
                          label="Ngừng bán"
                        />
                      </Box>
                    </RadioGroup>
                  </Box>
                </Box>
                <ImageUploader
                  images={variation.image || []}
                  onChange={(newImages) =>
                    handleFileChange(index, "image", newImages)
                  }
                  name={`image-${index}`}
                  error={!!errors[`image-${index}`]}
                  helperText={errors[`image-${index}`]}
                />
                <Box mt={2}></Box>
                Mô hình thử kính ảo
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Thêm mô hình thử kính ảo{" "}
                  <span style={{ color: "red", marginTop: "10px" }}>*</span>
                </Typography>
                <Box
                  display="grid"
                  gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                  gap={2}
                  p={2}
                  border="1px solid #ccc"
                  borderRadius={2}
                  mb={2}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Typography variant="body2" color="textSecondary">
                      Ảnh mẫu:
                    </Typography>
                    <img
                      src="/images/2719_cleanup_crop_nobg.jpg"
                      alt="Ảnh mẫu mô hình thử kính"
                      style={{ width: "100%", maxWidth: 300, borderRadius: 8 }}
                    />
                    <Typography variant="body2" color="textSecondary" mt={2}>
                      Tải lên hình ảnh mặt kính phía trước (không có gọng 2 bên)
                      để dùng cho chức năng trải nghiệm thử kính ảo. Đảm bảo ảnh
                      có định dạng chuẩn (.png/.jpg)
                    </Typography>
                  </Box>
                  <Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Xem trước:
                      </Typography>
                      <img
                        src={
                          variation.modelVirtualTryOnPreview ||
                          "images/no_image.png"
                        }
                        alt="Preview mô hình thử kính"
                        style={{
                          width: "100%",
                          maxWidth: 256,
                          maxHeight: 150,
                          borderRadius: 8,
                        }}
                      />
                    </Box>
                    {errors[`modelVirtualTryOn-${index}`] && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 1, ml: 1 }}
                      >
                        {errors[`modelVirtualTryOn-${index}`]}
                      </Typography>
                    )}
                    <FormHelperText></FormHelperText>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ color: "black", backgroundColor: "#aaf2bbde" }}
                    >
                      Upload mô hình
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        name={`modelVirtualTryOn-${index}`}
                        onChange={(e) => handleTryOnModelChange(e, index)}
                      />
                    </Button>
                  </Box>
                </Box>
                <ModelUploader
                  value={variation.model3D || ""}
                  onChange={(file) => handleFileChange(index, "model3D", file)}
                />
              </AccordionDetails>
            </Accordion>
          </Box>

          <IconButton
            onClick={() => handleDeleteVariation(index)}
            color="error"
            sx={{ ml: 1 }}
            disabled={usedColors.includes(variation.color)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Typography className="note-text">
        Lưu ý: Những màu đã có trong đơn hàng bạn không thể xóa đi, hãy thay đổi
        trạng thái nếu bạn không muốn bán mặt hàng đó nữa.
      </Typography>

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
