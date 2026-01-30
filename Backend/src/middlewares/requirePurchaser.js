import ApiError from "../utils/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler.js";

export const requirePurchaser = asynchandler(async (req, res, next) => {
  if (req.user.role != "purchaser") {
    throw new ApiError(400, "UnAuthorized Access !!");
  }
  next();
});
