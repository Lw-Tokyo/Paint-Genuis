// client\src\components\ProjectTimelineEstimator.jsx
import React, { useState } from 'react';
import TimelineService from '../services/TimelineService';
import './ProjectTimelineEstimator.css';

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
    startDate: new Date().toISOString().split('T')[0]
  });
  
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  const totalSteps = 3;

  // Calculate estimate
  // Update the calculateEstimate function in ProjectTimelineEstimator.jsx

const calculateEstimate = async () => {
  setLoading(true);
  setError('');
  
  try {
    console.log('📊 Calculating timeline with data:', {
      ...formData,
      contractorId: contractor._id
    });

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
      startDate: formData.startDate
    };

    console.log('📤 Sending request:', requestData);

    const response = await TimelineService.calculateTimeline(requestData);
    
    console.log('📥 Received response:', response);

    if (response.success) {
      setEstimate(response.data);
      console.log('✅ Estimate set successfully');
    } else {
      setError(response.message || 'Failed to calculate timeline');
      console.error('❌ Response error:', response.message);
    }
  } catch (err) {
    console.error('❌ Calculate error:', err);
    console.error('Error details:', err.response?.data);
    setError(err.response?.data?.message || err.message || 'Failed to calculate timeline');
  } finally {
    setLoading(false);
  }
};

  // Save estimate
  const handleSaveEstimate = async () => {
    setSaveLoading(true);
    try {
      const estimateData = {
        contractorId: contractor._id,
        projectDetails: formData,
        timeline: estimate,
        notes: ''
      };

      const response = await TimelineService.saveEstimate(estimateData);
      
      if (response.success) {
        alert('Estimate saved successfully!');
        onClose();
      }
    } catch (err) {
      console.error('Save error:', err);
      alert(err.message || 'Failed to save estimate');
    } finally {
      setSaveLoading(false);
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
  };

  // Handle number input with validation
  const handleNumberInput = (field, value, min, max) => {
    const numValue = parseInt(value) || min;
    const clampedValue = Math.min(Math.max(numValue, min), max);
    setFormData(prev => ({ ...prev, [field]: clampedValue }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="timeline-modal-overlay" onClick={onClose}>
      <div className="timeline-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!estimate ? (
          <>
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h2 className="modal-title">Project Timeline Estimate</h2>
              <p className="modal-subtitle">with {contractor.companyName}</p>
            </div>

            {error && (
              <div className="modal-error">{error}</div>
            )}

            {/* Progress */}
            <div className="modal-progress">
              <div className="modal-progress-bar" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
              <div className="progress-steps-indicator">
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step} 
                    className={`step-dot ${currentStep >= step ? 'active' : ''}`}
                  >
                    {currentStep > step ? '✓' : step}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="modal-steps">
              {/* Step 1: Project Type & Details */}
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
                      <div className="type-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                      <span>Interior</span>
                    </button>
                    <button
                      className={`type-btn ${formData.projectType === 'exterior' ? 'active' : ''}`}
                      onClick={() => handleInputChange('projectType', 'exterior')}
                    >
                      <div className="type-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        </svg>
                      </div>
                      <span>Exterior</span>
                    </button>
                  </div>

                  {/* Number of Rooms - Slider */}
                  <div className="input-field-group">
                    <label className="field-label">
                      <span className="label-text">Number of Rooms</span>
                      <span className="label-value">{formData.numberOfRooms}</span>
                    </label>
                    <div className="slider-container">
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={formData.numberOfRooms}
                        onChange={(e) => handleInputChange('numberOfRooms', parseInt(e.target.value))}
                        className="custom-slider"
                        style={{
                          background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(formData.numberOfRooms - 1) / 9 * 100}%, #e5e7eb ${(formData.numberOfRooms - 1) / 9 * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="slider-markers">
                        {[...Array(10)].map((_, i) => (
                          <span key={i} className="marker">{i + 1}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Room Size - Text Input */}
                  <div className="input-field-group">
                    <label className="field-label">
                      <span className="label-text">Average Room Size</span>
                    </label>
                    <div className="input-with-unit">
                      <input 
                        type="number" 
                        min="50" 
                        max="5000" 
                        value={formData.roomSize}
                        onChange={(e) => handleNumberInput('roomSize', e.target.value, 50, 5000)}
                        className="number-input"
                        placeholder="Enter size"
                      />
                      <span className="input-unit">sq ft</span>
                    </div>
                    <p className="input-hint">Typical room: 120-200 sq ft</p>
                  </div>

                  {/* Wall Condition */}
                  <div className="input-field-group">
                    <label className="field-label">
                      <span className="label-text">Wall Condition</span>
                    </label>
                    <div className="condition-options">
                      {[
                        { value: 'smooth', label: 'Smooth', icon: '✨' },
                        { value: 'textured', label: 'Textured', icon: '🏔️' },
                        { value: 'needs_repair', label: 'Needs Repair', icon: '🔧' }
                      ].map((condition) => (
                        <button
                          key={condition.value}
                          className={`condition-btn ${formData.wallCondition === condition.value ? 'active' : ''}`}
                          onClick={() => handleInputChange('wallCondition', condition.value)}
                        >
                          <span className="condition-icon">{condition.icon}</span>
                          <span>{condition.label}</span>
                        </button>
                      ))}
                    </div>
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
                        <div className="checkbox-icon-wrapper">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                          </svg>
                        </div>
                        <div className="checkbox-text">
                          <span className="checkbox-title">Ceiling Painting</span>
                          <span className="checkbox-desc">Include ceiling work</span>
                        </div>
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
                        <div className="checkbox-icon-wrapper">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M2 12h20" />
                          </svg>
                        </div>
                        <div className="checkbox-text">
                          <span className="checkbox-title">Primer Needed</span>
                          <span className="checkbox-desc">Apply base coat</span>
                        </div>
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
                        <div className="checkbox-icon-wrapper">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="2" />
                          </svg>
                        </div>
                        <div className="checkbox-text">
                          <span className="checkbox-title">Trim Work</span>
                          <span className="checkbox-desc">Baseboards & molding</span>
                        </div>
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
                        <div className="checkbox-icon-wrapper">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="18" />
                            <rect x="14" y="3" width="7" height="18" />
                          </svg>
                        </div>
                        <div className="checkbox-text">
                          <span className="checkbox-title">Accent Walls</span>
                          <span className="checkbox-desc">Feature wall design</span>
                        </div>
                      </div>
                      <div className="checkbox-check">✓</div>
                    </label>

                    <label className="checkbox-card">
                      <input 
                        type="checkbox"
                        checked={formData.texturedWalls}
                        onChange={(e) => handleInputChange('texturedWalls', e.target.checked)}
                      />
                      <div className="checkbox-content">
                        <div className="checkbox-icon-wrapper">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="5" cy="5" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="19" cy="5" r="1" />
                            <circle cx="5" cy="12" r="1" />
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="19" r="1" />
                            <circle cx="12" cy="19" r="1" />
                            <circle cx="19" cy="19" r="1" />
                          </svg>
                        </div>
                        <div className="checkbox-text">
                          <span className="checkbox-title">Textured Finish</span>
                          <span className="checkbox-desc">Special texture coating</span>
                        </div>
                      </div>
                      <div className="checkbox-check">✓</div>
                    </label>
                  </div>

                  {/* Number of Coats - Beautiful Slider */}
                  <div className="input-field-group coats-selector">
                    <label className="field-label">
                      <span className="label-text">Number of Paint Coats</span>
                      <span className="label-value-large">{formData.numberOfCoats}</span>
                    </label>
                    <div className="coats-slider-container">
                      <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        value={formData.numberOfCoats}
                        onChange={(e) => handleInputChange('numberOfCoats', parseInt(e.target.value))}
                        className="coats-slider"
                        style={{
                          background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(formData.numberOfCoats - 1) / 2 * 100}%, #e5e7eb ${(formData.numberOfCoats - 1) / 2 * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="coats-labels">
                        <span className={formData.numberOfCoats === 1 ? 'active' : ''}>1 Coat</span>
                        <span className={formData.numberOfCoats === 2 ? 'active' : ''}>2 Coats</span>
                        <span className={formData.numberOfCoats === 3 ? 'active' : ''}>3 Coats</span>
                      </div>
                    </div>
                    <p className="input-hint">Most projects need 2 coats for best results</p>
                  </div>
                </div>
              )}

              {/* Step 3: Schedule */}
              {currentStep === 3 && (
                <div className="modal-step">
                  <h3 className="step-title-modal">
                    <span className="step-number">3</span>
                    Schedule & Contractor
                  </h3>
                  
                  <div className="contractor-card-display">
                    <div className="contractor-avatar-large">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="contractor-details-display">
                      <h4>{contractor.companyName}</h4>
                      <div className="contractor-meta-display">
                        <span className={`status-pill ${contractor.availability?.toLowerCase() || 'available'}`}>
                          <span className="status-dot"></span>
                          {contractor.availability || 'Available'}
                        </span>
                        {contractor.hoursPerDay && (
                          <span className="hours-pill">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {contractor.hoursPerDay}h/day
                          </span>
                        )}
                      </div>
                      {contractor.experience && (
                        <p className="experience-text">
                          {contractor.experience} years of experience
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label className="field-label">
                      <span className="label-text">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '18px', height: '18px', marginRight: '8px'}}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Preferred Start Date
                      </span>
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
            </div>

            {/* Navigation */}
            <div className="modal-nav">
              {currentStep > 1 && (
                <button onClick={handleBack} className="btn-modal btn-back">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back
                </button>
              )}
              <button onClick={handleNext} className="btn-modal btn-next">
                {currentStep === totalSteps ? (
                  <>
                    Calculate Timeline
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </>
                ) : (
                  <>
                    Continue
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Results */
          <div className="modal-results">
            {loading ? (
              <div className="modal-loading">
                <div className="spinner-modal"></div>
                <p>Calculating your timeline...</p>
              </div>
            ) : (
              <>
                <div className="result-header-modal">
                  <div className="success-icon-modal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3>Your Project Timeline</h3>
                  <p className="result-subtitle">Here's your estimated completion schedule</p>
                </div>

                <div className="timeline-summary">
                  <div className="summary-card-large">
                    <div className="big-number">{estimate.totalDays}</div>
                    <div className="big-label">Total Days</div>
                  </div>
                  <div className="summary-cards">
                    <div className="summary-card">
                      <div className="card-number">{estimate.workingDays}</div>
                      <div className="card-label">Working Days</div>
                    </div>
                    <div className="summary-card">
                      <div className="card-number">{estimate.totalHours}h</div>
                      <div className="card-label">Total Hours</div>
                    </div>
                  </div>
                </div>

                <div className="date-summary">
                  <div className="date-box">
                    <span className="date-label-sm">Start</span>
                    <span className="date-value-sm">{formatDate(estimate.startDate)}</span>
                  </div>
                  <div className="arrow-sm">→</div>
                  <div className="date-box">
                    <span className="date-label-sm">Complete</span>
                    <span className="date-value-sm">{formatDate(estimate.completionDate)}</span>
                  </div>
                </div>

                <div className="phases-section">
                  <h4>Project Phases</h4>
                  {estimate.phases.map((phase, idx) => (
                    <div key={idx} className="phase-row">
                      <span className="phase-name-sm">{phase.name}</span>
                      <span className="phase-hours-sm">{phase.hours}h</span>
                    </div>
                  ))}
                </div>

                {(estimate.dryingTime > 0 || estimate.weatherDelay > 0) && (
                  <div className="notes-section">
                    <h5>Important Notes</h5>
                    {estimate.dryingTime > 0 && (
                      <p>• Includes {estimate.dryingTime}h drying time between coats</p>
                    )}
                    {estimate.weatherDelay > 0 && (
                      <p>• Weather buffer of {estimate.weatherDelay}h included for exterior work</p>
                    )}
                  </div>
                )}

                <div className="result-actions">
                  <button onClick={onClose} className="btn-modal btn-secondary-result">
                    Close
                  </button>
                  <button 
                    onClick={handleSaveEstimate} 
                    className="btn-modal btn-primary-result"
                    disabled={saveLoading}
                  >
                    {saveLoading ? 'Saving...' : 'Save Estimate'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// export default TimelineEstimatorModal;
export default ProjectTimelineEstimator;