// src/services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Adjust if needed

const signup = (name, email, password, role) => 
  axios.post(`${API_URL}/signup`, { name, email, password, role });

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
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set the token in axios default headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return userData;
    }
    
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
 
const forgotPassword = (email) =>
  axios.post(`${API_URL}/forgot-password`, { email });

const resetPassword = (token, password) =>
  axios.post(`${API_URL}/reset-password/${token}`, { password });

const logout = () => {
  localStorage.removeItem('user');
  // Remove the token from axios headers
  delete axios.defaults.headers.common['Authorization'];
};

const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    
    // Set the token in axios default headers for future requests
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
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
};

export default AuthService;