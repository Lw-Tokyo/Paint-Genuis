const mongoose = require("mongoose");

const dimensionSchema = new mongoose.Schema({
  length: Number,
  width: Number,
  height: Number,
  area: Number,
});

const historySchema = new mongoose.Schema({
  min: Number,
  max: Number,
  dimensions: dimensionSchema,
  estimate: Number,
  recommendations: {
    type: [String],
    enum: ["Standard", "Premium", "Luxury"],
  },
  coats: {
    type: Number,
    default: 3,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    dimensions: dimensionSchema,
    estimate: Number,
    recommendations: {
      type: [String],
      enum: ["Standard", "Premium", "Luxury"],
    },
    coats: {
      type: Number,
      default: 3,
    },
    history: [historySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
