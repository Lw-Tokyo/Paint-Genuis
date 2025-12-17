// server/controllers/timelineController.js (COMPLETE FILE)
const ProjectEstimate = require('../models/ProjectEstimate');
const Contractor = require('../models/Contractor');
const Discount = require('../models/Discount');

// Calculate project timeline
exports.calculateTimeline = async (req, res) => {
  try {
    console.log('📊 Calculate timeline request:', req.body);

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
      contractorId,
      startDate
    } = req.body;

    // Validate required fields
    if (!projectType || !numberOfRooms || !roomSize || !wallCondition || !numberOfCoats || !contractorId || !startDate) {
      console.error('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get contractor details
    console.log('🔍 Fetching contractor:', contractorId);
    const contractor = await Contractor.findById(contractorId).populate('user');
    
    if (!contractor) {
      console.error('❌ Contractor not found:', contractorId);
      return res.status(404).json({
        success: false,
        message: 'Contractor not found'
      });
    }

    console.log('✅ Contractor found:', contractor.companyName);

    // Check contractor availability
    if (contractor.availability === 'Unavailable') {
      return res.status(400).json({
        success: false,
        message: 'Selected contractor is currently unavailable'
      });
    }

    // Prepare contractor data
    const contractorData = {
      hoursPerDay: contractor.hoursPerDay || 8,
      workSpeed: contractor.workSpeed || 40,
      hourlyRate: contractor.hourlyRate || 0,
      availability: contractor.availability
    };

    console.log('👷 Contractor data:', contractorData);

    // Prepare project data
    const projectData = {
      projectType,
      numberOfRooms: parseInt(numberOfRooms),
      roomSize: parseInt(roomSize),
      wallCondition,
      ceilingIncluded: ceilingIncluded || false,
      primerNeeded: primerNeeded !== undefined ? primerNeeded : true,
      numberOfCoats: parseInt(numberOfCoats),
      trimWork: trimWork || false,
      accentWalls: accentWalls || false,
      texturedWalls: texturedWalls || false,
      startDate: new Date(startDate)
    };

    console.log('📋 Project data:', projectData);

    // Calculate timeline
    console.log('🧮 Calculating timeline...');
    const timeline = ProjectEstimate.calculateTimeline(projectData, contractorData);
    console.log('✅ Timeline calculated:', timeline);
    
    // Calculate estimated cost
    let estimatedCost = null;
    if (contractorData.hourlyRate > 0) {
      estimatedCost = {
        laborCost: Math.round(timeline.totalHours * contractorData.hourlyRate),
        hourlyRate: contractorData.hourlyRate,
        totalHours: timeline.totalHours
      };
    }

    // Return response
    const response = {
      success: true,
      data: {
        ...timeline,
        estimatedCost,
        contractorName: contractor.companyName,
        contractorId: contractor._id,
        contractorWorkSpeed: contractor.workSpeed,
        contractorHoursPerDay: contractor.hoursPerDay
      }
    };

    console.log('✅ Sending response:', response);
    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Calculate timeline error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error calculating timeline',
      error: error.message
    });
  }
};

// NEW: Calculate timeline with discounts
exports.calculateTimelineWithDiscounts = async (req, res) => {
  try {
    console.log('📊 Calculate timeline with discounts:', req.body);

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
      contractorId,
      startDate,
      promoCode
    } = req.body;

    // Validate required fields
    if (!projectType || !numberOfRooms || !roomSize || !wallCondition || !numberOfCoats || !contractorId || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get contractor details
    const contractor = await Contractor.findById(contractorId);
    
    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor not found'
      });
    }

    // Prepare data
    const contractorData = {
      hoursPerDay: contractor.hoursPerDay || 8,
      workSpeed: contractor.workSpeed || 40,
      hourlyRate: contractor.hourlyRate || 50 // Default hourly rate if not set
    };

    const projectData = {
      projectType,
      numberOfRooms: parseInt(numberOfRooms),
      roomSize: parseInt(roomSize),
      wallCondition,
      ceilingIncluded: ceilingIncluded || false,
      primerNeeded: primerNeeded !== undefined ? primerNeeded : true,
      numberOfCoats: parseInt(numberOfCoats),
      trimWork: trimWork || false,
      accentWalls: accentWalls || false,
      texturedWalls: texturedWalls || false,
      startDate: new Date(startDate)
    };

    // Calculate timeline
    const timeline = ProjectEstimate.calculateTimeline(projectData, contractorData);
    
    // Calculate estimated cost
    const totalArea = numberOfRooms * roomSize;
    
    // Material costs estimation
    let paintCost = totalArea * numberOfCoats * 0.40; // $0.40 per sq ft per coat
    if (primerNeeded) paintCost += totalArea * 0.30; // $0.30 per sq ft for primer
    if (ceilingIncluded) paintCost *= 1.3; // 30% more for ceiling
    
    let trimCost = 0;
    if (trimWork) trimCost = numberOfRooms * 40 * 2; // Estimate 40 linear ft per room at $2/ft
    
    const materialCost = Math.round(paintCost + trimCost);
    const laborCost = Math.round(timeline.totalHours * contractorData.hourlyRate);
    const totalCost = materialCost + laborCost;

    const estimatedCost = {
      materialCost,
      laborCost,
      totalCost,
      hourlyRate: contractorData.hourlyRate,
      totalHours: timeline.totalHours
    };

    // Calculate discounts
    const now = new Date();
    
    let query = {
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { applicableTo: 'timeline' },
        { applicableTo: 'all' }
      ]
    };

    // Add contractor filter
    query.$and = [
      {
        $or: [
          { contractorId: contractorId },
          { contractorId: null }
        ]
      }
    ];

    let discounts = await Discount.find(query).sort({ priority: -1 });

    // If promo code provided, check it
    if (promoCode) {
      const promoDiscount = await Discount.findOne({ 
        code: promoCode.toUpperCase(),
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
      });

      if (promoDiscount && promoDiscount.isValid() && promoDiscount.canUserUse(req.user.id)) {
        discounts.unshift(promoDiscount);
      }
    }

    // Filter applicable discounts
    const applicableDiscounts = discounts.filter(discount => {
      const c = discount.conditions;

      if (c.minRooms && numberOfRooms < c.minRooms) return false;
      if (c.minArea && totalArea < c.minArea) return false;
      if (c.minBudget && totalCost < c.minBudget) return false;
      if (c.projectTypes?.length > 0 && !c.projectTypes.includes(projectType) && !c.projectTypes.includes('both')) return false;
      if (c.wallConditions?.length > 0 && !c.wallConditions.includes(wallCondition)) return false;
      if (c.requiresPrimer !== null && c.requiresPrimer !== primerNeeded) return false;
      if (c.requiresCeiling !== null && c.requiresCeiling !== ceilingIncluded) return false;
      if (c.minCoats && numberOfCoats < c.minCoats) return false;

      if (!discount.canUserUse(req.user.id)) return false;

      // Check bundle requirements
      if (discount.type === 'bundle' && discount.bundleItems?.length > 0) {
        const hasAllRequired = discount.bundleItems
          .filter(item => item.required)
          .every(item => {
            if (item.item === 'primerNeeded') return primerNeeded;
            if (item.item === 'trimWork') return trimWork;
            if (item.item === 'ceilingIncluded') return ceilingIncluded;
            if (item.item === 'accentWalls') return accentWalls;
            if (item.item === 'texturedWalls') return texturedWalls;
            return false;
          });
        
        if (!hasAllRequired) return false;
      }

      return discount.isValid();
    });

    // Apply discounts
    let discountResult = {
      originalAmount: totalCost,
      totalDiscount: 0,
      finalAmount: totalCost,
      discountPercentage: 0,
      appliedDiscounts: []
    };

    if (applicableDiscounts.length > 0) {
      let totalDiscount = 0;
      const appliedDiscounts = [];
      let primaryDiscount = null;
      const stackableDiscounts = [];

      applicableDiscounts.forEach(discount => {
        if (discount.stackable) {
          stackableDiscounts.push(discount);
        } else if (!primaryDiscount) {
          primaryDiscount = discount;
        }
      });

      // Apply primary discount
      if (primaryDiscount) {
        let discountAmount = 0;

        if (primaryDiscount.type === 'percentage') {
          discountAmount = (totalCost * primaryDiscount.value) / 100;
          if (primaryDiscount.maxDiscount && discountAmount > primaryDiscount.maxDiscount) {
            discountAmount = primaryDiscount.maxDiscount;
          }
        } else if (primaryDiscount.type === 'fixed') {
          discountAmount = Math.min(primaryDiscount.value, totalCost);
        } else if (primaryDiscount.type === 'tiered') {
          const applicableTier = primaryDiscount.tiers
            ?.filter(tier => numberOfRooms >= tier.minQuantity)
            .sort((a, b) => b.minQuantity - a.minQuantity)[0];
          
          if (applicableTier) {
            discountAmount = (totalCost * applicableTier.discountValue) / 100;
          }
        } else if (primaryDiscount.type === 'bundle') {
          discountAmount = (totalCost * primaryDiscount.value) / 100;
        }

        if (discountAmount > 0) {
          totalDiscount += discountAmount;
          appliedDiscounts.push({
            id: primaryDiscount._id,
            name: primaryDiscount.name,
            code: primaryDiscount.code,
            type: primaryDiscount.type,
            amount: Math.round(discountAmount * 100) / 100,
            description: primaryDiscount.description
          });
        }
      }

      // Apply stackable discounts
      let remainingAmount = totalCost - totalDiscount;
      stackableDiscounts.forEach(discount => {
        let discountAmount = 0;

        if (discount.type === 'percentage') {
          discountAmount = (remainingAmount * discount.value) / 100;
          if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
            discountAmount = discount.maxDiscount;
          }
        } else if (discount.type === 'fixed') {
          discountAmount = Math.min(discount.value, remainingAmount);
        }

        if (discountAmount > 0) {
          totalDiscount += discountAmount;
          remainingAmount -= discountAmount;
          appliedDiscounts.push({
            id: discount._id,
            name: discount.name,
            code: discount.code,
            type: discount.type,
            amount: Math.round(discountAmount * 100) / 100,
            description: discount.description
          });
        }
      });

      discountResult = {
        originalAmount: totalCost,
        totalDiscount: Math.round(totalDiscount * 100) / 100,
        finalAmount: Math.round((totalCost - totalDiscount) * 100) / 100,
        discountPercentage: Math.round((totalDiscount / totalCost) * 100 * 100) / 100,
        appliedDiscounts
      };

      // Record discount usage
      for (const applied of appliedDiscounts) {
        await Discount.findByIdAndUpdate(applied.id, {
          $inc: { currentUsageCount: 1 },
          $push: {
            usedBy: {
              userId: req.user.id,
              projectDetails: projectData,
              discountAmount: applied.amount
            }
          }
        });
      }
    }

    res.json({
      success: true,
      data: {
        timeline,
        estimatedCost,
        discounts: discountResult,
        contractorName: contractor.companyName,
        contractorId: contractor._id
      }
    });

  } catch (error) {
    console.error('❌ Calculate with discounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error calculating timeline',
      error: error.message
    });
  }
};


exports.saveEstimate = async (req, res) => {
  try {
    console.log('💾 Save estimate request:', req.body);

    const {
      contractorId,
      projectDetails,
      timeline,
      notes,
      estimatedCost,
      discounts
    } = req.body;

    // Validate
    if (!contractorId || !projectDetails || !timeline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get contractor
    const contractor = await Contractor.findById(contractorId);
    
    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor not found'
      });
    }

    // Prepare estimate data
    const estimateData = {
      user: req.user.id,
      contractor: contractorId,
      projectDetails,
      timeline,
      estimatedCost: estimatedCost || null,
      notes: notes || '',
      status: 'draft'
    };

    // Add discounts if provided
    if (discounts && discounts.appliedDiscounts && discounts.appliedDiscounts.length > 0) {
      estimateData.discounts = {
        originalAmount: discounts.originalAmount || 0,
        totalDiscount: discounts.totalDiscount || 0,
        finalAmount: discounts.finalAmount || 0,
        discountPercentage: discounts.discountPercentage || 0,
        appliedDiscounts: discounts.appliedDiscounts.map(disc => ({
          discountId: disc.id,
          name: disc.name,
          code: disc.code || '',
          type: disc.type,
          amount: disc.amount,
          description: disc.description || ''
        }))
      };
    }

    // Create estimate
    const estimate = await ProjectEstimate.create(estimateData);

    await estimate.populate('contractor', 'companyName email phone rating');

    console.log('✅ Estimate saved:', estimate._id);

    res.status(201).json({
      success: true,
      message: 'Estimate saved successfully',
      data: estimate
    });

  } catch (error) {
    console.error('❌ Save estimate error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error saving estimate',
      error: error.message
    });
  }
};

// Get user's estimates
exports.getMyEstimates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const estimates = await ProjectEstimate.find({ user: req.user.id })
      .populate('contractor', 'companyName email phone rating workSpeed hourlyRate')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await ProjectEstimate.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: estimates.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: estimates
    });

  } catch (error) {
    console.error('Get estimates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching estimates',
      error: error.message
    });
  }
};

// Get estimate by ID
exports.getEstimateById = async (req, res) => {
  try {
    const estimate = await ProjectEstimate.findById(req.params.id)
      .populate('contractor', 'companyName email phone rating availability workSpeed hourlyRate')
      .populate('user', 'name email');

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: 'Estimate not found'
      });
    }

    // Check authorization
    const contractorProfile = await Contractor.findOne({ user: req.user.id });
    const isOwner = estimate.user._id.toString() === req.user.id;
    const isContractor = contractorProfile && estimate.contractor._id.toString() === contractorProfile._id.toString();

    if (!isOwner && !isContractor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this estimate'
      });
    }

    res.status(200).json({
      success: true,
      data: estimate
    });

  } catch (error) {
    console.error('Get estimate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching estimate',
      error: error.message
    });
  }
};

// Update estimate status
exports.updateEstimateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['draft', 'sent', 'approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const estimate = await ProjectEstimate.findById(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: 'Estimate not found'
      });
    }

    if (estimate.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this estimate'
      });
    }

    estimate.status = status;
    await estimate.save();

    res.status(200).json({
      success: true,
      message: 'Estimate status updated',
      data: estimate
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating estimate',
      error: error.message
    });
  }
};

// Delete estimate
exports.deleteEstimate = async (req, res) => {
  try {
    const estimate = await ProjectEstimate.findById(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: 'Estimate not found'
      });
    }

    if (estimate.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this estimate'
      });
    }

    await estimate.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Estimate deleted successfully'
    });

  } catch (error) {
    console.error('Delete estimate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting estimate',
      error: error.message
    });
  }
};

// Get contractor's received estimates
exports.getContractorEstimates = async (req, res) => {
  try {
    const contractor = await Contractor.findOne({ user: req.user.id });

    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor profile not found'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const estimates = await ProjectEstimate.find({ contractor: contractor._id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await ProjectEstimate.countDocuments({ contractor: contractor._id });

    res.status(200).json({
      success: true,
      count: estimates.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: estimates
    });

  } catch (error) {
    console.error('Get contractor estimates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching estimates',
      error: error.message
    });
  }
};