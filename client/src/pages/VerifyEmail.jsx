
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './AuthPage.css';

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
      
        const checkStatus = await AuthService.checkVerificationStatus(token);
        
        if (checkStatus.isVerified) {
          setStatus('success');
          setMessage('Your email has already been verified. You can now log in.');
          
          setTimeout(() => {
            navigate('/auth');
          }, 3000);
          
          return;
        }
        
        const response = await AuthService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message);
        
    
        setTimeout(() => {
          navigate('/auth');
        }, 1000);
        
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Verification failed');
      }
    };

    if (token) {

      setTimeout(() => {
        verifyEmail();
      }, 1500);
    }
  }, [token, navigate]);

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h3 className="text-center mb-4">Email Verification</h3>

        {status === 'verifying' && (
          <div className="alert alert-info">
            <div className="d-flex align-items-center">
              <span className="me-2">Verifying your email...</span>
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <>
            <div className="alert alert-success">{message}</div>
            <div className="text-center mt-4">
              <p>Redirecting to login page in a few seconds...</p>
              <Link to="/auth" className="btn btn-primary">
                Go to Login Now
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