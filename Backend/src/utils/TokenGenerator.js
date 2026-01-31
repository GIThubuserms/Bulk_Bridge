import { User } from "../models/user.model.js";

export const generateAccessandRefreshTokens = async (id) => {
  const user = await User.findById(id);

  const accessToken = user.genaccessToken();
  const refreshToken = user.genrefreshToken();

  // console.log("AccessToken : ",accessToken)
  // console.log("RefreshToken : ",refreshToken)

  user.refreshToken = refreshToken;

  await user.save({validateBeforeSave: false });

  return { accessToken, refreshToken };
};
