import React, { useEffect, useRef, useState } from "react";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import ProductDetailsForm from "./ProductDetailsForm";
import ImageUploader from "./ImageUploader";
import ModelUploader from "./ModalUploader";
import { toast } from "react-toastify";
import { getProductById } from "../../services/product/getProductById";
import { updateProduct } from "../../services/product/updateProduct";

const UpdateProductModal = ({ open, onClose, productId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef();
  const [data, setData] = useState(null);
  const [updateData, setUpdateData] = useState(null);

  const fetchProductById = async () => {
    const response = await getProductById(productId);
    setData(response);
  };

  useEffect(() => {
    if (open && productId) {
      fetchProductById();
    }
  }, [open, productId]);

  const buildUpdateFormData = (updateData) => {
    const formData = new FormData();

    // Các trường cơ bản
    Object.entries(updateData).forEach(([key, value]) => {
      if (key !== "GlassColors") {
        formData.append(key, value);
      }
    });

    // GlassColors
    updateData.GlassColors.forEach((color, index) => {
      const prefix = `glassColors[${index}]`;

      if (color.ID !== undefined) {
        formData.append(`${prefix}.ID`, color.ID);
      }
      formData.append(`${prefix}.Color`, color.Color || "");
      formData.append(`${prefix}.Quantity`, color.Quantity ?? 0);
      formData.append(`${prefix}.Price`, color.Price ?? 0);
      formData.append(`${prefix}.Discount`, color.Discount ?? 0);
      formData.append(`${prefix}.Status`, color.Status || "active");

      // ModelVirtualTryOn
      if (color.ModelVirtualTryOn instanceof File) {
        formData.append(`${prefix}.ModelVirtualTryOn`, color.ModelVirtualTryOn);
      } else if (typeof color.ModelVirtualTryOn === "string") {
        formData.append(`${prefix}.ModelVirtualTryOn`, color.ModelVirtualTryOn);
      } else {
        formData.append(`${prefix}.ModelVirtualTryOn`, "");
      }

      // Image3DPath
      if (color.Image3DPath instanceof File) {
        formData.append(`${prefix}.Image3DPath`, color.Image3DPath);
      } else if (typeof color.Image3DPath === "string") {
        formData.append(`${prefix}.Image3DPath`, color.Image3DPath);
      } else {
        formData.append(`${prefix}.Image3DPath`, "");
      }

      // Images (file + url)
      if (Array.isArray(color.Images)) {
        color.Images.forEach((image) => {
          if (image instanceof File) {
            formData.append(`${prefix}.Images`, image);
          } else if (typeof image === "string") {
            formData.append(`${prefix}.Images`, image);
          } else if (image.file instanceof File) {
            formData.append(`${prefix}.Images`, image.file);
          }
        });
      }
    });

    return formData;
  };

  const handleSubmit = async () => {
    if (formRef.current?.hasDuplicateColors()) {
      toast.error("Không được chọn trùng màu giữa các sản phẩm cùng loại!");
      return;
    }
    console.log("vào");
    const isValid = formRef.current?.validateForm();
    if (!isValid) {
      return;
    }
    console.log("vào1");
    setIsSubmitting(true);
    try {
      console.log("update data", updateData);

      const formData = buildUpdateFormData(updateData);
    await updateProduct(productId, formData);

      toast.success("Cập nhật sản phẩm thành công!");
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error("Lỗi khi cập nhật sản phẩm: " + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {/* Header */}
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <h2 className="text-xl font-semibold text-gray-800">
            CẬP NHẬT THÔNG TIN SẢN PHẨM
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
            initialData={data}
            onDataChange={(formDataFromChild) => {
              // console.log("Dữ liệu từ con:", formDataFromChild);

              const mappedGlassColors = formDataFromChild.variations.map(
                (variation) => ({
                  ID: variation.id,
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

              setUpdateData(newData);
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

export default UpdateProductModal;
