import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext.jsx";

const ChatContext = createContext(null);
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function ChatProvider({ children }) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState({});
  const [loadingChats, setLoadingChats] = useState({});

  // Load messages for a chatId
  const loadMessages = useCallback(async (chatId) => {
    if (!profile) return;

    try {
      setLoadingChats((prev) => ({ ...prev, [chatId]: true }));

      const res = await fetch(`${BASE_URL}/api/v1/chats/${chatId}/messages`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();

      setMessages((prev) => ({ ...prev, [chatId]: data.messages || [] }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChats((prev) => ({ ...prev, [chatId]: false }));
    }
  }, [profile]);

  // Send a message
  const sendMessage = async (chatId, content, receiverId) => {
    if (!content || !profile) return;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/chats/${chatId}/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          receiverId,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      const data = await res.json();

      // Update messages state
      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), data.message],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, loadMessages, sendMessage, loadingChats }}>
      {children}
    </ChatContext.Provider>
  );
}

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
}
