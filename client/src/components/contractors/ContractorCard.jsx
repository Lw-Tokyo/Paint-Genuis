// client/src/components/contractors/ContractorCard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ContractorCard.css";

function ContractorCard({ contractor }) {
  const navigate = useNavigate();

  const services = Array.isArray(contractor.services)
    ? contractor.services.join(", ")
    : contractor.services || "—";

  const location =
    typeof contractor.location === "string"
      ? contractor.location
      : contractor.location
      ? `${contractor.location.city || ""}${
          contractor.location.state ? ", " + contractor.location.state : ""
        }`
      : "—";

  const bioPreview =
    contractor.bio && contractor.bio.length > 100
      ? contractor.bio.substring(0, 100) + "..."
      : contractor.bio || "No bio provided.";

  const handleMessage = () => {
    const userId = contractor.user?._id || contractor.user;
    
    if (!userId) {
      console.error("Cannot message contractor: User ID not found", contractor);
      alert("Unable to message this contractor. Please try again later.");
      return;
    }
    
    navigate("/messages", {
      state: { 
        contractorId: userId,
        name: contractor.companyName 
      },
    });
  };

  const rating = contractor.rating || 4.5;
  const fullStars = Math.floor(rating);

  return (
    <div className="contractor-card-luxury">
      {/* Gradient Overlay */}
      <div className="card-gradient-overlay"></div>
      
      {/* Premium Badge */}
      <div className="premium-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        Certified
      </div>

      <div className="card-content">
        {/* Header */}
        <div className="card-header">
          <h3 className="card-title">
            {contractor.companyName || "Unnamed Contractor"}
          </h3>
          
          {/* Rating */}
          <div className="card-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={i < fullStars ? "star star-filled" : "star"}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={i < fullStars ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <span className="rating-number">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Info List */}
        <div className="card-info">
          <div className="info-item">
            <svg className="info-icon info-icon-blue" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="info-text">{location}</span>
          </div>
          
          <div className="info-item">
            <svg className="info-icon info-icon-purple" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <span className="info-text">{services}</span>
          </div>
          
          <div className="info-item">
            <svg className="info-icon info-icon-green" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="info-text">{contractor.experience ?? "—"} years experience</span>
          </div>
          
          <div className="info-item">
            <div className={`status-dot ${contractor.availability === 'Available' ? 'status-dot-available' : 'status-dot-busy'}`}></div>
            <span className={`info-text ${contractor.availability === 'Available' ? 'text-available' : 'text-busy'}`}>
              {contractor.availability ?? "—"}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="card-bio">
          "{bioPreview}"
        </p>

        {/* Action Buttons */}
        <div className="card-actions">
          <Link
            to={`/contractors/${contractor._id}`}
            className="action-btn btn-view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            View
          </Link>

          {contractor.phone && (
            <a
              href={`tel:${contractor.phone}`}
              className="action-btn btn-call"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Call
            </a>
          )}

          <button
            className="action-btn btn-message"
            onClick={handleMessage}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContractorCard;