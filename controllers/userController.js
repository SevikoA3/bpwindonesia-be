import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../util/cloudinary.js";
import streamifier from "streamifier";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      role,
      fullName,
      phone,
      birthDate,
      domicile,
      position,
      institution,
      industry,
      membershipTypeId,
    } = req.body;
    if (!username || !password) {
      const error = new Error("Username and password are required");
      error.statusCode = 400;
      throw error;
    }
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      role,
      fullName,
      phone,
      birthDate,
      domicile,
      position,
      institution,
      industry,
      membershipTypeId: membershipTypeId || 1,
      refreshToken: null,
    });
    const { password: _, refreshToken: __, ...safeUserData } = newUser.toJSON();
    const accessToken = jwt.sign(safeUserData, process.env.JWT_SECRET, { expiresIn: "60s" });
    const refreshToken = jwt.sign(safeUserData, process.env.JWT_REFRESH_SECRET, { expiresIn: "2d" });
    await newUser.update({ refreshToken: refreshToken });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      message: "User created successfully",
      accessToken,
      user: safeUserData,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      role,
      fullName,
      phone,
      birthDate,
      domicile,
      position,
      institution,
      industry,
      membershipTypeId,
    } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    let profile_pic_url = user.profile_pic_url;
    if (req.file) {
      const uploadResult = await streamUpload(req.file.buffer, {
        folder: "profile_pics",
        unique_filename: true,
        overwrite: true,
      });
      profile_pic_url = uploadResult.secure_url;
    }
    await user.update({
      email,
      username,
      password,
      role,
      fullName,
      phone,
      birthDate,
      domicile,
      position,
      institution,
      industry,
      membershipTypeId: membershipTypeId || 1,
      profile_pic_url,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    // Delete profile picture from Cloudinary if exists
    if (user.profile_pic_url) {
      try {
        // Extract public_id from the Cloudinary URL
        const urlParts = user.profile_pic_url.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const publicId = fileName.split(".")[0];
        await cloudinary.uploader.destroy(`profile_pics/${publicId}`);
      } catch (cloudErr) {
        // Log but do not block user deletion if Cloudinary fails
        console.error("Cloudinary deletion error:", cloudErr);
      }
    }
    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      const error = new Error("Username and password are required");
      error.statusCode = 400;
      throw error;
    }
    const user = await User.findOne({ where: { username } });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }
    const userPlain = user.toJSON();
    const { password: _, refreshToken: __, ...safeUserData } = userPlain;
    const accessToken = jwt.sign(safeUserData, process.env.JWT_SECRET, { expiresIn: "60s" });
    const refreshToken = jwt.sign(safeUserData, process.env.JWT_REFRESH_SECRET, { expiresIn: "2d" });
    await User.update({ refreshToken: refreshToken }, { where: { id: user.id } });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: safeUserData,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      const error = new Error("No refresh token provided");
      error.statusCode = 400;
      throw error;
    }
    const user = await User.findOne({ where: { refreshToken: refreshToken } });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const userId = user.id;
    await User.update({ refreshToken: null }, { where: { id: userId } });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    let refreshToken = req.cookies.refresh_token;
    if (!refreshToken && req.body.refreshToken) {
      refreshToken = req.body.refreshToken;
    }
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const user = await User.findOne({ where: { refreshToken: refreshToken } });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
      }
      const { password: _, refreshToken: __, ...safeUserData } = user.toJSON();
      const accessToken = jwt.sign(safeUserData, process.env.JWT_SECRET, { expiresIn: "1m" });
      res.status(200).json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

async function streamUpload(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}
