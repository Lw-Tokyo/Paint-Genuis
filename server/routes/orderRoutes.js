// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All order routes require authentication
router.post('/create', authenticateToken, orderController.createOrder);
router.post('/payment/process', authenticateToken, orderController.processPayment);
router.get('/my-orders', authenticateToken, orderController.getMyOrders);
router.put('/:id/cancel', authenticateToken, orderController.cancelOrder);
router.get('/:id', authenticateToken, orderController.getOrderById); // This should be LAST

module.exports = router;