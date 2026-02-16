/* eslint-disable react/prop-types */

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.jsx";

const ChatContext = createContext();
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);

  const [messages, setMessages] = useState({});
  const [loadingChats, setLoadingChats] = useState({});
  const [chatList, setChatList] = useState([]);
  const [loadingChatList, setLoadingChatList] = useState(false);

  useEffect(() => {
    if (!user) return;
    socketRef.current = io(BASE_URL);

    socketRef.current.on("receive_message", (newMessage) => {
      const chatId = newMessage.chatId;
      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      }));
    });

    return () => socketRef.current.disconnect();
  }, [user]);

  const loadMessages = async (orderId, receiverId) => {
    if (!orderId || !receiverId) return null;
    setLoadingChats((prev) => ({ ...prev, [orderId]: true }));

    try {
      let res = await fetch(`${BASE_URL}/api/v1/chat/${orderId}/${receiverId}/messages`, {
        credentials: "include",
      });

      if (res.status === 404) {
        const createRes = await fetch(`${BASE_URL}/api/v1/chat/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            orderId,
            receiverId,
            message: "Chat initialized",
          }),
        });

        await createRes.json();

        res = await fetch(`${BASE_URL}/api/v1/chat/${orderId}/messages`, {
          credentials: "include",
        });
      }

      const data = await res.json();
      setMessages((prev) => ({
        ...prev,
        [orderId]: data.messages || [],
      }));

      return { chatId: orderId };
    } catch (err) {
      console.error("loadMessages error:", err);
      return null;
    } finally {
      setLoadingChats((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const sendMessage = async (chatId, receiverId, message) => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId: chatId, receiverId, message }),
      });

      const data = await res.json();

      if (socketRef.current && data.message) {
        socketRef.current.emit("send_message", data.message);
      }

      // Local update
      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), data.message],
      }));

      return data.message;
    } catch (err) {
      console.error("sendMessage error:", err);
      return null;
    }
  };

  const loadChatList = async () => {
    if (!user) return;
    setLoadingChatList(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/chat/my-chats`, {
        credentials: "include",
      });
      const data = await res.json();
      setChatList(data.chats || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChatList(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loadMessages,
        sendMessage,
        joinChat: (chatId) => socketRef.current?.emit("join_chat", chatId),
        loadingChats,
        chatList,
        loadChatList,
        loadingChatList,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
