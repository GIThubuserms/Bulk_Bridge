import { asynchandler } from "../utils/AsyncHandler.js";
import { Vendor } from "../models/vendorProfile.model.js";
import { Bid } from "../models/bid.model.js";
import ApiResponse from "../utils/ApiResponse.js";

/* ===============================
   GET PROFILE
================================= */
export const getVendorProfile = asynchandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });

  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: "Vendor profile not found",
    });
  }

  res.status(200).json(new ApiResponse(vendor,"Vendor Profile Fectched ",200))
});

/* ===============================
   PURCHASE CONNECTS
================================= */
export const purchaseConnect = asynchandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid connect amount",
    });
  }

  const vendor = await Vendor.findOne({ userId: req.user._id });

  vendor.connects += Number(amount);
  await vendor.save();

  res.status(200).json({
    success: true,
    data: vendor.connects,
  });
});

/* ===============================
   DASHBOARD
================================= */
export const getVendorDashboard = asynchandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });

  const totalBids = await Bid.countDocuments({
    vendorId: vendor._id,
  });

  const activeBids = await Bid.countDocuments({
    vendorId: vendor._id,
    status: "active",
  });

  const acceptedBids = await Bid.countDocuments({
    vendorId: vendor._id,
    status: "accepted",
  });

  res.status(200).json({
    success: true,
    data: {
      connects: vendor.connects,
      totalBids,
      activeBids,
      acceptedBids,
      completeorders: vendor.completeorders,
      rating: vendor.Rating,
    },
  });
});
