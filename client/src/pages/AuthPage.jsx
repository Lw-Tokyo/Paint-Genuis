// Updated AuthPage.jsx with ESLint fix

import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AuthPage.css";
import AuthService from "../services/AuthService";
import { UserContext } from "../context/UserContext";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "contractor" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(UserContext);

  // Check if there's any stored email and password from a recent signup
  useEffect(() => {
    const lastEmail = sessionStorage.getItem('lastSignupEmail');
    const lastPassword = sessionStorage.getItem('lastSignupPassword');
    
    if (lastEmail && isLogin) {
      setFormData(prev => ({
        ...prev,
        email: lastEmail,
        password: lastPassword || ''
      }));
      
      // Clear the stored credentials after using them
      sessionStorage.removeItem('lastSignupEmail');
      sessionStorage.removeItem('lastSignupPassword');
    }
    
    // Check URL params for any messages
    const params = new URLSearchParams(location.search);
    const successMsg = params.get('signupSuccess');
    if (successMsg) {
      setMessage(decodeURIComponent(successMsg));
      setIsLogin(true);
    }
  }, [isLogin, location]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setMessage("");
    setFormData({ name: "", email: "", password: "", role: "contractor" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const nameRegex = /^[A-Za-z\s]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    try {
      if (isLogin) {
        const user = await AuthService.login(formData.email, formData.password);
        if (user && user.role) {
          setUser(user);
          navigate(`/${user.role}/dashboard`);
        }
      } else {
        if (!nameRegex.test(formData.name)) {
          setError("Name can only contain letters and spaces.");
          return;
        }

        if (!passwordRegex.test(formData.password)) {
          setError("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.");
          return;
        }

        // Call signup but don't assign to unused variable
        await AuthService.signup(formData.name, formData.email, formData.password, formData.role);
        
        // Store email and password in sessionStorage for auto-fill in login
        sessionStorage.setItem('lastSignupEmail', formData.email);
        sessionStorage.setItem('lastSignupPassword', formData.password);
        
        // Redirect to login with success message
        const successMsg = encodeURIComponent("User created successfully. Please check your email to verify your account.");
        navigate(`/auth?signupSuccess=${successMsg}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h3 className="text-center mb-4">{isLogin ? "Login" : "Sign Up"}</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-control" />
            </div>
          )}

          <div className="mb-3">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="form-control" />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} required className="form-select">
                <option value="contractor">Contractor</option>
                <option value="painter">Painter</option>
                <option value="client">Client</option>
              </select>
            </div>
          )}

          {isLogin && (
            <div className="mb-3 text-end">
              <span className="text-info" onClick={() => navigate("/forgot-password")} style={{ cursor: "pointer" }}>
                Forgot Password?
              </span>
            </div>
          )}

          <button type="submit" className={`btn ${isLogin ? "btn-primary" : "btn-success"} w-100`}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-3">
          {isLogin ? (
            <span onClick={toggleMode} className="text-info" style={{ cursor: "pointer" }}>Sign Up</span>
          ) : (
            <span onClick={toggleMode} className="text-info" style={{ cursor: "pointer" }}>Login</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;