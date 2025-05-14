// client/src/components/budget/BudgetInputForm.jsx
import React, { useState, useEffect } from "react";
import "./BudgetInputForm.css";

function BudgetInputForm({ onSubmit, initialMin = "", initialMax = "" }) {
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);
      
  // Update form values if initialMin/initialMax props change
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
      <form onSubmit={handleSubmit} className="budget-form shadow p-4 rounded">
        <h4 className="text-center mb-4">Set Your Budget</h4>
        <div className="mb-3">
          <label className="form-label">Minimum Budget ($)</label>
          <input
            type="number"
            className="form-control"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="Enter minimum budget"
            min="0"
            step="1"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Maximum Budget ($)</label>
          <input
            type="number"
            className="form-control"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="Enter maximum budget"
            min="0"
            step="1"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Set Budget</button>
      </form>
    </div>
  );
}

export default BudgetInputForm;