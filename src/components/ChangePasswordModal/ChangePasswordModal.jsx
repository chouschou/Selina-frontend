import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { changeUserPassword } from '../../services/auth/changeUserPassword';

const ChangePasswordModal = ({ open, onClose }) => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      await changeUserPassword({ currentPassword, newPassword });
      toast.success('Đổi mật khẩu thành công');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      onClose?.();
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Đổi mật khẩu</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Mật khẩu hiện tại"
          name="currentPassword"
          type="password"
          fullWidth
          margin="normal"
          value={form.currentPassword}
          onChange={handleChange}
        />
        <TextField
          label="Mật khẩu mới"
          name="newPassword"
          type="password"
          fullWidth
          margin="normal"
          value={form.newPassword}
          onChange={handleChange}
        />
        <TextField
          label="Nhập lại mật khẩu mới"
          name="confirmPassword"
          type="password"
          fullWidth
          margin="normal"
          value={form.confirmPassword}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          color="primary"
          sx={{color: 'white'}}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordModal;
