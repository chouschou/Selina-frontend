// import { MoreVertical, User } from 'lucide-react'
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./MessageSystem.scss";
import { formatDateTimeVN } from "../../services/formatDatetimeVN";

const MessageItem = ({ message, onClick, isActive, unreadInfor }) => {
  // const { contact, lastMessage, timestamp, isRead } = message
  console.log("unreadInfor", unreadInfor);
  const unreadCount = unreadInfor.perConversation.find(
    (item) => item.conversationId === message.ID
  );

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else if (diffDays === 1) {
      return "Hôm qua";
    } else if (diffDays < 7) {
      const days = [
        "Chủ nhật",
        "Thứ hai",
        "Thứ ba",
        "Thứ tư",
        "Thứ năm",
        "Thứ sáu",
        "Thứ bảy",
      ];
      return days[date.getDay()];
    } else {
      return formatDateTimeVN(date);
    }
  };

  const displayTime = formatTime(message.Messages.at(-2)?.SendAt);

  return (
    <div
      className={`message-item ${
        unreadCount?.unreadCount > 0 ? "unread" : ""
      } ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="avatar">
        {message.Customer.Avatar ? (
          <img
            src={message.Customer.Avatar}
            alt="Avatar"
            onError={(e) => {
              e.target.onerror = null; // Ngăn gọi lặp lại nếu ảnh fallback cũng lỗi
              e.target.src = "images/avatar_no.png";
            }}
          />
        ) : (
          <div className="avatar-placeholder">
            <AccountCircleIcon size={20} />
          </div>
        )}
        {unreadCount?.unreadCount > 0 && (
          <span className="unread-indicator"></span>
        )}
      </div>

      <div className="message-content">
        <div className="message-header">
          <h3 className="contact-name">{message.Customer.Name}</h3>
          <span className="timestamp">{displayTime}</span>
        </div>
        <p className="message-preview">{message.Messages.at(-2)?.Content}</p>
      </div>

      <button className="more-button">
        <MoreVertIcon size={16} />
      </button>
    </div>
  );
};

export default MessageItem;
