import React, { useState, useEffect, useRef } from "react";
// import { X, Send, User } from 'lucide-react'
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import "./MessageSystem.scss";
import MessageList from "./MessageList";
import socket from "../../utils/Socket";
import { Box, IconButton, TextField } from "@mui/material";

const ConversationModal = ({
  message,
  onClose,
  conversations,
  unreadInfor,
  idStore,
  idAccount,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState(message);
  // const conversation = message;
  const messagesEndRef = useRef(null);

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // const contentRef = useRef(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");

  console.log("+++----message:", message);
  console.log("+++----conversations:", conversations);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // const filteredMessages = mockMessages.filter((message) => {
  //   // Filter by search query
  //   const matchesSearch =
  //     message.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

  //   // Filter by tab
  //   const matchesTab =
  //     activeTab === "all" || (activeTab === "unread" && !message.isRead);

  //   return matchesSearch && matchesTab;
  // });

  const filteredMessages = conversations?.filter((message) => {
    // Filter by search query
    const matchesSearch =
      message.Customer.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.Messages.at(-1)
        .Content.toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" &&
        unreadInfor.perConversation.find(
          (item) => item.conversationId === message.ID
        )?.unreadCount > 0);

    return matchesSearch && matchesTab;
  });

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    const messageData = {
      customerId: conversation.Customer.ID,
      content: newMessage,
      senderId: idAccount,
      conversationId: conversation.ID,
    };

    socket.emit("send_message", messageData);
    setNewMessage("");

    // if (newMessage.trim() === "") return;

    // const newMsg = {
    //   id: Date.now().toString(),
    //   text: newMessage,
    //   timestamp: new Date().toISOString(),
    //   sender: "me",
    // };

    // setConversation([...conversation, newMsg]);
    // setNewMessage("");
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      // second: "2-digit",
      hour12: false,
    });
  };
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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
      return formatMessageDate(date);
    }
  };

  const handleMessageClick = (newMessage) => {
    window.history.pushState({}, "", `?message=${newMessage.ID}`);
    message = newMessage;
    setConversation(newMessage);

    socket.emit("mark_messages_read", {
      conversationId: message.ID,
      readerId: idAccount,
    });
    // Lắng nghe khi có tin nhắn mới hoặc cập nhật
    socket.on("message_changed", () => {
      socket.emit("get_store_conversations", { storeId: idStore });
    });

    return () => {
      socket.off("message_changed");
    };
  };

  useEffect(() => {
    const handleMessageChanged = (data) => {
      console.log("++++===========data", data);
      if (!data || !data.conversationId) return;
      if (data.conversationId === conversation.ID) {
        // Đánh dấu đã đọc vì đang xem đúng conversation
        socket.emit("mark_messages_read", {
          conversationId: conversation.ID,
          readerId: idAccount,
        });
      }

      // Gửi yêu cầu reload lại toàn bộ danh sách hội thoại
      socket.emit("get_store_conversations", { storeId: idStore });
    };

    socket.on("message_changed", handleMessageChanged);

    return () => {
      socket.off("message_changed", handleMessageChanged);
    };
  }, [conversation?.ID, idAccount, idStore]);

  useEffect(() => {
    if (!conversation || !conversations) return;

    const updated = conversations.find((c) => c.ID === conversation.ID);
    if (updated) {
      setConversation(updated);
    }
  }, [conversations]);

  // // Lắng nghe tin nhắn từ server
  // useEffect(() => {
  //   socket.on("receive_message", (message) => {
  //     setMessages((prev) => [...prev, message]);
  //   });

  //   return () => {
  //     socket.off("receive_message");
  //   };
  // }, []);

  // useEffect(() => {
  //   if (open) {
  //     scrollToBottom();
  //   }
  // }, [messages, open]);
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

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
      editorId: idAccount,
    });
    setSelectedMessageId(null);
  };
  console.log("++++________conversation", conversation);
  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="conversation-modal messenger-style">
        <div className="conversation-sidebar">
          <div className="sidebar-header">
            <h2>Tin nhắn</h2>
            {/* <button className="close-button" onClick={onClose}>
              <CloseIcon size={20} />
            </button> */}
          </div>

          {/* <div className="search-container">
              <SearchIcon size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Tìm kiếm người nhắn" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div> */}

          <div className="search-container-conservation">
            <SearchIcon size={18} className="search-icon-conservation" />
            <input
              type="text"
              placeholder="Tìm kiếm người nhắn"
              value={searchQuery}
              onChange={handleSearch}
              className="search-input-conservation"
            />
          </div>

          <div className="tabs-conservation">
            <button
              className={`tab-conservation ${
                activeTab === "all" ? "active" : ""
              }`}
              onClick={() => handleTabChange("all")}
            >
              Tất cả
            </button>
            <button
              className={`tab-conservation ${
                activeTab === "unread" ? "active" : ""
              }`}
              onClick={() => handleTabChange("unread")}
            >
              Chưa đọc
            </button>
          </div>

          <MessageList
            messages={filteredMessages}
            activeMessageId={conversation.ID}
            onMessageClick={handleMessageClick}
            unreadInfor={unreadInfor}
          />
        </div>

        <div className="conversation-main">
          <div className="modal-header">
            <div className="contact-info">
              <div className="avatar">
                {conversation.Customer.Avatar ? (
                  <img
                    src={conversation.Customer.Avatar}
                    alt="Avatar"
                    onError={(e) => {
                      e.target.onerror = null; // Ngăn gọi lặp lại nếu ảnh fallback cũng lỗi
                      e.target.src = "images/avatar_no.png";
                    }}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <AccountCircleIcon size={24} />
                  </div>
                )}
              </div>
              <h2>{conversation.Customer.Name}</h2>
            </div>
            <button className="close-button" onClick={onClose}>
              <CloseIcon size={20} />
            </button>
          </div>

          <Box className="conversation-messages">
            {conversation?.Messages.map((msg) => {
              const isOwn = msg.Sender_ID === idAccount;
              const editable = isOwn && isEditable(msg.SendAt);
              const isEditing = selectedMessageId === msg.ID;
              return (
                <Box
                  className={`message-wrapper ${isOwn ? "sent" : "received"}`}  ref={boxRef}
                >
                  <Box className="message-bubble-wrapper">
                    {msg.IsEdited && (
                      <Box className={`note-edited ${isOwn ? "right" : "left"}`}>Đã chỉnh sửa</Box>
                    )}
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
                          <Box className="message-bubble-wrapper">
                            {/* {msg.IsEdited && (
                              <span className="note-edited">Đã chỉnh sửa</span>
                            )} */}
                            {/* <Box
                              className={`message-bubble ${
                                isOwn ? "sent" : "received"
                              }`}
                            > */}
                            <div className="message-text">{msg.Content}</div>
                            <div className="message-time">
                              {formatMessageTime(msg.SendAt) !==
                              formatTime(msg.SendAt)
                                ? formatMessageTime(msg.SendAt) +
                                  ", " +
                                  formatTime(msg.SendAt)
                                : formatTime(msg.SendAt)}
                            </div>
                            {/* </Box> */}
                          </Box>
                          {editable && (
                            <IconButton
                              size="small"
                              className="edit-icon"
                              onClick={() =>
                                handleEditMessage(msg.ID, msg.Content)
                              }
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
            })}
            <div ref={messagesEndRef} />
          </Box>

          <form className="message-composer" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Viết tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="message-input"
            />
            <button
              type="submit"
              className="send-button"
              disabled={newMessage.trim() === ""}
            >
              <SendIcon size={20} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ConversationModal;
