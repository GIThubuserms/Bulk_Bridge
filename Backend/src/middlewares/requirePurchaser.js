import { log } from "console";
import ApiError from "../utils/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler.js";

export const requirePurchaser = asynchandler(async (req, res, next) => {
  console.log("User role : ",req.user.role )
  if (req.user.role != "purchaser") {
    throw new ApiError(400, "UnAuthorized Access !!");
  }
  next();
});
