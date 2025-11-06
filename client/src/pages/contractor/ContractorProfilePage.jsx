import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ContractorService from "../../services/ContractorService";
import ProjectTimelineEstimator from "../../components/ProjectTimelineEstimator";
import "./ContractorProfilePage.css";

function ContractorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEstimator, setShowEstimator] = useState(false);

  useEffect(() => {
    fetchContractor();
  }, [id]);

  const fetchContractor = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await ContractorService.getContractorById(id);
      if (res.success) {
        setContractor(res.data);
      } else {
        setContractor(res);
      }
    } catch (err) {
      console.error("Error fetching contractor:", err);
      setError("Failed to load contractor profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    const userId = contractor?.user?._id || contractor?.user;
    
    if (!userId) {
      alert("Unable to message this contractor.");
      return;
    }
    
    navigate("/messages", {
      state: { 
        contractorId: userId,
        name: contractor.companyName 
      },
    });
  };

  const handleGetEstimate = () => {
    setShowEstimator(true);
  };

  if (loading) {
    return (
      <div className="profile-page-wrapper">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring spinner-ring-animated"></div>
          </div>
          <p className="loading-text">Loading contractor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !contractor) {
    return (
      <div className="profile-page-wrapper">
        <div className="error-container">
          <div className="error-card">
            <h2>Profile Not Found</h2>
            <p>{error || "This contractor profile could not be loaded."}</p>
            <Link to="/contractors" className="back-link">
              ← Back to Contractors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const services = Array.isArray(contractor.services)
    ? contractor.services
    : contractor.services
    ? [contractor.services]
    : [];

  const location =
    typeof contractor.location === "string"
      ? contractor.location
      : contractor.location
      ? `${contractor.location.city || ""}${
          contractor.location.state ? ", " + contractor.location.state : ""
        }`
      : "Not specified";

  const rating = contractor.rating || 4.5;
  const fullStars = Math.floor(rating);

  return (
    <div className="profile-page-wrapper">
      {/* Hero Section */}
      <div className="profile-hero">
        <div className="profile-hero-bg"></div>
        <div className="profile-hero-content">
          <Link to="/contractors" className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Contractors
          </Link>

          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {contractor.profilePicture ? (
                  <img src={contractor.profilePicture} alt={contractor.companyName} />
                ) : (
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
              </div>
              <div className="premium-badge-large">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {contractor.experience || 0}+ Years
              </div>
            </div>

            <div className="profile-title-section">
              <h1 className="profile-title">{contractor.companyName}</h1>
              
              <div className="profile-rating">
                <div className="stars-large">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={i < fullStars ? "star-large star-large-filled" : "star-large"}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={i < fullStars ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <span className="rating-number-large">
                  {rating.toFixed(1)} ({contractor.reviewCount || 0} reviews)
                </span>
              </div>

              <div className="profile-quick-info">
                <div className="quick-info-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {location}
                </div>
                <div className="quick-info-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {contractor.hoursPerDay || 8}h/day • {contractor.workSpeed || 40} sq ft/h
                </div>
                <div className="quick-info-item">
                  <div className={`status-dot-large ${contractor.availability === 'Available' ? 'status-available' : 'status-busy'}`}></div>
                  {contractor.availability || "Not specified"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <div className="content-grid">
          {/* Left Column - Main Info */}
          <div className="content-main">
            {/* About Section */}
            <div className="profile-section">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z"/>
                  <path d="M12 11v5M12 8h.01"/>
                </svg>
                About
              </h2>
              <p className="section-text">
                {contractor.bio || "No biography provided."}
              </p>
            </div>

            {/* Services Section */}
            <div className="profile-section">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                Services Offered
              </h2>
              <div className="services-grid">
                {services.length > 0 ? (
                  services.map((service, idx) => (
                    <div key={idx} className="service-tag">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {service}
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No services listed.</p>
                )}
              </div>
            </div>

            {/* Work Details Section */}
            <div className="profile-section">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Work Details
              </h2>
              <div className="work-details-grid">
                <div className="detail-card">
                  <div className="detail-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="detail-info">
                    <span className="detail-label">Working Hours</span>
                    <span className="detail-value">{contractor.hoursPerDay || 8} hours/day</span>
                  </div>
                </div>
                <div className="detail-card">
                  <div className="detail-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  </div>
                  <div className="detail-info">
                    <span className="detail-label">Work Speed</span>
                    <span className="detail-value">{contractor.workSpeed || 40} sq ft/hour</span>
                  </div>
                </div>
                {contractor.hourlyRate > 0 && (
                  <div className="detail-card">
                    <div className="detail-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <div className="detail-info">
                      <span className="detail-label">Hourly Rate</span>
                      <span className="detail-value">${contractor.hourlyRate}/hour</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Portfolio Section */}
            {contractor.portfolio && contractor.portfolio.length > 0 && (
              <div className="profile-section">
                <h2 className="section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  Portfolio
                </h2>
                <div className="portfolio-grid">
                  {contractor.portfolio.map((item, idx) => (
                    <div key={idx} className="portfolio-item">
                      <img src={item.imageUrl} alt={item.title || `Project ${idx + 1}`} />
                      {item.title && (
                        <div className="portfolio-overlay">
                          <h4>{item.title}</h4>
                          {item.description && <p>{item.description}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact Card */}
          <div className="content-sidebar">
            <div className="contact-card">
              <h3 className="contact-title">Get Started</h3>
              
              <div className="contact-actions">
                <button onClick={handleGetEstimate} className="contact-btn btn-estimate-large">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Get Project Timeline
                </button>

                <button onClick={handleMessage} className="contact-btn btn-message-large">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Send Message
                </button>

                {contractor.phone && (
                  <a href={`tel:${contractor.phone}`} className="contact-btn btn-call-large">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    Call Now
                  </a>
                )}
              </div>

              <div className="contact-info">
                {contractor.email && (
                  <div className="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>{contractor.email}</span>
                  </div>
                )}

                {contractor.phone && (
                  <div className="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>{contractor.phone}</span>
                  </div>
                )}

                {contractor.website && (
                  <div className="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <a href={contractor.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="info-card">
              <h3 className="info-card-title">Additional Information</h3>
              <div className="info-list">
                <div className="info-list-item">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">
                    {contractor.createdAt ? new Date(contractor.createdAt).getFullYear() : "2024"}
                  </span>
                </div>
                <div className="info-list-item">
                  <span className="info-label">Response Time</span>
                  <span className="info-value">Within 24 hours</span>
                </div>
                <div className="info-list-item">
                  <span className="info-label">Availability</span>
                  <span className={`info-value ${contractor.availability === 'Available' ? 'text-success' : 'text-warning'}`}>
                    {contractor.availability || "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Estimator Modal */}
      {showEstimator && (
        <ProjectTimelineEstimator
          contractor={contractor}
          onClose={() => setShowEstimator(false)}
        />
      )}
    </div>
  );
}

export default ContractorProfilePage;