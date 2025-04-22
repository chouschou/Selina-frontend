import { Box, Typography, Avatar, Rating } from "@mui/material"
import "./ReviewItem.scss"

const ReviewItem = ({ review }) => {
  const { user, rating, date, comment, images } = review

  return (
    <Box className="review-item">
      <Box className="review-header">
        <Avatar src={user.avatar} alt={user.name} className="user-avatar" />
        <Box className="user-info">
          <Typography variant="subtitle2" className="user-name">
            {user.name}
          </Typography>
          <Box className="rating-date">
            <Rating value={rating} size="small" readOnly />
            <Typography variant="caption" className="review-date">
              {date}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography variant="body2" className="review-comment">
        {comment}
      </Typography>

      {images && images.length > 0 && (
        <Box className="review-images">
          {images.map((image, index) => (
            <img
              key={index}
              src={image || "/placeholder.svg"}
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
