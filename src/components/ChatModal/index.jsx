import { useState, useRef, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import "./ChatModal.scss";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { getUserInfoByID } from "../../services/user/getUserInfoByID";
import MessageItem from "./MessageItem";

import socket from "../../utils/socket";
import { toast } from "react-toastify";

const ChatModal = ({ open, onClose, onUnreadMessageStatus }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const messagesEndRef = useRef(null);
  const contentRef = useRef(null);
  const { isLoggedIn, account } = useContext(AuthContext);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (open && conversationId && account?.ID) {
      socket.emit("mark_messages_read", {
        conversationId: conversationId,
        readerId: account.ID,
      });
      onUnreadMessageStatus(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, conversationId, account, messages.length]);

  useEffect(() => {
    const handleHistory = (history) => {
      setMessages(history);
      onUnreadMessageStatus(false);
    };

    socket.on("conversation_history", handleHistory);
    return () => {
      socket.off("conversation_history", handleHistory);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserInfo = async () => {
        const response = await getUserInfoByID(account?.ID, "customer");
        console.log("+++customer account:", response);
        setCustomerId(response?.ID);
      };
      fetchUserInfo();
    }
  }, [isLoggedIn, account?.ID]);
  useEffect(() => {
    if (isLoggedIn) {
      socket.emit("count_unread_messages", {
        idUser: customerId,
        accountId: account.ID,
        role: "customer",
      });
      socket.on("unread_messages_count", (count) => {
        console.log("unread_messages_count", count);
        if (count > 0) {
          onUnreadMessageStatus(true);
        } else {
          onUnreadMessageStatus(false);
        }
      });
      return () => {
        socket.off("unread_messages_count");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, account, customerId, messages]);

  // Join conversation khi component mount
  useEffect(() => {
    if (isLoggedIn) {
      console.log("+++customer id:", customerId);
      socket.emit("get_conversation", {
        customerId: customerId,
        storeId: 1,
      });
      socket.on("receive_conversation", (conversation) => {
        console.log("Đã lấy được conversation:", conversation);
        setConversationId(conversation?.ID);
      });

      console.log("conversation id:", conversationId);

      return () => {
        socket.off("receive_conversation");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, customerId]);
  useEffect(() => {
    if (isLoggedIn) {
      console.log("có vooooooooo");
      if (open && account && conversationId) {
        console.log("Joining conversation:-------------------", conversationId);
        socket.emit("get_conversation_history", conversationId);
        socket.emit("join_conversation", { conversationId });
      }

      // socket.on("conversation_history", (history) => {
      //   setMessages(history);
      // });

      // return () => {
      //   socket.off("conversation_history");
      // };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, conversationId]);

  // Lắng nghe tin nhắn từ server
  useEffect(() => {
    socket.on("receive_message", (message) => {
      console.log("Got message from server:", message);
      setMessages((prev) => [...prev, message]);

      // Cập nhật conversationId từ tin nhắn
      if (message.Conversation?.ID) {
        setConversationId(message.Conversation.ID);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("message_edited", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.ID === updatedMessage.ID ? updatedMessage : msg))
      );
      if (selectedMessageId === updatedMessage.ID) {
        setSelectedMessageId(null);
        setEditContent("");
      }
    });

    socket.on("edit_message_failed", (err) => {
      toast("Không thể chỉnh sửa tin nhắn: " + err);
    });

    return () => {
      socket.off("message_edited");
      socket.off("edit_message_failed");
    };
  }, [selectedMessageId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const messageData = {
      customerId: customerId,
      content: newMessage,
      senderId: account.ID,
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
    setConversationId(messageData.conversationId);
  };

  const isEditable = (sendAt) => {
    const sentTime = new Date(sendAt);
    const now = new Date();
    const diffMs = now.getTime() - sentTime.getTime();
    return diffMs <= 5 * 60 * 1000;
  };

  const handleEditMessage = (id, content) => {
    setSelectedMessageId(id);
    setEditContent(content);
  };

  const handleSaveEditedMessage = () => {
    socket.emit("edit_message", {
      messageId: selectedMessageId,
      newContent: editContent,
      editorId: account.ID,
    });
  };

  if (!open) return null;

  console.log("messages---", messages);

  return (
    <Box className="chat-modal">
      <Box className="chat-modal-paper">
        <Box className="chat-header">
          <Box className="header-content">
            <Box className="brand-logo">
              <Avatar
                src="/images/imgStore.png"
                alt="store"
                className="store-avatar"
              />
              <Typography variant="h6" className="brand-name">
                Selina
              </Typography>
            </Box>
            <IconButton onClick={onClose} className="close-button">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box className="chat-content" ref={contentRef}>
          <Box className="messages-container">
            {messages.map((message, index) => {
              const isOwn = message.Sender_ID === account?.ID;
              const editable = isOwn && isEditable(message.SendAt);
              const isEditing = selectedMessageId === message.ID;

              return (
                <MessageItem
                  key={index}
                  message={message}
                  isOwn={isOwn}
                  editable={editable}
                  isEditing={isEditing}
                  editContent={editContent}
                  setEditContent={setEditContent}
                  handleEditMessage={handleEditMessage}
                  handleSaveEditedMessage={handleSaveEditedMessage}
                  setSelectedMessageId={setSelectedMessageId}
                ></MessageItem>
              );
            })}

            <div ref={messagesEndRef} />
          </Box>
        </Box>

        <Box
          component="form"
          className="chat-input-container"
          onSubmit={handleSendMessage}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="chat-input"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    className="send-button"
                    disabled={newMessage.trim() === ""}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatModal;
