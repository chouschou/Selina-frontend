import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Image } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TabBar from "../../components/TabBar";
import "./ProductManagement.scss";
import AddProductModal from "../../components/AddProductModal";
import { getProductsByCategory } from "../../services/product/getProductsByCategory";
import {
  generateProductName,
  formatCurrencyVND,
  translateShapeToVietnamese,
} from "../../services/formatToShow";
import UpdateProductModal from "../../components/UpdateProductModal/UpdateProductModal";
import { deleteProduct } from "../../services/product/deleteProduct";
import DeleteButtonWithCheck from "../../components/DeleteProduct/DeleteButtonWithCheck";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal/ConfirmDeleteModal";
import { toast } from "react-toastify";

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState("Gọng kính");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [idx, setidx] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deletingVariantId, setDeletingVariantId] = useState(null);

  useEffect(() => {
    setidx(Math.floor(products.length / 100000));
  }, [products.length]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(deletingVariantId);
      setDeletingVariantId(null);
      fetchProductsByCategory();
    } catch (error) {
      toast.error("Lỗi khi xóa:", error);
    }
  };

  const fetchProductsByCategory = async () => {
    const response = await getProductsByCategory(activeTab);
    setProducts(response);
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, [activeTab]);

  const dataSource = products.flatMap((product, index) => {
    return product.GlassColors.map((variant, i) => ({
      key: `${product.ID}-${variant.ID}`,
      index: index + 1,
      productId: product.ID,
      isFirstRow: i === 0,
      rowSpan: product.GlassColors.length,
      image: variant.Images?.[0] || "",
      name: generateProductName(activeTab, idx, product.ID),
      shape: translateShapeToVietnamese(product.Shape),
      material: product.Material,
      color: variant.Color,
      quantity: variant.Quantity,
      price: variant.Price,
      discount: variant.Discount,
      status: variant.Status,
      variantId: variant.ID,
    }));
  });

  const shapeFilters = [
    ...new Set(products.map((p) => translateShapeToVietnamese(p.Shape))),
  ].map((shape) => ({
    text: shape,
    value: shape,
  }));

  const materialFilters = [...new Set(products.map((p) => p.Material))].map(
    (m) => ({
      text: m,
      value: m,
    })
  );

  const statusFilters = [
    { text: "Đang bán", value: "active" },
    { text: "Ngừng bán", value: "inactive" },
  ];

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      align: "center",
      render: (_, row) => (row.isFirstRow ? row.index : null),
      onCell: (row) => ({
        rowSpan: row.isFirstRow ? row.rowSpan : 0,
      }),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      align: "center",
      render: (image, row) => {
        if (!row.isFirstRow || !image) return null;

        return (
          <Image
            src={image}
            width={100}
            height={50}
            style={{ objectFit: "cover" }}
          />
        );
      },
      onCell: (row) => ({
        rowSpan: row.isFirstRow ? row.rowSpan : 0,
      }),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, row) => (row.isFirstRow ? name : null),
      onCell: (row) => ({
        rowSpan: row.isFirstRow ? row.rowSpan : 0,
      }),
    },
    {
      title: "Hình dáng",
      dataIndex: "shape",
      align: "center",
      filters: shapeFilters,
      onFilter: (value, record) => record.shape === value,
      render: (shape, row) => (row.isFirstRow ? shape : null),
      onCell: (row) => ({
        rowSpan: row.isFirstRow ? row.rowSpan : 0,
      }),
    },
    {
      title: "Chất liệu",
      dataIndex: "material",
      align: "center",
      filters: materialFilters,
      onFilter: (value, record) => record.material === value,
      render: (material, row) => (row.isFirstRow ? material : null),
      onCell: (row) => ({
        rowSpan: row.isFirstRow ? row.rowSpan : 0,
      }),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      align: "center",
      render: (color) => (
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: color,
            border: "1px solid #ccc",
            margin: "auto",
          }}
        />
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "center",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Số tiền",
      dataIndex: "price",
      align: "center",
      sorter: (a, b) => a.price - b.price,
      render: (price) => formatCurrencyVND(price),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      align: "center",
      render: (discount) => `${discount}%`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      filters: statusFilters,
      onFilter: (value, record) => record.status === value,
      render: (status) =>
        status === "active" ? (
          <Tag color="green">Đang bán</Tag>
        ) : (
          <Tag color="orange">Ngừng bán</Tag>
        ),
    },
    {
      title: "Xóa",
      dataIndex: "delete",
      align: "center",
      render: (_, row) => (
        <DeleteButtonWithCheck
          variantId={row.variantId}
          onClick={() => setDeletingVariantId(row.variantId)}
        />
      ),
    },
    {
      title: "Sửa",
      dataIndex: "edit",
      align: "center",
      render: (_, row) =>
        row.isFirstRow ? (
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setSelectedProductId(row.productId);
              handleOpenUpdateModal();
            }}
          />
        ) : null,
      onCell: (row) => ({
        rowSpan: row.isFirstRow ? row.rowSpan : 0,
      }),
    },
  ];

  return (
    <div className="product-management">
      <div className="header">
        <h1>Quản lý sản phẩm</h1>
        <Button type="primary" onClick={handleOpenModal}>
          Thêm sản phẩm
        </Button>
      </div>

      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
        locale={{
          emptyText: "Không có dữ liệu",
          filterReset: "Đặt lại",
          filterConfirm: "OK",
        }}
        rowClassName={(_, index) => (index % 2 === 0 ? "even-row" : "")}
      />

      <AddProductModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchProductsByCategory}
      />

      <UpdateProductModal
        open={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        productId={selectedProductId}
        onSuccess={fetchProductsByCategory}
      />

      <ConfirmDeleteModal
        open={!!deletingVariantId}
        onCancel={() => setDeletingVariantId(null)}
        onConfirm={handleDeleteConfirm}
        title="Cảnh báo"
        description="Bạn có chắc muốn xóa loại sản phẩm này không?"
        subDescription="Sau khi xóa bạn sẽ không thể khôi phục lại!"
      />
    </div>
  );
};

export default ProductManagement;
