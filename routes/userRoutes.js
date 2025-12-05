import express from "express";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;  // ✅ Changed 'name' to 'username'

    console.log("Received data:", req.body);  // Debug log

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Save user (password will be hashed by the pre-save hook in the model)
    const newUser = await User.create({
      username,  // ✅ Changed to 'username'
      email,
      password,
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,  // ✅ Changed to 'username'
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Use the comparePassword method from the model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,  // ✅ Changed to 'username'
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET current user (verify token)
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,  // ✅ Changed to 'username'
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;