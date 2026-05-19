import React, { useState, useEffect } from "react";

export function ChatBubble({ isOpen, onClick }) {
  const [showBadge, setShowBadge] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setShowBadge(false);
    }
  }, [isOpen]);

  return (
    <button
      className="cognoid-chat-bubble"
      onClick={onClick}
      aria-label="Toggle chat window"
    >
      {isOpen ? (
        // X icon
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      ) : (
        // Message icon
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      )}

      {showBadge && !isOpen && (
        <span className="cognoid-chat-badge">1</span>
      )}
    </button>
  );
}
