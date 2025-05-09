const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

// Save or update budget and dimensions
router.post("/", budgetController.saveBudget);

// Get budget by userId
router.get("/:userId", budgetController.getBudget);

module.exports = router;
