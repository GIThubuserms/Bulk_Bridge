import express, { urlencoded } from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();


app.use(cors())
app.use(cookieParser())
app.use(urlencoded({extended:true,limit:'16kb'}))
app.use(express.json({limit:'16kb'}))

// ---------------ROUTES----------------

import { UserRouter } from "./routes/user.route.js";

app.get("/api/v1/users",UserRouter)


export default app
