// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const budgetRoutes = require("./routes/budgetRoutes");
const estimateRoutes = require("./routes/estimateRoutes");
const contractorRoutes = require("./routes/contractorRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/estimate", estimateRoutes);
app.use("/api/contractors", contractorRoutes);

app.get("/", (req, res) => {
  res.send("Paint Genius Backend Running!");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
