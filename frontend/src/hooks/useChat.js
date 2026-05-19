import { useState } from "react";

export function useChat() {
    // 1. We define the state (memory) for our list of chat messages.
    // We seed it with a professional, premium B2B welcome message from Cognoid.
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello! Welcome to Cognoid Technology Solutions. How can I assist you with our Generative AI, Cloud, Cybersecurity, or Workplace Transformation services today?",
            show_whatsapp: false,
            whatsapp_link: null
        }
    ]);

    // 2. We define the state for our loading loader.
    // This turns true when we are waiting for FastAPI and Groq to reply.
    const [isLoading, setIsLoading] = useState(false);

    // 3. This is the main function that coordinates the event flow when sending a message.
    const sendMessage = async (text) => {
        if (!text.trim()) return; // Prevent sending blank messages

        // Step A: Immediately add the user's message to the state so it renders on screen.
        const userMsg = {
            sender: "user",
            text: text
        };
        setMessages((prev) => [...prev, userMsg]);

        // Step B: Turn on the bouncing typing loader indicator
        setIsLoading(true);

        try {
            // Step C: Make a standard network call to our FastAPI server
            const response = await fetch("https://cognoid-solution.onrender.com/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // We package the data exactly matching the ChatRequest schema in schema.py
                body: JSON.stringify({ message: text }),
            });

            if (!response.ok) {
                throw new Error("Server responded with an error status code");
            }

            // Step D: Extract the verified ChatResponse JSON from the server response
            const data = await response.json();

            // Step E: Package the bot reply with its escalation indicators
            const botMsg = {
                sender: "bot",
                text: data.reply,
                show_whatsapp: data.show_whatsapp,
                whatsapp_link: data.whatsapp_link
            };

            // Step F: Append the bot's reply to the message history state
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat API connection failure:", error);
            // Step G: If the server is offline or fails, append a professional fallback error bubble
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "I apologize, but I am currently having trouble connecting to my central servers. Please ensure your local FastAPI backend is active and running on port 8000!",
                    show_whatsapp: true, // Show WhatsApp CTA as secondary support fallback
                    whatsapp_link: "https://wa.me/9962373399" // Fallback number directly
                }
            ]);
        } finally {
            // Step H: Turn off the typing loading dots
            setIsLoading(false);
        }
    };

    // We return these state properties so our components (ChatWindow, ChatBubble) can consume them!
    return {
        messages,
        isLoading,
        sendMessage
    };
}
