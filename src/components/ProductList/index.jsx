import { useState } from "react"
import { Box, Container, Typography, Grid, IconButton, Pagination } from "@mui/material"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import ProductItem from "../ProductItem"
import "./ProductList.scss"

const ProductList = ({ title, products }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 4

  // Calculate total pages
  const totalPages = Math.ceil(products.length / productsPerPage)

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  // Change page
  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  // Navigate to previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Navigate to next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <Container className="product-list-container">
      {title && (
        <Typography variant="h4" className="product-list-title">
          {title}
        </Typography>
      )}

      <Box className="product-slider">
        <IconButton className="slider-arrow prev-arrow" onClick={handlePrevPage} disabled={currentPage === 1}>
          <ArrowBackIosNewIcon />
        </IconButton>

        <Grid container spacing={3} className="products-grid">
          {currentProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductItem product={product} />
            </Grid>
          ))}
        </Grid>

        <IconButton className="slider-arrow next-arrow" onClick={handleNextPage} disabled={currentPage === totalPages}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      <Box className="pagination-container">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          size="small"
          className="pagination"
        />
      </Box>
    </Container>
  )
}

export default ProductList
