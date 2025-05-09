import React from "react";
import './AboutPage.css'; // We will create this

function AboutPage() {
  return (
    <div className="about-container">
      <h2 className="about-title">About Paint Genius</h2>
      
      <p className="about-text fade-in">
        Founded in 2025, <strong>Paint Genius</strong> was built to help homeowners and businesses easily calculate painting costs and connect with trusted professionals.
      </p>

      <p className="about-text fade-in delay-1">
        Our mission is simple — to make painting projects <span className="highlight">smooth</span>, <span className="highlight">predictable</span>, and <span className="highlight">affordable</span> for everyone.
      </p>

      <p className="about-text fade-in delay-2">
        Whether you're refreshing a single room or managing a full building project, Paint Genius is your smart partner for success!
      </p>
    </div>
  );
}

export default AboutPage;
