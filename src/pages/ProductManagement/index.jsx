import React, { useState } from "react"
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material"
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"
import TabBar from "../../components/TabBar"
import "./ProductManagement.scss"
import glass1 from "../../assets/images/glass1.png"
import AddProductModal from "../../components/AddProductModal"

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState("frames")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }
  const sampleProducts = [
    {
      id: 1,
      name: "Gọng kính A123",
      image: glass1,
      material: "Cotton",
      quantity: 100,
      price: 250000,
      discount: "10%",
    },
    {
      id: 2,
      name: "Gọng kính B123",
      image: "",
      material: "Silk",
      quantity: 50,
      price: 550000,
      discount: "15%",
    },
  ]
  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  return (
    <div className="product-management">
      <div className="header">
        <h1>Quản lý sản phẩm</h1>
        <button className="add-product-btn"  onClick={handleOpenModal}>Thêm sản phẩm</button>
      </div>

      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* <div className="product-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Hình dạng</th>
              <th>Chất liệu</th>
              <th>Số lượng</th>
              <th>Số tiền</th>
              <th>Giảm giá</th>
              <th>Sửa</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </div> */}
      <TableContainer
        component={Paper}
        elevation={0}
        className="table-container"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">STT</TableCell>
              <TableCell align="center">Hình ảnh</TableCell>
              <TableCell align="center">Tên sản phẩm</TableCell>
              <TableCell align="center">Chất liệu</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell align="center">Số tiền</TableCell>
              <TableCell align="center">Giảm giá</TableCell>
              <TableCell align="center">Sửa</TableCell>
              <TableCell align="center">Xóa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleProducts.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">
                  <Box className="product-image-placeholder"></Box>
                </TableCell>
                <TableCell align="center">{product.name}</TableCell>
                <TableCell align="center">{product.material}</TableCell>
                <TableCell align="center">{product.quantity}</TableCell>
                <TableCell align="center">
                  {product.price.toLocaleString()} ₫
                </TableCell>
                <TableCell align="center">{product.discount}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small">
                    <EditIcon className="edit-icon" />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton color="error" size="small">
                    <DeleteIcon className="delete-icon" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddProductModal
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default ProductManagement
