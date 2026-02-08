import { asynchandler } from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { Order } from "../models/orders.model.js";

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

  // validating that NO field is empty
  for (const key in fields) {
    if (!key || key == null) {
      return res
        .status(400)
        .json(new ApiResponse(null, "All Fields are required !!", 400));
    }
  }

  // Now Create a NEW order

  const newOrder = Order.create({
    title: title,
    category: category,
    description: description,
    quantity: quantity,
    budgetMax: budgetMax,
    budgetMin: budgetMin,
    deadline: deadline,
  });

  if (!newOrder) throw new ApiError(500, "Order Not Formed");

  return res.json(
    new ApiResponse(newOrder, "Order created successfully ", 200),
  );
});

export const getAllOrders = asynchandler(async (req, res) => {
    
});

export const getAllBids = asynchandler(async (req, res) => {});

export const getOrderById = asynchandler(async (req, res) => {});

export const updateOrder = asynchandler(async (req, res) => {});

export const getMyOrders = asynchandler(async (req, res) => {});
// purchaser sees only their orders

export const closeOrder = asynchandler(async (req, res) => {});
// stop accepting bids

export const deleteOrder = asynchandler(async (req, res) => {});
// only if no bid accepted

export const selectWinningBid = asynchandler(async (req, res) => {});
// purchaser selects vendor
