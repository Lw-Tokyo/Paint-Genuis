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
      const width = parseFloat(roomWidth) || 0;
      const length = parseFloat(roomLength) || 0;
      const height = parseFloat(roomHeight) || 0;
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

  const getPaintTypeIcon = (type) => {
    switch(type) {
      case 'Standard': return '✨';
      case 'Premium': return '⭐';
      case 'Luxury': return '👑';
      default: return '🎨';
    }
  };

  return (
    <div className="coverage-calculator-wrapper">
      <div className="coverage-calculator-content">
        {/* Page Header */}
        <header className="coverage-header coverage-slide-in-down">
          <span className="coverage-header-icon">🎨</span>
          <h1 className="coverage-page-title">
            <span className="coverage-gradient-text">Paint Coverage Calculator</span>
          </h1>
          <p className="coverage-page-subtitle">Calculate the exact amount of paint you need</p>
        </header>

        {/* Calculator Card */}
        <div className="coverage-glass-card coverage-slide-in-up">
          {/* Input Method Toggle */}
          <div className="coverage-toggle-container">
            <button 
              className={`coverage-toggle-btn ${inputMethod === "area" ? "coverage-toggle-active" : ""}`}
              onClick={() => setInputMethod("area")}
            >
              <span className="coverage-toggle-icon">📐</span>
              Enter Area
            </button>
            <button 
              className={`coverage-toggle-btn ${inputMethod === "dimensions" ? "coverage-toggle-active" : ""}`}
              onClick={() => setInputMethod("dimensions")}
            >
              <span className="coverage-toggle-icon">📏</span>
              Enter Dimensions
            </button>
          </div>

          {/* Input Fields */}
          {inputMethod === "area" ? (
            <div className="coverage-input-group coverage-fade-in">
              <label className="coverage-label">
                <span className="coverage-label-icon">📐</span>
                Area (sq ft)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="coverage-input"
                value={area}
                onChange={(e) => setArea(Math.max(0, e.target.value))}
                placeholder="Enter total area in square feet"
              />
            </div>
          ) : (
            <div className="coverage-dimensions-grid coverage-fade-in">
              <div className="coverage-input-group">
                <label className="coverage-label">
                  <span className="coverage-label-icon">↔️</span>
                  Width (ft)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="coverage-input"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(Math.max(0, e.target.value))}
                  placeholder="Width"
                />
              </div>
              <div className="coverage-input-group">
                <label className="coverage-label">
                  <span className="coverage-label-icon">📏</span>
                  Length (ft)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="coverage-input"
                  value={roomLength}
                  onChange={(e) => setRoomLength(Math.max(0, e.target.value))}
                  placeholder="Length"
                />
              </div>
              <div className="coverage-input-group">
                <label className="coverage-label">
                  <span className="coverage-label-icon">⬆️</span>
                  Height (ft)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="coverage-input"
                  value={roomHeight}
                  onChange={(e) => setRoomHeight(Math.max(0, e.target.value))}
                  placeholder="Height"
                />
              </div>
            </div>
          )}

          <div className="coverage-input-group coverage-fade-in coverage-delay-1">
            <label className="coverage-label">
              <span className="coverage-label-icon">🎨</span>
              Number of Coats
            </label>
            <input
              type="number"
              min="1"
              max="10"
              className="coverage-input"
              value={coats}
              onChange={(e) => setCoats(Math.max(1, parseInt(e.target.value) || 1))}
              placeholder="Minimum 2 coats recommended"
            />
            <div className="coverage-help-text">
              💡 Minimum 2 coats recommended for best coverage
            </div>
          </div>

          <div className="coverage-input-group coverage-fade-in coverage-delay-1">
            <label className="coverage-label">
              <span className="coverage-label-icon">{getPaintTypeIcon(paintType)}</span>
              Paint Type
            </label>
            <select 
              className="coverage-select" 
              value={paintType} 
              onChange={(e) => setPaintType(e.target.value)}
            >
              <option value="Standard">✨ Standard (350 sq ft/gal)</option>
              <option value="Premium">⭐ Premium (400 sq ft/gal)</option>
              <option value="Luxury">👑 Luxury (450 sq ft/gal)</option>
            </select>
          </div>

          <button className="coverage-calculate-btn coverage-fade-in coverage-delay-2" onClick={handleCalculate}>
            <span className="coverage-button-icon">🧮</span>
            Calculate Coverage
          </button>

          {/* Result Display */}
          {gallonsNeeded !== null && (
            <div className="coverage-result-container coverage-result-fade-in">
              <div className="coverage-result-icon">🪣</div>
              <h3 className="coverage-result-title">Paint Required</h3>
              <div className="coverage-result-value coverage-gradient-text">
                {gallonsNeeded} <span className="coverage-result-unit">gallons</span>
              </div>
              <div className="coverage-result-details">
                <div className="coverage-detail-item">
                  <span className="coverage-detail-icon">{getPaintTypeIcon(paintType)}</span>
                  <span>{paintType} Paint</span>
                </div>
                <div className="coverage-detail-item">
                  <span className="coverage-detail-icon">🎨</span>
                  <span>{coats} Coats</span>
                </div>
                <div className="coverage-detail-item">
                  <span className="coverage-detail-icon">📐</span>
                  <span>{calculateArea().toFixed(0)} sq ft</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="coverage-info-grid coverage-slide-in-up-delay">
          <div className="coverage-info-card">
            <span className="coverage-info-icon">📊</span>
            <h4 className="coverage-info-title">Accurate Calculations</h4>
            <p className="coverage-info-text">Get precise paint requirements based on coverage factors</p>
          </div>
          
          <div className="coverage-info-card">
            <span className="coverage-info-icon">🎯</span>
            <h4 className="coverage-info-title">Multiple Options</h4>
            <p className="coverage-info-text">Choose between area input or room dimensions</p>
          </div>
          
          <div className="coverage-info-card">
            <span className="coverage-info-icon">💰</span>
            <h4 className="coverage-info-title">Save Money</h4>
            <p className="coverage-info-text">Buy exactly what you need, avoid waste</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintCoverageCalculator;