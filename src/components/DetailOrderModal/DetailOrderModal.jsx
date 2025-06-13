import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import "./DetailOrderModal.scss";
import { useEffect, useState } from "react";
import { getDetailOrder } from "../../services/order/getDetailOrder";
import OrderStatusTimeline from "../../pages/OrderManage/OrderStatusTimeline";
const DetailOrder = ({
  open,
  onClose,
  selectedOrderId,
}) => {
  const [detailOrder, setDetailOrder] = useState(null);
  const refunded = detailOrder?.OrderStatuses.find((o) => o.Refund !== null)
    ?.Refund.RefundAt
    ? true
    : false;
    console.log("refunded", refunded)
  useEffect(() => {
    const fetchDetailOrder = async () => {
      const response = await getDetailOrder(selectedOrderId);
      setDetailOrder(response);
    };

    if (selectedOrderId) {
      fetchDetailOrder();
    }
  }, [selectedOrderId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết đơn hàng</DialogTitle>
     
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button>Hủy đơn</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailOrder;
