const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const budgetRoutes = require("./routes/budgetRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/contact', contactRoutes);
app.use("/api/budget", budgetRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Paint Genius Backend Running!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const estimateRoutes = require("./routes/estimateRoutes");
app.use("/api/estimate", estimateRoutes);

app.get("/api/estimate", (req, res) => {
    res.json({ message: "Estimate route working" });
  });
  
  app.post("/api/estimate", (req, res) => {
    const { width, height } = req.body;
    const cost = width * height * 2; // example logic
    res.json({ estimatedCost: cost });
  });