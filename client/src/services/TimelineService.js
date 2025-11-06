// client/src/services/TimelineService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  try {
    // Try to get from user object first
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.token) {
        return user.token;
      }
    }
    // Fallback to direct token
    return localStorage.getItem('token') || '';
  } catch (e) {
    console.error('Error getting token:', e);
    return '';
  }
};

// Create axios instance with auth header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to ALL requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔑 Request headers:', config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ 401 Unauthorized - Token may be expired or invalid');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const TimelineService = {
  /**
   * Calculate project timeline
   */
  calculateTimeline: async (projectData) => {
    try {
      console.log('📤 Sending timeline calculation request:', projectData);
      const response = await axiosInstance.post('/timeline/calculate', projectData);
      console.log('📥 Timeline response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Calculate timeline error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to calculate timeline' };
    }
  },

  /**
   * Save project estimate
   */
  saveEstimate: async (estimateData) => {
    try {
      const response = await axiosInstance.post('/timeline/save', estimateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to save estimate' };
    }
  },

  /**
   * Get user's saved estimates
   */
  getMyEstimates: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(`/timeline/my-estimates?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch estimates' };
    }
  },

  /**
   * Get estimate by ID
   */
  getEstimateById: async (id) => {
    try {
      const response = await axiosInstance.get(`/timeline/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch estimate' };
    }
  },

  /**
   * Update estimate status
   */
  updateEstimateStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(`/timeline/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update estimate status' };
    }
  },

  /**
   * Delete estimate
   */
  deleteEstimate: async (id) => {
    try {
      const response = await axiosInstance.delete(`/timeline/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete estimate' };
    }
  },

  /**
   * Get contractor's received estimates
   */
  getContractorEstimates: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(`/timeline/contractor/received?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch contractor estimates' };
    }
  }
};

export default TimelineService;