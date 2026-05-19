import React, { useState, useEffect } from "react";
import { useChat } from "./hooks/useChat";
import { ChatBubble } from "./components/ChatBubble";
import { ChatWindow } from "./components/ChatWindow";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage } = useChat();

  // Notify embedding parent window of open/closed toggles
  useEffect(() => {
    window.parent.postMessage({ type: "COGNOID_CHAT_TOGGLE", isOpen }, "*");
  }, [isOpen]);

  return (
    <>
      {/* Premium Branded Background Demo Page */}
      <main className="demo-container">
        <div className="demo-badge">Development & Sandbox Environment</div>
        <h1 className="demo-title">Cognoid Technology Solutions</h1>
        <p className="demo-subtitle">
          Next-generation Enterprise ServiceNow, Cloud Migration, Cybersecurity, 
          and custom Generative AI solutions. This portal is configured for local sandbox integration testing.
        </p>

        {/* Demo Card: Chatbot Snippet */}
        <div className="demo-card">
          <h3>Integrate Cognoid Chatbot Widget</h3>
          <p>
            To deploy this glowing, glassmorphic chatbot onto any corporate webpage, 
            simply copy the secure Javascript injection script below and paste it before the closing 
            <code>&lt;/body&gt;</code> tag on your site.
          </p>
          <code>
            {`<script src="https://cognoid-chatbot.vercel.app/embed-snippet.js" defer></script>`}
          </code>
        </div>

        {/* Brand Capabilities Showcase */}
        <div className="demo-features">
          <div className="demo-feature-item">
            <h4>ServiceNow Solutions</h4>
            <p>Tailored implementation of ITSM, SecOps, and Asset Management systems.</p>
          </div>
          <div className="demo-feature-item">
            <h4>Generative AI</h4>
            <p>Custom LLM training, autonomous chatbot workflows, and semantic systems.</p>
          </div>
          <div className="demo-feature-item">
            <h4>Cloud & Infrastructure</h4>
            <p>Scalable cloud migrations, data center optimization, and hybrid architectures.</p>
          </div>
        </div>
      </main>

      {/* Floating Chat Trigger Bubble Button */}
      <ChatBubble
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* Expanded Sleek Chat Conversation Window */}
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />
    </>
  );
}

export default App;
