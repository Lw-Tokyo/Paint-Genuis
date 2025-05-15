import React, { useState } from "react";
import "./PaintCoverageCalculator.css";

const coverageFactors = {
  Standard: 350,
  Premium: 400,
  Luxury: 450,
};

const PaintCoverageCalculator = () => {
  const [inputMethod, setInputMethod] = useState("area");
  const [area, setArea] = useState("");
  const [roomWidth, setRoomWidth] = useState("");
  const [roomLength, setRoomLength] = useState("");
  const [roomHeight, setRoomHeight] = useState("");
  const [coats, setCoats] = useState(2);
  const [paintType, setPaintType] = useState("Standard");
  const [gallonsNeeded, setGallonsNeeded] = useState(null);

  const calculateArea = () => {
    if (inputMethod === "area") {
      return parseFloat(area) || 0;
    } else {
      // Calculate wall area (excluding ceiling) using room dimensions
      const width = parseFloat(roomWidth) || 0;
      const length = parseFloat(roomLength) || 0;
      const height = parseFloat(roomHeight) || 0;
      
      // Area = 2 * (length * height) + 2 * (width * height)
      return 2 * (length * height) + 2 * (width * height);
    }
  };

  const handleCalculate = () => {
    const calculatedArea = calculateArea();
    if (calculatedArea > 0 && coats > 0) {
      const coverage = coverageFactors[paintType];
      const totalCoverage = coverage * coats;
      const gallons = (calculatedArea / totalCoverage).toFixed(2);
      setGallonsNeeded(gallons);
    }
  };

  return (
    <div className="paint-coverage-calculator">
      <h2 className="calculator-title">Paint Genius Calculator</h2>
      
      <div className="input-toggle">
        <button 
          className={`toggle-btn ${inputMethod === "area" ? "active" : ""}`}
          onClick={() => setInputMethod("area")}
        >
          Enter Area
        </button>
        <button 
          className={`toggle-btn ${inputMethod === "dimensions" ? "active" : ""}`}
          onClick={() => setInputMethod("dimensions")}
        >
          Enter Dimensions
        </button>
      </div>

      {inputMethod === "area" ? (
        <div className="form-group fade-in">
          <label>Area (sq ft):</label>
          <input
            type="number"
            min="0"
            value={area}
            onChange={(e) => setArea(Math.max(0, e.target.value))}
            placeholder="Enter area in square feet"
          />
        </div>
      ) : (
        <div className="room-dimensions fade-in">
          <div className="form-group">
            <label>Room Width (ft):</label>
                          <input
              type="number"
              min="0"
              value={roomWidth}
              onChange={(e) => setRoomWidth(Math.max(0, e.target.value))}
              placeholder="Width"
            />
          </div>
          <div className="form-group">
            <label>Room Length (ft):</label>
                          <input
              type="number"
              min="0"
              value={roomLength}
              onChange={(e) => setRoomLength(Math.max(0, e.target.value))}
              placeholder="Length"
            />
          </div>
          <div className="form-group">
            <label>Room Height (ft):</label>
                          <input
              type="number"
              min="0"
              value={roomHeight}
              onChange={(e) => setRoomHeight(Math.max(0, e.target.value))}
              placeholder="Height"
            />
          </div>
        </div>
      )}

      <div className="form-group fade-in delay-1">
        <label>Number of Coats:</label>
        <input
          type="number"
          min="1"
          value={coats}
          onChange={(e) => setCoats(Math.max(1, parseInt(e.target.value) || 1))}
          placeholder="Minimum 2 coats recommended"
        />
      </div>

      <div className="form-group fade-in delay-1">
        <label>Paint Type:</label>
        <select value={paintType} onChange={(e) => setPaintType(e.target.value)}>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
          <option value="Luxury">Luxury</option>
        </select>
      </div>

      <button className="calculate-btn fade-in delay-2" onClick={handleCalculate}>
        Calculate
      </button>

      {gallonsNeeded !== null && (
        <div className="result fade-in">
          <div className="result-card">
            <h3>Paint Needed</h3>
            <div className="result-value">{gallonsNeeded} <span>gallons</span></div>
            <p className="result-details">
              {paintType} paint • {coats} coats • {calculateArea().toFixed(0)} sq ft
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaintCoverageCalculator;