// server/controllers/cartController.js
const Cart = require('../models/Cart');
const ProjectEstimate = require('../models/ProjectEstimate');
const Contractor = require('../models/Contractor'); // ✅ ADD THIS LINE

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.estimate')
      .populate('items.contractor', 'companyName email phone rating');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { estimateId } = req.body;

    // Get estimate details
    const estimate = await ProjectEstimate.findById(estimateId)
      .populate('contractor', 'companyName email phone');

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: 'Estimate not found'
      });
    }

    // Check if user owns this estimate
    if (estimate.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(
      item => item.estimate.toString() === estimateId
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'This estimate is already in your cart'
      });
    }

    // Calculate pricing
    let originalAmount = 0;
    let discountAmount = 0;
    let finalAmount = 0;
    let appliedDiscounts = [];

    // Check if estimate has discounts object
    if (estimate.discounts && estimate.discounts.finalAmount > 0) {
      originalAmount = estimate.discounts.originalAmount || 0;
      discountAmount = estimate.discounts.totalDiscount || 0;
      finalAmount = estimate.discounts.finalAmount || 0;
      appliedDiscounts = estimate.discounts.appliedDiscounts?.map(d => ({
        name: d.name,
        code: d.code,
        amount: d.amount
      })) || [];
    } 
    // Fallback to estimatedCost if no discounts
    else if (estimate.estimatedCost && estimate.estimatedCost.totalCost) {
      originalAmount = estimate.estimatedCost.totalCost;
      discountAmount = 0;
      finalAmount = estimate.estimatedCost.totalCost;
      appliedDiscounts = [];
    }
    // Last fallback - calculate from timeline
    else {
      const contractor = await Contractor.findById(estimate.contractor);
      const hourlyRate = contractor?.hourlyRate || 50;
      const totalCost = estimate.timeline.totalHours * hourlyRate;
      originalAmount = totalCost;
      discountAmount = 0;
      finalAmount = totalCost;
      appliedDiscounts = [];
    }

    console.log('💰 Cart item pricing:', { originalAmount, discountAmount, finalAmount });

    // Prepare cart item
    const cartItem = {
      estimate: estimate._id,
      contractor: estimate.contractor._id,
      projectDetails: {
        projectType: estimate.projectDetails.projectType,
        numberOfRooms: estimate.projectDetails.numberOfRooms,
        roomSize: estimate.projectDetails.roomSize,
        description: `${estimate.projectDetails.projectType} painting - ${estimate.projectDetails.numberOfRooms} rooms`
      },
      pricing: {
        originalAmount,
        discountAmount,
        finalAmount,
        appliedDiscounts
      },
      timeline: {
        totalDays: estimate.timeline.totalDays,
        startDate: estimate.timeline.startDate,
        completionDate: estimate.timeline.completionDate
      }
    };

    cart.items.push(cartItem);
    await cart.save();

    await cart.populate('items.contractor', 'companyName email phone rating');

    res.status(201).json({
      success: true,
      message: 'Added to cart successfully',
      data: cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to cart',
      error: error.message
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item',
      error: error.message
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};