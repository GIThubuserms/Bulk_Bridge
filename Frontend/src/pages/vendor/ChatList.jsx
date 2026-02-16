/* ChatList.jsx */
import { useEffect } from "react";
import { useChat } from "../../context/ChatContext.jsx";
import { useNavigate } from "react-router-dom";

export default function ChatList() {
  const { chatList, loadChatList, loadingChatList } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    loadChatList();
  }, []);

  if (loadingChatList) {
    return (
      <div className="flex items-center justify-center min-h-96 text-slate-600 text-lg">
        Loading chats...
      </div>
    );
  }

  if (!chatList || chatList.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500 text-lg">
        No chats yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-slate-800">
          Your Conversations
        </h2>

        <div className="grid gap-5">
          {chatList.map((chat) => {
            if (!chat?.otherUser) return null;

            return (
              <div
                key={chat._id}
                onClick={() =>  navigate(`/app/purchaser/chat/${chat.order._id}/${chat.otherUser._id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-slate-200 hover:border-blue-400 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition">
                      {chat.otherUser.username}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Order: {chat.order?.title || "No order title"}
                    </p>
                  </div>

                  <span className="text-xs text-slate-400">
                    {chat.lastMessage?.createdAt
                      ? new Date(chat.lastMessage.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <p className="mt-3 text-slate-600 text-sm truncate">
                  {chat.lastMessage?.message || "No messages yet"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
