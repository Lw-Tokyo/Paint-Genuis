// src/components/budget/BudgetInputForm.jsx
import React, { useState } from "react";
import "./BudgetInputForm.css";

function BudgetInputForm({ onSubmit }) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(Number(min), Number(max));
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
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Set Budget</button>
      </form>
    </div>
  );
}

export default BudgetInputForm;
