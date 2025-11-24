import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error: ", error);
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required."));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json(new ApiResponse(409, {}, "Entered Email is already registered"));
  }

  const user = await User.create({ name, email, password });
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong while registering the user"));
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json(new ApiResponse(400, {}, "Email is required"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "No such user"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res.status(401).json(new ApiResponse(401, {}, "Invalid credentials"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json(new ApiResponse(401, {}, "Unauthorized request"));
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(401).json(new ApiResponse(401, {}, "Invalid refresh token"));
    }

    if (incomingRefreshToken !== user.refreshToken) {
      return res.status(401).json(new ApiResponse(401, {}, "Refresh token is expired"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const options = { httpOnly: true, secure: true };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed successfully"));
  } catch (error) {
    return res.status(401).json(new ApiResponse(401, {}, error?.message || "Invalid refresh token"));
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
};
