// server/models/Order.js (FIXED VERSION)
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    estimate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectEstimate'
    },
    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contractor'
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
    }
  }],
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'cash'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    amount: Number,
    cardDetails: {
      last4: String,
      brand: String,
      expiryMonth: Number,
      expiryYear: Number
    }
  },
  billing: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  cancellationReason: String,
  cancelledAt: Date
}, {
  timestamps: true
});

// Generate order number BEFORE validation
orderSchema.pre('validate', async function(next) {
  if (this.isNew && !this.orderNumber) {
    try {
      const count = await mongoose.model('Order').countDocuments();
      this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(5, '0')}`;
      console.log('✅ Generated order number:', this.orderNumber);
    } catch (error) {
      console.error('❌ Error generating order number:', error);
      return next(error);
    }
  }
  next();
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);