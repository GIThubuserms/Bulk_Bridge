import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError";

const Userschema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
  },
  role: {
    type: String,
    enum: ["vendor", "purchaser"],
    required: true,
  },
});

// We ensure that password is save hashed form
Userschema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// We ensure that password is correct OR not
Userschema.methods.IsPasswordCorrect = async function (password) {
  if (!password) {
    return new ApiError(500, "Please Provide Password");
  }
  return await bcrypt.compare(password, this.password);
};

// We save the cokkies
Userschema.methods.accessToken = function () {
  return jwt.sign(
    {
      username: this.username,
      role: this.role,
      id: this._id,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: 200,
    },
  );
};

Userschema.methods.refreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "3d",
    },
  );
};

export const User = mongoose.model("User", Userschema);
