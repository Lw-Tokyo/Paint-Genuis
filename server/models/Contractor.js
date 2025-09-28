// server/models/Contractor.js
const mongoose = require("mongoose");

const contractorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    location: {
      city: { type: String, required: [true, "City is required"] },
      state: { type: String }, // make optional if you want
    },
    services: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      default: 0,
    },
    availability: {
      type: String,
      default: "", // optional
    },
    bio: {
      type: String,
      default: "", // optional
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contractor", contractorSchema);
