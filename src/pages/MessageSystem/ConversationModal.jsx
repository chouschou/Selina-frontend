import React, { useState, useEffect, useRef } from "react";
// import { X, Send, User } from 'lucide-react'
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";

import { mockConversations, mockMessages } from "../../data/mockMessages";
import "./MessageSystem.scss";
import MessageList from "./MessageList";

const ConversationModal = ({ message, onClose }) => {
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const messagesEndRef = useRef(null);

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMessages = mockMessages.filter((message) => {
    // Filter by search query
    const matchesSearch =
      message.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tab
    const matchesTab =
      activeTab === "all" || (activeTab === "unread" && !message.isRead);

    return matchesSearch && matchesTab;
  });
  // Find the conversation for this contact
  useEffect(() => {
    const contactConversation = mockConversations.find(
      (convo) => convo.contactId === message.contact.id
    );

    if (contactConversation) {
      setConversation(contactConversation.messages);
    }
  }, [message]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    const newMsg = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date().toISOString(),
      sender: "me",
    };

    setConversation([...conversation, newMsg]);
    setNewMessage("");
  };

  // Format timestamp for messages
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Filter messages for the sidebar
  //   const filteredMessages = mockMessages.filter(
  //     (msg) =>
  //       msg.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       msg.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  //   )

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
            activeMessageId={message.id}
            onMessageClick={(newMessage) => {
              // Update the URL without refreshing the page
              window.history.pushState({}, "", `?message=${newMessage.id}`);
              // Update the active conversation
              message = newMessage;
              const contactConversation = mockConversations.find(
                (convo) => convo.contactId === newMessage.contact.id
              );
              if (contactConversation) {
                setConversation(contactConversation.messages);
              } else {
                setConversation([]);
              }
            }}
          />
        </div>

        <div className="conversation-main">
          <div className="modal-header">
            <div className="contact-info">
              <div className="avatar">
                {message.contact.avatar ? (
                  <img
                    src={message.contact.avatar}
                    alt={message.contact.name}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <AccountCircleIcon size={24} />
                  </div>
                )}
              </div>
              <h2>{message.contact.name}</h2>
            </div>
            <button className="close-button" onClick={onClose}>
              <CloseIcon size={20} />
            </button>
          </div>

          <div className="conversation-messages">
            {conversation.map((msg) => (
              <div
                key={msg.id}
                className={`message-bubble ${
                  msg.sender === "me" ? "sent" : "received"
                }`}
              >
                <div className="message-text">{msg.text}</div>
                <div className="message-time">
                  {formatMessageTime(msg.timestamp)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

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
