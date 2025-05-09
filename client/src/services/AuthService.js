import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Adjust if needed

const signup = (name, email, password, role) =>
  axios.post(`${API_URL}/signup`, { name, email, password, role });

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const forgotPassword = (email) =>
  axios.post(`${API_URL}/forgot-password`, { email });

const resetPassword = (token, password) =>
  axios.post(`${API_URL}/reset-password/${token}`, { password });

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
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
