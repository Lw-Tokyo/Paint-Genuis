
import React, { useState, useEffect } from "react";
import "./RoomDimensionsForm.css";

function RoomDimensionsForm({ onSubmit, initialDimensions = null, initialCoats = 3 }) {
  const [dimensions, setDimensions] = useState({
    length: initialDimensions?.length || "",
    width: initialDimensions?.width || "",
    height: initialDimensions?.height || ""
  });
  
  const [coats, setCoats] = useState(initialCoats);
  

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
  
  const handleCoatsChange = (e) => {
    setCoats(Number(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { length, width, height } = dimensions;
    
    if (length && width && height) {
      onSubmit({
        length: Number(length),
        width: Number(width),
        height: Number(height),
        coats: Number(coats)
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
        <div className="mb-3">
          <label className="form-label">Number of Coats</label>
          <select
            name="coats"
            className="form-select"
            value={coats}
            onChange={handleCoatsChange}
            required
          >
            <option value="1">1 coat</option>
            <option value="2">2 coats</option>
            <option value="3">3 coats (recommended)</option>
            <option value="4">4 coats</option>
          </select>
          <div className="form-text">
            More coats provide better coverage but increase cost.
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">Calculate Estimate</button>
      </form>
    </div>
  );
}

export default RoomDimensionsForm;