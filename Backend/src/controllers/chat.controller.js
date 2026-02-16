import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { io } from "../index.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { orderId, receiverId, message } = req.body;

    if (!orderId || !receiverId || !message) {
      return res.status(400).json({
        message: "orderId, receiverId and message are required",
      });
    }

    /* =============================
       FIND EXISTING CHAT
    ============================== */

    let chat = await Chat.findOne({
      orderId,
      senderId,
      receiverId,
    });

    if (!chat) {
      // Check the reverse too, in case roles swap
      chat = await Chat.findOne({
        orderId,
        senderId: receiverId,
        receiverId: senderId,
      });
    }

    /* =============================
       CREATE CHAT IF NOT EXISTS
    ============================== */

    if (!chat) {
      chat = await Chat.create({
        orderId,
        senderId: senderId,
        receiverId: receiverId,
      });
    }

    /* =============================
       CREATE MESSAGE
    ============================== */

    const newMessage = await Message.create({
      chatId: chat._id,
      senderId: senderId,
      message,
    });

    /* =============================
       EMIT SOCKET EVENT
    ============================== */

    io.to(`chat_${chat._id}`).emit("receive_message", newMessage);

    return res.status(200).json({
      success: true,
      chatId: chat._id,
      message: newMessage,
    });
  } catch (error) {
    console.log("SendMessage Error:", error);
    return res.status(500).json({
      message: "Error sending message",
    });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId, receiverId } = req.params;

    const chat = await Chat.findOne({
      orderId,
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const messages = await Message.find({ chatId: chat._id })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      chatId: chat._id,
      messages,
    });
  } catch (error) {
    console.error("GetChatMessages Error:", error);
    return res.status(500).json({
      message: "Error fetching messages",
    });
  }
};

export const getMyChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("orderId", "title")
      .populate("senderId", "username role")
      .populate("receiverId", "username role");

    const result = [];

    for (let chat of chats) {
      const lastMessage = await Message.findOne({ chatId: chat._id })
        .sort({ createdAt: -1 })
        .lean();

      const otherUser =
        chat.senderId._id.toString() === userId.toString()
          ? chat.receiverId
          : chat.senderId;

      result.push({
        _id: chat._id,
        order: chat.orderId,
        otherUser,
        lastMessage: lastMessage || null,
      });
    }

    console.log("MY CHATS: ", result);

    return res.status(200).json({
      success: true,
      chats: result,
    });
  } catch (err) {
    console.error("GetMyChats Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching chats",
    });
  }
};
