// client/src/components/budget/BudgetComparisonTable.jsx
import React from "react";

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
    type: "Eco-Friendly",
    costPerSqFt: 2.0,
    durability: "5-7 years",
    coverage: "320 sq ft/gallon",
  },
];

function BudgetComparisonTable({ budget }) {
  return (
    <div className="mt-4">
      <h5>Paint Options Within Your Budget</h5>
      <div className="table-responsive">
        <table className="table table-dark table-bordered table-hover">
          <thead>
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
              .map((option, idx) => (
                <tr key={idx}>
                  <td>{option.type}</td>
                  <td>${option.costPerSqFt.toFixed(2)}</td>
                  <td>{option.durability}</td>
                  <td>{option.coverage}</td>
                  <td>
                    {Math.floor(budget.max / option.costPerSqFt)} sq ft
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BudgetComparisonTable;
