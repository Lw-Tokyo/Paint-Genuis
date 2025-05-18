// client/src/components/budget/BudgetRecommendations.jsx
import React from "react";
import "./BudgetRecommendations.css";

const BudgetRecommendations = ({ recommendations }) => {
  if (!recommendations || !recommendations.length) {
    return <div className="text-center mt-3">No recommendations available.</div>;
  }

  // Determine the best recommendation (highest quality that fits the budget)
  const getBestRecommendation = () => {
    if (recommendations.includes("Luxury")) return "Luxury";
    if (recommendations.includes("Premium")) return "Premium";
    return "Standard";
  };

  const bestRecommendation = getBestRecommendation();

  return (
    <div className="recommendations-container p-3 mb-4 bg-light rounded">
      <h4 className="text-center">Recommended Paint Options:</h4>
      <ul className="recommendation-list">
        {recommendations.map((rec, index) => (
          <li 
            key={index}
            className={`recommendation-item ${rec === bestRecommendation ? 'best-recommendation' : ''}`}
          >
            {rec} 
            {rec === bestRecommendation && (
              <span className="ms-2 badge bg-success">Recommended</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BudgetRecommendations;