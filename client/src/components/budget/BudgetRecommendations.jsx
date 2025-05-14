// client/src/components/budget/BudgetRecommendations.jsx
import React from "react";
//import "./BudgetRecommendations.css";

const BudgetRecommendations = ({ recommendations }) => {
  if (!recommendations.length) {
    return <div className="text-center mt-3">No recommendations available.</div>;
  }

  return (
    <div className="recommendations-container">
      <h4 className="text-center">Recommended Paint Options:</h4>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default BudgetRecommendations;
