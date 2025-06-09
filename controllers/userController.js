import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    const { email, username, password, role } = req.body;
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
      refresh_token: null,
    });
    const { password: _, refresh_token: __, ...safeUserData } = newUser.toJSON();
    const accessToken = jwt.sign(safeUserData, process.env.JWT_SECRET, { expiresIn: "30s" });
    const refreshToken = jwt.sign(safeUserData, process.env.JWT_REFRESH_SECRET, { expiresIn: "2d" });
    await newUser.update({ refresh_token: refreshToken });
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
    const { email, username, password, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.update({ email, username, password, role });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
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
    const { password: _, refresh_token: __, ...safeUserData } = userPlain;
    const accessToken = jwt.sign(safeUserData, process.env.JWT_SECRET, { expiresIn: "30s" });
    const refreshToken = jwt.sign(safeUserData, process.env.JWT_REFRESH_SECRET, { expiresIn: "2d" });
    await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Login successful",
      accessToken,
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
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const userId = user.id;
    await User.update({ refresh_token: null }, { where: { id: userId } });
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
