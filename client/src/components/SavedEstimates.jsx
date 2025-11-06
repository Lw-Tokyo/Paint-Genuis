// client/src/components/SavedEstimates.jsx
import React, { useState, useEffect } from 'react';
import TimelineService from '../services/TimelineService';
import './SavedEstimates.css';

const SavedEstimates = () => {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEstimate, setSelectedEstimate] = useState(null);

  useEffect(() => {
    fetchEstimates();
  }, []);

  const fetchEstimates = async () => {
    try {
      setLoading(true);
      const response = await TimelineService.getMyEstimates();
      if (response.success) {
        setEstimates(response.data);
      }
    } catch (err) {
      console.error('Error fetching estimates:', err);
      setError('Failed to load estimates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this estimate?')) return;

    try {
      await TimelineService.deleteEstimate(id);
      setEstimates(estimates.filter(e => e._id !== id));
      if (selectedEstimate?._id === id) {
        setSelectedEstimate(null);
      }
    } catch (err) {
      console.error('Error deleting estimate:', err);
      alert('Failed to delete estimate');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="saved-estimates-loading">
        <div className="spinner"></div>
        <p>Loading your estimates...</p>
      </div>
    );
  }

  if (error) {
    return <div className="saved-estimates-error">{error}</div>;
  }

  if (estimates.length === 0) {
    return (
      <div className="saved-estimates-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <h3>No Saved Estimates</h3>
        <p>Get started by requesting a timeline estimate from a contractor</p>
      </div>
    );
  }

  return (
    <div className="saved-estimates-container">
      <div className="estimates-header">
        <h2>My Saved Estimates</h2>
        <span className="estimates-count">{estimates.length} estimate{estimates.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="estimates-grid">
        {estimates.map((estimate) => (
          <div 
            key={estimate._id} 
            className={`estimate-card ${selectedEstimate?._id === estimate._id ? 'active' : ''}`}
            onClick={() => setSelectedEstimate(estimate)}
          >
            <div className="estimate-card-header">
              <div className="contractor-info">
                <h3>{estimate.contractor?.companyName || 'Unknown Contractor'}</h3>
                <span className="estimate-date">
                  {formatDate(estimate.createdAt)}
                </span>
              </div>
              <span className={`status-badge ${estimate.status}`}>
                {estimate.status}
              </span>
            </div>

            <div className="estimate-card-body">
              <div className="estimate-stat">
                <span className="stat-label">Project Type</span>
                <span className="stat-value">
                  {estimate.projectDetails.projectType === 'interior' ? '🏠 Interior' : '🏡 Exterior'}
                </span>
              </div>
              <div className="estimate-stat">
                <span className="stat-label">Total Days</span>
                <span className="stat-value">{estimate.timeline.totalDays} days</span>
              </div>
              <div className="estimate-stat">
                <span className="stat-label">Working Hours</span>
                <span className="stat-value">{estimate.timeline.totalHours}h</span>
              </div>
              {estimate.estimatedCost && (
                <div className="estimate-stat">
                  <span className="stat-label">Estimated Cost</span>
                  <span className="stat-value cost">${estimate.estimatedCost.laborCost}</span>
                </div>
              )}
            </div>

            <div className="estimate-card-footer">
              <button 
                className="btn-view"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEstimate(estimate);
                }}
              >
                View Details
              </button>
              <button 
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(estimate._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedEstimate && (
        <div className="estimate-modal-overlay" onClick={() => setSelectedEstimate(null)}>
          <div className="estimate-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEstimate(null)}>×</button>
            
            <h2>Estimate Details</h2>
            
            <div className="modal-section">
              <h3>Contractor</h3>
              <p><strong>{selectedEstimate.contractor?.companyName}</strong></p>
              <p>Work Speed: {selectedEstimate.contractor?.workSpeed} sq ft/hour</p>
              <p>Hours per Day: {selectedEstimate.contractor?.hoursPerDay}h</p>
            </div>

            <div className="modal-section">
              <h3>Project Details</h3>
              <p>Type: {selectedEstimate.projectDetails.projectType}</p>
              <p>Rooms: {selectedEstimate.projectDetails.numberOfRooms}</p>
              <p>Room Size: {selectedEstimate.projectDetails.roomSize} sq ft</p>
              <p>Wall Condition: {selectedEstimate.projectDetails.wallCondition}</p>
              <p>Coats: {selectedEstimate.projectDetails.numberOfCoats}</p>
            </div>

            <div className="modal-section">
              <h3>Timeline</h3>
              <p>Start: {formatDate(selectedEstimate.timeline.startDate)}</p>
              <p>Completion: {formatDate(selectedEstimate.timeline.completionDate)}</p>
              <p>Total Days: {selectedEstimate.timeline.totalDays}</p>
              <p>Working Days: {selectedEstimate.timeline.workingDays}</p>
              <p>Total Hours: {selectedEstimate.timeline.totalHours}h</p>
            </div>

            <div className="modal-section">
              <h3>Phases</h3>
              {selectedEstimate.timeline.phases.map((phase, idx) => (
                <div key={idx} className="phase-item">
                  <span>{phase.name}</span>
                  <span>{phase.hours}h ({phase.percentage}%)</span>
                </div>
              ))}
            </div>

            {selectedEstimate.estimatedCost && (
              <div className="modal-section">
                <h3>Cost Estimate</h3>
                <p>Labor Cost: ${selectedEstimate.estimatedCost.laborCost}</p>
                <p>Hourly Rate: ${selectedEstimate.estimatedCost.hourlyRate}/hour</p>
              </div>
            )}

            {selectedEstimate.notes && (
              <div className="modal-section">
                <h3>Notes</h3>
                <p>{selectedEstimate.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedEstimates;