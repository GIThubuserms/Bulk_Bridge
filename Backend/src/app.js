import express, { urlencoded } from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();


const corsOptions = {
  origin: "http://localhost:5173", // or your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser())
app.use(urlencoded({extended:true,limit:'16kb'}))
app.use(express.json({limit:'16kb'}))

// ---------------ROUTES----------------

import { UserRouter } from "./routes/user.route.js";
import { OrderRouter } from "./routes/order.route.js";
import Bidrouter from "./routes/bid.route.js";
import Vendorrouter from "./routes/vendor.route.js";
import Chatrouter from "./routes/chat.route.js";

app.use("/api/v1/users",UserRouter)
app.use("/api/v1/orders",OrderRouter)
app.use("/api/v1/vendor",Vendorrouter)
app.use("/api/v1/bid",Bidrouter)
app.use("/api/v1/chat",Chatrouter)


export default app
