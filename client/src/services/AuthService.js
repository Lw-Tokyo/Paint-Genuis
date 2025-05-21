//  client/src/services/AuthService.js

import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Adjust if needed

// Helper function to set the token in axios headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Signup
const signup = async (name, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      name,
      email,
      password,
      role,
    });
    
    // Return data with success flag
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    console.error("Signup error:", error);
    
    // If the server actually created the user but had issues with sending email
    // We'll check if there's a specific error code or message that indicates this
    if (error.response?.status === 201 || 
        (error.response?.data && error.response?.data.message?.includes("verification email"))) {
      return {
        data: {
          message: "Account created successfully. Please check your email for verification."
        },
        success: true
      };
    }
    
    // We're throwing the entire error object to get more context
    throw error;
  }
};

// Login
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    if (response.data.token && response.data.user) {
      const userData = {
        _id: response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role,
        token: response.data.token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setAuthToken(response.data.token);

      return userData;
    }

    throw new Error("Invalid login response structure");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Verify Email
const verifyEmail = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/verify/${token}`);
    return response.data;
  } catch (error) {
    console.error("Verification error:", error);
    throw error;
  }
};

// Check if User is Verified
const checkVerificationStatus = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/check-verified/${token}`);
    return response.data;
  } catch (error) {
    console.error("Check verification status error:", error);
    throw error;
  }
};

// Forgot Password
const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Forgot Password error:", error);
    throw error;
  }
};

// Reset Password
const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/${token}`, {
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Reset Password error:", error);
    throw error;
  }
};

// Logout
const logout = () => {
  localStorage.removeItem("user");
  setAuthToken(null);
};

// Get Current User
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    if (user && user.token) {
      setAuthToken(user.token);
    }

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

const AuthService = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  verifyEmail,
  checkVerificationStatus,
};

export default AuthService;