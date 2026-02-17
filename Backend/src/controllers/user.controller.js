import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { generateAccessandRefreshTokens } from "../utils/TokenGenerator.js";
import { Vendor } from "../models/vendorProfile.model.js";

export const RegisterUser = asynchandler(async (req, res) => {
  const { username, email, password, role, bussinessname, description } =
    req.body;

  if (!username || !email || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }

  const isUserExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExist) {
    throw new ApiError(400, "User already exists");
  }

  const newUser = await User.create({
    username,
    email,
    password,
    role,
  });

  if (!newUser) {
    throw new ApiError(500, "User not created");
  }


  if (role === "vendor") {
    await Vendor.create({
      userId: newUser._id,
      bussinessname: bussinessname || "New Vendor",
      description: description || "Vendor description",
    });
  }


  const userVerify = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  return res.status(201).json(
    new ApiResponse(userVerify, "User registered successfully", 201)
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
