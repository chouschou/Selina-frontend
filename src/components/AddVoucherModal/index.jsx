import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    IconButton,
    InputAdornment
  } from '@mui/material';
  import { Close as CloseIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
  import './AddVoucherModal.scss';
  
  function AddVoucherModal({ open, onClose }) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        className="add-voucher-modal"
      >
        <DialogTitle className="modal-title">
          Thêm mã khuyến mãi
          <IconButton onClick={onClose} className="close-button">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box className="modal-content">
            <TextField
              required
              label="Tiêu đề"
              fullWidth
              className="form-field"
              placeholder="Khuyến mãi 9/9"
            />
  
            <Box className="row-fields">
              <TextField
                required
                label="Giá trị khuyến mãi"
                className="form-field"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
                placeholder="10"
              />
              
              <TextField
                required
                label="Số lượng"
                className="form-field"
                type="number"
                placeholder="10"
              />
            </Box>
  
            <Box className="row-fields">
              <TextField
                required
                label="Ngày có hiệu lực"
                className="form-field"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarIcon color="action" />
                    </InputAdornment>
                  )
                }}
                placeholder="12:00, 20/10/2024"
              />
            </Box>
  
            <Box className="row-fields">
              <TextField
                required
                label="Ngày hết hạn"
                className="form-field"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarIcon color="action" />
                    </InputAdornment>
                  )
                }}
                placeholder="12:00, 20/10/2024"
              />
            </Box>
  
            <TextField
              required
              label="Giá trị đơn hàng tối thiểu"
              fullWidth
              className="form-field"
              InputProps={{
                endAdornment: <InputAdornment position="end">đ</InputAdornment>
              }}
            />
  
            <TextField
              required
              label="Giảm giá tối đa"
              fullWidth
              className="form-field"
              InputProps={{
                endAdornment: <InputAdornment position="end">đ</InputAdornment>
              }}
            />
          </Box>
        </DialogContent>
  
        <DialogActions className="modal-actions">
          <Button onClick={onClose} className="cancel-btn">
            Hủy
          </Button>
          <Button variant="contained" color="primary" className="save-btn">
            Xong
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  export default AddVoucherModal;