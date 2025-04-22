import { useState, useRef, useEffect } from "react"
import { Box, Typography, IconButton, Avatar, TextField, InputAdornment } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import SendIcon from "@mui/icons-material/Send"
import "./ChatModal.scss"

const ChatModal = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "agent",
      text: "Chào bạn, bạn muốn giúp gì ko ạ?",
      time: "14:00, 22/03/2025",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)
  const contentRef = useRef(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (open) {
      scrollToBottom()
    }
  }, [messages, open])

  // Focus input field when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const inputElement = document.querySelector(".chat-input input")
        if (inputElement) {
          inputElement.focus()
        }
      }, 100)
    }
  }, [open])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    const currentTime = new Date()
    const formattedTime = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, "0")}, ${String(
      currentTime.getDate(),
    ).padStart(2, "0")}/${String(currentTime.getMonth() + 1).padStart(2, "0")}/${currentTime.getFullYear()}`

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
      time: formattedTime,
    }
    setMessages([...messages, userMessage])
    setNewMessage("")

    // Simulate agent response after a short delay
    setTimeout(() => {
      const agentResponse = {
        id: messages.length + 2,
        sender: "agent",
        text: "Cảm ơn bạn đã liên hệ. Nhân viên tư vấn sẽ phản hồi trong thời gian sớm nhất.",
        time: formattedTime,
      }
      setMessages((prevMessages) => [...prevMessages, agentResponse])
    }, 1000)
  }

  if (!open) return null

  return (
    <Box className="chat-modal">
      <Box className="chat-modal-paper">
        <Box className="chat-header">
          <Box className="header-content">
            <Box className="brand-logo">
              <Typography variant="h6" className="brand-name">
                Selina
                {/* <span className="logo-icon">👓</span> */}
              </Typography>
            </Box>
            <IconButton onClick={onClose} className="close-button">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box className="chat-content" ref={contentRef}>
          <Box className="messages-container">
            {messages.map((message) => (
              <Box
                key={message.id}
                className={`message-wrapper ${message.sender === "user" ? "user-message" : "agent-message"}`}
              >
                {message.sender === "agent" && <Avatar src="/avatar-agent.jpg" alt="Agent" className="agent-avatar" />}
                <Box className="message-bubble">
                  <Typography variant="body2" className="message-text">
                    {message.text}
                  </Typography>
                  <Typography variant="caption" className="message-time">
                    {message.time}
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
