// server/models/Contractor.js
const mongoose = require("mongoose");

const contractorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    services: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
      max: 50,
    },
    availability: {
      type: String,
      enum: ['Available', 'Busy', 'Unavailable'],
      default: 'Available',
    },
    hoursPerDay: {
      type: Number,
      default: 8,
      min: 4,
      max: 12,
    },
    workSpeed: {
      type: Number,
      default: 40,
      min: 20,
      max: 80,
    },
    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    portfolio: [{
      imageUrl: String,
      title: String,
      description: String,
      projectDate: Date,
    }],
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
    certifications: {
      type: [String],
      default: [],
    },
    insurance: {
      hasInsurance: { type: Boolean, default: false },
      provider: String,
      policyNumber: String,
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      linkedin: String,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

contractorSchema.index({ 'location.city': 1 });
contractorSchema.index({ services: 1 });
contractorSchema.index({ availability: 1 });
contractorSchema.index({ rating: -1 });

contractorSchema.virtual('fullLocation').get(function() {
  return `${this.location.city}${this.location.state ? ', ' + this.location.state : ''}`;
});

module.exports = mongoose.model("Contractor", contractorSchema);