// server\routes\discountRoutes.js
const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/active', discountController.getActiveDiscounts);

// Protected routes
router.post('/validate', authenticateToken, discountController.validatePromoCode);
router.post('/create', authenticateToken, discountController.createDiscount);
router.get('/my-discounts', authenticateToken, discountController.getMyDiscounts);
router.get('/analytics', authenticateToken, discountController.getDiscountAnalytics);
router.put('/:id', authenticateToken, discountController.updateDiscount);
router.delete('/:id', authenticateToken, discountController.deleteDiscount);

module.exports = router;