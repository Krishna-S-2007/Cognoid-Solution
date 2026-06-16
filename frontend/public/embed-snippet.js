/**
 * Cognoid AI Chatbot Embed Snippet
 * 
 * To deploy the Cognoid AI Chatbot onto any website, copy and paste the following script tag
 * right before the closing </body> tag:
 * 
 * <script src="https://cognoid-chatbot.vercel.app/embed-snippet.js" defer></script>
 */

(function () {
  // Prevent duplicate loading
  if (window.__CognoidChatbotLoaded) return;
  window.__CognoidChatbotLoaded = true;

  // Configuration
  const WIDGET_URL = "https://cognoid-chatbot.vercel.app"; // Pointing to production URL
  const IFRAME_ID = "cognoid-chatbot-iframe";
  
  // Dimensions
  const SIZE_BUBBLE = { width: "110px", height: "110px" }; // Extra padding for scale-up animations
  const SIZE_WINDOW = { width: "450px", height: "740px" };

  // Create the shadow DOM container to prevent host website CSS from breaking our widget
  const container = document.createElement("div");
  container.id = "cognoid-chatbot-container";
  container.style.position = "fixed";
  container.style.bottom = "0";
  container.style.right = "0";
  container.style.width = SIZE_BUBBLE.width;
  container.style.height = SIZE_BUBBLE.height;
  container.style.zIndex = "999999";
  container.style.overflow = "hidden";
  container.style.transition = "width 0.3s cubic-bezier(0.165, 0.84, 0.44, 1), height 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)";
  
  // Attach shadow root
  const shadowRoot = container.attachShadow({ mode: "closed" });

  // Create the iframe
  const iframe = document.createElement("iframe");
  iframe.id = IFRAME_ID;
  iframe.src = WIDGET_URL;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.background = "transparent";
  iframe.style.colorScheme = "dark"; // Force dark scrollbars inside iframe
  iframe.setAttribute("scrolling", "no");

  // Mount iframe in Shadow DOM
  shadowRoot.appendChild(iframe);
  
  // Append container to host webpage
  document.body.appendChild(container);

  // Listen for messages from the iframe React App to dynamically resize the container
  window.addEventListener("message", function (event) {
    // Only accept messages from our designated widget URL
    if (event.origin !== WIDGET_URL) return;

    const data = event.data;
    if (data && typeof data === "object") {
      if (data.type === "COGNOID_CHAT_TOGGLE") {
        if (data.isOpen) {
          // Open state: Expand the container box
          container.style.width = SIZE_WINDOW.width;
          container.style.height = SIZE_WINDOW.height;
        } else {
          // Closed state: Shrink back to floating bubble size
          container.style.width = SIZE_BUBBLE.width;
          container.style.height = SIZE_BUBBLE.height;
        }
      }
    }
  });
})();
