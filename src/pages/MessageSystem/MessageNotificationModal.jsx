import React, { useState } from 'react'
// import { Search, X } from 'lucide-react'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import MessageList from './MessageList'
import ConversationModal from './ConversationModal'
import { mockMessages } from '../../data/mockMessages'
import './MessageSystem.scss'

const MessageNotificationModal = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedMessage, setSelectedMessage] = useState(null)
    
    const handleTabChange = (tab) => {
      setActiveTab(tab)
    }
  
    const handleSearch = (e) => {
      setSearchQuery(e.target.value)
    }
  
    const filteredMessages = mockMessages.filter(message => {
      // Filter by search query
      const matchesSearch = message.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Filter by tab
      const matchesTab = activeTab === 'all' || 
                        (activeTab === 'unread' && !message.isRead)
      
      return matchesSearch && matchesTab
    })
  
    const handleMessageClick = (message) => {
      setSelectedMessage(message)
    }
  
    return (
      <>
        {!selectedMessage && (
          <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="message-notification-modal">
              <div className="modal-header">
                <h2>Tin nhắn</h2>
                <button className="close-button" onClick={onClose}>
                  <CloseIcon size={20} />
                </button>
              </div>
              
              <div className="search-container">
                <SearchIcon size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm người nhắn" 
                  value={searchQuery}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>
              
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => handleTabChange('all')}
                >
                  Tất cả
                </button>
                <button 
                  className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
                  onClick={() => handleTabChange('unread')}
                >
                  Chưa đọc
                </button>
              </div>
              
              <MessageList 
                messages={filteredMessages} 
                onMessageClick={handleMessageClick}
              />
            </div>
          </>
        )}
  
        {selectedMessage && (
          <ConversationModal 
            message={selectedMessage} 
            onClose={onClose}
          />
        )}
      </>
    )
  }
  
  export default MessageNotificationModal