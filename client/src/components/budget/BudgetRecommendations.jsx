import React from "react";
import "./BudgetRecommendations.css";

const BudgetRecommendations = ({ recommendations }) => {
  if (!recommendations || !recommendations.length) {
    return (
      <div className="recommendations-empty">
        <span className="recommendations-empty-icon">🎨</span>
        <p className="recommendations-empty-text">No recommendations available.</p>
      </div>
    );
  }

  const getBestRecommendation = () => {
    if (recommendations.includes("Luxury")) return "Luxury";
    if (recommendations.includes("Premium")) return "Premium";
    return "Standard";
  };

  const bestRecommendation = getBestRecommendation();

  const getRecommendationIcon = (rec) => {
    if (rec === "Luxury") return "👑";
    if (rec === "Premium") return "⭐";
    return "✨";
  };

  const getRecommendationGradient = (rec) => {
    if (rec === "Luxury") return "recommendations-item-luxury";
    if (rec === "Premium") return "recommendations-item-premium";
    return "recommendations-item-standard";
  };

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <span className="recommendations-header-icon">🎨</span>
        <h4 className="recommendations-title">
          <span className="recommendations-gradient-text">Recommended Paint Options</span>
        </h4>
      </div>
      
      <div className="recommendations-list">
        {recommendations.map((rec, index) => (
          <div 
            key={index}
            className={`recommendations-item ${getRecommendationGradient(rec)} ${rec === bestRecommendation ? 'recommendations-item-best' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="recommendations-item-content">
              <span className="recommendations-item-icon">
                {getRecommendationIcon(rec)}
              </span>
              <span className="recommendations-item-text">{rec}</span>
            </div>
            {rec === bestRecommendation && (
              <span className="recommendations-badge">
                <span className="recommendations-badge-icon">✓</span>
                Best Choice
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetRecommendations;