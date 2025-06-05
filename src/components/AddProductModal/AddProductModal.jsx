import React, { useRef, useState } from "react";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import ProductTypeSelector from "./ProductTypeSelector";
import ProductDetailsForm from "./ProductDetailsForm";
import ImageUploader from "./ImageUploader";
import ModelUploader from "./ModalUploader";
import { addProduct } from "../../services/product/addProduct";
import { toast } from "react-toastify";

const AddProductModal = ({ open, onClose, onSuccess }) => {
  // const [productType, setProductType] = useState("Gọng kính");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef();
  const [data, setData] = useState({
    Category: "",
    Shape: "",
    Material: "",
    Description: "",
    Age: "",
    GlassColors: [
      {
        Color: "",
        Quantity: "",
        Price: "",
        Discount: "",
        ModelVirtualTryOn: "",
        Image3DPath: "",
        Images: [],
        Status: "",
      },
    ],
  });

  if (!open) return null;

  const handleSubmit = async () => {
    if (formRef.current?.hasDuplicateColors()) {
      alert("Không được chọn trùng màu giữa các sản phẩm cùng loại!");
      return;
    }

    const isValid = formRef.current?.validateForm();
    if (!isValid) {
      return; // lỗi, không submit
    }

    setIsSubmitting(true);
    try {
      console.log("data", data);
      const formData = new FormData();

      formData.append("Category", data.Category);
      formData.append("Shape", data.Shape);
      formData.append("Material", data.Material);
      formData.append("Description", data.Description);
      formData.append("Age", data.Age);

      data.GlassColors.forEach((color, index) => {
        const prefix = `glassColors[${index}]`;

        formData.append(`${prefix}.Color`, color.Color);
        formData.append(`${prefix}.Quantity`, color.Quantity);
        formData.append(`${prefix}.Price`, color.Price);
        formData.append(`${prefix}.Discount`, color.Discount);
        formData.append(`${prefix}.Status`, color.Status);

        if (color.ModelVirtualTryOn instanceof File) {
          formData.append(
            `${prefix}.ModelVirtualTryOn`,
            color.ModelVirtualTryOn
          );
        }

        if (color.Image3DPath instanceof File) {
          formData.append(`${prefix}.Image3DPath`, color.Image3DPath);
        }

        if (Array.isArray(color.Images)) {
          color.Images.forEach((img) => {
            if (img?.file instanceof File) {
              formData.append(`${prefix}.Images`, img.file);
            }
          });
        }
      });
      await addProduct(formData);

      toast.success("Thêm sản phẩm thành công!");
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error("Lỗi khi thêm sản phẩm: " + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {/* Header */}
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <h2 className="text-xl font-semibold text-gray-800">
            THÊM SẢN PHẨM MỚI
          </h2>
          <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent>
        <Box className="space-y-6">
          {/* Product Type */}
          {/* <ProductTypeSelector
            value={productType}
            onChange={(value) => setProductType(value)}
          /> */}

          {/* Product Details */}
          <ProductDetailsForm
            ref={formRef}
            onDataChange={(formDataFromChild) => {
              // console.log("Dữ liệu từ con:", formDataFromChild);

              const mappedGlassColors = formDataFromChild.variations.map(
                (variation) => ({
                  Color: variation.color,
                  Quantity: Number(variation.quantity),
                  Price: Number(variation.price),
                  Discount: Number(variation.discount),
                  ModelVirtualTryOn: variation.modelVirtualTryOn,
                  Image3DPath: variation.model3D,
                  Images: variation.image,
                  Status: variation.status || "active",
                })
              );

              const newData = {
                Category: formDataFromChild.selectedType,
                Shape: formDataFromChild.selectedShape,
                Material: formDataFromChild.selectedMaterial,
                Description: formDataFromChild.description,
                Age: formDataFromChild.ageGroup,
                GlassColors: mappedGlassColors,
              };

              setData(newData);
            }}
          />
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions>
        <Button onClick={onClose} color="default">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          type="submit"
          sx={{ color: "#fff" }}
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
