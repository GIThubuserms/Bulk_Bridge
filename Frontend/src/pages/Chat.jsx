/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useChat } from "../context/ChatContext.jsx";
import { Send } from "lucide-react";

export default function Chat() {
  const { id } = useParams(); // chatId
  const chatId = id;
  const { profile } = useAuth();
  const { messages, loadMessages, sendMessage, loadingChats } = useChat();

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (profile) loadMessages(chatId);
    const interval = setInterval(() => loadMessages(chatId), 3000);
    return () => clearInterval(interval);
  }, [profile, chatId, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[chatId]]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile) return;

    // Assuming receiverId is extracted from chatId like "requestId:otherUserId"
    const [, receiverId] = chatId.split(":");

    await sendMessage(chatId, newMessage.trim(), receiverId);
    setNewMessage("");
  };

  const isLoading = loadingChats[chatId];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-96 text-slate-600">
          Loading messages...
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages[chatId]?.length === 0 ? (
              <div className="text-center text-slate-500 py-12">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages[chatId].map((msg) => {
                const isSender = msg.senderId === profile?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        isSender
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          isSender ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-200 p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
