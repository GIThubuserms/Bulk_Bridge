import { asynchandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

export const verifyUser = asynchandler(async (req, res, next) => {
  // Take token from cokkies
  const token =
    req?.cookies?.accessToken ||
    req.header("Authentication")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "UnAuthorized User !!");
  }

  const decodedToken =await jwt.verify(token, process.env.ACCESS_TOKEN);

console.log("DecodedToken: ",decodedToken)
  
  if (!decodedToken) {
    throw new ApiError(402, "User is Not Authorized !!");
  }

  const verifiedUser = await User.findById(decodedToken?._id).select(
    "-password -refreshToken",
  );
  
  if (!verifiedUser) throw new ApiError(401, "User not found");

  req.user = verifiedUser;

  next();
});
