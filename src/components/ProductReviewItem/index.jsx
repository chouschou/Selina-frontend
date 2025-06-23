import { useEffect, useState } from "react";
import { Box, Typography, Rating, TextField, IconButton } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CancelIcon from "@mui/icons-material/Cancel";
import "./ProductReviewItem.scss";
import { formatCurrencyVND } from "../../services/formatToShow";
import { getRatingById } from "../../services/rating/getByRatingId";
import { formatDateTimeVN } from "../../services/formatDatetimeVN";
import { Stack } from "@mui/system";

const ProductReviewItem = ({ product, onReviewChange, editable = true }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [ratingAt, setRatingAt] = useState("");
  const maxCharacters = 500;

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    onReviewChange(product.id, { rating: newValue, comment, images });
  };

  const handleCommentChange = (event) => {
    const newComment = event.target.value.slice(0, maxCharacters);
    setComment(newComment);
    onReviewChange(product.id, { rating, comment: newComment, images });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && images.length < 5) {
      const updated = [...images, file];
      setImages(updated);
      notifyChange(rating, comment, updated);
    }
  };

  const handleRemoveImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    notifyChange(rating, comment, updated);
  };

  const notifyChange = (rating, comment, images) => {
    onReviewChange(product.id, { rating, comment, images });
  };

  // const handleImageUpload = (event) => {
  //   if (event.target.files && images.length < maxImages) {
  //     const newImages = [...images];
  //     const file = event.target.files[0];

  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         newImages.push(e.target.result);
  //         setImages(newImages);
  //         onReviewChange(product.id, { rating, comment, images: newImages });
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // };

  // const handleRemoveImage = (index) => {
  //   const newImages = [...images];
  //   newImages.splice(index, 1);
  //   setImages(newImages);
  //   onReviewChange(product.id, { rating, comment, images: newImages });
  // };
  const imagePreviews = images?.map((img, idx) => {
    const isFile = img instanceof File;
    const src = isFile ? URL.createObjectURL(img) : img;

    return (
      <Box
        key={idx}
        sx={{ position: "relative", width: 80, height: 80, mr: 1 }}
      >
        <img
          src={src}
          alt={`uploaded-${idx}`}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 4,
            objectFit: "cover",
          }}
        />
        {editable && (
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bgcolor: "rgba(255,255,255,0.7)",
            }}
            onClick={() => handleRemoveImage(idx)}
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    );
  });

  useEffect(() => {
    if (product?.rating?.ID) {
      const fetchRatingById = async () => {
        const response = await getRatingById(product?.rating?.ID);
        setRating(response.Value);
        setComment(response.Comment);
        setImages(response.Images.map((i) => i.ImagePath));
        setRatingAt(response.CreateAt);
      };
      fetchRatingById();
    }
  }, [product?.rating]);

  console.log("product in product review item:", product);
  console.log(
    "in product review item, rating-comment-images-createat: ",
    rating,
    comment,
    images,
    ratingAt
  );
  return (
    <Box className="product-review-item">
      <Typography
        sx={{ color: "#88000", display: "inline", background: "#ff7ba2" }}
      >
        {ratingAt && `Đánh giá lúc: ${formatDateTimeVN(ratingAt)}`}
      </Typography>

      <Box className="product-info" sx={{ marginTop: "10px" }}>
        <Box className="product-image-container">
          <img
            src={product?.product.image || "images/glass.png"}
            alt={product?.product.name}
            className="product-image"
          />
        </Box>
        <Box className="product-details">
          <Typography variant="h6" className="product-name">
            {product?.product.name}
          </Typography>
          <Typography variant="body2" className="product-variant">
            Phân loại: {product?.product?.variantProduct}
          </Typography>
          <Typography variant="body2" className="product-quantity">
            Số lượng: x {product.quantity}
          </Typography>
          <Typography variant="body2" className="product-price">
            Đơn giá:{" "}
            {formatCurrencyVND(
              (product.price * (100 - product.discount)) / 100
            )}
          </Typography>
        </Box>
      </Box>

      <Box className="review-section">
        <Box className="rating-section">
          <Typography variant="body1" className="rating-label">
            Chất lượng sản phẩm
          </Typography>
          <Rating
            disabled={!editable}
            name={`rating-${product.id}`}
            value={rating}
            onChange={handleRatingChange}
            size="large"
          />
        </Box>

        <Box className="comment-section">
          <TextField
            fullWidth
            multiline
            disabled={!editable}
            rows={3}
            placeholder="Chia sẻ của bạn"
            value={comment}
            onChange={handleCommentChange}
            variant="outlined"
            className="comment-input"
          />
          <Box className="character-count">
            <Typography variant="caption">
              {comment.length}/{maxCharacters}
            </Typography>
          </Box>
        </Box>

        <Box className="images-section">
          {editable && (<Typography variant="body2" className="images-label">
            Thêm hình ảnh
          </Typography>)}
          <Box>
            {editable && (<Stack direction="row" alignItems="center" spacing={2}>
              <label htmlFor={`upload-${product.id}`}>
                <input
                  accept="image/*"
                  id={`upload-${product.id}`}
                  type="file"
                  hidden
                  onChange={handleImageUpload}
                />
                <IconButton
                  color="primary"
                  component="span"
                  disabled={!editable}
                >
                  <AddPhotoAlternateIcon />
                </IconButton>
              </label>
              <Typography variant="body2" color="textSecondary">
                Tối đa 5 ảnh
              </Typography>
            </Stack>)}

            <Box mt={1} sx={{ display: "flex", flexWrap: "wrap" }}>
              {images.length > 0 && imagePreviews}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductReviewItem;
