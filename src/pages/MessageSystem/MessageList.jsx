import React from 'react'
import MessageItem from './MessageItem'
import './MessageSystem.scss'

const MessageList = ({ messages, onMessageClick, activeMessageId }) => {
    if (messages.length === 0) {
      return (
        <div className="empty-messages">
          <p>Không có tin nhắn</p>
        </div>
      )
    }
  
    return (
      <div className="message-list">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onClick={() => onMessageClick(message)}
            isActive={message.id === activeMessageId}
          />
        ))}
      </div>
    )
  }
  
  export default MessageList