import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    purchaserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    budgetMin: {
      type: Number,
      required: true,
    },

    budgetMax: {
      type: Number,
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "open",
        "awarded",
        "completed",
        "cancelled",
      ],
      default: "open",
    },

    selectedVendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export const Order=mongoose.model("Order",orderSchema);

