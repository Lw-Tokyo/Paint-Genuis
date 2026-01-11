import React, { useState } from "react";
import './ContactPage.css';
import axios from 'axios'; 

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setStatus(''), 5000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-page-content">
        {/* Page Header */}
        <header className="contact-header contact-slide-in-down">
          <span className="contact-header-icon">📧</span>
          <h1 className="contact-page-title">
            <span className="contact-gradient-text">Contact Us</span>
          </h1>
          <p className="contact-page-subtitle">Have questions? Need support? We're here to help!</p>
        </header>

        {/* Contact Form Card */}
        <div className="contact-glass-card contact-slide-in-up">
          {/* Status Messages */}
          {status === 'success' && (
            <div className="contact-alert contact-alert-success contact-fade-in">
              <span className="contact-alert-icon">✅</span>
              <span>Message sent successfully! We'll get back to you soon.</span>
            </div>
          )}

          {status === 'error' && (
            <div className="contact-alert contact-alert-error contact-fade-in">
              <span className="contact-alert-icon">❌</span>
              <span>Failed to send message. Please try again.</span>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-input-group">
              <label htmlFor="name" className="contact-label">
                <span className="contact-label-icon">👤</span>
                Your Name
              </label>
              <input 
                type="text" 
                className="contact-input" 
                id="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder="Enter your full name"
                required 
              />
            </div>

            <div className="contact-input-group">
              <label htmlFor="email" className="contact-label">
                <span className="contact-label-icon">📧</span>
                Email Address
              </label>
              <input 
                type="email" 
                className="contact-input" 
                id="email" 
                value={formData.email} 
                onChange={handleChange}
                placeholder="your.email@example.com"
                required 
              />
            </div>

            <div className="contact-input-group">
              <label htmlFor="message" className="contact-label">
                <span className="contact-label-icon">💬</span>
                Your Message
              </label>
              <textarea 
                className="contact-textarea" 
                id="message" 
                rows="6" 
                value={formData.message} 
                onChange={handleChange}
                placeholder="Tell us what's on your mind..."
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="contact-submit-button" 
              disabled={isSubmitting}
            >
              <span className="contact-button-icon">
                {isSubmitting ? '⏳' : '📨'}
              </span>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Info Cards */}
        <div className="contact-info-grid contact-slide-in-up-delay">
          <div className="contact-info-card">
            <span className="contact-info-icon">📍</span>
            <h3 className="contact-info-title">Visit Us</h3>
            <p className="contact-info-text">Islamabad<br/>Pakistan</p>
          </div>

          <div className="contact-info-card">
            <span className="contact-info-icon">📧</span>
            <h3 className="contact-info-title">Email Us</h3>
            <p className="contact-info-text">support@paintgenius.com<br/>info@paintgenius.com</p>
          </div>

          <div className="contact-info-card">
            <span className="contact-info-icon">🕐</span>
            <h3 className="contact-info-title">Working Hours</h3>
            <p className="contact-info-text">Mon - Fri: 9AM - 6PM<br/>Sat - Sun: 10AM - 4PM</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="contact-faq-section contact-slide-in-up-delay-2">
          <h2 className="contact-faq-title">
            <span className="contact-gradient-text">Frequently Asked Questions</span>
          </h2>
          <div className="contact-faq-grid">
            <div className="contact-faq-item">
              <div className="contact-faq-question">
                <span className="contact-faq-icon">❓</span>
                How quickly will I get a response?
              </div>
              <div className="contact-faq-answer">
                We typically respond within 24 hours during business days.
              </div>
            </div>

            <div className="contact-faq-item">
              <div className="contact-faq-question">
                <span className="contact-faq-icon">❓</span>
                Can I schedule a consultation?
              </div>
              <div className="contact-faq-answer">
                Yes! Mention your preferred date and time in your message.
              </div>
            </div>

            <div className="contact-faq-item">
              <div className="contact-faq-question">
                <span className="contact-faq-icon">❓</span>
                Do you offer emergency support?
              </div>
              <div className="contact-faq-answer">
                For urgent matters, please call our hotline or mark your message as urgent.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;