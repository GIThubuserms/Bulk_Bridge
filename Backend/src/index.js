import dotenv from "dotenv";
import path from "path";
import app from "./app.js";
import DBconnection from "./db/connection.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const PORT = 4000;

// WEB SOCKETS CONNECTION
// -------------------------------

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client Connected Id : ", socket.id);

  socket.on("join_chat", (chatid) => {
    socket.join(`chat_${chatid}`);
    console.log(`User joined chat_${chatid}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// -------------------------------

app.get("/", (req, res) => {
  res.json("Helloworld");
});

DBconnection()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
    console.log("✅ Database connected successfully");
  })
  .catch((error) => {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  });
