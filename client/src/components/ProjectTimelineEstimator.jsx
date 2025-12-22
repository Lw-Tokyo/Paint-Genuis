// client/src/components/ProjectTimelineEstimator.jsx
import React, { useState, useEffect } from 'react';
import './ProjectTimelineEstimator.css';
import DiscountService from '../services/DiscountService';
import TimelineService from '../services/TimelineService';
import CartService from '../services/CartService';

const ProjectTimelineEstimator = ({ contractor, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: 'interior',
    numberOfRooms: 1,
    roomSize: 120,
    wallCondition: 'smooth',
    ceilingIncluded: false,
    primerNeeded: true,
    numberOfCoats: 2,
    trimWork: false,
    accentWalls: false,
    texturedWalls: false,
    startDate: new Date().toISOString().split('T')[0],
    promoCode: ''
  });
  
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [discounts, setDiscounts] = useState(null);
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [promoError, setPromoError] = useState('');
  const [validatedPromo, setValidatedPromo] = useState(null);
  const [savedEstimateId, setSavedEstimateId] = useState(null);

  const totalSteps = 4;

  // Fetch available discounts on mount
  useEffect(() => {
    fetchAvailableDiscounts();
  }, []);

  const fetchAvailableDiscounts = async () => {
    try {
      const data = await DiscountService.getActiveDiscounts('timeline', contractor._id);
      if (data.success) {
        setAvailableDiscounts(data.data);
      }
    } catch (err) {
      console.error('Error fetching discounts:', err);
    }
  };

  const calculateEstimate = async () => {
    setLoading(true);
    setError('');
    
    try {
      const requestData = {
        projectType: formData.projectType,
        numberOfRooms: parseInt(formData.numberOfRooms),
        roomSize: parseInt(formData.roomSize),
        wallCondition: formData.wallCondition,
        ceilingIncluded: Boolean(formData.ceilingIncluded),
        primerNeeded: Boolean(formData.primerNeeded),
        numberOfCoats: parseInt(formData.numberOfCoats),
        trimWork: Boolean(formData.trimWork),
        accentWalls: Boolean(formData.accentWalls),
        texturedWalls: Boolean(formData.texturedWalls),
        contractorId: contractor._id,
        startDate: formData.startDate,
        promoCode: formData.promoCode || undefined
      };

      // Use TimelineService to calculate with discounts
      const data = await TimelineService.calculateTimeline(requestData);

      if (data.success) {
        setEstimate(data.data.timeline || data.data);
        setDiscounts(data.data.discounts || null);
      } else {
        setError(data.message || 'Failed to calculate timeline');
      }
    } catch (err) {
      console.error('Calculate error:', err);
      setError(err.message || 'Failed to calculate timeline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyPromoCode = async () => {
    if (!formData.promoCode) {
      setPromoError('Please enter a promo code');
      return;
    }
    
    setPromoError('');
    setLoading(true);
    
    try {
      const data = await DiscountService.validatePromoCode(formData.promoCode);
      
      if (data.success) {
        setValidatedPromo(data.data);
        alert(`✅ Promo code applied! ${data.data.name}`);
        setPromoError('');
      } else {
        setPromoError(data.message || 'Invalid promo code');
        setValidatedPromo(null);
      }
    } catch (err) {
      console.error('Promo validation error:', err);
      setPromoError('Failed to validate promo code. Please try again.');
      setValidatedPromo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateEstimate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear promo validation when code changes
    if (field === 'promoCode') {
      setValidatedPromo(null);
      setPromoError('');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSaveEstimate = async () => {
    setLoading(true);
    setError('');

    try {
      const estimateData = {
        contractorId: contractor._id,
        projectDetails: {
          projectType: formData.projectType,
          numberOfRooms: parseInt(formData.numberOfRooms),
          roomSize: parseInt(formData.roomSize),
          wallCondition: formData.wallCondition,
          ceilingIncluded: formData.ceilingIncluded,
          primerNeeded: formData.primerNeeded,
          numberOfCoats: parseInt(formData.numberOfCoats),
          trimWork: formData.trimWork,
          accentWalls: formData.accentWalls,
          texturedWalls: formData.texturedWalls
        },
        timeline: {
          totalHours: estimate.totalHours,
          totalDays: estimate.totalDays,
          workingDays: estimate.workingDays,
          startDate: estimate.startDate,
          completionDate: estimate.completionDate,
          phases: estimate.phases,
          dryingTime: estimate.dryingTime || 0,
          weatherDelay: estimate.weatherDelay || 0
        },
        estimatedCost: estimate.estimatedCost || null,
        discounts: discounts || null,
        notes: ''
      };

      console.log('💾 Saving estimate with data:', estimateData);

      const data = await TimelineService.saveEstimate(estimateData);

      if (data.success) {
        setSavedEstimateId(data.data._id);
        console.log('✅ Estimate saved successfully:', data.data);
        alert('✅ Estimate saved successfully!');
      } else {
        setError(data.message || 'Failed to save estimate');
      }
    } catch (err) {
      console.error('Save estimate error:', err);
      setError(err.message || 'Failed to save estimate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!savedEstimateId) {
      setError('Please save the estimate first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await CartService.addToCart(savedEstimateId);

      if (data.success) {
        alert('✅ Added to cart successfully!');
        onClose();
      } else {
        setError(data.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      setError(err.message || 'Failed to add to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="timeline-modal-overlay" onClick={onClose}>
      <div className="timeline-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        {!estimate ? (
          <>
            <div className="modal-header">
              <h3 className="modal-title">Project Timeline & Cost Estimate</h3>
              <p className="modal-subtitle">with {contractor.companyName}</p>
            </div>

            {error && <div className="modal-error">{error}</div>}

            {/* Progress Bar */}
            <div className="modal-progress">
              <div className="modal-progress-bar" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
              <div className="progress-steps-indicator">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className={`step-dot ${currentStep >= step ? 'active' : ''}`}>
                    {currentStep > step ? '✓' : step}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="modal-steps">
              {/* Step 1: Project Type */}
              {currentStep === 1 && (
                <div className="modal-step">
                  <h3 className="step-title-modal">
                    <span className="step-number">1</span>
                    Project Details
                  </h3>
                  
                  <div className="project-type-selector">
                    <button
                      className={`type-btn ${formData.projectType === 'interior' ? 'active' : ''}`}
                      onClick={() => handleInputChange('projectType', 'interior')}
                    >
                      Interior
                    </button>
                    <button
                      className={`type-btn ${formData.projectType === 'exterior' ? 'active' : ''}`}
                      onClick={() => handleInputChange('projectType', 'exterior')}
                    >
                      Exterior
                    </button>
                  </div>

                  <div className="input-field-group">
                    <label className="field-label">
                      <span className="label-text">Number of Rooms</span>
                      <span className="label-value">{formData.numberOfRooms}</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={formData.numberOfRooms}
                      onChange={(e) => handleInputChange('numberOfRooms', parseInt(e.target.value))}
                      className="custom-slider"
                    />
                  </div>

                  <div className="input-field-group">
                    <label className="field-label">
                      <span className="label-text">Average Room Size (sq ft)</span>
                    </label>
                    <input 
                      type="number" 
                      min="50" 
                      max="5000" 
                      value={formData.roomSize}
                      onChange={(e) => handleInputChange('roomSize', e.target.value)}
                      className="number-input"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Requirements */}
              {currentStep === 2 && (
                <div className="modal-step">
                  <h3 className="step-title-modal">
                    <span className="step-number">2</span>
                    Project Requirements
                  </h3>
                  
                  <div className="checkboxes-grid">
                    <label className="checkbox-card">
                      <input 
                        type="checkbox"
                        checked={formData.ceilingIncluded}
                        onChange={(e) => handleInputChange('ceilingIncluded', e.target.checked)}
                      />
                      <div className="checkbox-content">
                        <span className="checkbox-title">Ceiling Painting</span>
                      </div>
                      <div className="checkbox-check">✓</div>
                    </label>

                    <label className="checkbox-card">
                      <input 
                        type="checkbox"
                        checked={formData.primerNeeded}
                        onChange={(e) => handleInputChange('primerNeeded', e.target.checked)}
                      />
                      <div className="checkbox-content">
                        <span className="checkbox-title">Primer Needed</span>
                      </div>
                      <div className="checkbox-check">✓</div>
                    </label>

                    <label className="checkbox-card">
                      <input 
                        type="checkbox"
                        checked={formData.trimWork}
                        onChange={(e) => handleInputChange('trimWork', e.target.checked)}
                      />
                      <div className="checkbox-content">
                        <span className="checkbox-title">Trim Work</span>
                      </div>
                      <div className="checkbox-check">✓</div>
                    </label>

                    <label className="checkbox-card">
                      <input 
                        type="checkbox"
                        checked={formData.accentWalls}
                        onChange={(e) => handleInputChange('accentWalls', e.target.checked)}
                      />
                      <div className="checkbox-content">
                        <span className="checkbox-title">Accent Walls</span>
                      </div>
                      <div className="checkbox-check">✓</div>
                    </label>
                  </div>

                  <div className="input-field-group">
                    <label className="field-label">
                      <span className="label-text">Number of Coats</span>
                      <span className="label-value">{formData.numberOfCoats}</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="3" 
                      value={formData.numberOfCoats}
                      onChange={(e) => handleInputChange('numberOfCoats', parseInt(e.target.value))}
                      className="custom-slider"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Schedule */}
              {currentStep === 3 && (
                <div className="modal-step">
                  <h3 className="step-title-modal">
                    <span className="step-number">3</span>
                    Schedule
                  </h3>
                  
                  <div className="input-field-group">
                    <label className="field-label">
                      <span className="label-text">Preferred Start Date</span>
                    </label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="date-input-styled"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Discounts */}
              {currentStep === 4 && (
                <div className="modal-step">
                  <h3 className="step-title-modal">
                    <span className="step-number">4</span>
                    Discounts & Offers
                  </h3>
                  
                  {/* Promo Code Input */}
                  <div className="promo-code-section">
                    <label className="field-label">
                      <span className="label-text">Have a promo code?</span>
                    </label>
                    <div className="promo-input-wrapper">
                      <input 
                        type="text"
                        value={formData.promoCode}
                        onChange={(e) => handleInputChange('promoCode', e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="promo-input"
                        disabled={loading}
                      />
                      <button 
                        onClick={applyPromoCode} 
                        className="apply-btn"
                        disabled={loading || !formData.promoCode}
                      >
                        {loading ? 'Checking...' : 'Apply'}
                      </button>
                    </div>
                    {promoError && <p className="promo-error">❌ {promoError}</p>}
                    {validatedPromo && <p className="promo-success">✅ Promo code valid: {validatedPromo.name}</p>}
                  </div>

                  {/* Available Discounts */}
                  <div className="available-discounts">
                    <h4 className="discounts-title">Available Offers</h4>
                    {availableDiscounts.length === 0 ? (
                      <p className="no-discounts">No active offers at this time</p>
                    ) : (
                      <div className="discounts-list">
                        {availableDiscounts.slice(0, 3).map((discount) => (
                          <div key={discount._id} className="discount-card">
                            <div className="discount-badge">
                              {discount.type === 'percentage' ? `${discount.value}% OFF` : `$${discount.value} OFF`}
                            </div>
                            <h5 className="discount-name">{discount.name}</h5>
                            <p className="discount-desc">{discount.description}</p>
                            {discount.code && (
                              <div className="discount-code">
                                Code: <strong>{discount.code}</strong>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Auto-apply notice */}
                  <div className="auto-apply-notice">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <span>Applicable discounts will be automatically applied to your estimate</span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="modal-nav">
              {currentStep > 1 && (
                <button onClick={handleBack} className="btn-modal btn-back" disabled={loading}>
                  ← Back
                </button>
              )}
              <button onClick={handleNext} className="btn-modal btn-next" disabled={loading}>
                {loading ? 'Processing...' : currentStep === totalSteps ? 'Calculate Estimate' : 'Continue →'}
              </button>
            </div>
          </>
        ) : (
          /* Results with Discounts */
          <div className="modal-results">
            {error && <div className="modal-error">{error}</div>}
            
            <div className="result-header-modal">
              <div className="success-icon-modal">✓</div>
              <h3>Your Project Estimate</h3>
            </div>

            {/* Timeline Summary */}
            <div className="timeline-summary">
              <div className="summary-card-large">
                <div className="big-number">{estimate.totalDays}</div>
                <div className="big-label">Total Days</div>
              </div>
            </div>

            {/* Pricing with Discounts */}
            {discounts && discounts.appliedDiscounts && discounts.appliedDiscounts.length > 0 && (
              <div className="discount-results">
                <div className="price-breakdown">
                  <div className="price-row original">
                    <span>Original Estimate</span>
                    <span>{formatCurrency(discounts.originalAmount)}</span>
                  </div>
                  
                  {discounts.appliedDiscounts.map((disc, idx) => (
                    <div key={idx} className="price-row discount">
                      <span className="discount-label">
                        <span className="discount-icon">🎉</span>
                        {disc.name}
                        {disc.code && <code className="inline-code">{disc.code}</code>}
                      </span>
                      <span className="discount-amount">-{formatCurrency(disc.amount)}</span>
                    </div>
                  ))}
                  
                  <div className="price-row total">
                    <span>Final Amount</span>
                    <span className="final-price">{formatCurrency(discounts.finalAmount)}</span>
                  </div>
                  
                  <div className="savings-badge">
                    You saved {formatCurrency(discounts.totalDiscount)} ({discounts.discountPercentage}%)!
                  </div>
                </div>
              </div>
            )}

            <div className="result-actions">
              <button onClick={onClose} className="btn-modal btn-secondary-result" disabled={loading}>
                Close
              </button>
              {!savedEstimateId ? (
                <button 
                  className="btn-modal btn-primary-result"
                  onClick={handleSaveEstimate}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Estimate'}
                </button>
              ) : (
                <button 
                  className="btn-modal btn-primary-result"
                  onClick={handleAddToCart}
                  disabled={loading}
                >
                  {loading ? 'Adding...' : '🛒 Add to Cart'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .promo-code-section {
          margin: 20px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .promo-input-wrapper {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .promo-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .promo-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .apply-btn {
          padding: 12px 24px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .apply-btn:hover:not(:disabled) {
          background: #4f46e5;
        }

        .apply-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .promo-error {
          color: #ef4444;
          font-size: 13px;
          margin-top: 8px;
        }

        .promo-success {
          color: #10b981;
          font-size: 13px;
          margin-top: 8px;
          font-weight: 600;
        }

        .available-discounts {
          margin-top: 30px;
        }

        .discounts-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .discounts-list {
          display: grid;
          gap: 12px;
        }

        .discount-card {
          position: relative;
          padding: 16px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding-left: 100px;
        }

        .discount-badge {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          text-align: center;
        }

        .discount-name {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 6px 0;
        }

        .discount-desc {
          font-size: 13px;
          color: #6b7280;
          margin: 0 0 8px 0;
        }

        .discount-code {
          font-size: 12px;
          color: #6366f1;
        }

        .discount-code strong {
          font-family: monospace;
          background: #f3f4f6;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .auto-apply-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
          padding: 12px;
          background: #eff6ff;
          border-radius: 8px;
          font-size: 13px;
          color: #1e40af;
        }

        .discount-results {
          margin: 30px 0;
        }

        .price-breakdown {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .price-row.original span:last-child {
          text-decoration: line-through;
          color: #9ca3af;
        }

        .price-row.discount {
          color: #10b981;
        }

        .discount-label {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .inline-code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-family: monospace;
        }

        .price-row.total {
          border-bottom: none;
          font-size: 18px;
          font-weight: 700;
          padding-top: 16px;
        }

        .final-price {
          color: #6366f1;
          font-size: 24px;
        }

        .savings-badge {
          margin-top: 16px;
          padding: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border-radius: 12px;
          text-align: center;
          font-weight: 600;
          font-size: 16px;
        }

        .modal-error {
          background: #fee2e2;
          color: #991b1b;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
};

export default ProjectTimelineEstimator;