import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.send("API is working fine 🚀");
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend server is running! 🚀");
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📍 Test the API: http://localhost:${PORT}/api/test`);
});