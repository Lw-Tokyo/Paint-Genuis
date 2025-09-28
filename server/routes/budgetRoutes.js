// server/routes/budgetRoutes.js
const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");
const mongoose = require("mongoose");

const Budget = require("../models/Budget");

router.post("/", async (req, res) => {
  try {
    const { userId, min, max } = req.body;

    if (!userId || min === undefined || max === undefined) {
      return res.status(400).json({ error: "User ID, min, and max budget are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const savedBudget = await budgetController.saveBudget(req.body);
    res.json(savedBudget);
  } catch (err) {
    console.error("Error saving budget:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const budget = await Budget.findOne({ userId });

    if (!budget) {
      return res.status(404).json({ error: "No budget found for this user" });
    }

    res.json(budget);
  } catch (err) {
    console.error("Error fetching budget data:", err.message);
    res.status(500).json({ error: "Server error while fetching budget data" });
  }
});

router.delete("/:userId/history/:entryIndex", async (req, res) => {
  const { userId, entryIndex } = req.params;
  
  if (!userId || entryIndex === undefined) {
    return res.status(400).json({ error: "User ID and entry index are required" });
  }
  
  try {
    const budget = await Budget.findOne({ userId });
    
    if (!budget) {
      return res.status(404).json({ error: "No budget found for this user" });
    }
    
    if (!budget.history || entryIndex >= budget.history.length) {
      return res.status(400).json({ error: "Invalid history entry index" });
    }
    

    budget.history.splice(entryIndex, 1);
    await budget.save();
    
    res.json(budget);
  } catch (err) {
    console.error("Error deleting budget history entry:", err.message);
    res.status(500).json({ error: "Server error while deleting budget history entry" });
  }
});

module.exports = router;