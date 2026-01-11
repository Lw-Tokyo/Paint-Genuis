import React, { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import './CostEstimatorPage.css';

function CostEstimatorPage() {
  const [formData, setFormData] = useState({
    length: '',
    width: '',
    height: '',
    paintType: 'standard',
    coats: 3, 
  });

  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value < 0) return; 
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowSkeleton(true);
    setEstimate(null);
    setError('');

    try {
      const payload = {
        length: formData.length,
        width: formData.width,
        height: formData.height,
        paintType: formData.paintType,
        coats: formData.coats,
      };

      const response = await axios.post('http://localhost:5000/api/estimate', payload);
      
      setTimeout(() => {
        setEstimate(response.data.totalCost);
        setShowSuccess(true);
        setShowSkeleton(false);
        setLoading(false);
      }, 1500);

    } catch (err) {
      console.error('Error:', err);
      setError('Failed to calculate estimate. Please check your inputs or try again later.');
      setShowSkeleton(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 30000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const getPaintTypeIcon = (type) => {
    switch(type) {
      case 'standard': return '✨';
      case 'premium': return '⭐';
      case 'luxury': return '👑';
      default: return '🎨';
    }
  };

  return (
    <div className="cost-estimator-wrapper">
      <div className="cost-estimator-content">
        {/* Page Header */}
        <header className="cost-estimator-header cost-slide-in-down">
          <span className="cost-header-icon">🧮</span>
          <h1 className="cost-page-title">
            <span className="cost-gradient-text">Paint Cost Estimator</span>
          </h1>
          <p className="cost-page-subtitle">Get an instant estimate for your painting project</p>
        </header>

        {/* Estimator Card */}
        <div className="cost-glass-card cost-slide-in-up">
          <form onSubmit={handleSubmit} className="cost-form">
            <div className="cost-input-group">
              <label htmlFor="length" className="cost-label">
                <span className="cost-label-icon">📏</span>
                Room Length (ft)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="cost-input"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                placeholder="Enter length"
                required
              />
            </div>
            
            <div className="cost-input-group">
              <label htmlFor="width" className="cost-label">
                <span className="cost-label-icon">↔️</span>
                Room Width (ft)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="cost-input"
                id="width"
                name="width"
                value={formData.width}
                onChange={handleChange}
                placeholder="Enter width"
                required
              />
            </div>
            
            <div className="cost-input-group">
              <label htmlFor="height" className="cost-label">
                <span className="cost-label-icon">⬆️</span>
                Room Height (ft)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="cost-input"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Enter height"
                required
              />
            </div>
            
            <div className="cost-input-group">
              <label htmlFor="paintType" className="cost-label">
                <span className="cost-label-icon">{getPaintTypeIcon(formData.paintType)}</span>
                Paint Type
              </label>
              <select
                className="cost-select"
                id="paintType"
                name="paintType"
                value={formData.paintType}
                onChange={handleChange}
              >
                <option value="standard">✨ Standard</option>
                <option value="premium">⭐ Premium</option>
                <option value="luxury">👑 Luxury</option>
              </select>
            </div>

            <div className="cost-input-group">
              <label htmlFor="coats" className="cost-label">
                <span className="cost-label-icon">🎨</span>
                Number of Coats
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="cost-input"
                id="coats"
                name="coats"
                value={formData.coats}
                onChange={handleChange}
                placeholder="Enter number of coats"
                required
              />
            </div>

            <button type="submit" className="cost-submit-button" disabled={loading}>
              <span className="cost-button-icon">🧮</span>
              {loading ? "Calculating..." : "Calculate Estimate"}
            </button>
          </form>

          {showSkeleton && (
            <div className="cost-skeleton-container">
              <div className="cost-skeleton-item"></div>
              <div className="cost-skeleton-item cost-skeleton-small"></div>
              <div className="cost-skeleton-item cost-skeleton-small"></div>
            </div>
          )}

          {estimate !== null && showSuccess && (
            <div className="cost-result-container cost-fade-in">
              <div className="cost-result-icon">💰</div>
              <h3 className="cost-result-title">Your Estimated Cost</h3>
              <div className="cost-result-amount cost-gradient-text">
                {estimate.toLocaleString()} PKR
              </div>
              <p className="cost-result-subtitle">This is an estimated cost based on your inputs</p>
            </div>
          )}

          {error && (
            <div className="cost-error-container cost-fade-in">
              <div className="cost-error-icon">❌</div>
              <p className="cost-error-text">{error}</p>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="cost-info-grid cost-slide-in-up-delay">
          <div className="cost-info-card">
            <span className="cost-info-icon">📊</span>
            <h4 className="cost-info-title">Accurate Estimates</h4>
            <p className="cost-info-text">Get precise cost calculations based on room dimensions and paint quality</p>
          </div>
          
          <div className="cost-info-card">
            <span className="cost-info-icon">⚡</span>
            <h4 className="cost-info-title">Instant Results</h4>
            <p className="cost-info-text">Receive your estimate immediately with detailed breakdowns</p>
          </div>
          
          <div className="cost-info-card">
            <span className="cost-info-icon">💎</span>
            <h4 className="cost-info-title">Multiple Options</h4>
            <p className="cost-info-text">Choose from standard, premium, or luxury paint types</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CostEstimatorPage;