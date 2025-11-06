// server/models/ProjectEstimate.js
const mongoose = require('mongoose');

const projectEstimateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    required: true
  },
  projectDetails: {
    projectType: {
      type: String,
      enum: ['interior', 'exterior'],
      required: true
    },
    numberOfRooms: {
      type: Number,
      required: true,
      min: 1
    },
    roomSize: {
      type: Number,
      required: true,
      min: 1
    },
    wallCondition: {
      type: String,
      enum: ['smooth', 'textured', 'needs_repair'],
      required: true
    },
    ceilingIncluded: {
      type: Boolean,
      default: false
    },
    primerNeeded: {
      type: Boolean,
      default: true
    },
    numberOfCoats: {
      type: Number,
      required: true,
      min: 1,
      max: 3
    },
    trimWork: {
      type: Boolean,
      default: false
    },
    accentWalls: {
      type: Boolean,
      default: false
    },
    texturedWalls: {
      type: Boolean,
      default: false
    }
  },
  timeline: {
    totalHours: {
      type: Number,
      required: true
    },
    totalDays: {
      type: Number,
      required: true
    },
    workingDays: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    completionDate: {
      type: Date,
      required: true
    },
    phases: [{
      name: String,
      hours: Number,
      percentage: Number
    }],
    dryingTime: {
      type: Number,
      default: 0
    },
    weatherDelay: {
      type: Number,
      default: 0
    }
  },
  estimatedCost: {
    laborCost: Number,
    hourlyRate: Number,
    totalHours: Number
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'approved', 'rejected', 'completed'],
    default: 'draft'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
projectEstimateSchema.index({ user: 1, createdAt: -1 });
projectEstimateSchema.index({ contractor: 1, createdAt: -1 });
projectEstimateSchema.index({ status: 1 });

// Virtual for total square footage
projectEstimateSchema.virtual('totalSquareFeet').get(function() {
  return this.projectDetails.numberOfRooms * this.projectDetails.roomSize;
});

// Static method to calculate timeline
projectEstimateSchema.statics.calculateTimeline = function(projectData, contractorData) {
  const {
    projectType,
    numberOfRooms,
    roomSize,
    wallCondition,
    ceilingIncluded,
    primerNeeded,
    numberOfCoats,
    trimWork,
    accentWalls,
    texturedWalls,
    startDate
  } = projectData;

  const {
    hoursPerDay = 8,
    workSpeed = 40
  } = contractorData;

  // Calculate total square footage
  const totalSqFt = numberOfRooms * roomSize;
  
  // Base time calculation using contractor's work speed
  let totalHours = totalSqFt / workSpeed;
  
  // Apply number of coats
  totalHours *= numberOfCoats;
  
  // Wall condition multiplier
  const conditionMultiplier = {
    smooth: 1.0,
    textured: 1.3,
    needs_repair: 1.8
  };
  totalHours *= conditionMultiplier[wallCondition] || 1;
  
  // Additional work modifiers
  if (ceilingIncluded) {
    totalHours *= 1.4;
  }
  
  if (primerNeeded) {
    totalHours *= 1.25;
  }
  
  if (trimWork) {
    totalHours += numberOfRooms * 2;
  }
  
  if (accentWalls) {
    totalHours += numberOfRooms * 1.5;
  }
  
  if (texturedWalls) {
    totalHours *= 1.2;
  }
  
  // Project type multiplier
  if (projectType === 'exterior') {
    totalHours *= 1.15;
  }
  
  // Drying time between coats
  const dryingTime = (numberOfCoats - 1) * 8;
  
  // Weather delay for exterior
  const weatherDelay = projectType === 'exterior' ? 8 : 0;
  
  // Phase breakdown
  const prepPercentage = 25;
  const primePercentage = primerNeeded ? 20 : 0;
  const paintPercentage = primerNeeded ? 45 : 65;
  const finishPercentage = 10;
  
  const prepTime = totalHours * (prepPercentage / 100);
  const primeTime = primerNeeded ? totalHours * (primePercentage / 100) : 0;
  const paintTime = totalHours * (paintPercentage / 100);
  const finishTime = totalHours * (finishPercentage / 100);
  
  const phases = [
    { 
      name: 'Preparation & Setup', 
      hours: Math.round(prepTime), 
      percentage: prepPercentage 
    },
    primerNeeded ? { 
      name: 'Priming', 
      hours: Math.round(primeTime), 
      percentage: primePercentage 
    } : null,
    { 
      name: 'Painting', 
      hours: Math.round(paintTime), 
      percentage: paintPercentage 
    },
    { 
      name: 'Final Touches & Cleanup', 
      hours: Math.round(finishTime), 
      percentage: finishPercentage 
    }
  ].filter(p => p !== null);
  
  // Calculate calendar time
  const totalWorkingHours = Math.round(totalHours);
  const totalTimeWithDrying = totalWorkingHours + dryingTime + weatherDelay;
  const workingDays = Math.ceil(totalWorkingHours / hoursPerDay);
  const totalDays = Math.ceil(totalTimeWithDrying / 24);
  
  // Calculate completion date
  const start = new Date(startDate);
  const completion = new Date(start);
  completion.setDate(completion.getDate() + totalDays);
  
  return {
    totalHours: totalWorkingHours,
    totalDays: totalDays,
    workingDays: workingDays,
    startDate: start,
    completionDate: completion,
    phases: phases,
    dryingTime: dryingTime,
    weatherDelay: weatherDelay,
    calculationDetails: {
      totalSqFt,
      workSpeed,
      hoursPerDay,
      conditionMultiplier: conditionMultiplier[wallCondition]
    }
  };
};

module.exports = mongoose.model('ProjectEstimate', projectEstimateSchema);