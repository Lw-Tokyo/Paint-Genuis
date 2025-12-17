// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ✅ Import routes
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const budgetRoutes = require("./routes/budgetRoutes");
const estimateRoutes = require("./routes/estimateRoutes");
const contractorRoutes = require("./routes/contractorRoutes");
const messageRoutes = require("./routes/messageRoutes"); // ✅ added
const timelineRoutes = require('./routes/timelineRoutes');
const discountRoutes = require('./routes/discountRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/estimate", estimateRoutes);
app.use("/api/contractors", contractorRoutes);
app.use("/api/messages", messageRoutes); // ✅ added
app.use('/api/timeline', timelineRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Paint Genius Backend Running!");
});

const PORT = process.env.PORT || 5000;

// ✅ DB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
