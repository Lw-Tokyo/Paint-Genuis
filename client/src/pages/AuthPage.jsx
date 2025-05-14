// src/pages/AuthPage.jsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import AuthService from "../services/AuthService";
import { UserContext } from "../context/UserContext";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'contractor' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '', role: 'contractor' });
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isLogin) {
        const user = await AuthService.login(formData.email, formData.password);
        
        // Make sure we got a valid user object with role
        if (user && user.role) {
          setUser(user);
          
          // Navigate based on role
          const dashboardPath = `/${user.role}/dashboard`;
          navigate(dashboardPath);
        } else {
          setError("Invalid user data received from server");
        }
      } else {
        await AuthService.signup(formData.name, formData.email, formData.password, formData.role);
        setIsLogin(true); // switch to login after signup
      }
    } catch (err) {
      console.error("Auth error:", err); // For debugging
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="auth-wrapper">
      <div
        className="auth-card"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h3 className="text-center mb-4">{isLogin ? "Login" : "Sign Up"}</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input name="name" type="text" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control" value={formData.password} onChange={handleChange} required />
          </div>

          {/* Only show role selection during Sign Up */}
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select name="role" className="form-select" value={formData.role} onChange={handleChange} required>
                <option value="contractor">Contractor</option>
                <option value="painter">Painter</option>
                <option value="client">Client</option>
              </select>
            </div>
          )}

          {/* Forgot Password link only in login mode */}
          {isLogin && (
            <div className="mb-3 text-end">
              <span className="text-info" style={{ cursor: "pointer" }} onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </span>
            </div>
          )}

          <button type="submit" className={`btn ${isLogin ? "btn-primary" : "btn-success"} w-100`}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        
        <p className="text-center mt-3">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <span onClick={toggleMode} className="text-info" style={{ cursor: "pointer" }}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={toggleMode} className="text-info" style={{ cursor: "pointer" }}>Login</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default AuthPage;