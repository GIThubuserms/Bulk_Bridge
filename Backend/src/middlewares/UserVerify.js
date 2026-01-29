import { asynchandler } from "../utils/AsyncHandler";
import jwt from "jsonwebtoken";

export const verifyUser = asynchandler(async (req, res, next) => {
  // Take token from cokkies
  const token =
    req?.cookies?.accessToken ||
    req.header("Authentication")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "UnAuthorized User !!");
  }

  const decodedToken = jwt.verify(token, process.env.accessToken);

  if (!decodedToken) {
    throw new ApiError(402, "User is Not Authorized !!");
  }

  const verifiedUser = await User.findById(decodedtoken?._id).select(
    "-password -refreshToken",
  );

  req.user = verifiedUser;

  next();
});
