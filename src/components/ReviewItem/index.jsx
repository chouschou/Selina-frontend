import { Box, Typography, Avatar, Rating } from "@mui/material"
import "./ReviewItem.scss"
import { formatDateTimeVN } from "../../services/formatDatetimeVN"

const ReviewItem = ({ review }) => {

  return (
    <Box className="review-item">
      <Box className="review-header">
        <Avatar src={review?.Customer.Avatar} alt={review.Customer.Name} className="user-avatar" />
        <Box className="user-info">
          <Typography variant="subtitle2" className="user-name">
            {review.Customer.Name}
          </Typography>
          <Box className="rating-date">
            <Rating value={review.Value} size="small" readOnly />
            <Typography variant="caption" className="review-date">
              {formatDateTimeVN(review.CreateAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography variant="body2" className="review-comment">
        {review.Comment}
      </Typography>

      {review.Images && review.Images.length > 0 && (
        <Box className="review-images">
          {review.Images.map((image, index) => (
            <img
              key={index}
              src={image.ImagePath || "/placeholder.svg"}
              alt={`Review image ${index + 1}`}
              className="review-image"
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default ReviewItem
