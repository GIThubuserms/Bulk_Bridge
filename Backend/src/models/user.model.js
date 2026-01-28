import mongoose from "mongoose";
import { Schema } from "mongoose";

const Userschema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
  },
  password:{
    type: String,
    required:[true,"Password is required"]
  },
  refreshToken:{
    type: String
  },
  role:{
    type:String,
    enum:["vendor","purchaser"],
    required:true
  }

});


export const User=mongoose.model("User",Userschema);
