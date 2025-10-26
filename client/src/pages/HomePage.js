import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const features = [
    {
      id: "ai-visualizer",
      title: "AI Wall Paint Visualizer",
      description: "Upload your room photo and let AI detect walls, generate masks, and visualize any color in real-time. See your perfect paint choice before you commit.",
      icon: "magic",
      path: "/wallvisualizer",
      ctaText: "Try AI Visualizer",
      gradient: "from-purple-500 to-pink-600",
      featured: true
    },
    {
      id: "visualizer",
      title: "Visualizer Gallery",
      description: "Explore pre-designed room settings with various paint types and finishes. Compare Standard, Premium, and Luxury options instantly.",
      icon: "palette",
      path: "/WallColorVisualizer",
      ctaText: "Browse Gallery",
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
            <div className="brand-badge">AI Powered</div>
          </div>
          <h1 className="hero-title">Design Your Space With <span className="hero-highlight">AI Confidence</span></h1>
          <p className="hero-subtitle">
            Revolutionary AI-powered painting tools that let you visualize, estimate, and execute your perfect project with intelligent precision
          </p>
          <div className="hero-cta">
            <Link to="/wallvisualizer" className="btn-primary">Try AI Visualizer</Link>
            <Link to="/estimate" className="btn-secondary">Get Cost Estimate</Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Premium Colors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">AI</span>
              <span className="stat-label">Powered Detection</span>
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

      {/* AI Visualizer Feature Spotlight */}
      <section className="ai-feature-spotlight">
        <div className="spotlight-container">
          <div className="spotlight-badge-wrapper">
            <span className="section-badge spotlight-badge">🤖 AI POWERED</span>
          </div>
          <div className="spotlight-content">
            <h2 className="spotlight-title">AI Wall Paint Visualizer</h2>
            <p className="spotlight-subtitle">
              Experience the future of interior design with our revolutionary AI-powered wall paint visualizer
            </p>
            
            <div className="ai-process-grid">
              <div className="ai-process-card">
                <div className="ai-process-number">1</div>
                <div className="ai-process-icon">📸</div>
                <h3>Upload Your Photo</h3>
                <p>Simply upload a photo of your room or wall that you want to visualize</p>
              </div>
              
              <div className="ai-process-card">
                <div className="ai-process-number">2</div>
                <div className="ai-process-icon">🎯</div>
                <h3>AI Detection & Masking</h3>
                <p>Our AI intelligently detects walls, furniture, and objects, generating precise masks in seconds</p>
              </div>
              
              <div className="ai-process-card">
                <div className="ai-process-number">3</div>
                <div className="ai-process-icon">🎨</div>
                <h3>Choose Your Color</h3>
                <p>Select from our extensive color palette with Standard, Premium, and Luxury paint types</p>
              </div>
              
              <div className="ai-process-card">
                <div className="ai-process-number">4</div>
                <div className="ai-process-icon">✨</div>
                <h3>Instant Visualization</h3>
                <p>See your wall transformed with realistic paint application in real-time</p>
              </div>
            </div>

            <div className="ai-features-highlight">
              <div className="ai-feature-badge">
                <i className="icon-robot"></i>
                <span>Advanced AI Mask Generation</span>
              </div>
              <div className="ai-feature-badge">
                <i className="icon-zap"></i>
                <span>Real-Time Processing</span>
              </div>
              <div className="ai-feature-badge">
                <i className="icon-layers"></i>
                <span>Smart Object Detection</span>
              </div>
              <div className="ai-feature-badge">
                <i className="icon-palette"></i>
                <span>Unlimited Color Options</span>
              </div>
            </div>

            <div className="spotlight-cta">
              <Link to="/wallvisualizer" className="btn-primary btn-large">
                Try AI Visualizer Now
              </Link>
              <Link to="/WallColorVisualizer" className="btn-outline btn-large">
                View Gallery Instead
              </Link>
            </div>
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
            <div className={`feature-card ${feature.featured ? 'featured-card' : ''}`} key={feature.id}>
              {feature.featured && <div className="featured-ribbon">AI POWERED</div>}
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

      {/* How it Works Section */}
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

      {/* AI Visualizer Detailed Showcase */}
      <section className="feature-showcase ai-showcase">
        <div className="showcase-container">
          <div className="showcase-content">
            <span className="section-badge">AI TECHNOLOGY</span>
            <h2>Live Wall Paint Visualizer</h2>
            <p>
              Our cutting-edge AI technology revolutionizes how you choose paint colors. Upload your own room photo 
              and watch as artificial intelligence automatically detects walls, furniture, and objects with incredible precision.
            </p>
            <ul className="showcase-features">
              <li>
                <i className="icon-check"></i>
                <span>AI-powered wall and object detection with advanced masking algorithms</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Automatic mask generation in seconds to minutes, separating walls from furniture</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Real-time color application from extensive palette with Standard, Premium, and Luxury options</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Realistic visualization showing exactly how colors will look in your actual space</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Compare multiple colors side-by-side to find your perfect match</span>
              </li>
              <li>
                <i className="icon-check"></i>
                <span>Save and share visualizations with contractors, designers, or family</span>
              </li>
            </ul>
            <Link to="/wallvisualizer" className="btn-primary">
              Experience AI Visualizer
            </Link>
          </div>
          <div className="showcase-image ai-visualizer-showcase"></div>
        </div>
      </section>

      {/* Gallery Visualizer Showcase */}
      <section className="feature-showcase reverse">
        <div className="showcase-container">
          <div className="showcase-image visualizer-showcase"></div>
          <div className="showcase-content">
            <span className="section-badge">FEATURED TOOL</span>
            <h2>Visualizer Gallery</h2>
            <p>
              Not ready to upload your own photo? Explore our curated gallery of pre-designed room settings. 
              See how colors transform different spaces with various paint types and finishes.
            </p>
            <ul className="showcase-features">
              <li>
                <i className="icon-check"></i>
                <span>Preview colors on living rooms, bedrooms, kitchens, and more</span>
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
                <span>Get inspired by professionally designed room settings</span>
              </li>
            </ul>
            <Link to="/WallColorVisualizer" className="btn-primary">
              Browse Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Cost Estimator Showcase */}
      <section className="feature-showcase">
        <div className="showcase-container">
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
          <div className="showcase-image cost-estimator-showcase"></div>
        </div>
      </section>

      {/* Testimonials Section */}
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
            <Link to="/wallvisualizer" className="btn-primary btn-large">Try AI Visualizer</Link>
            <Link to="/estimate" className="btn-outline btn-large">Get Cost Estimate</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;