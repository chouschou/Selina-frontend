import { useState } from "react"
import { Box, Typography, Rating, TextField, IconButton } from "@mui/material"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import CancelIcon from "@mui/icons-material/Cancel"
import "./ProductReviewItem.scss"

const ProductReviewItem = ({ product, onReviewChange }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [images, setImages] = useState([])
  const maxImages = 5
  const maxCharacters = 500

  const handleRatingChange = (event, newValue) => {
    setRating(newValue)
    onReviewChange(product.id, { rating: newValue, comment, images })
  }

  const handleCommentChange = (event) => {
    const newComment = event.target.value.slice(0, maxCharacters)
    setComment(newComment)
    onReviewChange(product.id, { rating, comment: newComment, images })
  }

  const handleImageUpload = (event) => {
    if (event.target.files && images.length < maxImages) {
      const newImages = [...images]
      const file = event.target.files[0]

      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          newImages.push(e.target.result)
          setImages(newImages)
          onReviewChange(product.id, { rating, comment, images: newImages })
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleRemoveImage = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    onReviewChange(product.id, { rating, comment, images: newImages })
  }

  return (
    <Box className="product-review-item">
      <Box className="product-info">
        <Box className="product-image-container">
          <img src={product.image || "images/glass.png"} alt={product.name} className="product-image" />
        </Box>
        <Box className="product-details">
          <Typography variant="h6" className="product-name">
            {product.name}
          </Typography>
          <Typography variant="body2" className="product-variant">
            Phân loại: {product.variant}
          </Typography>
          <Typography variant="body2" className="product-quantity">
            x {product.quantity}
          </Typography>
          <Typography variant="body2" className="product-price">
            {product.price.toLocaleString()} đ
          </Typography>
        </Box>
      </Box>

      <Box className="review-section">
        <Box className="rating-section">
          <Typography variant="body1" className="rating-label">
            Chất lượng sản phẩm
          </Typography>
          <Rating name={`rating-${product.id}`} value={rating} onChange={handleRatingChange} size="large" />
        </Box>

        <Box className="comment-section">
          <TextField
            fullWidth
            multiline
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
          <Typography variant="body2" className="images-label">
            Thêm hình ảnh
          </Typography>
          <Box className="images-container">
            {images.map((image, index) => (
              <Box key={index} className="image-preview-container">
                <img src={image || "/placeholder.svg"} alt={`Review ${index + 1}`} className="image-preview" />
                <IconButton className="remove-image-button" onClick={() => handleRemoveImage(index)}>
                  <CancelIcon />
                </IconButton>
              </Box>
            ))}
            {images.length < maxImages && (
              <Box className="upload-image-container">
                <input
                  accept="image/*"
                  id={`upload-image-${product.id}`}
                  type="file"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <label htmlFor={`upload-image-${product.id}`} className="upload-image-label">
                  <Box className="upload-image-box">
                    <AddPhotoAlternateIcon />
                  </Box>
                </label>
              </Box>
            )}
            {Array(Math.max(0, maxImages - images.length - 1))
              .fill(0)
              .map((_, index) => (
                <Box key={`placeholder-${index}`} className="image-placeholder" />
              ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ProductReviewItem
