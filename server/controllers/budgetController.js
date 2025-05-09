const Budget = require("../models/Budget");

// Helper function to determine paint recommendations based on budget
const getPaintRecommendations = (budgetMax, estimate) => {
  const recommendations = [];

  if (estimate <= budgetMax) {
    recommendations.push("Standard");
  }
  if (estimate * 1.25 <= budgetMax) {
    recommendations.push("Premium");
  }
  if (estimate * 1.5 <= budgetMax) {
    recommendations.push("Luxury");
  }

  return recommendations;
};

// Helper function to create history entry
const createHistoryEntry = (budget) => {
  return {
    min: budget.min,
    max: budget.max,
    dimensions: budget.dimensions,
    estimate: budget.estimate,
    recommendations: budget.recommendations,
    coats: budget.coats,
  };
};

// Save or update budget and dimensions
exports.saveBudget = async (req, res) => {
  const { userId, min, max, dimensions } = req.body;

  try {
    let budget = await Budget.findOne({ userId });

    // Calculate area and estimate
    const area = dimensions.length * dimensions.width;
    const estimate = area * 1.5 * dimensions.height * 3; // 3 coats by default

    // Determine paint recommendations based on budget and estimate
    const recommendations = getPaintRecommendations(max, estimate);

    const updatedDimensions = {
      ...dimensions,
      area,
    };

    const newHistoryEntry = {
      min,
      max,
      dimensions: updatedDimensions,
      estimate,
      recommendations,
      coats: 3,
    };

    if (budget) {
      // Save previous state to history
      budget.history.push(createHistoryEntry(budget));

      // Update current budget
      budget.min = min;
      budget.max = max;
      budget.dimensions = updatedDimensions;
      budget.estimate = estimate;
      budget.recommendations = recommendations;
      budget.coats = 3;

      await budget.save();
    } else {
      // Create new budget record
      budget = await Budget.create({
        userId,
        min,
        max,
        dimensions: updatedDimensions,
        estimate,
        recommendations,
        coats: 3,
        history: [newHistoryEntry],
      });
    }

    res.status(200).json(budget);
  } catch (err) {
    console.error("Error saving budget:", err.message);
    res.status(500).json({ message: "Server error saving budget" });
  }
};

// Get budget by userId including history
exports.getBudget = async (req, res) => {
  const { userId } = req.params;

  try {
    const budget = await Budget.findOne({ userId });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json(budget);
  } catch (err) {
    console.error("Error fetching budget:", err.message);
    res.status(500).json({ message: "Server error fetching budget" });
  }
};
