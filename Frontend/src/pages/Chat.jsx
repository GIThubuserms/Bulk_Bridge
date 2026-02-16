import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useChat } from "../context/ChatContext.jsx";
import { Send } from "lucide-react";

export default function Chat() {
  const { orderId, receiverId } = useParams();
  const { profile } = useAuth();
  const { messages, loadMessages, sendMessage, joinChat, loadingChats } = useChat();

  const [currentChatId, setCurrentChatId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!orderId || !receiverId) return;
    let cancelled = false;

    const initChat = async () => {
      const res = await loadMessages(orderId, receiverId);
      if (!cancelled && res?.chatId) {
        setCurrentChatId(res.chatId);
        joinChat(res.chatId);
      }
    };

    initChat();
    return () => (cancelled = true);
  }, [orderId, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatId, messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChatId) return;
    setSending(true);
    await sendMessage(currentChatId, receiverId, newMessage.trim());
    setNewMessage("");
    setSending(false);
  };

  const isLoading = loadingChats[currentChatId];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-96 text-slate-600">
          Loading messages...
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages[currentChatId]?.length === 0 ? (
              <div className="text-center text-slate-500 py-12">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages[currentChatId]?.map((msg) => {
                const isSender = msg.senderId?._id === profile?._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        isSender
                          ? sending
                            ? "bg-green-600 animate-pulse text-white"
                            : "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
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
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl outline-none"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl disabled:opacity-50 flex items-center space-x-2"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
