
import React from "react";
import "./BudgetHistory.css";

const BudgetHistory = ({ history = [], onDelete }) => {
  if (!Array.isArray(history) || history.length === 0) {
    return <div className="text-center mt-3">No budget history available yet.</div>;
  }

  return (
    <div className="budget-history-container">
      {history.map((entry, index) => (
        <div key={index} className="history-entry">
          <div className="entry-header">
            <h5>Entry {index + 1}</h5>
            <div>
              <span className="date-badge">{new Date(entry.date).toLocaleDateString()}</span>
              {onDelete && (
                <button 
                  className="btn btn-sm btn-danger ms-2"
                  onClick={() => onDelete(index)}
                  aria-label="Delete entry"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="entry-details">
            <p>Min Budget: {entry.min} PKR</p>
            <p>Max Budget: {entry.max} PKR</p>
            <p>Dimensions:
              {entry.dimensions?.length}m x {entry.dimensions?.width}m x {entry.dimensions?.height}m
            </p>
            <p>Area: {entry.dimensions?.area || 
              (entry.dimensions ? (entry.dimensions.length * entry.dimensions.width).toFixed(2) : "N/A")} sq.m</p>
            <p>Estimate: {entry.estimate} PKR</p>
            <p>Coats: {entry.coats}</p>
            <p>Recommendations: {entry.recommendations?.join(", ") || "None"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BudgetHistory;