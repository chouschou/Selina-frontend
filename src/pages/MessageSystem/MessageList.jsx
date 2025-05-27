import React from 'react'
import MessageItem from './MessageItem'
import './MessageSystem.scss'
const MessageList = ({ messages, onMessageClick, activeMessageId, unreadInfor }) => {
  if (messages.length === 0) {
    return (
      <div className="empty-messages">
        <p>Không có tin nhắn</p>
      </div>
    );
  }

  // Sắp xếp giảm dần theo thời gian gửi của tin nhắn cuối cùng
  const sortedMessages = [...messages].sort((a, b) => {
    const timeA = new Date(a.Messages.at(-1)?.SendAt || 0).getTime();
    const timeB = new Date(b.Messages.at(-1)?.SendAt || 0).getTime();
    return timeB - timeA; // mới nhất lên đầu
  });

  return (
    <div className="message-list">
      {sortedMessages.map((message) => (
        <MessageItem
          key={message.ID}
          message={message}
          unreadInfor={unreadInfor}
          onClick={() => onMessageClick(message)}
          isActive={message.ID === activeMessageId}
        />
      ))}
    </div>
  );
};

export default MessageList;
