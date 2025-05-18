// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './AuthPage.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const response = await AuthService.forgotPassword(email);
      setMessage(response.message);
    } catch (err) {
      setError(err.error || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h3 className="text-center mb-4">Forgot Password</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!message ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your email address"
              />
              <small className="text-muted">
                We'll send a password reset link to this email
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center mt-3">
              <Link to="/auth" className="text-info">
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center mt-3">
            <Link to="/auth" className="btn btn-outline-info">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;