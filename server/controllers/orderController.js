// server/controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Create order from cart
exports.createOrder = async (req, res) => {
  try {
    const { paymentMethod, billingInfo } = req.body;

    console.log('📦 Creating order for user:', req.user.id);

    // Get cart
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    console.log('🛒 Cart found with', cart.items.length, 'items');

    // Calculate pricing
    const subtotal = cart.finalAmount;
    const tax = subtotal * 0.08; // 8% tax (adjust as needed)
    const total = subtotal + tax;

    console.log('💰 Pricing:', { subtotal, tax, total });

    // Create order items without relying on populated data
    const orderItems = cart.items.map(item => ({
      estimate: item.estimate, // Just use the ObjectId
      contractor: item.contractor, // Just use the ObjectId
      projectDetails: item.projectDetails,
      pricing: item.pricing,
      timeline: item.timeline
    }));

    console.log('📋 Order items prepared:', orderItems.length);

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      payment: {
        method: paymentMethod,
        status: 'pending',
        amount: total
      },
      billing: billingInfo,
      pricing: {
        subtotal,
        discount: cart.totalDiscount,
        tax,
        total
      },
      status: 'pending'
    });

    console.log('✅ Order created:', order._id);

    // Clear cart after successful order creation
    cart.items = [];
    await cart.save();

    console.log('🗑️ Cart cleared');

    // Populate the order before sending response
    await order.populate([
      { path: 'items.contractor', select: 'companyName email phone' },
      { path: 'user', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Process payment (Demo/Test)
exports.processPayment = async (req, res) => {
  try {
    const { orderId, cardDetails } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Simulate payment processing (Demo mode)
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

    // Demo payment validation
    const isCardValid = cardDetails.number.length === 16 && 
                        cardDetails.cvv.length === 3 &&
                        cardDetails.expiryMonth > 0 && 
                        cardDetails.expiryMonth <= 12 &&
                        cardDetails.expiryYear >= new Date().getFullYear();

    if (!isCardValid) {
      order.payment.status = 'failed';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment failed: Invalid card details'
      });
    }

    // Success - Update order
    order.payment.status = 'completed';
    order.payment.transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    order.payment.paidAt = new Date();
    order.payment.cardDetails = {
      last4: cardDetails.number.slice(-4),
      brand: cardDetails.number.startsWith('4') ? 'Visa' : 
             cardDetails.number.startsWith('5') ? 'Mastercard' : 'Unknown',
      expiryMonth: cardDetails.expiryMonth,
      expiryYear: cardDetails.expiryYear
    };
    order.status = 'confirmed';

    await order.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        transactionId: order.payment.transactionId,
        order: order
      }
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
};

// Get user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .populate('items.contractor', 'companyName email phone rating')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Order.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.contractor', 'companyName email phone rating')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (order.status === 'completed' || order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this order'
      });
    }

    order.status = 'cancelled';
    order.cancellationReason = reason || 'Cancelled by user';
    order.cancelledAt = new Date();

    // Update payment status if needed
    if (order.payment.status === 'completed') {
      order.payment.status = 'refunded';
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};