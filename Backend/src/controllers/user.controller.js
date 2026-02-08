import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { generateAccessandRefreshTokens } from "../utils/TokenGenerator.js";

export const RegisterUser = asynchandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  console.log("Username : " + username);
  if (!username || !email || !password || !role) {
    throw new ApiError(400, "All fields are required fields");
  }

  console.log("Testing 123");
  const IsuserExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (IsuserExist) {
    throw new ApiError(400, "User Already Exists");
  }

  console.log("Testing 123");

  const newUser = await User.create(req.body);
  console.log("Testing 123");

  if (!newUser) throw new ApiError(500, "User Not Formed");

  const userverify = await User.findById(newUser._id).select(
    "-password -refreshToken",
  );
  console.log("Testing 123");

  if (!userverify) throw new ApiError(500, "User not registred");

  console.log("Testing 123");

  return res.json(
    new ApiResponse(userverify, "User registered successfully ", 200),
  );
});

export const Login = asynchandler(async (req, res) => {
  const { password, username, email } = req.body;

  const user = await User.findOne({
    $or: [{ email }, { username }],
  }).select(" -refreshToken");

  if (!user) throw new ApiError(400, "User Does not Exits !!");

  const IspassCorrect = await user.IsPasswordCorrect(password);

  if (!IspassCorrect) throw new ApiError(402, "Password Is Not Correct !!");

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id,
  );

  console.log("AccessToken : ", accessToken);
  console.log("RefreshToken : ", refreshToken);

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(user, "User Login Successfully", 200));
});

export const Logout = asynchandler(async (req, res) => {
  const user = req.user;

  await User.findByIdAndUpdate(
    user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse({}, "User logged out Succesfully !!", 200));
});

export const getMe = asynchandler(async (req, res) => {
  const user = req.user;
  console.log("User from getme :",user)
  res.json(new ApiResponse(user, "User Fetched Successfully ", 200));
});
