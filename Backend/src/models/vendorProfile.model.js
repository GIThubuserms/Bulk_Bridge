import { Schema } from "mongoose";
import mongoose from "mongoose";

const VendorProfile = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bussinessname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  connects: {
    type: Number,
    default: 10
  },
  completeorders: {
    type: Numbers,
    default: 1
  },
  Rating: {
    type: Numbers,
    default: 3
  },
},{timestamps:true});

export const Vendor=mongoose.model("Vendor",VendorProfile);

