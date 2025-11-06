// server/controllers/timelineController.js
const ProjectEstimate = require('../models/ProjectEstimate');
const Contractor = require('../models/Contractor');

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

// Save project estimate
exports.saveEstimate = async (req, res) => {
  try {
    console.log('💾 Save estimate request:', req.body);

    const {
      contractorId,
      projectDetails,
      timeline,
      notes,
      estimatedCost
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

    // Create estimate
    const estimate = await ProjectEstimate.create({
      user: req.user.id,
      contractor: contractorId,
      projectDetails,
      timeline,
      estimatedCost: estimatedCost || null,
      notes: notes || '',
      status: 'draft'
    });

    await estimate.populate('contractor', 'companyName email phone rating');

    console.log('✅ Estimate saved:', estimate._id);

    res.status(201).json({
      success: true,
      message: 'Estimate saved successfully',
      data: estimate
    });

  } catch (error) {
    console.error('❌ Save estimate error:', error);
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