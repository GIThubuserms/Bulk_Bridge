import { asynchandler } from "../utils/AsyncHandler.js";
import { Bid } from "../models/bid.model.js"
import { Vendor } from "../models/vendorProfile.model.js";


export const postBid = asynchandler(async (req, res) => {
  const { orderId } = req.params;
  const { message,totalPrice, productionTimeDays } = req.body;

  console.log("Order ID : ",orderId )
  console.log("totalPrice : ",totalPrice )
  console.log("message : ",message )

  const vendor = await Vendor.findOne({ userId: req.user._id });

  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }

  if (vendor.connects <= 0) {
    return res.status(400).json({
      message: "Not enough connects",
    });
  }

  const existingBid = await Bid.findOne({
    orderId,
    vendorId: vendor._id,
  });

  if (existingBid) {
    return res.status(400).json({
      message: "Already bid on this order",
    });
  }

  const bid = await Bid.create({
    orderId,
    vendorId: vendor._id,
    totalPrice,
    productionTimeDays,
    message,
  });

  vendor.connects -= 1;
  await vendor.save();

  res.status(201).json({
    success: true,
    data: bid,
  });
});

export const getMyBids = asynchandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });

  const bids = await Bid.find({
    vendorId: vendor._id,
  }).populate("orderId");

  res.status(200).json({
    success: true,
    data: bids,
  });
});

