import React from "react";
import { WhatsAppButton } from "./WhatsAppButton";

export function ChatMessage({ message, isTyping = false }) {
  // If this is a typing indicator
  if (isTyping) {
    return (
      <div className="cognoid-message-container bot">
        <div className="cognoid-message-bubble cognoid-typing-bubble">
          <span className="cognoid-typing-dot"></span>
          <span className="cognoid-typing-dot"></span>
          <span className="cognoid-typing-dot"></span>
        </div>
      </div>
    );
  }

  const { sender, text, show_whatsapp, whatsapp_link, time } = message;
  const messageTime = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`cognoid-message-container ${sender}`}>
      <div className="cognoid-message-bubble">
        {text}
        
        {sender === "bot" && show_whatsapp && whatsapp_link && (
          <WhatsAppButton link={whatsapp_link} />
        )}
      </div>
      <span className="cognoid-message-time">{messageTime}</span>
    </div>
  );
}
