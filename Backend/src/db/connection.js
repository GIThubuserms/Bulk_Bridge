import mongoose from "mongoose";
import {MONGODB_NAME} from '../constants.js'

export default async function DBconnection(){
    try {
        console.log("MongoDB URI "+process.env.MONGODB_URI)
        await mongoose.connect(`${process.env.MONGODB_URI}/${MONGODB_NAME}`)
    } catch (error) {
        console.log("Error while connecting to DB")
        process.exit(1)
    }
}