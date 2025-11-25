const Discount = require('../models/Discount');
const Contractor = require('../models/Contractor');

// Get active discounts
exports.getActiveDiscounts = async (req, res) => {
  try {
    const { applicableTo, contractorId } = req.query;
    const now = new Date();
    
    const query = {
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    };

    if (applicableTo) {
      query.$or = [
        { applicableTo: applicableTo },
        { applicableTo: 'all' }
      ];
    }

    if (contractorId) {
      query.$or = [
        { contractorId: contractorId },
        { contractorId: null }
      ];
    } else {
      query.contractorId = null;
    }

    const discounts = await Discount.find(query)
      .select('-usedBy')
      .sort({ priority: -1, createdAt: -1 });

    res.json({
      success: true,
      data: discounts,
      count: discounts.length
    });
  } catch (error) {
    console.error('Get active discounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discounts',
      error: error.message
    });
  }
};

// Validate promo code
exports.validatePromoCode = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Promo code is required'
      });
    }

    const discount = await Discount.findOne({
      code: code.toUpperCase(),
      isActive: true
    });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired promo code'
      });
    }

    if (!discount.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'This promo code has expired or reached usage limit'
      });
    }

    const userId = req.user.id;
    if (!discount.canUserUse(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You have already used this promo code'
      });
    }

    res.json({
      success: true,
      message: 'Promo code is valid',
      data: {
        name: discount.name,
        description: discount.description,
        type: discount.type,
        value: discount.value
      }
    });
  } catch (error) {
    console.error('Validate promo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate promo code',
      error: error.message
    });
  }
};

// Create discount
exports.createDiscount = async (req, res) => {
  try {
    const discountData = req.body;
    
    // Get contractor profile for this user
    const contractor = await Contractor.findOne({ user: req.user.id });
    
    if (!contractor) {
      return res.status(403).json({
        success: false,
        message: 'Only contractors can create discounts'
      });
    }

    discountData.contractorId = contractor._id;

    const discount = await Discount.create(discountData);

    res.status(201).json({
      success: true,
      message: 'Discount created successfully',
      data: discount
    });
  } catch (error) {
    console.error('Create discount error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A discount with this code already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create discount',
      error: error.message
    });
  }
};

// Get contractor's discounts
exports.getMyDiscounts = async (req, res) => {
  try {
    const contractor = await Contractor.findOne({ user: req.user.id });
    
    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor profile not found'
      });
    }

    const discounts = await Discount.find({ contractorId: contractor._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: discounts,
      count: discounts.length
    });
  } catch (error) {
    console.error('Get my discounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discounts',
      error: error.message
    });
  }
};

// Update discount
exports.updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const discount = await Discount.findById(id);
    
    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    const contractor = await Contractor.findOne({ user: req.user.id });
    
    if (!contractor || discount.contractorId.toString() !== contractor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this discount'
      });
    }

    const updatedDiscount = await Discount.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Discount updated successfully',
      data: updatedDiscount
    });
  } catch (error) {
    console.error('Update discount error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update discount',
      error: error.message
    });
  }
};

// Delete discount
exports.deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    const discount = await Discount.findById(id);
    
    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    const contractor = await Contractor.findOne({ user: req.user.id });
    
    if (!contractor || discount.contractorId.toString() !== contractor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this discount'
      });
    }

    await discount.deleteOne();

    res.json({
      success: true,
      message: 'Discount deleted successfully'
    });
  } catch (error) {
    console.error('Delete discount error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete discount',
      error: error.message
    });
  }
};

// Get discount analytics
exports.getDiscountAnalytics = async (req, res) => {
  try {
    const contractor = await Contractor.findOne({ user: req.user.id });
    
    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor profile not found'
      });
    }

    const discounts = await Discount.find({ contractorId: contractor._id });

    const analytics = {
      totalDiscounts: discounts.length,
      activeDiscounts: discounts.filter(d => d.isValid()).length,
      totalUsage: discounts.reduce((sum, d) => sum + d.currentUsageCount, 0),
      totalSavings: 0,
      byType: {
        percentage: 0,
        fixed: 0,
        tiered: 0,
        bundle: 0
      },
      popularDiscounts: []
    };

    discounts.forEach(discount => {
      analytics.byType[discount.type]++;
      
      discount.usedBy.forEach(usage => {
        analytics.totalSavings += usage.discountAmount || 0;
      });
    });

    analytics.popularDiscounts = discounts
      .sort((a, b) => b.currentUsageCount - a.currentUsageCount)
      .slice(0, 5)
      .map(d => ({
        name: d.name,
        code: d.code,
        usageCount: d.currentUsageCount,
        type: d.type
      }));

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};