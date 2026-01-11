import React from "react";
import './AboutPage.css'; 

function AboutPage() {
  return (
    <div className="about-page-wrapper">
      <div className="about-page-content">
        {/* Page Header */}
        <header className="about-header about-slide-in-down">
          <span className="about-header-icon">🎨</span>
          <h1 className="about-page-title">
            <span className="about-gradient-text">About Paint Genius</span>
          </h1>
          <p className="about-page-subtitle">Your trusted partner for painting projects</p>
        </header>

        {/* Main Content Card */}
        <div className="about-glass-card about-slide-in-up">
          <div className="about-content-section about-fade-in">
            <div className="about-icon-wrapper">
              <span className="about-section-icon">🏢</span>
            </div>
            <p className="about-text">
              Founded in <span className="about-highlight">2025</span>, <strong>Paint Genius</strong> was built to help homeowners and businesses easily calculate painting costs and connect with trusted professionals.
            </p>
          </div>

          <div className="about-content-section about-fade-in about-delay-1">
            <div className="about-icon-wrapper">
              <span className="about-section-icon">🎯</span>
            </div>
            <p className="about-text">
              Our mission is simple — to make painting projects <span className="about-highlight">smooth</span>, <span className="about-highlight">predictable</span>, and <span className="about-highlight">affordable</span> for everyone.
            </p>
          </div>

          <div className="about-content-section about-fade-in about-delay-2">
            <div className="about-icon-wrapper">
              <span className="about-section-icon">✨</span>
            </div>
            <p className="about-text">
              Whether you're refreshing a single room or managing a full building project, Paint Genius is your smart partner for success!
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="about-features-grid about-slide-in-up-delay">
          <div className="about-feature-card">
            <span className="about-feature-icon">🧮</span>
            <h3 className="about-feature-title">Smart Calculations</h3>
            <p className="about-feature-text">Accurate cost estimates and paint coverage calculations at your fingertips</p>
          </div>

          <div className="about-feature-card">
            <span className="about-feature-icon">👷</span>
            <h3 className="about-feature-title">Trusted Contractors</h3>
            <p className="about-feature-text">Connect with verified professional painters in your area</p>
          </div>

          <div className="about-feature-card">
            <span className="about-feature-icon">💰</span>
            <h3 className="about-feature-title">Budget Friendly</h3>
            <p className="about-feature-text">Plan your project within your budget and avoid surprises</p>
          </div>

          <div className="about-feature-card">
            <span className="about-feature-icon">📱</span>
            <h3 className="about-feature-title">Easy to Use</h3>
            <p className="about-feature-text">Simple, intuitive interface designed for everyone</p>
          </div>

          <div className="about-feature-card">
            <span className="about-feature-icon">⚡</span>
            <h3 className="about-feature-title">Instant Results</h3>
            <p className="about-feature-text">Get immediate estimates and recommendations</p>
          </div>

          <div className="about-feature-card">
            <span className="about-feature-icon">🤝</span>
            <h3 className="about-feature-title">Customer Support</h3>
            <p className="about-feature-text">Dedicated support to help you every step of the way</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="about-stats-grid about-slide-in-up-delay-2">
          <div className="about-stat-card">
            <div className="about-stat-icon">🎨</div>
            <div className="about-stat-value about-gradient-text">1000+</div>
            <div className="about-stat-label">Projects Completed</div>
          </div>

          <div className="about-stat-card">
            <div className="about-stat-icon">⭐</div>
            <div className="about-stat-value about-gradient-text">4.9/5</div>
            <div className="about-stat-label">Average Rating</div>
          </div>

          <div className="about-stat-card">
            <div className="about-stat-icon">👷</div>
            <div className="about-stat-value about-gradient-text">500+</div>
            <div className="about-stat-label">Verified Contractors</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;