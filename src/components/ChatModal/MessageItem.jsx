import { useRef, useEffect } from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { formatDateTimeVN } from "../../services/formatDatetimeVN";
import "./ChatModal.scss";

const MessageItem = ({
  message,
  isOwn,
  editable,
  isEditing,
  editContent,
  setEditContent,
  handleEditMessage,
  handleSaveEditedMessage,
  setSelectedMessageId,
}) => {
  const boxRef = useRef(null);

  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        boxRef.current &&
        !boxRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setSelectedMessageId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box
      ref={boxRef}
      className={`message-wrapper ${isOwn ? "user-message" : "store-message"}`}
    >
      <Box className="message-bubble-wrapper">
        {message.IsEdited && <span className="note-edited">Đã chỉnh sửa</span>}
        <Box className="message-bubble">
          {isEditing ? (
            <>
              <TextField
                inputRef={inputRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                size="small"
                fullWidth
                className="edit-textfield"
              />
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <IconButton
                  size="small"
                  onClick={handleSaveEditedMessage}
                  disabled={editContent.trim() === ""}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body2" className="message-text">
                {message.Content}
              </Typography>
              <Typography variant="caption" className="message-time">
                {formatDateTimeVN(message.SendAt)}
              </Typography>
              {editable && (
                <IconButton
                  size="small"
                  className="edit-icon"
                  onClick={() => handleEditMessage(message.ID, message.Content)}
                >
                  ✏️
                </IconButton>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MessageItem;
