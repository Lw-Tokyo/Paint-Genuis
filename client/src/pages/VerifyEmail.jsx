// Updated VerifyEmail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.css';

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Add a slight delay to ensure the "verifying" state is visible
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const response = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        console.error("Verification error:", error);
        
        // If there's an error but we can determine the user is actually verified
        // (by trying to get the user status)
        try {
          // This is an optional endpoint you might want to add that checks if 
          // the user associated with this token is already verified
          const checkStatus = await axios.get(`http://localhost:5000/api/auth/check-verified/${token}`);
          if (checkStatus.data.isVerified) {
            setStatus('success');
            setMessage('Your email has been successfully verified. You can now log in.');
            return;
          }
        } catch (secondError) {
          // Ignore secondary error, proceed with original error
        }
        
        setStatus('error');
        setMessage(error.response?.data?.error || 'Verification failed');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h3 className="text-center mb-4">Email Verification</h3>

        {status === 'verifying' && (
          <div className="alert alert-info">Verifying your email...</div>
        )}
        
        {status === 'success' && (
          <>
            <div className="alert alert-success">{message}</div>
            <div className="text-center mt-4">
              <Link to="/auth" className="btn btn-primary">
                Go to Login
              </Link>
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="alert alert-danger">{message}</div>
            <div className="text-center mt-4">
              <p>If your verification link has expired, you can request a new one:</p>
              <Link to="/resend-verification" className="btn btn-secondary">
                Resend Verification Email
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;