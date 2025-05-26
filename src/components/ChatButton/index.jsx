import { useState, useEffect, useContext } from "react";
import { Box, Badge, Tooltip } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ChatModal from "../ChatModal";
import "./ChatButton.scss";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { toast } from "react-toastify";

const ChatButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  const handleUnreadMessageStatus = (hasUnread) => {
    setHasNewMessage(hasUnread);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setIsModalOpen(false);
    }
  }, [isLoggedIn]);

  const handleOpenChat = () => {
    if (isLoggedIn === true) {
      setIsModalOpen(true);
      setHasNewMessage(false);
    } else {
      toast.error("Vui lòng đăng nhập!");
    }
  };

  const handleCloseChat = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Tooltip title="Chat với nhân viên tư vấn" placement="left" arrow>
        <Box className="chat-button-container" onClick={handleOpenChat}>
          <Badge
            color="error"
            variant="dot"
            invisible={!hasNewMessage}
            className="chat-badge"
          >
            <Box className="chat-button">
              <ChatBubbleIcon className="chat-icon" />
            </Box>
          </Badge>
        </Box>
      </Tooltip>

      <ChatModal open={isModalOpen} onClose={handleCloseChat} onUnreadMessageStatus={handleUnreadMessageStatus} />
    </>
  );
};

export default ChatButton;
