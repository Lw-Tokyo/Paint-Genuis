// server/models/Cart.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  estimate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectEstimate',
    required: true
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    required: true
  },
  projectDetails: {
    projectType: String,
    numberOfRooms: Number,
    roomSize: Number,
    description: String
  },
  pricing: {
    originalAmount: Number,
    discountAmount: Number,
    finalAmount: Number,
    appliedDiscounts: [{
      name: String,
      code: String,
      amount: Number
    }]
  },
  timeline: {
    totalDays: Number,
    startDate: Date,
    completionDate: Date
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  totalDiscount: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + (item.pricing.originalAmount || 0), 0);
  this.totalDiscount = this.items.reduce((sum, item) => sum + (item.pricing.discountAmount || 0), 0);
  this.finalAmount = this.items.reduce((sum, item) => sum + (item.pricing.finalAmount || 0), 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);