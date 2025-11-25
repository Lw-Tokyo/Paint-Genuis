// server/models/Discount.js 

const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  code: {
    type: String,
    uppercase: true,
    sparse: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'tiered', 'bundle'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  applicableTo: {
    type: String,
    enum: ['timeline', 'budget', 'coverage', 'contractor', 'all'],
    default: 'all'
  },
  conditions: {
    minRooms: { type: Number, default: 0 },
    minArea: { type: Number, default: 0 },
    minBudget: { type: Number, default: 0 },
    projectTypes: [{ type: String, enum: ['interior', 'exterior', 'both'] }],
    wallConditions: [{ type: String }],
    requiresPrimer: { type: Boolean, default: null },
    requiresCeiling: { type: Boolean, default: null },
    minCoats: { type: Number, default: 0 },
    firstTimeUser: { type: Boolean, default: false }
  },
  tiers: [{
    minQuantity: Number,
    discountValue: Number
  }],
  bundleItems: [{
    item: String,
    required: Boolean
  }],
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    default: null
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxUsagePerUser: {
    type: Number,
    default: null
  },
  maxTotalUsage: {
    type: Number,
    default: null
  },
  currentUsageCount: {
    type: Number,
    default: 0
  },
  usedBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    usedAt: { type: Date, default: Date.now },
    projectDetails: Object,
    discountAmount: Number
  }],
  priority: {
    type: Number,
    default: 0
  },
  stackable: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

discountSchema.index({ code: 1 });
discountSchema.index({ contractorId: 1 });
discountSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

discountSchema.methods.isValid = function() {
  const now = new Date();
  return this.isActive && 
         this.startDate <= now && 
         this.endDate >= now &&
         (this.maxTotalUsage === null || this.currentUsageCount < this.maxTotalUsage);
};

discountSchema.methods.canUserUse = function(userId) {
  if (!this.maxUsagePerUser) return true;
  
  const userUsageCount = this.usedBy.filter(
    usage => usage.userId.toString() === userId.toString()
  ).length;
  
  return userUsageCount < this.maxUsagePerUser;
};

module.exports = mongoose.model('Discount', discountSchema);