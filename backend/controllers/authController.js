// backend/controllers/authController.js
const jwt  = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signToken = (userId, role) =>
    jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

const safeUser = (user) => ({
  _id:           user._id,
  name:          user.name,
  email:         user.email,
  role:          user.role,
  phone:         user.phone,
  notifications: user.notifications,
  status:        user.status,
});

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, yearsExperience, bio, certificates, expertStatus } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user  = await User.create({ name, email, password, role, yearsExperience, bio, certificates, expertStatus });
    const token = signToken(user._id, user.role);

    res.status(201).json({ token, user: safeUser(user) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({ message: "Account disabled. Contact support." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id, user.role);
    res.json({ token, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};