import { useState } from "react"
import { Box, Typography, Button } from "@mui/material"
import ReviewItem from "../ReviewItem"
import "./ReviewList.scss"

const ReviewList = ({ reviews }) => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Filter reviews based on active tab
  const getFilteredReviews = () => {
    if (activeTab === 0) return reviews // All reviews
    return reviews.filter((review) => review.Value === 6 - activeTab) // 5, 4, 3, 2, 1 stars
  }

  const filteredReviews = getFilteredReviews()

  return (
    <Box className="review-list">
      <Box className="review-tabs">
        <Button
          variant={activeTab === 0 ? "contained" : "outlined"}
          className={`tab-button ${activeTab === 0 ? "active" : ""}`}
          onClick={() => handleTabChange(null, 0)}
        >
          Tất cả
        </Button>
        {[5, 4, 3, 2, 1].map((stars) => (
          <Button
            key={stars}
            variant={activeTab === 6 - stars ? "contained" : "outlined"}
            className={`tab-button ${activeTab === 6 - stars ? "active" : ""}`}
            onClick={() => handleTabChange(null, 6 - stars)}
          >
            {stars} ★
          </Button>
        ))}
      </Box>

      <Box className="reviews-container">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => <ReviewItem key={review.ID} review={review} />)
        ) : (
          <Typography className="no-reviews">Không có đánh giá nào trong mục này</Typography>
        )}
      </Box>
    </Box>
  )
}

export default ReviewList
