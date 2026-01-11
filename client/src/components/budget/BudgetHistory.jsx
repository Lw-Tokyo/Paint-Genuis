import React from "react";
import "./BudgetHistory.css";

const BudgetHistory = ({ history = [], onDelete }) => {
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <div className="history-empty">
        <span className="history-empty-icon">📜</span>
        <p className="history-empty-text">No budget history available yet.</p>
        <p className="history-empty-subtext">Your saved budgets will appear here</p>
      </div>
    );
  }

  return (
    <div className="budget-history-container">
      {history.map((entry, index) => (
        <div 
          key={index} 
          className="history-entry"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="entry-header">
            <div className="entry-header-left">
              <span className="entry-number">#{index + 1}</span>
              <h5 className="entry-title">Budget Entry</h5>
            </div>
            <div className="entry-header-right">
              <span className="date-badge">
                <span className="date-badge-icon">📅</span>
                {new Date(entry.date).toLocaleDateString()}
              </span>
              {onDelete && (
                <button 
                  className="delete-button"
                  onClick={() => onDelete(index)}
                  aria-label="Delete entry"
                  title="Delete this entry"
                >
                  <span className="delete-icon">🗑️</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="entry-details">
            <div className="detail-item">
              <span className="detail-icon">💵</span>
              <div className="detail-content">
                <span className="detail-label">Min Budget</span>
                <span className="detail-value history-gradient-text">{entry.min.toLocaleString()} PKR</span>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-icon">💰</span>
              <div className="detail-content">
                <span className="detail-label">Max Budget</span>
                <span className="detail-value history-gradient-text">{entry.max.toLocaleString()} PKR</span>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-icon">📏</span>
              <div className="detail-content">
                <span className="detail-label">Dimensions</span>
                <span className="detail-value">
                  {entry.dimensions?.length}m × {entry.dimensions?.width}m × {entry.dimensions?.height}m
                </span>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-icon">📐</span>
              <div className="detail-content">
                <span className="detail-label">Area</span>
                <span className="detail-value history-gradient-text">
                  {entry.dimensions?.area || 
                    (entry.dimensions ? (entry.dimensions.length * entry.dimensions.width).toFixed(2) : "N/A")} sq.m
                </span>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-icon">🧮</span>
              <div className="detail-content">
                <span className="detail-label">Estimate</span>
                <span className="detail-value history-gradient-text">{entry.estimate.toLocaleString()} PKR</span>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-icon">🎨</span>
              <div className="detail-content">
                <span className="detail-label">Coats</span>
                <span className="detail-value">{entry.coats}</span>
              </div>
            </div>
            
            <div className="detail-item detail-item-full">
              <span className="detail-icon">✨</span>
              <div className="detail-content">
                <span className="detail-label">Recommendations</span>
                <span className="detail-value">
                  {entry.recommendations?.join(", ") || "None"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BudgetHistory;