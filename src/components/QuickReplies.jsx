// src/components/QuickReplies.jsx
import React from 'react';
import './QuickReplies.css';

function QuickReplies({ options, onSelect, disabled }) {
  if (!options || options.length === 0) return null;

  return (
    <div className="quick-replies">
      <div className="quick-replies-label">Quick replies:</div>
      <div className="quick-replies-buttons">
        {options.map((option, index) => (
          <button
            key={index}
            className="quick-reply-btn"
            onClick={() => onSelect(option.value || option.label)}
            disabled={disabled}
          >
            {option.icon && <span className="quick-reply-icon">{option.icon}</span>}
            <span className="quick-reply-text">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickReplies;