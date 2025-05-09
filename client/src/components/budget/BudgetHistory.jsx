import React from "react";
import "./BudgetHistory.css";

const BudgetHistory = ({ history = [] }) => {
  if (!Array.isArray(history) || history.length === 0) {
    return <div className="text-center mt-3">No budget history available yet.</div>;
  }

  return (
    <div className="budget-history-container">
      {history.map((entry, index) => (
        <div key={index} className="history-entry">
          <div className="entry-header">
            <h5>Entry {index + 1}</h5>
            <span>{new Date(entry.date).toLocaleDateString()}</span>
          </div>
          <div className="entry-details">
            <p>Min Budget: ${entry.min}</p>
            <p>Max Budget: ${entry.max}</p>
            <p>Dimensions: 
              {entry.dimensions?.length}m x {entry.dimensions?.width}m x {entry.dimensions?.height}m
            </p>
            <p>Area: {entry.dimensions?.area || "N/A"} sq.m</p>
            <p>Estimate: ${entry.estimate}</p>
            <p>Coats: {entry.coats}</p>
            <p>Recommendations: {entry.recommendations?.join(", ") || "None"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BudgetHistory;
