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

  const newUser = await User.create({
    username,
    email,
    password,
    role,
  });

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

  const IspasswordCorrect = await user.IspasswordCorrect(password);

  if (!IspasswordCorrect) throw new ApiError(402, "Password Is Not Correct !!");

  const { AccessToken, RefreshToken } = await generateAccessandRefreshTokens(
    user._id,
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .cookie("accessToken", AccessToken, options)
    .cookie("refreshToken", RefreshToken, options)
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
  res.json(new ApiResponse(user, "User Fetched Successfully ", 200));
});
