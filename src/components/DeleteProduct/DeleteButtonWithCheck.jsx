import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getOrderCountByColorId } from "../../services/product/getOrderCountByColorId";

const DeleteButtonWithCheck = ({ variantId, onClick }) => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await getOrderCountByColorId(variantId);
        setCount(res.count);
      } catch (err) {
        console.error("Failed to fetch order count", err);
        setCount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [variantId]);

  if (loading) return null;

  return (
    <Button
      danger
      icon={<DeleteOutlined />}
      size="small"
      disabled={count > 0}
      onClick={onClick}
    />
  );
};

export default DeleteButtonWithCheck;
