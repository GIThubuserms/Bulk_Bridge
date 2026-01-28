import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    productionTimeDays: {
      type: Number,
      required: true,
      min: 1,
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "accepted", "rejected"],
      default: "active",
    },
  },{ timestamps: true });


export default mongoose.model("Bid", bidSchema);
