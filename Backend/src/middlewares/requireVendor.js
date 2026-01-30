import ApiError from "../utils/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler.js";

export const requireVendor = asynchandler(async (req, res, next) => {
  if (req.user.role != "vendor") {
    throw new ApiError(400, "UnAuthorized Access !!");
  }
  next();
});
