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

app.use("/api/v1/users",UserRouter)


export default app
