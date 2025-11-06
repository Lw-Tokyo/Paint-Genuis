// server/scripts/migrateContractors.js
const mongoose = require('mongoose');
require('dotenv').config();
const Contractor = require('../models/Contractor');

async function migrateContractors() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for migration');

    const result = await Contractor.updateMany(
      {},
      {
        $set: {
          email: "",
          profilePicture: "",
          website: "",
          hoursPerDay: 8,
          workSpeed: 40,
          hourlyRate: 0,
          rating: 0,
          reviewCount: 0,
          portfolio: [],
          certifications: [],
          insurance: { hasInsurance: false },
          socialLinks: {},
          "location.address": ""
        }
      }
    );

    console.log(`✅ Migration complete. Updated ${result.modifiedCount} contractors`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateContractors();