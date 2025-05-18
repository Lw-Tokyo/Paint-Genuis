import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  // Features data
  const features = [
    {
      id: "visualizer",
      title: "Wall Color Visualizer",
      description: "See how colors transform your space before you paint. Our premium visualizer lets you experiment with thousands of colors in realistic room settings.",
      icon: "palette",
      path: "/WallColorVisualizer",
      ctaText: "Explore Colors",
      image: "/visualizer-preview.JPG"
    },
    {
      id: "estimate",
      title: "Cost Estimator",
      description: "Get precise paint cost estimates in seconds. Our smart calculator considers room dimensions, paint quality, and labor to provide accurate budgeting.",
      icon: "calculator",
      path: "/estimate",
      ctaText: "Calculate Costs",
      image: "/cost-estimate-preview.JPG"
    },
    {
      id: "budget",
      title: "Budget Planner",
      description: "Plan your painting project finances with confidence. Our budget planner helps you track expenses and find savings opportunities.",
      icon: "wallet",
      path: "/budget",
      ctaText: "Plan Budget",
      image: "/budget-preview.JPG"
    },
    {
      id: "coverage",
      title: "Coverage Calculator",
      description: "Never buy too much or too little paint again. Our coverage calculator determines exactly how much paint you need for any project.",
      icon: "droplet",
      path: "/coverage-calculator",
      ctaText: "Calculate Coverage",
      image: "/coverage-preview.JPG"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "Paint Genius saved me hundreds of dollars on my renovation by helping me calculate exactly how much paint I needed.",
      author: " Sarah M.",
      role: " Homeowner",
      avatar: "/testimonial-1.jpg"
    },
    {
      quote: "The color visualizer is incredible! I was able to see exactly how my living room would look before committing to a color.",
      author: "Michael T.",
      role: " Interior Designer",
      avatar: "/testimonial-2.jpg"
    },
    {
      quote: "As a professional painter, the budget planner has transformed how I quote jobs. My clients love the transparency.",
      author: " Chahat Fateh Ali Khan.",
      role: " Professional Painter",
      avatar: "/testimonial-3.jpg"
    }
  ];

  // Color palette samples
  const colorPalettes = [
    { name: "Coastal Breeze", colors: ["#E0F2F1", "#80CBC4", "#26A69A", "#00796B", "#004D40"] },
    { name: "Urban Elegance", colors: ["#ECEFF1", "#B0BEC5", "#78909C", "#546E7A", "#263238"] },
    { name: "Warm Neutrals", colors: ["#EFEBE9", "#D7CCC8", "#A1887F", "#795548", "#3E2723"] }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="brand-logo">Paint Genius</div>
          <h1 className="hero-title">Transform Your Space With <span className="highlight">Confidence</span></h1>
          <p className="hero-subtitle">
            Premium painting tools to visualize, estimate, and plan your perfect project with precision
          </p>
          <div className="hero-cta">
            <Link to="/WallColorVisualizer" className="btn btn-primary">Try Color Visualizer</Link>
            <Link to="/estimate" className="btn btn-secondary">Get Cost Estimate</Link>
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
          <div className="floating-color-card color-card-1"></div>
          <div className="floating-color-card color-card-2"></div>
          <div className="floating-color-card color-card-3"></div>
        </div>
      </section>

      {/* Color Palette Showcase */}
      <section className="color-palette-section">
        <div className="section-header">
          <h2>Curated Color Collections</h2>
          <p>Explore designer-selected color palettes for perfect harmony</p>
        </div>
        
        <div className="color-palettes-container">
          {colorPalettes.map((palette, index) => (
            <div className="color-palette-card" key={index}>
              <h3>{palette.name}</h3>
              <div className="color-swatches">
                {palette.colors.map((color, colorIndex) => (
                  <div 
                    className="color-swatch" 
                    key={colorIndex} 
                    style={{ backgroundColor: color }}
                  >
                    <span className="color-code">{color}</span>
                  </div>
                ))}
              </div>
              <Link to={`/WallColorVisualizer?palette=${palette.name.toLowerCase().replace(' ', '-')}`} className="palette-link">
                Try this palette
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Premium Tools for Perfect Results</h2>
          <p>Everything you need to plan, visualize, and budget your painting project</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.id}>
              <div className="feature-icon">
                <i className={`icon-${feature.icon}`}></i>
              </div>
              <div className="feature-preview" style={{ backgroundImage: `url(${feature.image})` }}>
                <div className="feature-overlay"></div>
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
          <h2>How Paint Genius Works</h2>
          <p>Four simple steps to your perfect paint project</p>
        </div>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Choose Your Tool</h3>
            <p>Select from our premium suite of painting tools based on your project needs</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Input Your Details</h3>
            <p>Enter your room dimensions, preferences, or upload photos</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Results</h3>
            <p>Receive accurate visualizations, cost estimates, or coverage calculations</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Start Your Project</h3>
            <p>Begin painting with confidence using our detailed recommendations</p>
          </div>
        </div>
      </section>

      {/* Feature Showcase - Visualizer */}
      <section className="feature-showcase">
        <div className="showcase-container">
          <div className="showcase-content">
            <span className="showcase-badge">FEATURED TOOL</span>
            <h2>Premium Wall Color Visualizer</h2>
            <p>
              Our most popular tool transforms how you select colors. Upload photos of your own rooms or use our 
              gallery of spaces to see exactly how colors will look on your walls.
            </p>
            <ul className="showcase-features">
              <li>
                <i className="icon-check"></i>
                <span>View thousands of premium paint colors</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Adjust lighting and brightness settings</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Save and compare different color schemes</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Share results with friends and designers</span>
              </li>
            </ul>
            <Link to="/WallColorVisualizer" className="btn btn-primary">
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
            <span className="showcase-badge">PREMIUM TOOL</span>
            <h2>Intelligent Cost Estimator</h2>
            <p>
              Get precise cost estimates that consider every aspect of your project. Our algorithm factors in room dimensions, 
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
            <Link to="/estimate" className="btn btn-primary">
              Calculate Your Costs
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
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
          <h2>All Your Painting Tools in One Place</h2>
          <p>Accessible on any device, anytime you need them</p>
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
                <p>Use Paint Genius on desktop, tablet, or mobile with perfect synchronization</p>
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
                <p>Share your visualizations and estimates with contractors and family</p>
              </div>
            </div>
            <div className="app-feature">
              <div className="app-feature-icon">
                <i className="icon-updates"></i>
              </div>
              <div className="app-feature-content">
                <h3>Regular Updates</h3>
                <p>Access the latest colors and features with our frequent updates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Transform Your Space?</h2>
          <p>Join thousands of homeowners who have simplified their painting projects with Paint Genius</p>
          <div className="cta-buttons">
            <Link to="/WallColorVisualizer" className="btn btn-primary">Start with Color Visualizer</Link>
            <Link to="/estimate" className="btn btn-outline">Get Cost Estimate</Link>
          </div>
        </div>
      </section>

      {/* Footer Quick Links */}
      <section className="footer-links">
        <div className="footer-links-container">
          <div className="footer-link-group">
            <h3>Tools</h3>
            <ul>
              <li><Link to="/visualizer">Wall Color Visualizer</Link></li>
              <li><Link to="/estimate">Cost Estimator</Link></li>
              <li><Link to="/budget">Budget Planner</Link></li>
              <li><Link to="/coverage">Coverage Calculator</Link></li>
            </ul>
          </div>
          <div className="footer-link-group">
            <h3>Resources</h3>
            <ul>
              <li><Link to="/guides">Painting Guides</Link></li>
              <li><Link to="/color-trends">Color Trends</Link></li>
              <li><Link to="/techniques">Painting Techniques</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          <div className="footer-link-group">
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="footer-link-group">
            <h3>Connect</h3>
            <div className="social-links">
              <a href="https://facebook.com" className="social-link" aria-label="Facebook">
                <i className="icon-facebook"></i>
              </a>
              <a href="https://instagram.com" className="social-link" aria-label="Instagram">
                <i className="icon-instagram"></i>
              </a>
              <a href="https://pinterest.com" className="social-link" aria-label="Pinterest">
                <i className="icon-pinterest"></i>
              </a>
              <a href="https://youtube.com" className="social-link" aria-label="YouTube">
                <i className="icon-youtube"></i>
              </a>
            </div>
            <div className="newsletter">
              <h4>Get inspiration in your inbox</h4>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email address" />
                <button type="submit">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>© {new Date().getFullYear()} Paint Genius. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;