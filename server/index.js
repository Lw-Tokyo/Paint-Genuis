// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const budgetRoutes = require("./routes/budgetRoutes");
const estimateRoutes = require("./routes/estimateRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Middleware
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/estimate", estimateRoutes);

// Test Endpoint
app.get("/", (req, res) => {
  res.send("Paint Genius Backend Running!");
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
