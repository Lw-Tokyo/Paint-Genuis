// server/routes/timelineRoutes.js
const express = require('express');
const router = express.Router();
const timelineController = require('../controllers/timelineController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All timeline routes require authentication
router.post('/calculate', authenticateToken, timelineController.calculateTimeline);
router.post('/save', authenticateToken, timelineController.saveEstimate);
router.get('/my-estimates', authenticateToken, timelineController.getMyEstimates);
router.get('/contractor/received', authenticateToken, timelineController.getContractorEstimates);
router.get('/:id', authenticateToken, timelineController.getEstimateById);
router.put('/:id/status', authenticateToken, timelineController.updateEstimateStatus);
router.delete('/:id', authenticateToken, timelineController.deleteEstimate);

module.exports = router;