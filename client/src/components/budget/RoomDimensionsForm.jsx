// client/src/components/budget/RoomDimensionsForm.jsx
import React, { useState, useEffect } from "react";
import "./RoomDimensionsForm.css";

function RoomDimensionsForm({ onSubmit, initialDimensions = null }) {
  const [dimensions, setDimensions] = useState({
    length: initialDimensions?.length || "",
    width: initialDimensions?.width || "",
    height: initialDimensions?.height || ""
  });
  
  // Update form values if initialDimensions prop changes
  useEffect(() => {
    if (initialDimensions) {
      setDimensions({
        length: initialDimensions.length || "",
        width: initialDimensions.width || "",
        height: initialDimensions.height || ""
      });
    }
  }, [initialDimensions]);
  
  const handleChange = (e) => {
    setDimensions({ ...dimensions, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const { length, width, height } = dimensions;
        
    if (length && width && height) {
      onSubmit({
        length: Number(length),
        width: Number(width),
        height: Number(height),
      });
    }
  };
  
  return (
    <div className="room-dimensions-form-container">
      <form onSubmit={handleSubmit} className="room-form shadow p-4 rounded">
        <h4 className="text-center mb-4">Enter Room Dimensions</h4>
        <div className="mb-3">
          <label className="form-label">Length (ft)</label>
          <input
            type="number"
            name="length"
            className="form-control"
            value={dimensions.length}
            onChange={handleChange}
            placeholder="Enter length"
            min="0.01"
            step="0.01"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Width (ft)</label>
          <input
            type="number"
            name="width"
            className="form-control"
            value={dimensions.width}
            onChange={handleChange}
            placeholder="Enter width"
            min="0.01"
            step="0.01"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Height (ft)</label>
          <input
            type="number"
            name="height"
            className="form-control"
            value={dimensions.height}
            onChange={handleChange}
            placeholder="Enter height"
            min="0.01"
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Calculate Estimate</button>
      </form>
    </div>
  );
}

export default RoomDimensionsForm;