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

    socketRef.current = io(BASE_URL, {
      withCredentials: true,
    });

    socketRef.current.on("receive_message", (newMessage) => {
      const chatId = newMessage.chatId;

      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      }));
    });

    return () => socketRef.current?.disconnect();
  }, [user]);

  const loadMessages = async (orderId, receiverId) => {
    if (!orderId || !receiverId) return null;
    setLoadingChats((prev) => ({ ...prev, [orderId]: true }));

    try {
      let res = await fetch(
        `${BASE_URL}/api/v1/chat/${orderId}/${receiverId}/messages`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();
      const chatId = data.chatId;

      console.log("Chat Id from loading messages : ", chatId);
      if (chatId) {
        setMessages((prev) => ({
          ...prev,
          [chatId]: data.messages || [],
        }));
      }

      return chatId;
    } catch (err) {
      console.error("loadMessages error:", err);
      return null;
    } finally {
      setLoadingChats((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const sendMessage = async (orderId, chatId, receiverId, message) => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, receiverId, message }),
      });

      const data = await res.json();

      console.log("DATA RECIVED FROM SEND MESSAGE: ", data.message);

      if (socketRef.current && data.message) {
        socketRef.current.emit("send_message", data.message);
      }



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

  const joinChat = (chatId) => {
    socketRef.current?.emit("join_chat", chatId);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loadMessages,
        sendMessage,
        joinChat,
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
