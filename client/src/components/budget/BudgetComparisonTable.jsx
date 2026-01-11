import React from "react";
import "./BudgetComparisonTable.css";

const paintOptions = [
  {
    type: "Standard",
    costPerSqFt: 1.5,
    durability: "3-5 years",
    coverage: "300 sq ft/gallon",
    icon: "✨",
    color: "standard"
  },
  {
    type: "Premium",
    costPerSqFt: 2.5,
    durability: "7-10 years",
    coverage: "350 sq ft/gallon",
    icon: "⭐",
    color: "premium"
  },
  {
    type: "Luxury",
    costPerSqFt: 3.0,
    durability: "5-7 years",
    coverage: "320 sq ft/gallon",
    icon: "👑",
    color: "luxury"
  },
];

function BudgetComparisonTable({ budget, recommendations = [] }) {
  const getBestRecommendation = () => {
    if (recommendations.includes("Luxury")) return "Luxury";
    if (recommendations.includes("Premium")) return "Premium";
    return "Standard";
  };

  const bestRecommendation = getBestRecommendation();

  return (
    <div className="comparison-table-container">
      <div className="comparison-header">
        <span className="comparison-header-icon">📊</span>
        <h5 className="comparison-title">
          <span className="comparison-gradient-text">Paint Options Comparison</span>
        </h5>
      </div>
      
      <div className="comparison-subtitle">
        <span className="comparison-subtitle-icon">💰</span>
        Available options within your budget
      </div>

      <div className="comparison-table-wrapper">
        <div className="comparison-table">
          {/* Table Header */}
          <div className="comparison-table-header">
            <div className="comparison-table-cell comparison-header-cell">Type</div>
            <div className="comparison-table-cell comparison-header-cell">Cost/sq ft</div>
            <div className="comparison-table-cell comparison-header-cell">Durability</div>
            <div className="comparison-table-cell comparison-header-cell">Coverage</div>
            <div className="comparison-table-cell comparison-header-cell">Max Area</div>
          </div>

          {/* Table Body */}
          <div className="comparison-table-body">
            {paintOptions
              .filter((opt) => opt.costPerSqFt * 100 <= budget.max)
              .map((option, idx) => {
                const isRecommended = option.type === bestRecommendation;
                return (
                  <div 
                    key={idx} 
                    className={`comparison-table-row comparison-row-${option.color} ${isRecommended ? 'comparison-row-recommended' : ''}`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="comparison-table-cell comparison-cell-type">
                      <span className="comparison-cell-icon">{option.icon}</span>
                      <span className="comparison-cell-text">{option.type}</span>
                      {isRecommended && (
                        <span className="comparison-recommended-badge">
                          <span className="comparison-badge-icon">✓</span>
                          Best
                        </span>
                      )}
                    </div>
                    
                    <div className="comparison-table-cell">
                      <span className="comparison-cell-value comparison-gradient-text">
                        {option.costPerSqFt.toFixed(2)}
                      </span>
                      <span className="comparison-cell-unit">PKR</span>
                    </div>
                    
                    <div className="comparison-table-cell">
                      <span className="comparison-cell-value">{option.durability}</span>
                    </div>
                    
                    <div className="comparison-table-cell">
                      <span className="comparison-cell-value">{option.coverage}</span>
                    </div>
                    
                    <div className="comparison-table-cell">
                      <span className="comparison-cell-value comparison-gradient-text comparison-area-value">
                        {Math.floor(budget.max / option.costPerSqFt).toLocaleString()}
                      </span>
                      <span className="comparison-cell-unit">sq ft</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetComparisonTable;