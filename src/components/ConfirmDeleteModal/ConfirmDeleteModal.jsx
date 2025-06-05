import React from "react";
import { Modal, Button } from "antd";
import "./ConfirmDeleteModal.scss";

const ConfirmDeleteModal = ({
  open,
  onCancel,
  onConfirm,
  title = "Cảnh báo",
  description = "Bạn có chắc muốn xóa suất chiếu này không?",
  subDescription = "Sau khi xóa bạn sẽ không thể khôi phục lại!",
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closable
      className="custom-delete-modal"
    >
      <h2 className="modal-title">{title}</h2>
      <p className="modal-description">{description}</p>
      <p className="modal-subdescription">{subDescription}</p>
      <div className="modal-actions">
        <Button onClick={onCancel} className="cancel-button">
          Hủy
        </Button>
        <Button  type="primary" onClick={onConfirm} className="delete-button">
          Xóa
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
