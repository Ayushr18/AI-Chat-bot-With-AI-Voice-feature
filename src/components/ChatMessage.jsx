// src/components/ChatMessage.jsx
import React from 'react';
import './ChatMessage.css';

function ChatMessage({ message, sender, timestamp, isError }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message ${sender}-message ${isError ? 'error-message' : ''}`}>
      <div className="message-content">
        {message}
      </div>
      <div className="message-timestamp">
        {formatTime(timestamp)}
      </div>
    </div>
  );
}

export default ChatMessage;