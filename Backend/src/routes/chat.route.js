import { sendMessage, getChatMessages,getMyChats } from "../controllers/chat.controller.js";
import { verifyUser } from '../middlewares/UserVerify.js'
import express from "express"

const Chatrouter = express.Router();


Chatrouter.route('/send').post(verifyUser,sendMessage)
Chatrouter.route('/:orderId/:receiverId/messages').get(verifyUser,getChatMessages)
Chatrouter.route('/my-chats').get(verifyUser,getMyChats)


export default Chatrouter;
