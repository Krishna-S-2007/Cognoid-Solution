import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";

export function ChatWindow({ isOpen, onClose, messages, isLoading, onSendMessage }) {
  const [inputText, setInputText] = useState("");
  const bodyRef = useRef(null);

  // Auto-scroll to bottom of chat body on new messages or typing loading states
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  return (
    <div className="cognoid-chat-window">
      {/* Header section */}
      <div className="cognoid-chat-header">
        <div className="cognoid-chat-header-info">
          <div className="cognoid-chat-avatar">C</div>
          <div className="cognoid-chat-header-text">
            <h3>Cognoid AI</h3>
            <div className="cognoid-chat-status">
              <span className="cognoid-status-dot"></span>
              <span>Online Assistant</span>
            </div>
          </div>
        </div>
        <button
          className="cognoid-chat-close-btn"
          onClick={onClose}
          aria-label="Close chat"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Message history section */}
      <div className="cognoid-chat-body" ref={bodyRef}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && <ChatMessage isTyping={true} />}
      </div>

      {/* Input panel footer */}
      <form className="cognoid-chat-footer" onSubmit={handleSend}>
        <div className="cognoid-input-container">
          <input
            type="text"
            className="cognoid-chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="cognoid-send-btn"
          disabled={!inputText.trim() || isLoading}
          aria-label="Send message"
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}
