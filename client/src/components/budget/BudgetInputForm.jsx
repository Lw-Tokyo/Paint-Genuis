import React, { useState, useEffect } from "react";
import "./BudgetInputForm.css";

function BudgetInputForm({ onSubmit, initialMin = "", initialMax = "" }) {
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);
      
  useEffect(() => {
    if (initialMin !== "") setMin(initialMin);
    if (initialMax !== "") setMax(initialMax);
  }, [initialMin, initialMax]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(Number(min), Number(max), null);
  };
  
  return (
    <div className="budget-input-form-container">
      <div className="budget-input-form-wrapper">
        <div className="budget-input-form-inner">
          <div className="budget-input-group">
            <label className="budget-input-label">
              <span className="budget-input-label-icon">💵</span>
              Minimum Budget (PKR)
            </label>
            <input
              type="number"
              className="budget-input-field"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder="Enter minimum budget"
              min="0"
              step="1"
              required
            />
          </div>

          <div className="budget-input-group">
            <label className="budget-input-label">
              <span className="budget-input-label-icon">💰</span>
              Maximum Budget (PKR)
            </label>
            <input
              type="number"
              className="budget-input-field"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder="Enter maximum budget"
              min="0"
              step="1"
              required
            />
          </div>

          <button 
            onClick={handleSubmit} 
            className="budget-input-submit-button"
          >
            <span className="budget-input-button-icon">✨</span>
            Set Budget
          </button>
        </div>
      </div>
    </div>
  );
}

export default BudgetInputForm;