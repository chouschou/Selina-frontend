// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Button,
//     TextField,
//     FormControl,
//     FormControlLabel,
//     RadioGroup,
//     Radio,
//     Select,
//     MenuItem,
//     InputLabel,
//     Box,
//     IconButton,
//     Grid,
//   } from '@mui/material'
//   import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material'
//   import './AddProductModal.scss'
  
//   function AddProductModal({ open, onClose }) {
//     return (
//       <Dialog 
//         open={open} 
//         onClose={onClose}
//         maxWidth="md"
//         fullWidth
//         className="add-product-modal"
//       >
//         <DialogTitle className="modal-title">
//           THÊM SẢN PHẨM MỚI
//           <IconButton onClick={onClose} className="close-button">
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
        
//         <DialogContent>
//           <Box className="modal-content">
//             {/* Product Type */}
//             <FormControl component="fieldset" className="form-field">
//               <RadioGroup row>
//                 <InputLabel className="upload-label">Phân loại</InputLabel>
//                 <FormControlLabel 
//                   value="gongKinh" 
//                   control={<Radio />} 
//                   label="Gọng kính" 
//                 />
//                 <FormControlLabel 
//                   value="kinhMat" 
//                   control={<Radio />} 
//                   label="Kính mát" 
//                 />
//               </RadioGroup>
//             </FormControl>
  
//             {/* Product Name */}
//             <TextField
//               required
//               label="Tên sản phẩm"
//               fullWidth
//               className="form-field"
//             />
  
//             {/* Shape */}
//             <FormControl fullWidth className="form-field">
//               <InputLabel>Hình dáng</InputLabel>
//               <Select defaultValue="">
//                 <MenuItem value="hinhChuNhat">Hình chữ nhật</MenuItem>
//                 <MenuItem value="tron">Tròn</MenuItem>
//                 <MenuItem value="oval">Oval</MenuItem>
//               </Select>
//             </FormControl>
  
//             {/* Material */}
//             <FormControl fullWidth className="form-field">
//               <InputLabel>Chất liệu</InputLabel>
//               <Select defaultValue="">
//                 <MenuItem value="nhua">Nhựa</MenuItem>
//                 <MenuItem value="kim-loai">Kim loại</MenuItem>
//                 <MenuItem value="titanium">Titanium</MenuItem>
//               </Select>
//             </FormControl>
  
//             {/* Age Group */}
//             <FormControl component="fieldset" className="form-field">
//               <RadioGroup row>
//                 <InputLabel className="upload-label">Độ tuổi</InputLabel>
//                 <FormControlLabel 
//                   value="nguoiLon" 
//                   control={<Radio />} 
//                   label="Người lớn" 
//                 />
//                 <FormControlLabel 
//                   value="treEm" 
//                   control={<Radio />} 
//                   label="Trẻ em" 
//                 />
//               </RadioGroup>
//             </FormControl>
  
//             {/* Size */}
//             <TextField
//               required
//               label="Kích thước"
//               fullWidth
//               className="form-field"
//             />
  
//             {/* Quantity */}
//             <FormControl fullWidth className="form-field">
//               <InputLabel>Số lượng</InputLabel>
//               <Select defaultValue="2">
//                 {[...Array(10)].map((_, i) => (
//                   <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
  
//             {/* Color */}
//             <Grid container spacing={2} className="form-field">
//               <Grid item xs={12}>
//                 <Box className="color-section">
//                   <TextField
//                     select
//                     label="Màu sắc"
//                     fullWidth
//                     defaultValue="gray"
//                   >
//                     <MenuItem value="gray">Gray</MenuItem>
//                     <MenuItem value="black">Black</MenuItem>
//                     <MenuItem value="brown">Brown</MenuItem>
//                   </TextField>
//                   <Button
//                     variant="outlined"
//                     startIcon={<AddIcon />}
//                     className="add-color-btn"
//                   >
//                     Thêm màu
//                   </Button>
//                 </Box>
//               </Grid>
//             </Grid>
  
//             {/* Price and Discount */}
//             <Grid container spacing={2} className="form-field">
//               <Grid item xs={6}>
//                 <TextField
//                   required
//                   label="Đơn giá"
//                   fullWidth
//                   InputProps={{
//                     endAdornment: <span className="currency">đ</span>
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Giảm giá"
//                   fullWidth
//                   InputProps={{
//                     endAdornment: <span className="currency">đ</span>
//                   }}
//                 />
//               </Grid>
//             </Grid>
  
//             {/* Image Upload */}
//             <Box className="image-upload-section">
//               <InputLabel className="upload-label">Thêm hình ảnh</InputLabel>
//               <Grid container spacing={2}>
//                 {[...Array(5)].map((_, index) => (
//                   <Grid item xs={2.4} key={index}>
//                     <Box className="upload-box">
//                       <AddIcon />
//                     </Box>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Box>
//           </Box>
//         </DialogContent>
  
//         <DialogActions className="modal-actions">
//           <Button onClick={onClose} className="cancel-btn">
//             Hủy
//           </Button>
//           <Button variant="contained" color="primary" className="save-btn">
//             Lưu
//           </Button>
//         </DialogActions>
//       </Dialog>
//     )
//   }
  
//   export default AddProductModal

import React from 'react';
import AddProductModal from './AddProductModal';

export default AddProductModal;
