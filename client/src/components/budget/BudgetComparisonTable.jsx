
import React from "react";
import "./BudgetComparisonTable.css";

const paintOptions = [
  {
    type: "Standard",
    costPerSqFt: 1.5,
    durability: "3-5 years",
    coverage: "300 sq ft/gallon",
  },
  {
    type: "Premium",
    costPerSqFt: 2.5,
    durability: "7-10 years",
    coverage: "350 sq ft/gallon",
  },
  {
    type: "Luxury",
    costPerSqFt: 3.0,
    durability: "5-7 years",
    coverage: "320 sq ft/gallon",
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
    <div className="mt-4 comparison-table-container">
      <h5>Comparison Table and Paint Options Within Your Budget</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Type</th>
              <th>Cost per sq ft</th>
              <th>Durability</th>
              <th>Coverage</th>
              <th>Estimated Max Area (Budget-Based)</th>
            </tr>
          </thead>
          <tbody>
            {paintOptions
              .filter((opt) => opt.costPerSqFt * 100 <= budget.max) // crude check
              .map((option, idx) => {
                const isRecommended = option.type === bestRecommendation;
                return (
                  <tr 
                    key={idx} 
                    className={isRecommended ? 'recommended-row' : ''}
                  >
                    <td>
                      {option.type}
                      {isRecommended && (
                        <span className="ms-2 badge bg-success">Recommended</span>
                      )}
                    </td>
                    <td>{option.costPerSqFt.toFixed(2)} PKR</td>
                    <td>{option.durability}</td>
                    <td>{option.coverage}</td>
                    <td>
                      {Math.floor(budget.max / option.costPerSqFt)} sq ft
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BudgetComparisonTable;