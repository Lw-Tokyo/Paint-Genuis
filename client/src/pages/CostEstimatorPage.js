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
  });

  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value < 0) return; // prevent negative input
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
    };

    const response = await axios.post('http://localhost:5000/api/estimate', payload);
    setTimeout(() => {
      setEstimate(response.data.totalCost);
      setShowSuccess(true);
      setShowSkeleton(false);
      setFormData({
        length: '',
        width: '',
        height: '',
        paintType: 'standard',
      });
    }, 1500);
  } catch (err) {
    console.error('Error:', err);
    setError('Failed to calculate estimate. Please check your inputs or try again later.');
    setShowSkeleton(false);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 20000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="cost-container">
      <h2 className="cost-title">Paint Cost Estimator</h2>
      
      <form onSubmit={handleSubmit} className="cost-form">
        <div className="form-group">
          <label htmlFor="length" className="form-label">Room Length (ft)</label>
          <input
            type="number"
            min="0"
            className="form-input"
            id="length"
            name="length"
            value={formData.length}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="width" className="form-label">Room Width (ft)</label>
          <input
            type="number"
            min="0"
            className="form-input"
            id="width"
            name="width"
            value={formData.width}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="height" className="form-label">Room Height (ft)</label>
          <input
            type="number"
            min="0"
            className="form-input"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="paintType" className="form-label">Paint Type</label>
          <select
            className="form-select"
            id="paintType"
            name="paintType"
            value={formData.paintType}
            onChange={handleChange}
          >
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <button type="submit" className="estimate-btn" disabled={loading}>
          {loading ? "Calculating..." : "Calculate Estimate"}
        </button>
      </form>

      {/* Skeleton Loader */}
      {showSkeleton && (
        <div className="skeleton-container">
          <Skeleton height={50} count={1} className="skeleton mb-2" />
          <Skeleton height={30} count={2} className="skeleton" />
        </div>
      )}

      {/* Success Message */}
      {estimate !== null && showSuccess && (
        <div className="result-container">
          <div className="estimate-result">
            Your estimated painting cost is <span className="highlight">PKR{estimate}</span> 
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="result-container">
          <div className="estimate-result error-message">
            {error}
          </div>
        </div>
      )}

      <p className="about-text fade-in delay-2" style={{marginTop: "40px", textAlign: "center"}}>
        Get <span className="highlight">accurate</span>, <span className="highlight">reliable</span>, and <span className="highlight">instant</span> estimates for your paints!
      </p>
    </div>
  );
}

export default CostEstimatorPage;