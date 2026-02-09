import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { Order } from "../models/orders.model.js";
import { Bid } from "../models/bid.model.js";


export const postOrder = asynchandler(async (req, res) => {
  const {
    title,
    category,
    description,
    quantity,
    budgetMin,
    budgetMax,
    deadline,
  } = req.body;

  const fields = [
    title,
    category,
    description,
    quantity,
    budgetMin,
    budgetMax,
    deadline,
  ];

  for (const value of fields) {
    if (!value) {
      throw new ApiError(400, "All fields are required");
    }
  }

  const newOrder = await Order.create({
    purchaserId: req.user._id,
    title,
    category,
    description,
    quantity,
    budgetMin,
    budgetMax,
    deadline,
  });

  return res
    .status(201)
    .json(new ApiResponse(newOrder, "Order created successfully", 201));
});


export const getAllOrders = asynchandler(async (req, res) => {
  const orders = await Order.find({ status: "open" })
    .populate("purchaserId", "username email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(orders, "Orders fetched successfully", 200));
});


export const getOrderById = asynchandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate("purchaserId", "username email")
    .populate("selectedVendorId", "username email");

  if (!order) throw new ApiError(404, "Order not found");

  return res
    .status(200)
    .json(new ApiResponse(order, "Order fetched successfully", 200));
});


export const getMyOrders = asynchandler(async (req, res) => {
  const orders = await Order.find({
    purchaserId: req.user._id,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(orders, "Your orders fetched", 200));
});


export const getAllBids = asynchandler(async (req, res) => {
  const { orderId } = req.params;

  const bids = await Bid.find({ orderId })
    .populate("vendorId", "username email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(bids, "Bids fetched successfully", 200));
});


export const closeOrder = asynchandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) throw new ApiError(404, "Order not found");

  if (order.purchaserId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  order.status = "completed";
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(order, "Order closed successfully", 200));
});


export const selectWinningBid = asynchandler(async (req, res) => {
  const { orderId, bidId } = req.params;

  const bid = await Bid.findById(bidId);
  if (!bid) throw new ApiError(404, "Bid not found");

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  if (order.selectedVendorId) {
    throw new ApiError(400, "Vendor already selected");
  }

  order.selectedVendorId = bid.vendorId;
  order.status = "In Progress";
  await order.save();

  return res.json(
    new ApiResponse(order, "Vendor selected successfully", 200)
  );
});
