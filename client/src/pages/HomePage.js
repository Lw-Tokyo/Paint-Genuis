import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  // Features data
  const features = [
    {
      id: "visualizer",
      title: "Visualizer Gallery",
      description: "See how colors transform your space before you paint. Our interactive visualizer lets you explore a wide range of paint types and finishes applied to real-life room settings.",
      icon: "palette",
      path: "/WallColorVisualizer",
      ctaText: "Try Visualizer",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      id: "estimate",
      title: "Cost Estimator",
      description: "Get precise paint estimates instantly. Our calculator factors in dimensions, paint quality, and labor for accurate budgeting.",
      icon: "calculator",
      path: "/estimate",
      ctaText: "Calculate Costs",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      id: "budget",
      title: "Budget Planner",
      description: "Plan your project finances with confidence. Track expenses, find savings, and stay on budget with our intelligent planner.",
      icon: "wallet",
      path: "/budget",
      ctaText: "Plan Budget",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      id: "coverage",
      title: "Coverage Calculator",
      description: "Never buy too much or too little paint. Our precision calculator determines exactly how much paint you need for perfect coverage.",
      icon: "droplet",
      path: "/coverage-calculator",
      ctaText: "Calculate Coverage",
      gradient: "from-rose-500 to-pink-600"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "Paint Genius saved me hundreds of dollars on my renovation by helping me calculate exactly how much paint I needed.",
      author: "Sarah M.",
      role: "Homeowner",
      avatar: "/testimonial-1.jpg"
    },
    {
      quote: "The color visualizer is incredible! I was able to see exactly how my living room would look before committing to a color.",
      author: "Michael T.",
      role: "Interior Designer",
      avatar: "/testimonial-2.jpg"
    },
    {
      quote: "As a professional painter, the budget planner has transformed how I quote jobs. My clients love the transparency.",
      author: "Chahat Fateh Ali Khan.",
      role: "Professional Painter",
      avatar: "/testimonial-3.jpg"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="brand-container">
            <div className="brand-logo">Paint Genius</div>
            <div className="brand-badge">Premium Tools</div>
          </div>
          <h1 className="hero-title">Design Your Space With <span className="hero-highlight">Confidence</span></h1>
          <p className="hero-subtitle">
            Advanced painting tools powered by AI to visualize, estimate, and execute your perfect project
          </p>
          <div className="hero-cta">
            <Link to="/WallColorVisualizer" className="btn-primary">Try Color Visualizer</Link>
            <Link to="/estimate" className="btn-secondary">Get Cost Estimate</Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Premium Colors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Estimation Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">30K+</span>
              <span className="stat-label">Successful Projects</span>
            </div>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-image"></div>
          <div className="floating-color-card color-card-1">
            <div className="color-dot" style={{ backgroundColor: "#E0F2F1" }}></div>
            <div className="color-dot" style={{ backgroundColor: "#80CBC4" }}></div>
            <div className="color-dot" style={{ backgroundColor: "#26A69A" }}></div>
          </div>
          <div className="floating-color-card color-card-2">
            <div className="color-dot" style={{ backgroundColor: "#EFEBE9" }}></div>
            <div className="color-dot" style={{ backgroundColor: "#D7CCC8" }}></div>
            <div className="color-dot" style={{ backgroundColor: "#A1887F" }}></div>
          </div>
          <div className="floating-color-card color-card-3">
            <div className="color-dot" style={{ backgroundColor: "#ECEFF1" }}></div>
            <div className="color-dot" style={{ backgroundColor: "#B0BEC5" }}></div>
            <div className="color-dot" style={{ backgroundColor: "#78909C" }}></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-badge">PREMIUM TOOLS</span>
          <h2>Everything You Need for a Perfect Paint Job</h2>
          <p>Powerful planning, visualization, and budgeting tools for professional results</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.id}>
              <div className={`feature-icon-container bg-gradient-to-br ${feature.gradient}`}>
                <i className={`icon-${feature.icon}`}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <Link to={feature.path} className="feature-link">
                {feature.ctaText} <i className="icon-arrow-right"></i>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <span className="section-badge">SIMPLE PROCESS</span>
          <h2>Four Steps to Perfect Results</h2>
          <p>Our streamlined approach makes painting projects effortless</p>
        </div>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Choose Your Tool</h3>
            <p>Select the right tool for your specific project needs</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Input Your Details</h3>
            <p>Enter room dimensions or upload photos of your space</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Results</h3>
            <p>Receive visualizations, estimates, or calculations instantly</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Start Your Project</h3>
            <p>Begin painting with confidence and professional guidance</p>
          </div>
        </div>
      </section>

      {/* Feature Showcase - Visualizer */}
      <section className="feature-showcase">
        <div className="showcase-container">
          <div className="showcase-content">
            <span className="section-badge">FEATURED TOOL</span>
            <h2>Visualizer Gallery</h2>
            <p>
              See how colors transform your space before you paint. Our interactive visualizer lets you explore a wide 
              range of paint types and finishes applied to real-life room settings.
            </p>
            <ul className="showcase-features">
              <li>
                <i className="icon-check"></i>
                <span>Preview colors and finishes on living rooms, bedrooms, kitchens, and more</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Compare Standard, Premium, and Luxury paint types side by side</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Make confident design choices with realistic visual simulations</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Share results with contractors and designers</span>
              </li>
            </ul>
            <Link to="/WallColorVisualizer" className="btn-primary">
              Try Color Visualizer
            </Link>
          </div>
          <div className="showcase-image visualizer-showcase"></div>
        </div>
      </section>

      {/* Feature Showcase - Cost Estimator */}
      <section className="feature-showcase reverse">
        <div className="showcase-container">
          <div className="showcase-image cost-estimator-showcase"></div>
          <div className="showcase-content">
            <span className="section-badge">PREMIUM TOOL</span>
            <h2>Intelligent Cost Estimator</h2>
            <p>
              Get precise estimates that consider every aspect of your project. Our algorithm factors in room dimensions, 
              surface conditions, paint quality, and labor costs for accurate budgeting.
            </p>
            <ul className="showcase-features">
              <li>
                <i className="icon-check"></i>
                <span>Calculate materials and labor costs</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Compare different paint quality options</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Factor in primer, multiple coats, and trim</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Generate detailed cost breakdown reports</span>
              </li>
            </ul>
            <Link to="/estimate" className="btn-primary">
              Calculate Your Costs
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <span className="section-badge">USER STORIES</span>
          <h2>What Our Users Say</h2>
          <p>Join thousands of satisfied homeowners and professionals</p>
        </div>
        
        <div className="testimonials-container">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="quote-mark">"</div>
              <p className="testimonial-quote">{testimonial.quote}</p>
              <div className="testimonial-author">
                <div className="author-avatar" style={{ backgroundImage: `url(${testimonial.avatar})` }}></div>
                <div>
                  <p className="author-name">{testimonial.author}</p>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* App Preview Section */}
      <section className="app-preview-section">
        <div className="section-header">
          <span className="section-badge">MULTI-PLATFORM</span>
          <h2>Access Your Tools Anywhere</h2>
          <p>Available on desktop, tablet, and mobile with perfect synchronization</p>
        </div>
        
        <div className="app-preview-container">
          <div className="app-screenshot"></div>
          <div className="app-features">
            <div className="app-feature">
              <div className="app-feature-icon">
                <i className="icon-devices"></i>
              </div>
              <div className="app-feature-content">
                <h3>Multi-Device Access</h3>
                <p>Use Paint Genius on any device with perfect synchronization</p>
              </div>
            </div>
            <div className="app-feature">
              <div className="app-feature-icon">
                <i className="icon-cloud"></i>
              </div>
              <div className="app-feature-content">
                <h3>Cloud Storage</h3>
                <p>Save your projects and access them from anywhere</p>
              </div>
            </div>
            <div className="app-feature">
              <div className="app-feature-icon">
                <i className="icon-share"></i>
              </div>
              <div className="app-feature-content">
                <h3>Easy Sharing</h3>
                <p>Share your visualizations with contractors and family</p>
              </div>
            </div>
            <div className="app-feature">
              <div className="app-feature-icon">
                <i className="icon-updates"></i>
              </div>
              <div className="app-feature-content">
                <h3>Regular Updates</h3>
                <p>Access the latest colors and features with our updates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <span className="section-badge cta-badge">GET STARTED</span>
          <h2>Ready to Transform Your Space?</h2>
          <p>Join thousands of homeowners who have simplified their painting projects with Paint Genius</p>
          <div className="cta-buttons">
            <Link to="/WallColorVisualizer" className="btn-primary btn-large">Start with Color Visualizer</Link>
            <Link to="/estimate" className="btn-outline btn-large">Get Cost Estimate</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;