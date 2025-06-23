import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Box } from "@mui/system";
import { useState } from "react";
import { toast } from "react-toastify";
import ProductReviewItem from "../ProductReviewItem";
import { addRating } from "../../services/rating/addRating";

const AddRatingModal = ({ isOpen, onClose, onSuccess, order }) => {
  const [reviews, setReviews] = useState({});

  const handleReviewChange = (orderDetailId, reviewData) => {
    setReviews((prev) => ({
      ...prev,
      [orderDetailId]: reviewData,
    }));
  };

  const handleSubmitReviews = async () => {
    try {
      const entries = Object.entries(reviews);
      if (entries.length === 0) {
        toast.warning("Vui lòng đánh giá ít nhất một sản phẩm.");
        return;
      }

      console.log("reviews:", reviews)

      const promises = entries.map(async ([orderDetailId, review]) => {
        const formData = new FormData();
        formData.append("Value", review.rating);
        formData.append("Comment", review.comment || "");

        if (review.images?.length) {
          review.images.forEach((file) => {
            formData.append("images", file);
          });
        }

        await addRating(orderDetailId, formData);
      });

      await Promise.all(promises);
      toast.success("Gửi đánh giá thành công!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi gửi đánh giá.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography fontWeight="bold">ĐÁNH GIÁ SẢN PHẨM</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {order?.items.map((item) => (
          <ProductReviewItem
            key={item.id}
            product={item}
            onReviewChange={handleReviewChange}
          />
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleSubmitReviews}
          variant="contained"
          color="primary"
          sx={{ color: "white" }}
        >
          Gửi đánh giá
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRatingModal;
