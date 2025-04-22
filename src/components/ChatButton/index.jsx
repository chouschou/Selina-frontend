import { useState, useEffect } from "react"
import { Box, Badge, Tooltip } from "@mui/material"
import ChatBubbleIcon from "@mui/icons-material/ChatBubble"
import ChatModal from "../ChatModal"
import "./ChatButton.scss"

const ChatButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    // Simulate receiving a new message after 3 seconds on first load
    if (isFirstLoad) {
      const timer = setTimeout(() => {
        setHasNewMessage(true)
        setIsFirstLoad(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isFirstLoad])

  const handleOpenChat = () => {
    setIsModalOpen(true)
    setHasNewMessage(false)
  }

  const handleCloseChat = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Tooltip title="Chat với nhân viên tư vấn" placement="left" arrow>
        <Box className="chat-button-container" onClick={handleOpenChat}>
          <Badge color="error" variant="dot" invisible={!hasNewMessage} className="chat-badge">
            <Box className="chat-button">
              <ChatBubbleIcon className="chat-icon" />
            </Box>
          </Badge>
        </Box>
      </Tooltip>

      <ChatModal open={isModalOpen} onClose={handleCloseChat} />
    </>
  )
}

export default ChatButton
