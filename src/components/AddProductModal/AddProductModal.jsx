import React, { useRef, useState } from 'react';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, Box } from '@mui/material';
import ProductTypeSelector from './ProductTypeSelector';
import ProductDetailsForm from './ProductDetailsForm';
import ImageUploader from './ImageUploader';
import ModelUploader from './ModalUploader';

const AddProductModal = ({ open, onClose }) => {
  const [productType, setProductType] = useState('gongKinh');
  const formRef = useRef();

  if (!open) return null;

  const handleSubmit = () => {
    if (formRef.current?.hasDuplicateColors()) {
      alert("Không được chọn trùng màu giữa các biến thể!");
      return;
    }

    // Submit logic here
    alert("Dữ liệu hợp lệ, tiến hành lưu!");
    onClose(); // nếu muốn đóng dialog
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {/* Header */}
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <h2 className="text-xl font-semibold text-gray-800">THÊM SẢN PHẨM MỚI</h2>
          <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent>
        <Box className="space-y-6">
          {/* Product Type */}
          <ProductTypeSelector value={productType} onChange={(value) => setProductType(value)} />

          {/* Product Details */}
          <ProductDetailsForm />

          {/* Image Upload Section */}
          {/* <Box mt={2}>
            <ImageUploader />
          </Box> */}

          {/* 3D Model Upload Section */}
          {/* <Box mt={2}>
            <ModelUploader />
          </Box> */}
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions>
        <Button onClick={onClose} color="default">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" type='submit' sx={{ color: '#fff' }}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
