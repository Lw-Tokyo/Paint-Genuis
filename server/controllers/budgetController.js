// server/controllers/budgetController.js
const Budget = require("../models/Budget");

const getPaintRecommendations = (budgetMax, estimate) => {
  const recommendations = [];
  if (estimate <= budgetMax) recommendations.push("Standard");
  if (estimate * 1.25 <= budgetMax) recommendations.push("Premium");
  if (estimate * 1.5 <= budgetMax) recommendations.push("Luxury");
  return recommendations;
};

exports.saveBudget = async (data) => {
  const { userId, min, max, dimensions } = data;

  if (!userId || min === undefined || max === undefined) {
    throw new Error("User ID, min, and max are required");
  }

  try {
    let budget = await Budget.findOne({ userId });
    
    if (!dimensions) {
      if (budget) {
        budget.min = min;
        budget.max = max;
        await budget.save();
      } else {
  
        budget = await Budget.create({
          userId,
          min,
          max,
          history: [] 
        });
      }
      return budget;
    }

    if (dimensions.length && dimensions.width && dimensions.height) {
      const area = dimensions.length * dimensions.width;
      const coats = dimensions.coats || 3;
      const estimate = area * 1.5 * dimensions.height * coats;

      const recommendations = getPaintRecommendations(max, estimate);

      const newHistoryEntry = {
        min,
        max,
        dimensions,
        estimate,
        recommendations,
        coats,
        date: new Date()
      };

      if (budget) {
        if (budget.estimate) {
          budget.history.push({
            min: budget.min,
            max: budget.max,
            dimensions: budget.dimensions,
            estimate: budget.estimate,
            recommendations: budget.recommendations,
            coats: budget.coats,
            date: new Date()
          });
        }

        budget.min = min;
        budget.max = max;
        budget.dimensions = dimensions;
        budget.estimate = estimate;
        budget.recommendations = recommendations;
        budget.coats = coats;

        await budget.save();
      } else {
        budget = await Budget.create({
          userId,
          min,
          max,
          dimensions,
          estimate,
          recommendations,
          coats,
          history: [newHistoryEntry],
        });
      }
    }

    return budget;
  } catch (err) {
    console.error("Error saving budget:", err.message);
    throw err;
  }
};