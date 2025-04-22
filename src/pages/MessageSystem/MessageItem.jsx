import React from 'react'
// import { MoreVertical, User } from 'lucide-react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import './MessageSystem.scss'

const MessageItem = ({ message, onClick, isActive }) => {
    const { contact, lastMessage, timestamp, isRead } = message
  
    // Format timestamp
    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else if (diffDays === 1) {
        return 'Hôm qua'
      } else if (diffDays < 7) {
        const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
        return days[date.getDay()]
      } else {
        return date.toLocaleDateString()
      }
    }
  
    const displayTime = formatTime(timestamp)
  
    return (
      <div 
        className={`message-item ${!isRead ? 'unread' : ''} ${isActive ? 'active' : ''}`}
        onClick={onClick}
      >
        <div className="avatar">
          {contact.avatar ? (
            <img src={contact.avatar} alt={contact.name} />
          ) : (
            <div className="avatar-placeholder">
              <AccountCircleIcon size={20} />
            </div>
          )}
          {!isRead && <span className="unread-indicator"></span>}
        </div>
        
        <div className="message-content">
          <div className="message-header">
            <h3 className="contact-name">{contact.name}</h3>
            <span className="timestamp">{displayTime}</span>
          </div>
          <p className="message-preview">{lastMessage}</p>
        </div>
        
        <button className="more-button">
          <MoreVertIcon size={16} />
        </button>
      </div>
    )
  }
  
  export default MessageItem