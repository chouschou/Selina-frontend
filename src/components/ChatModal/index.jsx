import { useState, useRef, useEffect } from "react"
import { Box, Typography, IconButton, Avatar, TextField, InputAdornment } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import SendIcon from "@mui/icons-material/Send"
import { io } from "socket.io-client" //socket client
import "./ChatModal.scss"

const socket = io("http://localhost:3000") // URL backend WebSocket

const ChatModal = ({ open, onClose, conversationId, senderId }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)
  const contentRef = useRef(null)

  // Join conversation khi component mount
  useEffect(() => {
    if (open && conversationId) {
      socket.emit("joinConversation", conversationId)
    }
  }, [open, conversationId])

  // Lắng nghe tin nhắn từ server
  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off("newMessage")
    }
  }, [])

  useEffect(() => {
    if (open) scrollToBottom()
  }, [messages, open])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    const messageData = {
      conversationId,
      senderId,
      content: newMessage,
    }

    socket.emit("sendMessage", messageData)
    setNewMessage("")
  }

  if (!open) return null

  return (
    <Box className="chat-modal">
      <Box className="chat-modal-paper">
        <Box className="chat-header">
          <Box className="header-content">
            <Box className="brand-logo">
              <Typography variant="h6" className="brand-name">Selina</Typography>
            </Box>
            <IconButton onClick={onClose} className="close-button">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box className="chat-content" ref={contentRef}>
          <Box className="messages-container">
            {messages.map((message, index) => (
              <Box
                key={index}
                className={`message-wrapper ${message.senderId === senderId ? "user-message" : "agent-message"}`}
              >
                {message.senderId !== senderId && (
                  <Avatar src="/avatar-agent.jpg" alt="Agent" className="agent-avatar" />
                )}
                <Box className="message-bubble">
                  <Typography variant="body2" className="message-text">
                    {message.content}
                  </Typography>
                  <Typography variant="caption" className="message-time">
                    {new Date(message.sendAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
        </Box>

        <Box component="form" className="chat-input-container" onSubmit={handleSendMessage}>
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
                  <IconButton type="submit" className="send-button" disabled={newMessage.trim() === ""}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ChatModal
