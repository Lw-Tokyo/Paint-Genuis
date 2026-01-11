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
      <div className="room-form-wrapper">
        <div className="room-form-inner">
          <div className="room-input-group">
            <label className="room-label">
              <span className="room-label-icon">📏</span>
              Length (ft)
            </label>
            <input
              type="number"
              name="length"
              className="room-input"
              value={dimensions.length}
              onChange={handleChange}
              placeholder="Enter length"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="room-input-group">
            <label className="room-label">
              <span className="room-label-icon">↔️</span>
              Width (ft)
            </label>
            <input
              type="number"
              name="width"
              className="room-input"
              value={dimensions.width}
              onChange={handleChange}
              placeholder="Enter width"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="room-input-group">
            <label className="room-label">
              <span className="room-label-icon">⬆️</span>
              Height (ft)
            </label>
            <input
              type="number"
              name="height"
              className="room-input"
              value={dimensions.height}
              onChange={handleChange}
              placeholder="Enter height"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="room-input-group">
            <label className="room-label">
              <span className="room-label-icon">🎨</span>
              Number of Coats
            </label>
            <select
              name="coats"
              className="room-select"
              value={coats}
              onChange={handleCoatsChange}
              required
            >
              <option value="1">1 coat</option>
              <option value="2">2 coats</option>
              <option value="3">3 coats (recommended)</option>
              <option value="4">4 coats</option>
            </select>
            <div className="room-help-text">
              💡 More coats provide better coverage but increase cost
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            className="room-submit-button"
          >
            <span className="room-button-icon">🧮</span>
            Calculate Estimate
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomDimensionsForm;