import React from "react";

function Footer() {
  return (
    <footer className="footer-dark text-center py-4 mt-5">
      <div className="container">
        <hr className="footer-line" />
        <p className="mb-2 footer-text">&copy; {new Date().getFullYear()} Paint Genius. All rights reserved.</p>
        <div className="d-flex justify-content-center gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
